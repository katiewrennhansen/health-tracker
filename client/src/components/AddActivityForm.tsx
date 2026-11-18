import {
  type ActivityInput,
  activityInputSchema,
  activityTypeSchema,
} from "@health-tracker/shared";
import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Label,
  ListBox,
  NumberField,
  Select,
  Spinner,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { Controller, useForm } from "react-hook-form";
import { useActivitiesMutation } from "@/queries/useActivitiesMutation";

/** Today in the user's time zone, as YYYY-MM-DD (the "en-CA" locale formats dates that way). */
function today(): string {
  return new Date().toLocaleDateString("en-CA");
}

function defaultValues(): ActivityInput {
  return { date: today(), type: "run", durationMinutes: 1, effort: 1 };
}

/**
 * Logs a new activity. Validates with the same shared schema the server uses.
 * Calls `onSaved` once the server has stored it (the Today page uses this to close the modal).
 */
export function AddActivityForm({ onSaved }: { onSaved: () => void }) {
  const { createActivity } = useActivitiesMutation();
  const { control, handleSubmit } = useForm<ActivityInput>({
    resolver: zodResolver(activityInputSchema),
    defaultValues: defaultValues(),
  });

  const onSubmit = handleSubmit(async (values) => {
    await createActivity.mutateAsync(values);
    onSaved();
  });

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(e) => void onSubmit(e)}
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

      {createActivity.error && (
        <p className="text-sm text-danger">
          Couldn't save the activity. Please try again.
        </p>
      )}

      <Button
        type="submit"
        className="self-start"
        isPending={createActivity.isPending}
      >
        {createActivity.isPending && <Spinner size="sm" color="current" />}
        {createActivity.isPending ? "Saving…" : "Add activity"}
      </Button>
    </form>
  );
}
