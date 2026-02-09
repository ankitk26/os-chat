import { queryOptions } from "@tanstack/react-query";
import { getAuthUser } from "~/server-fns/get-auth";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: () => getAuthUser(),
  staleTime: 60 * 15 * 1000, // 15 minutes
});
