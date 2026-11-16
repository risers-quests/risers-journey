import { app } from "./app.js";

// Local dev entry point. On Vercel, api/diagnostic.ts (repo root) imports
// `app` directly and never runs this file. Sessions are saved through the
// progress Worker (see sessionStore.ts), so no database setup is needed.
const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;
app.listen(PORT, () => {
  console.log(`LifeHub diagnostic server listening on http://localhost:${PORT}`);
});
