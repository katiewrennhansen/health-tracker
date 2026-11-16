import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // `@/` points at client/src; keep in sync with `paths` in tsconfig.app.json.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Bundle shared from source so `npm run dev` picks up changes without rebuilding it.
      "@health-tracker/shared": fileURLToPath(new URL("../shared/src/index.ts", import.meta.url)),
    },
  },
});
