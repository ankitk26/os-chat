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
import AppSidebarFooter from "./app-sidebar-footer";
import PinnedChats from "./pinned-chats";
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
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              asChild
            >
              <Link to="/">
                <span className="text-base font-medium">os-chat</span>
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear rounded font-semibold"
                size="default"
              >
                <Link to="/" className="w-full text-center">
                  New Chat
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <ScrollArea className="w-full h-full space-y-4 pb-20">
          <PinnedChats />
          <UnpinnedChats />
        </ScrollArea>
      </SidebarContent>

      <AppSidebarFooter />
    </Sidebar>
  );
}
