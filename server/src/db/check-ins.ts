import { dailyCheckins } from "./schema.ts";
import { and, desc, eq } from "drizzle-orm";
import { db } from "./client.ts";
import type { CheckInInput } from "@health-tracker/shared";

const generateCheckInSelect = (a: typeof dailyCheckins) => ({
  id: a.id,
  date: a.date,
  sleepMinutes: a.sleepMinutes,
  mood: a.mood,
  energy: a.energy,
  soreness: a.soreness,
  stress: a.stress,
  createdAt: a.createdAt,
  updatedAt: a.updatedAt,
});

export function getAllCheckIns(userId: string) {
  return db
    .select(generateCheckInSelect(dailyCheckins))
    .from(dailyCheckins)
    .where(eq(dailyCheckins.userId, userId))
    .orderBy(desc(dailyCheckins.date));
}

export async function createCheckIn(userId: string, checkInData: CheckInInput) {
  const [row] = await db
    .insert(dailyCheckins)
    .values({ userId, ...checkInData })
    .returning(generateCheckInSelect(dailyCheckins));

  return row;
}
