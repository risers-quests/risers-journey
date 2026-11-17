import { useEffect, useState } from "react";
import { getHistory } from "../api";
import { CombinedTopic, History as HistoryData, TopicStatus, fmtDate } from "../reportTypes";
import { Downloads } from "../components/Downloads";
import { STAFF_WORD, ScoreRing, StaffSection, TopicList, splitTopics } from "../components/ReportParts";

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

  const tested = c.topics.filter((t) => t.status !== "notReached");
  const { strong, grow } = splitTopics(c.topics);
  const improved = (t: CombinedTopic) => !!t.before && t.before.status !== "notReached" && RANK[t.status] > RANK[t.before.status];
  const tag = (t: CombinedTopic) => (improved(t) ? "improved" : undefined);
  return (
    <div className="rp">
      <header className="rp-head">
        <p className="rp-eyebrow">Maths Skill Checks</p>
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

      <section className="rp-card rp-top">
        <ScoreRing value={strong.length} total={tested.length} label={`topic${tested.length === 1 ? "" : "s"} are strengths`} />
        <div className="rp-top-text">
          <p className="rp-observe">All your checks together.</p>
          {c.topics.some(improved) && <p className="rp-note">Topics marked “improved” got better since an earlier check.</p>}
        </div>
      </section>

      <div className="rp-lists">
        <TopicList kind="strong" items={strong.map((t) => ({ name: t.name, tag: tag(t) }))} empty="Keep going: your strengths will show here." />
        <TopicList kind="grow" items={grow.map((t) => ({ name: t.name, tag: tag(t) }))} empty="Nothing to work on right now." />
      </div>

      <section className="rp-card">
        <h2>Every check</h2>
        <ul className="rp-tests">
          {reports.map((r) => (
            <li key={r.id}>
              <a href={`?report=${r.id}`}>
                <span className="rp-test-date">
                  <b>{fmtDate(r.date)}</b>
                  <small>{r.grade}</small>
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
      >
        {c.mistakes.length > 0 && (
          <div className="rp-staff-block">
            <h3>Mistakes to work on</h3>
            <ul>
              {c.mistakes.map((m) => (
                <li key={m.topic + m.label}>
                  <b>{m.label}</b> ({m.topic}{m.sureCount ? `, ${m.sureCount}× while sure` : ""}). <span>{m.childTip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </StaffSection>
    </div>
  );
}
