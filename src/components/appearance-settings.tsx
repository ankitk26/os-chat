import { useAppearanceStore } from "~/stores/appearance-store";
import TokenUsageByModel from "./token-usage-by-model";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { TabsContent } from "./ui/tabs";

export default function AppearanceSettings() {
  const enableAllMono = useAppearanceStore((store) => store.enableAllMono);
  const toggleShowTokenUsage = useAppearanceStore(
    (store) => store.toggleShowTokenUsage
  );
  const showTokenUsage = useAppearanceStore((store) => store.showTokenUsage);
  const toggleAllMono = useAppearanceStore((store) => store.toggleAllMono);

  return (
    <TabsContent className="space-y-12" value="appearance">
      <section className="flex flex-col space-y-3">
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Typography</h2>
          <p className="text-muted-foreground text-sm">
            Customize the font family used throughout the application
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Switch
            checked={enableAllMono}
            id="mono-font"
            onCheckedChange={toggleAllMono}
          />
          <Label
            className="flex cursor-pointer items-center space-x-2"
            htmlFor="mono-font"
          >
            <span>Enable Mono Font</span>
          </Label>
        </div>
      </section>

      <section>
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Stats</h2>
            <p className="text-muted-foreground text-sm">
              Control the display of usage statistics in the application
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              checked={showTokenUsage}
              id="show-token-usage"
              onCheckedChange={toggleShowTokenUsage}
            />
            <Label
              className="flex cursor-pointer items-center space-x-2"
              htmlFor="show-token-usage"
            >
              <span>Show Token Usage</span>
            </Label>
          </div>

          <TokenUsageByModel />
        </div>
      </section>
    </TabsContent>
  );
}
