import { PushPin } from "@phosphor-icons/react";
import { Suspense } from "react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import PinnedChatsList from "./pinned-chats-list";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSkeleton,
} from "./ui/sidebar";

export default function PinnedChats() {
	const fallbackSkeleton = (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>
				<PushPin className="size-4" />
				Pinned chats
			</SidebarGroupLabel>
			<SidebarMenu>
				{Array.from({ length: 3 }).map(() => (
					<SidebarMenuItem key={generateRandomUUID()}>
						<SidebarMenuSkeleton />
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);

	return (
		<Suspense fallback={fallbackSkeleton}>
			<PinnedChatsList />
		</Suspense>
	);
}
