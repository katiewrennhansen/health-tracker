import type { Activity } from "@health-tracker/shared";
import { Card } from "@heroui/react";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import { lastSevenDays, loadSummary } from "@/features/Today/trainingLoad";

/** Above this, this week's load is well over the usual and the ratio is shown as a warning. */
const highRatio = 1.3;

/** Height of the tallest bar, in rem. The bar area is a little taller so the value fits above it. */
const maxBarRem = 8;

const formatNumber = (value: number) => Math.round(value).toLocaleString();

type TrainingLoadChartProps = {
  activities: Activity[];
};

/**
 * Bar chart of training load (duration × effort) for the last 7 days, with this week's total
 * compared with the 4-week weekly average. The most recent day with a session is highlighted.
 */
export function TrainingLoadChart({ activities }: TrainingLoadChartProps) {
  const today = new Date();
  const days = lastSevenDays(activities, today);
  const { sevenDayTotal, weeklyAverage, ratio } = loadSummary(
    activities,
    today,
  );
  const maxLoad = Math.max(...days.map((day) => day.load), 1);
  // Index of the most recent day with a session (-1 if none), which gets the dark bar.
  const latestIndex = days.reduce(
    (latest, day, index) => (day.hasSessions ? index : latest),
    -1,
  );

  return (
    <Card className="rounded-sm">
      <Card.Header className="flex flex-row flex-wrap items-baseline justify-between gap-2">
        <Card.Title>Training load, last 7 days</Card.Title>
        <p className="text-sm text-muted">
          7-day total{" "}
          <span className="font-semibold text-foreground">
            {formatNumber(sevenDayTotal)}
          </span>{" "}
          · 4-week weekly average{" "}
          <span className="font-semibold text-foreground">
            {formatNumber(weeklyAverage)}
          </span>{" "}
          · ratio{" "}
          <span
            className={clsx(
              "font-semibold",
              ratio !== null && ratio > highRatio
                ? "text-warning"
                : "text-foreground",
            )}
          >
            {ratio === null ? "—" : `${ratio.toFixed(1)}×`}
          </span>
        </p>
      </Card.Header>

      <Card.Content>
        <ol className="grid grid-cols-7 gap-2 sm:gap-6">
          {days.map((day, index) => {
            const isToday = index === days.length - 1;
            const label = isToday ? "Today" : format(parseISO(day.date), "EEE");
            return (
              <li
                key={day.date}
                className="flex flex-col items-center gap-2"
                aria-label={`${label}: load ${day.hasSessions ? day.load : "none logged"}`}
              >
                {/* Bar area: the value sits on top of the bar, bars grow up from the baseline. */}
                <div
                  className="flex h-40 w-full flex-col items-center justify-end gap-1"
                  aria-hidden
                >
                  <span className="text-xs text-muted">
                    {isToday && !day.hasSessions ? "—" : day.load}
                  </span>
                  {day.load > 0 ? (
                    <div
                      className={clsx(
                        "w-full max-w-12 rounded-sm",
                        index === latestIndex ? "bg-accent" : "bg-accent/40",
                      )}
                      style={{
                        height: `${(day.load / maxLoad) * maxBarRem}rem`,
                      }}
                    />
                  ) : (
                    <div className="h-0.5 w-full max-w-12 bg-separator" />
                  )}
                </div>
                <span
                  className={clsx(
                    "text-sm",
                    isToday ? "font-semibold" : "text-muted",
                  )}
                  aria-hidden
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </Card.Content>

      <Card.Footer className="text-sm text-muted">
        Load = duration × effort for each session.
      </Card.Footer>
    </Card>
  );
}
