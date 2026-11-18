// This file sits outside tsconfig.json's `include`, so load Node's types (for `process`) here.
/// <reference types="node" />
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgres://postgres@localhost:5433/health_tracker",
  },
});
