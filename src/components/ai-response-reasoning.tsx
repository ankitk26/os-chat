import { UIMessage } from "ai";
import { useState } from "react";
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
      <div className="space-x-2 flex items-center">
        <ReasoningToggleButton
          toggleReasoningDisplay={toggleReasoningDisplay}
          showReasoning={showReasoning}
        />
        <ReasoningIndicatorText messageContent={message.content} />
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
