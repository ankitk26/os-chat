import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import ApiKeysForm from "~/components/api-keys-form";
import ChatHistoryManager from "~/components/chat-history-manager";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/_auth/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto py-6 space-y-6 max-w-5xl w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button
          onClick={async () => {
            await authClient.signOut();
            navigate({ to: "/login" });
          }}
          variant="outline"
        >
          <LogOutIcon />
          Sign out
        </Button>
      </div>

      <Tabs defaultValue="apiKeys">
        <TabsList>
          <TabsTrigger value="apiKeys">API Keys</TabsTrigger>
          <TabsTrigger value="chatHistory">Chat History</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <ApiKeysForm />
          <ChatHistoryManager />
        </div>
      </Tabs>
    </div>
  );
}
