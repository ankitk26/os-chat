import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { useChatActionStore } from "~/stores/chat-actions-store";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export default function ShareChatSyncSection() {
  const selectedChat = useChatActionStore((store) => store.selectedChat);

  const canShare = Boolean(selectedChat);

  const queryArgs = selectedChat
    ? {
        chatId: selectedChat._id,
      }
    : "skip";

  const { data: sharedUuid } = useQuery(
    convexQuery(api.chats.getSharedChatStatus, queryArgs),
  );

  const syncHistoryMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.syncSharedChat),
    onSuccess: () => toast.success("Synced chat history"),
    onError: () => toast.error("Failed to sync chat history"),
  });

  const isPublic = Boolean(sharedUuid);

  function handleSyncHistory() {
    if (!(selectedChat && token)) {
      return;
    }
    syncHistoryMutation.mutate({
      chatId: selectedChat._id,
    });
  }

  return (
    <div className="space-y-3">
      <Label className="font-medium text-sm">Chat History</Label>
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3">
        <div className="space-y-1">
          <p className="font-medium text-sm">Sync Latest Messages</p>
          <p className="text-muted-foreground text-xs">
            Update shared chat with recent messages
          </p>
        </div>
        <Button
          className="shrink-0"
          disabled={!canShare || syncHistoryMutation.isPending || !isPublic}
          onClick={handleSyncHistory}
          size="sm"
          variant="outline"
        >
          <RefreshCwIcon
            className={`h-4 w-4 ${syncHistoryMutation.isPending ? "animate-spin" : ""}`}
          />
          {syncHistoryMutation.isPending ? "Syncing..." : "Sync"}
        </Button>
      </div>
    </div>
  );
}
