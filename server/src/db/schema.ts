import {
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  date,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const activityType = pgEnum("activity_type", [
  "run",
  "ride",
  "swim",
  "lift",
  "walk",
  "hike",
  "other",
]);

export const activities = pgTable(
  "activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    date: date("date", { mode: "string" }).notNull(), // stays 'YYYY-MM-DD'
    type: activityType("type").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    effort: integer("effort").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check(
      "activities_duration_minutes_check",
      sql`${t.durationMinutes} BETWEEN 1 AND 1440`,
    ),
    check("activities_effort_check", sql`${t.effort} BETWEEN 1 AND 10`),
  ],
);
