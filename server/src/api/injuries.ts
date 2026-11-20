import { Router } from "express";
import { signedInUserId } from "../middleware/auth.ts";
import { getAllInjuries, createInjury } from "../db/injuries.ts";
import { injuryInputSchema } from "@health-tracker/shared";

export const injuriesRouter = Router();

injuriesRouter.get("/", async (req, res) => {
  const userId = signedInUserId(req);
  const injuries = await getAllInjuries(userId);
  res.json(injuries);
});

injuriesRouter.post("/", async (req, res) => {
  const userId = signedInUserId(req);
  const parsed = injuryInputSchema.safeParse(req.body);

  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid injury", issues: parsed.error.issues });
    return;
  }

  const injury = await createInjury(userId, parsed.data);
  res.status(201).json(injury);
});

export default injuriesRouter;
