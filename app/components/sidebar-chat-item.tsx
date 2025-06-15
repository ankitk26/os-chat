import { Link } from "@tanstack/react-router";
import { Doc } from "convex/_generated/dataModel";

type Props = {
  chat: Doc<"chats">;
};

export default function SidebarChatItem({ chat }: Props) {
  return (
    <Link
      to="/chat/$chatId"
      params={{ chatId: chat.uuid }}
      activeProps={{
        className: "bg-primary/10 text-primary dark:bg-secondary",
      }}
      className="flex w-full min-w-0 px-2 py-2 text-sm rounded cursor-pointer hover:bg-primary/10 hover:text-primary dark:hover:bg-secondary dark:hover:text-secondary-foreground"
    >
      <span>{chat.title}</span>
    </Link>
  );
}
