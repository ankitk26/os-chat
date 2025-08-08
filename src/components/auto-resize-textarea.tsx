/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Only run useEffect on first render */
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
      className="max-h-80 min-h-8 w-full resize-none text-sm focus:outline-none"
      disabled={isPending}
      onChange={(e) => {
        setTextareaValue(e.target.value);
        resizeTextarea();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handlePromptSubmit();
        }
      }}
      placeholder="Start the conversation..."
      ref={textareaRef}
      rows={1}
      value={textareaValue}
    />
  );
}
