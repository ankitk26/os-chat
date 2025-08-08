import { useAppearanceStore } from "~/stores/appearance-store";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { TabsContent } from "./ui/tabs";

export default function AppearanceSettings() {
  const enableAllMono = useAppearanceStore((store) => store.enableAllMono);
  const toggleEnableAllMono = useAppearanceStore(
    (store) => store.toggleEnableAllMono
  );

  return (
    <TabsContent className="space-y-6" value="appearance">
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
          onCheckedChange={toggleEnableAllMono}
        />
        <Label
          className="flex cursor-pointer items-center space-x-2"
          htmlFor="mono-font"
        >
          <span>Enable Mono Font</span>
        </Label>
      </div>
    </TabsContent>
  );
}
