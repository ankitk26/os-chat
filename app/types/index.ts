import { z } from "zod";

// Create zod and type for /api/chat request body's model
export const modelSchema = z.object({
  name: z.string(),
  openRouterModelId: z.string(),
  modelId: z.string(),
  isFree: z.boolean(),
});
export type Model = z.infer<typeof modelSchema>;

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

// API Keys zod schema and type
export const apiKeysSchema = z.object({
  gemini: z.string().optional().default(""),
  openai: z.string().optional().default(""),
  anthropic: z.string().optional().default(""),
  openrouter: z.string().optional().default(""),
});
export type ApiKeys = z.infer<typeof apiKeysSchema>;
