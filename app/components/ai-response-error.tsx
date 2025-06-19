import { TerminalIcon } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

type Props = {
  error: Error;
};

export default function AiResponseAlert({ error }: Props) {
  return (
    <Alert className="mb-8 -mt-10">
      <TerminalIcon className="stroke-destructive" />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
