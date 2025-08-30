import { queryOptions } from "@tanstack/react-query";
import { getAuth } from "~/server-fns/get-auth";

const CACHE_MINUTES = 15;
const CACHE_SECONDS = 1000;

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: () => getAuth(),
  staleTime: 60 * CACHE_MINUTES * CACHE_SECONDS, // 15 minutes
});
