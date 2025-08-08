import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Provider } from "~/types";

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
        type={showKey ? "text" : "password"}
        placeholder={props.formValues.placeholder ?? ""}
        value={props.formValues.value}
        onChange={handleInputChange}
        className="pr-10 rounded-sm font-mono"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={toggleKeyVisibility}
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
