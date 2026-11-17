import { getAuth } from "@clerk/express";
import type { Request, RequestHandler } from "express";

/** Rejects requests that have no signed-in user with a JSON 401. */
export const requireSignedIn: RequestHandler = (req, res, next) => {
  if (!getAuth(req).userId) {
    res.status(401).json({ error: "Sign in required" });
    return;
  }
  next();
};

/**
 * The signed-in user's Clerk ID, from the verified session. Use this (never the request body,
 * query or headers) to scope every database query. Only valid on routes behind `requireSignedIn`.
 */
export function signedInUserId(req: Request): string {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new Error("signedInUserId() used on a route without requireSignedIn");
  }
  return userId;
}
