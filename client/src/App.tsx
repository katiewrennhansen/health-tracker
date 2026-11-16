import { APP_NAME } from "@health-tracker/shared";

export function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold">{APP_NAME}</h1>
    </main>
  );
}
