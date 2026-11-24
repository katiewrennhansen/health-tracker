import {
  type BodyArea,
  type InjuryInput,
  injuryInputSchema,
} from "@health-tracker/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { type Choice, ChoiceField } from "@/features/LogEvents/ChoiceField";
import { ScaleField } from "@/components/ScaleField";
import { useInjuriesMutations } from "@/queries/useInjuriesMutations";
import { Alert, Button, toast } from "@/ui";
import { DatePickerField } from "@/ui/DatePickerField";
import { today } from "@/utils/utils";

const bodyAreaOptions: readonly Choice<BodyArea>[] = [
  { value: "neck", label: "Neck" },
  { value: "shoulder", label: "Shoulder" },
  { value: "back", label: "Back" },
  { value: "hip", label: "Hip" },
  { value: "knee", label: "Knee" },
  { value: "ankle", label: "Ankle" },
  { value: "foot", label: "Foot" },
  { value: "wrist", label: "Wrist" },
  { value: "other", label: "Other" },
];

/** Logs an injury: where it is, how bad it is, and when it started (and ended, once healed). */
export function InjuryForm() {
  const { createInjury } = useInjuriesMutations();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<InjuryInput>({
    resolver: zodResolver(injuryInputSchema),
    // No body area is picked to start with, so the user has to choose one.
    defaultValues: { startDate: today(), endDate: null, severity: 3 },
  });

  const onSubmit = async (values: InjuryInput) => {
    try {
      await createInjury.mutateAsync(values);
      toast.success("Injury saved.");
    } catch {
      // A form error keeps isSubmitSuccessful false, so what the user entered isn't cleared.
      toast.danger("Couldn't save the injury. Please try again.");
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
        name="bodyArea"
        render={({ field, fieldState }) => (
          <ChoiceField
            label="Where"
            options={bodyAreaOptions}
            value={field.value}
            onChange={field.onChange}
            fullWidth={false}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="severity"
        render={({ field, fieldState }) => (
          <ScaleField
            label="Severity"
            min={1}
            max={10}
            value={field.value}
            onChange={field.onChange}
            lowLabel="1 · Barely noticeable"
            highLabel="10 · Can't train"
            valueText={`${field.value} / 10`}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="startDate"
          render={({ field, fieldState }) => (
            <DatePickerField
              label="Started"
              calendarLabel="Start date"
              name={field.name}
              value={field.value}
              onChange={(value) => field.onChange(value ?? "")}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
          render={({ field, fieldState }) => (
            <DatePickerField
              label={
                <>
                  Ended{" "}
                  <span className="font-normal text-muted">
                    (leave empty if still injured)
                  </span>
                </>
              }
              calendarLabel="End date"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Alert
        status="accent"
        title="What this changes"
        description="While an injury is active, the advice avoids high-impact sessions such as running and jumping."
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Save injury
        </Button>
      </div>
    </form>
  );
}
