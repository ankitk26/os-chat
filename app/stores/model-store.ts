import { create } from "zustand";
import { Model } from "~/types";

type ModelStoreState = {
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  isWebSearchEnabled: boolean;
  toggleIsWebSearch: () => void;
  retryModel: string | null;
  setRetryModel: (model: string | null) => void;
};

export const useModelStore = create<ModelStoreState>()((set) => ({
  selectedModel: {
    modelId: "deepseek/deepseek-chat:free",
    openRouterModelId: "deepseek/deepseek-chat:free",
    isFree: true,
    name: "DeepSeek V3",
  },
  setSelectedModel: (model: Model) => set({ selectedModel: model }),
  isWebSearchEnabled: false,
  toggleIsWebSearch: () =>
    set((prev) => ({ isWebSearchEnabled: !prev.isWebSearchEnabled })),
  retryModel: null,
  setRetryModel: (model: string | null) => set({ retryModel: model }),
}));
