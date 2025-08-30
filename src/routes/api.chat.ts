import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createServerFileRoute } from "@tanstack/react-start/server";
import {
  convertToModelMessages,
  smoothStream,
  streamText,
  validateUIMessages,
} from "ai";
import { defaultSelectedModel } from "~/constants/model-providers";
import { systemMessage } from "~/constants/system-message";
import type { ApiKeys, CustomUIMessage, Model } from "~/types";

type ChatRequestBody = {
  messages: CustomUIMessage[];
  model: Model;
  isWebSearchEnabled: boolean;
  apiKeys: ApiKeys;
  useOpenRouter: boolean;
};

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

export const ServerRoute = createServerFileRoute("/api/chat").methods({
  POST: async ({ request }) => {
    const chatRequestBody: ChatRequestBody = await request.json();

    const {
      messages,
      model: requestModel,
      isWebSearchEnabled,
      apiKeys,
      useOpenRouter,
    } = chatRequestBody;

    const validatedMessages = await validateUIMessages({ messages });

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
      // providerOptions: {
      //   google: { responseModalities: ["TEXT", "IMAGE"] },
      // },
      experimental_transform: smoothStream({ chunking: "line" }),
      abortSignal: request.signal,
      tools: {
        google_search: google.tools.googleSearch({}),
      },
      // onFinish: () => {
      // 	dataStream.writeMessageAnnotation({
      // 		type: "model",
      // 		data: requestModel.name,
      // 	});
      // },
    });

    return result.toUIMessageStreamResponse({
      originalMessages: validatedMessages,
      sendReasoning: true,
      sendSources: isWebSearchEnabled,
      onError: (error) => {
        // console.log((error as any).message);
        // biome-ignore lint/suspicious/noExplicitAny: Allow in this case
        return (error as any).message;
      },
    });
  },
});
