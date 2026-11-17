// A finished test's report, as saved in the child's report history
// (server: sessionStore.ts ReportEntry, report/history.ts).

export type TopicStatus = "secure" | "fragile" | "gap" | "notReached";

export interface ReportTopic {
  topicId: string;
  name: string;
  strand: string;
  status: TopicStatus;
  why: string;
  questions: number;
  /** Rows: concrete, pictorial, abstract. Columns: remember … evaluate. "cleared" | "struggled" | "". */
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

export interface CombinedTopic extends ReportTopic {
  date: string;
  before: { status: TopicStatus; date: string } | null;
  timesTested: number;
}

export interface Combined {
  tests: number;
  firstDate: string | null;
  lastDate: string | null;
  topics: CombinedTopic[];
  strengths: string[];
  nearly: string[];
  gaps: string[];
  waiting: string[];
  mistakes: { label: string; childTip: string; topic: string; count: number; sureCount: number }[];
}

export interface FullReport {
  childName: string;
  kid: string;
  report: ReportEntry;
  email: { child: boolean; staff: boolean; note?: string } | null;
}

export interface History {
  kid: string;
  childName: string;
  reports: ReportEntry[];
  combined: Combined;
}

export const LOOK: Record<TopicStatus, { icon: string; word: string; cls: string }> = {
  secure: { icon: "⭐", word: "Got it", cls: "st-secure" },
  fragile: { icon: "🌱", word: "Nearly there", cls: "st-fragile" },
  gap: { icon: "🔧", word: "Next to learn", cls: "st-gap" },
  notReached: { icon: "⏸", word: "Coming later", cls: "st-later" },
};

export const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
