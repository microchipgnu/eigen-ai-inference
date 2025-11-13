import { generateText, streamObject, streamText} from "ai"
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const provider = createOpenAICompatible({
  name: "eigen",
  apiKey: process.env.EIGEN_API_KEY,
  baseURL: 'https://eigenai-sepolia.eigencloud.xyz/v1',
  includeUsage: true, // Include usage information in streaming responses
});

const stream = streamText({
  model: provider("gpt-oss-120b-f16"),
  messages: [
    { role: 'user', content: `
    You are a helpful assistant that can answer questions and help with tasks.
    You are currently in the context of the following conversation:
      The user is asking you to help them with a task.
    `},
  ],
  maxOutputTokens: 4000,
  providerOptions: {
    openai: {
      max_tokens: 4000,
      seed: 112212,
    }
  }
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}