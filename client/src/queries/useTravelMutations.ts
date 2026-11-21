import { type TravelInput, travelSchema } from "@health-tracker/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { travelQueryKey } from "@/queries/useTravel";
import { useApi } from "@/queries/useApi";

export function useTravelMutations() {
  const api = useApi();
  const queryClient = useQueryClient();

  const refetchTravel = () =>
    queryClient.invalidateQueries({ queryKey: travelQueryKey });

  const createTravel = useMutation({
    mutationFn: (input: TravelInput) =>
      api("/travel", {
        method: "POST",
        body: input,
        schema: travelSchema,
      }),
    onSuccess: refetchTravel,
  });

  return { createTravel };
}
