import { useEffect, useState } from "react";
import { ShadeActivity as Spec, ShadeInteraction } from "../types";

/**
 * Shade squares, hands on (Grade 8 percent, profit, interest). Tap a square
 * to shade every square up to it (tap the last shaded one to take it off);
 * − / + change it one square at a time. Shading fills in reading order, so a
 * child sets an amount in one tap and can see what part of the whole it is.
 */
export function ShadeActivity({ spec, onChange }: { spec: Spec; onChange: (it: ShadeInteraction, acted: boolean) => void }) {
  const total = spec.rows * spec.cols;
  const [shaded, setShaded] = useState(0);
  const [acted, setActed] = useState(false);
  useEffect(() => {
    onChange({ shaded }, acted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shaded, acted]);
  const set = (n: number) => {
    setShaded(Math.max(0, Math.min(total, n)));
    setActed(true);
  };
  return (
    <div className="shade-activity">
      {spec.unit && <div className="grid-diagram-label">{spec.unit}</div>}
      <div className="shade-grid" style={{ gridTemplateColumns: `repeat(${spec.cols}, 1fr)`, maxWidth: Math.min(420, spec.cols * 44) }}>
        {Array.from({ length: total }, (_, i) => (
          <button
            type="button"
            key={i}
            className={`shade-cell${i < shaded ? " on" : ""}`}
            aria-label={`shade ${i + 1} square${i ? "s" : ""}`}
            onClick={() => set(shaded === i + 1 ? i : i + 1)}
          >
            {spec.numbered ? i + 1 : null}
          </button>
        ))}
      </div>
      <div className="shade-controls">
        <button type="button" onClick={() => set(shaded - 1)} disabled={shaded <= 0} aria-label="one fewer">−</button>
        <span>
          <b>{shaded}</b> of {total} shaded
        </span>
        <button type="button" onClick={() => set(shaded + 1)} disabled={shaded >= total} aria-label="one more">+</button>
      </div>
      <p className="ga-hint">Tap a square to shade up to it. Use − and + to change it by one.</p>
    </div>
  );
}
