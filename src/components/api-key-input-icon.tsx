import { Key } from "@phosphor-icons/react";
import type { ApiKeys } from "~/types";
import ModelProviderIcon from "./model-provider-icon";

type Props = {
	provider: keyof ApiKeys;
};

export default function ApiKeyInputIcon(props: Props) {
	if (props.provider === "openrouter") {
		return <Key className="stroke-muted-foreground size-4" />;
	}

	const finalProvider = props.provider === "gemini" ? "google" : props.provider;
	return <ModelProviderIcon provider={finalProvider} />;
}
