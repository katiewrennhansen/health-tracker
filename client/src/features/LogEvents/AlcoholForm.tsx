import { type AlcoholInput, alcoholInputSchema } from "@health-tracker/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { type Choice, ChoiceField } from "@/features/LogEvents/ChoiceField";
import { WhenField } from "@/components/WhenField";
import { useAlcoholMutations } from "@/queries/useAlcoholMutations";
import { Alert, Button, toast } from "@/ui";
import { NumberField } from "@/ui/NumberField";
import { today } from "@/utils/utils";

const manyDrinks = "6+";

/** "1"–"5" are exact counts; "6+" opens a number field for the exact count. */
const drinkOptions: readonly Choice<string>[] = [
  ...[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) })),
  { value: manyDrinks, label: manyDrinks },
];

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
      toast.success("Drinks saved. Today's advice will update.");
    } catch {
      toast.danger("Couldn't save the drinks. Please try again.");
    }
  };

  // Clear the form after a successful save, keeping the success flag so the message stays visible.
  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="date"
        render={({ field, fieldState }) => (
          <WhenField
            label="When"
            shortcuts={[
              { label: "Last night", daysAgo: 1 },
              { label: "Today", daysAgo: 0 },
            ]}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="drinks"
        render={({ field, fieldState }) => {
          const isMany = field.value >= 6;
          return (
            <div className="flex flex-col gap-3">
              <ChoiceField
                label="How many drinks?"
                options={drinkOptions}
                value={
                  isMany
                    ? manyDrinks
                    : field.value > 0
                      ? String(field.value)
                      : undefined
                }
                onChange={(choice) =>
                  field.onChange(choice === manyDrinks ? 6 : Number(choice))
                }
                errorMessage={isMany ? undefined : fieldState.error?.message}
              />
              {isMany && (
                <NumberField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  minValue={6}
                  maxValue={50}
                  label="Exact number of drinks"
                  groupClassName="max-w-48"
                  errorMessage={fieldState.error?.message}
                />
              )}
            </div>
          );
        }}
      />

      <Alert
        status="accent"
        title="What this changes"
        description="Drinks lower the next day's readiness, so the advice leans easier."
      />

      <div className="flex  justify-end">
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
