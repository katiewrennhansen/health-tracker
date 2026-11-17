import { useAuth } from "@clerk/react";
import { Navigate, Outlet } from "react-router";

/** Renders child routes for signed-in users; sends everyone else to sign up. */
export function RequireSignedIn() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null; // nothing until Clerk knows; no loading page
  return isSignedIn ? <Outlet /> : <Navigate to="/sign-up" replace />;
}

/** Renders child routes (sign up / sign in) for signed-out users; sends signed-in users to Today. */
export function RequireSignedOut() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  return isSignedIn ? <Navigate to="/" replace /> : <Outlet />;
}
