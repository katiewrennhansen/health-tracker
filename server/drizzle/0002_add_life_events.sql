CREATE TYPE "public"."body_area" AS ENUM('neck', 'shoulder', 'back', 'hip', 'knee', 'ankle', 'foot', 'wrist', 'other');--> statement-breakpoint
CREATE TYPE "public"."illness_severity" AS ENUM('mild', 'moderate', 'severe');--> statement-breakpoint
CREATE TYPE "public"."illness_symptom" AS ENUM('fever', 'cough', 'fatigue', 'headache', 'sore_throat', 'shortness_of_breath', 'other');--> statement-breakpoint
CREATE TABLE "daily_checkins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"sleep_minutes" integer NOT NULL,
	"mood" integer NOT NULL,
	"energy" integer NOT NULL,
	"soreness" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_checkins_user_date_unique" UNIQUE("user_id","date"),
	CONSTRAINT "daily_checkins_sleep_minutes_check" CHECK ("daily_checkins"."sleep_minutes" BETWEEN 0 AND 1440),
	CONSTRAINT "daily_checkins_mood_check" CHECK ("daily_checkins"."mood" BETWEEN 1 AND 5),
	CONSTRAINT "daily_checkins_energy_check" CHECK ("daily_checkins"."energy" BETWEEN 1 AND 5),
	CONSTRAINT "daily_checkins_soreness_check" CHECK ("daily_checkins"."soreness" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "illnesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"severity" "illness_severity" NOT NULL,
	"symptoms" "illness_symptom"[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "illnesses_dates_check" CHECK ("illnesses"."end_date" >= "illnesses"."start_date")
);
--> statement-breakpoint
CREATE TABLE "injuries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"body_area" "body_area" NOT NULL,
	"severity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "injuries_dates_check" CHECK ("injuries"."end_date" >= "injuries"."start_date"),
	CONSTRAINT "injuries_severity_check" CHECK ("injuries"."severity" BETWEEN 1 AND 10)
);
--> statement-breakpoint
CREATE TABLE "travel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"destination" text NOT NULL,
	"altitude_m" integer,
	"time_zone_shift" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "travel_dates_check" CHECK ("travel"."end_date" >= "travel"."start_date")
);
--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;