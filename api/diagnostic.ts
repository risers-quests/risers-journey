// The LifeHub diagnostic tool's server (diagnostic-tool/server), run as one
// Vercel function. vercel.json sends every /api/diagnostic/... request here;
// its UI is the site's /diagnostic/ page.
import { app } from "../diagnostic-tool/server/src/app.js";

export default app;
