import { ProviderGroup } from "~/types";

export const openRouterModelProviders: ProviderGroup[] = [
  {
    provider: "Google",
    key: "google",
    models: [
      {
        name: "Gemini 2.0 Flash",
        modelId: "gemini-2.0-flash-001",
        openRouterModelId: "google/gemini-2.0-flash-001",
        isFree: true,
      },
      {
        name: "Gemini 2.5 Flash",
        openRouterModelId: "google/gemini-2.5-flash",
        modelId: "gemini-2.5-flash-preview-04-17",
        isFree: false,
      },
      {
        name: "Gemini 2.5 Pro",
        openRouterModelId: "google/gemini-2.5-pro",
        modelId: "gemini-2.5-pro-preview-05-06",
        isFree: false,
      },
    ],
  },
  {
    provider: "DeepSeek",
    key: "deepseek",
    models: [
      {
        name: "DeepSeek R1 0528",
        openRouterModelId: "deepseek/deepseek-r1-0528:free",
        modelId: "deepseek/deepseek-r1-0528:free",
        isFree: true,
      },
      {
        name: "DeepSeek R1",
        openRouterModelId: "deepseek/deepseek-r1:free",
        modelId: "deepseek/deepseek-r1:free",
        isFree: true,
      },
      {
        name: "DeepSeek V3 (0324)",
        openRouterModelId: "deepseek/deepseek-chat-v3-0324:free",
        modelId: "deepseek/deepseek-chat-v3-0324:free",
        isFree: true,
      },
    ],
  },
  {
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
        name: "GPT 4o Mini",
        openRouterModelId: "openai/gpt-4o-mini",
        modelId: "gpt-4o-mini",
        isFree: false,
      },
      {
        name: "GPT 4o",
        openRouterModelId: "openai/gpt-4o",
        modelId: "gpt-4o",
        isFree: false,
      },
    ],
  },
  {
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
  },
  {
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
    ],
  },
  {
    provider: "Qwen",
    key: "qwen",
    models: [
      {
        name: "Qwen QwQ 32B",
        openRouterModelId: "qwen/qwq-32b:free",
        modelId: "qwen/qwq-32b:free",
        isFree: true,
      },
      {
        name: "Qwen 2.5 32b",
        openRouterModelId: "qwen/qwen-2.5-coder-32b-instruct:free",
        modelId: "qwen/qwen-2.5-coder-32b-instruct:free",
        isFree: true,
      },
    ],
  },
];
