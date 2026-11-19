import { createBrowserRouter } from "react-router";
import { App } from "@/App";
import {
  RequireSignedIn,
  RequireSignedOut,
} from "@/components/layout/RouteGuards";
import { CheckIn } from "@/features/CheckIns/CheckIn";
import { History } from "@/features/History/History";
import { LogPage } from "@/pages/LogPage";
import { SignIn } from "@/features/Authentication/SignIn";
import { SignUp } from "@/features/Authentication/SignUp";
import { Today } from "@/features/Today/Today";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <RequireSignedIn />,
        children: [
          { index: true, element: <Today /> },
          { path: "check-in", element: <CheckIn /> },
          { path: "log", element: <LogPage /> },
          { path: "history", element: <History /> },
        ],
      },
      {
        element: <RequireSignedOut />,
        // The `/*` lets Clerk use sub-paths for its own steps, such as email verification.
        children: [
          { path: "sign-up/*", element: <SignUp /> },
          { path: "sign-in/*", element: <SignIn /> },
        ],
      },
    ],
  },
]);
