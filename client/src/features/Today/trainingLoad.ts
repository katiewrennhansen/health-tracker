import type { Activity } from "@health-tracker/shared";
import { format, subDays } from "date-fns";

/** Training load for one session: minutes × effort (1–10). */
export const sessionLoad = (
  activity: Pick<Activity, "durationMinutes" | "effort">,
) => activity.durationMinutes * activity.effort;

/** A local calendar day as `YYYY-MM-DD`, the same format activities are stored in. */
const toIsoDay = (day: Date) => format(day, "yyyy-MM-dd");

/** Total load per day, keyed by `YYYY-MM-DD`. Days with no sessions are missing. */
function loadByDay(activities: readonly Activity[]) {
  const totals = new Map<string, number>();
  for (const activity of activities) {
    totals.set(
      activity.date,
      (totals.get(activity.date) ?? 0) + sessionLoad(activity),
    );
  }
  return totals;
}

export type DayLoad = {
  /** `YYYY-MM-DD`. */
  date: string;
  load: number;
  /** False when nothing was logged that day (shown differently from a logged load of 0). */
  hasSessions: boolean;
};

/** Load for each of the 7 days ending on `today`, oldest first. */
export function lastSevenDays(
  activities: readonly Activity[],
  today: Date,
): DayLoad[] {
  const totals = loadByDay(activities);
  return Array.from({ length: 7 }, (_, index) => {
    const date = toIsoDay(subDays(today, 6 - index));
    const load = totals.get(date);
    return { date, load: load ?? 0, hasSessions: load !== undefined };
  });
}

export type LoadSummary = {
  /** Total load over the 7 days ending today. */
  sevenDayTotal: number;
  /** Total load over the 28 days ending today, divided by 4. */
  weeklyAverage: number;
  /** `sevenDayTotal / weeklyAverage`, or null with no load in the last 4 weeks. */
  ratio: number | null;
};

/** This week's load compared with the last four weeks' weekly average. */
export function loadSummary(
  activities: readonly Activity[],
  today: Date,
): LoadSummary {
  const totals = loadByDay(activities);
  const totalOver = (days: number) =>
    Array.from({ length: days }, (_, index) =>
      toIsoDay(subDays(today, index)),
    ).reduce((sum, date) => sum + (totals.get(date) ?? 0), 0);

  const sevenDayTotal = totalOver(7);
  const weeklyAverage = totalOver(28) / 4;
  return {
    sevenDayTotal,
    weeklyAverage,
    ratio: weeklyAverage > 0 ? sevenDayTotal / weeklyAverage : null,
  };
}
