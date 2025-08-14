import type { UIMessage } from "ai";

export const getMessageContentFromParts = (parts: UIMessage["parts"]) => {
  const textPart = parts.find((part) => part.type === "text");
  if (!textPart) {
    return "";
  }
  return textPart.text;
};
