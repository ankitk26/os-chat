import { api } from "convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { create } from "zustand";

type Folder = FunctionReturnType<typeof api.folders.getFoldersWithChats>[0];

type FolderActionState = {
  selectedFolder: Folder | null;
  setSelectedFolder: (folder: Folder | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (value: boolean) => void;
  isRenameModalOpen: boolean;
  setIsRenameModalOpen: (value: boolean) => void;
};

export const useFolderActionStore = create<FolderActionState>()((set) => ({
  selectedFolder: null,
  setSelectedFolder: (folder: Folder | null) => set({ selectedFolder: folder }),
  isCreateModalOpen: false,
  setIsCreateModalOpen: (value: boolean) => set({ isCreateModalOpen: value }),
  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (value: boolean) => set({ isDeleteModalOpen: value }),
  isRenameModalOpen: false,
  setIsRenameModalOpen: (value: boolean) => set({ isRenameModalOpen: value }),
}));
