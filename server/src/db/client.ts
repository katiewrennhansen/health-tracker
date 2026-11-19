import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "../config.ts";
import * as schema from "./schema.ts";

const pool = new Pool({ connectionString: config.DATABASE_URL });

// An idle connection that drops (e.g. Postgres restarts) emits 'error' on the pool.
// Without a listener Node treats it as fatal and the whole API crashes; with one,
// the pool discards that connection and opens a new one on the next query.
pool.on("error", (err) => {
  console.error("Postgres idle connection error", err.message);
});

export const db = drizzle(pool, { schema });
