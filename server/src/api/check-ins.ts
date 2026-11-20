import { Router } from "express";
import { signedInUserId } from "../middleware/auth.ts";
import { getAllCheckIns, createCheckIn } from "../db/check-ins.ts";
import { checkInInputSchema } from "@health-tracker/shared";

const checkInsRouter = Router();

checkInsRouter.get("/", async (req, res) => {
  const userId = signedInUserId(req);
  const checkIns = await getAllCheckIns(userId);
  res.json(checkIns);
});

checkInsRouter.post("/", async (req, res) => {
  const userId = signedInUserId(req);
  const parsed = checkInInputSchema.safeParse(req.body);

  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid checkin", issues: parsed.error.issues });
    return;
  }

  const checkIn = await createCheckIn(userId, parsed.data);
  res.status(201).json(checkIn);
});

export default checkInsRouter;
