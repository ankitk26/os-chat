import { create } from "zustand";
import type { Model } from "~/types";
import { defaultSelectedModel } from "~/constants/model-providers";

type ModelStoreState = {
	selectedModel: Model;
	setSelectedModel: (model: Model) => void;
	isWebSearchEnabled: boolean;
	toggleIsWebSearch: () => void;
	retryModel: string | null;
	setRetryModel: (model: string | null) => void;
};

export const useModelStore = create<ModelStoreState>()((set) => ({
	selectedModel: defaultSelectedModel,
	setSelectedModel: (model: Model) => set({ selectedModel: model }),
	isWebSearchEnabled: false,
	toggleIsWebSearch: () =>
		set((prev) => ({ isWebSearchEnabled: !prev.isWebSearchEnabled })),
	retryModel: null,
	setRetryModel: (model: string | null) => set({ retryModel: model }),
}));
