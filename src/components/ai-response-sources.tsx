import type { UIMessage } from "ai";
import { useState } from "react";
import SourcesList from "./sources-list";
import SourcesToggleButton from "./sources-toggle-button";

export default function AIResponseSources({ message }: { message: UIMessage }) {
  const [showSources, setShowSources] = useState(false);
  const sourceParts = message.parts.filter((part) => part.type === "source");

  const toggleSourcesDisplay = () => {
    setShowSources((prev) => !prev);
  };

  if (sourceParts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-2">
        <SourcesToggleButton
          showSources={showSources}
          toggleSourcesDisplay={toggleSourcesDisplay}
        />
        <div className="font-mono text-muted-foreground text-sm">Sources</div>
      </div>

      {showSources && <SourcesList sourceParts={sourceParts} />}
    </div>
  );
}
