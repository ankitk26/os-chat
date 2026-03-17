import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import type { SidebarFolder } from "~/types";

type FolderActionState = {
	selectedFolder: SidebarFolder | null;
	isCreateModalOpen: boolean;
	isDeleteModalOpen: boolean;
	isRenameModalOpen: boolean;
};

const folderActionStore = new Store<FolderActionState>({
	selectedFolder: null,
	isCreateModalOpen: false,
	isDeleteModalOpen: false,
	isRenameModalOpen: false,
});

export const useFolderActionStore = <T>(
	selector: (state: FolderActionState) => T,
): T => useStore(folderActionStore, selector);

export const setSelectedFolder = (folder: SidebarFolder | null) => {
	folderActionStore.setState((prev) => ({ ...prev, selectedFolder: folder }));
};

export const setIsCreateModalOpen = (value: boolean) => {
	folderActionStore.setState((prev) => ({ ...prev, isCreateModalOpen: value }));
};

export const setIsDeleteModalOpen = (value: boolean) => {
	folderActionStore.setState((prev) => ({ ...prev, isDeleteModalOpen: value }));
};

export const setIsRenameModalOpen = (value: boolean) => {
	folderActionStore.setState((prev) => ({ ...prev, isRenameModalOpen: value }));
};
