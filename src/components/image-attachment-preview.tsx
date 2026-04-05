import { XIcon } from "@phosphor-icons/react";
import { FileUIPart } from "ai";
import { useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

type AttachmentPart = FileUIPart & { size?: number };

const getImageTypeLabel = (mediaType: string) =>
	mediaType.split("/")[1]?.replace(/[-_]/g, " ").toUpperCase() || "IMAGE";

export default function ImageAttachmentPreview({
	attachment,
	index,
	label,
	fileSize,
	onRemove,
}: {
	attachment: AttachmentPart;
	index: number;
	label: string;
	fileSize: string | null;
	onRemove?: (index: number) => void;
}) {
	const [dimensions, setDimensions] = useState<{
		height: number;
		width: number;
	} | null>(null);

	return (
		<Dialog>
			<div className="group/attachment relative overflow-hidden rounded-2xl border border-border/70 bg-muted/40 shadow-sm">
				<DialogTrigger
					render={
						<button
							type="button"
							className="block w-full cursor-zoom-in rounded-[inherit] text-left outline-none focus:outline-none"
						>
							<img
								alt={label}
								className="h-28 w-full object-cover"
								onLoad={(event) => {
									if (dimensions) {
										return;
									}

									setDimensions({
										height: event.currentTarget.naturalHeight,
										width: event.currentTarget.naturalWidth,
									});
								}}
								src={attachment.url}
							/>
							<div className="absolute inset-x-0 bottom-0 space-y-0.5 bg-linear-to-t from-background via-background/80 to-transparent px-3 pt-8 pb-3">
								<div className="truncate text-xs font-medium">{label}</div>
								<div className="text-xs text-muted-foreground">
									{fileSize ?? "Image"}
								</div>
							</div>
						</button>
					}
				/>
				{onRemove && (
					<Button
						aria-label={`Remove ${label}`}
						className="absolute top-2 right-2 rounded-full bg-background/85 shadow-sm backdrop-blur"
						onClick={(event) => {
							event.stopPropagation();
							onRemove(index);
						}}
						size="icon-xs"
						type="button"
						variant="outline"
					>
						<XIcon />
					</Button>
				)}
			</div>

			<DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-4xl">
				<DialogHeader className="pr-10">
					<DialogTitle className="truncate text-sm">{label}</DialogTitle>
					<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<div>{getImageTypeLabel(attachment.mediaType)}</div>
						{fileSize && <div>{fileSize}</div>}
					</div>
				</DialogHeader>

				<div className="flex max-h-[calc(90vh-6rem)] items-center justify-center overflow-auto rounded-md bg-muted/30 p-2">
					<img
						alt={label}
						className="block max-h-full max-w-full object-contain"
						onLoad={(event) => {
							if (dimensions) {
								return;
							}

							setDimensions({
								height: event.currentTarget.naturalHeight,
								width: event.currentTarget.naturalWidth,
							});
						}}
						src={attachment.url}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
