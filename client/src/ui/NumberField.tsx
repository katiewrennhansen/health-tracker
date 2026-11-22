import {
  FieldError,
  Label,
  NumberField as HeroNumberField,
} from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

type NumberFieldProps = Omit<
  ComponentProps<typeof HeroNumberField>,
  "children" | "isInvalid"
> & {
  label: ReactNode;
  /** Shown under the field, and marks it invalid, e.g. `fieldState.error?.message`. */
  errorMessage?: string;
  labelClassName?: string;
  groupClassName?: string;
};

/**
 * HeroUI NumberField with its label, − / + buttons and error message. Takes every NumberField prop
 * (`value`, `onChange`, `minValue`, `step`, `formatOptions`, ...).
 */
export function NumberField({
  label,
  errorMessage,
  labelClassName,
  groupClassName,
  // Keep out-of-range values (instead of clamping) so the form's validation shows the error.
  commitBehavior = "validate",
  ...props
}: NumberFieldProps) {
  return (
    <HeroNumberField
      {...props}
      commitBehavior={commitBehavior}
      isInvalid={!!errorMessage}
    >
      <Label className={labelClassName}>{label}</Label>
      <HeroNumberField.Group className={groupClassName}>
        <HeroNumberField.DecrementButton />
        <HeroNumberField.Input />
        <HeroNumberField.IncrementButton />
      </HeroNumberField.Group>
      <FieldError>{errorMessage}</FieldError>
    </HeroNumberField>
  );
}
