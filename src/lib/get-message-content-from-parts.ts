import type { CustomUIMessage } from "~/types";

export const getMessageContentFromParts = (parts: CustomUIMessage["parts"]) => {
  const textPart = parts.find((part) => part.type === "text");
  if (!textPart) {
    return "";
  }
  return textPart.text;
};
