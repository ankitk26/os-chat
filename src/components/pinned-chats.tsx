import { PinIcon } from "lucide-react";
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
			<SidebarGroupLabel className="flex items-center gap-2 text-sm">
				<PinIcon />
				Pinned chats
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
			<PinnedChatsList />
		</Suspense>
	);
}
