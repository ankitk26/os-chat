import { Trash2Icon } from "lucide-react";
import type { SidebarChatType } from "~/types";
import { useChatActionStore } from "~/stores/chat-actions-store";
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
			<Trash2Icon />
			<span className="leading-0">Delete</span>
		</DropdownMenuItem>
	);
}
