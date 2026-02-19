import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { PinIcon } from "lucide-react";
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
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<div className="flex items-center px-2 py-1">
				<PinIcon className="text-sidebar-foreground/70 mr-2 size-4" />
				<span className="text-sidebar-foreground/70 text-xs">Pinned chats</span>
			</div>

			<SidebarMenu>
				{chatsData.map((chat) => (
					<AppSidebarChatItem chat={chat} key={chat._id} />
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
