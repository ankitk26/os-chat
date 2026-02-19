import { EllipsisVerticalIcon } from "lucide-react";
import { Suspense } from "react";
import type { SidebarChatType } from "~/types";
import AppSidebarChatItemDelete from "./app-sidebar-chat-item-delete";
import AppSidebarChatItemFolder from "./app-sidebar-chat-item-folder";
import AppSidebarChatItemPin from "./app-sidebar-chat-item-pin";
import AppSidebarChatItemRename from "./app-sidebar-chat-item-rename";
import AppSidebarChatItemShare from "./app-sidebar-chat-item-share";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

type Props = {
	chat: SidebarChatType;
};

export default function AppSidebarChatItemActions(props: Props) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<div className="flex h-full w-full cursor-pointer items-center justify-center">
						<EllipsisVerticalIcon className="size-4" />
					</div>
				}
			/>
			<DropdownMenuContent className="w-50" side="right" align="start">
				<AppSidebarChatItemRename chat={props.chat} />
				<AppSidebarChatItemPin chat={props.chat} />
				<AppSidebarChatItemDelete chat={props.chat} />
				<AppSidebarChatItemShare chat={props.chat} />
				<Suspense fallback={<Skeleton className="h-3 w-3/4" />}>
					<AppSidebarChatItemFolder chat={props.chat} />
				</Suspense>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
