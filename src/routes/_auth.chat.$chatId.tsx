import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useMemo } from "react";
import Chat from "~/components/chat";
import type { CustomUIMessage } from "~/types";

export const Route = createFileRoute("/_auth/chat/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const { auth } = useRouteContext({ from: "/_auth" });

  const { data: messages, isPending: isMessagesPending } = useQuery(
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
  }, [messages]);

  return (
    <Chat
      chatId={chatId}
      dbMessages={transformedMessages}
      isMessagesPending={isMessagesPending}
    />
  );
}
