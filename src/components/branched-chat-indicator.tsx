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

	const handleClick = () => {
		clearChat();
	};

	if (!props.chat.parentChat?.uuid) {
		return (
			<Tooltip>
				<TooltipTrigger
					render={
						<span>
							<SplitIcon className="text-sidebar-foreground/70 size-4 shrink-0" />
						</span>
					}
				/>
				<TooltipContent>Parent chat does not exist</TooltipContent>
			</Tooltip>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Link
						to="/chat/$chatId"
						params={{ chatId: props.chat.parentChat.uuid }}
						onClick={handleClick}
						className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex cursor-pointer items-center justify-center rounded p-0.5"
					>
						<SplitIcon className="size-4 shrink-0" />
					</Link>
				}
			/>
			<TooltipContent>
				Branched from {props.chat.parentChat.title}
			</TooltipContent>
		</Tooltip>
	);
}
