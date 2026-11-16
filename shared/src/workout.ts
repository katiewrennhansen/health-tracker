import { z } from "zod";
import { isoDateSchema } from "./common.ts";

export const workoutTypeSchema = z.enum(["run", "ride", "swim", "lift", "walk", "hike", "other"]);

/** Body for creating or replacing a workout. Unknown fields are rejected. */
export const workoutInputSchema = z.strictObject({
  date: isoDateSchema,
  type: workoutTypeSchema,
  durationMinutes: z.int().min(1).max(1440),
  /** Perceived effort, 1 (very easy) to 10 (maximal). */
  effort: z.int().min(1).max(10),
});

export type WorkoutType = z.infer<typeof workoutTypeSchema>;
export type WorkoutInput = z.infer<typeof workoutInputSchema>;
/** A stored workout, as returned by the API. */
export type Workout = WorkoutInput & { id: string };
