import { ChevronRightIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Alert } from "@/ui/Alert";
import { Button } from "@/ui/Button";

type CheckInReminderProps = {
  onStartCheckIn: () => void;
};

/** Prompt to do the morning check-in. "Later" isn't wired up yet. */
export function CheckInReminder({ onStartCheckIn }: CheckInReminderProps) {
  return (
    <Alert
      status="accent"
      icon={<MoonIcon />}
      title="Morning check-in"
      description="Sleep, soreness, stress and energy. About 20 seconds, and it finishes today's advice."
      actions={
        <>
          <Button variant="ghost">Later</Button>
          <Button onPress={onStartCheckIn}>
            Start check-in
            <ChevronRightIcon className="size-4" aria-hidden />
          </Button>
        </>
      }
    />
  );
}
