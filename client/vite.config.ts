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
    },
  },
  server: {
    // Forward API calls to the Express server, so the client can fetch "/api/..." with no CORS setup.
    proxy: { "/api": "http://localhost:3001" },
  },
});
