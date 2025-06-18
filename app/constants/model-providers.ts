export interface Model {
  name: string;
  modelId: string;
  isFree: boolean;
}

export interface ModelWithAvailability extends Model {
  // Original Model properties
  // name: string;
  // modelId: string;
  // isFree: boolean;
  isAvailable: boolean; // <-- New property
}

export interface ProviderGroup {
  provider: string; // e.g.: "Google", "DeepSeek", etc.
  key: string; // e.g.: "google", "deepseek", "openai", "anthropic"
  models: Model[]; // Original models array
}

// New type for the return structure
export interface ProviderGroupWithAvailability
  extends Omit<ProviderGroup, "models"> {
  models: ModelWithAvailability[]; // Models array now contains ModelWithAvailability
}

export interface ApiKeys {
  gemini: string;
  openai: string;
  anthropic: string;
  openrouter: string;
}
// Example arrays provided by you:
export const openRouterModelProviders: ProviderGroup[] = [
  {
    provider: "Google",
    key: "google",
    models: [
      {
        name: "Gemini 2.0 Flash",
        modelId: "google/gemini-2.0-flash-001",
        isFree: false,
      },
      {
        name: "Gemini 2.5 Flash",
        modelId: "google/gemini-2.5-flash",
        isFree: false,
      },
      {
        name: "Gemini 2.5 Flash Lite",
        modelId: "google/gemini-2.5-flash-lite-preview-06-17",
        isFree: false,
      },
      {
        name: "Gemini 2.5 Pro",
        modelId: "google/gemini-2.5-pro",
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
        modelId: "deepseek/deepseek-r1-0528:free",
        isFree: true,
      },
      {
        name: "DeepSeek R1",
        modelId: "deepseek/deepseek-r1:free",
        isFree: true,
      },
      {
        name: "DeepSeek V3 (0324)",
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
        modelId: "openai/o3",
        isFree: false,
      },
      {
        name: "o3 Mini",
        modelId: "openai/o3-mini",
        isFree: false,
      },
      {
        name: "o3 Pro",
        modelId: "openai/o3-pro",
        isFree: false,
      },
      {
        name: "GPT 4o Mini",
        modelId: "openai/gpt-4o-mini",
        isFree: false,
      },
      {
        name: "GPT 4o",
        modelId: "openai/gpt-4o",
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
        modelId: "anthropic/claude-3.5-sonnet",
        isFree: false,
      },
      {
        name: "Claude 3.7 Sonnet",
        modelId: "anthropic/claude-3.7-sonnet",
        isFree: false,
      },
      {
        name: "Claude Sonnet 4",
        modelId: "anthropic/claude-sonnet-4",
        isFree: false,
      },
      {
        name: "Claude Opus 4",
        modelId: "anthropic/claude-opus-4",
        isFree: false,
      },
    ],
  },
];
