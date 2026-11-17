import { clerkMiddleware } from "@clerk/express";
import { sql } from "drizzle-orm";
import express from "express";
import activitiesRouter from "./api/activities.ts";
import { db } from "./db/client.ts";
import { requireSignedIn } from "./middleware/auth.ts";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.ts";

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

  // Everything under /api needs a signed-in user; /health stays public.
  // clerkMiddleware() reads CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY from server/.env.
  app.use("/api", clerkMiddleware(), requireSignedIn);
  app.use("/api/activities", activitiesRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
