import { clerkMiddleware } from "@clerk/express";
import { sql } from "drizzle-orm";
import express from "express";
import activitiesRouter from "./api/activities.ts";
import { db } from "./db/client.ts";
import { requireSignedIn } from "./middleware/auth.ts";
import { apiRateLimit } from "./middleware/rate-limit.ts";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.ts";
import { clientOrigins } from "./config.ts";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", async (_req, res) => {
    try {
      await db.execute(sql`select 1`);
      res.json({ status: "ok", database: "ok" });
    } catch (err) {
      console.error("Health check: database unreachable", err);
      res.status(503).json({ status: "error", database: "unreachable" });
    }
  });

  // Everything under /api needs a signed-in user and is rate limited per user; /health stays public.
  // clerkMiddleware() reads CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY from server/.env.
  app.use(
    "/api",
    clerkMiddleware({ authorizedParties: clientOrigins }),
    requireSignedIn,
    apiRateLimit,
  );
  app.use("/api/activities", activitiesRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
