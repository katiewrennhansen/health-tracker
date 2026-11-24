import {
  type IllnessInput,
  type IllnessSeverity,
  type IllnessSymptom,
  illnessInputSchema,
  illnessSymptomSchema,
} from "@health-tracker/shared";
import { FieldError, Label, ListBox, Select } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, toast } from "@/ui";
import { useIllnessesMutations } from "@/queries/useIllnessesMutations";
import { DatePickerField } from "@/ui/DatePickerField";
import { today } from "@/utils/utils";
import { type Choice, ChoiceField } from "@/features/LogEvents/ChoiceField";

const severityOptions: readonly Choice<IllnessSeverity>[] = [
  { value: "mild", label: "Mild", description: "Can do daily things" },
  { value: "moderate", label: "Moderate", description: "Slowed down" },
  { value: "severe", label: "Severe", description: "Mostly resting" },
];

const symptomLabels: Record<IllnessSymptom, string> = {
  fever: "Fever",
  cough: "Cough",
  fatigue: "Fatigue",
  headache: "Headache",
  sore_throat: "Sore throat",
  shortness_of_breath: "Shortness of breath",
  other: "Other",
};

const defaultValues: IllnessInput = {
  startDate: today(),
  endDate: null,
  severity: "mild",
  symptoms: [],
};

/** Logs an illness: when it started and ended, how bad it is, and the symptoms. */
export function IllnessForm() {
  const { createIllness } = useIllnessesMutations();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<IllnessInput>({
    resolver: zodResolver(illnessInputSchema),
    defaultValues,
  });

  const onSubmit = async (values: IllnessInput) => {
    try {
      await createIllness.mutateAsync(values);
      toast.success("Illness saved.");
    } catch {
      toast.danger("Couldn't save the illness. Please try again.");
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
                    (leave empty if still ill)
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

      <Controller
        control={control}
        name="severity"
        render={({ field, fieldState }) => (
          <ChoiceField
            label="Severity"
            options={severityOptions}
            value={field.value}
            onChange={field.onChange}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="symptoms"
        render={({ field, fieldState }) => (
          <Select
            selectionMode="multiple"
            name={field.name}
            value={field.value}
            // Rebuild the list from the known symptoms, so the form only ever holds valid values.
            onChange={(keys) =>
              field.onChange(
                illnessSymptomSchema.options.filter((symptom) =>
                  keys.includes(symptom),
                ),
              )
            }
            onBlur={field.onBlur}
            isInvalid={!!fieldState.error}
            placeholder="Choose symptoms"
          >
            <Label>Symptoms</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {illnessSymptomSchema.options.map((symptom) => (
                  <ListBox.Item
                    key={symptom}
                    id={symptom}
                    textValue={symptomLabels[symptom]}
                  >
                    {symptomLabels[symptom]}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Select>
        )}
      />

      <Alert
        status="accent"
        title="What this changes"
        description="Fever or chest symptoms (cough, shortness of breath) set today's advice to rest until they clear."
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Save illness
        </Button>
      </div>
    </form>
  );
}
