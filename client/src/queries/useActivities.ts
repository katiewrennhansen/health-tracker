import { useQuery } from "@tanstack/react-query";

/** What GET /api/activities returns for now. Becomes `Activity[]` once the route reads from the database. */
interface ActivitiesResponse {
  message: string;
}

export const activitiesQueryKey = ["activities"] as const;

/** Loads the signed-in user's activities. */
export function useActivities() {
  return useQuery({
    queryKey: activitiesQueryKey,
    queryFn: async (): Promise<ActivitiesResponse> => {
      const res = await fetch("/api/activities");
      if (!res.ok) {
        throw new Error(`GET /api/activities failed with ${res.status}`);
      }
      return (await res.json()) as ActivitiesResponse;
    },
  });
}
