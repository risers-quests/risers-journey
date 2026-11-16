import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built into the site's /diagnostic/ folder (risers-journey/diagnostic).
// The built page is committed (Vercel serves it as it is): after any change
// in client/, run `npm run build:diagnostic` at the repo root and commit
// diagnostic/ in the same commit. See CLAUDE.md.
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
