import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, rootRouteId } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import Chat from "~/components/chat";
import { authQueryOptions } from "~/queries/auth";

export const Route = createFileRoute("/_auth/chat/$chatId")({
  loader: async ({ context, params }) => {
    const authData = await context.queryClient.ensureQueryData(
      authQueryOptions
    );
    const messages = await context.queryClient.ensureQueryData(
      convexQuery(api.messages.getMessages, {
        chatId: params.chatId,
        sessionToken: authData?.session.token ?? "",
      })
    );
    if (messages.length === 0) {
      throw notFound({ routeId: rootRouteId });
    }
    return messages;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const messages = Route.useLoaderData();

  return <Chat chatId={chatId} dbMessages={messages} />;
}
