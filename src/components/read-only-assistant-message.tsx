import { Copy } from "@phosphor-icons/react";
import type { Doc } from "convex/_generated/dataModel";
import { toast } from "sonner";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import type { CustomUIMessage } from "~/types";
import AIResponseContent from "./ai-response-content";
import AIResponseReasoning from "./ai-response-reasoning";
import AIResponseSources from "./ai-response-sources";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	message: Omit<Doc<"messages">, "userId">;
};

export default function ReadOnlyAssistantMessage({ message }: Props) {
	const messageMetadata = JSON.parse(
		message.metadata ?? "{}",
	) as CustomUIMessage["metadata"];

	const messageContent = getMessageContentFromParts(JSON.parse(message.parts));
	const messageId = message.sourceMessageId;
	const messageParts = JSON.parse(message.parts) as CustomUIMessage["parts"];

	return (
		<div className="space-y-4">
			<AIResponseReasoning
				messageContent={messageContent}
				messageId={messageId}
				parts={messageParts}
			/>
			<AIResponseContent
				messageContent={messageContent}
				messageId={messageId}
			/>
			<AIResponseSources parts={messageParts} />
			<div className="flex items-center gap-1.5 transition-opacity duration-200">
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
						<Copy />
					</TooltipTrigger>
					<TooltipContent>Copy to clipboard</TooltipContent>
				</Tooltip>

				<span className="text-muted-foreground text-xs">
					{messageMetadata?.model}
				</span>
			</div>
		</div>
	);
}
