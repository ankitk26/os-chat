import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  toggleReasoningDisplay: () => void;
  showReasoning: boolean;
};

export default function ReasoningToggleButton(props: Props) {
  return (
    <Button
      className="size-5 cursor-pointer rounded"
      onClick={props.toggleReasoningDisplay}
      size="icon"
      variant="ghost"
    >
      {props.showReasoning ? (
        <ChevronDownIcon className="size-4" />
      ) : (
        <ChevronRightIcon className="size-4" />
      )}
    </Button>
  );
}
