import { Link } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  chat: {
    uuid: string;
    _creationTime: number;
    userId: string;
    title: string;
  };
};

export default function SidebarChatItem({ chat }: Props) {
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Link
          to="/chat/$chatId"
          params={{ chatId: chat.uuid }}
          className="flex w-full min-w-0 px-4 py-2 text-sm rounded cursor-pointer hover:bg-primary/10 hover:text-primary dark:hover:bg-secondary dark:hover:text-secondary-foreground"
        >
          <span>{chat.title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent>{chat.title}</TooltipContent>
    </Tooltip>
  );
}
