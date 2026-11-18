import { useAuth } from "@clerk/react";
import { activityListSchema } from "@health-tracker/shared";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/queries/useApi";

/** Prefix for every activities query; invalidate this after creating, editing or deleting one. */
export const activitiesQueryKey = ["activities"] as const;

/** Loads the signed-in user's activities, newest first. */
export function useActivities() {
  const { userId } = useAuth();
  const api = useApi();

  return useQuery({
    // Keyed by user, so signing in as someone else never shows the previous user's cached list.
    queryKey: [...activitiesQueryKey, userId],
    enabled: Boolean(userId),
    queryFn: () => api("/activities", { schema: activityListSchema }),
  });
}
