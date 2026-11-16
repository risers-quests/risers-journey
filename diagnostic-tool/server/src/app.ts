import express from "express";
import cors from "cors";
import { router } from "./routes.js";
import { ensureMigrated } from "./db.js";

export const app = express();
app.use(cors());
app.use(express.json());

// Runs the (idempotent, memoized) schema migration before the first request
// on a given instance — necessary because a serverless cold start has no
// separate "startup" phase to run it in ahead of time.
app.use(async (_req, res, next) => {
  try {
    await ensureMigrated();
    next();
  } catch (err) {
    console.error("Migration failed", err);
    res.status(500).json({ error: "database unavailable" });
  }
});

app.use("/api/diagnostic", router);
app.get("/api/diagnostic/health", (_req, res) => res.json({ ok: true }));

// On the Risers Journey site, api/diagnostic.ts (repo root) serves this app
// for every /api/diagnostic/... request (see vercel.json).
export default app;
