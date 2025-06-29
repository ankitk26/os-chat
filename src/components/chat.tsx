import { useChat } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import AiResponseAlert from "./ai-response-error";
import AssistantMessageSkeleton from "./assistant-message-skeleton";
import ChatLoadingIndicator from "./chat-loading-indicator";
import ChatMessages from "./chat-messages";
import EmptyChatContent from "./empty-chat-content";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import UserMessageSkeleton from "./user-message-skeleton";
import UserPromptInput from "./user-prompt-input";

type Props = {
  chatId: string;
  dbMessages: Doc<"messages">[];
  isMessagesPending?: boolean;
};

export default function Chat({
  chatId,
  dbMessages,
  isMessagesPending = false,
}: Props) {
  const { auth } = useRouteContext({ from: "/_auth" });

  const insertAiMessageMutation = useMutation({
    mutationFn: useConvexMutation(api.messages.createMessage),
  });

  const {
    messages,
    input,
    status,
    setInput,
    stop,
    reload,
    append,
    error,
    setMessages,
  } = useChat({
    id: chatId,
    experimental_throttle: 200,
    initialMessages:
      dbMessages?.map((message) => {
        return {
          id: message.sourceMessageId ?? message._id,
          role: message.role,
          annotations: JSON.parse(message.annotations),
          content: message.content,
          parts: JSON.parse(message.parts),
          createdAt: new Date(message._creationTime),
        };
      }) ?? [],
    generateId: generateRandomUUID,
    onFinish: (newMessage) => {
      if (!chatId) return;
      if (!newMessage.content) return;

      insertAiMessageMutation.mutate({
        messageBody: {
          chatId,
          annotations: JSON.stringify(newMessage.annotations),
          parts: JSON.stringify(newMessage.parts),
          role: "assistant",
          sourceMessageId: newMessage.id,
          content: newMessage.content,
        },
        sessionToken: auth.session.token,
      });
    },
  });

  console.log(messages);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const checkScrollPosition = () => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const viewport = scrollArea.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (!viewport) return;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const isScrollable = scrollHeight > clientHeight;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold

    setShowScrollToBottom(isScrollable && !isNearBottom);
  };

  const scrollToBottom = () => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const viewport = scrollArea.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (!viewport) return;

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: "instant",
    });
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const viewport = scrollArea.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (!viewport) return;

    viewport.addEventListener("scroll", checkScrollPosition);

    // Check initial scroll position
    checkScrollPosition();

    return () => {
      viewport.removeEventListener("scroll", checkScrollPosition);
    };
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive (optional)
  useEffect(() => {
    if (status === "streaming") {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length, status]);

  return (
    <div className="relative flex flex-col w-full mx-auto max-h-svh h-svh">
      {/* Full height scroll area that extends behind the prompt */}
      <div className="absolute inset-0">
        {!isMessagesPending && messages.length === 0 && <EmptyChatContent />}

        {chatId && (
          <ScrollArea className="w-full h-full" ref={scrollAreaRef}>
            <div className="w-full h-full max-w-3xl mx-auto">
              <div className="my-8 space-y-4 pb-32">
                {isMessagesPending && status !== "submitted" ? (
                  <>
                    <UserMessageSkeleton />
                    <AssistantMessageSkeleton />
                  </>
                ) : (
                  <ChatMessages
                    messages={messages}
                    reload={reload}
                    setMessages={setMessages}
                  />
                )}
                <ChatLoadingIndicator
                  status={status}
                  insertPending={insertAiMessageMutation.isPending}
                />
                {error && <AiResponseAlert error={error} />}
              </div>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Scroll to bottom button - centered at top of prompt */}
      {showScrollToBottom && (
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-20">
          <Button onClick={scrollToBottom} size="sm" className="rounded-full">
            <span className="text-xs">Scroll to bottom</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Fixed prompt input with backdrop blur */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <UserPromptInput
          chatId={chatId}
          input={input}
          append={append}
          setInput={setInput}
          stop={stop}
          status={status}
        />
      </div>
    </div>
  );
}
