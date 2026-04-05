import { SpinnerIcon, PaperclipIcon } from "@phosphor-icons/react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

type Props = {
	attachmentCount?: number;
	disabled?: boolean;
	isUploading?: boolean;
	onAttachClick?: () => void;
};

export default function InputUploadButton({
	attachmentCount,
	disabled,
	isUploading,
	onAttachClick,
}: Props) {
	return (
		<Button
			className={cn(
				"transition-all duration-300 ease-out",
				attachmentCount &&
					attachmentCount > 0 &&
					"border-primary/60 bg-primary/8 text-foreground",
			)}
			disabled={disabled}
			onClick={onAttachClick}
			type="button"
			variant="outline"
		>
			{isUploading ? (
				<>
					<SpinnerIcon className="size-4 animate-spin" />
					<span>Uploading...</span>
				</>
			) : (
				<>
					<PaperclipIcon />
					<span className="hidden sm:inline">Upload</span>
					<span className="sm:hidden">File</span>
				</>
			)}
			{!isUploading && attachmentCount && attachmentCount > 0 && (
				<span className="rounded-full bg-foreground px-1.5 py-0.5 text-[10px] leading-none text-background">
					{attachmentCount}
				</span>
			)}
		</Button>
	);
}
