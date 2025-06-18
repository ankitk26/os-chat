import { create } from "zustand";

export type ModelStore = {
  id: string;
  name: string;
};

type ModelStoreState = {
  selectedModel: ModelStore;
  setSelectedModel: (model: ModelStore) => void;
  isWebSearchEnabled: boolean;
  toggleIsWebSearch: () => void;
  retryModel: string | null;
  setRetryModel: (model: string | null) => void;
};

export const useModelStore = create<ModelStoreState>()((set) => ({
  selectedModel: {
    id: "deepseek/deepseek-chat:free",
    name: "DeepSeek V3",
  },
  setSelectedModel: (model: ModelStore) => set({ selectedModel: model }),
  isWebSearchEnabled: false,
  toggleIsWebSearch: () =>
    set((prev) => ({ isWebSearchEnabled: !prev.isWebSearchEnabled })),
  retryModel: null,
  setRetryModel: (model: string | null) => set({ retryModel: model }),
}));
