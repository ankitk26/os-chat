import { Pencil } from "@phosphor-icons/react";
import { useChatActionStore } from "~/stores/chat-actions-store";
import type { SidebarChatType } from "~/types";
import { DropdownMenuItem } from "./ui/dropdown-menu";

type Props = {
	chat: SidebarChatType;
};

export default function AppSidebarChatItemRename(props: Props) {
	const setSelectedChat = useChatActionStore((store) => store.setSelectedChat);
	const setIsRenameModalOpen = useChatActionStore(
		(store) => store.setIsRenameModalOpen,
	);

	return (
		<DropdownMenuItem
			onClick={(e) => {
				e.stopPropagation();
				setSelectedChat(props.chat);
				setIsRenameModalOpen(true);
			}}
		>
			<Pencil />
			<span className="leading-0">Rename</span>
		</DropdownMenuItem>
	);
}
