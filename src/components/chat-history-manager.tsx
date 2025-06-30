import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { CheckIcon, MinusIcon, SplitIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { TabsContent } from "./ui/tabs";

export default function ChatHistoryManager() {
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const { auth } = useRouteContext({ from: "/_auth" });

  const { data: chats = [], isLoading } = useQuery(
    convexQuery(api.chats.getChats, {
      sessionToken: auth.session.token,
    })
  );

  const deleteChatMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.deleteChat),
    onSuccess: () => {
      toast.success("Chat deleted");
      setSelectedChats(new Set());
    },
    onError: () => {
      toast.error("Failed to delete chats", {
        description: "Please try again later",
      });
    },
  });

  const handleSelectChat = (chatId: string) => {
    const newSelected = new Set(selectedChats);
    if (newSelected.has(chatId)) {
      newSelected.delete(chatId);
    } else {
      newSelected.add(chatId);
    }
    setSelectedChats(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedChats.size === chats.length) {
      setSelectedChats(new Set());
    } else {
      setSelectedChats(new Set(chats.map((chat) => chat._id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedChats.size === 0) return;

    selectedChats.forEach((chatId) => {
      const chat = chats.find((c) => c._id === chatId);
      if (chat) {
        deleteChatMutation.mutate({
          sessionToken: auth?.session.token ?? "",
          chatId: chat._id,
        });
      }
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isAllSelected = chats.length > 0 && selectedChats.size === chats.length;

  return (
    <TabsContent value="chatHistory" className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-medium text-foreground">Chat History</h3>
        <p className="text-sm text-muted-foreground">
          {chats.length} conversation{chats.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Actions */}
      {chats.length > 0 && (
        <div className="flex items-center justify-between">
          <Button onClick={handleSelectAll}>
            {isAllSelected ? "Deselect all" : "Select all"}
          </Button>

          {selectedChats.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2Icon className="size-4" />
                  Delete {selectedChats.size}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete these chats? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleteChatMutation.isPending}
                    onClick={() => handleDeleteSelected()}
                  >
                    {deleteChatMutation.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}

      <Separator />

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 animate-pulse">
              <div className="h-4 w-4 bg-muted rounded-sm" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded-md w-3/4" />
                <div className="h-3 bg-muted rounded-md w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
            <MinusIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No conversations yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {chats.map((chat) => {
            const isSelected = selectedChats.has(chat._id);
            return (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat._id)}
                className={`flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted/50"
                }`}
              >
                <div
                  className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/40 bg-muted/20 hover:border-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  {isSelected && (
                    <CheckIcon className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm flex gap-2 items-center font-medium truncate mb-1 ${
                      isSelected ? "text-accent-foreground" : "text-foreground"
                    }`}
                  >
                    {chat.isBranched && <SplitIcon className="size-3" />}
                    {chat.title}
                  </div>
                  <p
                    className={`text-xs ${
                      isSelected
                        ? "text-accent-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatDate(chat._creationTime)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </TabsContent>
  );
}
