import {
  type Activity,
  type ActivityInput,
  type ActivityPatch,
  activityInputSchema,
  activityTypeSchema,
} from "@health-tracker/shared";
import {
  toast,
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Label,
  ListBox,
  NumberField,
  Select,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { Controller, useForm } from "react-hook-form";
import { useActivitiesMutation } from "@/queries/useActivitiesMutation";
import { Button } from "@/ui/Button";

/** Today in the user's time zone, as YYYY-MM-DD (the "en-CA" locale formats dates that way). */
function today(): string {
  return new Date().toLocaleDateString("en-CA");
}

interface ActivityFormProps {
  activity?: Activity;
  onSaved: () => void;
}

/** Logs a new activity or edits an existing one. Validates with the same shared schema the server uses. */
export function ActivityForm({ activity, onSaved }: ActivityFormProps) {
  const { createActivity, updateActivity } = useActivitiesMutation();
  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm<ActivityInput>({
    resolver: zodResolver(activityInputSchema),
    // Check a field when the user leaves it, then re-check as they fix it.
    mode: "onBlur",
    defaultValues: activity
      ? {
          date: activity.date,
          type: activity.type,
          durationMinutes: activity.durationMinutes,
          effort: activity.effort,
        }
      : { date: today(), type: "run", durationMinutes: 1, effort: 1 },
  });

  const onSubmit = async (values: ActivityInput) => {
    if (!activity) {
      try {
        await createActivity.mutateAsync(values);
        onSaved();
        toast.success("Activity saved");
      } catch {
        toast.danger("Couldn't save the activity");
      }
    } else {
      // Editing: send only the fields the user changed.
      const patch: ActivityPatch = {};
      if (dirtyFields.date) patch.date = values.date;
      if (dirtyFields.type) patch.type = values.type;
      if (dirtyFields.durationMinutes)
        patch.durationMinutes = values.durationMinutes;
      if (dirtyFields.effort) patch.effort = values.effort;

      try {
        await updateActivity.mutateAsync(
          { id: activity.id, patch },
          { onSuccess: onSaved },
        );

        onSaved();
        toast.success("Activity saved");
      } catch {
        toast.danger("Couldn't save the activity");
      }
    }
  };

  const isSaving = createActivity.isPending || updateActivity.isPending;
  const saveFailed = createActivity.isError || updateActivity.isError;

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="date"
        render={({ field, fieldState }) => (
          // The form keeps the date as "YYYY-MM-DD"; DatePicker works with CalendarDate.
          <DatePicker
            name={field.name}
            value={field.value ? parseDate(field.value) : null}
            onChange={(value) => {
              field.onChange(value?.toString() ?? "");
            }}
            onBlur={field.onBlur}
            isInvalid={Boolean(fieldState.error)}
          >
            <Label>Date</Label>
            <DateField.Group fullWidth>
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
              <DateField.Suffix>
                <DatePicker.Trigger>
                  <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <FieldError>{fieldState.error?.message}</FieldError>
            <DatePicker.Popover>
              <Calendar aria-label="Activity date">
                <Calendar.Header>
                  <Calendar.YearPickerTrigger>
                    <Calendar.YearPickerTriggerHeading />
                    <Calendar.YearPickerTriggerIndicator />
                  </Calendar.YearPickerTrigger>
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>
                    {(date) => <Calendar.Cell date={date} />}
                  </Calendar.GridBody>
                </Calendar.Grid>
                <Calendar.YearPickerGrid>
                  <Calendar.YearPickerGridBody>
                    {({ year }) => <Calendar.YearPickerCell year={year} />}
                  </Calendar.YearPickerGridBody>
                </Calendar.YearPickerGrid>
              </Calendar>
            </DatePicker.Popover>
          </DatePicker>
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
              field.onChange(key);
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

      {saveFailed && (
        <p className="text-sm text-danger">
          Couldn't save the activity. Please try again.
        </p>
      )}

      <Button
        type="submit"
        className="self-end"
        isDisabled={isSaving}
        isLoading={isSaving}
      >
        Save activity
      </Button>
    </form>
  );
}
