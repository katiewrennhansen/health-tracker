import { clerkMiddleware } from "@clerk/express";
import { sql } from "drizzle-orm";
import express from "express";
import activitiesRouter from "./api/activities.ts";
import alcoholRouter from "./api/alcohol.ts";
import checkInsRouter from "./api/check-ins.ts";
import illnessesRouter from "./api/illnesses.ts";
import injuriesRouter from "./api/injuries.ts";
import travelRouter from "./api/travel.ts";
import { db } from "./db/client.ts";
import { requireSignedIn } from "./middleware/auth.ts";
import { apiRateLimit } from "./middleware/rate-limit.ts";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.ts";
import { config } from "./config.ts";

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
    clerkMiddleware({ authorizedParties: config.CLIENT_ORIGINS }),
    requireSignedIn,
    apiRateLimit,
  );
  app.use("/api/activities", activitiesRouter);
  app.use("/api/alcohol", alcoholRouter);
  app.use("/api/check-ins", checkInsRouter);
  app.use("/api/illnesses", illnessesRouter);
  app.use("/api/injuries", injuriesRouter);
  app.use("/api/travel", travelRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
