import { Export } from "@phosphor-icons/react";
import { useChatActionStore } from "~/stores/chat-actions-store";
import type { SidebarChatType } from "~/types";
import { DropdownMenuItem } from "./ui/dropdown-menu";

type Props = {
	chat: SidebarChatType;
};

export default function AppSidebarChatItemShare(props: Props) {
	const setSelectedChat = useChatActionStore((store) => store.setSelectedChat);
	const setIsShareDialogOpen = useChatActionStore(
		(store) => store.setIsShareDialogOpen,
	);

	return (
		<DropdownMenuItem
			onClick={(e) => {
				e.stopPropagation();
				setSelectedChat(props.chat);
				setIsShareDialogOpen(true);
			}}
		>
			<Export />
			<span className="leading-0">Share</span>
		</DropdownMenuItem>
	);
}
