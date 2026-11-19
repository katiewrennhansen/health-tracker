import { Show } from "@clerk/react";
import { RouterProvider } from "@heroui/react";
import { Outlet, useHref, useNavigate } from "react-router";
import { Sidebar } from "@/components/layout/Sidebar";

export function App() {
  const navigate = useNavigate();

  return (
    // Lets HeroUI links (`<Link href="/history">`) navigate with React Router instead of reloading the page.
    <RouterProvider navigate={navigate} useHref={useHref}>
      <div className="flex min-h-screen bg-background text-foreground">
        <Show when="signed-in">
          <Sidebar />
        </Show>
        <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </RouterProvider>
  );
}
