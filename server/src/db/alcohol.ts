import { alcohol } from "./schema.ts";
import { desc, eq } from "drizzle-orm";
import { db } from "./client.ts";
import type { AlcoholInput } from "@health-tracker/shared";

const generateAlcoholSelect = (a: typeof alcohol) => ({
  id: a.id,
  date: a.date,
  drinks: a.drinks,
  createdAt: a.createdAt,
  updatedAt: a.updatedAt,
});

export function getAlcohol(userId: string) {
  return db
    .select(generateAlcoholSelect(alcohol))
    .from(alcohol)
    .where(eq(alcohol.userId, userId))
    .orderBy(desc(alcohol.date), desc(alcohol.createdAt));
}

export async function createAlcohol(userId: string, alcoholData: AlcoholInput) {
  const [row] = await db
    .insert(alcohol)
    .values({ userId, ...alcoholData })
    .returning(generateAlcoholSelect(alcohol));

  return row;
}
