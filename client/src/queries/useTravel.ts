import { useAuth } from "@clerk/react";
import { travelListSchema } from "@health-tracker/shared";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/queries/useApi";

export const travelQueryKey = ["travel"];

export function useTravel() {
  const { userId } = useAuth();
  const api = useApi();

  return useQuery({
    queryKey: [...travelQueryKey, userId],
    enabled: !!userId,
    queryFn: () => api("/travel", { schema: travelListSchema }),
  });
}
