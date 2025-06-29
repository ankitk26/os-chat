import { queryOptions } from "@tanstack/react-query";
import { getAuth } from "~/server-fns/get-auth";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: () => getAuth(),
  staleTime: 1000 * 60 * 15, // 15 minutes
});
