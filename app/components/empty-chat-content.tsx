import { useParams } from "@tanstack/react-router";
import { authClient } from "~/lib/auth-client";

export default function EmptyChatContent() {
  const { chatId } = useParams({ strict: false });
  if (chatId) {
    return null;
  }

  const { data } = authClient.useSession();

  return (
    <div className="flex flex-col justify-center w-full h-full max-w-3xl mx-auto">
      <h2 className="mb-2 text-3xl font-semibold">
        Welcome {data?.user.name.split(" ")[0]}
      </h2>
      <p>Start a conversation by typing a message below.</p>
    </div>
  );
}
