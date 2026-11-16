import { NumberLineSpec } from "../types";

export function NumberLine({ spec }: { spec: NumberLineSpec }) {
  const { min, max, step, markers, highlightRange, labelEvery = 1 } = spec;
  const span = max - min;
  const pct = (v: number) => ((v - min) / span) * 100;

  const ticks: number[] = [];
  for (let v = min; v <= max + step / 1000; v += step) {
    ticks.push(Math.round(v * 1000) / 1000);
  }

  return (
    <div className="number-line">
      <div className="nl-track">
        {highlightRange && (
          <div
            className="nl-highlight"
            style={{ left: `${pct(highlightRange[0])}%`, width: `${pct(highlightRange[1]) - pct(highlightRange[0])}%` }}
          />
        )}
        <div className="nl-baseline" />
        {ticks.map((t, i) => (
          <div key={t} className="nl-tick" style={{ left: `${pct(t)}%` }}>
            <div className="nl-tick-mark" />
            {/* One fixed number format (240,000), whatever the device's region. */}
            {(i % labelEvery === 0 || i === ticks.length - 1) && <div className="nl-tick-label">{t.toLocaleString("en-US")}</div>}
          </div>
        ))}
        {markers.map((m, i) => (
          <div key={i} className="nl-marker" style={{ left: `${pct(m.value)}%` }}>
            <div className="nl-marker-dot" />
            <div className="nl-marker-label">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
