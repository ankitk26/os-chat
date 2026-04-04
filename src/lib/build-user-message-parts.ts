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
	console.log("[LAST GENERATED IMAGE URL] ", latestGeneratedImageUrl);
	console.log("[PROMPT] ", prompt);

	const textPart = { type: "text" as const, text: prompt };

	if (!isImageGenerationModel(model)) {
		return [textPart];
	}

	if (!latestGeneratedImageUrl || !isValidImageUrl(latestGeneratedImageUrl)) {
		return [textPart];
	}

	console.log("[SENDING LAST IMAGE AS INPUT]");

	return [
		{
			type: "file" as const,
			mediaType: "image/png",
			url: latestGeneratedImageUrl,
		},
		textPart,
	];
};
