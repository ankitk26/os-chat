import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { authQueryOptions } from "~/queries/auth";
import SidebarChatItem from "./sidebar-chat-item";
import { ScrollArea } from "./ui/scroll-area";

export default function SidebarChats() {
  const { data: authData } = useSuspenseQuery(authQueryOptions);
  const { data: chatsData } = useSuspenseQuery(
    convexQuery(api.chats.getChats, {
      sessionToken: authData?.session.token ?? "",
    })
  );

  if (chatsData.length === 0) {
    return (
      <p className="text-sm text-center text-muted-foreground">No chats</p>
    );
  }

  return (
    <ScrollArea className="w-full h-full mt-4 grow">
      <div className="flex flex-col w-full h-full gap-2 mb-4">
        {chatsData.map((chat) => (
          <SidebarChatItem key={chat._id} chat={chat} />
        ))}
      </div>
    </ScrollArea>
  );
}
