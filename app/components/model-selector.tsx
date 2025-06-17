import { CrosshairIcon } from "lucide-react";
import { modelProviders } from "~/constants/model-providers";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";
import { useModelStore } from "~/stores/model-store";

export default function ModelSelector() {
  const { model, setModel } = useModelStore();

  return (
    <Select value={model} onValueChange={(val) => setModel(val)}>
      <SelectTrigger className="font-medium shadow-none hover:bg-accent dark:border-0 dark:bg-transparent">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="flex items-center gap-2 py-3 text-sm">
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 fill-foreground"
            >
              <title>Google Gemini</title>
              <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
            </svg>
            <span>Gemini</span>
          </SelectLabel>
          {modelProviders.map((model) => (
            <SelectItem
              className="py-3"
              key={model.modelId}
              value={model.modelId}
            >
              {model.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
