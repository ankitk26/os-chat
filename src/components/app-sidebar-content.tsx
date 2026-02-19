import AddFolderDialog from "./add-folder-dialog";
import AppSidebarFolders from "./app-sidebar-folders";
import ChatRenameDialog from "./chat-rename-dialog";
import DeleteChatAlertDialog from "./delete-chat-alert-dialog";
import PinnedChats from "./pinned-chats";
import ShareChatDialog from "./share-chat-dialog";
import UnpinnedChats from "./unpinned-chats";

export default function AppSidebarContent() {
	return (
		<div className="space-y-3">
			<AppSidebarFolders />
			<PinnedChats />
			<AddFolderDialog />
			<UnpinnedChats />
			<DeleteChatAlertDialog />
			<ChatRenameDialog />
			<ShareChatDialog />
		</div>
	);
}
