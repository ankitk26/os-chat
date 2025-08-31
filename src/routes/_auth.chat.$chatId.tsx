import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Suspense, useMemo } from "react";
import AssistantMessageSkeleton from "~/components/assistant-message-skeleton";
import Chat from "~/components/chat";
import UserMessageSkeleton from "~/components/user-message-skeleton";
import type { CustomUIMessage } from "~/types";

export const Route = createFileRoute("/_auth/chat/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto h-full w-full max-w-full px-2 lg:max-w-3xl lg:px-4">
          <div className="my-4 space-y-6 pb-40 lg:my-8 lg:space-y-8 lg:pb-32">
            <UserMessageSkeleton />
            <AssistantMessageSkeleton />
          </div>
        </div>
      }
    >
      <SuspendedChatPage />
    </Suspense>
  );
}

function SuspendedChatPage() {
  const { chatId } = Route.useParams();
  const { auth } = useRouteContext({ from: "/_auth" });

  const { data: messages, isPending: isMessagesPending } = useSuspenseQuery(
    convexQuery(api.messages.getMessages, {
      chatId,
      sessionToken: auth.session.token,
    })
  );

  const transformedMessages = useMemo(() => {
    if (!messages) {
      return [];
    }
    return messages.map((message) => {
      const base = {
        id: message.sourceMessageId,
        role: message.role,
        parts: JSON.parse(message.parts) as CustomUIMessage["parts"],
      };
      if (message.role === "user") {
        return base;
      }
      return {
        ...base,
        metadata: JSON.parse(
          message.metadata ??
            JSON.stringify({ model: "", createdAt: Date.now() })
        ),
      };
    }) as CustomUIMessage[];
  }, [messages]);

  console.log({ transformedMessages });

  return (
    <Chat
      chatId={chatId}
      dbMessages={transformedMessages}
      isMessagesPending={isMessagesPending}
    />
  );
}
