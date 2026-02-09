import { create } from "zustand";
import type { SidebarFolder } from "~/types";

type FolderActionState = {
	selectedFolder: SidebarFolder | null;
	setSelectedFolder: (folder: SidebarFolder | null) => void;
	isCreateModalOpen: boolean;
	setIsCreateModalOpen: (value: boolean) => void;
	isDeleteModalOpen: boolean;
	setIsDeleteModalOpen: (value: boolean) => void;
	isRenameModalOpen: boolean;
	setIsRenameModalOpen: (value: boolean) => void;
};

export const useFolderActionStore = create<FolderActionState>()((set) => ({
	selectedFolder: null,
	setSelectedFolder: (folder: SidebarFolder | null) =>
		set({ selectedFolder: folder }),
	isCreateModalOpen: false,
	setIsCreateModalOpen: (value: boolean) => set({ isCreateModalOpen: value }),
	isDeleteModalOpen: false,
	setIsDeleteModalOpen: (value: boolean) => set({ isDeleteModalOpen: value }),
	isRenameModalOpen: false,
	setIsRenameModalOpen: (value: boolean) => set({ isRenameModalOpen: value }),
}));
