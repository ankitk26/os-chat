import type { UseChatHelpers } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { CopyIcon, PencilIcon, PencilOffIcon } from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";
import type { CustomUIMessage } from "~/types";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import { cn } from "~/lib/utils";
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import BranchOffButton from "./branch-off-button";
import MemoizedMarkdown from "./memoized-markdown";
import RetryModelDropdown from "./retry-model-dropdown";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import UserMessageEditor from "./user-message-editor";

type Props = {
	message: CustomUIMessage;
	sendMessage: UseChatHelpers<CustomUIMessage>["sendMessage"];
	regenerate: UseChatHelpers<CustomUIMessage>["regenerate"];
};

export default memo(function UserMessage({
	message,
	sendMessage,
	regenerate,
}: Props) {
	const { chatId } = useParams({ from: "/_auth/chat/$chatId" });
	const messageContent = getMessageContentFromParts(message.parts);

	const [isEditing, setIsEditing] = useState(false);

	const selectedModel = useModelStore((store) => store.selectedModel);
	const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);
	const persistedApiKeys = usePersistedApiKeysStore(
		(store) => store.persistedApiKeys,
	);
	const persistedUseOpenRouter = usePersistedApiKeysStore(
		(store) => store.persistedUseOpenRouter,
	);

	const createMessageMutation = useMutation({
		mutationFn: useConvexMutation(api.messages.createMessage),
	});

	const deleteMessagesMutation = useMutation({
		mutationFn: useConvexMutation(api.messages.deleteMessagesByTimestamp),
	});

	const handleMessageEdit = (input: string) => {
		const sourceMessageId = generateRandomUUID();

		deleteMessagesMutation.mutate({
			currentMessageSourceId: message.id,
			chatId,
			deleteCurrentMessage: true,
		});

		createMessageMutation.mutate({
			messageBody: {
				chatId,
				role: "user",
				sourceMessageId,
				parts: JSON.stringify([{ type: "text", text: input }]),
			},
		});

		sendMessage(
			{
				role: "user",
				id: sourceMessageId,
				parts: [{ type: "text", text: input }],
			},
			{
				body: {
					model: selectedModel,
					isWebSearchEnabled,
					apiKeys: persistedApiKeys,
					useOpenRouter: persistedUseOpenRouter,
					chatId,
				},
			},
		);

		setIsEditing(false);
	};

	const handleEditCancel = () => {
		setIsEditing(false);
	};

	return (
		<div className="group flex w-3/4 flex-col items-end space-y-1 self-end">
			<div
				className={cn(
					"flex w-full max-w-full flex-col gap-6 rounded-xl border px-4 py-4 text-sm wrap-break-word whitespace-pre-wrap",
					isEditing ? "bg-secondary" : "bg-popover",
				)}
			>
				{isEditing ? (
					<UserMessageEditor
						initialValue={messageContent}
						onCancel={handleEditCancel}
						onSubmit={handleMessageEdit}
					/>
				) : (
					<MemoizedMarkdown content={messageContent} id={message.id} />
				)}
			</div>
			<div className="flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={() => {
								setIsEditing((prev) => !prev);
							}}
							size="icon"
							variant="ghost"
						>
							{isEditing ? <PencilOffIcon /> : <PencilIcon />}
						</Button>
					</TooltipTrigger>
					<TooltipContent>Edit message</TooltipContent>
				</Tooltip>
				<BranchOffButton message={message} sendMessage={sendMessage} />
				<RetryModelDropdown message={message} regenerate={regenerate} />
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
});
