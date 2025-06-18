import { useChat } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Doc } from "convex/_generated/dataModel";
import { authQueryOptions } from "~/queries/auth";
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

  const { mutateAsync: insertAIMessage } = useMutation({
    mutationFn: useConvexMutation(api.messages.createMessage),
  });

  const { messages, input, status, setInput, stop, reload, append } = useChat({
    id: chatId,
    experimental_throttle: 400,
    initialMessages:
      dbMessages?.map((message) => ({
        id: message.sourceMessageId ?? message._id,
        content: message.content,
        role: message.role,
        annotations: message.model ? [{ model: message.model }] : [],
        parts: [{ text: message.content, type: "text" }],
      })) ?? [],
    onFinish: async (newMessage) => {
      if (!chatId) return;
      if (!newMessage.content) return;

      const modelUsed =
        newMessage.annotations &&
        newMessage.annotations?.length > 0 &&
        (newMessage as any).annotations[0].model;

      await insertAIMessage({
        messageBody: {
          chatId,
          content: newMessage.content.trim(),
          role: "assistant",
          model: modelUsed,
          sourceMessageId: newMessage.id,
        },
        sessionToken: authData?.session.token ?? "",
      });
    },
  });

  return (
    <div className="flex flex-col w-full mx-auto max-h-svh h-svh">
      <div className="flex-1 overflow-hidden">
        {!isMessagesPending && messages.length === 0 && <EmptyChatContent />}

        {chatId && (
          <ScrollArea className="w-full h-full">
            <div className="w-full h-full max-w-3xl mx-auto">
              <div className="my-8 space-y-8">
                {isMessagesPending ? (
                  <>
                    <UserMessageSkeleton />
                    <AssistantMessageSkeleton />
                  </>
                ) : (
                  <ChatMessages messages={messages} reload={reload} />
                )}
              </div>
              <ChatLoadingIndicator status={status} />
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
