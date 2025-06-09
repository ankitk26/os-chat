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
      <div className="w-full">
        <div className="border-t border-l rounded-tl-lg bg-background/40 w-full mt-4">
          <Chat />
        </div>
      </div>
    </SidebarProvider>
  );
}
