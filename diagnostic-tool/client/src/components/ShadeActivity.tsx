import { useEffect, useState } from "react";
import { ShadeActivity as Spec, ShadeInteraction } from "../types";

/**
 * Shade squares, hands on (Grade 8).
 *  - "fill" (default): tap a square to shade every square up to it (tap the
 *    last shaded one to take it off); − / + change it by one. The answer is
 *    how many are shaded (percent, profit, interest, inequations…).
 *  - "free": tap any square to shade it or clear it. The answer is exactly
 *    which squares: finish a pattern across a mirror line or by turning it,
 *    or draw a shape to given measurements. Squares given at the start stay
 *    shaded (darker) and can't be changed.
 */
export function ShadeActivity({ spec, onChange }: { spec: Spec; onChange: (it: ShadeInteraction, acted: boolean) => void }) {
  const total = spec.rows * spec.cols;
  const free = spec.mode === "free";
  const given = new Set(spec.given ?? []);
  const [shaded, setShaded] = useState(0);
  const [cells, setCells] = useState<number[]>([]);
  const [acted, setActed] = useState(false);
  useEffect(() => {
    onChange(free ? { shaded: cells.length + given.size, cells: [...given, ...cells] } : { shaded }, acted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shaded, cells, acted]);
  const set = (n: number) => {
    setShaded(Math.max(0, Math.min(total, n)));
    setActed(true);
  };
  const toggle = (i: number) => {
    if (given.has(i)) return;
    setCells((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
    setActed(true);
  };
  return (
    <div className="shade-activity">
      {spec.unit && <div className="grid-diagram-label">{spec.unit}</div>}
      <div className="shade-wrap" style={{ maxWidth: Math.min(420, spec.cols * 44) }}>
        <div className="shade-grid" style={{ gridTemplateColumns: `repeat(${spec.cols}, 1fr)` }}>
          {Array.from({ length: total }, (_, i) => {
            const on = free ? given.has(i) || cells.includes(i) : i < shaded;
            return (
              <button
                type="button"
                key={i}
                className={`shade-cell${on ? " on" : ""}${given.has(i) ? " given" : ""}`}
                aria-label={free ? `square ${Math.floor(i / spec.cols) + 1}, ${(i % spec.cols) + 1}${on ? ", shaded" : ""}` : `shade ${i + 1} square${i ? "s" : ""}`}
                onClick={() => (free ? toggle(i) : set(shaded === i + 1 ? i : i + 1))}
              >
                {spec.numbered ? i + 1 : null}
              </button>
            );
          })}
        </div>
        {spec.mirror && (
          <svg className="shade-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {spec.mirror === "vertical" && <line x1="50" y1="0" x2="50" y2="100" />}
            {spec.mirror === "horizontal" && <line x1="0" y1="50" x2="100" y2="50" />}
            {spec.mirror === "diagonal" && <line x1="0" y1="0" x2="100" y2="100" />}
          </svg>
        )}
        {spec.centre && <span className="shade-centre" aria-hidden="true" />}
      </div>
      {free ? (
        <p className="ga-hint">Tap a square to shade it; tap it again to clear it.{spec.given?.length ? " The darker squares are given." : ""}</p>
      ) : (
        <>
          <div className="shade-controls">
            <button type="button" onClick={() => set(shaded - 1)} disabled={shaded <= 0} aria-label="one fewer">−</button>
            <span>
              <b>{shaded}</b> of {total} shaded
            </span>
            <button type="button" onClick={() => set(shaded + 1)} disabled={shaded >= total} aria-label="one more">+</button>
          </div>
          <p className="ga-hint">Tap a square to shade up to it. Use − and + to change it by one.</p>
        </>
      )}
    </div>
  );
}
