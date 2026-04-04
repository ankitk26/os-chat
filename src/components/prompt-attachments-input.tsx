import type { FileUIPart } from "ai";
import type { ChangeEvent, RefObject } from "react";
import type { PendingAttachment } from "~/hooks/use-prompt-attachments";
import FileAttachmentsPreview from "./file-attachments-preview";

type Props = {
	attachments: PendingAttachment[];
	fileInputRef: RefObject<HTMLInputElement | null>;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onRemove: (index: number) => void;
};

const SUPPORTED_ATTACHMENT_ACCEPT =
	"image/*,application/pdf,.c,.cc,.cpp,.cxx,.h,.hh,.hpp,.go,.js,.jsx,.ts,.tsx,.json,.md,.txt,.py,.java,.rs,.rb,.php,.css,.scss,.html,.xml,.yaml,.yml,.sh,.sql,.kt,.swift,.toml,.ini,.env";

export default function PromptAttachmentsInput({
	attachments,
	fileInputRef,
	onChange,
	onRemove,
}: Props) {
	const previewAttachments: Array<FileUIPart & { size?: number }> =
		attachments.map((attachment) => ({
			type: "file",
			filename: attachment.filename,
			mediaType: attachment.mediaType,
			size: attachment.size,
			url: attachment.previewUrl,
		}));

	return (
		<>
			<input
				accept={SUPPORTED_ATTACHMENT_ACCEPT}
				className="hidden"
				multiple
				onChange={onChange}
				ref={fileInputRef}
				type="file"
			/>

			<FileAttachmentsPreview
				attachments={previewAttachments}
				className="mb-3"
				onRemove={onRemove}
			/>
		</>
	);
}
