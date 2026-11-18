/** Local dev database from `npm run db:start`. Deployed environments set DATABASE_URL. */
export const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres@localhost:5433/health_tracker";

/** Frontend origins whose Clerk session tokens the API accepts. Defaults to the Vite dev server. */
export const clientOrigins = (
  process.env.CLIENT_ORIGINS ?? "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());
