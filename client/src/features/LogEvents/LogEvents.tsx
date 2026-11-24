import { format } from "date-fns";
import { useState } from "react";
import { AlcoholForm } from "@/features/LogEvents/AlcoholForm";
import { EventTypePicker } from "@/features/LogEvents/EventTypePicker";
import { type EventType, eventTypes } from "@/features/LogEvents/types";
import { IllnessForm } from "@/features/LogEvents/IllnessForm";
import { InjuryForm } from "@/features/LogEvents/InjuryForm";
import { TravelForm } from "@/features/LogEvents/TravelForm";
import { WorkoutForm } from "@/features/LogEvents/WorkoutForm";
import { Card } from "@/ui/Card";

/**
 * Log page: a menu of what can be logged on the left, and the chosen form on the right. Each type
 * has its own form (and its own `useForm`), so switching type starts that form fresh.
 */
export function LogEvents() {
  const [eventType, setEventType] = useState<EventType>("workout");
  const selected = eventTypes.find((t) => t.value === eventType);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
        <h1 className="text-3xl font-bold">Log Events</h1>
      </header>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <nav aria-label="What to log" className="md:w-52 md:shrink-0">
          <EventTypePicker value={eventType} onChange={setEventType} />
        </nav>

        <div className="min-w-0 flex-1">
          <Card>
            {selected && (
              <div className="mb-6 flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-accent-soft text-accent-soft-foreground">
                  <selected.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">
                    {selected.formTitle}
                  </h2>
                  <p className="text-sm text-muted">{selected.description}</p>
                </div>
              </div>
            )}
            {eventType === "workout" && <WorkoutForm />}
            {eventType === "alcohol" && <AlcoholForm />}
            {eventType === "illness" && <IllnessForm />}
            {eventType === "injury" && <InjuryForm />}
            {eventType === "travel" && <TravelForm />}
          </Card>
        </div>
      </div>
    </section>
  );
}
