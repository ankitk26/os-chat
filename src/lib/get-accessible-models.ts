import { allModelProviders } from "~/constants/model-providers";
import {
  ApiKeys,
  ModelWithAvailability,
  ProviderGroupWithAvailability,
} from "~/types";

export function getAccessibleModels(
  apiKeys: ApiKeys,
  useOpenRouter: boolean
): ProviderGroupWithAvailability[] {
  const resultProviderGroups: ProviderGroupWithAvailability[] = [];

  for (const group of allModelProviders) {
    const modelsWithAvailability: ModelWithAvailability[] = [];

    for (const model of group.models) {
      let available = false;

      // Primary check: If useOpenRouter toggle is ON, all models are available.
      if (useOpenRouter) {
        available = true;
      } else {
        // If useOpenRouter toggle is OFF, availability depends on individual provider keys or if the model is free.
        let hasSpecificProviderKey = false;
        switch (group.key) {
          case "openai":
            hasSpecificProviderKey = apiKeys.openai.trim() !== "";
            break;
          case "anthropic":
            hasSpecificProviderKey = apiKeys.anthropic.trim() !== "";
            break;
          case "google":
            hasSpecificProviderKey = apiKeys.gemini.trim() !== "";
            break;
          case "xai":
            hasSpecificProviderKey = apiKeys.xai.trim() !== "";
            break;
          case "openrouter": // Special case: if OpenRouter toggle is off, but they *still* put an OpenRouter key, those models are still available via that key.
            hasSpecificProviderKey = apiKeys.openrouter.trim() !== "";
            break;
          default:
            // For any other unexpected group key, assume no direct provider key grants access.
            hasSpecificProviderKey = false;
        }
        // A model is available if a specific provider key is present (for paid models) OR the model is free.
        available = hasSpecificProviderKey || model.isFree;
      }

      modelsWithAvailability.push({
        ...model,
        isAvailable: available,
      });
    }

    resultProviderGroups.push({
      ...group,
      models: modelsWithAvailability,
    });
  }

  return resultProviderGroups;
}
