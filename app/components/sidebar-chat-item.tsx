import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Doc } from "convex/_generated/dataModel";
import {
  EditIcon,
  EllipsisVerticalIcon,
  MoveIcon,
  PinIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useChatActionStore } from "~/stores/chat-actions-store";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Props = {
  chat: Doc<"chats">;
};

export default function SidebarChatItem({ chat }: Props) {
  const { data: authData } = authClient.useSession();
  const { data: folders } = useQuery(
    convexQuery(api.folders.getFolders, {
      sessionToken: authData?.session.token ?? "",
    })
  );
  const setSelectedChat = useChatActionStore((store) => store.setSelectedChat);
  const setIsDeleteModalOpen = useChatActionStore(
    (store) => store.setIsDeleteModalOpen
  );
  const setIsRenameModalOpen = useChatActionStore(
    (store) => store.setIsRenameModalOpen
  );

  return (
    <Link to="/chat/$chatId" params={{ chatId: chat.uuid }}>
      <div className="flex items-center justify-between py-1 pl-2 text-sm rounded cursor-pointer hover:bg-primary/10 hover:text-primary dark:hover:bg-secondary dark:hover:text-secondary-foreground">
        <h4 className="line-clamp-1">{chat.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSelectedChat({
                  _id: chat._id,
                  title: chat.title,
                  uuid: chat.uuid,
                });
                setIsRenameModalOpen(true);
              }}
            >
              <EditIcon />
              <span className="leading-0">Rename</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <MoveIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
                <span className="leading-0">Move to folder</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {folders?.map((folder) => (
                    <DropdownMenuItem key={chat._id + "move_to" + folder._id}>
                      {folder.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <PinIcon />
              <span className="leading-0">Pin</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSelectedChat({
                  _id: chat._id,
                  title: chat.title,
                  uuid: chat.uuid,
                });
                setIsDeleteModalOpen(true);
              }}
            >
              <Trash2Icon />
              <span className="leading-0">Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2Icon />
              <span className="leading-0">Share</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
}
