import { useEffect, useState } from "react";
import { PlaceValueActivity as Spec, PlaceValueChartSpec, PlaceValueInteraction } from "../types";

// One colour per column, the same in the picture and the hands-on chart.
const DISC: Record<string, string> = { M: "#9b5de5", HTh: "#e76f51", TTh: "#f4a261", Th: "#e9c46a", H: "#2a9d8f", T: "#00b4d8", O: "#8ab17d" };
const SHORT: Record<number, string> = { 1000000: "M", 100000: "HTh", 10000: "TTh", 1000: "Th", 100: "H", 10: "T", 1: "O" };
const LONG: Record<string, string> = { M: "millions", HTh: "hundred thousands", TTh: "ten thousands", Th: "thousands", H: "hundreds", T: "tens", O: "ones" };

function Discs({ label, count }: { label: string; count: number }) {
  return (
    <div className="pv-discs">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="pv-disc" style={{ background: DISC[label] }} />
      ))}
    </div>
  );
}

/** Pictorial: discs drawn in columns. Only the column headers carry values; the discs don't. */
export function PlaceValueChart({ spec }: { spec: PlaceValueChartSpec }) {
  return (
    <>
      <div className="pv-chart">
        {spec.columns.map((c) => (
          <div className="pv-col" key={c.label}>
            <div className="pv-head" title={LONG[c.label]}>{c.label}</div>
            <Discs label={c.label} count={c.count} />
          </div>
        ))}
      </div>
      <div className="pv-key">{spec.columns.map((c) => `${c.label} = ${LONG[c.label]}`).join(" · ")}</div>
    </>
  );
}

/**
 * Hands-on place-value chart: + / − puts a disc in or takes one out; "10 → 1"
 * exchanges ten discs in a column for one in the next column to the left
 * (and "1 → 10" the other way). Reports the discs per column after each change.
 */
export function PlaceValueActivity({ spec, onChange }: { spec: Spec; onChange: (it: PlaceValueInteraction, acted: boolean) => void }) {
  const [counts, setCounts] = useState<number[]>(spec.start);
  const [acted, setActed] = useState(false);
  useEffect(() => {
    onChange({ counts }, acted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts, acted]);
  const change = (fn: (c: number[]) => number[]) => {
    setCounts((c) => fn([...c]));
    setActed(true);
  };
  return (
    <div className="pv-activity">
      <div className="pv-chart">
        {spec.columns.map((p, i) => {
          const label = SHORT[p];
          return (
            <div className="pv-col" key={p}>
              <div className="pv-head" title={LONG[label]}>{label}</div>
              <div className="pv-count">{counts[i]}</div>
              <Discs label={label} count={counts[i]} />
              <div className="pv-buttons">
                <button type="button" aria-label={`add a ${LONG[label]} disc`} disabled={counts[i] >= 20} onClick={() => change((c) => ((c[i] += 1), c))}>+</button>
                <button type="button" aria-label={`take away a ${LONG[label]} disc`} disabled={counts[i] <= 0} onClick={() => change((c) => ((c[i] -= 1), c))}>−</button>
              </div>
              {i > 0 && counts[i] >= 10 && (
                <button type="button" className="pv-exchange" onClick={() => change((c) => ((c[i] -= 10), (c[i - 1] += 1), c))}>
                  10 → 1 ←
                </button>
              )}
              {i < spec.columns.length - 1 && counts[i] >= 1 && (
                <button type="button" className="pv-exchange pv-break" onClick={() => change((c) => ((c[i] -= 1), (c[i + 1] += 10), c))}>
                  1 → 10 →
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="pv-key">{spec.columns.map((p) => `${SHORT[p]} = ${LONG[SHORT[p]]}`).join(" · ")}</div>
    </div>
  );
}
