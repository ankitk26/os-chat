import { BrainIcon } from "lucide-react";

type Props = {
  messageContent: string;
};

export default function ReasoningIndicatorText(props: Props) {
  return (
    <div className="flex items-center gap-2 font-mono text-muted-foreground text-sm">
      <BrainIcon className="size-4" />
      {props.messageContent ? (
        <div>Reasoning</div>
      ) : (
        <div className="animate-pulse">Thinking...</div>
      )}
    </div>
  );
}
