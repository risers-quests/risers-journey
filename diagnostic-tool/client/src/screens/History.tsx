import { useEffect, useState } from "react";
import { getHistory } from "../api";
import { CombinedTopic, History as HistoryData, TopicStatus, fmtDate } from "../reportTypes";
import { Downloads } from "../components/Downloads";
import { Lessons, STAFF_WORD, StaffSection, TopicRing, WorkOn } from "../components/ReportParts";
import { staffSignedIn } from "../staff";

const RANK: Record<TopicStatus, number> = { gap: 0, notReached: 0, fragile: 1, secure: 2 };

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

  const improved = (t: CombinedTopic) => !!t.before && t.before.status !== "notReached" && RANK[t.status] > RANK[t.before.status];
  const tag = (t: CombinedTopic) => (improved(t) ? "improved" : undefined);
  return (
    <div className="rp">
      <header className="rp-head">
        <p className="rp-eyebrow">Skill Checks</p>
        <h1>{childName}</h1>
        <p>
          {c.tests} check{c.tests === 1 ? "" : "s"}
          {c.tests > 1 ? ` · ${fmtDate(c.firstDate)} – ${fmtDate(c.lastDate)}` : ` · ${fmtDate(c.lastDate)}`}
        </p>
      </header>

      <div className="rp-actions">
        <a className="btn btn-primary rp-start" href={`./?for=${encodeURIComponent(data.kid)}`}>
          Start a new Skill Check →
        </a>
        <Downloads childName={childName} reports={reports} fileName={`${childName} - Skill Check reports - ${fmtDate(c.lastDate)}`} />
      </div>

      <TopicRing topics={c.topics.map((t) => ({ name: t.name, status: t.status, tag: tag(t) }))} extra={`All ${c.tests} check${c.tests === 1 ? "" : "s"} together: each topic's latest result.`} />

      {staffSignedIn() ? <Lessons topics={c.topics} /> : <WorkOn topics={c.topics} empty="Nothing to work on right now." />}

      <section className="rp-card">
        <h2>Every check</h2>
        <ul className="rp-tests">
          {reports.map((r) => (
            <li key={r.id}>
              <a href={`?report=${r.id}`}>
                <span className="rp-test-date">
                  <b>{fmtDate(r.date)}</b>
                  <small>{r.subject ?? "Maths"} · {r.grade}</small>
                </span>
                <span className="rp-test-score">
                  <b>{r.right}</b>/{r.questions} right
                </span>
                <span className="rp-open">Open →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <StaffSection
        topics={c.topics}
        notes={(t) => {
          const ct = t as CombinedTopic;
          return [
            ct.before && ct.before.status !== "notReached" && ct.before.status !== ct.status ? `Was ${STAFF_WORD[ct.before.status].word.toLowerCase()} on ${fmtDate(ct.before.date)}.` : "",
            ct.timesTested > 1 ? `Tested ${ct.timesTested} times; latest ${fmtDate(ct.date)}.` : "",
          ];
        }}
      />
    </div>
  );
}
