import { useState } from "react";
import type { CustomUIMessage } from "~/types";
import SourcesList from "./sources-list";
import SourcesToggleButton from "./sources-toggle-button";

export default function AIResponseSources({
	parts,
}: {
	parts: CustomUIMessage["parts"];
}) {
	const [showSources, setShowSources] = useState(false);
	const sourceParts = parts.filter((part) => part.type === "source-url");

	const toggleSourcesDisplay = () => {
		setShowSources((prev) => !prev);
	};

	if (sourceParts.length === 0) {
		return null;
	}

	return (
		<div>
			<SourcesToggleButton
				showSources={showSources}
				toggleSourcesDisplay={toggleSourcesDisplay}
			/>

			{showSources && <SourcesList sourceParts={sourceParts} />}
		</div>
	);
}
