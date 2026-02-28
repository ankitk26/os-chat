import { Terminal } from "@phosphor-icons/react";
import { Alert, AlertDescription } from "./ui/alert";

type Props = {
	error: Error;
};

export default function AiResponseAlert({ error }: Props) {
	return (
		<Alert className="mb-8">
			<Terminal className="stroke-destructive" />
			<AlertDescription>{error.message}</AlertDescription>
		</Alert>
	);
}
