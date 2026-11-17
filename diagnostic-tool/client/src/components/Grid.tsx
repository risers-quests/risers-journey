import { GridSpec } from "../types";

export function Grid({ spec }: { spec: GridSpec }) {
  const { rows, cols, shadedCells = 0, markers = [], unitLabel, compact } = spec;
  const cells = Array.from({ length: rows * cols }, (_, i) => i);

  function markerFor(idx: number) {
    const row = Math.floor(idx / cols) + 1;
    const col = (idx % cols) + 1;
    return markers.find((m) => m.row === row && m.col === col);
  }

  return (
    <div className="grid-diagram">
      {unitLabel && <div className="grid-diagram-label">{unitLabel}</div>}
      <div className="grid-diagram-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, ...(compact ? { maxWidth: cols * 46 } : {}) }}>
        {cells.map((idx) => {
          const marker = markerFor(idx);
          const shaded = idx < shadedCells;
          return (
            <div key={idx} className={`grid-diagram-cell ${shaded ? "shaded" : ""} ${marker ? "marked" : ""}`}>
              {marker && <span className="grid-diagram-marker">{marker.label}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
