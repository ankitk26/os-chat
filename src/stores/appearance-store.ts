import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppearanceStoreState = {
  enableAllMono: boolean;
  toggleEnableAllMono: () => void;
};

export const useAppearanceStore = create<AppearanceStoreState>()(
  persist(
    (set) => ({
      enableAllMono: false,
      toggleEnableAllMono: () =>
        set((prev) => ({ ...prev, enableAllMono: !prev.enableAllMono })),
    }),
    {
      name: "appearance-settings",
    }
  )
);
