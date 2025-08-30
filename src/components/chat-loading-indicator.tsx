import type { ChatStatus } from "ai";

type Props = {
  status: ChatStatus;
  insertPending: boolean;
};

export default function ChatLoadingIndicator({ status, insertPending }: Props) {
  if (status !== "submitted") {
    return null;
  }

  if (insertPending) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="animate-pulse">Thinking...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className="animate-pulse">Thinking...</div>
      </div>
    </div>
  );
}
