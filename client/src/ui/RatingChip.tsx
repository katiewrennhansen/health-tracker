import { Chip } from "@heroui/react";

type RatingChipProps = {
  value: number;
  reverse?: boolean;
};

export function RatingChip({ value, reverse }: RatingChipProps) {
  const variant = reverse
    ? value >= 4
      ? "danger"
      : value >= 2
        ? "warning"
        : "success"
    : value >= 4
      ? "success"
      : value >= 2
        ? "warning"
        : "danger";
  return (
    <Chip className="rounded-sm" variant="soft" color={variant}>
      <Chip.Label>{value}</Chip.Label>
    </Chip>
  );
}
