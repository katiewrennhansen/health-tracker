import { type Key, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { type EventType, eventTypes } from "@/features/LogEvents/types";

type EventTypePickerProps = {
  value: EventType;
  onChange: (value: EventType) => void;
};

/** The Log page's own menu: one item per kind of event, the selected one highlighted. */
export function EventTypePicker({ value, onChange }: EventTypePickerProps) {
  const handleSelectionChange = (keys: Set<Key>) => {
    const [key] = keys;
    const option = eventTypes.find((t) => t.value === key);
    if (option) onChange(option.value);
  };

  return (
    <ToggleButtonGroup
      aria-label="What to log"
      orientation="vertical"
      selectionMode="single"
      disallowEmptySelection
      isDetached
      selectedKeys={new Set([value])}
      onSelectionChange={handleSelectionChange}
      className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:flex md:flex-col w-full"
    >
      {eventTypes.map(({ value: type, title, description, icon: Icon }) => (
        <ToggleButton
          key={type}
          id={type}
          variant="ghost"
          className="flex h-auto w-full items-center justify-start gap-3 rounded-sm p-2 text-left whitespace-normal data-selected:bg-accent-soft data-selected:text-accent-soft-foreground"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-border bg-surface">
            <Icon className="size-4" aria-hidden />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold">{title}</span>
            <span className="text-xs font-normal text-muted">
              {description}
            </span>
          </span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
