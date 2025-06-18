import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
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
  apiKeys: string | null;
  useOpenRouter: string | null;
};

type ParsedApiKeys = {
  gemini: string;
  openai: string;
  anthropic: string;
  openrouter: string;
};

// Helper function to safely parse JSON from string
function safeJSONParse<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) {
    return defaultValue;
  }
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === typeof defaultValue) {
      return parsed;
    }
    console.warn(
      `Parsed value had unexpected type, using default value. Parsed:`,
      parsed
    );
    return defaultValue;
  } catch (e) {
    console.error(`Failed to parse JSON string, using default value:`, e);
    return defaultValue;
  }
}

function getModelToUse(
  requestedModelId: string,
  parsedApiKeys: ParsedApiKeys,
  useOpenRouter: boolean,
  isWebSearchEnabled: boolean
) {
  // Option 1: useOpenRouter is true AND client provided an OpenRouter key
  if (useOpenRouter && parsedApiKeys.openrouter.trim() !== "") {
    console.log("Using OpenRouter model with client's API key.");
    const openRouter = createOpenRouter({
      apiKey: parsedApiKeys.openrouter,
    });
    return openRouter.chat(requestedModelId);
  }

  // Option 2: useOpenRouter is false and no API keys provided
  if (
    !useOpenRouter &&
    !parsedApiKeys.gemini &&
    !parsedApiKeys.openai &&
    !parsedApiKeys.anthropic &&
    !parsedApiKeys.openrouter
  ) {
    console.log("Using server's default OpenRouter key for models.");
    const myOpenRouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    return myOpenRouter.chat(requestedModelId);
  }

  // Option 3: useOpenRouter is false, but specific provider keys might be present
  if (!useOpenRouter) {
    console.log("Using specific model provider based on API keys.");

    // Determine provider based on model ID
    if (
      requestedModelId.startsWith("gemini") ||
      requestedModelId.includes("google")
    ) {
      if (parsedApiKeys.gemini.trim() !== "") {
        const googleModel = createGoogleGenerativeAI({
          apiKey: parsedApiKeys.gemini,
        });
        return googleModel(requestedModelId, {
          useSearchGrounding: isWebSearchEnabled,
        });
      } else {
        throw new Error("API Key for Google Gemini not provided.");
      }
    }

    if (
      requestedModelId.startsWith("gpt") ||
      requestedModelId.includes("openai")
    ) {
      if (parsedApiKeys.openai.trim() !== "") {
        const openAiModel = createOpenAI({
          apiKey: parsedApiKeys.openai,
        });
        return openAiModel(requestedModelId);
      } else {
        throw new Error("API Key for OpenAI not provided.");
      }
    }

    if (
      requestedModelId.startsWith("claude") ||
      requestedModelId.includes("anthropic")
    ) {
      if (parsedApiKeys.anthropic.trim() !== "") {
        const anthropicModel = createAnthropic({
          apiKey: parsedApiKeys.anthropic,
        });
        return anthropicModel(requestedModelId);
      } else {
        throw new Error("API Key for Anthropic not provided.");
      }
    }

    // Fallback to server's OpenRouter for unknown models
    console.log("Unknown model, falling back to server's OpenRouter.");
    const myOpenRouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    return myOpenRouter.chat(requestedModelId);
  }

  // Final fallback case
  console.log("Fallback to server's OpenRouter.");
  const myOpenRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  return myOpenRouter.chat(requestedModelId);
}

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    const chatRequestBody: ChatRequestBody = await request.json();

    const {
      messages,
      model: requestedModelId,
      isWebSearchEnabled,
      apiKeys: apiKeysString,
      useOpenRouter: useOpenRouterString,
    } = chatRequestBody;

    // Parse the string values safely
    const parsedApiKeys = safeJSONParse(apiKeysString, {
      gemini: "",
      openai: "",
      anthropic: "",
      openrouter: "",
    });

    const useOpenRouter = safeJSONParse(useOpenRouterString, false);

    const modelToUse = getModelToUse(
      requestedModelId,
      parsedApiKeys,
      useOpenRouter,
      isWebSearchEnabled
    );

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: modelToUse,
          system: systemMessage,
          messages: messages,
          experimental_transform: smoothStream({
            chunking: "line",
          }),
          abortSignal: request.signal,
          onFinish: () => {
            dataStream.writeMessageAnnotation({
              model: requestedModelId,
            });
          },
          onError: ({ error }) => {
            console.error("Error during streaming:", error);
            dataStream.writeData({
              type: "error",
              message: "An unknown error occurred.",
            });
          },
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
  },
});
