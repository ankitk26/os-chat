import { TypeIcon } from "lucide-react";
import { useAppearanceStore } from "~/stores/appearance-store";
import { Button } from "./ui/button";
import { TabsContent } from "./ui/tabs";

export default function AppearanceSettings() {
  const enableAllMono = useAppearanceStore((store) => store.enableAllMono);
  const toggleEnableAllMono = useAppearanceStore(
    (store) => store.toggleEnableAllMono
  );

  return (
    <TabsContent value="appearance" className="space-y-3">
      <h2 className="text-lg font-semibold">Typography</h2>
      <p className="text-muted-foreground text-sm">
        Customize the font family used throughout the application
      </p>
      <Button
        onClick={toggleEnableAllMono}
        size="sm"
        variant={enableAllMono ? "default" : "outline"}
      >
        <TypeIcon className="size-4" />
        {enableAllMono ? "Disable" : "Enable"} Mono Font
      </Button>
    </TabsContent>
  );
}
