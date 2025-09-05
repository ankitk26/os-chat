import type { JSX } from "react";
import AnthropicIcon from "./anthropic-icon";
import DeepSeekIcon from "./deepseek-icon";
import GeminiIcon from "./gemini-icon";
import MoonShotIcon from "./moonshot-icon";
import OpenAIIcon from "./open-ai-icon";
import QwenIcon from "./qwen-icon";
import XAIIcon from "./xai-icon";

type Props = {
  provider: string;
};

const iconMap: { [key: string]: () => JSX.Element } = {
  google: GeminiIcon,
  openai: OpenAIIcon,
  anthropic: AnthropicIcon,
  qwen: QwenIcon,
  xai: XAIIcon,
  deepseek: DeepSeekIcon,
  moonshot: MoonShotIcon,
};

export default function ModelProviderIcon({ provider }: Props) {
  const Icon = iconMap[provider] || DeepSeekIcon;
  return <Icon />;
}
