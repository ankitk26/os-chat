import { Brain, CaretDown, CaretRight } from "@phosphor-icons/react";

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
				<CaretDown className="size-3" />
			) : (
				<CaretRight className="size-3" />
			)}

			<div className="text-muted-foreground flex items-center gap-2 font-mono text-xs select-none">
				<Brain className="size-3" />
				<div>Reasoning</div>
			</div>
		</div>
	);
}
