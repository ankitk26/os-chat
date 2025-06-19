import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Doc } from "convex/_generated/dataModel";
import {
  EditIcon,
  EllipsisVerticalIcon,
  PinIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { authQueryOptions } from "~/queries/auth";
import { useChatActionStore } from "~/stores/chat-actions-store";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Props = {
  chat: Doc<"chats">;
};

export default function SidebarChatItem({ chat }: Props) {
  const { data: authData } = useQuery(authQueryOptions);
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

  return (
    <Link
      to="/chat/$chatId"
      params={{ chatId: chat.uuid }}
      className="flex items-center justify-between py-1 pl-2 text-sm rounded cursor-pointer hover:bg-primary/10 hover:text-primary dark:hover:bg-secondary dark:hover:text-secondary-foreground"
      activeProps={{ className: "bg-secondary" }}
    >
      <h4 className="line-clamp-1" title={chat.title}>
        {chat.title}
      </h4>
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
                sessionToken: authData?.session.token ?? "",
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
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
}
