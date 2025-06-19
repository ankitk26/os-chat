import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOutIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react"; // Removed useRef
import { toast } from "sonner";
import ApiKeyInput, { Provider } from "~/components/api-key-input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { authClient } from "~/lib/auth-client";

// Define the full API keys type.
type ApiKeys = {
  gemini: string;
  openai: string;
  anthropic: string;
  openrouter: string;
};

export const Route = createFileRoute("/_auth/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  // State for API keys with strict type safety.
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    gemini: "",
    openai: "",
    anthropic: "",
    openrouter: "",
  });

  // State for OpenRouter toggle.
  const [useOpenRouter, setUseOpenRouter] = useState(false);

  // State to store the initial loaded state from localStorage for comparison
  const [initialApiKeys, setInitialApiKeys] = useState<ApiKeys | null>(null);
  const [initialUseOpenRouter, setInitialUseOpenRouter] = useState<
    boolean | null
  >(null);

  // Load saved settings from localStorage when the component mounts.
  useEffect(() => {
    const storedKeys = localStorage.getItem("apiKeys");
    const storedToggle = localStorage.getItem("useOpenRouter");

    let loadedApiKeys: ApiKeys = {
      gemini: "",
      openai: "",
      anthropic: "",
      openrouter: "",
    };
    if (storedKeys) {
      try {
        loadedApiKeys = JSON.parse(storedKeys) as ApiKeys;
      } catch (e) {
        console.error("Failed to parse stored apiKeys:", e);
      }
    }

    let loadedUseOpenRouter = false;
    if (storedToggle) {
      try {
        const parsedToggle = JSON.parse(storedToggle) as boolean;
        loadedUseOpenRouter = parsedToggle;
      } catch (e) {
        console.error("Failed to parse stored useOpenRouter:", e);
      }
    }

    // Set current states
    setApiKeys(loadedApiKeys);
    setUseOpenRouter(loadedUseOpenRouter);

    // Set initial states (which will cause a re-render, necessary for `hasChanges`)
    setInitialApiKeys(loadedApiKeys);
    setInitialUseOpenRouter(loadedUseOpenRouter);
  }, []);

  // Handler that updates a specific API key.
  const handleApiKeyChange = (provider: Provider, value: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: value }));
  };

  // Handler to save settings (keys and toggle state) to localStorage.
  const handleSave = () => {
    localStorage.setItem("apiKeys", JSON.stringify(apiKeys));
    localStorage.setItem("useOpenRouter", JSON.stringify(useOpenRouter));
    console.log("Saving API keys:", { apiKeys, useOpenRouter });
    toast.success("API keys saved!");

    // Update the initial states to reflect the newly saved state.
    // This will trigger a re-render, causing `hasChanges` to be re-evaluated.
    setInitialApiKeys({ ...apiKeys }); // Deep copy the object for state update
    setInitialUseOpenRouter(useOpenRouter);
  };

  // Determine if there are any pending changes to save
  const hasChanges =
    // Ensure initial states are populated (component has finished initial load)
    initialApiKeys !== null &&
    initialUseOpenRouter !== null &&
    // Deep compare apiKeys object
    (JSON.stringify(apiKeys) !== JSON.stringify(initialApiKeys) ||
      // Compare useOpenRouter boolean
      useOpenRouter !== initialUseOpenRouter);

  return (
    <div className="mx-auto py-6 space-y-6 max-w-5xl w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button
          onClick={async () => {
            await authClient.signOut();
            navigate({ to: "/login" });
          }}
          variant="outline"
        >
          <LogOutIcon />
          Sign out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Keys Configuration</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OpenRouter Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label
                htmlFor="openrouter-toggle"
                className="text-base font-medium"
              >
                Use OpenRouter
              </Label>
              <p className="text-sm text-muted-foreground">
                Route all AI model requests through OpenRouter instead of direct
                provider SDKs
              </p>
            </div>
            <Switch
              id="openrouter-toggle"
              checked={useOpenRouter}
              onCheckedChange={setUseOpenRouter}
            />
          </div>

          <Separator />

          {/* All API Keys are always visible */}
          <div className="space-y-8">
            <ApiKeyInput
              provider="openrouter"
              label="OpenRouter API Key"
              placeholder="sk-or-..."
              value={apiKeys.openrouter}
              onChange={handleApiKeyChange}
            />
            <ApiKeyInput
              provider="openai"
              label="OpenAI API Key"
              placeholder="sk-..."
              value={apiKeys.openai}
              onChange={handleApiKeyChange}
            />
            <ApiKeyInput
              provider="anthropic"
              label="Anthropic API Key"
              placeholder="sk-ant-..."
              value={apiKeys.anthropic}
              onChange={handleApiKeyChange}
            />
            <ApiKeyInput
              provider="gemini"
              label="Gemini API Key"
              placeholder="AI..."
              value={apiKeys.gemini}
              onChange={handleApiKeyChange}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              className="flex items-center gap-2"
              disabled={!hasChanges} // Disable button if no changes
            >
              <SaveIcon className="size-4" />
              <span className="leading-0">Save Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
