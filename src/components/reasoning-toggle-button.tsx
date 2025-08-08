import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  toggleReasoningDisplay: () => void;
  showReasoning: boolean;
};

export default function ReasoningToggleButton(props: Props) {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={props.toggleReasoningDisplay}
      className="cursor-pointer size-5 rounded"
    >
      {props.showReasoning ? (
        <ChevronDownIcon className="size-4" />
      ) : (
        <ChevronRightIcon className="size-4" />
      )}
    </Button>
  );
}
