import { Link } from "@tanstack/react-router";
import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { SplitIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  chat: FunctionReturnType<typeof api.chats.getPinnedChats>[0];
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
