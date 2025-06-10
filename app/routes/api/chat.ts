import { google } from "@ai-sdk/google";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Message, smoothStream, streamText } from "ai";

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    const { messages, model }: { messages: Message[]; model: string } =
      await request.json();

    const systemMessage =
      "You are a helpful assistant. Strictly adhere to LaTeX formatting:\n" +
      "- Inline math: Always use \\( content \\). Example: \\( E=mc^2 \\).\n" +
      "- Display math: Always use $$ content $$.\n" +
      "- Never use single dollar signs ($) for math.\n" +
      "- Never use plain parentheses for math variables (e.g., (a)); always use \\(a\\).\n" +
      "- Use correct LaTeX for symbols (e.g., \\frac, \\sqrt, \\degree).";

    const result = streamText({
      model: google(model),
      system: systemMessage,
      messages,
      experimental_transform: smoothStream({
        chunking: "line",
      }),
      abortSignal: request.signal,
    });

    return result.toDataStreamResponse();
  },
});
