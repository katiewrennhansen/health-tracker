import { ActivitiesTable } from "@/components/ActivitiesTable";
import { ActivityModal } from "@/components/ActivityModal";
import { useActivities } from "@/queries/useActivities";
import { useState } from "react";
import type { Activity } from "@health-tracker/shared";
import { Spinner } from "@heroui/react";

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
      {isLoading && <Spinner />}
      {error && <p>Unable to load activities.</p>}
      {!isLoading && !error && (
        <ActivitiesTable
          activities={data}
          handleOpenActivityModal={handleOpenActivityModal}
        />
      )}

      {activityModalOpen && (
        <ActivityModal
          onClose={handleCloseActivityModal}
          activity={selectedActivity}
        />
      )}
    </section>
  );
}
