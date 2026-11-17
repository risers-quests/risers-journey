import { FigureSpec } from "../types";

/**
 * Geometry pictures (Grade 8), drawn in SVG: polygons, special
 * quadrilaterals, 3-D solids in 2-D (hidden edges dashed) and circles with
 * one part highlighted. Coordinates live in a 220 × 180 box.
 */
type P = [number, number];
const CX = 110, CY = 92;

function polygonPoints(n: number, regular: boolean): P[] {
  // Irregular polygons get a fixed, gentle wobble so equal-looking angles aren't implied.
  const wobble = [1, 0.82, 0.97, 0.86, 1, 0.9, 0.84, 0.95, 0.88, 1];
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n + (regular ? 0 : 0.18 * Math.sin(i * 2.3));
    const r = 72 * (regular ? 1 : wobble[i % wobble.length]);
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  });
}

function quadPoints(q: NonNullable<FigureSpec["quad"]>): P[] {
  switch (q) {
    case "rectangle": return [[30, 40], [190, 40], [190, 140], [30, 140]];
    case "square": return [[55, 30], [165, 30], [165, 140], [55, 140]];
    case "rhombus": return [[110, 18], [185, 92], [110, 166], [35, 92]];
    case "kite": return [[110, 20], [170, 70], [110, 166], [50, 70]];
    case "trapezium": return [[70, 40], [160, 40], [200, 140], [20, 140]];
    case "general": return [[45, 35], [180, 55], [195, 145], [25, 130]];
    case "house": return [[30, 150], [30, 80], [110, 22], [190, 80], [190, 150]];
    case "parallelogram":
    default: return [[60, 40], [200, 40], [160, 140], [20, 140]];
  }
}

const toward = (p: P, c: P, t: number): P => [p[0] + (c[0] - p[0]) * t, p[1] + (c[1] - p[1]) * t];
const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const centroid = (ps: P[]): P => [ps.reduce((s, p) => s + p[0], 0) / ps.length, ps.reduce((s, p) => s + p[1], 0) / ps.length];
const pts = (ps: P[]) => ps.map((p) => p.join(",")).join(" ");
/** Side label just outside the middle of edge a-b, anchored so it never covers the edge. */
function outside(a: P, b: P, c: P): { at: P; anchor: "start" | "middle" | "end" } {
  const m = mid(a, b);
  const dx = m[0] - c[0], dy = m[1] - c[1];
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d, uy = dy / d;
  const anchor = Math.abs(ux) < 0.35 ? "middle" : ux < 0 ? "end" : "start";
  return { at: [m[0] + ux * 8, m[1] + uy * 12 + 4], anchor };
}

function Shape2D({ ps, spec }: { ps: P[]; spec: FigureSpec }) {
  const c = centroid(ps);
  const o: P = ps.length === 4 ? [(ps[0][0] + ps[2][0]) / 2, (ps[0][1] + ps[2][1]) / 2] : c;
  return (
    <>
      <polygon points={pts(ps)} className="fig-fill" />
      {spec.fan && ps.slice(2, -1).map((p, i) => <line key={i} x1={ps[0][0]} y1={ps[0][1]} x2={p[0]} y2={p[1]} className="fig-thin" />)}
      {spec.diagonals && (
        <>
          <line x1={ps[0][0]} y1={ps[0][1]} x2={ps[2][0]} y2={ps[2][1]} className="fig-thin" />
          <line x1={ps[1][0]} y1={ps[1][1]} x2={ps[3][0]} y2={ps[3][1]} className="fig-thin" />
          <circle cx={o[0]} cy={o[1]} r={2.5} className="fig-dot" />
          <text x={o[0] + 6} y={o[1] - 5} className="fig-small">O</text>
        </>
      )}
      {spec.diagonalLabels?.map((l, i) => {
        const m = mid(ps[i], o);
        return l ? <text key={`d${i}`} x={m[0] + 4} y={m[1] - 4} className="fig-small fig-accent">{l}</text> : null;
      })}
      {spec.heightLabel && (() => {
        const bottom = Math.max(...ps.map((p) => p[1]));
        const top = spec.quad === "house" ? ps[2] : ps[0];
        return (
          <>
            <line x1={top[0]} y1={top[1]} x2={top[0]} y2={bottom} className="fig-thin" />
            <text x={top[0] + 6} y={(top[1] + bottom) / 2 + 4} className="fig-label fig-accent">{spec.heightLabel}</text>
          </>
        );
      })()}
      {spec.angleLabels?.map((l, i) => {
        const p = toward(ps[i], c, ps.length > 4 ? 0.34 : 0.26);
        return l ? <text key={`a${i}`} x={p[0]} y={p[1] + 4} className="fig-label" textAnchor="middle">{l}</text> : null;
      })}
      {spec.sideLabels?.map((l, i) => {
        const { at, anchor } = outside(ps[i], ps[(i + 1) % ps.length], c);
        return l ? <text key={`s${i}`} x={at[0]} y={at[1]} className="fig-label fig-accent" textAnchor={anchor}>{l}</text> : null;
      })}
      {spec.vertexLabels?.map((l, i) => {
        const p = toward(ps[i], c, -0.12);
        return l ? <text key={`v${i}`} x={p[0]} y={p[1] + 4} className="fig-label" textAnchor="middle">{l}</text> : null;
      })}
    </>
  );
}

/** Solids: a front face, a back face shifted up and right, and the edges joining them (hidden ones dashed). */
function Solid({ solid }: { solid: NonNullable<FigureSpec["solid"]> }) {
  const lines: [P, P, boolean][] = []; // from, to, hidden
  const prism = (front: P[], d: P, hiddenBack: number[]) => {
    const back = front.map((p) => [p[0] + d[0], p[1] + d[1]] as P);
    front.forEach((p, i) => lines.push([p, front[(i + 1) % front.length], false]));
    back.forEach((p, i) => {
      const j = (i + 1) % back.length;
      lines.push([p, back[j], hiddenBack.includes(i) || hiddenBack.includes(j)]);
    });
    front.forEach((p, i) => lines.push([p, back[i], hiddenBack.includes(i)]));
  };
  const pyramid = (base: P[], apex: P, hidden: number[]) => {
    base.forEach((p, i) => {
      const j = (i + 1) % base.length;
      lines.push([p, base[j], hidden.includes(i) || hidden.includes(j)]);
      lines.push([p, apex, hidden.includes(i)]);
    });
  };
  const ngon = (n: number, cx: number, cy: number, r: number, squash = 1): P[] => Array.from({ length: n }, (_, i) => {
    const a = Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * squash * Math.sin(a)];
  });
  switch (solid) {
    case "cube": prism([[40, 70], [120, 70], [120, 150], [40, 150]], [45, -40], [3]); break;
    case "cuboid": prism([[25, 85], [150, 85], [150, 150], [25, 150]], [45, -40], [3]); break;
    case "triangular-prism": prism([[30, 150], [110, 150], [70, 80]], [70, -40], [0]); break;
    case "pentagonal-prism": prism(ngon(5, 70, 105, 48), [70, -40], [1]); break;
    case "hexagonal-prism": prism(ngon(6, 70, 105, 48), [70, -40], [1]); break;
    case "square-pyramid": pyramid([[40, 140], [140, 140], [180, 110], [80, 110]], [110, 25], [3]); break;
    case "tetrahedron": pyramid([[35, 145], [175, 145], [125, 112]], [100, 25], [2]); break;
    case "pentagonal-pyramid": pyramid(ngon(5, 110, 135, 70, 0.32), [110, 20], [3]); break;
    case "cylinder":
      return (
        <>
          <ellipse cx={110} cy={40} rx={60} ry={16} className="fig-edge fig-nofill" />
          <path d="M 50 145 A 60 16 0 0 0 170 145" className="fig-edge fig-nofill" />
          <path d="M 50 145 A 60 16 0 0 1 170 145" className="fig-hidden fig-nofill" />
          <line x1={50} y1={40} x2={50} y2={145} className="fig-edge" />
          <line x1={170} y1={40} x2={170} y2={145} className="fig-edge" />
          <line x1={110} y1={40} x2={170} y2={40} className="fig-thin" />
          <circle cx={110} cy={40} r={2.5} className="fig-dot" />
        </>
      );
  }
  return (
    <>
      {lines.map(([a, b, hidden], i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={hidden ? "fig-hidden" : "fig-edge"} />
      ))}
    </>
  );
}

function Circle({ spec }: { spec: FigureSpec }) {
  const r = 70;
  const at = (deg: number): P => [CX + r * Math.cos((deg * Math.PI) / 180), CY + r * Math.sin((deg * Math.PI) / 180)];
  const A = at(200), B = at(330), P_ = at(-40);
  const arc = (a: P, b: P) => `M ${a[0]} ${a[1]} A ${r} ${r} 0 0 1 ${b[0]} ${b[1]}`;
  const label = (p: P, t: string, dx = 0, dy = 0) => <text x={p[0] + dx} y={p[1] + dy} className="fig-label" textAnchor="middle">{t}</text>;
  const part = spec.part ?? "radius";
  return (
    <>
      <circle cx={CX} cy={CY} r={r} className="fig-circle" />
      <circle cx={CX} cy={CY} r={2.5} className="fig-dot" />
      {label([CX, CY], "O", 0, 16)}
      {part === "radius" && <><line x1={CX} y1={CY} x2={P_[0]} y2={P_[1]} className="fig-hi" />{label(P_, "P", 10, -4)}</>}
      {part === "diameter" && <><line x1={CX - r} y1={CY} x2={CX + r} y2={CY} className="fig-hi" />{label([CX - r, CY], "A", -10, 4)}{label([CX + r, CY], "B", 10, 4)}</>}
      {part === "chord" && <><line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} className="fig-hi" />{label(A, "A", -10, 0)}{label(B, "B", 10, 0)}</>}
      {part === "arc" && <><path d={arc(A, B)} className="fig-hi fig-nofill" />{label(A, "A", -10, 0)}{label(B, "B", 10, 0)}</>}
      {part === "sector" && <><path d={`M ${CX} ${CY} L ${A[0]} ${A[1]} ${arc(A, B).replace(/^M [^A]+/, "")} Z`} className="fig-region" />{label(A, "A", -10, 0)}{label(B, "B", 10, 0)}</>}
      {part === "segment" && <><path d={`${arc(A, B)} Z`} className="fig-region" />{label(A, "A", -10, 0)}{label(B, "B", 10, 0)}</>}
      {part === "semicircle" && <><path d={`M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY} Z`} className="fig-region" />{label([CX - r, CY], "A", -10, 4)}{label([CX + r, CY], "B", 10, 4)}</>}
      {part === "two-chords" && (() => {
        const C = at(140), D = at(60), E = at(-30), F = at(150);
        return <>
          <line x1={E[0]} y1={E[1]} x2={F[0]} y2={F[1]} className="fig-edge" />{label(E, "A", 10, 0)}{label(F, "B", -10, 4)}
          <line x1={C[0]} y1={C[1]} x2={D[0]} y2={D[1]} className="fig-edge" />{label(C, "C", -10, 8)}{label(D, "D", 8, 12)}
        </>;
      })()}
      {spec.partLabel && <text x={part === "radius" ? (CX + P_[0]) / 2 - 16 : CX} y={part === "radius" ? (CY + P_[1]) / 2 - 8 : CY - 8} className="fig-label fig-accent" textAnchor="middle">{spec.partLabel}</text>}
    </>
  );
}

const PIE = ["#cfe6b4", "#f6d9a6", "#c9dff2", "#f3c4cf", "#ddd2f2", "#e9e4c3"];
function Pie({ slices }: { slices: { value: number; label: string }[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const r = 78;
  let a0 = -Math.PI / 2;
  return (
    <>
      {slices.map((s, i) => {
        const a1 = a0 + (2 * Math.PI * s.value) / total;
        const [x0, y0] = [CX + r * Math.cos(a0), CY + r * Math.sin(a0)];
        const [x1, y1] = [CX + r * Math.cos(a1), CY + r * Math.sin(a1)];
        const mid = (a0 + a1) / 2;
        const big = a1 - a0 > Math.PI ? 1 : 0;
        const lx = CX + r * 0.6 * Math.cos(mid), ly = CY + r * 0.6 * Math.sin(mid);
        const d = slices.length === 1 ? undefined : `M ${CX} ${CY} L ${x0} ${y0} A ${r} ${r} 0 ${big} 1 ${x1} ${y1} Z`;
        a0 = a1;
        return (
          <g key={i}>
            {d ? <path d={d} fill={PIE[i % PIE.length]} className="fig-slice" /> : <circle cx={CX} cy={CY} r={r} fill={PIE[0]} className="fig-slice" />}
            <text x={lx} y={ly + 4} className="fig-small fig-pie-label" textAnchor="middle">{s.label}</text>
          </g>
        );
      })}
    </>
  );
}

export function Figure({ spec }: { spec: FigureSpec }) {
  let body;
  if (spec.figure === "polygon") body = <Shape2D ps={polygonPoints(spec.sides ?? 5, !!spec.regular)} spec={spec} />;
  else if (spec.figure === "quad") body = <Shape2D ps={quadPoints(spec.quad ?? "parallelogram")} spec={spec} />;
  else if (spec.figure === "solid") body = <Solid solid={spec.solid ?? "cube"} />;
  else if (spec.figure === "pie") body = <Pie slices={spec.slices ?? []} />;
  else body = <Circle spec={spec} />;
  return (
    <div className="shape-diagram">
      <svg viewBox="-34 -4 288 196" className="shape-svg fig-svg">{body}</svg>
      {spec.note && <div className="shape-note">{spec.note}</div>}
    </div>
  );
}
