import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppearanceStoreState = {
	showTokenUsage: boolean;
	toggleShowTokenUsage: () => void;
};

export const useAppearanceStore = create<AppearanceStoreState>()(
	persist(
		(set) => ({
			showTokenUsage: false,
			toggleShowTokenUsage: () =>
				set((prev) => ({
					...prev,
					showTokenUsage: !prev.showTokenUsage,
				})),
		}),
		{
			name: "appearance-settings",
		},
	),
);
