import {
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Label,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import type { ReactNode } from "react";

type DatePickerFieldProps = {
  label: ReactNode;
  /** Text read out for the calendar popup, e.g. "Start date". */
  calendarLabel: string;
  name: string;
  /** `YYYY-MM-DD`, or `null` when empty. */
  value: string | null;
  onChange: (value: string | null) => void;
  onBlur: () => void;
  errorMessage?: string;
};

/**
 * A HeroUI DatePicker for a `YYYY-MM-DD` form value. The form keeps dates as strings (as the shared
 * schemas do) and `null` when empty; the picker works with CalendarDate, so this converts between them.
 */
export function DatePickerField({
  label,
  calendarLabel,
  name,
  value,
  onChange,
  onBlur,
  errorMessage,
}: DatePickerFieldProps) {
  return (
    <DatePicker
      name={name}
      value={value ? parseDate(value) : null}
      onChange={(date) => onChange(date?.toString() ?? null)}
      onBlur={onBlur}
      isInvalid={Boolean(errorMessage)}
    >
      <Label>{label}</Label>
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
      <FieldError>{errorMessage}</FieldError>
      <DatePicker.Popover>
        <Calendar aria-label={calendarLabel}>
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
  );
}
