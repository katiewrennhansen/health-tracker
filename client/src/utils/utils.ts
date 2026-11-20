import { format, parseISO } from "date-fns";

/** Today in the user's time zone, as YYYY-MM-DD (the "en-CA" locale formats dates that way). */
export const today = (): string => {
  return new Date().toLocaleDateString("en-CA");
};

export const hours = (minutes: number) => `${(minutes / 60).toFixed(1)} h`;

/** A stored `YYYY-MM-DD` date as shown in tables, e.g. "Nov 18 2026". */
export const formatDate = (isoDate: string) =>
  format(parseISO(isoDate), "MMM dd yyyy");
