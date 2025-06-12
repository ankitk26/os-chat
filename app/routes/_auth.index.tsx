import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "~/components/app-sidebar";
import Chat from "~/components/chat";
import { SidebarProvider } from "~/components/ui/sidebar";

export const Route = createFileRoute("/_auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full bg-card">
        <div className="w-full border-l border-l-border/50">
          <Chat />
        </div>
      </div>
    </SidebarProvider>
  );
}
