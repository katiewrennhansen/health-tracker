import type { ActivityInput } from "@health-tracker/shared";
import { and, desc, eq } from "drizzle-orm";
import { db } from "./client.ts";
import { activities } from "./schema.ts";

/** A user's activities, newest first. */
export function getActivities(userId: string) {
  return db
    .select({
      id: activities.id,
      date: activities.date,
      type: activities.type,
      durationMinutes: activities.durationMinutes,
      effort: activities.effort,
      createdAt: activities.createdAt,
    })
    .from(activities)
    .where(eq(activities.userId, userId))
    .orderBy(desc(activities.date), desc(activities.createdAt));
}

export async function createActivity(userId: string, input: ActivityInput) {
  const [row] = await db
    .insert(activities)
    .values({ userId, ...input })
    .returning({
      id: activities.id,
      date: activities.date,
      type: activities.type,
      durationMinutes: activities.durationMinutes,
      effort: activities.effort,
      createdAt: activities.createdAt,
    });

  if (!row) throw new Error("INSERT ... RETURNING returned no row");
  return row;
}

/** Deletes one of the user's activities. Returns false if the user has no activity with that ID. */
export async function deleteActivity(userId: string, id: string): Promise<boolean> {
  const result = await db
    .delete(activities)
    .where(and(eq(activities.userId, userId), eq(activities.id, id)));
  return (result.rowCount ?? 0) > 0;
}
