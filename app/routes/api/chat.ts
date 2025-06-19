import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import {
  createDataStreamResponse,
  Message,
  smoothStream,
  streamText,
} from "ai";
import { systemMessage } from "~/constants/system-message";
import { ApiKeys, Model } from "~/types";

type ChatRequestBody = {
  messages: Message[];
  model: Model;
  isWebSearchEnabled: boolean;
  apiKeys: string | null;
  useOpenRouter: string | null;
};

// Helper function to safely parse JSON from string
function safeJSONParse<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) {
    return defaultValue;
  }

  try {
    // try parsing the string to JSON
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === typeof defaultValue) {
      return parsed;
    }
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

const getModelToUse = (
  requestModel: Model,
  parsedApiKeys: ApiKeys,
  useOpenRouter: boolean,
  isWebSearchEnabled: boolean
) => {
  const defaultOpenRouterApiKey = process.env.OPENROUTER_API_KEY;

  // useOpenRouter is true AND client provided an OpenRouter key
  // All models can be accessed and powered by OpenRouter API Key given by user
  if (useOpenRouter && parsedApiKeys.openrouter.trim() !== "") {
    const openRouter = createOpenRouter({
      apiKey: parsedApiKeys.openrouter,
    });
    console.log("[LOG] Using user's OpenRouter API Key");
    // if using OpenRouter and it's gemini model + webSearch, append :online to modelId
    if (
      requestModel.openRouterModelId.startsWith("google") &&
      isWebSearchEnabled
    ) {
      return openRouter.chat(requestModel.openRouterModelId + ":online");
    }
    return openRouter.chat(requestModel.openRouterModelId);
  }

  // useOpenRouter is false and no API keys provided
  // No keys provided - use default DeepSeek model
  if (
    !useOpenRouter &&
    !parsedApiKeys.gemini &&
    !parsedApiKeys.openai &&
    !parsedApiKeys.anthropic &&
    !parsedApiKeys.openrouter
  ) {
    const myOpenRouter = createOpenRouter({
      apiKey: defaultOpenRouterApiKey,
    });
    console.log("[LOG] Using provisioned OpenRouter API Key");
    // if using OpenRouter and it's gemini model + webSearch, append :online to modelId
    if (
      requestModel.openRouterModelId.startsWith("google") &&
      isWebSearchEnabled
    ) {
      return myOpenRouter.chat(requestModel.openRouterModelId + ":online");
    }
    return myOpenRouter.chat(requestModel.openRouterModelId);
  }

  // useOpenRouter is false, but specific provider keys might be present
  // Use specific provider's keys provided by user
  if (!useOpenRouter) {
    // Handle GEMINI model
    if (requestModel.openRouterModelId.startsWith("google")) {
      if (parsedApiKeys.gemini.trim() === "") {
        throw new Error("API Key for Google Gemini not provided.");
      }

      const googleModel = createGoogleGenerativeAI({
        apiKey: parsedApiKeys.gemini,
      });
      return googleModel(requestModel.modelId, {
        useSearchGrounding: isWebSearchEnabled,
      });
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

  // Default any other case to DeepSeek model
  const myOpenRouter = createOpenRouter({
    apiKey: defaultOpenRouterApiKey,
  });
  return myOpenRouter.chat(requestModel.openRouterModelId);
};

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    const chatRequestBody: ChatRequestBody = await request.json();

    console.log("[LOG]: API hit~~~~~~~~~~~");

    const {
      messages,
      model: requestModel,
      isWebSearchEnabled,
      apiKeys: apiKeysString,
      useOpenRouter: useOpenRouterString,
    } = chatRequestBody;

    // Parse the string values safely
    const parsedApiKeys: ApiKeys = safeJSONParse(apiKeysString, {
      gemini: "",
      openai: "",
      anthropic: "",
      openrouter: "",
      xai: "",
    });
    const useOpenRouter = safeJSONParse(useOpenRouterString, false);

    const modelToUse = getModelToUse(
      requestModel,
      parsedApiKeys,
      useOpenRouter,
      isWebSearchEnabled
    );

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: modelToUse,
          system: systemMessage,
          messages,
          experimental_transform: smoothStream({
            chunking: "line",
          }),
          abortSignal: request.signal,
          onFinish: () => {
            dataStream.writeMessageAnnotation({
              model: requestModel.name,
            });
          },
          maxRetries: 2,
        });

        result.mergeIntoDataStream(dataStream);
      },
      onError: (error) => (error as any).message,
    });
  },
});
