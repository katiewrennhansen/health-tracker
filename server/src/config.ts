/** Local dev database from `npm run db:start`. Deployed environments set DATABASE_URL. */
export const databaseUrl = process.env.DATABASE_URL ?? "postgres://postgres@localhost:5433/health_tracker";
