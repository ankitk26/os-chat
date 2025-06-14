import { Link } from "@tanstack/react-router";
import { PanelLeftIcon } from "lucide-react";
import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "~/components/ui/sidebar";
import AppSidebarFooter from "./app-sidebar-footer";
import SidebarChats from "./sidebar-chats";
import { ThemeToggler } from "./theme-toggle";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar className="border-none" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-4 py-2">
          <Button size="icon" variant="ghost" onClick={toggleSidebar}>
            <PanelLeftIcon />
          </Button>
          <Link
            to="/"
            className="flex-grow text-lg font-medium tracking-wide text-center"
          >
            <h3>os.chat</h3>
          </Link>
          <ThemeToggler />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col items-stretch h-full px-4 pt-2 overflow-y-hidden grow">
        <Link to="/">
          <Button className="w-full">New Chat</Button>
        </Link>
        <ScrollArea className="w-full h-full">
          <div className="flex flex-col items-start h-full gap-2 mt-4 mb-4 overflow-hidden grow">
            <Suspense
              fallback={
                <div className="flex flex-col h-full gap-2 mt-4 grow">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={"app_sidebar_chat_loading_" + index}
                      className="w-full h-10"
                    />
                  ))}
                </div>
              }
            >
              <SidebarChats />
            </Suspense>
          </div>
        </ScrollArea>
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
}
