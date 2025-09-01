import { useChat } from "@ai-sdk/react";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSharedChatContext } from "~/providers/chat-provider";
import type { CustomUIMessage } from "~/types";
import AiResponseAlert from "./ai-response-error";
import ChatLoadingIndicator from "./chat-loading-indicator";
import ChatMessages from "./chat-messages";
import EmptyChatContent from "./empty-chat-content";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
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
  } = useChat<CustomUIMessage>({
    chat,
    id: chatId,
    experimental_throttle: 100,
    messages: dbMessages,
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const checkScrollPosition = () => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) {
      return;
    }

    const viewport = scrollArea.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
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
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) {
      return;
    }

    const viewport = scrollArea.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (!viewport) {
      return;
    }

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: checkScrollPosition should not be added to dependency
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) {
      return;
    }

    const viewport = scrollArea.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
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

  // Auto-scroll to bottom when new messages arrive (optional)
  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollToBottom should not be added
  useEffect(() => {
    if (status === "submitted") {
      const timerSeconds = 100;
      const timer = setTimeout(() => {
        scrollToBottom();
      }, timerSeconds);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  useEffect(() => {
    setMessages(dbMessages);
  }, [dbMessages]);

  return (
    <div className="relative mx-auto flex h-svh max-h-svh w-full flex-col">
      {/* Full height scroll area that extends behind the prompt */}
      <div className="absolute inset-0">
        {!isMessagesPending && messages.length === 0 && <EmptyChatContent />}

        {chatId && (
          <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
            <div className="mx-auto h-full w-full max-w-full px-2 lg:max-w-3xl lg:px-4">
              <div className="my-4 space-y-6 pb-40 lg:my-8 lg:space-y-8 lg:pb-32">
                <ChatMessages
                  messages={messages}
                  regenerate={regenerate}
                  sendMessage={sendMessage}
                />
                {status === "submitted" &&
                  messages.length > 0 &&
                  messages.at(-1)?.role === "user" && <ChatLoadingIndicator />}
                {error && <AiResponseAlert error={error} />}
              </div>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Scroll to bottom button - centered at top of prompt */}
      {showScrollToBottom && (
        <div className="-translate-x-1/2 absolute bottom-44 left-1/2 z-50 transform lg:bottom-36">
          <Button
            className="rounded-full"
            onClick={scrollToBottom}
            size="icon"
            variant="outline"
          >
            <ChevronDownIcon className="size-4" />
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
        />
      </div>
    </div>
  );
}
