import { useAuth } from "@clerk/react";
import { type ActivityInput, activitySchema } from "@health-tracker/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesQueryKey } from "@/queries/useActivities";

export function useActivitiesMutation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const createActivity = useMutation({
    mutationFn: async (input: ActivityInput) => {
      const token = await getToken();
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(input),
      });
      if (!res.ok)
        throw new Error(`POST /api/activities failed with ${res.status}`);
      return activitySchema.parse(await res.json());
    },
    // Refetch the list so the new activity appears (and, later, today's advice).
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: activitiesQueryKey }),
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const res = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok)
        throw new Error(
          `DELETE /api/activities/${id} failed with ${res.status}`,
        );
      return res.text();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: activitiesQueryKey }),
  });

  return { createActivity, deleteActivity };
}
