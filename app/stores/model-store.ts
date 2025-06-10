import { create } from "zustand";

type ModelStoreState = {
  model: string;
  setModel: (model: string) => void;
};

export const useModelStore = create<ModelStoreState>()((set) => ({
  model: "gemini-2.0-flash",
  setModel: (model: string) => set({ model: model }),
}));
