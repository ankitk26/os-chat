import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { MessageSquareIcon } from "lucide-react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import SidebarChatItem from "./sidebar-chat-item";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";

export default function UnpinnedChats() {
  const { auth } = useRouteContext({ strict: false });
  const { data: chatsData, isPending } = useQuery(
    convexQuery(api.chats.getUnpinnedChats, {
      sessionToken: auth?.session.token ?? "",
    })
  );

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center gap-2 text-sm">
        <MessageSquareIcon />
        Chats
      </SidebarGroupLabel>
      <SidebarMenu className="mt-2 space-y-0.5">
        {isPending && (
          <SidebarMenu>
            {Array.from({ length: 4 }).map(() => (
              <SidebarMenuItem key={generateRandomUUID()}>
                <SidebarMenuSkeleton />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}

        {!isPending && chatsData && chatsData.length === 0 && (
          <p className="pl-2 text-muted-foreground text-sm">No chats</p>
        )}

        {!isPending &&
          chatsData &&
          chatsData.length > 0 &&
          chatsData.map((chat) => (
            <SidebarChatItem chat={chat} key={chat._id} />
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
