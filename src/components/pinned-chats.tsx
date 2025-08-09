import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { PinIcon } from "lucide-react";
import { Suspense } from "react";
import { generateRandomUUID } from "~/lib/generate-random-uuid";
import AppSidebarChatItem from "./app-sidebar-chat-item";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";

export default function PinnedChats() {
  const { auth } = useRouteContext({ strict: false });
  const { data: chatsData } = useSuspenseQuery(
    convexQuery(api.chats.getPinnedChats, {
      sessionToken: auth?.session.token ?? "",
    })
  );

  // If no pinned chats, don't show anything
  if (chatsData.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center gap-2 text-sm">
        <PinIcon />
        Pinned chats
      </SidebarGroupLabel>

      <SidebarMenu className="mt-2">
        <Suspense
          fallback={
            <SidebarMenu>
              {Array.from({ length: 4 }).map(() => (
                <SidebarMenuItem key={generateRandomUUID()}>
                  <SidebarMenuSkeleton />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          }
        >
          {chatsData.map((chat) => (
            <AppSidebarChatItem chat={chat} key={chat._id} />
          ))}
        </Suspense>
      </SidebarMenu>
    </SidebarGroup>
  );
}
