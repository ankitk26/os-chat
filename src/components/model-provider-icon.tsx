import type { JSX } from "react";
import AnthropicIcon from "./anthropic-icon";
import DeepSeekIcon from "./deepseek-icon";
import GeminiIcon from "./gemini-icon";
import MiniMaxIcon from "./minimax-icon";
import MoonShotIcon from "./moonshot-icon";
import OpenAIIcon from "./open-ai-icon";
import XAIIcon from "./xai-icon";
import ZaiIcon from "./zai-icon";

type Props = {
	provider: string;
};

const iconMap: { [key: string]: () => JSX.Element } = {
	google: GeminiIcon,
	openai: OpenAIIcon,
	anthropic: AnthropicIcon,
	xai: XAIIcon,
	deepseek: DeepSeekIcon,
	moonshot: MoonShotIcon,
	zai: ZaiIcon,
	minimax: MiniMaxIcon,
};

export default function ModelProviderIcon({ provider }: Props) {
	const Icon = iconMap[provider] || DeepSeekIcon;
	return <Icon />;
}
