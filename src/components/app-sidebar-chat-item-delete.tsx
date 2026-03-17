import { TrashIcon } from "@phosphor-icons/react";
import {
	setIsDeleteModalOpen,
	setSelectedChat,
} from "~/stores/chat-actions-store";
import type { SidebarChatType } from "~/types";
import { DropdownMenuItem } from "./ui/dropdown-menu";

type Props = {
	chat: SidebarChatType;
};

export default function AppSidebarChatItemDelete(props: Props) {
	return (
		<DropdownMenuItem
			onClick={(e) => {
				e.stopPropagation();
				setSelectedChat(props.chat);
				setIsDeleteModalOpen(true);
			}}
		>
			<TrashIcon />
			<span className="leading-0">Delete</span>
		</DropdownMenuItem>
	);
}
