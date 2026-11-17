import { Router, type Request, type Response } from "express";

const router = Router();

// GET endpoint (/api/activities)
router.get("/", (req: Request, res: Response) => {
  console.log("GET /activities called");
  res.json({ message: "Hello from a TypeScript file!" });
});

// Optional: Define an interface for expected POST data
// interface EchoBody {
//   name: string;
// }

// POST endpoint (/api/echo)
// router.post("/echo", (req: Request<{}, {}, EchoBody>, res: Response) => {
//   const userData = req.body;
//   res.status(201).json({ received: userData });
// });

export default router;
