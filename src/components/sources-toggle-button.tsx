import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  toggleSourcesDisplay: () => void;
  showSources: boolean;
};

export default function SourcesToggleButton(props: Props) {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={props.toggleSourcesDisplay}
      className="cursor-pointer size-5 rounded"
    >
      {props.showSources ? (
        <ChevronDownIcon className="size-4" />
      ) : (
        <ChevronRightIcon className="size-4" />
      )}
    </Button>
  );
}
