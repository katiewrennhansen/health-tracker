import { Router } from "express";
import {
  getActivities,
  createActivity,
  deleteActivity,
} from "../db/activities.ts";
import { signedInUserId } from "../middleware/auth.ts";
import { activityIdSchema, activityInputSchema } from "@health-tracker/shared";

const router = Router();

// GET /api/activities: the signed-in user's activities, newest first.
router.get("/", async (req, res) => {
  const activities = await getActivities(signedInUserId(req));
  res.json(activities);
});

router.post("/", async (req, res) => {
  const parsed = activityInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid activity", issues: parsed.error.issues });
    return;
  }
  const activity = await createActivity(signedInUserId(req), parsed.data);
  res.status(201).json(activity);
});

router.delete("/:id", async (req, res) => {
  const id = activityIdSchema.safeParse(req.params.id);
  if (!id.success) {
    res.status(400).json({ error: "Invalid ID", issues: id.error.issues });
    return;
  }
  // Same 404 for unknown IDs and other users' activities, so IDs can't be probed.
  const deleted = await deleteActivity(signedInUserId(req), id.data);
  if (!deleted) {
    res.status(404).json({ error: "Activity not found" });
    return;
  }
  res.status(204).end();
});

export default router;
