import {
  type ActivityInput,
  activityInputSchema,
  activityTypeSchema,
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
import { DatePickerField } from "@/ui/DatePickerField";
import { Button } from "@/ui/Button";
import { useActivitiesMutation } from "@/queries/useActivitiesMutation";
import { today } from "@/utils/utils";

/** Logs a workout: when, what kind, how long and how hard. */
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

  const onSubmit = async (values: ActivityInput) => {
    try {
      await createActivity.mutateAsync(values);
      toast.success("Workout logged successfully");
    } catch {
      toast.danger("Failed to log workout");
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
          name="date"
          render={({ field, fieldState }) => (
            <DatePickerField
              label="Date"
              calendarLabel="Workout date"
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
          name="type"
          render={({ field, fieldState }) => (
            <Select
              name={field.name}
              value={field.value}
              onChange={(key) => {
                const type = activityTypeSchema.options.find((t) => t === key);
                if (type) field.onChange(type);
              }}
              onBlur={field.onBlur}
              isInvalid={Boolean(fieldState.error)}
            >
              <Label>Type</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {activityTypeSchema.options.map((type) => (
                    <ListBox.Item key={type} id={type} textValue={type}>
                      <span className="capitalize">{type}</span>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="durationMinutes"
          render={({ field, fieldState }) => (
            <NumberField
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              minValue={1}
              maxValue={1440}
              step={5}
              // Keep out-of-range values (instead of clamping) so Zod shows the error.
              commitBehavior="validate"
              isInvalid={Boolean(fieldState.error)}
            >
              <Label>Duration (minutes)</Label>
              <NumberField.Group>
                <NumberField.DecrementButton />
                <NumberField.Input />
                <NumberField.IncrementButton />
              </NumberField.Group>
              <FieldError>{fieldState.error?.message}</FieldError>
            </NumberField>
          )}
        />
        <Controller
          control={control}
          name="effort"
          render={({ field, fieldState }) => (
            <NumberField
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              minValue={1}
              maxValue={10}
              commitBehavior="validate"
              isInvalid={Boolean(fieldState.error)}
            >
              <Label>Effort (1–10)</Label>
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

      <div className="flex justify-end gap-3">
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
