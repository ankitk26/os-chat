import {
	BrainIcon,
	CaretDownIcon,
	CaretRightIcon,
} from "@phosphor-icons/react";

type Props = {
	toggleReasoningDisplay: () => void;
	showReasoning: boolean;
	messageContent: string;
};

export default function ReasoningToggleButton(props: Props) {
	return (
		<div
			className="flex cursor-pointer items-center gap-2 rounded px-1 py-1"
			onClick={props.toggleReasoningDisplay}
		>
			{props.showReasoning ? (
				<CaretDownIcon className="size-3" />
			) : (
				<CaretRightIcon className="size-3" />
			)}

			<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground select-none">
				<BrainIcon className="size-3" />
				<div>Reasoning</div>
			</div>
		</div>
	);
}
