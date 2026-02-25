import { useState } from "react";
import type { SidebarFolder } from "~/types";
import AppSidebarChatItem from "./app-sidebar-chat-item";
import AppSidebarFolderItemActions from "./app-sidebar-folder-item-actions";
import AppSidebarFolderItemToggler from "./app-sidebar-folder-item-toggler";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	useSidebar,
} from "./ui/sidebar";

type Props = {
	folder: SidebarFolder;
};

export default function AppSidebarFolderItem(props: Props) {
	const [showChats, setShowChats] = useState(false);
	const { isMobile } = useSidebar();

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setShowChats((prev) => !prev);
	};

	return (
		<>
			<SidebarMenuItem className="relative">
				<SidebarMenuButton
					onClick={handleClick}
					tooltip={props.folder.title}
					className="w-full pr-8 md:pr-7"
				>
					<AppSidebarFolderItemToggler
						folderHasChats={props.folder.chats.length > 0}
						showChats={showChats}
					/>
					<span className="line-clamp-1 flex-1" title={props.folder.title}>
						{props.folder.title}
					</span>
				</SidebarMenuButton>
				<div
					className={
						isMobile
							? "absolute top-1/2 right-1 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center"
							: "absolute top-1/2 right-1 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center opacity-0 transition-opacity group-hover/menu-item:opacity-100"
					}
				>
					<AppSidebarFolderItemActions folder={props.folder} />
				</div>
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
