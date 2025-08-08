import { UIMessage } from "ai";
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
      <div className="space-x-2 flex items-center">
        <SourcesToggleButton
          toggleSourcesDisplay={toggleSourcesDisplay}
          showSources={showSources}
        />
        <div className="text-sm font-mono text-muted-foreground">Sources</div>
      </div>

      {showSources && <SourcesList sourceParts={sourceParts} />}
    </div>
  );
}
