import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import Chat from "~/components/chat";
import { authQueryOptions } from "~/queries/auth";

export const Route = createFileRoute("/_auth/chat/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const { data: authData } = useQuery(authQueryOptions);

  const { data: messages, isPending: isMessagesPending } = useQuery(
    convexQuery(api.messages.getMessages, {
      chatId,
      sessionToken: authData?.session.token ?? "",
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
