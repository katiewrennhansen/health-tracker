import { defineConfig } from "drizzle-kit";
import { databaseUrl } from "./src/config.ts";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: databaseUrl },
});
