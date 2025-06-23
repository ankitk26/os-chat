import { queryOptions } from "@tanstack/react-query";
import { getAuth } from "~/server-fns/get-auth";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: () => getAuth(),
});
