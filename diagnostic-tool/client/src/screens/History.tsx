import { useEffect, useState } from "react";
import { getHistory } from "../api";
import { History as HistoryData, LOOK, TopicStatus, fmtDate } from "../reportTypes";
import { CpaTable, Ring, StatusGroup, startWords } from "../components/ReportParts";

const RANK: Record<TopicStatus, number> = { gap: 0, notReached: 0, fragile: 1, secure: 2 };

/** "was Next to learn" → better / slipped, when a topic was tested more than once. */
function change(now: TopicStatus, before: TopicStatus | undefined): string | undefined {
  if (!before || before === "notReached" || before === now) return undefined;
  return RANK[now] > RANK[before] ? `↑ up from "${LOOK[before].word}"` : `↓ was "${LOOK[before].word}"`;
}

/**
 * A child's maths reports (?child=<name>): every test they've taken, newest
 * first, and one combined report across all of them (each topic's latest
 * result).
 */
export function History({ kid }: { kid: string }) {
  const [data, setData] = useState<HistoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getHistory(kid).then(setData, (e) => setError(String(e.message || e)));
  }, [kid]);
  if (error) return <div className="setup-wrap">Couldn't load the reports: {error}</div>;
  if (!data) return <div className="setup-wrap">Getting the reports…</div>;

  const { combined: c, reports, childName } = data;
  if (!reports.length)
    return (
      <div className="setup-wrap">
        <h1>{childName}'s reports</h1>
        <p className="lede">No Skill Checks finished yet. Reports appear here after each one.</p>
        <a className="btn btn-primary" href={`./?for=${encodeURIComponent(data.kid)}`}>Start a Skill Check</a>
      </div>
    );

  const tested = c.topics.filter((t) => t.status !== "notReached");
  const topicsWith = (s: TopicStatus) => c.topics.filter((t) => t.status === s);
  return (
    <div className="rp">
      <header className="rp-head">
        <div>
          <p className="rp-eyebrow">Skill Check reports</p>
          <h1>{childName}</h1>
          <p>
            {c.tests} test{c.tests === 1 ? "" : "s"}
            {c.tests > 1 ? ` · ${fmtDate(c.firstDate)} – ${fmtDate(c.lastDate)}` : ` · ${fmtDate(c.lastDate)}`}
          </p>
        </div>
      </header>

      <a className="btn btn-primary rp-start" href={`./?for=${encodeURIComponent(data.kid)}`}>
        Start a new Skill Check →
      </a>

      <section className="rp-card rp-top">
        <Ring value={c.strengths.length} total={tested.length} label="topics got" />
        <div className="rp-top-text">
          <h2>All tests together</h2>
          <p>Each topic shows its latest result. Where a topic was tested more than once, you can see how it changed.</p>
        </div>
      </section>

      <div className="rp-groups">
        <StatusGroup status="secure" title="Strengths" topics={topicsWith("secure").map((t) => ({ name: t.name, note: change(t.status, t.before?.status) }))} />
        <StatusGroup status="fragile" title="Nearly there" topics={topicsWith("fragile").map((t) => ({ name: t.name, note: change(t.status, t.before?.status) }))} />
        <StatusGroup
          status="gap"
          title="Next to learn"
          topics={topicsWith("gap").map((t) => ({
            name: t.name,
            note: [change(t.status, t.before?.status), startWords(t.startAt) ? `Best to ${startWords(t.startAt)}.` : ""].filter(Boolean).join(" "),
          }))}
        />
        <StatusGroup status="notReached" title="Not tested yet" topics={topicsWith("notReached").map((t) => ({ name: t.name }))} />
      </div>

      {c.mistakes.length > 0 && (
        <section className="rp-card">
          <h2>Mistakes to work on</h2>
          <ul className="rp-mistakes">
            {c.mistakes.map((m) => (
              <li key={m.topic + m.label}>
                <b>{m.label}</b> <small>({m.topic})</small>
                <span>💡 {m.childTip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CpaTable topics={c.topics} />

      <section className="rp-card">
        <h2>Every test</h2>
        <ul className="rp-tests">
          {reports.map((r) => (
            <li key={r.id}>
              <a href={`?report=${r.id}`}>
                <span className="rp-test-date">
                  <b>{fmtDate(r.date)}</b>
                  <small>
                    {new Date(r.date).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })} · {r.grade}
                  </small>
                </span>
                <span className="rp-chips">
                  {r.topics.map((t) => (
                    <span key={t.topicId} className={`rp-chip ${LOOK[t.status].cls}`} title={LOOK[t.status].word}>
                      {LOOK[t.status].icon} {t.name}
                    </span>
                  ))}
                </span>
                <span className="rp-open">Open →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
