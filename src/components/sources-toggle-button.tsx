import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  toggleSourcesDisplay: () => void;
  showSources: boolean;
};

export default function SourcesToggleButton(props: Props) {
  return (
    <Button
      className="size-5 cursor-pointer rounded"
      onClick={props.toggleSourcesDisplay}
      size="icon"
      variant="ghost"
    >
      {props.showSources ? (
        <ChevronDownIcon className="size-4" />
      ) : (
        <ChevronRightIcon className="size-4" />
      )}
    </Button>
  );
}
