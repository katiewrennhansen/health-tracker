import { useAuth } from "@clerk/react";
import { alcoholListSchema } from "@health-tracker/shared";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/queries/useApi";

export const alcoholQueryKey = ["alcohol"];

export function useAlcohol() {
  const { userId } = useAuth();
  const api = useApi();

  return useQuery({
    queryKey: [...alcoholQueryKey, userId],
    enabled: Boolean(userId),
    queryFn: () => api("/alcohol", { schema: alcoholListSchema }),
  });
}
