import {
  type IllnessInput,
  type IllnessSeverity,
  type IllnessSymptom,
  illnessInputSchema,
  illnessSymptomSchema,
} from "@health-tracker/shared";
import { Alert, FieldError, Label, ListBox, Select } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { type Choice, ChoiceField } from "@/features/LogEvents/ChoiceField";
import { DatePickerField } from "@/ui/DatePickerField";
import { Button } from "@/ui/Button";
import { today } from "@/utils/utils";

const severityOptions: readonly Choice<IllnessSeverity>[] = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
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

const defaultValues = {
  startDate: today(),
  endDate: null,
  severity: "mild" as IllnessSeverity,
  symptoms: [] as IllnessSymptom[],
};

/** Logs an illness: when it started and ended, how bad it was, and the symptoms. */
export function IllnessForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<IllnessInput>({
    resolver: zodResolver(illnessInputSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (values: IllnessInput) => {
    console.log(values);
  };

  // Clear the form after a successful save (react-hook-form recommends this over resetting inside onSubmit).
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="severity"
          render={({ field }) => (
            <ChoiceField
              label="Severity"
              options={severityOptions}
              value={field.value}
              onChange={field.onChange}
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
              isInvalid={Boolean(fieldState.error)}
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
      </div>

      <Alert status="warning">
        <Alert.Content>
          <Alert.Description>
            Fever or chest symptoms (cough, shortness of breath) set today's
            advice to rest until they clear.
          </Alert.Description>
        </Alert.Content>
      </Alert>

      <div className="flex justify-end gap-3">
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
