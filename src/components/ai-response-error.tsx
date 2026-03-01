import { TerminalIcon } from "@phosphor-icons/react";
import { Alert, AlertDescription } from "./ui/alert";

type Props = {
	error: Error;
};

export default function AiResponseAlert({ error }: Props) {
	return (
		<Alert className="mb-8" variant="destructive">
			<TerminalIcon />
			<AlertDescription>{error.message}</AlertDescription>
		</Alert>
	);
}
