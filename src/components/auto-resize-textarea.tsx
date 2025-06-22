import { useEffect } from "react";

type Props = {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  textareaValue: string;
  setTextareaValue: React.Dispatch<React.SetStateAction<string>>;
  handlePromptSubmit: () => Promise<void>;
  isPending: boolean;
};

export default function AutoResizeTextarea(props: Props) {
  const {
    textareaRef,
    textareaValue,
    handlePromptSubmit,
    setTextareaValue,
    isPending,
  } = props;

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [textareaValue]);

  return (
    <textarea
      value={textareaValue}
      ref={textareaRef}
      rows={1}
      placeholder="Start the conversation..."
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handlePromptSubmit();
        }
      }}
      disabled={isPending}
      onChange={(e) => {
        setTextareaValue(e.target.value);
        resizeTextarea();
      }}
      className="w-full resize-none focus:outline-none text-sm min-h-8 max-h-80"
    />
  );
}
