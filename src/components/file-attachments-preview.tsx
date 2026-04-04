import { FileIcon, FileTextIcon, XIcon } from "@phosphor-icons/react";
import type { FileUIPart } from "ai";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

type AttachmentPart = FileUIPart & { size?: number };

type Props = {
	attachments: AttachmentPart[];
	className?: string;
	onRemove?: (index: number) => void;
};

const isImageAttachment = (attachment: AttachmentPart) =>
	attachment.mediaType.startsWith("image/");

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
						<div
							className="group/attachment relative overflow-hidden rounded-2xl border border-border/70 bg-muted/40 shadow-sm"
							key={`${attachment.url}-${index}`}
						>
							<img
								alt={label}
								className="h-28 w-full object-cover"
								src={attachment.url}
							/>
							<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent px-3 pt-8 pb-3">
								<div className="truncate text-[11px] font-medium">{label}</div>
								<div className="mt-0.5 text-[10px] text-muted-foreground">
									{fileSize ?? "Image"}
								</div>
							</div>
							{onRemove && (
								<Button
									aria-label={`Remove ${label}`}
									className="absolute top-2 right-2 rounded-full bg-background/85 shadow-sm backdrop-blur"
									onClick={() => onRemove(index)}
									size="icon-xs"
									type="button"
									variant="outline"
								>
									<XIcon />
								</Button>
							)}
						</div>
					);
				}

				return (
					<div
						className="relative flex min-h-20 items-center gap-3 rounded-2xl border border-border/70 bg-linear-to-br from-muted/55 to-muted/15 px-3 py-3 shadow-sm"
						key={`${attachment.url}-${index}`}
					>
						<div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/80">
							{attachment.mediaType.startsWith("text/") ? (
								<FileTextIcon className="text-muted-foreground" />
							) : attachment.mediaType === "application/pdf" ? (
								<FileTextIcon className="text-muted-foreground" />
							) : (
								<FileIcon className="text-muted-foreground" />
							)}
						</div>
						<div className="min-w-0 flex-1">
							<div className="truncate text-xs font-medium">{label}</div>
							<div className="mt-1 flex items-center gap-2 text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
								<span>{attachment.mediaType || "file"}</span>
								{fileSize && <span>{fileSize}</span>}
							</div>
						</div>
						{onRemove && (
							<Button
								aria-label={`Remove ${label}`}
								className="absolute top-2 right-2 rounded-full"
								onClick={() => onRemove(index)}
								size="icon-xs"
								type="button"
								variant="ghost"
							>
								<XIcon />
							</Button>
						)}
					</div>
				);
			})}
		</div>
	);
}
