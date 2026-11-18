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
  durationMinutes: z
    .int()
    .min(1, "Duration must be at least 1 minute")
    .max(1440, "Duration can't be more than 24 hours (1440 minutes)"),
  /** Perceived effort, 1 (very easy) to 10 (maximal). */
  effort: z
    .int()
    .min(1, "Effort must be between 1 and 10")
    .max(10, "Effort must be between 1 and 10"),
});

/** Body for PATCH /api/activities/:id: any of the input fields, at least one. Unknown fields are still rejected. */
export const activityPatchSchema = activityInputSchema
  .partial()
  .refine((patch) => Object.keys(patch).length > 0, {
    message: "Send at least one field to update",
  });

/** An activity's ID, e.g. the `:id` in DELETE /api/activities/:id. */
export const activityIdSchema = z.uuid();

/** A stored activity, as returned by the API. `userId` stays on the server. */
export const activitySchema = activityInputSchema.extend({
  id: activityIdSchema,
  createdAt: z.iso.datetime({ offset: true }),
});

/** GET /api/activities response. */
export const activityListSchema = z.array(activitySchema);

export type ActivityType = z.infer<typeof activityTypeSchema>;
export type ActivityInput = z.infer<typeof activityInputSchema>;
export type ActivityPatch = z.infer<typeof activityPatchSchema>;
export type Activity = z.infer<typeof activitySchema>;
