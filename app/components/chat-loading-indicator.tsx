import { useChat } from "@ai-sdk/react";

type Props = {
  status: "submitted" | "streaming" | "ready" | "error";
};

export default function ChatLoadingIndicator({ status }: Props) {
  if (status !== "submitted") {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className="animate-pulse">Thinking...</div>
      </div>
    </div>
  );
}
