import { BarsSpec } from "../types";

/**
 * Bar model drawn to scale: every bar shares one scale, so a part's width
 * really shows its size. Dashed ("ghost") parts show a difference; a brace
 * above the first bar labels the whole.
 */
export function Bars({ spec }: { spec: BarsSpec }) {
  const totals = spec.bars.map((b) => b.parts.reduce((s, p) => s + p.value, 0));
  const max = Math.max(...totals);
  const named = spec.bars.some((b) => b.name);
  return (
    <div className="bars">
      {spec.bars.map((bar, i) => (
        <div className="bars-row" key={i}>
          {named && <div className="bars-name">{bar.name}</div>}
          <div className="bars-track">
            {i === 0 && spec.brace && (
              <div className="bars-brace" style={{ width: `${(totals[0] / max) * 100}%` }}>
                <span>{spec.brace.label}</span>
              </div>
            )}
            <div className="bars-bar" style={{ width: `${(totals[i] / max) * 100}%` }}>
              {bar.parts.map((p, j) => (
                <div key={j} className={`bars-part ${p.ghost ? "ghost" : ""} ${p.label === "?" ? "query" : ""}`} style={{ flex: p.value }}>
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
