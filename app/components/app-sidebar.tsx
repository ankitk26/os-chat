import { Link } from "@tanstack/react-router";
import { Sidebar, SidebarContent } from "~/components/ui/sidebar";
import AppSidebarFooter from "./app-sidebar-footer";
import AppSidebarHeader from "./app-sidebar-header";
import PinnedChats from "./pinned-chats";
import SidebarChatsSection from "./sidebar-chats-section";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export function AppSidebar() {
  return (
    <Sidebar className="border-none" collapsible="icon">
      <AppSidebarHeader />

      <SidebarContent className="flex flex-col items-stretch h-full px-6 pt-2 overflow-y-hidden grow">
        <Link to="/">
          <Button className="w-full">New Chat</Button>
        </Link>

        <ScrollArea className="w-full h-full">
          <div className="flex flex-col items-stretch h-full gap-2 pr-1 mt-4 mb-20 space-y-4 overflow-hidden scroll-smooth grow">
            <PinnedChats />
            <SidebarChatsSection />
          </div>
        </ScrollArea>
      </SidebarContent>

      <AppSidebarFooter />
    </Sidebar>
  );
}
