import {
  type InjuryInput,
  bodyAreaSchema,
  injuryInputSchema,
} from "@health-tracker/shared";
import {
  FieldError,
  Label,
  ListBox,
  NumberField,
  Select,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePickerField } from "@/features/LogEvents/DatePickerField";
import { FormActions } from "@/features/LogEvents/FormActions";
import { today } from "@/utils/utils";
import { useInjuriesMutations } from "@/queries/useInjuriesMutations";

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
    // No body area is picked to start with, so the user has to choose one; the Select shows it as empty.
    defaultValues: { startDate: today(), endDate: null, severity: 3 },
  });

  const onSubmit = async (values: InjuryInput) => {
    try {
      await createInjury.mutateAsync(values);
      toast.success("Injury logged successfully");
    } catch {
      toast.danger("Failed to log injury");
    }
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="bodyArea"
          render={({ field, fieldState }) => (
            <Select
              name={field.name}
              // `null` (not undefined) keeps the Select controlled while nothing is picked.
              value={field.value ?? null}
              onChange={(key) => {
                const area = bodyAreaSchema.options.find((a) => a === key);
                if (area) field.onChange(area);
              }}
              onBlur={field.onBlur}
              isInvalid={Boolean(fieldState.error)}
              placeholder="Choose a body area"
            >
              <Label>Body area</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {bodyAreaSchema.options.map((area) => (
                    <ListBox.Item key={area} id={area} textValue={area}>
                      <span className="capitalize">{area}</span>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Select>
          )}
        />
        <Controller
          control={control}
          name="severity"
          render={({ field, fieldState }) => (
            <NumberField
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              minValue={1}
              maxValue={10}
              // Keep out-of-range values (instead of clamping) so Zod shows the error.
              commitBehavior="validate"
              isInvalid={Boolean(fieldState.error)}
            >
              <Label>Severity (1–10)</Label>
              <NumberField.Group>
                <NumberField.DecrementButton />
                <NumberField.Input />
                <NumberField.IncrementButton />
              </NumberField.Group>
              <FieldError>{fieldState.error?.message}</FieldError>
            </NumberField>
          )}
        />
      </div>

      <FormActions submitLabel="Save injury" isSubmitting={isSubmitting} />
    </form>
  );
}
