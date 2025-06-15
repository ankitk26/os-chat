import { Id } from "convex/_generated/dataModel";
import { create } from "zustand";

type ChatType = {
  _id: Id<"chats">;
  title: string;
  uuid: string;
};

type ChatActionsStore = {
  chat: ChatType | null;
  setChat: (chat: ChatType | null) => void;
  isToBeDeleted: boolean;
  setIsToBeDeleted: (value: boolean) => void;
};

export const useChatActionsStore = create<ChatActionsStore>()((set) => ({
  chat: null,
  setChat: (chat: ChatType | null) => set({ chat }),
  isToBeDeleted: false,
  setIsToBeDeleted: (value: boolean) => set({ isToBeDeleted: value }),
}));
