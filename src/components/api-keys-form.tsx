import { SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiKeys } from "~/types";
import ApiKeyInput, { Provider } from "./api-key-input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { TabsContent } from "./ui/tabs";

const defaultApiKeys: ApiKeys = {
  gemini: "",
  openai: "",
  anthropic: "",
  openrouter: "",
  xai: "",
};

const keysForm = [
  {
    provider: "openrouter",
    label: "OpenRouter",
    placeholder: "sk-or-...",
    keyLink: "https://openrouter.ai/settings/keys",
  },
  {
    provider: "openai",
    label: "OpenAI",
    placeholder: "sk-...",
    keyLink: "https://platform.openai.com/api-keys",
  },
  {
    provider: "anthropic",
    label: "Anthropic",
    placeholder: "sk-ant-...",
    keyLink: "https://console.anthropic.com/settings/keys",
  },
  {
    provider: "gemini",
    label: "Gemini",
    placeholder: "AI...",
    keyLink: "https://aistudio.google.com/app/apikey",
  },
  {
    provider: "xai",
    label: "xAI",
    placeholder: "xai...",
    keyLink: "https://console.x.ai/",
  },
];

export default function ApiKeysForm() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(defaultApiKeys);
  const [useOpenRouter, setUseOpenRouter] = useState(false);
  const [initialState, setInitialState] = useState<{
    apiKeys: ApiKeys;
    useOpenRouter: boolean;
  } | null>(null);

  useEffect(() => {
    const loadedApiKeys = JSON.parse(
      localStorage.getItem("apiKeys") || JSON.stringify(defaultApiKeys)
    );
    const loadedUseOpenRouter = JSON.parse(
      localStorage.getItem("useOpenRouter") || "false"
    );

    setApiKeys(loadedApiKeys);
    setUseOpenRouter(loadedUseOpenRouter);
    setInitialState({
      apiKeys: loadedApiKeys,
      useOpenRouter: loadedUseOpenRouter,
    });
  }, []);

  const handleApiKeyChange = (provider: Provider, value: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("apiKeys", JSON.stringify(apiKeys));
    localStorage.setItem("useOpenRouter", JSON.stringify(useOpenRouter));
    toast.success("API keys saved!");
    setInitialState({ apiKeys: { ...apiKeys }, useOpenRouter });
  };

  const hasChanges =
    initialState &&
    (JSON.stringify(apiKeys) !== JSON.stringify(initialState.apiKeys) ||
      useOpenRouter !== initialState.useOpenRouter);

  return (
    <TabsContent value="apiKeys">
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label
              htmlFor="openrouter-toggle"
              className="text-base font-medium"
            >
              Use OpenRouter
            </Label>
            <p className="text-sm text-muted-foreground">
              Route all AI model requests through OpenRouter
            </p>
          </div>
          <Switch
            id="openrouter-toggle"
            checked={useOpenRouter}
            onCheckedChange={setUseOpenRouter}
          />
        </div>

        <Separator />

        <div className="space-y-12">
          {keysForm.map((keyItem) => (
            <ApiKeyInput
              key={keyItem.provider}
              provider={keyItem.provider as Provider}
              label={`${keyItem.label} API Key`}
              keyLink={keyItem.keyLink}
              placeholder={keyItem.placeholder}
              value={apiKeys[keyItem.provider as keyof ApiKeys]}
              onChange={handleApiKeyChange}
            />
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
            disabled={!hasChanges}
          >
            <SaveIcon className="size-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
