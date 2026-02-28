import type { ApiKeys } from "~/types";
import ModelProviderIcon from "./model-provider-icon";

type Props = {
	provider: keyof ApiKeys;
};

export default function ApiKeyInputIcon(props: Props) {
	const finalProvider = props.provider === "gemini" ? "google" : props.provider;
	return <ModelProviderIcon provider={finalProvider} />;
}
