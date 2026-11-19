import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  /** Local dev database from `npm run db:start` unless set. */
  DATABASE_URL: z
    .string()
    .startsWith("postgres")
    .default("postgres://postgres@localhost:5433/health_tracker"),
  CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  /** Comma-separated frontend origins whose Clerk tokens the API accepts. */
  CLIENT_ORIGINS: z
    .string()
    .default("http://localhost:5173")
    .transform((value) => value.split(",").map((origin) => origin.trim())),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // Names the problem variables but never prints their values (they include secrets).
  console.error(
    `Invalid environment variables (see server/.env.example):\n${z.prettifyError(parsed.error)}`,
  );
  process.exit(1);
}

/** Validated environment. Read settings from here, not from process.env. */
export const config = parsed.data;
