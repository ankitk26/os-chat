import { BrainIcon } from "lucide-react";

type Props = {
	messageContent: string;
};

export default function ReasoningIndicatorText(props: Props) {
	return (
		<div className="text-muted-foreground flex items-center gap-2 font-mono text-sm">
			<BrainIcon className="size-4" />
			{props.messageContent ? (
				<div>Reasoning</div>
			) : (
				<div className="animate-pulse">Thinking...</div>
			)}
		</div>
	);
}
