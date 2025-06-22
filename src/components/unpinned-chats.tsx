import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { MessageSquareIcon } from "lucide-react";
import { authQueryOptions } from "~/queries/auth";
import SidebarChatItem from "./sidebar-chat-item";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";

export default function UnpinnedChats() {
  const { data: authData } = useQuery(authQueryOptions);
  const { data: chatsData, isPending } = useQuery(
    convexQuery(api.chats.getUnpinnedChats, {
      sessionToken: authData?.session.token ?? "",
    })
  );

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-sm flex items-center gap-2">
        <MessageSquareIcon />
        Chats
      </SidebarGroupLabel>
      <SidebarMenu className="mt-2 space-y-0.5">
        {isPending && (
          <SidebarMenu>
            {Array.from({ length: 4 }).map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuSkeleton />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}

        {!isPending && chatsData && chatsData.length === 0 && (
          <p className="pl-2 text-sm text-muted-foreground">No chats</p>
        )}

        {!isPending &&
          chatsData &&
          chatsData.length > 0 &&
          chatsData.map((chat) => (
            <SidebarChatItem key={chat._id} chat={chat} />
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
