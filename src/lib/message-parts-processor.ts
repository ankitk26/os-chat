import type { FileUIPart, UIMessagePart, UIDataTypes, UITools } from "ai";
import { api } from "convex/_generated/api";
import { fetchAuthMutation, fetchAuthQuery } from "./auth-server";

const FAILED_UPLOAD_PLACEHOLDER =
	"https://placehold.co/600x400?text=Image+Upload+Failed";

const ALLOWED_TYPES = ["step-start", "file", "text", "reasoning"];

const extractBase64 = (dataUrl: string) => {
	const match = dataUrl.match(/base64,(.+)$/);
	return match ? match[1] : null;
};

const base64ToBytes = (base64: string) => {
	return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

const uploadImage = async (part: FileUIPart) => {
	const base64 = extractBase64(part.url);
	if (!base64) return null;

	const bytes = base64ToBytes(base64);
	const uploadUrl = await fetchAuthMutation(api.messages.generateUploadUrl);

	const result = await fetch(uploadUrl, {
		method: "POST",
		headers: { "Content-Type": part.mediaType },
		body: bytes,
	});

	if (!result.ok) throw new Error(`Upload failed: ${result.status}`);

	const { storageId } = await result.json();
	return fetchAuthQuery(api.files.getImageUrl, { storageId });
};

const isImagePart = (
	part: UIMessagePart<UIDataTypes, UITools>,
): part is FileUIPart =>
	part.type === "file" &&
	"mediaType" in part &&
	(part as FileUIPart).mediaType?.startsWith("image/");

const processReasoningParts = (
	parts: UIMessagePart<UIDataTypes, UITools>[],
) => {
	return parts.map((part) => {
		if (
			part.type === "reasoning" &&
			"text" in part &&
			typeof part.text === "string"
		) {
			const text = part.text;
			if (text.length > 1000) {
				return {
					type: "reasoning" as const,
					text: text.substring(0, 1000) + "...",
				};
			}
			return {
				type: "reasoning" as const,
				text,
			};
		}
		return part;
	});
};

export const processMessageParts = async (
	allParts: UIMessagePart<UIDataTypes, UITools>[],
) => {
	const hasImages = allParts.some((part) => isImagePart(part));

	if (!hasImages) {
		return { partsToSave: allParts, success: true };
	}

	const filteredParts = allParts.filter((part) =>
		ALLOWED_TYPES.includes(part.type),
	);

	const parts = processReasoningParts(filteredParts);

	const processedParts = await Promise.all(
		parts.map(async (part) => {
			if (isImagePart(part)) {
				try {
					const imageUrl = await uploadImage(part);
					if (imageUrl) {
						return { ...part, url: imageUrl };
					}
				} catch (error) {
					console.error("Failed to upload image:", error);
					return { ...part, url: FAILED_UPLOAD_PLACEHOLDER };
				}
			}
			return part;
		}),
	);

	return { partsToSave: processedParts, success: true };
};
