import { createOpenRouter } from "@openrouter/ai-sdk-provider";
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

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          // model: google(chatRequestBody.model, {
          //   useSearchGrounding: chatRequestBody.isWebSearchEnabled,
          // }),
          model: openrouter.chat(chatRequestBody.model),
          system: systemMessage,
          messages: chatRequestBody.messages,
          experimental_transform: smoothStream({
            chunking: "line",
          }),
          abortSignal: request.signal,
          onFinish: () => {
            dataStream.writeMessageAnnotation({ model: chatRequestBody.model });
          },
          onError: ({ error }) => {
            console.log(error);
          },
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
  },
});
