import type { SourceUrlUIPart } from "ai";

type Props = {
  sourceParts: SourceUrlUIPart[];
};

export default function SourcesList(props: Props) {
  return (
    <div className="mt-4 space-y-2">
      {props.sourceParts.map((sourcePart, index) => (
        <a
          className="group block rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
          href={sourcePart.url}
          key={sourcePart.sourceId}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="line-clamp-2 text-foreground text-sm transition-colors group-hover:text-primary">
                {sourcePart.title}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
