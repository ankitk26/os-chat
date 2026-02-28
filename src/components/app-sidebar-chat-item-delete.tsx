import { Trash } from "@phosphor-icons/react";
import { useChatActionStore } from "~/stores/chat-actions-store";
import type { SidebarChatType } from "~/types";
import { DropdownMenuItem } from "./ui/dropdown-menu";

type Props = {
	chat: SidebarChatType;
};

export default function AppSidebarChatItemDelete(props: Props) {
	const setSelectedChat = useChatActionStore((store) => store.setSelectedChat);
	const setIsDeleteModalOpen = useChatActionStore(
		(store) => store.setIsDeleteModalOpen,
	);

	return (
		<DropdownMenuItem
			onClick={(e) => {
				e.stopPropagation();
				setSelectedChat(props.chat);
				setIsDeleteModalOpen(true);
			}}
		>
			<Trash />
			<span className="leading-0">Delete</span>
		</DropdownMenuItem>
	);
}
