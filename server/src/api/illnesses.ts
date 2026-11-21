import { Router } from "express";
import { signedInUserId } from "../middleware/auth.ts";
import { getIllnesses, createIllness } from "../db/illnesses.ts";
import { illnessInputSchema } from "@health-tracker/shared";

const illnessesRouter = Router();

// GET /api/illnesses: the signed-in user's illnesses, most recent first.
illnessesRouter.get("/", async (req, res) => {
  const userId = signedInUserId(req);
  const illnesses = await getIllnesses(userId);
  res.json(illnesses);
});

illnessesRouter.post("/", async (req, res) => {
  const userId = signedInUserId(req);
  const parsed = illnessInputSchema.safeParse(req.body);

  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid illness", issues: parsed.error.issues });
    return;
  }

  const illness = await createIllness(userId, parsed.data);
  res.status(201).json(illness);
});

export default illnessesRouter;
