import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
} from "./types.js";

export interface EigenAIClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export class EigenAIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(options: EigenAIClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || "https://eigenai.eigencloud.xyz/v1";
  }

  async chatCompletions(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const url = `${this.baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `EigenAI API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return (await response.json()) as ChatCompletionResponse;
  }

  async *chatCompletionsStream(
    request: ChatCompletionRequest
  ): AsyncGenerator<string, void, unknown> {
    const url = `${this.baseUrl}/chat/completions`;
    const streamRequest = { ...request, stream: true };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(streamRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `EigenAI API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              return;
            }
            if (data) {
              yield data;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

