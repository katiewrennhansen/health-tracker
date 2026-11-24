import { format, subDays } from "date-fns";
import { useState } from "react";
import { ChoiceField } from "@/features/LogEvents/ChoiceField";
import { DatePickerField } from "@/ui/DatePickerField";

export type DateShortcut = {
  label: string;
  /** 0 for today, 1 for yesterday, ... */
  daysAgo: number;
};

const pickKey = "pick";

/** A local calendar day `daysAgo` days back, as `YYYY-MM-DD`. */
const dateDaysAgo = (daysAgo: number) =>
  format(subDays(new Date(), daysAgo), "yyyy-MM-dd");

type WhenFieldProps = {
  label: string;
  /** Quick picks shown as buttons, e.g. Today and Yesterday. "Pick a date" is always added. */
  shortcuts: readonly DateShortcut[];
  name: string;
  /** `YYYY-MM-DD`. */
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  errorMessage?: string;
};

/** A date chosen with shortcut buttons ("Today", "Yesterday") or, via "Pick a date", a date picker. */
export function WhenField({
  label,
  shortcuts,
  name,
  value,
  onChange,
  onBlur,
  errorMessage,
}: WhenFieldProps) {
  const matchingShortcut = shortcuts.find(
    (s) => dateDaysAgo(s.daysAgo) === value,
  );
  // Start on "Pick a date" when the value isn't one of the shortcuts.
  const [isPicking, setIsPicking] = useState(!matchingShortcut);

  const options = [
    ...shortcuts.map((s) => ({ value: s.label, label: s.label })),
    { value: pickKey, label: "Pick a date" },
  ];

  const handleChoice = (choice: string) => {
    if (choice === pickKey) {
      setIsPicking(true);
      return;
    }
    const shortcut = shortcuts.find((s) => s.label === choice);
    if (!shortcut) return;
    setIsPicking(false);
    onChange(dateDaysAgo(shortcut.daysAgo));
  };

  return (
    <div className="flex flex-col gap-3">
      <ChoiceField
        label={label}
        options={options}
        value={isPicking ? pickKey : matchingShortcut?.label}
        onChange={handleChoice}
        errorMessage={isPicking ? undefined : errorMessage}
      />
      {isPicking && (
        <DatePickerField
          label="Date"
          calendarLabel={label}
          name={name}
          value={value}
          onChange={(date) => onChange(date ?? "")}
          onBlur={onBlur}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
}
