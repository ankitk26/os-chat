import type { FileUIPart } from "ai";
import type { CustomUIMessage } from "~/types";

export const getFilePartsFromMessage = (
	parts: CustomUIMessage["parts"],
): FileUIPart[] =>
	parts.filter((part): part is FileUIPart => part.type === "file");
