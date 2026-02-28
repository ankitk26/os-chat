import { convexQuery } from "@convex-dev/react-query";
import { PushPinIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import AppSidebarChatItem from "./app-sidebar-chat-item";
import { SidebarGroup, SidebarMenu } from "./ui/sidebar";

export default function PinnedChatsList() {
	const { data: chatsData } = useSuspenseQuery(
		convexQuery(api.chats.getPinnedChats, {}),
	);

	if (chatsData.length === 0) {
		return null;
	}

	return (
		<SidebarGroup className="space-y-1 group-data-[collapsible=icon]:hidden">
			<div className="flex items-center px-2 py-1.5">
				<PushPinIcon className="text-sidebar-foreground/60 mr-2 size-4" />
				<span className="text-sidebar-foreground/50 text-xs font-normal">
					Pinned chats
				</span>
			</div>

			<SidebarMenu className="gap-0.5">
				{chatsData.map((chat) => (
					<AppSidebarChatItem chat={chat} key={chat._id} />
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
