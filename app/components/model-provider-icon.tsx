import AnthropicIcon from "./anthropic-icon";
import DeepSeekIcon from "./deepseek-icon";
import GeminiIcon from "./gemini-icon";
import OpenAIIcon from "./open-ai-icon";

type Props = {
  provider: string;
};

export default function ModelProviderIcon({ provider }: Props) {
  if (provider === "google") return <GeminiIcon />;
  if (provider === "openai") return <OpenAIIcon />;
  if (provider === "anthropic") return <AnthropicIcon />;

  return <DeepSeekIcon />;
}
