import { google } from "@ai-sdk/google";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, smoothStream, streamText } from "ai";
import { systemMessage } from "~/constants/system-message";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { processMessageParts } from "~/lib/message-parts-processor";
import { resolveModelForRequest } from "~/lib/model-resolver";
import { createMessageServerFn } from "~/server-fns/create-message";
import { getAuthUser } from "~/server-fns/get-auth";
import type { ApiKeys, CustomUIMessage, Model } from "~/types";

type ChatRequestBody = {
	messages: CustomUIMessage[];
	model: Model;
	isWebSearchEnabled: boolean;
	apiKeys: ApiKeys;
	useOpenRouter: boolean;
	chatId?: string;
};

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const authData = await getAuthUser();
				if (!authData) {
					throw new Error("Invalid request");
				}

				const chatRequestBody: ChatRequestBody = await request.json();
				const {
					messages,
					model: requestModel,
					isWebSearchEnabled,
					apiKeys,
					useOpenRouter,
					chatId,
				} = chatRequestBody;

				const modelToUse = resolveModelForRequest(
					requestModel,
					apiKeys,
					useOpenRouter,
					isWebSearchEnabled,
				);

				const result = streamText({
					model: modelToUse,
					system: systemMessage,
					messages: await convertToModelMessages(messages),
					temperature: 0.7,
					experimental_transform: smoothStream({ chunking: "line" }),
					abortSignal: request.signal,
					...(isWebSearchEnabled && {
						tools: {
							google_search: google.tools.googleSearch({}) as any,
						},
					}),
				});

				return result.toUIMessageStreamResponse({
					originalMessages: messages,
					sendReasoning: true,
					generateMessageId: generateRandomUUID,
					messageMetadata: ({ part }) => {
						if (part.type === "start") {
							return { model: requestModel.name, createdAt: Date.now() };
						}
						if (part.type === "finish") {
							return { totalTokens: part.totalUsage.totalTokens };
						}
					},
					sendSources: isWebSearchEnabled,
					onFinish: async ({ responseMessage }) => {
						if (!chatId || responseMessage.parts.length === 0) return;

						// Process all parts (filter types, truncate reasoning, upload images)
						const { partsToSave } = await processMessageParts(
							responseMessage.parts,
						);

						// Save message to database
						await createMessageServerFn({
							data: {
								chatId,
								messageId: responseMessage.id,
								parts: JSON.stringify(partsToSave),
								metadata: JSON.stringify(responseMessage.metadata),
							},
						});
					},
					onError: (error) => {
						console.error("toUIMessageStreamResponse error:", error);
						return (error as any).message;
					},
				});
			},
		},
	},
});
