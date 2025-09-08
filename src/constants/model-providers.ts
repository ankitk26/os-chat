import type { ProviderGroup } from "~/types";

export const defaultSelectedModel = {
  name: "Gemini 2.0 Flash",
  openRouterModelId: "google/gemini-2.0-flash-001",
  modelId: "gemini-2.0-flash-001",
  isFree: true,
};

const geminiModels = {
  provider: "Google",
  key: "google",
  models: [
    defaultSelectedModel,
    {
      name: "Gemini 2.5 Flash",
      openRouterModelId: "google/gemini-2.5-flash",
      modelId: "gemini-2.5-flash-preview-04-17",
      isFree: true,
    },
    {
      name: "Gemini 2.5 Flash Image",
      openRouterModelId: "google/gemini-2.5-flash-image-preview",
      modelId: "gemini-2.5-flash-image-preview",
      isFree: false,
    },
    {
      name: "Gemini 2.5 Pro",
      openRouterModelId: "google/gemini-2.5-pro",
      modelId: "gemini-2.5-pro-preview-05-06",
      isFree: false,
    },
  ],
};

const deepseekModels = {
  provider: "DeepSeek",
  key: "deepseek",
  models: [
    {
      name: "DeepSeek R1 0528",
      openRouterModelId: "deepseek/deepseek-r1-0528",
      modelId: "deepseek/deepseek-r1-0528",
      isFree: false,
    },
    {
      name: "DeepSeek R1",
      openRouterModelId: "deepseek/deepseek-r1",
      modelId: "deepseek/deepseek-r1",
      isFree: false,
    },
    {
      name: "DeepSeek V3 (0324)",
      openRouterModelId: "deepseek/deepseek-chat-v3-0324",
      modelId: "deepseek/deepseek-chat-v3-0324",
      isFree: false,
    },
    {
      name: "DeepSeek V3.1",
      openRouterModelId: "deepseek/deepseek-chat-v3.1",
      modelId: "deepseek/deepseek-chat-v3.1",
      isFree: false,
    },
  ],
};

const openAiModels = {
  provider: "OpenAI",
  key: "openai",
  models: [
    {
      name: "o3",
      openRouterModelId: "openai/o3",
      modelId: "o3",
      isFree: false,
    },
    {
      name: "o3 Mini",
      openRouterModelId: "openai/o3-mini",
      modelId: "o3-mini",
      isFree: false,
    },
    {
      name: "o4",
      openRouterModelId: "openai/gpt-4o-mini",
      modelId: "gpt-4o-mini",
      isFree: false,
    },
    {
      name: "o4 Mini",
      openRouterModelId: "openai/gpt-4o",
      modelId: "gpt-4o",
      isFree: false,
    },
    {
      name: "GPT 5",
      openRouterModelId: "openai/gpt-5",
      modelId: "gpt-5",
      isFree: false,
    },
    {
      name: "GPT 5 mini",
      openRouterModelId: "openai/gpt-5-mini",
      modelId: "gpt-5-mini",
      isFree: false,
    },
    {
      name: "GPT 5 nano",
      openRouterModelId: "openai/gpt-5-nano",
      modelId: "gpt-5-nano",
      isFree: false,
    },
  ],
};

const anthropicModels = {
  provider: "Anthropic",
  key: "anthropic",
  models: [
    {
      name: "Claude 3.5 Sonnet",
      openRouterModelId: "anthropic/claude-3.5-sonnet",
      modelId: "claude-3-5-sonnet-latest",
      isFree: false,
    },
    {
      name: "Claude 3.7 Sonnet",
      openRouterModelId: "anthropic/claude-3.7-sonnet",
      modelId: "claude-3-7-sonnet-20250219",
      isFree: false,
    },
    {
      name: "Claude Sonnet 4",
      openRouterModelId: "anthropic/claude-sonnet-4",
      modelId: "claude-4-sonnet-20250514",
      isFree: false,
    },
    {
      name: "Claude Opus 4",
      openRouterModelId: "anthropic/claude-opus-4",
      modelId: "claude-4-opus-20250514",
      isFree: false,
    },
  ],
};

const xAiModels = {
  provider: "xAI",
  key: "xai",
  models: [
    {
      name: "Grok 3",
      openRouterModelId: "x-ai/grok-3-beta",
      modelId: "grok-3-latest",
      isFree: false,
    },
    {
      name: "Grok 3 Mini",
      openRouterModelId: "x-ai/grok-3-mini-beta",
      modelId: "grok-3-mini-latest",
      isFree: false,
    },
    {
      name: "Grok 4",
      openRouterModelId: "x-ai/grok-4",
      modelId: "grok-4-latest",
      isFree: false,
    },
  ],
};

const qwenModels = {
  provider: "Qwen",
  key: "qwen",
  models: [
    {
      name: "Qwen 2.5 Coder 32B",
      openRouterModelId: "qwen/qwen-2.5-coder-32b-instruct",
      modelId: "qwen/qwen-2.5-coder-32b-instruct",
      isFree: false,
    },
    {
      name: "Qwen 3 32B",
      openRouterModelId: "qwen/qwen3-32b",
      modelId: "qwen/qwen3-32b",
      isFree: false,
    },
    {
      name: "Qwen 3 Coder",
      openRouterModelId: "qwen/qwen3-coder",
      modelId: "qwen/qwen3-coder",
      isFree: false,
    },
    {
      name: "Qwen 3 Max",
      openRouterModelId: "qwen/qwen3-max",
      modelId: "qwen/qwen3-max",
      isFree: false,
    },
  ],
};

const moonshotModels = {
  provider: "Moonshot",
  key: "moonshot",
  models: [
    {
      name: "Kimi K2",
      openRouterModelId: "moonshotai/kimi-k2",
      modelId: "moonshotai/kimi-k2",
      isFree: false,
    },
    {
      name: "Kimi K2 0905",
      openRouterModelId: "moonshotai/kimi-k2-0905",
      modelId: "moonshotai/kimi-k2-0905",
      isFree: false,
    },
  ],
};

export const allModelProviders: ProviderGroup[] = [
  geminiModels,
  deepseekModels,
  openAiModels,
  anthropicModels,
  xAiModels,
  qwenModels,
  moonshotModels,
];
