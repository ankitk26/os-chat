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
  const selectedModel = useModelStore((store) => store.selectedModel);
  const isWebSearchEnabled = useModelStore((store) => store.isWebSearchEnabled);

  const { chatId: paramsChatId } = useParams({ strict: false });

  const updateChatTitleMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.updateChatTitle),
  });
  const createMessageMutation = useMutation({
    mutationFn: useConvexMutation(api.messages.createMessage),
  });
  const createChatMutation = useMutation({
    mutationFn: useConvexMutation(api.chats.createChat),
  });

  const [textareaValue, setTextareaValue] = useState(input);

  const handleChatTitleUpdate = async (dbGeneratedChatId: Id<"chats">) => {
    const title = await getChatTitle({ data: textareaValue });
    await updateChatTitleMutation.mutateAsync({
      chat: { chatId: dbGeneratedChatId, title },
      sessionToken: data?.session.token ?? "",
    });
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!textareaRef.current?.value) {
        return;
      }

      setInput(textareaValue);
      setInput(textareaRef.current.value);

      if (!paramsChatId) {
        navigate({
          to: "/chat/$chatId",
          params: { chatId: props.chatId },
        });
        const dbGeneratedChatId = await createChatMutation.mutateAsync({
          sessionToken: data?.session.token ?? "",
          uuid: props.chatId,
        });
        handleChatTitleUpdate(dbGeneratedChatId);
      }

      createMessageMutation.mutate({
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
            model: selectedModel,
            isWebSearchEnabled,
            apiKeys: localStorage.getItem("apiKeys"),
            useOpenRouter: localStorage.getItem("useOpenRouter"),
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
      disabled={createChatMutation.isPending || createMessageMutation.isPending}
      onChange={(e) => {
        setTextareaValue(e.target.value);
        resizeTextarea();
      }}
      className="w-full resize-none focus:outline-none min-h-8 max-h-80"
    />
  );
}
