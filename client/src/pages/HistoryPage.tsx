import { ActivitiesTable } from "@/components/ActivitiesTable";
import { useActivities } from "@/queries/useActivities";

export function HistoryPage() {
  const { data = [], isLoading, error } = useActivities();

  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">History</h1>
      <p className="text-muted">
        Your activities and events will appear here, newest first.
      </p>
      {isLoading && <p>Loading activities...</p>}
      {error && <p>Error loading activities: {error.message}</p>}
      {!isLoading && !error && <ActivitiesTable activities={data} />}
    </section>
  );
}
