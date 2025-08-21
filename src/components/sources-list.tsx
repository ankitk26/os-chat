import type { UIMessage } from "ai";

type Props = {
  sourceParts: Extract<UIMessage["parts"][number], { type: "source" }>[];
};

export default function SourcesList(props: Props) {
  return (
    <div className="mt-4 space-y-2">
      {props.sourceParts.map((sourcePart, index) => {
        return (
          <a
            className="group block rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
            href={sourcePart.source.url}
            key={sourcePart.source.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-foreground text-sm transition-colors group-hover:text-primary">
                  {sourcePart.source.title}
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
