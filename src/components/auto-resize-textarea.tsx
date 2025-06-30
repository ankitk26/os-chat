import { useParams } from "@tanstack/react-router";
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

  const { chatId } = useParams({ strict: false });

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Resize when the textarea value changes.
  useEffect(() => {
    resizeTextarea();
  }, [textareaValue]);

  // Focus the textarea when the chat ID changes or on initial load.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [chatId]);

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
