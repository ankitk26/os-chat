import { queryOptions } from "@tanstack/react-query";
import { getAuth } from "~/server-fns/get-auth";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: () => getAuth(),
  staleTime: 60 * 15 * 1000, // 15 minutes
});
