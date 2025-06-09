import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import CodeHighlight from "./code-highlight";

type Props = {
  message: string;
};

export default function AssistantMessage({ message }: Props) {
  return (
    <div className="leading-6 prose prose-neutral dark:prose-invert prose-rose prose-pre:bg-transparent prose-pre:m-0 prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        children={message}
        components={{
          code: CodeHighlight,
        }}
      />
    </div>
  );
}
