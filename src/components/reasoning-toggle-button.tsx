import { BrainIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";

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
				<ChevronDownIcon className="size-4" />
			) : (
				<ChevronRightIcon className="size-4" />
			)}

			<div className="text-muted-foreground flex items-center gap-2 font-mono text-sm select-none">
				<BrainIcon className="size-4" />
				{props.messageContent ? (
					<div>Reasoning</div>
				) : (
					<div className="animate-pulse">Thinking...</div>
				)}
			</div>
		</div>
	);
}
