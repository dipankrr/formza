import { trpc } from "@/trpc/client";

export function useCurrentUser(){

  return trpc.auth.getMe.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}