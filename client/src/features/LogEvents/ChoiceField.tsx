import { Label, ToggleButton, ToggleButtonGroup } from "@heroui/react";

export type Choice<T extends string> = {
  value: T;
  label: string;
};

type ChoiceFieldProps<T extends string> = {
  label: string;
  options: readonly Choice<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Pick one option from a row of buttons, with the selected one filled (same look as the check-in ratings). */
export function ChoiceField<T extends string>({
  label,
  options,
  value,
  onChange,
}: ChoiceFieldProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <ToggleButtonGroup
        aria-label={label}
        selectionMode="single"
        disallowEmptySelection
        isDetached
        fullWidth
        selectedKeys={new Set([value])}
        onSelectionChange={(keys) => {
          const [key] = keys;
          // Look the key up in `options` rather than casting it, so only real options reach the form.
          const option = options.find((o) => o.value === key);
          if (option) onChange(option.value);
        }}
      >
        {options.map((option) => (
          <ToggleButton
            key={option.value}
            id={option.value}
            className="rounded-sm data-selected:bg-foreground data-selected:text-background"
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
