import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  initialValue: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
};

export default function UserMessageEditor({
  initialValue,
  onSubmit,
  onCancel,
}: Props) {
  const [input, setInput] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setInput(initialValue);
      onCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    resizeTextarea();
  };

  // Resize when the textarea value changes
  useEffect(() => {
    // Use requestAnimationFrame to resize after the DOM has updated
    // This prevents the layout shift from causing scroll jumping
    requestAnimationFrame(() => {
      resizeTextarea();
    });
  }, [resizeTextarea]);

  // Focus the textarea when editing starts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus({ preventScroll: true });
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="max-h-80 min-h-8 w-full resize-none border-0 bg-transparent p-0 text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={textareaRef}
        rows={1}
        value={input}
      />
    </form>
  );
}
