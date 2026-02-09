import { createServerFn } from "@tanstack/react-start";
import { api } from "convex/_generated/api";
import { fetchAuthMutation } from "~/lib/auth-server";
import { getAuthUser } from "./get-auth";

export const getPostUrl = createServerFn({ method: "POST" }).handler(
	async () => {
		const authData = await getAuthUser();
		if (!authData) {
			throw new Error("Invalid request");
		}

		const postUrl = await fetchAuthMutation(api.messages.generateUploadUrl);
		return postUrl;
	},
);
