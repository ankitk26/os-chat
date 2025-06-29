import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import Chat from "~/components/chat";

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

  return (
    <Chat
      chatId={chatId}
      dbMessages={messages ?? []}
      isMessagesPending={isMessagesPending}
    />
  );
}
