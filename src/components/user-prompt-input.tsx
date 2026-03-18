import type { UseChatHelpers } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { ChatStatus } from "ai";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import { useIsDesktop } from "~/hooks/use-desktop";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import { getChatTitle } from "~/server-fns/get-chat-title";
import { useModelStore } from "~/stores/model-store";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import type { CustomUIMessage } from "~/types";
import PromptActions from "./prompt-actions";

type Props = {
	chatId: string;
	status: ChatStatus;
	stop: UseChatHelpers<CustomUIMessage>["stop"];
	sendMessage: UseChatHelpers<CustomUIMessage>["sendMessage"];
	onHeightChange?: (height: number) => void;
};

export default function UserPromptInput(props: Props) {
	const { chatId: paramsChatId } = useParams({ strict: false });

	const [input, setInput] = useState("");

	const navigate = useNavigate();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const isDesktop = useIsDesktop();
	const selectedModel = useModelStore((store) => store.selectedModel);
	const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);
	const persistedApiKeys = usePersistedApiKeysStore(
		(store) => store.persistedApiKeys,
	);
	const persistedUseOpenRouter = usePersistedApiKeysStore(
		(store) => store.persistedUseOpenRouter,
	);

	const updateChatTitleMutation = useMutation({
		mutationFn: useConvexMutation(api.chats.updateChatTitle),
	});
	const createMessageMutation = useMutation({
		mutationFn: useConvexMutation(api.messages.createMessage),
	});
	const createChatMutation = useMutation({
		mutationFn: useConvexMutation(api.chats.createChat),
	});

	const handleChatTitleUpdate = async (dbGeneratedChatId: Id<"chats">) => {
		const title = await getChatTitle({ data: { userMessage: input } });
		await updateChatTitleMutation.mutateAsync({
			chat: { chatId: dbGeneratedChatId, title: title as string },
		});
	};

	const handlePromptSubmit = async () => {
		if (!textareaRef.current?.value) {
			return;
		}

		const sourceMessageId = generateRandomUUID();
		const messageText = input;

		// Send message optimistically BEFORE navigation so it's in state
		props.sendMessage(
			{
				role: "user",
				id: sourceMessageId,
				parts: [{ type: "text", text: messageText }],
			},
			{
				body: {
					model: selectedModel,
					isWebSearchEnabled,
					apiKeys: persistedApiKeys,
					useOpenRouter: persistedUseOpenRouter,
					chatId: props.chatId,
				},
			},
		);

		// Clear input immediately for better UX
		setInput("");

		if (!paramsChatId) {
			// Navigate to chat page after optimistic message is sent
			navigate({
				to: "/chat/$chatId",
				params: { chatId: props.chatId },
			});
			const dbGeneratedChatId = await createChatMutation.mutateAsync({
				uuid: props.chatId,
			});
			handleChatTitleUpdate(dbGeneratedChatId);
		}

		// Persist message to database
		createMessageMutation.mutate({
			messageBody: {
				chatId: props.chatId,
				role: "user",
				sourceMessageId,
				parts: JSON.stringify([{ type: "text", text: messageText }]),
			},
		});
	};

	const resizeTextarea = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	// Resize when the textarea value changes.
	useEffect(() => {
		resizeTextarea();
	}, [input]);

	// Measure and report height changes
	useEffect(() => {
		if (containerRef.current && props.onHeightChange) {
			const height = containerRef.current.getBoundingClientRect().height;
			props.onHeightChange(height);
		}
	}, [input, props.onHeightChange]);

	// Focus the textarea on desktop for all chats, on mobile/tablet only for new chats.
	useEffect(() => {
		if (textareaRef.current && (isDesktop || !paramsChatId)) {
			textareaRef.current.focus();
		}
	}, [props.chatId, isDesktop, paramsChatId]);

	return (
		<div ref={containerRef} className="bg-background/80 backdrop-blur">
			<form
				className="mx-auto flex w-full max-w-full flex-col rounded-tl-lg rounded-tr-lg border border-border bg-popover/90 p-3 lg:max-w-3xl lg:p-4"
				onSubmit={(e) => {
					e.preventDefault();
					handlePromptSubmit();
				}}
			>
				<div className="flex-1">
					<textarea
						className="max-h-80 min-h-8 w-full resize-none text-sm focus:outline-none"
						disabled={
							createChatMutation.isPending || createMessageMutation.isPending
						}
						onChange={(e) => {
							setInput(e.target.value);
							// resizeTextarea();
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handlePromptSubmit();
							}
						}}
						placeholder="Start the conversation..."
						ref={textareaRef}
						rows={1}
						value={input}
					/>
				</div>

				<PromptActions status={props.status} stop={props.stop} />
			</form>
		</div>
	);
}
