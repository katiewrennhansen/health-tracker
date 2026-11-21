import { illnesses } from "./schema.ts";
import { desc, eq } from "drizzle-orm";
import { db } from "./client.ts";
import type { IllnessInput } from "@health-tracker/shared";

const generateIllnessSelect = (i: typeof illnesses) => ({
  id: i.id,
  startDate: i.startDate,
  endDate: i.endDate,
  severity: i.severity,
  symptoms: i.symptoms,
  createdAt: i.createdAt,
  updatedAt: i.updatedAt,
});

export function getIllnesses(userId: string) {
  return db
    .select(generateIllnessSelect(illnesses))
    .from(illnesses)
    .where(eq(illnesses.userId, userId))
    .orderBy(desc(illnesses.startDate));
}

export async function createIllness(userId: string, illnessData: IllnessInput) {
  const [row] = await db
    .insert(illnesses)
    .values({ userId, ...illnessData })
    .returning(generateIllnessSelect(illnesses));

  return row;
}
