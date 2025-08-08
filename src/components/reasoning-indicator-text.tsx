type Props = {
  messageContent: string;
};

export default function ReasoningIndicatorText(props: Props) {
  return (
    <div className="font-mono text-muted-foreground text-sm">
      {props.messageContent ? (
        <div>Reasoning</div>
      ) : (
        <div className="animate-pulse">Reasoning...</div>
      )}
    </div>
  );
}
