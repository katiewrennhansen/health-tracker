import type { Activity } from "@health-tracker/shared";
import { sql } from "drizzle-orm";
import { db } from "./client.ts";

/** An activity as `pg` returns it: like the shared `Activity`, but `createdAt` is still a Date until it's sent as JSON. */
export type ActivityRow = Omit<Activity, "createdAt"> & { createdAt: Date };

/**
 * A user's activities, newest first. Columns are aliased to match the shared `Activity` schema;
 * `date::text` keeps the date as 'YYYY-MM-DD' instead of a time-zone-shifted Date.
 */
export async function getActivities(userId: string): Promise<ActivityRow[]> {
  const { rows } = await db.execute<ActivityRow>(sql`
    SELECT
      id,
      date::text       AS "date",
      type,
      duration_minutes AS "durationMinutes",
      effort,
      created_at       AS "createdAt"
    FROM activities
    WHERE user_id = ${userId}
    ORDER BY date DESC, created_at DESC
  `);
  return rows;
}
