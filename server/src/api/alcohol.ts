import { Router } from "express";
import { signedInUserId } from "../middleware/auth.ts";
import { getAlcohol, createAlcohol } from "../db/alcohol.ts";
import { alcoholInputSchema } from "@health-tracker/shared";

const alcoholRouter = Router();

// GET /api/alcohol: the signed-in user's alcohol entries, newest first.
alcoholRouter.get("/", async (req, res) => {
  const userId = signedInUserId(req);
  const entries = await getAlcohol(userId);
  res.json(entries);
});

alcoholRouter.post("/", async (req, res) => {
  const userId = signedInUserId(req);
  const parsed = alcoholInputSchema.safeParse(req.body);

  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid alcohol entry", issues: parsed.error.issues });
    return;
  }

  const entry = await createAlcohol(userId, parsed.data);
  res.status(201).json(entry);
});

export default alcoholRouter;
