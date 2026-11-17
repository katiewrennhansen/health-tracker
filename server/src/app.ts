import { sql } from "drizzle-orm";
import express from "express";
import { db } from "./db/client.ts";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.ts";
import activitiesRouter from "./api/activities.ts";

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

  app.use("/api/activities", activitiesRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
