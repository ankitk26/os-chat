import { Link } from "@tanstack/react-router";
import { SplitIcon } from "lucide-react";
import type { SidebarChatType } from "~/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  chat: SidebarChatType;
};

export default function BranchedChatIndicator(props: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          params={{ chatId: props.chat.parentChat?.uuid ?? props.chat.uuid }}
          to="/chat/$chatId"
        >
          <SplitIcon className="mr-2 size-4 cursor-pointer text-muted-foreground hover:text-secondary-foreground" />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        Branched from {props.chat.parentChat?.title}
      </TooltipContent>
    </Tooltip>
  );
}
