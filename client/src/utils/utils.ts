/** Today in the user's time zone, as YYYY-MM-DD (the "en-CA" locale formats dates that way). */
export const today = (): string => {
  return new Date().toLocaleDateString("en-CA");
};

export const hours = (minutes: number) => `${(minutes / 60).toFixed(1)} h`;
