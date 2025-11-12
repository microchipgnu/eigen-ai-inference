export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Message {
  role: MessageRole;
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface FunctionTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, {
        type: string;
        description?: string;
        enum?: string[];
      }>;
      required?: string[];
    };
  };
}

export type ToolChoice = "auto" | "required" | "none" | {
  type: "function";
  function: {
    name: string;
  };
};

export interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  max_tokens?: number;
  seed?: number;
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  logprobs?: boolean;
  frequency_penalty?: number;
  presence_penalty?: number;
  tools?: FunctionTool[];
  tool_choice?: ToolChoice;
}

export interface Usage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
  prompt_tokens_details?: {
    cached_tokens?: number;
    audio_tokens?: number;
  };
  completion_tokens_details?: {
    reasoning_tokens?: number;
    audio_tokens?: number;
    accepted_prediction_tokens?: number;
    rejected_prediction_tokens?: number;
  };
}

export interface ChatCompletionChoice {
  index: number;
  message: Message;
  finish_reason: "stop" | "length" | "tool_calls" | null;
}

export interface ChatCompletionResponse {
  id: string;
  created: number;
  model: string;
  system_fingerprint: string;
  object: "chat.completion";
  usage: Usage;
  choices: ChatCompletionChoice[];
  signature?: string;
}

