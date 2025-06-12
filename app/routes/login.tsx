import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1>Log in to start using os.chat</h1>
      <Button
        onClick={async () => {
          setIsLoading(true);
          await authClient.signIn.social({ provider: "github" });
        }}
        disabled={isLoading}
      >
        {isLoading && <Loader2Icon className="animate-spin" />}
        {isLoading ? "Logging in..." : "Log in"}
      </Button>
    </div>
  );
}
