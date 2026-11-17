import { Insights } from "../engine/insights.js";
import { ResponseRecord, ReportEntry, ReportTopic } from "../sessionStore.js";

/**
 * A child's report history: one entry per finished test (built from the
 * same Insights as the emails, so they never disagree), and a combined
 * report across every test they have taken.
 */

export function reportEntry(id: string, grade: string, createdAt: string, ins: Insights, responses: ResponseRecord[]): ReportEntry {
  const scored = responses.filter((r) => !r.is_procedural_check);
  return {
    id,
    date: createdAt,
    grade,
    subject: ins.subject,
    minutes: ins.durationMinutes,
    questions: scored.length,
    right: scored.filter((r) => r.correct).length,
    sureRight: ins.overall.sureRight,
    sureTotal: ins.overall.sureRight + ins.overall.sureWrong,
    topics: ins.topics.map((t) => ({
      topicId: t.topicId,
      name: t.name,
      strand: t.strand,
      status: t.status,
      why: t.why,
      questions: t.questions,
      grid: t.grid,
      startAt: t.startAt,
      mistakes: t.mistakes.slice(0, 3).map((m) => ({ label: m.label, childTip: m.childTip, count: m.count, sureCount: m.sureCount })),
      blockedBy: t.blockedBy,
    })),
    next: ins.nextForChild,
    actions: ins.actions,
  };
}

export interface CombinedTopic extends ReportTopic {
  /** When this result was found (the latest test that really tested the topic). */
  date: string;
  /** The result the time before, if the topic was tested more than once. */
  before: { status: ReportTopic["status"]; date: string } | null;
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
  /** Mistakes still showing in topics not yet secure, most frequent first. */
  mistakes: { label: string; childTip: string; topic: string; count: number; sureCount: number }[];
}

/**
 * The combined report: for each topic, the latest test that really tested
 * it ("held back by an earlier topic" never overwrites a real result), and
 * how that compares with the time before.
 */
export function combine(reports: ReportEntry[]): Combined {
  const sorted = [...reports].sort((a, b) => b.date.localeCompare(a.date)); // newest first
  const byTopic = new Map<string, { entry: ReportEntry; topic: ReportTopic }[]>();
  for (const r of sorted) for (const t of r.topics) {
    const list = byTopic.get(t.topicId) ?? [];
    list.push({ entry: r, topic: t });
    byTopic.set(t.topicId, list);
  }
  const topics: CombinedTopic[] = [];
  for (const list of byTopic.values()) {
    const real = list.filter((x) => x.topic.status !== "notReached");
    const latest = real[0] ?? list[0];
    const prev = real[1] ?? null;
    topics.push({
      ...latest.topic,
      date: latest.entry.date,
      before: prev ? { status: prev.topic.status, date: prev.entry.date } : null,
      timesTested: real.length,
    });
  }
  // Book order where we know it: keep the order topics first appear in the oldest test.
  const order = new Map<string, number>();
  [...sorted].reverse().forEach((r) => r.topics.forEach((t) => !order.has(t.topicId) && order.set(t.topicId, order.size)));
  topics.sort((a, b) => (order.get(a.topicId) ?? 0) - (order.get(b.topicId) ?? 0));

  const names = (s: ReportTopic["status"]) => topics.filter((t) => t.status === s).map((t) => t.name);
  const mistakes = topics
    .filter((t) => t.status === "gap" || t.status === "fragile")
    .flatMap((t) => t.mistakes.map((m) => ({ ...m, topic: t.name })))
    .sort((a, b) => b.sureCount - a.sureCount || b.count - a.count)
    .slice(0, 6);
  return {
    tests: sorted.length,
    firstDate: sorted.length ? sorted[sorted.length - 1].date : null,
    lastDate: sorted.length ? sorted[0].date : null,
    topics,
    strengths: names("secure"),
    nearly: names("fragile"),
    gaps: names("gap"),
    waiting: names("notReached"),
    mistakes,
  };
}
