import { type CheckInInput, checkInSchema } from "@health-tracker/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkInsQueryKey } from "@/queries/useCheckIns";
import { useApi } from "@/queries/useApi";

export function useCheckInsMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

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

  return { createCheckin };
}
