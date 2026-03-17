import { ExportIcon } from "@phosphor-icons/react";
import {
	setIsShareDialogOpen,
	setSelectedChat,
} from "~/stores/chat-actions-store";
import type { SidebarChatType } from "~/types";
import { DropdownMenuItem } from "./ui/dropdown-menu";

type Props = {
	chat: SidebarChatType;
};

export default function AppSidebarChatItemShare(props: Props) {
	return (
		<DropdownMenuItem
			onClick={(e) => {
				e.stopPropagation();
				setSelectedChat(props.chat);
				setIsShareDialogOpen(true);
			}}
		>
			<ExportIcon />
			<span className="leading-0">Share</span>
		</DropdownMenuItem>
	);
}
