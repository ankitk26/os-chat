import AnthropicIcon from "./anthropic-icon";
import DeepSeekIcon from "./deepseek-icon";
import GeminiIcon from "./gemini-icon";
import OpenAIIcon from "./open-ai-icon";
import QwenIcon from "./qwen-icon";
import XAIIcon from "./xai-icon";

type Props = {
  provider: string;
};

export default function ModelProviderIcon({ provider }: Props) {
  if (provider === "google") return <GeminiIcon />;
  if (provider === "openai") return <OpenAIIcon />;
  if (provider === "anthropic") return <AnthropicIcon />;
  if (provider === "qwen") return <QwenIcon />;
  if (provider === "xai") return <XAIIcon />;

  return <DeepSeekIcon />;
}
