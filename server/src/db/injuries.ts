import { db } from "./client.ts";
import { desc, eq } from "drizzle-orm";
import { injuries } from "./schema.ts";
import type { InjuryInput } from "@health-tracker/shared";

const generateInjurySelect = (i: typeof injuries) => ({
  id: i.id,
  startDate: i.startDate,
  endDate: i.endDate,
  bodyArea: i.bodyArea,
  severity: i.severity,
  createdAt: i.createdAt,
  updatedAt: i.updatedAt,
});

export function getAllInjuries(userId: string) {
  return db
    .select(generateInjurySelect(injuries))
    .from(injuries)
    .where(eq(injuries.userId, userId))
    .orderBy(desc(injuries.startDate));
}

export async function createInjury(userId: string, injuryData: InjuryInput) {
  const [row] = await db
    .insert(injuries)
    .values({
      userId,
      ...injuryData,
    })
    .returning(generateInjurySelect(injuries));

  return row;
}
