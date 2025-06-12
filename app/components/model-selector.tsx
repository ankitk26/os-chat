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
            <CrosshairIcon className="size-4" />
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
