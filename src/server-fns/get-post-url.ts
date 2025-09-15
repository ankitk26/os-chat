import { createServerFn } from "@tanstack/react-start";
import { api } from "convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { getAuth } from "./get-auth";

export const getPostUrl = createServerFn({ method: "POST" }).handler(
  async () => {
    const authData = await getAuth();
    if (!authData?.session) {
      throw new Error("Invalid request");
    }

    const convexClient = new ConvexHttpClient(
      process.env.VITE_CONVEX_URL as string
    );
    const postUrl = await convexClient.mutation(api.messages.generateUploadUrl);
    return postUrl;
  }
);
