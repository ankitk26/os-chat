import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { MessageSquareIcon } from "lucide-react";
import { Suspense } from "react";
import AppSidebarChatItem from "./app-sidebar-chat-item";
import AppSidebarFolderSkeleton from "./app-sidebar-folder-skeleton";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "./ui/sidebar";

export default function UnpinnedChats() {
  const { auth } = useRouteContext({ strict: false });
  const { data: chats } = useSuspenseQuery(
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
        <Suspense fallback={<AppSidebarFolderSkeleton />}>
          {chats.length === 0 && (
            <p className="pl-2 text-muted-foreground text-sm">No chats</p>
          )}
          {chats.length !== 0 &&
            chats.map((chat) => (
              <AppSidebarChatItem chat={chat} key={chat._id} />
            ))}
        </Suspense>
      </SidebarMenu>
    </SidebarGroup>
  );
}
