import type { Doc } from "convex/_generated/dataModel";

export const selectChatFields = (chat: Doc<"chats">) => {
	const finalChat = {
		_id: chat._id,
		_creationTime: chat._creationTime,
		uuid: chat.uuid,
		title: chat.title,
		isBranched: chat.isBranched,
		folderId: chat.folderId,
		isPinned: chat.isPinned,
	};
	return finalChat;
};
