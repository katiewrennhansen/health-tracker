import type { ActivityInput, ActivityPatch } from "@health-tracker/shared";
import { and, desc, eq } from "drizzle-orm";
import { db } from "./client.ts";
import { activities } from "./schema.ts";

const generateActivitySelect = (a: typeof activities) => ({
  id: a.id,
  date: a.date,
  type: a.type,
  durationMinutes: a.durationMinutes,
  effort: a.effort,
  createdAt: a.createdAt,
});

/** A user's activities, newest first. */
export function getActivities(userId: string) {
  return db
    .select(generateActivitySelect(activities))
    .from(activities)
    .where(eq(activities.userId, userId))
    .orderBy(desc(activities.date), desc(activities.createdAt));
}

export async function createActivity(userId: string, input: ActivityInput) {
  const [row] = await db
    .insert(activities)
    .values({ userId, ...input })
    .returning(generateActivitySelect(activities));

  if (!row) throw new Error("INSERT ... RETURNING returned no row");
  return row;
}

/** Updates only the fields in `patch`. Returns null if the user has no activity with that ID. */
export async function updateActivity(
  userId: string,
  id: string,
  patch: ActivityPatch,
) {
  const [row] = await db
    .update(activities)
    .set(patch)
    .where(and(eq(activities.userId, userId), eq(activities.id, id)))
    .returning(generateActivitySelect(activities));

  return row ?? null;
}

/** Deletes one of the user's activities. Returns false if the user has no activity with that ID. */
export async function deleteActivity(
  userId: string,
  id: string,
): Promise<boolean> {
  const result = await db
    .delete(activities)
    .where(and(eq(activities.userId, userId), eq(activities.id, id)));
  return (result.rowCount ?? 0) > 0;
}
