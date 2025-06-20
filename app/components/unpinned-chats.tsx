import { MessageSquareIcon } from "lucide-react";
import { Suspense } from "react";
import SidebarChats from "./sidebar-chats";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";

export default function UnpinnedChats() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-sm flex items-center gap-2">
        <MessageSquareIcon />
        Chats
      </SidebarGroupLabel>
      <SidebarMenu className="mt-2 space-y-2">
        <Suspense
          fallback={
            <SidebarMenu>
              {Array.from({ length: 4 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          }
        >
          <SidebarChats />
        </Suspense>
      </SidebarMenu>
    </SidebarGroup>
  );
}
