import {
  type IllnessInput,
  type IllnessSeverity,
  type IllnessSymptom,
  illnessInputSchema,
  illnessSymptomSchema,
} from "@health-tracker/shared";
import {
  Alert,
  Checkbox,
  CheckboxGroup,
  FieldError,
  Label,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { type Choice, ChoiceField } from "@/features/LogEvents/ChoiceField";
import { DatePickerField } from "@/features/LogEvents/DatePickerField";
import { FormActions } from "@/features/LogEvents/FormActions";
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

type IllnessFormProps = {
  onSubmit: (values: IllnessInput) => void | Promise<void>;
};

/** Logs an illness: when it started and ended, how bad it was, and the symptoms. */
export function IllnessForm({ onSubmit }: IllnessFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<IllnessInput>({
    resolver: zodResolver(illnessInputSchema),
    defaultValues: {
      startDate: today(),
      endDate: today(),
      severity: "mild",
      symptoms: [],
    },
  });

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
              label="Ended"
              calendarLabel="End date"
              name={field.name}
              value={field.value}
              onChange={(value) => field.onChange(value ?? "")}
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
            <CheckboxGroup
              name={field.name}
              value={field.value}
              // Rebuild the list from the known symptoms, so the form only ever holds valid values.
              onChange={(values) =>
                field.onChange(
                  illnessSymptomSchema.options.filter((symptom) =>
                    values.includes(symptom),
                  ),
                )
              }
              onBlur={field.onBlur}
              isInvalid={Boolean(fieldState.error)}
              className="flex flex-col gap-2"
            >
              <Label>Symptoms</Label>
              {illnessSymptomSchema.options.map((symptom) => (
                <Checkbox key={symptom} value={symptom}>
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Label>{symptomLabels[symptom]}</Label>
                  </Checkbox.Content>
                </Checkbox>
              ))}
              <FieldError>{fieldState.error?.message}</FieldError>
            </CheckboxGroup>
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

      <FormActions submitLabel="Save illness" isSubmitting={isSubmitting} />
    </form>
  );
}
