import { useAuth } from "@clerk/react";
import { checkInListSchema } from "@health-tracker/shared";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/queries/useApi";

/** Prefix for every activities query; invalidate this after creating, editing or deleting one. */
export const checkInsQueryKey = ["check-ins"] as const;

/** Loads the signed-in user's activities, newest first. */
export function useCheckIns() {
  const { userId } = useAuth();
  const api = useApi();

  return useQuery({
    // Keyed by user, so signing in as someone else never shows the previous user's cached list.
    queryKey: [...checkInsQueryKey, userId],
    enabled: Boolean(userId),
    queryFn: () => api("/check-ins", { schema: checkInListSchema }),
  });
}
