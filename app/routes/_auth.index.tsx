import { createFileRoute } from "@tanstack/react-router";
import Chat from "~/components/chat";
import { generateRandomUUID } from "~/lib/generate-random-uuid";

export const Route = createFileRoute("/_auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const chatId = generateRandomUUID();

  return <Chat chatId={chatId} dbMessages={[]} />;
}
