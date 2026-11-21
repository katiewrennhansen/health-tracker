import { Card, toast } from "@heroui/react";
import { format } from "date-fns";
import { useState } from "react";
import { AlcoholForm } from "@/features/LogEvents/AlcoholForm";
import {
  type EventType,
  EventTypePicker,
} from "@/features/LogEvents/EventTypePicker";
import { IllnessForm } from "@/features/LogEvents/IllnessForm";
import { InjuryForm } from "@/features/LogEvents/InjuryForm";
import { TravelForm } from "@/features/LogEvents/TravelForm";
import { WorkoutForm } from "@/features/LogEvents/WorkoutForm";

/**
 * Log page: pick what happened, then fill in that event's form. Each event type has its own form
 * (and its own `useForm`), so switching type starts that form fresh.
 */
export function LogEvents() {
  const [eventType, setEventType] = useState<EventType>("workout");

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
        <h1 className="text-3xl font-bold">Log Events</h1>
      </header>

      <Card className="rounded-sm">
        <Card.Content className="flex flex-col gap-6">
          <EventTypePicker value={eventType} onChange={setEventType} />
          {eventType === "workout" && <WorkoutForm />}
          {eventType === "alcohol" && <AlcoholForm />}
          {eventType === "illness" && <IllnessForm />}
          {eventType === "injury" && <InjuryForm />}
          {eventType === "travel" && <TravelForm />}
        </Card.Content>
      </Card>
    </section>
  );
}
