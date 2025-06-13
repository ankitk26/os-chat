import { createFileRoute } from "@tanstack/react-router";
import Chat from "~/components/chat";

export const Route = createFileRoute("/_auth/chat/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat />;
}
