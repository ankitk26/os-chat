import type { Id } from "convex/_generated/dataModel";
import { create } from "zustand";

type Chat = {
	_id: Id<"chats">;
	title: string;
	uuid: string;
};

type ChatActionState = {
	selectedChat: Chat | null;
	setSelectedChat: (chat: Chat | null) => void;
	isDeleteModalOpen: boolean;
	setIsDeleteModalOpen: (value: boolean) => void;
	isRenameModalOpen: boolean;
	setIsRenameModalOpen: (value: boolean) => void;
	isShareDialogOpen: boolean;
	setIsShareDialogOpen: (value: boolean) => void;
};

export const useChatActionStore = create<ChatActionState>()((set) => ({
	selectedChat: null,
	setSelectedChat: (chat: Chat | null) => set({ selectedChat: chat }),
	isDeleteModalOpen: false,
	setIsDeleteModalOpen: (value: boolean) => set({ isDeleteModalOpen: value }),
	isRenameModalOpen: false,
	setIsRenameModalOpen: (value: boolean) => set({ isRenameModalOpen: value }),
	isShareDialogOpen: false,
	setIsShareDialogOpen: (value: boolean) => set({ isShareDialogOpen: value }),
}));
