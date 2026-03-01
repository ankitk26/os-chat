import type { FileUIPart, UIMessagePart, UIDataTypes, UITools } from "ai";
import { api } from "convex/_generated/api";
import { fetchAuthMutation, fetchAuthQuery } from "./auth-server";

const MAX_PAYLOAD_SIZE = 1 * 1024 * 1024;
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

export const processMessageParts = async (
	allParts: UIMessagePart<UIDataTypes, UITools>[],
) => {
	// Filter to allowed types only
	let parts = allParts.filter((part) => ALLOWED_TYPES.includes(part.type));

	// Check total payload size
	let payloadSize = JSON.stringify(parts).length;

	// If exceeds limit, truncate reasoning parts
	if (payloadSize > MAX_PAYLOAD_SIZE) {
		const imageUrlBuffer = 500; // Reserve space for image URLs
		const targetSize = MAX_PAYLOAD_SIZE - imageUrlBuffer;

		parts = parts.map((part) => {
			if (
				part.type === "reasoning" &&
				"text" in part &&
				typeof part.text === "string"
			) {
				const currentText = part.text;
				// Rough calculation: we need to reduce by (payloadSize - targetSize)
				// But we need to be conservative since JSON encoding adds overhead
				const excess = payloadSize - targetSize;
				const newLength = Math.max(1000, currentText.length - excess - 100);

				if (currentText.length > newLength) {
					return { ...part, text: currentText.substring(0, newLength) + "..." };
				}
			}
			return part;
		});

		// Recalculate size after truncation
		payloadSize = JSON.stringify(parts).length;
	}

	// Process images: upload and replace URLs
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
