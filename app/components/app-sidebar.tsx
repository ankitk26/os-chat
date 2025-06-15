import { Link } from "@tanstack/react-router";
import { FolderIcon, MessageSquareIcon, PanelLeftIcon } from "lucide-react";
import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "~/components/ui/sidebar";
import AddFolderButton from "./add-folder-button";
import AppSidebarFooter from "./app-sidebar-footer";
import SidebarChats from "./sidebar-chats";
import SidebarFolders from "./sidebar-folders";
import { ThemeToggler } from "./theme-toggle";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
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
          <div className="flex flex-col items-stretch h-full gap-2 mt-4 mb-20 overflow-hidden scroll-smooth grow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderIcon className="size-4" />
                <h3>Folders</h3>
              </div>
              <AddFolderButton />
            </div>
            <Suspense
              fallback={
                <div className="flex flex-col h-full gap-2 mt-4 grow">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={"app_sidebar_folder_loading_" + index}
                      className="w-full h-10"
                    />
                  ))}
                </div>
              }
            >
              <SidebarFolders />
            </Suspense>

            <Separator />

            <div className="flex items-center gap-2 mt-4">
              <MessageSquareIcon className="size-4" />
              <h3>Chats</h3>
            </div>
            <Suspense
              fallback={
                <div className="flex flex-col h-full gap-2 mt-4 grow">
                  {Array.from({ length: 3 }).map((_, index) => (
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
