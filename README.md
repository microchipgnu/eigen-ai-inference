# eigen-ai-inference

A simple TypeScript SDK for EigenAI inference API.

## Installation

```bash
bun install
```

## Usage

### Basic Setup

```typescript
import { EigenAIClient } from "./index.js";

const client = new EigenAIClient({
  apiKey: process.env.EIGEN_API_KEY || "your-api-key-here",
});
```

### Simple Chat Completion

```typescript
import type { Message } from "./index.js";

const messages: Message[] = [
  { role: "user", content: "Write a story about programming" },
];

const response = await client.chatCompletions({
  model: "gpt-oss-120b-f16",
  messages,
  max_tokens: 120,
  seed: 42,
});

console.log(response.choices[0]?.message.content);
```

### Streaming Chat Completion

```typescript
for await (const chunk of client.chatCompletionsStream({
  model: "gpt-oss-120b-f16",
  messages: [{ role: "user", content: "Tell me a joke" }],
  max_tokens: 100,
})) {
  try {
    const data = JSON.parse(chunk);
    const content = data.choices?.[0]?.delta?.content;
    if (content) {
      process.stdout.write(content);
    }
  } catch {
    // Skip invalid JSON
  }
}
```

### Function Calling

```typescript
const tools = [
  {
    type: "function" as const,
    function: {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object" as const,
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
        },
        required: ["location"],
      },
    },
  },
];

const response = await client.chatCompletions({
  model: "gpt-oss-120b-f16",
  messages: [
    { role: "user", content: "What is the weather like in Boston today?" },
  ],
  tools,
  tool_choice: "auto",
});
```

## Supported Parameters

- `model`: Model ID (e.g., "gpt-oss-120b-f16")
- `messages`: Array of conversation messages
- `max_tokens`: Maximum tokens to generate
- `seed`: Seed for deterministic outputs
- `stream`: Enable streaming responses
- `temperature`: Sampling temperature (0-2)
- `top_p`: Nucleus sampling parameter
- `logprobs`: Return log probabilities
- `frequency_penalty`: Frequency penalty (-2.0 to 2.0)
- `presence_penalty`: Presence penalty (-2.0 to 2.0)
- `tools`: Array of function tools
- `tool_choice`: Tool choice strategy ("auto", "required", "none", or specific tool)

## Running Examples

```bash
bun run example.ts
```

Make sure to set your `EIGEN_API_KEY` environment variable:

```bash
export EIGEN_API_KEY=your-api-key-here
bun run example.ts
```
