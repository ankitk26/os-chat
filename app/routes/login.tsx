import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Log in to start using os.chat</h1>
      <Button
        onClick={async () => authClient.signIn.social({ provider: "github" })}
      >
        Log in
      </Button>
    </div>
  );
}
