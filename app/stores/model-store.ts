import { create } from "zustand";

type ModelStoreState = {
  model: string;
  setModel: (model: string) => void;
  isWebSearchEnabled: boolean;
  toggleIsWebSearch: () => void;
};

export const useModelStore = create<ModelStoreState>()((set) => ({
  model: "gemini-2.0-flash",
  setModel: (model: string) => set({ model: model }),
  isWebSearchEnabled: false,
  toggleIsWebSearch: () =>
    set((prev) => ({ isWebSearchEnabled: !prev.isWebSearchEnabled })),
}));
