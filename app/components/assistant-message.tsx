import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeHighlight from "./code-highlight";

type Props = {
  message: string;
};

export default function AssistantMessage({ message }: Props) {
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        children={message}
        components={{
          code: CodeHighlight,
        }}
      />
    </div>
  );
}
