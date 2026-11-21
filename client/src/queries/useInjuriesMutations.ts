import { type InjuryInput, injurySchema } from "@health-tracker/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { injuriesQueryKey } from "@/queries/useInjuries";
import { useApi } from "@/queries/useApi";

export function useInjuriesMutations() {
  const api = useApi();
  const queryClient = useQueryClient();

  const refetchInjuries = () =>
    queryClient.invalidateQueries({ queryKey: injuriesQueryKey });

  const createInjury = useMutation({
    mutationFn: (input: InjuryInput) =>
      api("/injuries", {
        method: "POST",
        body: input,
        schema: injurySchema,
      }),
    onSuccess: refetchInjuries,
  });

  return { createInjury };
}
