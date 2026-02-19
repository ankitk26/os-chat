import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { MessageSquareIcon } from "lucide-react";
import AppSidebarChatItem from "./app-sidebar-chat-item";
import DeleteAllChatsAlertDialog from "./delete-all-chats-alert-dialog";
import { SidebarGroup, SidebarMenu } from "./ui/sidebar";

export default function UnpinnedChatsList() {
	const { data: chats } = useSuspenseQuery(
		convexQuery(api.chats.getUnpinnedChats, {}),
	);

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<div className="flex items-center justify-between px-2 py-1">
				<div className="flex items-center">
					<MessageSquareIcon className="text-sidebar-foreground/70 mr-2 size-4" />
					<span className="text-sidebar-foreground/70 text-xs">Chats</span>
				</div>
				{chats.length > 0 && <DeleteAllChatsAlertDialog />}
			</div>
			<SidebarMenu>
				{chats.length === 0 && (
					<p className="text-sidebar-foreground/70 px-2 py-1 text-xs">
						No chats
					</p>
				)}
				{chats.length !== 0 &&
					chats.map((chat) => (
						<AppSidebarChatItem chat={chat} key={chat._id} />
					))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
