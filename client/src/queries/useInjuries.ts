import { useAuth } from "@clerk/react";
import { injuryListSchema } from "@health-tracker/shared";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/queries/useApi";

export const injuriesQueryKey = ["injuries"] as const;

export function useInjuries() {
  const { userId } = useAuth();
  const api = useApi();

  return useQuery({
    queryKey: [...injuriesQueryKey, userId],
    enabled: Boolean(userId),
    queryFn: () => api("/injuries", { schema: injuryListSchema }),
  });
}
