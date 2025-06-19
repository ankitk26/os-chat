import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Link2OffIcon } from "lucide-react";
import AssistantMessageSkeleton from "./assistant-message-skeleton";
import ReadOnlyAssistantMessage from "./read-only-assistant-message";
import ReadOnlyUserMessage from "./read-only-user-message";
import { ScrollArea } from "./ui/scroll-area";
import UserMessageSkeleton from "./user-message-skeleton";

export default function ReadOnlyChatMessages() {
  const { chatId } = useParams({ from: "/share/$chatId" });

  const { data, isPending } = useQuery(
    convexQuery(api.messages.getSharedChatMessages, { sharedChatUuid: chatId })
  );

  if (!isPending && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-svh max-w-md mx-auto px-4">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Link2OffIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">Chat not available</h1>
            <p className="text-muted-foreground">
              This shared conversation is no longer available or has been made
              private.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full mx-auto max-h-svh h-svh">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="w-full h-full">
          <div className="w-full h-full max-w-3xl mx-auto">
            <div className="my-8 space-y-8 flex flex-col">
              <small className="text-center text-muted-foreground">
                This is a copy of a conversation between os-chat & Anonymous
              </small>

              <h2 className="text-3xl font-semibold text-center -mt-3">
                {data?.parentChat?.title}
              </h2>

              {isPending ? (
                <>
                  <UserMessageSkeleton />
                  <AssistantMessageSkeleton />
                </>
              ) : (
                data?.messages.map((message) => (
                  <div key={message._id} className="flex flex-col">
                    {message.role === "user" ? (
                      <ReadOnlyUserMessage message={message} />
                    ) : (
                      <ReadOnlyAssistantMessage message={message} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
