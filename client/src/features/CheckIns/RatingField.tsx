import { Label, ToggleButton, ToggleButtonGroup } from "@heroui/react";

const ratings = [1, 2, 3, 4, 5] as const;

type RatingFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Words under the 1 and the 5, e.g. "None" and "Very sore". */
  lowLabel: string;
  highLabel: string;
};

/** A 1–5 rating picked from five buttons, with the selected one filled. */
export function RatingField({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: RatingFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <ToggleButtonGroup
        aria-label={label}
        selectionMode="single"
        disallowEmptySelection
        isDetached
        fullWidth
        selectedKeys={new Set([String(value)])}
        onSelectionChange={(keys) => {
          const [key] = keys;
          if (key !== undefined) onChange(Number(key));
        }}
      >
        {ratings.map((rating) => (
          <ToggleButton
            key={rating}
            id={String(rating)}
            className="data-selected:bg-foreground data-selected:text-background"
          >
            {rating}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div className="flex justify-between text-xs text-muted">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
