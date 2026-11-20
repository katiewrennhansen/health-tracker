import { Chip } from "@heroui/react";
import { clsx } from "clsx";

export function RatingChip({ value }: { value: number }) {
  const variant = value >= 8 ? "success" : value >= 4 ? "warning" : "danger";
  return (
    <Chip
      className={clsx("rounded-sm", {
        "bg-success/60": variant === "success",
        "bg-warning/60": variant === "warning",
        "bg-danger/60": variant === "danger",
      })}
    >
      {value}
    </Chip>
  );
}
