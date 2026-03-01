import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { defaultSelectedModel } from "~/constants/model-providers";
import type { ApiKeys, Model } from "~/types";

/**
 * Resolves which AI model to use based on user preferences and API keys.
 * Priority: OpenRouter (if enabled and key provided) > Provider-specific keys > Default (Gemini)
 */
export const resolveModelForRequest = (
	requestModel: Model,
	apiKeys: ApiKeys,
	useOpenRouter: boolean,
	isWebSearchEnabled: boolean,
) => {
	const geminiProvider = createGoogleGenerativeAI({
		apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
	});
	const defaultModel = geminiProvider(defaultSelectedModel.modelId);

	// Use OpenRouter if enabled and key provided
	if (useOpenRouter && apiKeys.openrouter.trim() !== "") {
		const openRouter = createOpenRouter({ apiKey: apiKeys.openrouter });
		if (isWebSearchEnabled) {
			return openRouter.chat(`${requestModel.openRouterModelId}:online`);
		}
		return openRouter.chat(requestModel.openRouterModelId);
	}

	// Use provider-specific keys
	if (!useOpenRouter) {
		// Gemini
		if (requestModel.openRouterModelId.startsWith("google")) {
			if (apiKeys.gemini.trim() === "") {
				return defaultModel;
			}
			return createGoogleGenerativeAI({ apiKey: apiKeys.gemini })(
				requestModel.modelId,
			);
		}

		// OpenAI
		if (requestModel.openRouterModelId.startsWith("openai")) {
			if (apiKeys.openai.trim() === "") {
				throw new Error("API Key for OpenAI not provided.");
			}
			return createOpenAI({ apiKey: apiKeys.openai })(requestModel.modelId);
		}

		// Anthropic
		if (requestModel.openRouterModelId.startsWith("anthropic")) {
			if (apiKeys.anthropic.trim() === "") {
				throw new Error("API Key for Anthropic not provided.");
			}
			return createAnthropic({ apiKey: apiKeys.anthropic })(
				requestModel.modelId,
			);
		}

		// xAI
		if (requestModel.openRouterModelId.startsWith("x-ai")) {
			if (apiKeys.xai.trim() === "") {
				throw new Error("API Key for xAI not provided.");
			}
			return createXai({ apiKey: apiKeys.xai })(requestModel.modelId);
		}
	}

	return defaultModel;
};
