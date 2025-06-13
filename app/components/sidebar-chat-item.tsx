import { Link } from "@tanstack/react-router";
import { Id } from "convex/_generated/dataModel";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  chat: {
    _id: Id<"chats">;
    _creationTime: number;
    userId: string;
    title: string;
  };
};

export default function SidebarChatItem({ chat }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to="/chat/$chatId"
          params={{ chatId: chat._id }}
          className="px-4 py-2 text-sm truncate rounded cursor-pointer hover:bg-primary/10 hover:text-primary dark:hover:bg-secondary dark:hover:text-secondary-foreground"
        >
          {chat.title}
        </Link>
      </TooltipTrigger>
      <TooltipContent>{chat.title}</TooltipContent>
    </Tooltip>
  );
}
