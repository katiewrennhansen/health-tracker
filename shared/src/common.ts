import { z } from "zod";

/** Calendar date as `YYYY-MM-DD`, with no time or timezone. */
export const isoDateSchema = z.iso.date();
