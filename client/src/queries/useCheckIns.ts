import { useAuth } from "@clerk/react";
import { checkInListSchema } from "@health-tracker/shared";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/queries/useApi";

export const checkInsQueryKey = ["check-ins"] as const;

export function useCheckIns() {
  const { userId } = useAuth();
  const api = useApi();

  return useQuery({
    queryKey: [...checkInsQueryKey, userId],
    enabled: Boolean(userId),
    queryFn: () => api("/check-ins", { schema: checkInListSchema }),
  });
}
