import { UIMessage } from "ai";
import { ChevronDownIcon, ChevronRightIcon, LinkIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function AIResponseSources({ message }: { message: UIMessage }) {
  const [showSources, setShowSources] = useState(false);
  const sourceParts = message.parts.filter((part) => part.type === "source");

  if (sourceParts.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="space-x-2 flex items-center">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setShowSources((prev) => !prev);
          }}
          className="cursor-pointer size-5 rounded"
        >
          {showSources ? (
            <ChevronDownIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
        </Button>

        <div className="text-sm font-mono text-muted-foreground">Sources</div>
      </div>

      {showSources && (
        <div className="flex flex-wrap font-mono text-sm space-x-2 mt-2">
          {sourceParts.map((sourcePart) => (
            <Badge
              key={sourcePart.source.id}
              variant="secondary"
              className="my-2"
            >
              <LinkIcon />
              <a
                href={sourcePart.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {sourcePart.source.title}
              </a>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
