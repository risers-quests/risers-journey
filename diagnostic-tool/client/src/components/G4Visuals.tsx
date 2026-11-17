import { useEffect, useState } from "react";
import {
  FigureKind,
  FiguresSpec,
  MeasureActivity as MeasureSpec,
  MeasureInteraction,
  PickActivity as PickSpec,
  PickInteraction,
  PieSpec,
  PizzaActivity as PizzaSpec,
  PizzaInteraction,
  TilesActivity as TilesSpec,
  TilesInteraction,
} from "../types";

/*
 * Grade 4 pictures and hands-on activities: pizzas (fractions), figure
 * cards (shapes), grid shading (decimals, area and perimeter), and
 * making an amount from weights, lengths or jugs (measurement). None of
 * them shows a running total: the child does the maths.
 */

const CRUST = "#8a6d3b";
const CHEESE = "#f4b860";
const PLAIN = "#fbf3e2";

/** One pizza cut into `slices`; `isOn(i)` says if slice i is coloured. */
function Pizza({ slices, isOn, onTap, size = 96 }: { slices: number; isOn: (i: number) => boolean; onTap?: (i: number) => void; size?: number }) {
  const c = size / 2;
  const r = size / 2 - 3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={onTap ? "pz-tappable" : undefined} aria-hidden={!onTap}>
      {slices <= 1 ? (
        <circle cx={c} cy={c} r={r} fill={isOn(0) ? CHEESE : PLAIN} stroke={CRUST} strokeWidth={3} onClick={() => onTap?.(0)} />
      ) : (
        Array.from({ length: slices }, (_, i) => {
          const a0 = (i / slices) * 2 * Math.PI - Math.PI / 2;
          const a1 = ((i + 1) / slices) * 2 * Math.PI - Math.PI / 2;
          const d = `M ${c} ${c} L ${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)} Z`;
          return <path key={i} d={d} fill={isOn(i) ? CHEESE : PLAIN} stroke={CRUST} strokeWidth={2} onClick={() => onTap?.(i)} />;
        })
      )}
    </svg>
  );
}

/** Pictorial: pizzas with some slices coloured. */
export function PiePicture({ spec }: { spec: PieSpec }) {
  return (
    <div className="pz-row">
      {spec.pies.map((p, i) => (
        <div key={i} className="pz-item">
          <Pizza slices={p.slices} isOn={(j) => j < p.shaded} />
          {p.label && <span className="pz-label">{p.label}</span>}
        </div>
      ))}
    </div>
  );
}

/** Hands-on: cut the pizza (if the slices aren't fixed), then tap slices to colour them. */
export function PizzaActivity({ spec, onChange }: { spec: PizzaSpec; onChange: (it: PizzaInteraction, acted: boolean) => void }) {
  const [slices, setSlices] = useState(spec.slices ?? 1);
  const [on, setOn] = useState<boolean[][]>(() => Array.from({ length: spec.pies }, () => Array(spec.slices ?? 1).fill(false)));
  useEffect(() => {
    const coloured = on.map((p) => p.filter(Boolean).length);
    onChange({ slices, coloured }, coloured.some((n) => n > 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, slices]);
  function cut(n: number) {
    setSlices(n);
    setOn(Array.from({ length: spec.pies }, () => Array(n).fill(false)));
  }
  return (
    <div className="g4-activity">
      {spec.slices === null && (
        <div className="sa-controls">
          <div className="sa-stepper">
            <span>Cut each pizza into</span>
            <button type="button" onClick={() => cut(Math.max(1, slices - 1))} disabled={slices <= 1} aria-label="fewer slices">−</button>
            <b>{slices}</b>
            <button type="button" onClick={() => cut(Math.min(12, slices + 1))} disabled={slices >= 12} aria-label="more slices">+</button>
          </div>
          <span className="sa-note">equal slices. Cutting again clears the colouring.</span>
        </div>
      )}
      <div className="pz-row">
        {on.map((pie, p) => (
          <Pizza
            key={p}
            slices={slices}
            size={on.length > 2 ? 110 : 140}
            isOn={(i) => pie[i]}
            onTap={(i) => setOn((all) => all.map((row, q) => (q === p ? row.map((v, j) => (j === i ? !v : v)) : row)))}
          />
        ))}
      </div>
      <p className="ga-hint">Tap a slice to colour it. Tap it again to clear it.</p>
    </div>
  );
}

// ---------------- figure cards ----------------

const NETS: Partial<Record<FigureKind, [number, number][]>> = {
  "net-cube-cross": [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]],
  "net-cube-t": [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1], [3, 1]],
  "net-cube-steps": [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3]],
  "net-cube-z": [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 3]],
  "net-not-row": [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
  "net-not-square": [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]],
  "net-not-l": [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2]],
};

function FigureArt({ kind }: { kind: FigureKind }) {
  const ink = { fill: "none", stroke: "#2f5e10", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const fill = { ...ink, fill: "#e3f0d2" };
  const hi = { stroke: "#b2475e", strokeWidth: 4, strokeLinecap: "round" as const };
  const dot = (x: number, y: number) => <circle cx={x} cy={y} r={3.5} fill="#2f5e10" />;
  const arrow = (x: number, y: number, dir: 1 | -1) => <path d={`M ${x} ${y} l ${-8 * dir} -6 M ${x} ${y} l ${-8 * dir} 6`} {...ink} />;
  const net = NETS[kind];
  if (net) {
    const rows = Math.max(...net.map((p) => p[0])) + 1;
    const cols = Math.max(...net.map((p) => p[1])) + 1;
    const s = Math.min(84 / cols, 70 / rows);
    const ox = (100 - cols * s) / 2;
    const oy = (80 - rows * s) / 2;
    return (
      <g>
        {net.map(([r, c], i) => (
          <rect key={i} x={ox + c * s} y={oy + r * s} width={s} height={s} {...fill} strokeWidth={2} />
        ))}
      </g>
    );
  }
  switch (kind) {
    case "open-curve": return <path d="M10 62 C 25 8, 55 8, 62 38 S 88 70, 92 22" {...ink} />;
    case "closed-curve": return <path d="M18 42 C 16 12, 78 4, 86 32 S 64 78, 36 70 S 19 56, 18 42 Z" {...fill} />;
    case "open-zigzag": return <polyline points="8,62 28,18 48,62 68,18 92,62" {...ink} />;
    case "open-v": return <polyline points="22,14 50,66 78,14" {...ink} />;
    case "triangle": return <polygon points="50,10 90,70 10,70" {...fill} />;
    case "square": return <polygon points="25,10 75,10 75,60 25,60" {...fill} />;
    case "rectangle": return <polygon points="8,20 92,20 92,62 8,62" {...fill} />;
    case "pentagon": return <polygon points="50,8 88,35 74,72 26,72 12,35" {...fill} />;
    case "hexagon": return <polygon points="30,10 70,10 90,40 70,70 30,70 10,40" {...fill} />;
    case "circle": return <circle cx={50} cy={40} r={30} {...fill} />;
    case "oval": return <ellipse cx={50} cy={40} rx={40} ry={24} {...fill} />;
    case "line": return <g><line x1={10} y1={40} x2={90} y2={40} {...ink} />{arrow(92, 40, 1)}{arrow(8, 40, -1)}{dot(30, 40)}{dot(70, 40)}</g>;
    case "ray": return <g><line x1={14} y1={40} x2={90} y2={40} {...ink} />{arrow(92, 40, 1)}{dot(14, 40)}{dot(60, 40)}</g>;
    case "segment": return <g><line x1={14} y1={40} x2={86} y2={40} {...ink} />{dot(14, 40)}{dot(86, 40)}</g>;
    case "circle-radius": return <g><circle cx={50} cy={40} r={32} {...ink} /><line x1={50} y1={40} x2={82} y2={40} {...hi} />{dot(50, 40)}</g>;
    case "circle-diameter": return <g><circle cx={50} cy={40} r={32} {...ink} /><line x1={18} y1={40} x2={82} y2={40} {...hi} />{dot(50, 40)}</g>;
    case "circle-chord": return <g><circle cx={50} cy={40} r={32} {...ink} /><line x1={24} y1={21} x2={80} y2={29} {...hi} />{dot(50, 40)}</g>;
    case "circle-arc": return <g><circle cx={50} cy={40} r={32} {...ink} /><path d="M 18 40 A 32 32 0 0 1 50 8" fill="none" {...hi} />{dot(50, 40)}</g>;
    default: return null;
  }
}

const LETTERS = "ABCDEFGH";

/** Pictorial: figure cards, lettered A, B, C… */
export function FigureCards({ spec }: { spec: FiguresSpec }) {
  return (
    <div className="fig-row">
      {spec.items.map((it, i) => (
        <div key={it.id} className="fig-card">
          <svg viewBox="0 0 100 80" aria-hidden="true"><FigureArt kind={it.figure} /></svg>
          <b>{LETTERS[i]}</b>
        </div>
      ))}
    </div>
  );
}

/** Hands-on: tap every card that fits. */
export function PickActivity({ spec, onChange }: { spec: PickSpec; onChange: (it: PickInteraction, acted: boolean) => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  useEffect(() => {
    onChange({ picked }, picked.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);
  return (
    <div className="g4-activity">
      <div className="fig-row">
        {spec.items.map((it, i) => {
          const on = picked.includes(it.id);
          return (
            <button
              type="button"
              key={it.id}
              className={`fig-card fig-pick${on ? " on" : ""}`}
              aria-pressed={on}
              onClick={() => setPicked((p) => (p.includes(it.id) ? p.filter((x) => x !== it.id) : [...p, it.id]))}
            >
              <svg viewBox="0 0 100 80" aria-hidden="true"><FigureArt kind={it.figure} /></svg>
              <b>{on ? "✓ " : ""}{LETTERS[i]}</b>
            </button>
          );
        })}
      </div>
      <p className="ga-hint">Tap every card that fits. Tap again to undo.</p>
    </div>
  );
}

// ---------------- grid shading ----------------

/** Hands-on: tap squares to colour them. */
export function TilesActivity({ spec, onChange }: { spec: TilesSpec; onChange: (it: TilesInteraction, acted: boolean) => void }) {
  const [cells, setCells] = useState<number[]>([]);
  const given = new Set(spec.given ?? []);
  useEffect(() => {
    onChange({ cells }, cells.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells]);
  const size = spec.rows * spec.cols;
  return (
    <div className="g4-activity">
      <div className="tile-grid" style={{ gridTemplateColumns: `repeat(${spec.cols}, 1fr)`, maxWidth: Math.min(560, spec.cols * (spec.cols > 10 ? 34 : 44)) }}>
        {Array.from({ length: size }, (_, i) => {
          const isGiven = given.has(i);
          const on = cells.includes(i);
          return (
            <button
              type="button"
              key={i}
              className={`tile-cell${on ? " on" : ""}${isGiven ? " given" : ""}`}
              disabled={isGiven}
              aria-label={`square ${i + 1}${on ? ", coloured" : ""}`}
              onClick={() => setCells((cs) => (cs.includes(i) ? cs.filter((x) => x !== i) : [...cs, i]))}
            />
          );
        })}
      </div>
      <div className="sa-controls">
        <p className="ga-hint">Tap a square to colour it. Tap it again to clear it.</p>
        {cells.length > 0 && (
          <button type="button" className="btn btn-secondary tile-clear" onClick={() => setCells([])}>
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------- making an amount ----------------

const MEASURE_ICON = { mass: "⚖️", length: "📏", capacity: "🫙", discs: "🔵" } as const;
const MEASURE_WORDS = { mass: "on the scale", length: "along the line", capacity: "in the bucket", discs: "on the place-value mat" } as const;

/** Hands-on: put weights on the scale (or lengths together, or jugs into a bucket) to make an amount. */
export function MeasureActivity({ spec, onChange }: { spec: MeasureSpec; onChange: (it: MeasureInteraction, acted: boolean) => void }) {
  const [counts, setCounts] = useState<number[]>(() => spec.pieces.map(() => 0));
  useEffect(() => {
    onChange({ counts }, counts.some((n) => n > 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts]);
  const add = (i: number, d: number) => setCounts((cs) => cs.map((c, j) => (j === i ? Math.max(0, Math.min(20, c + d)) : c)));
  const placed = spec.pieces.flatMap((p, i) => Array.from({ length: counts[i] }, () => ({ i, label: p.label })));
  return (
    <div className="g4-activity">
      <div className="ms-shelf">
        {spec.pieces.map((p, i) => (
          <button type="button" key={p.label} className={`ms-piece ms-${spec.what}`} onClick={() => add(i, 1)}>
            <span>{p.label}</span>
            <small>tap to add</small>
          </button>
        ))}
      </div>
      <div className={`ms-tray ms-tray-${spec.what}`}>
        <div className="ga-label">
          {MEASURE_ICON[spec.what]} {MEASURE_WORDS[spec.what]}
        </div>
        <div className="ms-placed">
          {placed.length === 0 && <span className="ga-empty">Nothing yet</span>}
          {placed.map((x, k) => (
            <button type="button" key={k} className={`ms-chip ms-${spec.what}`} onClick={() => add(x.i, -1)} aria-label={`take off ${x.label}`}>
              {x.label}
            </button>
          ))}
        </div>
      </div>
      <p className="ga-hint">Tap a piece to add it. Tap one that's been added to take it off.</p>
    </div>
  );
}
