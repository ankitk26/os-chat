import { Link } from "@tanstack/react-router";
import { useSharedChatContext } from "~/providers/chat-provider";
import { Button } from "./ui/button";

export default function TanstackErrorComponent() {
  const { clearChat } = useSharedChatContext();

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <section
        aria-live="assertive"
        className="mx-auto max-w-md p-6 text-center"
        role="alert"
      >
        <h2 className="text-balance font-semibold text-lg">
          Some error occurred.
        </h2>
        <div className="mt-4 flex justify-center">
          <Link
            aria-label="Go to the home page"
            onClick={() => clearChat()}
            to="/"
          >
            <Button>Go to Home</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
