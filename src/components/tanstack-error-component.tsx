import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function TanstackErrorComponent() {
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
          <Button asChild>
            <Link aria-label="Go to the home page" to="/">
              Go to Home
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
