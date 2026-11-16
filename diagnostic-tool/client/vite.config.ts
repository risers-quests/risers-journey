import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built into the site's /diagnostic/ folder (risers-journey/diagnostic),
// which is committed and served as it is: run `npm run build:client` in
// diagnostic-tool/ after changing the UI, and commit the result.
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
