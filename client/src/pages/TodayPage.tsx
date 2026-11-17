import { useActivities } from "@/queries/useActivities";

export function TodayPage() {
  const { data, isLoading, error } = useActivities();
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">Today</h1>
      <p className="text-muted">
        Your readiness level, suggested session and the reasons will appear
        here.
      </p>
      {isLoading && <p>Loading activities...</p>}
      {error && <p>Error loading activities: {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </section>
  );
}
