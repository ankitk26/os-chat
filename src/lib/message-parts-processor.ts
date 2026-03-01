import type { FileUIPart, UIMessagePart, UIDataTypes, UITools } from "ai";
import { api } from "convex/_generated/api";
import { fetchAuthMutation, fetchAuthQuery } from "./auth-server";

// Maximum payload size for Convex (1 MB)
const MAX_PAYLOAD_SIZE = 1 * 1024 * 1024;

// Placeholder URL shown when image upload fails
const FAILED_UPLOAD_PLACEHOLDER =
	"https://placehold.co/600x400?text=Image+Upload+Failed";

// Part types we want to keep in the message
const ALLOWED_TYPES = ["step-start", "file", "text", "reasoning"];

// Extract base64 data from a data URL (e.g., "data:image/png;base64,ABC123...")
const extractBase64 = (dataUrl: string) => {
	const match = dataUrl.match(/base64,(.+)$/);
	return match ? match[1] : null;
};

// Convert base64 string to bytes for upload
const base64ToBytes = (base64: string) => {
	return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

// Upload a single image to Convex storage and return the public URL
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

// Check if a message part is an image file
const isImagePart = (
	part: UIMessagePart<UIDataTypes, UITools>,
): part is FileUIPart =>
	part.type === "file" &&
	"mediaType" in part &&
	(part as FileUIPart).mediaType?.startsWith("image/");

// Truncate reasoning parts to fit within max payload size
// Reserves 500 bytes buffer for image URLs that will be added later
const truncateReasoningIfNeeded = (
	parts: UIMessagePart<UIDataTypes, UITools>[],
	maxSize: number,
) => {
	const payloadSize = JSON.stringify(parts).length;

	// If already under limit, return as-is
	if (payloadSize <= maxSize) {
		return parts;
	}

	// Calculate how much we need to remove
	const imageUrlBuffer = 500;
	const targetSize = maxSize - imageUrlBuffer;
	const excess = payloadSize - targetSize;

	// Truncate reasoning parts to reduce size
	return parts.map((part) => {
		if (
			part.type === "reasoning" &&
			"text" in part &&
			typeof part.text === "string"
		) {
			const currentText = part.text;
			// Keep at least 1000 chars, but remove enough to get under limit
			const newLength = Math.max(1000, currentText.length - excess - 100);

			if (currentText.length > newLength) {
				return { ...part, text: currentText.substring(0, newLength) + "..." };
			}
		}
		return part;
	});
};

// Process all message parts:
// If there are images: filter types, truncate reasoning if needed, upload images
// If no images: return parts unchanged
export const processMessageParts = async (
	allParts: UIMessagePart<UIDataTypes, UITools>[],
) => {
	// Check if any image parts exist
	const hasImages = allParts.some((part) => isImagePart(part));

	// If no images, return parts unchanged (no filtering, no truncation needed)
	if (!hasImages) {
		return { partsToSave: allParts, success: true };
	}

	// Has images: filter to allowed types only (to reduce payload size)
	const filteredParts = allParts.filter((part) =>
		ALLOWED_TYPES.includes(part.type),
	);

	// Make sure we don't exceed Convex's size limit (reserve space for image URLs)
	const parts = truncateReasoningIfNeeded(filteredParts, MAX_PAYLOAD_SIZE);

	// Upload images and replace their base64 URLs with storage URLs
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
