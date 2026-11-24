import { Spinner } from "@heroui/react";
import { CheckInModal } from "@/features/Today/CheckInModal";
import { CheckInReminder } from "@/features/Today/CheckInReminder";
import { TrainingLoadChart } from "@/features/Today/TrainingLoadChart";
import { useActivities } from "@/queries/useActivities";
import { useTodayCheckIn } from "@/queries/useTodayCheckIn";
import { useState } from "react";

export function Today() {
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const { data: activities = [], isPending, error } = useActivities();
  const { checkedInToday } = useTodayCheckIn();

  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">Today</h1>
      <p className="text-muted">
        Your readiness level, suggested session and the reasons will appear
        here.
      </p>

      {!checkedInToday && (
        <CheckInReminder onStartCheckIn={() => setCheckInModalOpen(true)} />
      )}

      {isPending && <Spinner />}
      {error && (
        <p className="text-danger">Unable to load your training load.</p>
      )}
      {!isPending && !error && <TrainingLoadChart activities={activities} />}

      {checkInModalOpen && (
        <CheckInModal onClose={() => setCheckInModalOpen(false)} />
      )}
    </section>
  );
}
