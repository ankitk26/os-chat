import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ApiKeys, defaultApiKeys } from "~/types";

type ApiKeysStoreState = {
	persistedApiKeys: ApiKeys;
	persistedUseOpenRouter: boolean;
	setPersistedApiKeys: (keys: ApiKeys) => void;
	setPersistedUseOpenRouter: (value: boolean) => void;
};

export const usePersistedApiKeysStore = create<ApiKeysStoreState>()(
	persist(
		(set) => ({
			persistedApiKeys: defaultApiKeys,
			persistedUseOpenRouter: false,
			setPersistedApiKeys: (keys: ApiKeys) => set({ persistedApiKeys: keys }),
			setPersistedUseOpenRouter: (value: boolean) =>
				set({ persistedUseOpenRouter: value }),
		}),
		{
			name: "apiKeysState",
		},
	),
);
