import { EigenAIClient } from "./index.js";
import type { Message } from "./index.js";

// Initialize the client with your API key
const client = new EigenAIClient({
  apiKey: process.env.EIGEN_API_KEY || "your-api-key-here",
});

// Example 1: Simple chat completion
async function simpleChat() {
  const messages: Message[] = [
    { role: "user", content: "Write a story about programming" },
  ];

  const response = await client.chatCompletions({
    model: "gpt-oss-120b-f16",
    messages,
    max_tokens: 120,
    seed: 42,
  });

  console.log("Response:", response.choices[0]?.message.content);
  console.log("Usage:", response.usage);
}

// Example 2: Streaming chat completion
async function streamingChat() {
  const messages: Message[] = [
    { role: "user", content: "Tell me a joke" },
  ];

  console.log("Streaming response:");
  for await (const chunk of client.chatCompletionsStream({
    model: "gpt-oss-120b-f16",
    messages,
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
  console.log("\n");
}

// Example 3: Function calling
async function functionCalling() {
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
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
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

  const message = response.choices[0]?.message;
  if (message?.tool_calls) {
    console.log("Tool calls:", message.tool_calls);
  } else {
    console.log("Response:", message?.content);
  }
}

// Run examples
if (import.meta.main) {
  try {
    await simpleChat();
    // await streamingChat();
    // await functionCalling();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

