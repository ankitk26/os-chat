import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import Chat from "~/components/chat";
import { CustomUIMessage } from "~/types";

export const Route = createFileRoute("/_auth/chat/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const { auth } = useRouteContext({ from: "/_auth" });

  const { data: messages, isPending: isMessagesPending } = useSuspenseQuery(
    convexQuery(api.messages.getMessages, {
      chatId,
      sessionToken: auth.session.token,
    })
  );

  const transformedMessages = (messages || []).map((message) => {
    const base = {
      id: message.sourceMessageId ?? message._id,
      role: message.role,
      parts: JSON.parse(message.parts) as CustomUIMessage["parts"],
    };
    if (message.role === "user") {
      return base;
    }
    return {
      ...base,
      metadata: {
        model: "placeholder",
        createdAt: message._creationTime,
      },
    };
  }) as CustomUIMessage[];

  return (
    <Chat
      chatId={chatId}
      dbMessages={transformedMessages}
      isMessagesPending={isMessagesPending}
    />
  );
}
