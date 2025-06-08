import { google } from "@ai-sdk/google";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Message, streamText } from "ai";

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    const { messages }: { messages: Message[] } = await request.json();

    const result = streamText({
      model: google("gemini-2.0-flash"),
      messages,
    });
    return result.toDataStreamResponse();
  },
});
