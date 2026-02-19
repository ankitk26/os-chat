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
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>
				<MessageSquareIcon className="size-4" />
				Chats
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
			<UnpinnedChatsList />
		</Suspense>
	);
}
