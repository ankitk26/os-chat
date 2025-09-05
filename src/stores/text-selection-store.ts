import { create } from "zustand";

type TextSelectionState = {
  selectedText: string;
  setSelectedText: (text: string) => void;
  clearSelectedText: () => void;
};

export const useTextSelectionStore = create<TextSelectionState>((set) => ({
  selectedText: "",
  setSelectedText: (text: string) => set({ selectedText: text }),
  clearSelectedText: () => set({ selectedText: "" }),
}));
