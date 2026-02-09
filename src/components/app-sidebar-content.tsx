import AddFolderDialog from "./add-folder-dialog";
import AppSidebarFolders from "./app-sidebar-folders";
import ChatRenameDialog from "./chat-rename-dialog";
import DeleteChatAlertDialog from "./delete-chat-alert-dialog";
import PinnedChats from "./pinned-chats";
import ShareChatDialog from "./share-chat-dialog";
import { ScrollArea } from "./ui/scroll-area";
import UnpinnedChats from "./unpinned-chats";

export default function AppSidebarContent() {
	return (
		<ScrollArea className="h-full w-full pb-20">
			<div className="space-y-4">
				<AppSidebarFolders />
				<PinnedChats />
				<AddFolderDialog />
				<UnpinnedChats />
				<DeleteChatAlertDialog />
				<ChatRenameDialog />
				<ShareChatDialog />
			</div>
		</ScrollArea>
	);
}
