import { Outlet } from "react-router";
import { Navbar } from "@/components/Navbar";

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-separator">
        <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 py-3">
          <p className="font-semibold">Health Tracker</p>
          <Navbar />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
