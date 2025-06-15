import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { authQueryOptions } from "~/queries/auth";
import DeleteChatAlertDialog from "./delete-chat-alert-dialog";
import SidebarChatItem from "./sidebar-chat-item";

export default function SidebarChats() {
  const { data: authData } = useSuspenseQuery(authQueryOptions);
  const { data: chatsData } = useSuspenseQuery(
    convexQuery(api.chats.getChats, {
      sessionToken: authData?.session.token ?? "",
    })
  );

  if (chatsData.length === 0) {
    return <p className="pl-2 text-sm text-muted-foreground">No chats</p>;
  }

  return (
    <>
      {chatsData.map((chat) => (
        <SidebarChatItem key={chat._id} chat={chat} />
      ))}
      <DeleteChatAlertDialog />
    </>
  );
}
