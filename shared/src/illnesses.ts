import { z } from "zod";
import {
  endDateMessage,
  endsOnOrAfterStart,
  isNotEmpty,
  isoDateSchema,
} from "./common.ts";

/** Must match the `illness_severity` enum in the database. */
export const illnessSeveritySchema = z.enum(["mild", "moderate", "severe"]);

/** Must match the `illness_symptom` enum in the database. */
export const illnessSymptomSchema = z.enum([
  "fever",
  "cough",
  "fatigue",
  "headache",
  "sore_throat",
  "shortness_of_breath",
  "other",
]);

/** The illness fields a user sends. Matches the `illnesses` table's columns and checks. */
const illnessFieldsSchema = z.strictObject({
  startDate: isoDateSchema,
  /** `null` while the illness is ongoing. */
  endDate: isoDateSchema.nullable(),
  severity: illnessSeveritySchema,
  symptoms: z
    .array(illnessSymptomSchema)
    .min(1, "Pick at least one symptom")
    .refine((symptoms) => new Set(symptoms).size === symptoms.length, {
      message: "Each symptom can only be picked once",
    }),
});

/** Body for creating an illness. Unknown fields (including `userId`) are rejected. */
export const illnessInputSchema = illnessFieldsSchema.refine(
  endsOnOrAfterStart,
  endDateMessage,
);

/** Body for PATCH /api/illnesses/:id: any of the input fields, at least one. */
export const illnessPatchSchema = illnessFieldsSchema
  .partial()
  .refine(isNotEmpty, { message: "Send at least one field to update" })
  .refine(endsOnOrAfterStart, endDateMessage);

/** An illness's ID, e.g. the `:id` in PATCH /api/illnesses/:id. */
export const illnessIdSchema = z.uuid();

/** A stored illness, as returned by the API. `userId` stays on the server. */
export const illnessSchema = illnessFieldsSchema.extend({
  id: illnessIdSchema,
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

/** GET /api/illnesses response. */
export const illnessListSchema = z.array(illnessSchema);

export type IllnessSeverity = z.infer<typeof illnessSeveritySchema>;
export type IllnessSymptom = z.infer<typeof illnessSymptomSchema>;
export type IllnessInput = z.infer<typeof illnessInputSchema>;
export type IllnessPatch = z.infer<typeof illnessPatchSchema>;
export type Illness = z.infer<typeof illnessSchema>;
