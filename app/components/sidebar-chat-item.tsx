import { Link } from "@tanstack/react-router";
import { Doc } from "convex/_generated/dataModel";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  chat: Doc<"chats">;
};

export default function SidebarChatItem({ chat }: Props) {
  return (
    <Link
      to="/chat/$chatId"
      params={{ chatId: chat.uuid }}
      className="flex items-center justify-between py-1 pl-2 text-sm rounded cursor-pointer hover:bg-primary/10 hover:text-primary dark:hover:bg-secondary dark:hover:text-secondary-foreground"
    >
      <h4 className="line-clamp-1">{chat.title}</h4>
      <Button size="icon" variant="ghost">
        <EllipsisVerticalIcon />
      </Button>
    </Link>
  );
}
