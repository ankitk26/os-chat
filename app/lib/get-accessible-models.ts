import {
  ModelWithAvailability,
  ApiKeys,
  openRouterModelProviders,
  ProviderGroup,
} from "~/constants/model-providers"; // Assuming this path is correct

// New type for the return structure
export interface ProviderGroupWithAvailability
  extends Omit<ProviderGroup, "models"> {
  models: ModelWithAvailability[];
}

// Helper function to safely parse JSON from localStorage
function safeJSONParse<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) {
    return defaultValue;
  }
  try {
    const parsed = JSON.parse(jsonString);
    // Basic structural check for ApiKeys type
    if (
      typeof defaultValue === "object" &&
      defaultValue !== null &&
      parsed &&
      typeof parsed === "object"
    ) {
      const defaultKeys = Object.keys(defaultValue);
      const parsedKeys = Object.keys(parsed);
      if (defaultKeys.every((key) => parsedKeys.includes(key))) {
        return parsed;
      }
    } else if (typeof parsed === typeof defaultValue) {
      // For boolean checks
      return parsed;
    }
    console.warn(
      `LocalStorage item had unexpected structure, using default value. Parsed:`,
      parsed
    );
    return defaultValue;
  } catch (e) {
    console.error(`Failed to parse localStorage item, using default value:`, e);
    return defaultValue;
  }
}

export function getAccessibleModels(
  apiKeysString: string | null,
  useOpenRouterString: string | null
): ProviderGroupWithAvailability[] {
  // Safely parse API keys from the string, defaulting to empty keys if null/invalid.
  const parsedKeys: ApiKeys = safeJSONParse(apiKeysString, {
    gemini: "",
    openai: "",
    anthropic: "",
    openrouter: "",
  });

  // Safely parse the useOpenRouter flag, defaulting to false if null/invalid.
  const useOpenRouterFlag: boolean = safeJSONParse(useOpenRouterString, false);

  const resultProviderGroups: ProviderGroupWithAvailability[] = [];

  for (const group of openRouterModelProviders) {
    const modelsWithAvailability: ModelWithAvailability[] = [];

    for (const model of group.models) {
      let available = false;

      // Primary check: If useOpenRouter toggle is ON, all models are available.
      if (useOpenRouterFlag) {
        available = true;
      } else {
        // If useOpenRouter toggle is OFF, availability depends on individual provider keys or if the model is free.
        let hasSpecificProviderKey = false;
        switch (group.key) {
          case "openai":
            hasSpecificProviderKey = parsedKeys.openai.trim() !== "";
            break;
          case "anthropic":
            hasSpecificProviderKey = parsedKeys.anthropic.trim() !== "";
            break;
          case "google":
            hasSpecificProviderKey = parsedKeys.gemini.trim() !== "";
            break;
          case "openrouter": // Special case: if OpenRouter toggle is off, but they *still* put an OpenRouter key, those models are still available via that key.
            hasSpecificProviderKey = parsedKeys.openrouter.trim() !== "";
            break;
          case "deepseek":
            // DeepSeek models are inherently free; their availability is solely based on `model.isFree`.
            break; // No `hasSpecificProviderKey` from `parsedKeys` is relevant here.
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
