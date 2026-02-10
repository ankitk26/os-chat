import { MessageSquareIcon } from "lucide-react";
import { Suspense } from "react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSkeleton,
} from "./ui/sidebar";
import UnpinnedChatsList from "./unpinned-chats-list";

export default function UnpinnedChats() {
	const fallbackSkeleton = (
		<SidebarGroup className="group/chat-header group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className="flex items-center justify-between gap-2 text-sm">
				<div className="flex items-center gap-2">
					<MessageSquareIcon className="size-4" />
					Chats
				</div>
			</SidebarGroupLabel>
			<SidebarMenu className="mt-2">
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
