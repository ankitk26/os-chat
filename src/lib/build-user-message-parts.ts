import type { FileUIPart } from "ai";
import { isImageGenerationModel } from "~/lib/is-image-generation-model";
import type { CustomUIMessage, Model } from "~/types";

const isValidImageUrl = (value: string) => {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
};

export const buildUserMessageParts = ({
	attachments = [],
	latestGeneratedImageUrl,
	model,
	prompt,
}: {
	attachments?: FileUIPart[];
	latestGeneratedImageUrl?: string | null;
	model: Model;
	prompt: string;
}): CustomUIMessage["parts"] => {
	const trimmedPrompt = prompt.trim();
	const textPart =
		trimmedPrompt.length > 0 ? [{ type: "text" as const, text: prompt }] : [];

	if (!isImageGenerationModel(model)) {
		return [...attachments, ...textPart];
	}

	if (!latestGeneratedImageUrl || !isValidImageUrl(latestGeneratedImageUrl)) {
		return [...attachments, ...textPart];
	}

	return [
		{
			type: "file" as const,
			mediaType: "image/png",
			url: latestGeneratedImageUrl,
		},
		...attachments,
		...textPart,
	];
};
