import type { UIMessage } from "ai";
import { useState } from "react";
import { getMessageContentFromParts } from "~/lib/get-message-content-from-parts";
import ReasoningIndicatorText from "./reasoning-indicator-text";
import ReasoningMarkdown from "./reasoning-markdown";
import ReasoningToggleButton from "./reasoning-toggle-button";

export default function AIResponseReasoning({
  message,
}: {
  message: UIMessage;
}) {
  const [showReasoning, setShowReasoning] = useState(false);
  const reasoningPart = message.parts.find((part) => part.type === "reasoning");
  const messageContent = getMessageContentFromParts(message.parts);

  const toggleReasoningDisplay = () => {
    setShowReasoning((prev) => !prev);
  };

  if (!reasoningPart) {
    return null;
  }

  const reasoningContent = reasoningPart.details
    .map((detail) => (detail.type === "text" ? detail.text : "redacted"))
    .toString();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <ReasoningToggleButton
          showReasoning={showReasoning}
          toggleReasoningDisplay={toggleReasoningDisplay}
        />
        <ReasoningIndicatorText messageContent={messageContent} />
      </div>

      {showReasoning && (
        <ReasoningMarkdown
          messageId={message.id}
          reasoningContent={reasoningContent}
        />
      )}
    </div>
  );
}
