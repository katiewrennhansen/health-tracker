import { useAuth } from "@clerk/react";
import { type Activity, activityListSchema } from "@health-tracker/shared";
import { useQuery } from "@tanstack/react-query";

/** Prefix for every activities query; invalidate this after creating, editing or deleting one. */
export const activitiesQueryKey = ["activities"] as const;

/** Loads the signed-in user's activities, newest first. */
export function useActivities() {
  const { getToken, userId } = useAuth();

  return useQuery({
    // Keyed by user, so signing in as someone else never shows the previous user's cached list.
    queryKey: [...activitiesQueryKey, userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Activity[]> => {
      const token = await getToken();
      const res = await fetch("/api/activities", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        throw new Error(`GET /api/activities failed with ${res.status}`);
      }
      // Checks the response against the shared schema, so a client/server mismatch fails loudly.
      return activityListSchema.parse(await res.json());
    },
  });
}
