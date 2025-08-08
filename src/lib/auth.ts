import { convexAdapter } from "@better-auth-kit/convex";
import { betterAuth } from "better-auth";
import { ConvexHttpClient } from "convex/browser";

const convexClient = new ConvexHttpClient(
  process.env.VITE_CONVEX_URL as string
);

export const auth = betterAuth({
  database: convexAdapter(convexClient),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
