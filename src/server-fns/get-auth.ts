import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth";

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  const request = getWebRequest();
  if (!request) {
    throw new Error("No request found");
  }
  const authData = await auth.api.getSession({ headers: request.headers });
  return authData;
});
