import { ChatRequestOptions, UIMessage } from "ai";
import { TerminalIcon } from "lucide-react";
import { memo } from "react";
import AssistantMessage from "./assistant-message";
import { Alert, AlertDescription } from "./ui/alert";
import UserMessage from "./user-message";

type Props = {
  messages: UIMessage[];
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  error: Error | undefined;
};

export default memo(function ChatMessages({ messages, error, reload }: Props) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <>
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col">
          {message.role === "user" ? (
            <UserMessage message={message.content} />
          ) : (
            <AssistantMessage message={message} reload={reload} />
          )}
        </div>
      ))}
      {error && (
        <Alert variant="destructive">
          <TerminalIcon />
          <AlertDescription>
            Something went wrong! Please check your API keys and network
            connectivity
          </AlertDescription>
        </Alert>
      )}
    </>
  );
});
