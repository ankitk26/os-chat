import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { formatTokens } from "~/lib/format-tokens";
import { Skeleton } from "./ui/skeleton";

export default function TokenUsageByModel() {
	const { data: tokenUsage, isPending } = useQuery(
		convexQuery(api.messages.tokensByModel, {}),
	);

	if (isPending) {
		return (
			<div aria-busy="true" className="mt-6 flex flex-col gap-2">
				<Skeleton className="h-5 w-full" />
				<Skeleton className="h-5 w-full" />
				<Skeleton className="h-5 w-full" />
			</div>
		);
	}

	if (!tokenUsage || tokenUsage.length === 0) {
		return null;
	}

	const totalTokens = tokenUsage.reduce(
		(sum: number, item: { tokens: number }) => sum + (item?.tokens || 0),
		0,
	);

	return (
		<div className="mt-6 flex flex-col gap-4">
			<header className="flex flex-col gap-1">
				<h3 className="text-base font-medium text-pretty">
					Model-wise Token Usage
				</h3>
				<p className="text-muted-foreground text-sm">
					Breakdown of tokens used across different AI models
				</p>
			</header>

			<div className="flex flex-col gap-3">
				{tokenUsage.map((usageItem) => {
					const pct =
						totalTokens > 0
							? Math.round((usageItem.tokens / totalTokens) * 100)
							: 0;

					return (
						<div
							className="bg-card rounded-lg border p-3"
							key={usageItem.model}
						>
							<div className="flex items-center justify-between gap-4">
								<div className="flex min-w-0 items-center gap-3">
									<span
										aria-hidden
										className="bg-primary h-3 w-3 rounded-full"
									/>
									<span className="truncate text-sm font-medium">
										{usageItem.model}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-muted-foreground text-sm tabular-nums">
										{formatTokens(usageItem.tokens)}
									</span>
								</div>
							</div>

							<div className="mt-3">
								<div
									aria-label={`${usageItem.model} token share`}
									aria-valuemax={100}
									aria-valuemin={0}
									aria-valuenow={pct}
									className="bg-muted h-2 w-full rounded-md"
									role="progressbar"
								>
									<div
										className="bg-primary h-2 rounded-md"
										style={{ width: `${pct}%` }}
									/>
								</div>
							</div>
						</div>
					);
				})}

				<div className="bg-muted/50 rounded-lg border p-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Total</span>
						<span className="text-sm font-medium tabular-nums">
							{formatTokens(totalTokens)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
