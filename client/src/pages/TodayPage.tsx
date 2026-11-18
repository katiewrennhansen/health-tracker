import { AddActivityModal } from "@/components/AddActivityModal";
import { Button } from "@/ui/Button";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export function TodayPage() {
  const [activityModalOpen, setActivityModalOpen] = useState(false);

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
          onClick={handleAddActivityClick}
        >
          Add activity
        </Button>
      </div>

      {activityModalOpen && (
        <AddActivityModal onClose={handleCloseActivityModal} />
      )}
    </section>
  );
}
