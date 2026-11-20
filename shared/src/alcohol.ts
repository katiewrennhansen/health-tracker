import { z } from "zod";
import { isNotEmpty, isoDateSchema } from "./common.ts";

/** The alcohol fields a user sends: how many drinks on one day. There's no database table for this yet. */
export const alcoholInputSchema = z.strictObject({
  date: isoDateSchema,
  drinks: z
    .int()
    .min(1, "Enter at least 1 drink")
    .max(50, "That's more than 50 drinks; check the number"),
});

/** Body for PATCH /api/alcohol/:id: any of the input fields, at least one. */
export const alcoholPatchSchema = alcoholInputSchema
  .partial()
  .refine(isNotEmpty, { message: "Send at least one field to update" });

/** An alcohol entry's ID, e.g. the `:id` in PATCH /api/alcohol/:id. */
export const alcoholIdSchema = z.uuid();

/** A stored alcohol entry, as returned by the API. `userId` stays on the server. */
export const alcoholSchema = alcoholInputSchema.extend({
  id: alcoholIdSchema,
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

/** GET /api/alcohol response. */
export const alcoholListSchema = z.array(alcoholSchema);

export type AlcoholInput = z.infer<typeof alcoholInputSchema>;
export type AlcoholPatch = z.infer<typeof alcoholPatchSchema>;
export type Alcohol = z.infer<typeof alcoholSchema>;
