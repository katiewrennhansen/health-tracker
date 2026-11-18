import { rateLimit } from "express-rate-limit";
import { signedInUserId } from "./auth.ts";

/**
 * Caps each signed-in user at 300 API requests per 15 minutes (a normal session uses a small
 * fraction of that). Mount after `requireSignedIn`: it counts per Clerk user ID rather than per IP,
 * so users sharing a network don't share a limit, and a user can't dodge it by switching networks.
 *
 * Counts live in this process's memory, so they reset on restart and aren't shared between server
 * instances. That's fine for one server; with several, give it a shared store (e.g. Redis).
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  keyGenerator: (req) => signedInUserId(req),
  // Sends the standard `RateLimit` and `RateLimit-Policy` headers, so clients can see how many requests remain.
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait a few minutes and try again.",
  },
});
