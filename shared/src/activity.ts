import { z } from "zod";
import { isoDateSchema } from "./common.ts";

/** Must match the `activity_type` enum in the database. */
export const activityTypeSchema = z.enum([
  "run",
  "ride",
  "swim",
  "lift",
  "walk",
  "hike",
  "other",
]);

/** Body for creating or replacing an activity. Unknown fields (including `userId`) are rejected. */
export const activityInputSchema = z.strictObject({
  date: isoDateSchema,
  type: activityTypeSchema,
  durationMinutes: z.int().min(1).max(1440),
  /** Perceived effort, 1 (very easy) to 10 (maximal). */
  effort: z.int().min(1).max(10),
});

/** A stored activity, as returned by the API. `userId` stays on the server. */
export const activitySchema = activityInputSchema.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime({ offset: true }),
});

/** GET /api/activities response. */
export const activityListSchema = z.array(activitySchema);

export type ActivityType = z.infer<typeof activityTypeSchema>;
export type ActivityInput = z.infer<typeof activityInputSchema>;
export type Activity = z.infer<typeof activitySchema>;
