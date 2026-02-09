import { Share2Icon } from "lucide-react";
import type { SidebarChatType } from "~/types";
import { useChatActionStore } from "~/stores/chat-actions-store";
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
			<Share2Icon />
			<span className="leading-0">Share</span>
		</DropdownMenuItem>
	);
}
