import { useParams, useRouteContext } from "@tanstack/react-router";

export default function EmptyChatContent() {
  const { chatId } = useParams({ strict: false });

  if (chatId) {
    return null;
  }

  // biome-ignore lint/correctness/useHookAtTopLevel: Only get auth if user is authenticated
  const { auth } = useRouteContext({ from: "/_auth" });

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center">
      <h2 className="mb-2 font-semibold text-3xl">
        Welcome {auth.user.name.split(" ")[0]}
      </h2>
      <p>Start a conversation by typing a message below.</p>
    </div>
  );
}
