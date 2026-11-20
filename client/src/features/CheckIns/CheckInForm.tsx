import { type CheckInInput, checkInInputSchema } from "@health-tracker/shared";
import {
  Card,
  FieldError,
  Label,
  NumberField,
  Separator,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { RatingField } from "@/features/CheckIns/RatingField";
import { useCheckInsMutation } from "@/queries/useCheckInsMutations";
import { Button } from "@/ui/Button";
import { useCheckIns } from "@/queries/useCheckIns";
import { today } from "@/utils/utils";
import { CheckInBanner } from "./CheckInBanner";

const defaultValues: CheckInInput = {
  date: today(),
  sleepMinutes: 7 * 60,
  soreness: 3,
  mood: 3,
  energy: 3,
  stress: 3,
};

/** Today's morning check-in: hours slept plus 1–5 ratings for soreness, mood and energy. */
export function CheckInForm() {
  const { data: checkIns } = useCheckIns();
  const todayCheckIn = checkIns?.find((c) => c.date === today());
  const { createCheckin } = useCheckInsMutation();
  const { control, handleSubmit, reset } = useForm<CheckInInput>({
    resolver: zodResolver(checkInInputSchema),
    defaultValues,
  });

  const onSubmit = async (values: CheckInInput) => {
    try {
      await createCheckin.mutateAsync({ ...values, date: today() });
      toast.success("Check-in saved");
      reset(defaultValues);
    } catch {
      toast.danger("Couldn't save the check-in");
    }
  };

  if (todayCheckIn) {
    return <CheckInBanner />;
  }

  return (
    <Card className="rounded-sm">
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="sleepMinutes"
          render={({ field, fieldState }) => (
            // Stored as whole minutes; shown and edited as hours, in steps of 0.1 h (6 minutes).
            <NumberField
              name={field.name}
              value={field.value / 60}
              onChange={(hours) => field.onChange(Math.round(hours * 60))}
              onBlur={field.onBlur}
              minValue={0}
              maxValue={24}
              step={0.1}
              formatOptions={{ maximumFractionDigits: 1 }}
              isInvalid={Boolean(fieldState.error)}
              className="flex flex-row flex-wrap items-center justify-between gap-3"
            >
              <Label className="font-semibold">Hours slept last night</Label>
              <NumberField.Group className="w-34">
                <NumberField.DecrementButton />
                <NumberField.Input />
                <NumberField.IncrementButton />
              </NumberField.Group>
              <FieldError>{fieldState.error?.message}</FieldError>
            </NumberField>
          )}
        />

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="soreness"
            render={({ field }) => (
              <RatingField
                label="Muscle soreness"
                value={field.value}
                onChange={field.onChange}
                lowLabel="None"
                highLabel="Very sore"
              />
            )}
          />
          <Controller
            control={control}
            name="mood"
            render={({ field }) => (
              <RatingField
                label="Mood"
                value={field.value}
                onChange={field.onChange}
                lowLabel="Low"
                highLabel="Great"
              />
            )}
          />
          <Controller
            control={control}
            name="energy"
            render={({ field }) => (
              <RatingField
                label="Energy"
                value={field.value}
                onChange={field.onChange}
                lowLabel="Drained"
                highLabel="Full of energy"
              />
            )}
          />
          <Controller
            control={control}
            name="stress"
            render={({ field }) => (
              <RatingField
                label="Stress"
                value={field.value}
                onChange={field.onChange}
                lowLabel="Low"
                highLabel="High"
              />
            )}
          />
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button
            type="submit"
            isDisabled={createCheckin.isPending || !!todayCheckIn}
            isLoading={createCheckin.isPending}
          >
            Save check-in
          </Button>
        </div>
      </form>
    </Card>
  );
}
