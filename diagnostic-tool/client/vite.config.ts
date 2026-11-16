import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built into the site's /diagnostic/ folder (risers-journey/diagnostic).
// Vercel builds it on every deploy (root package.json "build"), so it is
// not committed. To see it locally: npm run build at the repo root.
export default defineConfig({
  base: "/diagnostic/",
  build: { outDir: "../../diagnostic", emptyOutDir: true },
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api/diagnostic": {
        target: "http://localhost:4001",
        changeOrigin: true,
      },
    },
  },
});
