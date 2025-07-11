import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { authQueryOptions } from "~/queries/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.fetchQuery(authQueryOptions);
    if (!auth?.session) {
      throw redirect({ to: "/login" });
    }
    return { auth };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
