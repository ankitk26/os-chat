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
    <TabsContent value="appearance" className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Typography</h2>
        <p className="text-muted-foreground text-sm">
          Customize the font family used throughout the application
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <Switch
          id="mono-font"
          checked={enableAllMono}
          onCheckedChange={toggleEnableAllMono}
        />
        <Label
          htmlFor="mono-font"
          className="flex items-center space-x-2 cursor-pointer"
        >
          <span>Enable Mono Font</span>
        </Label>
      </div>
    </TabsContent>
  );
}
