import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  Square,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authQueryOptions } from "~/queries/auth";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { TabsContent } from "./ui/tabs";

export default function ChatHistoryManager() {
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const { data: authData } = useQuery(authQueryOptions);

  const { data: chats = [], isLoading } = useQuery(
    convexQuery(api.chats.getChats, {
      sessionToken: authData?.session.token ?? "",
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
          sessionToken: authData?.session.token ?? "",
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
    <TabsContent value="chatHistory" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Chat History</h3>
          <p className="text-sm text-muted-foreground">
            Manage your conversation history
          </p>
        </div>

        {chats.length > 0 && (
          <div className="flex items-center gap-2">
            {selectedChats.size > 0 && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={deleteChatMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete ({selectedChats.size} selected)
                </Button>
              </>
            )}

            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {isAllSelected ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              {isAllSelected ? "None" : "All"}
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-muted rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : chats.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium mb-2">No chat history</h4>
            <p className="text-sm text-muted-foreground text-center">
              Your conversations will appear here once you start chatting
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const isSelected = selectedChats.has(chat._id);
            return (
              <Card
                key={chat._id}
                className={`transition-all cursor-pointer hover:shadow-sm border-0 ${
                  isSelected ? "bg-primary/10 shadow-sm" : "hover:bg-muted/30"
                }`}
                onClick={() => handleSelectChat(chat._id)}
              >
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-full transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <MessageSquare className="size-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate text-sm mb-0.5">
                        {chat.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(chat._creationTime)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </TabsContent>
  );
}
