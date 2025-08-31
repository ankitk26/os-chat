export default function ChatLoadingIndicator() {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className="animate-pulse">Thinking...</div>
      </div>
    </div>
  );
}
