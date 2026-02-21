import type { SourceUrlUIPart } from "ai";

type Props = {
	sourceParts: SourceUrlUIPart[];
};

export default function SourcesList(props: Props) {
	return (
		<div className="space-y-2">
			{props.sourceParts.map((sourcePart, index) => (
				<a
					className="group border-border bg-card hover:bg-accent block rounded-lg border p-3 transition-colors"
					href={sourcePart.url}
					key={sourcePart.sourceId}
					rel="noopener noreferrer"
					target="_blank"
				>
					<div className="flex items-center gap-3">
						<span className="bg-muted text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
							{index + 1}
						</span>
						<div className="min-w-0 flex-1">
							<div className="text-foreground group-hover:text-primary line-clamp-2 text-xs transition-colors">
								{sourcePart.title}
							</div>
						</div>
					</div>
				</a>
			))}
		</div>
	);
}
