import { Router } from "express";
import { getActivities } from "../db/activities.ts";
import { signedInUserId } from "../middleware/auth.ts";

const router = Router();

// GET /api/activities: the signed-in user's activities, newest first.
router.get("/", async (req, res) => {
  const userId = signedInUserId(req);
  const activities = await getActivities(userId);
  res.json(activities);
});

export default router;
