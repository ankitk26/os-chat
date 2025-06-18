import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import { authQueryOptions } from "~/queries/auth";
import { getChatTitle } from "~/server-fns/get-chat-title";
import { useModelStore } from "~/stores/model-store";

type Props = {
  chatId: string;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
};

export default function AutoResizeTextarea(props: Props) {
  const { input, setInput, append } = props;

  const { data } = useQuery(authQueryOptions);
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const model = useModelStore((store) => store.model);
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);

  const { chatId: paramsChatId } = useParams({ strict: false });

  const { mutateAsync: updateChatTitle } = useMutation({
    mutationFn: useConvexMutation(api.chats.updateChatTitle),
  });

  const { mutateAsync: createMessage, isPending: isMessageCreationPending } =
    useMutation({ mutationFn: useConvexMutation(api.messages.createMessage) });

  const { mutateAsync: createChat, isPending: isChatCreationPending } =
    useMutation({ mutationFn: useConvexMutation(api.chats.createChat) });

  const [textareaValue, setTextareaValue] = useState(input);

  const handleChatTitleUpdate = async (newChatId: string) => {
    const title = await getChatTitle({ data: textareaValue });
    await updateChatTitle({
      chat: { chatId: newChatId as Id<"chats">, title },
      sessionToken: data?.session.token ?? "",
    });
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!textareaRef.current?.value) {
        return;
      }

      setInput(textareaValue); // Update the external input state
      setInput(textareaRef.current.value);

      navigate({
        to: "/chat/$chatId",
        params: { chatId: props.chatId },
      });

      if (!paramsChatId) {
        const newChatId = await createChat({
          sessionToken: data?.session.token ?? "",
          uuid: props.chatId,
        });
        handleChatTitleUpdate(newChatId);
      }

      await createMessage({
        messageBody: {
          chatId: props.chatId,
          content: textareaValue,
          role: "user",
        },
        sessionToken: data?.session.token ?? "",
      });

      append(
        {
          content: textareaValue,
          role: "user",
          parts: [{ type: "text", text: textareaValue }],
        },
        {
          body: {
            model,
            isWebSearchEnabled,
          },
        }
      );

      setTextareaValue("");
    }
  };

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
      onKeyDown={handleKeyDown}
      disabled={isChatCreationPending || isMessageCreationPending}
      onChange={(e) => {
        setTextareaValue(e.target.value);
        resizeTextarea();
      }}
      className="w-full resize-none focus:outline-none min-h-4 max-h-80"
    />
  );
}
