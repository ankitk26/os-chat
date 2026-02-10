import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { PinIcon } from "lucide-react";
import AppSidebarChatItem from "./app-sidebar-chat-item";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "./ui/sidebar";

export default function PinnedChatsList() {
	const { data: chatsData } = useSuspenseQuery(
		convexQuery(api.chats.getPinnedChats, {}),
	);

	if (chatsData.length === 0) {
		return null;
	}

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className="flex items-center gap-2 text-sm">
				<PinIcon />
				Pinned chats
			</SidebarGroupLabel>

			<SidebarMenu className="mt-2">
				{chatsData.map((chat) => (
					<AppSidebarChatItem chat={chat} key={chat._id} />
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
