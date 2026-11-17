import { ReactNode } from "react";
import { ReportTopic, TopicStatus } from "../reportTypes";
import { staffSignedIn } from "../staff";

/*
 * The report has two parts:
 *  - for the child and parents: how many right, strengths and areas to grow
 *    (topic names only), and one plain-words observation;
 *  - for staff, lower down and folded away: each topic's result with the
 *    CPA (concrete, pictorial, abstract) × Bloom's grid, reasons and mistakes.
 */

/** A ring with one big number in the middle: `value` out of `total`. */
export function ScoreRing({ value, total, label }: { value: number; total: number; label: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const f = total ? Math.min(value / total, 1) : 0;
  return (
    <div className="rp-ring" role="img" aria-label={`${value} out of ${total} ${label}`}>
      <svg viewBox="0 0 120 120" width="148" height="148">
        <circle cx="60" cy="60" r={r} className="rp-ring-track" />
        {f > 0 && <circle cx="60" cy="60" r={r} className="rp-ring-fill" strokeDasharray={`${c * f} ${c}`} transform="rotate(-90 60 60)" />}
      </svg>
      <div className="rp-ring-text">
        <b>{value}</b>
        <span>out of {total}</span>
        <small>{label}</small>
      </div>
    </div>
  );
}

/** What being sure said about the child, in plain words (no numbers). */
export function sureWords(sureRight: number, sureTotal: number, right: number): string {
  if (!sureTotal) return right ? "You got answers right even when you weren't sure. You know more than you think!" : "";
  const p = sureRight / sureTotal;
  if (p === 1) return "Every time you felt sure, you were right. You know what you know!";
  if (p >= 0.75) return "When you felt sure, you were nearly always right.";
  if (p >= 0.5) return "Sometimes you felt sure but the answer needed another look. It's good to check again.";
  return "Take a second look before you answer, even when you feel sure.";
}

const Tick = () => (
  <svg className="rp-ico rp-ico-strong" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="9" />
    <path d="M6 10.3l2.6 2.6L14 7.6" />
  </svg>
);
const Up = () => (
  <svg className="rp-ico rp-ico-grow" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="9" />
    <path d="M10 14V6.5M6.8 9.4L10 6.2l3.2 3.2" />
  </svg>
);

/** Strengths or areas to grow: topic names only. */
export function TopicList({ kind, items, empty }: { kind: "strong" | "grow"; items: { name: string; tag?: string }[]; empty: string }) {
  return (
    <section className={`rp-card rp-list rp-list-${kind}`}>
      <h2>
        {kind === "strong" ? "Strengths" : "Areas to grow"}
        <span className="rp-count">{items.length}</span>
      </h2>
      {items.length ? (
        <ul>
          {items.map((t) => (
            <li key={t.name}>
              {kind === "strong" ? <Tick /> : <Up />}
              <span>{t.name}</span>
              {t.tag && <em className="rp-tag">{t.tag}</em>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rp-empty">{empty}</p>
      )}
    </section>
  );
}

/** Topics the child has got, and topics still growing (nearly there first). */
export function splitTopics<T extends { status: TopicStatus }>(topics: T[]) {
  return {
    strong: topics.filter((t) => t.status === "secure"),
    grow: [...topics.filter((t) => t.status === "fragile"), ...topics.filter((t) => t.status === "gap")],
  };
}

/** Each result, in staff words. */
export const STAFF_WORD: Record<TopicStatus, { word: string; cls: string }> = {
  secure: { word: "Secure", cls: "cpa-ok" },
  fragile: { word: "Fragile", cls: "cpa-part" },
  gap: { word: "Gap", cls: "cpa-no" },
  notReached: { word: "Not tested", cls: "cpa-none" },
};

/** Why a topic is fragile, for staff. */
export function nearlyWhy(why: string): string {
  return why.startsWith("Right in numbers") ? "Right with numbers, but not yet with pictures or objects." : "Right, but not sure yet.";
}

const STAGES = ["Concrete", "Pictorial", "Abstract"];
const LEVELS = ["Remember", "Understand", "Apply", "Analyse", "Evaluate"];

/** One CPA stage (row of the grid) in a word: all cleared, partly, not yet, or not asked. */
export function stageWord(row: string[]): { word: string; cls: string } {
  const cleared = row.filter((c) => c === "cleared").length;
  const struggled = row.filter((c) => c === "struggled").length;
  if (!cleared && !struggled) return { word: "Not asked", cls: "cpa-none" };
  if (!struggled) return { word: "Cleared", cls: "cpa-ok" };
  if (!cleared) return { word: "Not yet", cls: "cpa-no" };
  return { word: "Partly", cls: "cpa-part" };
}

/** Where to start reteaching, for staff. */
export function startWords(startAt: string | null): string {
  return startAt === "concrete" ? "Start concrete (real objects)." : startAt === "pictorial" ? "Start pictorial." : startAt === "abstract" ? "Practise abstract (numbers only)." : "";
}

/**
 * For staff, below the child's part and folded away: every topic's result,
 * its CPA stages and the CPA × Bloom's grid, why, the main mistake and where
 * to start. `notes` adds lines per topic (e.g. how it changed); `children`
 * adds sections at the end. Shown only when staff are signed in on this
 * device, so children never see it.
 */
export function StaffSection({ topics, notes, summary, children }: { topics: ReportTopic[]; notes?: (t: ReportTopic) => string[]; summary?: ReactNode; children?: ReactNode }) {
  if (!staffSignedIn()) return null;
  return (
    <details className="rp-staff">
      <summary>
        <span>For staff</span>
        <small>Each topic's result, CPA × Bloom's grid, mistakes and next steps</small>
      </summary>
      <div className="rp-staff-body">
        {summary}
        <div className="cpa-list">
          {topics.map((t) => {
            const r = STAFF_WORD[t.status];
            const tried = t.grid.some((row) => row.some(Boolean));
            const lines = [
              t.status === "fragile" ? nearlyWhy(t.why) : "",
              t.mistakes[0] ? `Main mistake: ${t.mistakes[0].label}${t.mistakes[0].sureCount ? ` (${t.mistakes[0].sureCount}× while sure)` : ""}.` : "",
              t.status !== "secure" ? startWords(t.startAt) : "",
              t.status === "notReached" && t.blockedBy.length ? `Not reached: needs ${t.blockedBy.join(" and ")} first.` : "",
              ...(notes ? notes(t) : []),
            ].filter(Boolean);
            return (
              <details key={t.topicId} className="cpa-topic">
                <summary>
                  <span className="cpa-name">{t.name}</span>
                  <span className={`cpa-pill ${r.cls}`}>{r.word}</span>
                  {tried && (
                    <span className="cpa-stages" aria-label="Concrete, pictorial, abstract">
                      {t.grid.map((row, i) => {
                        const s = stageWord(row);
                        return <span key={i} className={`cpa-dot ${s.cls}`} title={`${STAGES[i]}: ${s.word}`}>{STAGES[i][0]}</span>;
                      })}
                    </span>
                  )}
                </summary>
                {lines.length > 0 && (
                  <ul className="cpa-notes">
                    {lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
                {tried && (
                  <div className="cpa-scroll">
                    <table className="cpa-grid">
                      <thead>
                        <tr>
                          <th />
                          {LEVELS.map((l) => (
                            <th key={l}>{l}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {t.grid.map((row, i) => (
                          <tr key={i}>
                            <th>{STAGES[i]}</th>
                            {row.map((c, j) => (
                              <td key={j} className={c === "cleared" ? "g-ok" : c === "struggled" ? "g-no" : "g-none"}>
                                {c === "cleared" ? "✓" : c === "struggled" ? "✗" : "·"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </details>
            );
          })}
        </div>
        <p className="cpa-key">
          <b>C P A</b> concrete · pictorial · abstract. Grid: <span className="g-ok">✓</span> cleared <span className="g-no">✗</span> struggled <span className="g-none">·</span> not asked.
        </p>
        {children}
      </div>
    </details>
  );
}
