import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth";

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  if (!request) {
    throw new Error("No request found");
  }
  const authData = await auth.api.getSession({ headers: request.headers });
  if (!authData) {
    return null;
  }

  return {
    session: authData.session,
    user: authData.user,
  };
});
