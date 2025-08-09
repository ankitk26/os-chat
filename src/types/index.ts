import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

// Create type for /api/chat request body's model
export type Model = {
  name: string;
  openRouterModelId: string;
  modelId: string;
  isFree: boolean;
};

// Model + isAvailable
export type ModelWithAvailability = Model & { isAvailable: boolean };

// Type for models list
export type ProviderGroup = {
  provider: string;
  key: string;
  models: Model[];
};

// Provider Group + isAvailable (decided after analyzing API Keys)
export interface ProviderGroupWithAvailability
  extends Omit<ProviderGroup, "models"> {
  models: ModelWithAvailability[];
}

// API Keys type
export type ApiKeys = {
  gemini: string;
  openai: string;
  anthropic: string;
  openrouter: string;
  xai: string;
};

export const defaultApiKeys: ApiKeys = {
  gemini: "",
  openai: "",
  anthropic: "",
  openrouter: "",
  xai: "",
};

export type Provider = keyof ApiKeys;

export type SidebarChatType = FunctionReturnType<
  typeof api.chats.getPinnedChats
>[0];
