import { Router } from "express";
import { signedInUserId } from "../middleware/auth.ts";
import { getTravel, createTravel } from "../db/travel.ts";
import { travelInputSchema } from "@health-tracker/shared";

const travelRouter = Router();

// GET /api/travel: the signed-in user's trips, most recent first.
travelRouter.get("/", async (req, res) => {
  const userId = signedInUserId(req);
  const trips = await getTravel(userId);
  res.json(trips);
});

travelRouter.post("/", async (req, res) => {
  const userId = signedInUserId(req);
  const parsed = travelInputSchema.safeParse(req.body);

  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid trip", issues: parsed.error.issues });
    return;
  }

  const trip = await createTravel(userId, parsed.data);
  res.status(201).json(trip);
});

export default travelRouter;
