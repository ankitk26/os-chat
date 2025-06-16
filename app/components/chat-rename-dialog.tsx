import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "~/lib/auth-client";
import { useChatActionStore } from "~/stores/chat-actions-store";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function ChatRenameDialog() {
  const { data: authData } = authClient.useSession();
  const selectedChat = useChatActionStore((store) => store.selectedChat);
  const setSelectedChat = useChatActionStore((store) => store.setSelectedChat);
  const isRenameModalOpen = useChatActionStore(
    (store) => store.isRenameModalOpen
  );
  const setIsRenameModalOpen = useChatActionStore(
    (store) => store.setIsRenameModalOpen
  );
  const [newChatTitle, setNewChatTitle] = useState("");

  useEffect(() => {
    if (selectedChat?.title) {
      setNewChatTitle(selectedChat.title);
    }
  }, [selectedChat?.title]);

  const renameChatMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.updateChatTitle),
    onSuccess: () => {
      toast.success("Chat renamed");
    },
    onError: () => {
      toast.error("Chat was not renamed", {
        description: "Please try again later",
      });
    },
    onSettled: () => {
      setIsRenameModalOpen(false);
      setNewChatTitle("");
      setSelectedChat(null);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (newChatTitle === selectedChat?.title) {
      return;
    }

    renameChatMutation.mutate({
      chat: { chatId: selectedChat?._id!, title: newChatTitle },
      sessionToken: authData?.session.token ?? "",
    });
  };

  useEffect(() => {
    setNewChatTitle(selectedChat?.title ?? "");
  }, []);

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(open) => setIsRenameModalOpen(open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename chat title</DialogTitle>
          <DialogDescription>
            Rename title for the chat "{selectedChat?.title}"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            disabled={renameChatMutation.isPending}
          />
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            disabled={
              renameChatMutation.isPending ||
              selectedChat?.title === newChatTitle
            }
            onClick={handleSubmit}
          >
            {renameChatMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
