import { Link } from "@tanstack/react-router";
import { useSharedChatContext } from "~/providers/chat-provider";
import { ThemeToggler } from "./theme-toggle";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export default function AppSidebarHeader() {
  const { clearChat } = useSharedChatContext();

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center">
          {/* <SidebarTrigger /> */}
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <Link onClick={() => clearChat()} to="/">
              <span className="font-medium text-base">os-chat</span>
            </Link>
          </SidebarMenuButton>
          <ThemeToggler />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
