import { type IllnessInput, illnessSchema } from "@health-tracker/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { illnessesQueryKey } from "@/queries/useIllnesses";
import { useApi } from "@/queries/useApi";

export function useIllnessesMutations() {
  const api = useApi();
  const queryClient = useQueryClient();

  const refetchIllnesses = () =>
    queryClient.invalidateQueries({ queryKey: illnessesQueryKey });

  const createIllness = useMutation({
    mutationFn: (input: IllnessInput) =>
      api("/illnesses", {
        method: "POST",
        body: input,
        schema: illnessSchema,
      }),
    onSuccess: refetchIllnesses,
  });

  return { createIllness };
}
