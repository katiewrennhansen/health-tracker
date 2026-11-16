import { z } from "zod";
import { isoDateSchema } from "./common.ts";

export const readinessSchema = z.enum(["rest", "easy", "moderate", "go"]);

/** Today's training advice: validated on the server before it reaches the client. */
export const adviceSchema = z.strictObject({
  date: isoDateSchema,
  readiness: readinessSchema,
  suggestedSession: z.string().trim().min(1).max(200),
  reasons: z.array(z.string().trim().min(1).max(200)).min(1).max(5),
});

export type Readiness = z.infer<typeof readinessSchema>;
export type Advice = z.infer<typeof adviceSchema>;
