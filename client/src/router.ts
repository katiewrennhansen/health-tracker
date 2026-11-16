import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { App } from "@/App";
import { HistoryPage } from "@/pages/HistoryPage";
import { TodayPage } from "@/pages/TodayPage";

const rootRoute = createRootRoute({ component: App });

const todayRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: TodayPage });
const historyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/history", component: HistoryPage });

// Each route is its own constant: declared inline in `addChildren`, TypeScript loses the path types.
const routeTree = rootRoute.addChildren([todayRoute, historyRoute]);

export const router = createRouter({ routeTree });

// Registers the route tree so `<Link to>` and `navigate()` only accept real paths.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
