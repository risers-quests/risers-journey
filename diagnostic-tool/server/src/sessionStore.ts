import { AsyncLocalStorage } from "node:async_hooks";
import { customAlphabet } from "nanoid";
import { SessionState, createInitialState } from "./engine/state.js";

// Sessions are saved through the Risers Journey progress Worker (the same
// /sync service every quest page uses), which keeps them in Cloudflare's
// free D1 database. One record per session:
//   group "diagnostic", kid <session id>, week "session"
//   state = { child_name, grade, created_at, status, state, responses }
// The Worker's URL and site key are the public ones in the site's pages;
// DIAGNOSTIC_STORE_URL / DIAGNOSTIC_STORE_KEY override them (e.g. to test).
const STORE_URL = (process.env.DIAGNOSTIC_STORE_URL || "https://risers-term2-digital-quests-progress.highergrade.workers.dev").replace(/\/$/, "");
const STORE_KEY = process.env.DIAGNOSTIC_STORE_KEY || "RsmI8VwuJZ-IIieNmVss5JyChP2nf7y8mVYU5ReJLYM";
const GROUP = "diagnostic";
const WEEK = "session";

// The Worker accepts lowercase letters, digits and hyphens only.
const newId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

export interface SessionRow {
  id: string;
  child_name: string;
  grade: string;
  created_at: string;
  status: string;
  state: string;
}

export interface ResponseRecord {
  id: string;
  session_id: string;
  seq: number;
  topic_id: string;
  item_id: string;
  cpa: string;
  bloom: string;
  subskill: string;
  choice_id: string;
  correct: number;
  hesitation_before_start_ms: number;
  solving_duration_ms: number;
  answer_changes: number;
  pulse: string | null;
  is_reframe: number;
  reframe_of_seq: number | null;
  is_procedural_check: number;
  outcome: string | null;
}

interface StoredSession {
  child_name: string;
  grade: string;
  created_at: string;
  status: string;
  state: SessionState;
  responses: ResponseRecord[];
}

// Within one request, a session is read from the store once and kept here
// (saves update it too), so answering a question costs one read, not three.
// Nothing is shared between requests: each starts with an empty cache.
const requestCache = new AsyncLocalStorage<Map<string, StoredSession>>();
export function withRequestCache(next: () => void): void {
  requestCache.run(new Map(), next);
}

function syncUrl(sessionId: string): string {
  return `${STORE_URL}/sync?group=${GROUP}&kid=${encodeURIComponent(sessionId)}&week=${WEEK}`;
}

async function load(sessionId: string): Promise<StoredSession> {
  const cached = requestCache.getStore()?.get(sessionId);
  if (cached) return cached;
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(sessionId)) throw new Error(`Session ${sessionId} not found`);
  const res = await fetch(syncUrl(sessionId), { headers: { "X-Site-Key": STORE_KEY } });
  if (!res.ok) throw new Error(`store read failed (${res.status})`);
  const body = (await res.json()) as { found: boolean; data?: { state: StoredSession } };
  if (!body.found || !body.data) throw new Error(`Session ${sessionId} not found`);
  requestCache.getStore()?.set(sessionId, body.data.state);
  return body.data.state;
}

async function save(sessionId: string, session: StoredSession): Promise<void> {
  const res = await fetch(`${STORE_URL}/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Site-Key": STORE_KEY },
    body: JSON.stringify({ group: GROUP, kid: sessionId, week: WEEK, state: session }),
  });
  if (!res.ok) throw new Error(`store write failed (${res.status}): ${await res.text()}`);
  requestCache.getStore()?.set(sessionId, session);
}

export async function createSession(childName: string, grade: string): Promise<{ id: string; state: SessionState }> {
  const id = newId();
  const state = createInitialState();
  await save(id, { child_name: childName, grade, created_at: new Date().toISOString(), status: "in_progress", state, responses: [] });
  return { id, state };
}

export async function getSessionRow(sessionId: string): Promise<SessionRow> {
  const s = await load(sessionId);
  return { id: sessionId, child_name: s.child_name, grade: s.grade, created_at: s.created_at, status: s.status, state: JSON.stringify(s.state) };
}

export async function getSessionState(sessionId: string): Promise<SessionState> {
  return (await load(sessionId)).state;
}

export async function saveSessionState(sessionId: string, state: SessionState, status?: string): Promise<void> {
  const s = await load(sessionId);
  await save(sessionId, { ...s, state, status: status ?? s.status });
}

export async function insertResponse(r: Omit<ResponseRecord, "id">): Promise<ResponseRecord> {
  const s = await load(r.session_id);
  const record = { id: newId(), ...r };
  await save(r.session_id, { ...s, responses: [...s.responses, record] });
  return record;
}

export async function getResponses(sessionId: string): Promise<ResponseRecord[]> {
  return [...(await load(sessionId)).responses].sort((a, b) => a.seq - b.seq);
}
