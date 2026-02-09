import type { Doc } from "convex/_generated/dataModel";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import MemoizedMarkdown from "./memoized-markdown";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	message: Omit<Doc<"messages">, "userId">;
};

export default function ReadOnlyUserMessage({ message }: Props) {
	const messageContent = getMessageContentFromParts(JSON.parse(message.parts));

	return (
		<div className="group flex w-3/4 flex-col items-end space-y-1 self-end">
			{/* Message bubble */}
			<div className="bg-popover flex w-full max-w-full flex-col gap-6 rounded-xl border px-4 py-4 text-sm wrap-break-word whitespace-pre-wrap">
				<MemoizedMarkdown content={messageContent} id={message._id} />
			</div>

			{/* Copy button container */}
			<div className="flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={async () => {
								await navigator.clipboard.writeText(messageContent);
								toast.success("Copied to clipboard");
							}}
							size="icon"
							variant="ghost"
						>
							<CopyIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Copy to clipboard</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
