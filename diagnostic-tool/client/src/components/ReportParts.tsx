import { LOOK, ReportTopic, TopicStatus } from "../reportTypes";

/** A ring: `value` of `total`, with a label under the number. */
export function Ring({ value, total, label }: { value: number; total: number; label: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const share = total ? value / total : 0;
  return (
    <div className="rp-ring" role="img" aria-label={`${value} of ${total} ${label}`}>
      <svg viewBox="0 0 120 120" width="132" height="132">
        <circle cx="60" cy="60" r={r} className="rp-ring-track" />
        {share > 0 && <circle cx="60" cy="60" r={r} className="rp-ring-fill" strokeDasharray={`${c * share} ${c}`} transform="rotate(-90 60 60)" />}
      </svg>
      <div className="rp-ring-text">
        <b>{value}</b>
        <span>of {total}</span>
        <small>{label}</small>
      </div>
    </div>
  );
}

/** A group of topics with one status (strengths, nearly there, next to learn). */
export function StatusGroup({ status, title, topics, children }: { status: TopicStatus; title: string; topics: { name: string; note?: string }[]; children?: React.ReactNode }) {
  if (!topics.length) return null;
  return (
    <section className={`rp-group ${LOOK[status].cls}`}>
      <h3>
        {LOOK[status].icon} {title}
      </h3>
      <ul>
        {topics.map((t) => (
          <li key={t.name}>
            <b>{t.name}</b>
            {t.note && <span>{t.note}</span>}
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
}

const STAGES = ["With objects", "With pictures", "With numbers"];
const LEVELS = ["Remember", "Understand", "Apply", "Analyse", "Evaluate"];

/** One stage (row of the grid) in a word: all cleared, partly, not yet, or not tried. */
function stageWord(row: string[]): { word: string; cls: string } {
  const cleared = row.filter((c) => c === "cleared").length;
  const struggled = row.filter((c) => c === "struggled").length;
  if (!cleared && !struggled) return { word: "Not tried", cls: "cpa-none" };
  if (!struggled) return { word: "Got it", cls: "cpa-ok" };
  if (!cleared) return { word: "Not yet", cls: "cpa-no" };
  return { word: "Partly", cls: "cpa-part" };
}

/**
 * The learning evaluation for each topic: how the child did with real
 * objects, with pictures and with numbers only (Concrete, Pictorial,
 * Abstract), and at each level of thinking (Bloom's: remember → evaluate).
 */
export function CpaTable({ topics }: { topics: ReportTopic[] }) {
  const shown = topics.filter((t) => t.status !== "notReached" && t.grid.some((row) => row.some(Boolean)));
  if (!shown.length) return null;
  return (
    <section className="rp-card">
      <h2>How each topic was learned</h2>
      <p className="rp-sub">
        Each topic was tried with real objects, then pictures, then numbers only, at five levels of thinking. Tap a topic to see every step.
      </p>
      <div className="cpa-list">
        {shown.map((t) => (
          <details key={t.topicId} className="cpa-topic">
            <summary>
              <span className="cpa-name">{t.name}</span>
              <span className="cpa-stages">
                {t.grid.map((row, i) => {
                  const s = stageWord(row);
                  return (
                    <span key={i} className={`cpa-pill ${s.cls}`}>
                      <small>{STAGES[i].replace("With ", "")}</small> {s.word}
                    </span>
                  );
                })}
              </span>
            </summary>
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
            {t.status !== "secure" && t.startAt && (
              <p className="cpa-start">Start here: {STAGES[["concrete", "pictorial", "abstract"].indexOf(t.startAt)]?.toLowerCase()}.</p>
            )}
          </details>
        ))}
      </div>
      <p className="cpa-key">
        <span className="g-ok">✓</span> right <span className="g-no">✗</span> found hard <span className="g-none">·</span> not asked
      </p>
    </section>
  );
}

/** Where to start reteaching, in plain words. */
export function startWords(startAt: string | null): string {
  return startAt === "concrete" ? "start with real objects" : startAt === "pictorial" ? "start with pictures" : startAt === "abstract" ? "practise with numbers" : "";
}
