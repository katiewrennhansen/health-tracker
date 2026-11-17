import { createBrowserRouter } from "react-router";
import { App } from "@/App";
import { RequireSignedIn, RequireSignedOut } from "@/components/RouteGuards";
import { HistoryPage } from "@/pages/HistoryPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { TodayPage } from "@/pages/TodayPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <RequireSignedIn />,
        children: [
          { index: true, element: <TodayPage /> },
          { path: "history", element: <HistoryPage /> },
        ],
      },
      {
        element: <RequireSignedOut />,
        // The `/*` lets Clerk use sub-paths for its own steps, such as email verification.
        children: [
          { path: "sign-up/*", element: <SignUpPage /> },
          { path: "sign-in/*", element: <SignInPage /> },
        ],
      },
    ],
  },
]);
