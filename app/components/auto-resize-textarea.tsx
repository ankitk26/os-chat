import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChatRequestOptions } from "ai";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { authClient } from "~/lib/auth-client";
import { getChatTitle } from "~/server-fns/get-chat-title";
import { useModelStore } from "~/stores/model-store";

type Props = {
  chatId: string;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
};

export default function AutoResizeTextarea(props: Props) {
  const { input, setInput, handleSubmit } = props;

  const { data } = authClient.useSession();
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

  const handleChatTitleUpdate = async (newChatId: string) => {
    const title = await getChatTitle({ data: input });
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
          content: input,
          role: "user",
        },
        sessionToken: data?.session.token ?? "",
      });

      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, {
        body: {
          model,
          isWebSearchEnabled,
        },
      });
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
  }, [textareaRef.current?.value]);

  return (
    <textarea
      // value={input}
      ref={textareaRef}
      rows={1}
      placeholder="Start the conversation..."
      onKeyDown={handleKeyDown}
      disabled={isChatCreationPending || isMessageCreationPending}
      // onChange={(e) => {
      //   setInput(e.target.value);
      //   resizeTextarea();
      // }}
      className="w-full resize-none focus:outline-none min-h-4 max-h-80"
    />
  );
}
