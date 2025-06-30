import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import {
  EditIcon,
  EllipsisVerticalIcon,
  FolderArchiveIcon,
  PinIcon,
  Share2Icon,
  SplitIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  chat: FunctionReturnType<typeof api.chats.getPinnedChats>[0];
};

export default function SidebarChatItem({ chat }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const { auth } = useRouteContext({ strict: false });
  const setSelectedChat = useChatActionStore((store) => store.setSelectedChat);
  const setIsDeleteModalOpen = useChatActionStore(
    (store) => store.setIsDeleteModalOpen
  );
  const setIsRenameModalOpen = useChatActionStore(
    (store) => store.setIsRenameModalOpen
  );
  const setIsShareDialogOpen = useChatActionStore(
    (store) => store.setIsShareDialogOpen
  );

  const { data: folders } = useQuery(
    convexQuery(api.folders.getFolders, {
      sessionToken: auth?.session.token ?? "",
    })
  );

  const toggleChatPinMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.toggleChatPin),
    onSuccess: (wasPinned) => {
      toast.success(wasPinned ? "Chat unpinned" : "Chat pinned");
    },
    onError: () => {
      toast.error("Could not pin chat", {
        description: "Please try again later",
      });
    },
  });

  const updateChatFolderMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.updateChatFolder),
    // onSuccess: (wasPinned) => {
    //   toast.success(wasPinned ? "Chat unpinned" : "Chat pinned");
    // },
    onError: () => {
      toast.error("Could not update chat folder", {
        description: "Please try again later",
      });
    },
  });

  return (
    <Link
      to="/chat/$chatId"
      params={{ chatId: chat.uuid }}
      className="flex items-center justify-between py-2 px-2 text-sm rounded-md cursor-pointer hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground"
      activeProps={{ className: "bg-secondary text-secondary-foreground" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {chat.isBranched && (
        <Tooltip>
          <TooltipTrigger>
            <Link
              to="/chat/$chatId"
              params={{ chatId: chat.parentChat?.uuid ?? chat.uuid }}
            >
              <SplitIcon className="size-4 cursor-pointer mr-2 text-muted-foreground hover:text-secondary-foreground" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            Branched from {chat.parentChat?.title}
          </TooltipContent>
        </Tooltip>
      )}
      <h4 className="line-clamp-1 w-full" title={chat.title}>
        {chat.title}
      </h4>
      {/* Always render button to maintain consistent height, but control visibility */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className={`size-7 rounded-sm bg-secondary hover:bg-sidebar text-sidebar-foreground flex-shrink-0 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setSelectedChat(chat);
              setIsRenameModalOpen(true);
            }}
          >
            <EditIcon />
            <span className="leading-0">Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              toggleChatPinMutation.mutate({
                chatId: chat._id,
                sessionToken: auth?.session.token ?? "",
              });
            }}
          >
            <PinIcon />
            <span className="leading-0">{chat.isPinned ? "Unpin" : "Pin"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setSelectedChat(chat);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2Icon />
            <span className="leading-0">Delete</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setSelectedChat(chat);
              setIsShareDialogOpen(true);
            }}
          >
            <Share2Icon />
            <span className="leading-0">Share</span>
          </DropdownMenuItem>
          {folders && folders?.length > 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="focus:bg-accent cursor-pointer focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex items-center gap-2 rounded-sm px-2 py-2.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                <FolderArchiveIcon />
                Move to folder
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="ml-2">
                  {chat.folderId && (
                    <DropdownMenuItem
                      key={"null_" + chat._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateChatFolderMutation.mutate({
                          chatId: chat._id,
                          folderId: undefined,
                          sessionToken: auth?.session.token ?? "",
                        });
                      }}
                    >
                      No folder
                    </DropdownMenuItem>
                  )}
                  {folders
                    ?.filter((folder) => folder._id !== chat.folderId)
                    ?.map((folder) => (
                      <DropdownMenuItem
                        key={folder._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateChatFolderMutation.mutate({
                            chatId: chat._id,
                            folderId: folder._id,
                            sessionToken: auth?.session.token ?? "",
                          });
                        }}
                      >
                        {folder.title}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
}
