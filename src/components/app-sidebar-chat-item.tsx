import { Link, useParams } from "@tanstack/react-router";
import { useSharedChatContext } from "~/providers/chat-provider";
import type { SidebarChatType } from "~/types";
import AppSidebarChatItemActions from "./app-sidebar-chat-item-actions";
import BranchedChatIndicator from "./branched-chat-indicator";

type Props = {
	chat: SidebarChatType;
};

export default function AppSidebarChatItem({ chat }: Props) {
	const { chatId } = useParams({ strict: false });
	const { clearChat } = useSharedChatContext();

	return (
		<div className="group/chats hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm">
			{chat.isBranched && <BranchedChatIndicator chat={chat} />}

			<Link
				activeProps={{ className: "bg-secondary text-secondary-foreground" }}
				className="flex flex-1 items-center overflow-hidden"
				onClick={() => {
					if (chatId === chat.uuid) {
						return;
					}
					clearChat();
				}}
				params={{ chatId: chat.uuid }}
				to="/chat/$chatId"
			>
				<h4 className="line-clamp-1 w-full" title={chat.title}>
					{chat.title}
				</h4>
			</Link>

			<AppSidebarChatItemActions chat={chat} />
		</div>
	);
}
