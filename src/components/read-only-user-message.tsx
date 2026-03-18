import { CopyIcon } from "@phosphor-icons/react";
import type { Doc } from "convex/_generated/dataModel";
import { toast } from "sonner";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	message: Omit<Doc<"messages">, "userId">;
};

export default function ReadOnlyUserMessage({ message }: Props) {
	const messageContent = getMessageContentFromParts(JSON.parse(message.parts));

	return (
		<div className="group flex w-full max-w-[90%] flex-col items-end space-y-3 self-end md:w-3/4">
			{/* Message bubble */}
			<div className="flex w-full max-w-full flex-col gap-6 rounded-lg border bg-popover px-4 py-4 text-sm wrap-break-word whitespace-pre-wrap">
				<span className="whitespace-pre-wrap">{messageContent}</span>
			</div>

			{/* Copy button container */}
			<div className="flex opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								onClick={async () => {
									await navigator.clipboard.writeText(messageContent);
									toast.success("Copied to clipboard");
								}}
								size="icon"
								variant="ghost"
							/>
						}
					>
						<CopyIcon />
					</TooltipTrigger>
					<TooltipContent>Copy to clipboard</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
