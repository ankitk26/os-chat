import { allModelProviders } from "~/constants/model-providers";
import type { Model } from "~/types";

export type OpenRouterModelId =
	(typeof allModelProviders)[number]["models"][number]["openRouterModelId"];

export const openRouterModelLookup: Record<OpenRouterModelId, Model> =
	Object.fromEntries(
		allModelProviders.flatMap((provider) =>
			provider.models.map((model) => [model.openRouterModelId, model]),
		),
	) as Record<OpenRouterModelId, Model>;

export function getModelByOpenRouterId(id: string): Model | undefined {
	return openRouterModelLookup[id as OpenRouterModelId];
}
