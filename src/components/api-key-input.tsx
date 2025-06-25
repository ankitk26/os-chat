import { EyeIcon, EyeOffIcon, KeyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ApiKeys } from "~/types";
import ExternalLink from "./external-link";
import ModelProviderIcon from "./model-provider-icon";

export type Provider = keyof ApiKeys;

interface ApiKeyInputProps {
  provider: Provider;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (provider: Provider, value: string) => void;
  keyLink: string;
}

export default function ApiKeyInput(props: ApiKeyInputProps) {
  const { provider, label, placeholder = "", value, onChange, keyLink } = props;

  // Local component state to toggle key visibility.
  const [showKey, setShowKey] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(provider, e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground">
        <div className="flex items-center space-x-2">
          {provider === "openrouter" ? (
            <KeyIcon className="size-4 stroke-muted-foreground" />
          ) : (
            <ModelProviderIcon
              provider={provider === "gemini" ? "google" : provider}
            />
          )}
          <span>{label}</span>
        </div>
      </Label>
      <div className="relative">
        <Input
          type={showKey ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="pr-10 font-mono"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </Button>
      </div>
      <small className="text-xs text-muted-foreground">
        Get your{" "}
        <ExternalLink href={keyLink} className="text-primary">
          API key
        </ExternalLink>
      </small>
    </div>
  );
}
