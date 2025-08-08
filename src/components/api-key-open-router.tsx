import { ApiKeys } from "~/types";
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
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <Label htmlFor="openrouter-toggle" className="text-base font-medium">
          Use OpenRouter
        </Label>
        <p className="text-sm text-muted-foreground">
          Route all AI model requests through OpenRouter
        </p>
        {isSwitchDisabled && (
          <p className="text-xs">
            Please provide an OpenRouter API Key to enable this option.
          </p>
        )}
      </div>
      <Switch
        id="openrouter-toggle"
        checked={props.useOpenRouter && !isSwitchDisabled} // Ensure it's unchecked if disabled without a key
        onCheckedChange={props.setUseOpenRouter}
        disabled={isSwitchDisabled} // Disable the switch
      />
    </div>
  );
}
