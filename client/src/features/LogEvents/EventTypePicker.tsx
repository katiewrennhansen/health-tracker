import {
  BeakerIcon,
  BoltIcon,
  FaceFrownIcon,
  GlobeAltIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Label,
  ToggleButton,
  ToggleButtonGroup,
  type Key,
} from "@heroui/react";
import { type ComponentType, type SVGProps, useId } from "react";

export type EventType = "workout" | "alcohol" | "illness" | "injury" | "travel";

type EventTypeOption = {
  value: EventType;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const eventTypes: readonly EventTypeOption[] = [
  {
    value: "workout",
    title: "Workout",
    description: "Run, ride, lift and more",
    icon: BoltIcon,
  },
  {
    value: "alcohol",
    title: "Alcohol",
    description: "Drinks on a day",
    icon: BeakerIcon,
  },
  {
    value: "travel",
    title: "Travel",
    description: "Trips, altitude, time zones",
    icon: GlobeAltIcon,
  },
  {
    value: "illness",
    title: "Illness",
    description: "Cold, flu, bug",
    icon: FaceFrownIcon,
  },
  {
    value: "injury",
    title: "Injury",
    description: "Pain or strain",
    icon: PlusCircleIcon,
  },
];

type EventTypePickerProps = {
  value: EventType;
  onChange: (value: EventType) => void;
};

/** "What happened?": one selectable card per kind of event. */
export function EventTypePicker({ value, onChange }: EventTypePickerProps) {
  const labelId = useId();

  const handleSelectionChange = (keys: Set<Key>) => {
    const [key] = keys;
    const option = eventTypes.find((t) => t.value === key);
    if (option) onChange(option.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label id={labelId}>What happened?</Label>
      <ToggleButtonGroup
        aria-labelledby={labelId}
        selectionMode="single"
        disallowEmptySelection
        isDetached
        selectedKeys={new Set([value])}
        onSelectionChange={handleSelectionChange}
        className="grid grid-cols-1 gap-3  lg:grid-cols-5 items-stretch"
      >
        {eventTypes.map(({ value: type, title, description, icon: Icon }) => (
          <ToggleButton
            key={type}
            id={type}
            className="text-left flex w-full h-auto flex-col items-start  gap-1 bg-white rounded-sm border border-border p-3 whitespace-normal data-selected:border-accent data-selected:bg-accent-soft data-selected:text-accent-soft-foreground"
          >
            <Icon className="mb-1 size-5 self-start" aria-hidden />
            <span className="font-semibold">{title}</span>
            <span className="text-sm font-normal text-muted">
              {description}
            </span>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
