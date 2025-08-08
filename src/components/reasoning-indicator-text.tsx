type Props = {
  messageContent: string;
};

export default function ReasoningIndicatorText(props: Props) {
  return (
    <div className="text-sm font-mono text-muted-foreground">
      {props.messageContent ? (
        <div>Reasoning</div>
      ) : (
        <div className="animate-pulse">Reasoning...</div>
      )}
    </div>
  );
}
