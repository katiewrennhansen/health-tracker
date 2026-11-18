import {
  type ActivityInput,
  type ActivityPatch,
  activitySchema,
} from "@health-tracker/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesQueryKey } from "@/queries/useActivities";
import { useApi } from "@/queries/useApi";

export function useActivitiesMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  // Refetch the list after any change so it stays current (and, later, today's advice).
  const refetchActivities = () =>
    queryClient.invalidateQueries({ queryKey: activitiesQueryKey });

  const createActivity = useMutation({
    mutationFn: (input: ActivityInput) =>
      api("/activities", {
        method: "POST",
        body: input,
        schema: activitySchema,
      }),
    onSuccess: refetchActivities,
  });

  const updateActivity = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: ActivityPatch }) =>
      api(`/activities/${id}`, {
        method: "PATCH",
        body: patch,
        schema: activitySchema,
      }),
    onSuccess: refetchActivities,
  });

  const deleteActivity = useMutation({
    mutationFn: (id: string) => api(`/activities/${id}`, { method: "DELETE" }),
    onSuccess: refetchActivities,
  });

  return { createActivity, updateActivity, deleteActivity };
}
