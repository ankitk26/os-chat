import { google } from "@ai-sdk/google";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import {
  createDataStreamResponse,
  Message,
  smoothStream,
  streamText,
} from "ai";
import { systemMessage } from "~/constants/system-message";

type ChatRequestBody = {
  messages: Message[];
  model: string;
  isWebSearchEnabled: boolean;
};

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    const chatRequestBody: ChatRequestBody = await request.json();

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: google(chatRequestBody.model, {
            useSearchGrounding: chatRequestBody.isWebSearchEnabled,
          }),
          system: systemMessage,
          messages: chatRequestBody.messages,
          experimental_transform: smoothStream({
            chunking: "line",
          }),
          abortSignal: request.signal,
          onFinish() {
            dataStream.writeMessageAnnotation({ model: chatRequestBody.model });
          },
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
  },
});
