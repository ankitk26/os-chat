import { useChat } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { authQueryOptions } from "~/queries/auth";
import AiResponseAlert from "./ai-response-error";
import AssistantMessageSkeleton from "./assistant-message-skeleton";
import ChatLoadingIndicator from "./chat-loading-indicator";
import ChatMessages from "./chat-messages";
import EmptyChatContent from "./empty-chat-content";
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
  const { data: authData } = useQuery(authQueryOptions);

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
        sessionToken: authData?.session.token ?? "",
      });
    },
  });

  console.log(messages);

  return (
    <div className="flex flex-col w-full mx-auto max-h-svh h-svh">
      <div className="flex-1 overflow-hidden">
        {!isMessagesPending && messages.length === 0 && <EmptyChatContent />}

        {chatId && (
          <ScrollArea className="w-full h-full">
            <div className="w-full h-full max-w-3xl mx-auto">
              <div className="my-8 space-y-4">
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
              </div>
              <ChatLoadingIndicator
                status={status}
                insertPending={insertAiMessageMutation.isPending}
              />
              {error && <AiResponseAlert error={error} />}
            </div>
          </ScrollArea>
        )}
      </div>

      <UserPromptInput
        chatId={chatId}
        input={input}
        append={append}
        setInput={setInput}
        stop={stop}
        status={status}
      />
    </div>
  );
}
