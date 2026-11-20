import { z } from "zod";
import {
  endDateMessage,
  endsOnOrAfterStart,
  isNotEmpty,
  isoDateSchema,
} from "./common.ts";

/** The travel fields a user sends. Matches the `travel` table's columns and checks. */
const travelFieldsSchema = z.strictObject({
  startDate: isoDateSchema,
  /** `null` while the trip is still going. */
  endDate: isoDateSchema.nullable(),
  destination: z
    .string()
    .trim()
    .min(1, "Enter a destination")
    .max(200, "Keep the destination under 200 characters"),
  /** Altitude at the destination in metres, if known. */
  altitudeM: z
    .int()
    .min(-500, "Altitude must be between -500 and 9,000 m")
    .max(9000, "Altitude must be between -500 and 9,000 m")
    .nullable(),
  /** Hours the clock moved at the destination, e.g. 5 for New York to London in winter (time zones span -12 to +14, so at most ±26). */
  timeZoneShift: z
    .int()
    .min(-26, "Time zone change must be between -26 and +26 hours")
    .max(26, "Time zone change must be between -26 and +26 hours")
    .nullable(),
  notes: z
    .string()
    .trim()
    .max(1000, "Keep notes under 1,000 characters")
    .nullable(),
});

/** Body for creating a trip. Unknown fields (including `userId`) are rejected. */
export const travelInputSchema = travelFieldsSchema.refine(
  endsOnOrAfterStart,
  endDateMessage,
);

/** Body for PATCH /api/travel/:id: any of the input fields, at least one. */
export const travelPatchSchema = travelFieldsSchema
  .partial()
  .refine(isNotEmpty, { message: "Send at least one field to update" })
  .refine(endsOnOrAfterStart, endDateMessage);

/** A trip's ID, e.g. the `:id` in PATCH /api/travel/:id. */
export const travelIdSchema = z.uuid();

/** A stored trip, as returned by the API. `userId` stays on the server. */
export const travelSchema = travelFieldsSchema.extend({
  id: travelIdSchema,
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

/** GET /api/travel response. */
export const travelListSchema = z.array(travelSchema);

export type TravelInput = z.infer<typeof travelInputSchema>;
export type TravelPatch = z.infer<typeof travelPatchSchema>;
export type Travel = z.infer<typeof travelSchema>;
