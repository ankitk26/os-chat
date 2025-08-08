import { Link } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import AddFolderDialog from "./add-folder-dialog";
import AppSidebarFolders from "./app-sidebar-folders";
import AppSidebarFooter from "./app-sidebar-footer";
import ChatRenameDialog from "./chat-rename-dialog";
import DeleteChatAlertDialog from "./delete-chat-alert-dialog";
import PinnedChats from "./pinned-chats";
import ShareChatDialog from "./share-chat-dialog";
import { ThemeToggler } from "./theme-toggle";
import { ScrollArea } from "./ui/scroll-area";
import UnpinnedChats from "./unpinned-chats";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center">
            {/* <SidebarTrigger /> */}
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <span className="font-medium text-base">os-chat</span>
              </Link>
            </SidebarMenuButton>
            <ThemeToggler />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-y-hidden">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                className="min-w-8 bg-primary font-semibold text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                size="default"
              >
                <Link className="w-full text-center" to="/">
                  New Chat
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <ScrollArea className="h-full w-full pb-20">
          <div className="space-y-4">
            <AppSidebarFolders />
            <PinnedChats />
            <AddFolderDialog />
            <UnpinnedChats />
            <DeleteChatAlertDialog />
            <ChatRenameDialog />
            <ShareChatDialog />
          </div>
        </ScrollArea>
      </SidebarContent>

      <AppSidebarFooter />
    </Sidebar>
  );
}
