import { ActivitiesTable } from "@/components/ActivitiesTable";
import { AddActivityModal } from "@/components/AddActivityModal";
import { useActivities } from "@/queries/useActivities";
import { useState } from "react";
import type { Activity } from "@health-tracker/shared";

export function HistoryPage() {
  const { data = [], isLoading, error } = useActivities();

  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();

  const handleCloseActivityModal = () => {
    setActivityModalOpen(false);
  };

  const handleOpenActivityModal = (activity: Activity) => {
    setActivityModalOpen(true);
    setSelectedActivity(activity);
  };

  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">History</h1>
      <p className="text-muted">
        Your activities and events will appear here, newest first.
      </p>
      {isLoading && <p>Loading activities...</p>}
      {error && <p>Error loading activities: {error.message}</p>}
      {!isLoading && !error && (
        <ActivitiesTable
          activities={data}
          handleOpenActivityModal={handleOpenActivityModal}
        />
      )}

      {activityModalOpen && (
        <AddActivityModal
          onClose={handleCloseActivityModal}
          activity={selectedActivity}
        />
      )}
    </section>
  );
}
