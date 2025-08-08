import type { ApiKeys } from "~/types";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

type Props = {
  apiKeys: ApiKeys;
  useOpenRouter: boolean;
  setUseOpenRouter: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ApiKeyOpenRouter(props: Props) {
  const isSwitchDisabled = props.apiKeys.openrouter.trim() === "";

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-1">
        <Label className="font-medium text-base" htmlFor="openrouter-toggle">
          Use OpenRouter
        </Label>
        <p className="text-muted-foreground text-sm">
          Route all AI model requests through OpenRouter
        </p>
        {isSwitchDisabled && (
          <p className="text-destructive text-xs">
            Please provide an OpenRouter API Key to enable this option.
          </p>
        )}
      </div>
      <Switch
        checked={props.useOpenRouter && !isSwitchDisabled}
        disabled={isSwitchDisabled} // Ensure it's unchecked if disabled without a key
        id="openrouter-toggle"
        onCheckedChange={props.setUseOpenRouter} // Disable the switch
      />
    </div>
  );
}
