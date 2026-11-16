import express from "express";
import cors from "cors";
import { router } from "./routes.js";
import { withRequestCache } from "./sessionStore.js";

export const app = express();
app.use(cors());
app.use(express.json());
app.use((_req, _res, next) => withRequestCache(next));

app.use("/api/diagnostic", router);
app.get("/api/diagnostic/health", (_req, res) => res.json({ ok: true }));

// On the Risers Journey site, api/diagnostic.ts (repo root) serves this app
// for every /api/diagnostic/... request (see vercel.json).
export default app;
