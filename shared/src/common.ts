import { z } from "zod";

/** Calendar date as `YYYY-MM-DD`, with no time or timezone. */
export const isoDateSchema = z.iso.date();

/** `YYYY-MM-DD` strings sort like dates, so a plain comparison works. A missing end date passes. */
export const endsOnOrAfterStart = (dates: {
  startDate?: string;
  endDate?: string | null;
}) => !dates.startDate || !dates.endDate || dates.endDate >= dates.startDate;

/** Refinement options for `endsOnOrAfterStart`: puts the error on the end date field. */
export const endDateMessage = {
  message: "End date can't be before the start date",
  path: ["endDate"],
};

/** Refinement for patch schemas: an empty patch is rejected. */
export const isNotEmpty = (patch: object) => Object.keys(patch).length > 0;
