export default function ChatLoadingIndicator() {
	return (
		<div className="space-y-2">
			<div className="text-muted-foreground flex items-center space-x-2">
				<div className="animate-pulse">Thinking...</div>
			</div>
		</div>
	);
}
