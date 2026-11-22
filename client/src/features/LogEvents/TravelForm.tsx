import { type TravelInput, travelInputSchema } from "@health-tracker/shared";
import {
  FieldError,
  Input,
  Label,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumberField } from "@/ui/NumberField";
import { DatePickerField } from "@/ui/DatePickerField";
import { Button } from "@/ui/Button";
import { today } from "@/utils/utils";
import { useTravelMutations } from "@/queries/useTravelMutations";

/** Logs a trip: where, when, and the altitude and time zone change that affect training. */
export function TravelForm() {
  const { createTravel } = useTravelMutations();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<TravelInput>({
    resolver: zodResolver(travelInputSchema),
    defaultValues: {
      startDate: today(),
      endDate: null,
      destination: "",
      altitudeM: null,
      timeZoneShift: null,
      notes: null,
    },
  });

  const onSubmit = async (values: TravelInput) => {
    try {
      await createTravel.mutateAsync(values);
      toast.success("Travel created successfully");
    } catch {
      toast.danger("Failed to create travel");
    }
  };

  // Clear the form after a successful save (react-hook-form recommends this over resetting inside onSubmit).
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
        name="destination"
        render={({ field, fieldState }) => (
          <TextField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={!!fieldState.error}
          >
            <Label>Destination</Label>
            <Input placeholder="e.g. Denver" />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="startDate"
          render={({ field, fieldState }) => (
            <DatePickerField
              label="Started"
              calendarLabel="Start date"
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
          name="endDate"
          render={({ field, fieldState }) => (
            <DatePickerField
              label={
                <>
                  Ended{" "}
                  <span className="font-normal text-muted">
                    (leave empty if still away)
                  </span>
                </>
              }
              calendarLabel="End date"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="altitudeM"
          render={({ field, fieldState }) => (
            <NumberField
              name={field.name}
              // NaN shows an empty input for a `null` value.
              value={field.value ?? 0}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              step={100}
              label={
                <>
                  Altitude (m){" "}
                  <span className="font-normal text-muted">(optional)</span>
                </>
              }
              errorMessage={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="timeZoneShift"
          render={({ field, fieldState }) => (
            <NumberField
              name={field.name}
              value={field.value ?? 0}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              // Show a "+" on eastward shifts, e.g. "+5".
              formatOptions={{ signDisplay: "exceptZero" }}
              label={
                <>
                  Time zone change (hours){" "}
                  <span className="font-normal text-muted">(optional)</span>
                </>
              }
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="notes"
        render={({ field, fieldState }) => (
          <TextField
            name={field.name}
            value={field.value ?? ""}
            // An empty box is stored as `null`, matching the nullable `notes` column.
            onChange={(value) => field.onChange(value === "" ? null : value)}
            onBlur={field.onBlur}
            isInvalid={!!fieldState.error}
          >
            <Label>
              Notes <span className="font-normal text-muted">(optional)</span>
            </Label>
            <TextArea placeholder="Anything that might affect training?" />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Save trip
        </Button>
      </div>
    </form>
  );
}
