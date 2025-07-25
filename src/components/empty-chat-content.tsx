import { useParams, useRouteContext } from "@tanstack/react-router";

export default function EmptyChatContent() {
  const { chatId } = useParams({ strict: false });
  if (chatId) {
    return null;
  }

  const { auth } = useRouteContext({ from: "/_auth" });

  return (
    <div className="flex flex-col justify-center w-full h-full max-w-3xl mx-auto">
      <h2 className="mb-2 text-3xl font-semibold">
        Welcome {auth.user.name.split(" ")[0]}
      </h2>
      <p>Start a conversation by typing a message below.</p>
    </div>
  );
}
