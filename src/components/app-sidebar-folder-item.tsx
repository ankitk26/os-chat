import { useState } from "react";
import type { SidebarFolder } from "~/types";
import AppSidebarChatItem from "./app-sidebar-chat-item";
import AppSidebarFolderItemActions from "./app-sidebar-folder-item-actions";
import AppSidebarFolderItemToggler from "./app-sidebar-folder-item-toggler";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuAction,
	SidebarMenuSub,
} from "./ui/sidebar";

type Props = {
	folder: SidebarFolder;
};

export default function AppSidebarFolderItem(props: Props) {
	const [showChats, setShowChats] = useState(false);

	return (
		<>
			<SidebarMenuItem>
				<SidebarMenuButton
					onClick={() => setShowChats((prev) => !prev)}
					tooltip={props.folder.title}
				>
					<AppSidebarFolderItemToggler
						folderHasChats={props.folder.chats.length > 0}
						showChats={showChats}
					/>
					<span className="line-clamp-1 flex-1" title={props.folder.title}>
						{props.folder.title}
					</span>
				</SidebarMenuButton>
				<SidebarMenuAction showOnHover>
					<AppSidebarFolderItemActions folder={props.folder} />
				</SidebarMenuAction>
			</SidebarMenuItem>

			{/* Chats under the folder */}
			{props.folder.chats.length > 0 && showChats && (
				<SidebarMenuSub className="mr-0 border-r-0 pr-0">
					{props.folder.chats.map((chat) => (
						<AppSidebarChatItem chat={chat} key={chat._id} />
					))}
				</SidebarMenuSub>
			)}
		</>
	);
}
