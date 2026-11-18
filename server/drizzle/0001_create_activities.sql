CREATE TYPE "public"."activity_type" AS ENUM('run', 'ride', 'swim', 'lift', 'walk', 'hike', 'other');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"type" "activity_type" NOT NULL,
	"duration_minutes" integer NOT NULL,
	"effort" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "activities_duration_minutes_check" CHECK ("activities"."duration_minutes" BETWEEN 1 AND 1440),
	CONSTRAINT "activities_effort_check" CHECK ("activities"."effort" BETWEEN 1 AND 10)
);
