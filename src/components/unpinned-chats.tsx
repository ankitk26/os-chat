import { ChatIcon } from "@phosphor-icons/react";
import { Suspense } from "react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSkeleton,
} from "./ui/sidebar";
import UnpinnedChatsList from "./unpinned-chats-list";

export default function UnpinnedChats() {
	const fallbackSkeleton = (
		<SidebarGroup className="space-y-1 group-data-[collapsible=icon]:hidden">
			<div className="flex items-center px-2 py-1.5">
				<ChatIcon className="mr-2 size-4 text-sidebar-foreground/60" />
				<span className="text-xs font-normal text-sidebar-foreground/50">
					Chats
				</span>
			</div>
			<SidebarMenu className="gap-0.5">
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
			<UnpinnedChatsList />
		</Suspense>
	);
}
