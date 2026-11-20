import { z } from "zod";
import { isoDateSchema } from "./common.ts";

/** Must match the `body_area` enum in the database. */
export const bodyAreaSchema = z.enum([
  "neck",
  "shoulder",
  "back",
  "hip",
  "knee",
  "ankle",
  "foot",
  "wrist",
  "other",
]);

/** `YYYY-MM-DD` strings sort like dates, so a plain comparison works. A missing end date passes. */
const endsOnOrAfterStart = (dates: {
  startDate?: string;
  endDate?: string | null;
}) => !dates.startDate || !dates.endDate || dates.endDate >= dates.startDate;

const endDateMessage = {
  message: "End date can't be before the start date",
  path: ["endDate"],
};

/** The injury fields a user sends. Matches the `injuries` table's columns and checks. */
const injuryFieldsSchema = z.strictObject({
  startDate: isoDateSchema,
  /** `null` while the injury is still active. */
  endDate: isoDateSchema.nullable(),
  bodyArea: bodyAreaSchema,
  /** 1 (barely noticeable) to 10 (can't train). */
  severity: z
    .int()
    .min(1, "Severity must be between 1 and 10")
    .max(10, "Severity must be between 1 and 10"),
});

/** Body for creating an injury. Unknown fields (including `userId`) are rejected. */
export const injuryInputSchema = injuryFieldsSchema.refine(
  endsOnOrAfterStart,
  endDateMessage,
);

/**
 * Body for PATCH /api/injuries/:id: any of the input fields, at least one (e.g. `{ endDate }` to
 * mark it healed). The date order is checked here when both dates are sent; the database's
 * `injuries_dates_check` catches a new date that clashes with the stored one.
 */
export const injuryPatchSchema = injuryFieldsSchema
  .partial()
  .refine((patch) => Object.keys(patch).length > 0, {
    message: "Send at least one field to update",
  })
  .refine(endsOnOrAfterStart, endDateMessage);

/** An injury's ID, e.g. the `:id` in PATCH /api/injuries/:id. */
export const injuryIdSchema = z.uuid();

/** A stored injury, as returned by the API. `userId` stays on the server. */
export const injurySchema = injuryFieldsSchema.extend({
  id: injuryIdSchema,
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

/** GET /api/injuries response. */
export const injuryListSchema = z.array(injurySchema);

export type BodyArea = z.infer<typeof bodyAreaSchema>;
export type InjuryInput = z.infer<typeof injuryInputSchema>;
export type InjuryPatch = z.infer<typeof injuryPatchSchema>;
export type Injury = z.infer<typeof injurySchema>;
