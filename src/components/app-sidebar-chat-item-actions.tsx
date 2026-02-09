import { EllipsisVerticalIcon } from "lucide-react";
import { Suspense } from "react";
import type { SidebarChatType } from "~/types";
import AppSidebarChatItemDelete from "./app-sidebar-chat-item-delete";
import AppSidebarChatItemFolder from "./app-sidebar-chat-item-folder";
import AppSidebarChatItemPin from "./app-sidebar-chat-item-pin";
import AppSidebarChatItemRename from "./app-sidebar-chat-item-rename";
import AppSidebarChatItemShare from "./app-sidebar-chat-item-share";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

type Props = {
  chat: SidebarChatType;
};

export default function AppSidebarChatItemActions(props: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-7 shrink-0 rounded-sm bg-secondary text-sidebar-foreground opacity-0 transition-opacity duration-200 hover:bg-sidebar group-hover/chats:opacity-100"
          size="icon"
        >
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <AppSidebarChatItemRename chat={props.chat} />
        <AppSidebarChatItemPin chat={props.chat} />
        <AppSidebarChatItemDelete chat={props.chat} />
        <AppSidebarChatItemShare chat={props.chat} />
        <Suspense fallback={<Skeleton className="h-3 w-3/4" />}>
          <AppSidebarChatItemFolder chat={props.chat} />
        </Suspense>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
