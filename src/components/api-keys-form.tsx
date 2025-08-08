import { SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePersistedApiKeysStore } from "~/stores/persisted-api-keys-store";
import { type ApiKeys, defaultApiKeys, type Provider } from "~/types";
import ApiKeyInput from "./api-key-input";
import ApiKeyOpenRouter from "./api-key-open-router";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { TabsContent } from "./ui/tabs";

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

type FormState = {
  apiKeys: ApiKeys;
  useOpenRouter: boolean;
} | null;

export default function ApiKeysForm() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(defaultApiKeys);
  const [useOpenRouter, setUseOpenRouter] = useState(false);
  const [initialState, setInitialState] = useState<FormState>(null);

  const {
    persistedApiKeys,
    persistedUseOpenRouter,
    setPersistedApiKeys,
    setPersistedUseOpenRouter,
  } = usePersistedApiKeysStore();

  // update key value for all provider keys
  const handleApiKeyChange = (provider: Provider, value: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: value }));
  };

  // save keys and useOpenRouter setting in local storage
  const handleSave = () => {
    setPersistedApiKeys(apiKeys);
    setPersistedUseOpenRouter(useOpenRouter);
    toast.success("API keys saved!");
    setInitialState({ apiKeys: { ...apiKeys }, useOpenRouter });
  };

  // check if form has changed after its original state
  const hasChanges =
    initialState &&
    (JSON.stringify(apiKeys) !== JSON.stringify(initialState.apiKeys) ||
      useOpenRouter !== initialState.useOpenRouter);

  // load all values from localStorage into local state
  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only when component renders
  useEffect(() => {
    setApiKeys(persistedApiKeys);
    setUseOpenRouter(persistedUseOpenRouter);
    setInitialState({
      apiKeys: persistedApiKeys,
      useOpenRouter: persistedUseOpenRouter,
    });
  }, []);

  return (
    <TabsContent value="apiKeys">
      <div className="space-y-6">
        <ApiKeyOpenRouter
          apiKeys={apiKeys}
          setUseOpenRouter={setUseOpenRouter}
          useOpenRouter={useOpenRouter}
        />

        <Separator />

        <div className="space-y-12">
          {keysForm.map((keyItem) => (
            <ApiKeyInput
              formValues={{
                label: `${keyItem.label} API Key`,
                placeholder: keyItem.placeholder,
                value: apiKeys[keyItem.provider as Provider],
                onChange: handleApiKeyChange,
              }}
              key={keyItem.provider}
              keyLink={keyItem.keyLink}
              provider={keyItem.provider as Provider}
            />
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            className="flex items-center gap-2"
            disabled={!hasChanges}
            onClick={handleSave}
          >
            <SaveIcon className="size-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
