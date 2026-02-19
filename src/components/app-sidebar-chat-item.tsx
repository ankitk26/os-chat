import { Link, useParams } from "@tanstack/react-router";
import { useSharedChatContext } from "~/providers/chat-provider";
import type { SidebarChatType } from "~/types";
import AppSidebarChatItemActions from "./app-sidebar-chat-item-actions";
import BranchedChatIndicator from "./branched-chat-indicator";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuAction,
} from "./ui/sidebar";

type Props = {
	chat: SidebarChatType;
};

export default function AppSidebarChatItem({ chat }: Props) {
	const { chatId } = useParams({ strict: false });
	const { clearChat } = useSharedChatContext();
	const isActive = chatId === chat.uuid;

	const handleClick = () => {
		if (chatId === chat.uuid) {
			return;
		}
		clearChat();
	};

	return (
		<SidebarMenuItem>
			<Link
				onClick={handleClick}
				params={{ chatId: chat.uuid }}
				to="/chat/$chatId"
				className="flex w-full"
			>
				<SidebarMenuButton
					isActive={isActive}
					tooltip={chat.title}
					className="w-full"
				>
					{chat.isBranched && <BranchedChatIndicator chat={chat} />}
					<span className="line-clamp-1 flex-1" title={chat.title}>
						{chat.title}
					</span>
				</SidebarMenuButton>
			</Link>
			<SidebarMenuAction showOnHover>
				<AppSidebarChatItemActions chat={chat} />
			</SidebarMenuAction>
		</SidebarMenuItem>
	);
}
