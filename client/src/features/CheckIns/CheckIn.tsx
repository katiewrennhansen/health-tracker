import { Spinner } from "@heroui/react";
import { format } from "date-fns";
import { CheckInForm } from "@/features/CheckIns/CheckInForm";
import { PastWeekTable } from "@/features/CheckIns/PastWeekTable";
import { useCheckIns } from "@/queries/useCheckIns";

/** Check-in page: today's form on the left, the past week on the right (stacked on smaller screens). */
export function CheckIn() {
  const { data: checkIns = [], isPending, error } = useCheckIns();

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
        <h1 className="text-3xl font-bold">Morning check-in</h1>
        <p className="text-muted">
          Rate how you feel this morning. Today's advice updates when you save.
        </p>
      </header>

      <div className="grid items-start gap-6">
        <CheckInForm />
        {isPending && <Spinner />}
        {error && <p className="text-danger">Unable to load check-ins.</p>}
        {!isPending && !error && <PastWeekTable checkIns={checkIns} />}
      </div>
    </section>
  );
}
