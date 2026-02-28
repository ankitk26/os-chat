import { convexQuery } from "@convex-dev/react-query";
import { Chat } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import AppSidebarChatItem from "./app-sidebar-chat-item";
import DeleteAllChatsAlertDialog from "./delete-all-chats-alert-dialog";
import { SidebarGroup, SidebarMenu } from "./ui/sidebar";

export default function UnpinnedChatsList() {
	const { data: chats } = useSuspenseQuery(
		convexQuery(api.chats.getUnpinnedChats, {}),
	);

	return (
		<SidebarGroup className="space-y-1 group-data-[collapsible=icon]:hidden">
			<div className="flex items-center justify-between px-2 py-1.5">
				<div className="flex items-center">
					<Chat className="text-sidebar-foreground/60 mr-2 size-4" />
					<span className="text-sidebar-foreground/50 text-xs font-normal">
						Chats
					</span>
				</div>
				{chats.length > 0 && <DeleteAllChatsAlertDialog />}
			</div>
			<SidebarMenu className="gap-0.5">
				{chats.length === 0 && (
					<p className="text-sidebar-foreground/70 px-2 py-2 text-xs">
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
