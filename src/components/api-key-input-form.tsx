import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import type { Provider } from "~/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  formValues: {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (provider: Provider, value: string) => void;
  };
  provider: Provider;
};

export default function ApiKeyInputForm(props: Props) {
  const [showKey, setShowKey] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.formValues.onChange(props.provider, e.target.value);
  };

  const toggleKeyVisibility = () => {
    setShowKey((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input
        className="rounded-sm pr-10 font-mono"
        onChange={handleInputChange}
        placeholder={props.formValues.placeholder ?? ""}
        type={showKey ? "text" : "password"}
        value={props.formValues.value}
      />
      <Button
        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={toggleKeyVisibility}
        size="sm"
        type="button"
        variant="ghost"
      >
        {showKey ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
