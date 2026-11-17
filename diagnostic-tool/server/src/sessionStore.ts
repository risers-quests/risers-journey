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
  /** Generated questions: the mistake a wrong answer stands for (see itemBank/generate). */
  misconception?: string | null;
  /** What the child did in a hands-on activity (concrete questions). */
  interaction?: unknown;
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

export async function createSession(childName: string, grade: string, strands?: string[], topics?: string[]): Promise<{ id: string; state: SessionState }> {
  const id = newId();
  const state = createInitialState(strands, grade === "Grade 4" ? 4 : 5, topics);
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

// ---- What each child has already seen, across all their tests ----
// One record per child (group "diagnostic-history", kid = first name):
// { topics: { <topicId>: [question signatures] } }. Used so a child never
// gets the same numbers in a topic again.
/** A child's key: their first name, lower case (the same key the site's Riser sign-in uses, e.g. "eva"). */
export function childKey(child: string): string {
  return child.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9-]/g, "");
}

function historyUrl(child: string): string | null {
  const kid = childKey(child);
  return kid ? `${STORE_URL}/sync?group=diagnostic-history&kid=${kid}&week=seen` : null;
}

export async function loadHistory(child: string): Promise<Record<string, string[]>> {
  const url = historyUrl(child);
  if (!url) return {};
  try {
    const res = await fetch(url, { headers: { "X-Site-Key": STORE_KEY } });
    const body = (await res.json()) as { found: boolean; data?: { state: { topics: Record<string, string[]> } } };
    return body.found && body.data ? body.data.state.topics ?? {} : {};
  } catch {
    return {};
  }
}

export async function saveHistory(child: string, topics: Record<string, string[]>): Promise<void> {
  const kid = childKey(child);
  if (!kid) return;
  // Keep the most recent 600 per topic (well under the store's record size).
  const trimmed = Object.fromEntries(Object.entries(topics).map(([t, list]) => [t, [...new Set(list)].slice(-600)]));
  await fetch(`${STORE_URL}/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Site-Key": STORE_KEY },
    body: JSON.stringify({ group: "diagnostic-history", kid, week: "seen", state: { topics: trimmed } }),
  }).catch(() => undefined);
}

// ---- Each child's finished tests (their report history) ----
// One record per child (group "diagnostic-history", kid = first name,
// week "reports"): { childName, reports: ReportEntry[] }, newest first.
// Written when a test finishes; the dashboard's report history and the
// combined report are read from it.
export interface ReportTopic {
  topicId: string;
  name: string;
  strand: string;
  status: "secure" | "fragile" | "gap" | "notReached";
  why: string;
  questions: number;
  /** CPA rows (concrete, pictorial, abstract) x Bloom columns: "cleared" | "struggled" | "". */
  grid: string[][];
  startAt: string | null;
  mistakes: { label: string; childTip: string; count: number; sureCount: number }[];
  blockedBy: string[];
}
export interface ReportEntry {
  id: string;
  date: string;
  grade: string;
  minutes: number;
  questions: number;
  right: number;
  sureRight: number;
  sureTotal: number;
  topics: ReportTopic[];
  next: { topic: string; tip: string; atHome: string } | null;
  actions: { topic: string; what: string; how: string }[];
}
export interface ReportHistory {
  childName: string;
  reports: ReportEntry[];
}

function reportsUrl(kid: string): string {
  return `${STORE_URL}/sync?group=diagnostic-history&kid=${kid}&week=reports`;
}

export async function loadReports(kid: string): Promise<ReportHistory> {
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(kid)) return { childName: "", reports: [] };
  const res = await fetch(reportsUrl(kid), { headers: { "X-Site-Key": STORE_KEY } });
  if (!res.ok) throw new Error(`store read failed (${res.status})`);
  const body = (await res.json()) as { found: boolean; data?: { state: ReportHistory } };
  return body.found && body.data ? { childName: body.data.state.childName ?? "", reports: body.data.state.reports ?? [] } : { childName: "", reports: [] };
}

/** Adds (or replaces) one test's report in the child's history. */
export async function saveReport(childName: string, entry: ReportEntry): Promise<void> {
  const kid = childKey(childName);
  if (!kid) return;
  const h = await loadReports(kid);
  const reports = [entry, ...h.reports.filter((r) => r.id !== entry.id)]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 60);
  const res = await fetch(`${STORE_URL}/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Site-Key": STORE_KEY },
    body: JSON.stringify({ group: "diagnostic-history", kid, week: "reports", state: { childName: childName.trim(), reports } }),
  });
  if (!res.ok) throw new Error(`store write failed (${res.status})`);
}
