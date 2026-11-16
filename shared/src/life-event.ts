import { z } from "zod";
import { isoDateSchema } from "./common.ts";

const alcoholEventSchema = z.strictObject({
  type: z.literal("alcohol"),
  date: isoDateSchema,
  drinks: z.int().min(1).max(50),
});

const elevationEventSchema = z.strictObject({
  type: z.literal("elevation"),
  date: isoDateSchema,
  /** Current altitude in metres, entered manually. */
  altitudeMetres: z.int().min(-500).max(9000),
});

const illnessEventSchema = z
  .strictObject({
    type: z.literal("illness"),
    startDate: isoDateSchema,
    /** `null` while the illness is ongoing. */
    endDate: isoDateSchema.nullable(),
    severity: z.enum(["mild", "moderate", "severe"]),
    fever: z.boolean(),
    chestSymptoms: z.boolean(),
  })
  .refine((e) => e.endDate === null || e.endDate >= e.startDate, {
    message: "End date can't be before the start date",
    path: ["endDate"],
  });

/**
 * Body for creating or replacing a life event, discriminated on `type`.
 * Objects are strict, so fields from another event type (e.g. `fever` on an alcohol event) are rejected.
 */
export const lifeEventInputSchema = z.discriminatedUnion("type", [
  alcoholEventSchema,
  elevationEventSchema,
  illnessEventSchema,
]);

export type LifeEventInput = z.infer<typeof lifeEventInputSchema>;
export type LifeEventType = LifeEventInput["type"];
/** A stored life event, as returned by the API. */
export type LifeEvent = LifeEventInput & { id: string };
