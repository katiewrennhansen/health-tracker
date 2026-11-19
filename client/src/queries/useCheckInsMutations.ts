import { type CheckInInput, checkInSchema } from "@health-tracker/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkInsQueryKey } from "@/queries/useCheckIns";
import { useApi } from "@/queries/useApi";

export function useCheckInsMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  // Refetch the list after any change so it stays current (and, later, today's advice).
  const refetchCheckIns = () =>
    queryClient.invalidateQueries({ queryKey: checkInsQueryKey });

  const createCheckin = useMutation({
    mutationFn: (input: CheckInInput) =>
      api("/check-ins", {
        method: "POST",
        body: input,
        schema: checkInSchema,
      }),
    onSuccess: refetchCheckIns,
  });

  //   const updateActivity = useMutation({
  //     mutationFn: ({ id, patch }: { id: string; patch: ActivityPatch }) =>
  //       api(`/activities/${id}`, {
  //         method: "PATCH",
  //         body: patch,
  //         schema: activitySchema,
  //       }),
  //     onSuccess: refetchActivities,
  //   });

  //   const deleteActivity = useMutation({
  //     mutationFn: (id: string) => api(`/activities/${id}`, { method: "DELETE" }),
  //     onSuccess: refetchActivities,
  //   });

  return { createCheckin };
}
