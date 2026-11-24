import {
  BeakerIcon,
  BoltIcon,
  FaceFrownIcon,
  GlobeAltIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type EventType = "workout" | "alcohol" | "illness" | "injury" | "travel";

export type EventTypeOption = {
  value: EventType;
  /** Menu label, e.g. "Workout". */
  title: string;
  /** Heading on the form, e.g. "Log workout". */
  formTitle: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** The kinds of thing the Log page can record, in menu order. */
export const eventTypes: readonly EventTypeOption[] = [
  {
    value: "workout",
    title: "Workout",
    formTitle: "Log workout",
    description: "Type, duration, effort",
    icon: BoltIcon,
  },
  {
    value: "alcohol",
    title: "Alcohol",
    formTitle: "Log alcohol",
    description: "Drinks on a day",
    icon: BeakerIcon,
  },
  {
    value: "illness",
    title: "Illness",
    formTitle: "Log illness",
    description: "Cold, flu, bug",
    icon: FaceFrownIcon,
  },
  {
    value: "injury",
    title: "Injury",
    formTitle: "Log injury",
    description: "Pain or strain",
    icon: PlusCircleIcon,
  },
  {
    value: "travel",
    title: "Travel",
    formTitle: "Log travel",
    description: "Altitude, time zones",
    icon: GlobeAltIcon,
  },
];
