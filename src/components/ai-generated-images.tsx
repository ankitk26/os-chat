import type { CustomUIMessage } from "~/types";

type Props = {
  parts: CustomUIMessage["parts"];
};

export default function AIGeneratedImages({ parts }: Props) {
  return parts
    .filter((part) => part.type === "file")
    .map((part, index) => {
      if (part.mediaType.startsWith("image/")) {
        return (
          <img
            alt="Generated image"
            height={400}
            key={index}
            src={part.url}
            width={400}
          />
        );
      }
      return <pre key={index}>{JSON.stringify(part, null, 4)}</pre>;
    });
}
