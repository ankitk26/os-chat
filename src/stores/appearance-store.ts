import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppearanceStoreState = {
  enableAllMono: boolean;
  showTokenUsage: boolean;
  toggleAllMono: () => void;
  toggleShowTokenUsage: () => void;
};

export const useAppearanceStore = create<AppearanceStoreState>()(
  persist(
    (set) => ({
      enableAllMono: false,
      showTokenUsage: false,
      toggleAllMono: () =>
        set((prev) => ({ ...prev, enableAllMono: !prev.enableAllMono })),
      toggleShowTokenUsage: () =>
        set((prev) => ({
          ...prev,
          showTokenUsage: !prev.showTokenUsage,
        })),
    }),
    {
      name: "appearance-settings",
    }
  )
);
