import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

type Props = {
  message: string;
};

export default function UserMessage({ message }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-end">
      <div
        className="bg-secondary max-w-3xl py-3 px-4 rounded-lg whitespace-pre-wrap"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {message}
      </div>
      {/* <div className={cn("flex", isHovered ? "visible" : "hidden")}>
        <Button
          size="sm"
          variant="ghost"
          onClick={async () => {
            await navigator.clipboard.writeText(message);
          }}
        >
          <CopyIcon />
        </Button>
      </div> */}
    </div>
  );
}
