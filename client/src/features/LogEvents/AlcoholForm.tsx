import { type AlcoholInput, alcoholInputSchema } from "@health-tracker/shared";
import { FieldError, Label, NumberField, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePickerField } from "@/ui/DatePickerField";
import { Button } from "@/ui/Button";
import { today } from "@/utils/utils";
import { useAlcoholMutations } from "@/queries/useAlcoholMutations";

/** Logs how many drinks the user had on a day. */
export function AlcoholForm() {
  const { createAlcohol } = useAlcoholMutations();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<AlcoholInput>({
    resolver: zodResolver(alcoholInputSchema),
    defaultValues: { date: today(), drinks: 0 },
  });

  const onSubmit = async (values: AlcoholInput) => {
    try {
      await createAlcohol.mutateAsync(values);
      toast.success("Alcohol entry saved successfully");
    } catch {
      toast.danger("Failed to save alcohol entry");
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="date"
          render={({ field, fieldState }) => (
            <DatePickerField
              label="Date"
              calendarLabel="Date"
              name={field.name}
              value={field.value}
              onChange={(value) => field.onChange(value ?? "")}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="drinks"
          render={({ field, fieldState }) => (
            <NumberField
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              minValue={1}
              maxValue={50}
              // Keep out-of-range values (instead of clamping) so Zod shows the error.
              commitBehavior="validate"
              isInvalid={Boolean(fieldState.error)}
            >
              <Label>Drinks</Label>
              <NumberField.Group>
                <NumberField.DecrementButton />
                <NumberField.Input />
                <NumberField.IncrementButton />
              </NumberField.Group>
              <FieldError>{fieldState.error?.message}</FieldError>
            </NumberField>
          )}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Save drinks
        </Button>
      </div>
    </form>
  );
}
