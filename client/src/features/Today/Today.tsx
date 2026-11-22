import { Spinner } from "@heroui/react";
import { ActivityModal } from "@/components/ActivityModal";
import { TrainingLoadChart } from "@/features/Today/TrainingLoadChart";
import { useActivities } from "@/queries/useActivities";
import { Button } from "@/ui/Button";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export function Today() {
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const { data: activities = [], isPending, error } = useActivities();

  const handleAddActivityClick = () => {
    setActivityModalOpen(true);
  };

  const handleCloseActivityModal = () => {
    setActivityModalOpen(false);
  };

  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">Today</h1>
      <p className="text-muted">
        Your readiness level, suggested session and the reasons will appear
        here.
      </p>

      <div className="self-end">
        <Button
          type="submit"
          className="self-start"
          icon={<PlusIcon />}
          onPress={handleAddActivityClick}
        >
          Add activity
        </Button>
      </div>

      {isPending && <Spinner />}
      {error && (
        <p className="text-danger">Unable to load your training load.</p>
      )}
      {!isPending && !error && <TrainingLoadChart activities={activities} />}

      {activityModalOpen && (
        <ActivityModal onClose={handleCloseActivityModal} />
      )}
    </section>
  );
}
