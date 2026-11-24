import {
  type ActivityInput,
  type ActivityType,
  activityInputSchema,
} from "@health-tracker/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { type Choice, ChoiceField } from "@/features/LogEvents/ChoiceField";
import { ScaleField } from "@/components/ScaleField";
import { WhenField } from "@/components/WhenField";
import { useActivitiesMutation } from "@/queries/useActivitiesMutations";
import { Alert, Button, toast } from "@/ui";
import { NumberField } from "@/ui/NumberField";
import { today } from "@/utils/utils";

const typeOptions: readonly Choice<ActivityType>[] = [
  { value: "run", label: "Run" },
  { value: "ride", label: "Ride" },
  { value: "swim", label: "Swim" },
  { value: "lift", label: "Lift" },
  { value: "walk", label: "Walk" },
  { value: "hike", label: "Hike" },
  { value: "other", label: "Other" },
];

/** Quick picks for duration; any other length can be typed in. */
const durationOptions: readonly Choice<string>[] = [
  15, 30, 45, 60, 75, 90, 120,
].map((minutes) => ({ value: String(minutes), label: String(minutes) }));

/** Word for an effort score, e.g. 7 → "Hard". */
const effortWord = (effort: number) => {
  if (effort <= 2) return "Very easy";
  if (effort <= 4) return "Easy";
  if (effort <= 6) return "Moderate";
  if (effort <= 8) return "Hard";
  if (effort === 9) return "Very hard";
  return "All out";
};

/** Logs a workout: what kind, when, how long and how hard. */
export function WorkoutForm() {
  const { createActivity } = useActivitiesMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<ActivityInput>({
    resolver: zodResolver(activityInputSchema),
    defaultValues: {
      date: today(),
      type: "run",
      durationMinutes: 0,
      effort: 0,
    },
  });
  // Read just these two for the load preview, without re-rendering the whole form on every change.
  const [durationMinutes, effort] = useWatch({
    control,
    name: ["durationMinutes", "effort"],
  });

  const onSubmit = async (values: ActivityInput) => {
    try {
      await createActivity.mutateAsync(values);
      toast.success("Workout saved. Today's advice will update.");
    } catch {
      toast.danger("Couldn't save the workout. Please try again.");
    }
  };

  // Clear the form after a successful save, keeping the success flag so the message stays visible.
  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="type"
        render={({ field, fieldState }) => (
          <ChoiceField
            label="Type"
            options={typeOptions}
            value={field.value}
            onChange={field.onChange}
            fullWidth={false}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="date"
        render={({ field, fieldState }) => (
          <WhenField
            label="When"
            shortcuts={[
              { label: "Today", daysAgo: 0 },
              { label: "Yesterday", daysAgo: 1 },
            ]}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="durationMinutes"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-3">
            <ChoiceField
              label="Duration (minutes)"
              options={durationOptions}
              value={String(field.value)}
              onChange={(minutes) => field.onChange(Number(minutes))}
              fullWidth={false}
            />
            <NumberField
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              minValue={1}
              maxValue={1440}
              step={5}
              label="Or enter minutes"
              labelClassName="text-sm font-normal text-muted"
              groupClassName="max-w-36"
              inputClassName="text-center"
              errorMessage={fieldState.error?.message}
            />
          </div>
        )}
      />

      <Controller
        control={control}
        name="effort"
        render={({ field, fieldState }) => (
          <ScaleField
            label="Effort"
            min={1}
            max={10}
            value={field.value}
            onChange={field.onChange}
            lowLabel="1 · Very easy"
            highLabel="10 · All out"
            valueText={
              field.value > 0
                ? `${field.value} / 10 · ${effortWord(field.value)}`
                : undefined
            }
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Alert
        status="accent"
        title="What this changes"
        description={
          durationMinutes > 0 && effort > 0
            ? `Adds ${durationMinutes * effort} to this week's training load (duration × effort).`
            : "Training load is duration × effort. It feeds this week's load and today's advice."
        }
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Save workout
        </Button>
      </div>
    </form>
  );
}
