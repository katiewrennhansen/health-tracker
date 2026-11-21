import { type AlcoholInput, alcoholSchema } from "@health-tracker/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { alcoholQueryKey } from "@/queries/useAlcohol";
import { useApi } from "@/queries/useApi";

export function useAlcoholMutations() {
  const api = useApi();
  const queryClient = useQueryClient();

  const refetchAlcohol = () =>
    queryClient.invalidateQueries({ queryKey: alcoholQueryKey });

  const createAlcohol = useMutation({
    mutationFn: (input: AlcoholInput) =>
      api("/alcohol", {
        method: "POST",
        body: input,
        schema: alcoholSchema,
      }),
    onSuccess: refetchAlcohol,
  });

  return { createAlcohol };
}
