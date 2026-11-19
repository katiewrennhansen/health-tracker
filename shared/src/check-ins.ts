import { z } from "zod";
import { isoDateSchema } from "./common.ts";

/** A 1–5 rating. `field` names it in the error message, e.g. "Mood must be between 1 and 5". */
const ratingSchema = (field: string) =>
  z
    .int()
    .min(1, `${field} must be between 1 and 5`)
    .max(5, `${field} must be between 1 and 5`);

/** Body for creating a daily check-in. Unknown fields (including `userId`) are rejected. Matches the `daily_checkins` table's checks. */
export const checkInInputSchema = z.strictObject({
  date: isoDateSchema,
  sleepMinutes: z
    .int()
    .min(0, "Sleep can't be negative")
    .max(1440, "Sleep can't be more than 24 hours (1440 minutes)"),
  /** 1 (low) to 5 (great). */
  mood: ratingSchema("Mood"),
  /** 1 (drained) to 5 (full of energy). */
  energy: ratingSchema("Energy"),
  /** 1 (none) to 5 (very sore). */
  soreness: ratingSchema("Soreness"),
  /** 1 (low) to 5 (high). */
  stress: ratingSchema("Stress"),
});

/** Body for PATCH /api/check-ins/:id: any of the input fields, at least one. Unknown fields are still rejected. */
export const checkInPatchSchema = checkInInputSchema
  .partial()
  .refine((patch) => Object.keys(patch).length > 0, {
    message: "Send at least one field to update",
  });

/** A check-in's ID, e.g. the `:id` in PATCH /api/check-ins/:id. */
export const checkInIdSchema = z.uuid();

/** A stored check-in, as returned by the API. `userId` stays on the server. */
export const checkInSchema = checkInInputSchema.extend({
  id: checkInIdSchema,
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

/** GET /api/check-ins response. */
export const checkInListSchema = z.array(checkInSchema);

export type CheckInInput = z.infer<typeof checkInInputSchema>;
export type CheckInPatch = z.infer<typeof checkInPatchSchema>;
export type CheckIn = z.infer<typeof checkInSchema>;
