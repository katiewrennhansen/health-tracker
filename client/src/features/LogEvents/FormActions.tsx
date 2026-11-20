import { Button } from "@/ui/Button";

type FormActionsProps = {
  submitLabel: string;
  isSubmitting: boolean;
};

/** The row under every event form: a separator, then Cancel and the save button on the right. */
export function FormActions({ submitLabel, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="submit" isDisabled={isSubmitting} isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </div>
  );
}
