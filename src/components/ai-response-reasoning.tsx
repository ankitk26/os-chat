import { useState } from "react";
import type { CustomUIMessage } from "~/types";
import ReasoningIndicatorText from "./reasoning-indicator-text";
import ReasoningMarkdown from "./reasoning-markdown";
import ReasoningToggleButton from "./reasoning-toggle-button";

type Props = {
	parts: CustomUIMessage["parts"];
	messageContent: string;
	messageId: string;
};

export default function AIResponseReasoning(props: Props) {
	const [showReasoning, setShowReasoning] = useState(false);
	const reasoningPart = props.parts.find((part) => part.type === "reasoning");

	const toggleReasoningDisplay = () => {
		setShowReasoning((prev) => !prev);
	};

	if (!reasoningPart) {
		return null;
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center space-x-2">
				<ReasoningToggleButton
					showReasoning={showReasoning}
					toggleReasoningDisplay={toggleReasoningDisplay}
				/>
				<ReasoningIndicatorText messageContent={props.messageContent} />
			</div>

			{showReasoning && (
				<ReasoningMarkdown
					messageId={props.messageId}
					reasoningContent={reasoningPart.text}
				/>
			)}
		</div>
	);
}
