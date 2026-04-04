import type { CustomUIMessage } from "~/types";
import GeneratedImageViewer from "./generated-image-viewer";

type Props = {
	parts: CustomUIMessage["parts"];
};

export default function AIGeneratedImages({ parts }: Props) {
	return parts
		.filter((part) => part.type === "file")
		.map((part, index) => {
			if (part.mediaType.startsWith("image/")) {
				return (
					<GeneratedImageViewer
						key={index}
						alt="Generated image"
						imageUrl={part.url}
						className="pb-0"
						imgClassName="max-h-[400px] w-auto max-w-full"
						mobileActionsSide="left"
						triggerClassName="block cursor-pointer p-0"
						wrapperClassName="group relative inline-block overflow-hidden rounded-lg border"
					/>
				);
			}
			return <pre key={index}>{JSON.stringify(part, null, 4)}</pre>;
		});
}
