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
	latestGeneratedImageUrl,
	model,
	prompt,
}: {
	latestGeneratedImageUrl?: string | null;
	model: Model;
	prompt: string;
}): CustomUIMessage["parts"] => {
	const textPart = { type: "text" as const, text: prompt };

	if (!isImageGenerationModel(model)) {
		return [textPart];
	}

	if (!latestGeneratedImageUrl || !isValidImageUrl(latestGeneratedImageUrl)) {
		return [textPart];
	}

	return [
		{
			type: "file" as const,
			mediaType: "image/png",
			url: latestGeneratedImageUrl,
		},
		textPart,
	];
};
