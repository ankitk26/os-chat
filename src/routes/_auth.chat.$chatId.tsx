import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Suspense } from "react";
import AssistantMessageSkeleton from "~/components/assistant-message-skeleton";
import Chat from "~/components/chat";
import UserMessageSkeleton from "~/components/user-message-skeleton";

export const Route = createFileRoute("/_auth/chat/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const { auth } = useRouteContext({ from: "/_auth" });

  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatWithData chatId={chatId} sessionToken={auth.session.token} />
    </Suspense>
  );
}

function ChatWithData({
  chatId,
  sessionToken,
}: {
  chatId: string;
  sessionToken: string;
}) {
  // this will suspend if there is no cached data
  const { data: messages } = useSuspenseQuery(
    convexQuery(api.messages.getMessages, { chatId, sessionToken })
  );

  return <Chat chatId={chatId} dbMessages={messages} />;
}

function ChatSkeleton() {
  return (
    <div className="mx-auto h-full w-full max-w-full px-2 lg:max-w-3xl lg:px-4">
      <div className="my-4 space-y-6 pb-40 lg:my-8 lg:space-y-8 lg:pb-32">
        <UserMessageSkeleton />
        <AssistantMessageSkeleton />
      </div>
    </div>
  );
}
