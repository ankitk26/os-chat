import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { MessageSquareIcon } from "lucide-react";
import AppSidebarChatItem from "./app-sidebar-chat-item";
import DeleteAllChatsAlertDialog from "./delete-all-chats-alert-dialog";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "./ui/sidebar";

export default function UnpinnedChatsList() {
  const { data: chats } = useSuspenseQuery(
    convexQuery(api.chats.getUnpinnedChats, {}),
  );

  return (
    <SidebarGroup className="group/chat-header group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="size-4" />
          Chats
        </div>
        {chats.length > 0 && <DeleteAllChatsAlertDialog />}
      </SidebarGroupLabel>
      <SidebarMenu className="mt-2 space-y-0.5">
        {chats.length === 0 && (
          <p className="pl-2 text-muted-foreground text-sm">No chats</p>
        )}
        {chats.length !== 0 &&
          chats.map((chat) => (
            <AppSidebarChatItem chat={chat} key={chat._id} />
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
