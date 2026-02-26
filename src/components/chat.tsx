import { useChat } from "@ai-sdk/react";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSharedChatContext } from "~/providers/chat-provider";
import type { CustomUIMessage } from "~/types";
import AiResponseAlert from "./ai-response-error";
import AssistantMessageSkeleton from "./assistant-message-skeleton";
import ChatMessages from "./chat-messages";
import EmptyChatContent from "./empty-chat-content";
import ThinkingIndicator from "./thinking-indicator";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import UserMessageSkeleton from "./user-message-skeleton";
import UserPromptInput from "./user-prompt-input";

type Props = {
	chatId: string;
	dbMessages: CustomUIMessage[];
	isMessagesPending?: boolean;
};

export default function Chat({
	chatId,
	dbMessages,
	isMessagesPending = false,
}: Props) {
	const { chat } = useSharedChatContext();

	const {
		messages,
		status,
		stop,
		regenerate,
		sendMessage,
		error,
		setMessages,
	} = useChat<CustomUIMessage>({ chat, id: chatId });

	const viewportRef = useRef<HTMLDivElement>(null);
	const [showScrollToBottom, setShowScrollToBottom] = useState(false);
	const [inputHeight, setInputHeight] = useState(120); // Default estimate

	const checkScrollPosition = () => {
		const viewport = viewportRef.current;

		if (!viewport) {
			return;
		}

		const { scrollTop, scrollHeight, clientHeight } = viewport;
		const isScrollable = scrollHeight > clientHeight;
		const bottomThreshold = 100;
		const isNearBottom =
			scrollTop + clientHeight >= scrollHeight - bottomThreshold;

		setShowScrollToBottom(isScrollable && !isNearBottom);
	};

	const scrollToBottom = () => {
		const viewport = viewportRef.current;
		if (!viewport) {
			return;
		}

		viewport.scrollTo({
			top: viewport.scrollHeight,
			behavior: "instant",
		});
	};

	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport) {
			return;
		}

		viewport.addEventListener("scroll", checkScrollPosition);

		// Check initial scroll position
		checkScrollPosition();

		return () => {
			viewport.removeEventListener("scroll", checkScrollPosition);
		};
	}, [messages]);

	useEffect(() => {
		setMessages(dbMessages);
	}, [setMessages, dbMessages]);

	return (
		<div className="relative mx-auto flex h-full min-h-0 w-full flex-col">
			{/* Full height scroll area that extends behind the prompt */}
			<div className="absolute inset-0">
				{!isMessagesPending && messages.length === 0 && <EmptyChatContent />}

				{chatId && (
					<ScrollArea className="h-full w-full" viewportRef={viewportRef}>
						<div className="mx-auto min-h-full w-full max-w-full px-3 lg:max-w-3xl lg:px-4">
							<div
								className="pb-safe my-4 space-y-6 lg:my-8 lg:space-y-8"
								style={{ paddingBottom: `${inputHeight + 40}px` }}
							>
								{isMessagesPending ? (
									<>
										<UserMessageSkeleton />
										<AssistantMessageSkeleton />
									</>
								) : (
									<>
										<ChatMessages
											chatId={chatId}
											messages={messages}
											regenerate={regenerate}
											sendMessage={sendMessage}
										/>
										{status === "submitted" &&
											messages.length > 0 &&
											messages.at(-1)?.role === "user" && (
												<div className="px-3 lg:px-0">
													<ThinkingIndicator />
												</div>
											)}
										{error && <AiResponseAlert error={error} />}
									</>
								)}
							</div>
						</div>
					</ScrollArea>
				)}
			</div>

			{/* Scroll to bottom button - centered at top of prompt */}
			{showScrollToBottom && (
				<div
					className="absolute left-1/2 z-50 -translate-x-1/2 transform"
					style={{ bottom: `${inputHeight + 16}px` }}
				>
					<Button className="rounded-full" onClick={scrollToBottom} size="icon">
						<ChevronDownIcon />
					</Button>
				</div>
			)}

			{/* Fixed prompt input with backdrop blur */}
			<div className="absolute right-0 bottom-0 left-0 z-10">
				<UserPromptInput
					chatId={chatId}
					sendMessage={sendMessage}
					status={status}
					stop={stop}
					onHeightChange={setInputHeight}
				/>
			</div>
		</div>
	);
}
