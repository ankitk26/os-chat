import { google } from "@ai-sdk/google";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Message, smoothStream, streamText } from "ai";

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    const { messages }: { messages: Message[] } = await request.json();
    console.log(messages);

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: `You are a helpful assistant. Strictly adhere to LaTeX formatting:
- Inline math: Always use \\( content \\). Example: \\( E=mc^2 \\).
- Display math: Always use $$ content $$.
- Never use single dollar signs ($) for math.
- Never use plain parentheses for math variables (e.g., (a)); always use \\(a\\).
- Use correct LaTeX for symbols (e.g., \\frac, \\sqrt, \\degree).`,
      messages,
      experimental_transform: smoothStream({
        chunking: "line",
      }),
    });
    return result.toDataStreamResponse();
  },
});
