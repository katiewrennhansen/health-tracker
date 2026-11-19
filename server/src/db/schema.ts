import {
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  date,
  uuid,
  unique,
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
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check(
      "activities_duration_minutes_check",
      sql`${t.durationMinutes} BETWEEN 1 AND 1440`,
    ),
    check("activities_effort_check", sql`${t.effort} BETWEEN 1 AND 10`),
  ],
);

export const bodyArea = pgEnum("body_area", [
  "neck",
  "shoulder",
  "back",
  "hip",
  "knee",
  "ankle",
  "foot",
  "wrist",
  "other",
] as const);

export const injuries = pgTable(
  "injuries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }),
    bodyArea: bodyArea("body_area").notNull(),
    severity: integer("severity").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check("injuries_dates_check", sql`${t.endDate} >= ${t.startDate}`),
    check("injuries_severity_check", sql`${t.severity} BETWEEN 1 AND 10`),
  ],
);

export const illnessSeverity = pgEnum("illness_severity", [
  "mild",
  "moderate",
  "severe",
]);

export const illnessSymptom = pgEnum("illness_symptom", [
  "fever",
  "cough",
  "fatigue",
  "headache",
  "sore_throat",
  "shortness_of_breath",
  "other",
]);

export const illnesses = pgTable(
  "illnesses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }).notNull(),
    severity: illnessSeverity("severity").notNull(),
    symptoms: illnessSymptom("symptoms").array().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [check("illnesses_dates_check", sql`${t.endDate} >= ${t.startDate}`)],
);

export const travel = pgTable(
  "travel",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }),
    destination: text("destination").notNull(),
    altitudeM: integer("altitude_m"),
    timeZoneShift: integer("time_zone_shift"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [check("travel_dates_check", sql`${t.endDate} >= ${t.startDate}`)],
);

export const dailyCheckins = pgTable(
  "daily_checkins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    date: date("date", { mode: "string" }).notNull(), // stays 'YYYY-MM-DD'
    sleepMinutes: integer("sleep_minutes").notNull(),
    mood: integer("mood").notNull(),
    energy: integer("energy").notNull(),
    soreness: integer("soreness").notNull(),
    stress: integer("stress").notNull().default(3),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check(
      "daily_checkins_sleep_minutes_check",
      sql`${t.sleepMinutes} BETWEEN 0 AND 1440`,
    ),
    check("daily_checkins_mood_check", sql`${t.mood} BETWEEN 1 AND 5`),
    check("daily_checkins_energy_check", sql`${t.energy} BETWEEN 1 AND 5`),
    check("daily_checkins_soreness_check", sql`${t.soreness} BETWEEN 1 AND 5`),
    check("daily_checkins_stress_check", sql`${t.stress} BETWEEN 1 AND 5`),
    unique("daily_checkins_user_date_unique").on(t.userId, t.date),
  ],
);
