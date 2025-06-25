import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import ApiKeysForm from "~/components/api-keys-form";
import ChatHistoryManager from "~/components/chat-history-manager";
import ContactSection from "~/components/contact-section";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/_auth/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <section className="h-svh max-h-svh py-6 pb-12">
      <ScrollArea className="h-full w-full">
        <div className="mx-auto space-y-6 max-w-5xl w-full">
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
              <TabsTrigger value="about">Contact</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <ApiKeysForm />
              <ChatHistoryManager />
              <ContactSection />
            </div>
          </Tabs>
        </div>
      </ScrollArea>
    </section>
  );
}
