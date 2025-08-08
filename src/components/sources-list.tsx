import { LinkIcon, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";
import { UIMessage } from "ai";

type Props = {
  sourceParts: Extract<UIMessage["parts"][number], { type: "source" }>[];
};

export default function SourcesList(props: Props) {
  return (
    <div className="flex flex-wrap font-mono text-sm space-x-2 mt-2">
      {props.sourceParts.map((sourcePart) => (
        <Badge key={sourcePart.source.id} variant="secondary" className="my-2">
          <LinkIcon />
          <ExternalLink href={sourcePart.source.url} className="underline">
            {sourcePart.source.title}
          </ExternalLink>
        </Badge>
      ))}
    </div>
  );
}
