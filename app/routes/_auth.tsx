import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authQueryOptions } from "~/queries/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.fetchQuery(authQueryOptions);
    if (!auth?.session) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
