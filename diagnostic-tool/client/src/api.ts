import { AnswerResponse, AnxietyQuestion, NextQuestionResponse, ReportData } from "./types";

// The UI is served by the Risers Journey site at /diagnostic/ and talks to
// the server function at /api/diagnostic on the same site (api/diagnostic.ts
// at the repo root). In local dev, Vite's proxy (vite.config.ts) forwards
// those calls to the local server.
const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/diagnostic";

async function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function createSession(childName: string, grade: string): Promise<string> {
  const res = await fetch(`${BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ childName, grade }),
  });
  const data = await asJson<{ sessionId: string }>(res);
  return data.sessionId;
}

export async function getNextQuestion(sessionId: string): Promise<NextQuestionResponse> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/next-question`);
  return asJson<NextQuestionResponse>(res);
}

export interface AnswerPayload {
  choiceId: string;
  hesitationBeforeStartMs: number;
  solvingDurationMs: number;
  answerChanges: number;
  pulse: string | null;
}

export async function submitAnswer(sessionId: string, payload: AnswerPayload): Promise<AnswerResponse> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return asJson<AnswerResponse>(res);
}

export async function getReport(sessionId: string): Promise<ReportData> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/report`);
  return asJson<ReportData>(res);
}

export async function getAnxietyQuestions(sessionId: string): Promise<AnxietyQuestion[]> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/anxiety-questions`);
  const data = await asJson<{ questions: AnxietyQuestion[] }>(res);
  return data.questions;
}

export async function submitAnxietyAnswers(
  sessionId: string,
  responses: { questionId: string; score: number }[]
): Promise<void> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/anxiety-answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ responses }),
  });
  await asJson<{ ok: boolean }>(res);
}
