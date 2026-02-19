import { Link } from "@tanstack/react-router";
import { SplitIcon } from "lucide-react";
import { useSharedChatContext } from "~/providers/chat-provider";
import type { SidebarChatType } from "~/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	chat: SidebarChatType;
};

export default function BranchedChatIndicator(props: Props) {
	const { clearChat } = useSharedChatContext();

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Link
						onClick={() => clearChat()}
						params={{ chatId: props.chat.parentChat?.uuid ?? props.chat.uuid }}
						to="/chat/$chatId"
					/>
				}
			>
				<SplitIcon className="text-muted-foreground hover:text-secondary-foreground mr-2 size-4 cursor-pointer" />
			</TooltipTrigger>
			<TooltipContent>
				{props.chat.parentChat?.title
					? `Branched from ${props.chat.parentChat?.title}`
					: `Parent chat does not exist`}
			</TooltipContent>
		</Tooltip>
	);
}
