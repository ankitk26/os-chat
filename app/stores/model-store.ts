import { create } from "zustand";

type ModelStoreState = {
  model: string;
  setModel: (model: string) => void;
  isWebSearchEnabled: boolean;
  toggleIsWebSearch: () => void;
  retryModel: string | null;
  setRetryModel: (model: string | null) => void;
};

export const useModelStore = create<ModelStoreState>()((set) => ({
  model: "gemini-2.0-flash",
  setModel: (model: string) => set({ model: model }),
  isWebSearchEnabled: false,
  toggleIsWebSearch: () =>
    set((prev) => ({ isWebSearchEnabled: !prev.isWebSearchEnabled })),
  retryModel: null,
  setRetryModel: (model: string | null) => set({ retryModel: model }),
}));
