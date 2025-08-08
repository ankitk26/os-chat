import type { UIMessage } from "ai";
import { LinkIcon } from "lucide-react";
import CustomExternalLink from "./custom-external-link";
import { Badge } from "./ui/badge";

type Props = {
  sourceParts: Extract<UIMessage["parts"][number], { type: "source" }>[];
};

export default function SourcesList(props: Props) {
  return (
    <div className="mt-2 flex flex-wrap space-x-2 font-mono text-sm">
      {props.sourceParts.map((sourcePart) => (
        <Badge className="my-2" key={sourcePart.source.id} variant="secondary">
          <LinkIcon />
          <CustomExternalLink
            className="underline"
            href={sourcePart.source.url}
          >
            {sourcePart.source.title}
          </CustomExternalLink>
        </Badge>
      ))}
    </div>
  );
}
