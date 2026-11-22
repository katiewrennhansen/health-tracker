import { useAuth } from "@clerk/react";
import { illnessListSchema } from "@health-tracker/shared";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/queries/useApi";

export const illnessesQueryKey = ["illnesses"];

export function useIllnesses() {
  const { userId } = useAuth();
  const api = useApi();

  return useQuery({
    queryKey: [...illnessesQueryKey, userId],
    enabled: !!userId,
    queryFn: () => api("/illnesses", { schema: illnessListSchema }),
  });
}
