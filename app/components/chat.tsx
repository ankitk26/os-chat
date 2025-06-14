import { useChat } from "@ai-sdk/react";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useRef } from "react";
import { authClient } from "~/lib/auth-client";
import AssistantMessageSkeleton from "./assistant-message-skeleton";
import ChatLoadingIndicator from "./chat-loading-indicator";
import ChatMessages from "./chat-messages";
import EmptyChatContent from "./empty-chat-content";
import { ScrollArea } from "./ui/scroll-area";
import UserMessageSkeleton from "./user-message-skeleton";
import UserPromptInput from "./user-prompt-input";

type Props = {
  chatId: string;
  dbMessages: {
    _id: Id<"messages">;
    _creationTime: number;
    model?: string | undefined;
    content: string;
    chatId: string;
    userId: Id<"user">;
    role: "user" | "assistant";
  }[];
  isMessagesPending?: boolean;
};

export default function Chat({
  chatId,
  dbMessages,
  isMessagesPending = false,
}: Props) {
  const { data: authData } = authClient.useSession();

  const { mutateAsync } = useMutation({
    mutationFn: useConvexMutation(api.messages.createMessage),
  });

  const { messages, input, status, handleSubmit, setInput, stop, reload } =
    useChat({
      id: chatId,
      initialMessages:
        dbMessages?.map((message) => ({
          id: message._id,
          content: message.content,
          role: message.role,
          parts: [{ text: message.content, type: "text" }],
        })) ?? [],
      onFinish: async ({ content }) => {
        if (chatId) {
          await mutateAsync({
            messageBody: {
              chatId,
              content,
              role: "assistant",
              model: "gemini",
            },
            sessionToken: authData?.session.token ?? "",
          });
        }
      },
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

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
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      <div>
        <UserPromptInput
          chatId={chatId}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          stop={stop}
          status={status}
        />
      </div>
    </div>
  );
}
