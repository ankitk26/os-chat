import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  messages: UIMessage[];
};

export default function ChatMessages({ messages }: Props) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="my-8 space-y-16">
      {messages.map((m) => (
        <div key={m.id} className="space-y-2">
          <div>
            {m.role === "user" ? (
              <div className="flex justify-end">
                <div className="bg-input/40 max-w-3xl p-4 rounded-lg whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
            ) : (
              <div>
                <ReactMarkdown
                  components={{
                    code(props) {
                      const { children, className, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          PreTag="div"
                          language={match[1]}
                          style={codeTheme}
                          className="rounded-lg text-sm"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          {...rest}
                          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                        >
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mb-4 mt-6">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold mb-3 mt-5">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold mb-2 mt-4">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-3 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-3 space-y-1 ml-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic my-4">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-muted">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-muted bg-muted/50 px-3 py-2 text-left font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-muted px-3 py-2">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
