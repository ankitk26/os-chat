import type { FileUIPart } from "ai";
import { cn } from "~/lib/utils";
import ImageAttachmentPreview from "./image-attachment-preview";
import PdfAttachmentPreview from "./pdf-attachment-preview";
import TextFileAttachmentPreview from "./text-file-attachment-preview";

type AttachmentPart = FileUIPart & { size?: number };

type Props = {
	attachments: AttachmentPart[];
	className?: string;
	onRemove?: (index: number) => void;
};

const isImageAttachment = (attachment: AttachmentPart) =>
	attachment.mediaType.startsWith("image/");

const isPdfAttachment = (attachment: AttachmentPart) =>
	attachment.mediaType === "application/pdf";

const formatFileSize = (size?: number) => {
	if (size == null || Number.isNaN(size)) {
		return null;
	}

	if (size < 1024) {
		return `${size} B`;
	}

	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(1)} KB`;
	}

	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getAttachmentLabel = (attachment: AttachmentPart) =>
	attachment.filename?.trim() || "Untitled file";

export default function FileAttachmentsPreview({
	attachments,
	className,
	onRemove,
}: Props) {
	if (attachments.length === 0) {
		return null;
	}

	return (
		<div className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2", className)}>
			{attachments.map((attachment, index) => {
				const label = getAttachmentLabel(attachment);
				const fileSize = formatFileSize(attachment.size);

				if (isImageAttachment(attachment)) {
					return (
						<ImageAttachmentPreview
							attachment={attachment}
							fileSize={fileSize}
							index={index}
							key={`${attachment.url}-${index}`}
							label={label}
							onRemove={onRemove}
						/>
					);
				}

				if (!isPdfAttachment(attachment)) {
					return (
						<TextFileAttachmentPreview
							attachment={attachment}
							fileSize={fileSize}
							index={index}
							key={`${attachment.url}-${index}`}
							label={label}
							onRemove={onRemove}
						/>
					);
				}

				return (
					<PdfAttachmentPreview
						attachment={attachment}
						fileSize={fileSize}
						index={index}
						key={`${attachment.url}-${index}`}
						label={label}
						onRemove={onRemove}
					/>
				);
			})}
		</div>
	);
}
