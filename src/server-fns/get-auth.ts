import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { api } from "convex/_generated/api";
import { fetchAuthQuery } from "~/lib/auth-server";

export const getAuthUser = createServerFn({ method: "GET" }).handler(
	async () => {
		const request = getRequest();
		if (!request) {
			throw new Error("No request found");
		}
		try {
			const auth = await fetchAuthQuery(api.auth.getCurrentUser);

			if (!auth) {
				return null;
			}
			return auth;
		} catch {
			// If unauthenticated, return null instead of throwing
			return null;
		}
	},
);
