import {
  type Key,
  Label,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";

type ScaleFieldProps = {
  label: string;
  min: number;
  max: number;
  /** 0 (or any value outside min–max) while nothing is picked yet. */
  value: number;
  onChange: (value: number) => void;
  /** Words under the lowest and highest buttons, e.g. "Very easy" and "All out". */
  lowLabel: string;
  highLabel: string;
  /** Shown on the right of the label for the current value, e.g. "7 / 10 · Hard". */
  valueText?: string;
  errorMessage?: string;
};

/** A number picked from a row of buttons (e.g. effort 1–10), with words at each end. */
export function ScaleField({
  label,
  min,
  max,
  value,
  onChange,
  lowLabel,
  highLabel,
  valueText,
  errorMessage,
}: ScaleFieldProps) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const handleSelectionChange = (keys: Set<Key>) => {
    const [key] = keys;
    const step = steps.find((s) => String(s) === key);
    if (step !== undefined) onChange(step);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label>{label}</Label>
        {valueText && <span className="text-sm text-muted">{valueText}</span>}
      </div>
      <ToggleButtonGroup
        aria-label={label}
        selectionMode="single"
        disallowEmptySelection
        isDetached
        fullWidth
        selectedKeys={new Set([String(value)])}
        onSelectionChange={handleSelectionChange}
      >
        {steps.map((step) => (
          <ToggleButton
            key={step}
            id={String(step)}
            className="min-w-0 rounded-sm px-0 data-selected:bg-foreground data-selected:text-background"
          >
            {step}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div className="flex justify-between text-xs text-muted">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}
    </div>
  );
}
