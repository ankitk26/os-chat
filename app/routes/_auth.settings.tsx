import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/_auth/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        onClick={async () => {
          await authClient.signOut();
          navigate({ to: "/login" });
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
