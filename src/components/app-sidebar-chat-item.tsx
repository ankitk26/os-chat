import { Link } from "@tanstack/react-router";
import { useSharedChatContext } from "~/providers/chat-provider";
import type { SidebarChatType } from "~/types";
import AppSidebarChatItemActions from "./app-sidebar-chat-item-actions";
import BranchedChatIndicator from "./branched-chat-indicator";

type Props = {
  chat: SidebarChatType;
};

export default function AppSidebarChatItem({ chat }: Props) {
  const { clearChat } = useSharedChatContext();

  return (
    <Link
      activeProps={{ className: "bg-secondary text-secondary-foreground" }}
      className="group/chats flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground"
      onClick={() => clearChat()}
      params={{ chatId: chat.uuid }}
      to="/chat/$chatId"
    >
      {chat.isBranched && <BranchedChatIndicator chat={chat} />}

      <h4 className="line-clamp-1 w-full" title={chat.title}>
        {chat.title}
      </h4>

      <AppSidebarChatItemActions chat={chat} />
    </Link>
  );
}
