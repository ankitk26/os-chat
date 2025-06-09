import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "~/components/app-sidebar";
import Chat from "~/components/chat";
import { SidebarProvider } from "~/components/ui/sidebar";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full bg-card">
        <div className="w-full mt-4 border-t border-l rounded-tl-lg bg-background/30">
          <Chat />
        </div>
      </div>
    </SidebarProvider>
  );
}
