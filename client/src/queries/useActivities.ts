import { useAuth } from "@clerk/react";
import { activityListSchema } from "@health-tracker/shared";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/queries/useApi";

export const activitiesQueryKey = ["activities"] as const;

export function useActivities() {
  const { userId } = useAuth();
  const api = useApi();

  return useQuery({
    queryKey: [...activitiesQueryKey, userId],
    enabled: Boolean(userId),
    queryFn: () => api("/activities", { schema: activityListSchema }),
  });
}
