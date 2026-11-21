import { travel } from "./schema.ts";
import { desc, eq } from "drizzle-orm";
import { db } from "./client.ts";
import type { TravelInput } from "@health-tracker/shared";

const generateTravelSelect = (t: typeof travel) => ({
  id: t.id,
  startDate: t.startDate,
  endDate: t.endDate,
  destination: t.destination,
  altitudeM: t.altitudeM,
  timeZoneShift: t.timeZoneShift,
  notes: t.notes,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
});

export function getTravel(userId: string) {
  return db
    .select(generateTravelSelect(travel))
    .from(travel)
    .where(eq(travel.userId, userId))
    .orderBy(desc(travel.startDate));
}

export async function createTravel(userId: string, travelData: TravelInput) {
  const [row] = await db
    .insert(travel)
    .values({ userId, ...travelData })
    .returning(generateTravelSelect(travel));

  return row;
}
