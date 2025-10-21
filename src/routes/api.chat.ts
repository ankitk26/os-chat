import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, smoothStream, streamText } from "ai";
import { defaultSelectedModel } from "~/constants/model-providers";
import { systemMessage } from "~/constants/system-message";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { createMessageServerFn } from "~/server-fns/create-message";
import { getAuth } from "~/server-fns/get-auth";
// import { getPostUrl } from "~/server-fns/get-post-url";
import type { ApiKeys, CustomUIMessage, Model } from "~/types";

type ChatRequestBody = {
  messages: CustomUIMessage[];
  model: Model;
  isWebSearchEnabled: boolean;
  apiKeys: ApiKeys;
  useOpenRouter: boolean;
  chatId?: string;
};

// const IMAGE_BASE64_REGEX = /^data:image\/[a-z]+;base64,/;

const getModelToUse = (
  requestModel: Model,
  parsedApiKeys: ApiKeys,
  useOpenRouter: boolean,
  isWebSearchEnabled: boolean
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: To fix later
) => {
  const myGeminiModel = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
  const defaultModel = myGeminiModel(defaultSelectedModel.modelId);

  // useOpenRouter is true AND client provided an OpenRouter key
  // All models can be accessed and powered by OpenRouter API Key given by user
  if (useOpenRouter && parsedApiKeys.openrouter.trim() !== "") {
    const openRouter = createOpenRouter({
      apiKey: parsedApiKeys.openrouter,
    });
    // if using OpenRouter, append :online to modelId
    if (isWebSearchEnabled) {
      return openRouter.chat(`${requestModel.openRouterModelId}:online`);
    }
    return openRouter.chat(requestModel.openRouterModelId);
  }

  // useOpenRouter is false, but specific provider keys might be present
  // Use specific provider's keys provided by user
  if (!useOpenRouter) {
    // Handle GEMINI model
    if (requestModel.openRouterModelId.startsWith("google")) {
      if (parsedApiKeys.gemini.trim() === "") {
        return defaultModel;
      }

      const googleModel = createGoogleGenerativeAI({
        apiKey: parsedApiKeys.gemini,
      });
      return googleModel(requestModel.modelId);
    }

    // Handle OPENAI model
    if (requestModel.openRouterModelId.startsWith("openai")) {
      if (parsedApiKeys.openai.trim() === "") {
        throw new Error("API Key for OpenAI not provided.");
      }

      const openAiModel = createOpenAI({
        apiKey: parsedApiKeys.openai,
      });
      return openAiModel(requestModel.modelId);
    }

    // Handle ANTHROPIC model
    if (requestModel.openRouterModelId.startsWith("anthropic")) {
      if (parsedApiKeys.anthropic.trim() === "") {
        throw new Error("API Key for Anthropic not provided.");
      }

      const anthropicModel = createAnthropic({
        apiKey: parsedApiKeys.anthropic,
      });
      return anthropicModel(requestModel.modelId);
    }

    // Handle XAI model
    if (requestModel.openRouterModelId.startsWith("x-ai")) {
      if (parsedApiKeys.xai.trim() === "") {
        throw new Error("API Key for xAI not provided.");
      }

      const xaiModel = createXai({
        apiKey: parsedApiKeys.xai,
      });
      return xaiModel(requestModel.modelId);
    }
  }

  // Default any other case to Gemini model
  return defaultModel;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authData = await getAuth();
        if (!authData?.session) {
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

        const modelToUse = getModelToUse(
          requestModel,
          apiKeys,
          useOpenRouter,
          isWebSearchEnabled
        );

        const result = streamText({
          model: modelToUse,
          system:
            requestModel.modelId === "gemini-2.0-flash-exp"
              ? undefined
              : systemMessage,
          messages: convertToModelMessages(messages),
          temperature: 0.7,
          experimental_transform: smoothStream({ chunking: "line" }),
          abortSignal: request.signal,
          ...(isWebSearchEnabled && {
            tools: {
              google_search: google.tools.googleSearch({}),
            },
          }),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          sendReasoning: true,
          generateMessageId: generateRandomUUID,
          messageMetadata: ({ part }) => {
            if (part.type === "start") {
              return {
                model: requestModel.name,
                createdAt: Date.now(),
              };
            }
            if (part.type === "finish") {
              return {
                totalTokens: part.totalUsage.totalTokens,
              };
            }
          },
          sendSources: isWebSearchEnabled,
          onFinish: async ({ responseMessage }) => {
            if (chatId && responseMessage.parts.length > 0) {
              const imagePart = responseMessage.parts.find(
                (part) => part.type === "file"
              );
              if (imagePart?.mediaType.startsWith("image/")) {
                try {
                  console.log(imagePart.mediaType);
                  // const postUrl = await getPostUrl();

                  // // Convert base64 string to Blob
                  // const base64Data = imagePart.url.replace(IMAGE_BASE64_REGEX, "");
                  // const binaryData = Uint8Array.from(atob(base64Data), (c) =>
                  //   c.charCodeAt(0)
                  // );
                  // const blob = new Blob([binaryData], {
                  //   type: imagePart.mediaType,
                  // });

                  // const imageUploadRequest = await fetch(postUrl, {
                  //   method: "POST",
                  //   headers: {
                  //     "Content-Type": imagePart.mediaType,
                  //   },
                  //   body: blob,
                  // });
                  // const { storageId } = await imageUploadRequest.json();
                } catch (e) {
                  console.log((e as Error).message);
                }
              } else {
                await createMessageServerFn({
                  data: {
                    chatId,
                    messageId: responseMessage.id,
                    parts: JSON.stringify(responseMessage.parts),
                    metadata: JSON.stringify(responseMessage.metadata),
                  },
                });
              }
            }
          },
          onError: (error) => {
            // biome-ignore lint/suspicious/noExplicitAny: ignore
            return (error as any).message;
          },
        });
      },
    },
  },
});
