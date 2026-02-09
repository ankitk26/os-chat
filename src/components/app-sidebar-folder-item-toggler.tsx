import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	showChats: boolean;
	folderHasChats: boolean;
};

export default function AppSidebarFolderItemToggler(props: Props) {
	return (
		<Tooltip>
			<TooltipTrigger>
				{props.folderHasChats &&
					(props.showChats ? (
						<ChevronDownIcon className="text-muted-foreground hover:text-secondary-foreground mr-2 size-4 cursor-pointer" />
					) : (
						<ChevronRightIcon className="text-muted-foreground hover:text-secondary-foreground mr-2 size-4 cursor-pointer" />
					))}
			</TooltipTrigger>
			<TooltipContent>View chats</TooltipContent>
		</Tooltip>
	);
}
