import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { useTextSelectionStore } from "~/stores/text-selection-store";
import MemoizedMarkdown from "./memoized-markdown";
import { Button } from "./ui/button";

type Props = {
  messageId: string;
  messageContent: string;
};

export default function AIResponseContent({
  messageContent,
  messageId,
}: Props) {
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const { setSelectedText } = useTextSelectionStore();

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0) {
      setShowCopyButton(true);
      const range = selection?.getRangeAt(0);
      if (range) {
        const rect = range.getBoundingClientRect();
        setSelectionRect(rect);
      }
    } else {
      setShowCopyButton(false);
      setSelectionRect(null);
    }
  };

  const handleCopyToPrompt = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText) {
      setSelectedText(selectedText);
      setShowCopyButton(false);
      setSelectionRect(null);
      // Clear the selection
      selection?.removeAllRanges();
    }
  };

  const handleMouseUp = () => {
    // Small delay to ensure selection is complete
    setTimeout(handleTextSelection, 10);
  };

  return (
    <div className="relative">
      <div
        className="prose prose-neutral dark:prose-invert prose-rose prose-sm prose-pre:m-0 w-full max-w-full select-text break-words prose-pre:bg-transparent prose-pre:p-0 leading-8"
        onMouseUp={handleMouseUp}
      >
        <MemoizedMarkdown content={messageContent} id={messageId} />
      </div>

      {showCopyButton && selectionRect && (
        <div
          className="fixed z-50"
          style={{
            top: selectionRect.top - 40,
            left: selectionRect.left + selectionRect.width / 2 - 40,
          }}
        >
          <Button
            className="flex items-center gap-2 text-xs shadow-lg"
            onClick={handleCopyToPrompt}
            size="sm"
            variant="secondary"
          >
            <CopyIcon className="size-3" />
            Copy to prompt
          </Button>
        </div>
      )}
    </div>
  );
}
