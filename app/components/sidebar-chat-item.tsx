import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

type Props = {
  chat: Doc<"chats">;
};

export default function SidebarChatItem({ chat }: Props) {
  const { data: authData } = useQuery(authQueryOptions);
  const { isMobile } = useSidebar();

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
    <SidebarMenuItem className="flex! items-center!">
      <SidebarMenuButton className="pr-0! p-0! flex items-stretch">
        <Link
          to="/chat/$chatId"
          params={{ chatId: chat.uuid }}
          className="truncate py-4! m-0! w-full flex items-center pl-2! max-w-[calc(100%-2rem)]"
        >
          <span className="w-full truncate">{chat.title}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            // showOnHover
            className="data-[state=open]:bg-accent rounded-sm cursor-pointer"
          >
            <EllipsisVerticalIcon />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedChat(chat);
              setIsRenameModalOpen(true);
            }}
          >
            <EditIcon />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleChatPinMutation.mutate({
                chatId: chat._id,
                sessionToken: authData?.session.token ?? "",
              });
            }}
          >
            <PinIcon />
            <span>{chat.isPinned ? "Unpin" : "Pin"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedChat(chat);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2Icon />
            <span>Delete</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedChat(chat);
              setIsShareDialogOpen(true);
            }}
          >
            <Share2Icon />
            <span>Share</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
