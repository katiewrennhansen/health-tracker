import {
  type Key,
  Label,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import clsx from "clsx";

export type Choice<T extends string> = {
  value: T;
  label: string;
  /** Optional second line; options with one are drawn as small cards. */
  description?: string;
};

type ChoiceFieldProps<T extends string> = {
  label: string;
  options: readonly Choice<T>[];
  /** `undefined` while nothing is picked yet. */
  value: T | undefined;
  onChange: (value: T) => void;
  errorMessage?: string;
  /** Stretch the buttons to fill the row (default). Set false for wrapping pills. */
  fullWidth?: boolean;
};

/** Pick one option from a row of buttons, with the selected one filled. */
export function ChoiceField<T extends string>({
  label,
  options,
  value,
  onChange,
  errorMessage,
  fullWidth = true,
}: ChoiceFieldProps<T>) {
  const handleSelectionChange = (keys: Set<Key>) => {
    const [key] = keys;
    // Look the key up in `options` rather than casting it, so only real options reach the form.
    const option = options.find((o) => o.value === key);
    if (option) onChange(option.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <ToggleButtonGroup
        aria-label={label}
        selectionMode="single"
        disallowEmptySelection
        isDetached
        fullWidth={fullWidth}
        selectedKeys={new Set(value === undefined ? [] : [value])}
        onSelectionChange={handleSelectionChange}
        className={clsx(!fullWidth && "flex-wrap")}
      >
        {options.map((option) => (
          <ToggleButton
            key={option.value}
            id={option.value}
            className={clsx(
              "rounded-sm data-selected:bg-foreground data-selected:text-background",
              option.description &&
                "h-auto flex-col items-start gap-0.5 p-3 text-left whitespace-normal",
            )}
          >
            <span>{option.label}</span>
            {option.description && (
              <span className="text-xs font-normal opacity-70">
                {option.description}
              </span>
            )}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}
    </div>
  );
}
