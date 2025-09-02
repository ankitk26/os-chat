import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { formatTokens } from "~/lib/format-tokens";
import { Skeleton } from "./ui/skeleton";

export default function TokenUsageByModel() {
  const { auth } = useRouteContext({ from: "/_auth" });
  const { data: tokenUsage, isPending } = useQuery(
    convexQuery(api.messages.tokensByModel, {
      sessionToken: auth.session.token,
    })
  );

  return (
    <div className="mt-8 space-y-4">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Breakdown of tokens used across different AI models
        </p>
      </div>

      <div className="space-y-3">
        {isPending ? (
          <>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </>
        ) : (
          tokenUsage?.map((usageItem) => (
            <div
              className="flex items-center justify-between rounded-lg border bg-card p-3"
              key={usageItem.model}
            >
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="font-medium text-sm">{usageItem.model}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground text-sm">
                  {formatTokens(usageItem.tokens)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      {/* <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
          <span className="font-medium text-sm">Total</span>
          <span className="font-medium text-sm">
            {formatTokens(totalTokens)}
          </span>
        </div> */}
    </div>
  );
}
