import type { FileUIPart } from "ai";
import type { Id } from "convex/_generated/dataModel";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { getFileUrl } from "~/server-fns/get-file-url";
import { getPostUrl } from "~/server-fns/get-post-url";

const TEXT_FILE_EXTENSIONS = new Set([
	"c",
	"cc",
	"cpp",
	"cxx",
	"h",
	"hh",
	"hpp",
	"go",
	"js",
	"jsx",
	"ts",
	"tsx",
	"json",
	"md",
	"txt",
	"py",
	"java",
	"rs",
	"rb",
	"php",
	"css",
	"scss",
	"html",
	"xml",
	"yaml",
	"yml",
	"sh",
	"sql",
	"kt",
	"swift",
	"toml",
	"ini",
	"env",
]);

const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;

export type PendingAttachment = {
	file: File;
	filename: string;
	mediaType: string;
	previewUrl: string;
	size: number;
	textContent?: string;
};

type UploadedAttachment = {
	filename: string;
	mediaType: string;
	previewUrl: string;
	storageId: Id<"_storage">;
	storageUrl: string;
	textContent?: string;
};

const fileToDataUrl = (file: File) =>
	new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});

const getFileExtension = (filename: string) => {
	const parts = filename.toLowerCase().split(".");
	return parts.length > 1 ? (parts.at(-1) ?? "") : "";
};

const inferMediaType = (file: File) => {
	if (file.type.trim() !== "") {
		return file.type;
	}

	const extension = getFileExtension(file.name);
	if (TEXT_FILE_EXTENSIONS.has(extension)) {
		return "text/plain";
	}

	if (extension === "pdf") {
		return "application/pdf";
	}

	return "application/octet-stream";
};

const isSupportedAttachmentType = (mediaType: string) =>
	mediaType.startsWith("text/") ||
	mediaType.startsWith("image/") ||
	mediaType === "application/pdf";

export function usePromptAttachments() {
	const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const handleAttachmentChange = async (
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const files = event.target.files;
		if (!files || files.length === 0) {
			return;
		}

		const validFiles = Array.from(files).filter((file) => {
			const mediaType = inferMediaType(file);

			if (!isSupportedAttachmentType(mediaType)) {
				toast.warning(`${file.name} is not a supported file, PDF, or image.`);
				return false;
			}

			if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
				toast.warning(`${file.name} is larger than 10 MB.`);
				return false;
			}

			return true;
		});

		if (validFiles.length === 0) {
			event.target.value = "";
			return;
		}

		const nextAttachments = await Promise.all(
			validFiles.map(async (file) => {
				const mediaType = inferMediaType(file);
				const textContent =
					mediaType === "text/plain" ? await file.text() : undefined;

				return {
					file,
					filename: file.name,
					mediaType,
					size: file.size,
					previewUrl: await fileToDataUrl(file),
					textContent,
				};
			}),
		);

		setAttachments((current) => [...current, ...nextAttachments]);
		event.target.value = "";
	};

	const removeAttachment = (index: number) => {
		setAttachments((current) =>
			current.filter((_, currentIndex) => currentIndex !== index),
		);
	};

	const clearAttachments = () => {
		setAttachments([]);
	};

	const uploadAttachments = async (): Promise<{
		optimisticAttachments: FileUIPart[];
		persistedAttachments: FileUIPart[];
	}> => {
		if (attachments.length === 0) {
			return {
				optimisticAttachments: [],
				persistedAttachments: [],
			};
		}

		setIsUploading(true);

		try {
			const uploadedAttachments: UploadedAttachment[] = await Promise.all(
				attachments.map(async (attachment) => {
					const uploadUrl = await getPostUrl();
					const uploadResponse = await fetch(uploadUrl, {
						method: "POST",
						headers: {
							"Content-Type": attachment.mediaType,
						},
						body: attachment.file,
					});

					if (!uploadResponse.ok) {
						throw new Error(`Upload failed: ${uploadResponse.status}`);
					}

					const { storageId } = (await uploadResponse.json()) as {
						storageId: Id<"_storage">;
					};
					const storageUrl = await getFileUrl({
						data: { storageId },
					});

					if (!storageUrl) {
						throw new Error("File URL generation failed");
					}

					return {
						filename: attachment.filename,
						mediaType: attachment.mediaType,
						previewUrl: attachment.previewUrl,
						storageId,
						storageUrl,
						textContent: attachment.textContent,
					};
				}),
			);

			return {
				optimisticAttachments: uploadedAttachments.map(
					(attachment) =>
						({
							type: "file",
							filename: attachment.filename,
							mediaType: attachment.mediaType,
							url: attachment.previewUrl,
							providerMetadata: {
								baychat: {
									textContent: attachment.textContent,
								},
								convex: {
									storageId: attachment.storageId,
								},
							},
						}) satisfies FileUIPart,
				),
				persistedAttachments: uploadedAttachments.map(
					(attachment) =>
						({
							type: "file",
							filename: attachment.filename,
							mediaType: attachment.mediaType,
							url: attachment.storageUrl,
							providerMetadata: {
								baychat: {
									textContent: attachment.textContent,
								},
								convex: {
									storageId: attachment.storageId,
								},
							},
						}) satisfies FileUIPart,
				),
			};
		} catch (error) {
			console.error("Failed to upload attachments:", error);
			toast.error("Could not upload attachment");
			throw error;
		} finally {
			setIsUploading(false);
		}
	};

	return {
		attachments,
		clearAttachments,
		handleAttachmentChange,
		isUploading,
		removeAttachment,
		uploadAttachments,
	};
}
