import { JSONValue } from "ai";
import { TerminalIcon } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

type Props = {
  data: JSONValue[];
};

export default function AiResponseAlert({ data }: Props) {
  return (
    <Alert className="mb-6 -mt-16">
      <TerminalIcon className="stroke-destructive" />
      <AlertDescription>{JSON.stringify(data)}</AlertDescription>
      {/* <AlertDescription>{(data as any)[0].message}</AlertDescription> */}
    </Alert>
  );
}
