import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
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

  const { data: chats = [], isLoading } = useQuery(
    convexQuery(api.chats.getChats, {}),
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
    if (selectedChats.size === 0) {
      return;
    }

    for (const chatId of selectedChats) {
      const chat = chats.find((c) => c._id === chatId);
      if (chat) {
        deleteChatMutation.mutate({
          chatId: chat._id,
        });
      }
    }
  };

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const isAllSelected = chats.length > 0 && selectedChats.size === chats.length;

  return (
    <TabsContent className="space-y-6" value="chatHistory">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-medium text-foreground text-lg">Chat History</h3>
        <p className="text-muted-foreground text-sm">
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
                <Button size="sm" variant="destructive">
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
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              className="flex animate-pulse items-center gap-3 py-3"
              key={`loading-skeleton-${i + 1}`}
            >
              <div className="h-4 w-4 rounded-sm bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded-md bg-muted" />
                <div className="h-3 w-1/3 rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading &&
        (chats.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <MinusIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              No conversations yet
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => {
              const isSelected = selectedChats.has(chat._id);
              return (
                <div
                  className={`-mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 transition-all ${
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted/50"
                  }`}
                  key={chat._id}
                  onClick={() => handleSelectChat(chat._id)}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-sm border transition-all ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40 bg-muted/20 hover:border-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    {isSelected && (
                      <CheckIcon className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`mb-1 flex items-center gap-2 truncate font-medium text-sm ${
                        isSelected
                          ? "text-accent-foreground"
                          : "text-foreground"
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
        ))}
    </TabsContent>
  );
}
