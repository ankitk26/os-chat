import { useRouteContext, useRouter } from "@tanstack/react-router";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { TabsContent } from "~/components/ui/tabs";
import { setAppFont } from "~/server-fns/app-font";
import { useAppearanceStore } from "~/stores/appearance-store";
import { AppFont } from "~/types";
import TokenUsageByModel from "./token-usage-by-model";

export default function AppearanceSettings() {
	const { appFont } = useRouteContext({ from: "__root__" });
	const router = useRouter();

	const showTokenUsage = useAppearanceStore((store) => store.showTokenUsage);
	const toggleShowTokenUsage = useAppearanceStore(
		(store) => store.toggleShowTokenUsage,
	);

	const toggleFont = () => {
		const updatedFont: AppFont =
			appFont === "font-mono" ? "font-sans" : "font-mono";
		// router.invalidate refreshes the route context
		setAppFont({ data: updatedFont }).then(() => router.invalidate());
	};

	return (
		<TabsContent className="flex flex-col gap-12" value="appearance">
			{/* Typography */}
			<section className="flex flex-col gap-5">
				<header className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold text-pretty">Typography</h2>
					<p className="text-muted-foreground text-sm">
						Customize the font family used throughout the application
					</p>
				</header>

				<div className="bg-card rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<div className="flex min-w-0 flex-col gap-1">
							<Label className="font-medium" htmlFor="mono-font">
								Enable Mono Font
							</Label>
						</div>

						<Switch
							aria-label="Enable mono font"
							checked={appFont === "font-mono"}
							id="mono-font"
							onCheckedChange={toggleFont}
						/>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="flex flex-col gap-5">
				<header className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold text-pretty">Stats</h2>
					<p className="text-muted-foreground text-sm">
						Control the display of usage statistics in the application
					</p>
				</header>

				<div className="bg-card rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<div className="flex min-w-0 flex-col gap-1">
							<Label className="font-medium" htmlFor="show-token-usage">
								Show Token Usage
							</Label>
							<p className="text-muted-foreground text-sm">
								Display token consumption by model within the app
							</p>
						</div>

						<Switch
							aria-label="Show token usage"
							checked={showTokenUsage}
							id="show-token-usage"
							onCheckedChange={toggleShowTokenUsage}
						/>
					</div>

					<TokenUsageByModel />
				</div>
			</section>
		</TabsContent>
	);
}
