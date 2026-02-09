import { Link } from "@tanstack/react-router";
import { SplitIcon } from "lucide-react";
import type { SidebarChatType } from "~/types";
import { useSharedChatContext } from "~/providers/chat-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	chat: SidebarChatType;
};

export default function BranchedChatIndicator(props: Props) {
	const { clearChat } = useSharedChatContext();

	return (
		<Tooltip>
			<TooltipTrigger>
				<Link
					onClick={() => clearChat()}
					params={{ chatId: props.chat.parentChat?.uuid ?? props.chat.uuid }}
					to="/chat/$chatId"
				>
					<SplitIcon className="text-muted-foreground hover:text-secondary-foreground mr-2 size-4 cursor-pointer" />
				</Link>
			</TooltipTrigger>
			<TooltipContent>
				Branched from {props.chat.parentChat?.title}
			</TooltipContent>
		</Tooltip>
	);
}
