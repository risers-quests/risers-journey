import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { FigureSpec, ShadeActivity } from "../../types.js";

/**
 * Understanding Shapes, Grade 8 (book chapter 16), including polygons:
 * the angle sum of a quadrilateral (360°), of any polygon ((n − 2) × 180°),
 * exterior angles (always 360° in all), regular polygons, diagonals.
 *   concrete  hands-on: each square is 10°; shade an angle sum, a missing
 *             angle, one exterior angle of a regular polygon
 *   pictorial polygons with their angles marked; triangles from one corner;
 *             regular polygons
 *   abstract  angle sums, exterior angles, a regular polygon's angle, sides
 *             from an angle, diagonals
 */

const TOPIC = "g8-shapes";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "shp-quad-180": {
    label: "Uses 180° for a quadrilateral",
    detail: "Takes the angles of a quadrilateral to add up to 180°, like a triangle.",
    childTip: "A diagonal splits a quadrilateral into 2 triangles: 2 × 180° = 360°.",
  },
  "shp-sum-360": {
    label: "Thinks every polygon's angles add up to 360°",
    detail: "Uses 360° for a pentagon or hexagon too.",
    childTip: "Each extra side adds a triangle: (n − 2) × 180°. A pentagon is 540°.",
  },
  "shp-sum-n180": {
    label: "Uses n × 180° for the angle sum",
    detail: "Counts one triangle per side instead of n − 2.",
    childTip: "From one corner, an n-sided polygon splits into n − 2 triangles.",
  },
  "shp-exterior-interior": {
    label: "Mixes up exterior and interior angles",
    detail: "Gives the inside angle when the outside (exterior) angle was asked for, or the other way round.",
    childTip: "Interior + exterior at a corner = 180°. Exterior angles of any polygon add up to 360°.",
  },
  "shp-exterior-sum": {
    label: "Thinks exterior angles add up like interior ones",
    detail: "Uses (n − 2) × 180° for the exterior angles.",
    childTip: "Walk round any polygon and you turn exactly once: exterior angles add up to 360°.",
  },
  "shp-no-divide": {
    label: "Forgets to share the sum between the angles",
    detail: "Gives the whole angle sum as one angle of a regular polygon.",
    childTip: "A regular polygon's angles are all equal: divide the sum by the number of angles.",
  },
  "shp-diagonals": {
    label: "Counts sides as diagonals",
    detail: "Uses n(n − 1) ÷ 2, which joins every pair of corners, including neighbours (the sides).",
    childTip: "From each corner, n − 3 diagonals go out; each is counted twice: n(n − 3) ÷ 2.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `shp8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const deg = (target: number, wrong: { value: number; mistake: string }[]): ShadeActivity => ({
  kind: "shade",
  rows: 10,
  cols: 10,
  target,
  unit: "Each square = 10°",
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= 100 && wrong.findIndex((x) => x.value === w.value) === i),
});
const NAME: Record<number, string> = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "nonagon", 10: "decagon", 12: "dodecagon" };
const poly = (sides: number, extra: Partial<FigureSpec> = {}): FigureSpec => ({ kind: "figure", figure: "polygon", sides, ...extra });
/** Angles (multiples of 5°) for an n-gon that add to (n − 2) × 180, each between 60° and 170°. */
function angles(rng: Rng, n: number): number[] {
  for (;;) {
    const a = Array.from({ length: n - 1 }, () => 5 * int(rng, 14, 32));
    const last = (n - 2) * 180 - a.reduce((s, x) => s + x, 0);
    if (last >= 60 && last <= 170 && last % 5 === 0 && !a.includes(last)) return [...a, last];
  }
}

export const SHAPES_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: each square is 10° ----------------
  "concrete|remember": (rng) => buildActivity(
    { ...base("c-remember", "concrete", "remember", "quadrilateral sum", rng), prompt: "Each square is 10°. Shade the total of the four angles of a quadrilateral.", representation: poly(4) },
    { n: Math.floor(rng() * 1e6) },
    deg(36, [{ value: 18, mistake: "shp-quad-180" }])
  ),
  "concrete|understand": (rng) => {
    const n = pick(rng, [5, 6]);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "polygon sum", rng), prompt: `Each square is 10°. Shade the total of the angles of a ${NAME[n]}.`, representation: poly(n, { fan: true }) },
      { n },
      deg((n - 2) * 18, [{ value: 36, mistake: "shp-sum-360" }, { value: n * 18, mistake: "shp-sum-n180" }])
    );
  },
  "concrete|apply": (rng) => {
    const [a, b, c] = [10 * int(rng, 6, 11), 10 * int(rng, 6, 11), 10 * int(rng, 6, 11)];
    const d = 360 - a - b - c;
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "missing angle", rng), prompt: `Three angles of a quadrilateral are ${a}°, ${b}° and ${c}°. Each square is 10°. Shade the fourth angle.`, representation: poly(4, { angleLabels: [`${a}°`, `${b}°`, `${c}°`, "?"] }) },
      { a, b, c },
      deg(d / 10, [{ value: (540 - a - b - c) / 10, mistake: "shp-sum-n180" }, { value: (a + b + c - 180) / 10, mistake: "shp-quad-180" }])
    );
  },
  "concrete|analyze": (rng) => {
    const n = pick(rng, [4, 6, 9, 12, 18, 36]);
    return buildActivity(
      { ...base("c-analyze", "concrete", "analyze", "exterior angles", rng), prompt: `Each square is 10°. Shade ONE exterior angle of a regular polygon with ${n} sides.`, representation: null },
      { n },
      deg(36 / n, [{ value: (180 - 360 / n) / 10, mistake: "shp-exterior-interior" }, { value: ((n - 2) * 18) / n, mistake: "shp-exterior-sum" }])
    );
  },
  "concrete|evaluate": (rng) => {
    const n = pick(rng, [5, 6]);
    const a = angles(rng, n).map((x) => 10 * Math.round(x / 10));
    const sum = a.slice(0, -1).reduce((s, x) => s + x, 0);
    const last = (n - 2) * 180 - sum;
    if (last < 30 || last > 200) return SHAPES_G8_TEMPLATES["concrete|evaluate"](rng);
    return buildActivity(
      {
        ...base("c-evaluate", "concrete", "evaluate", "missing angle", rng),
        prompt: `A ${NAME[n]} has angles ${a.slice(0, -1).map((x) => `${x}°`).join(", ")} and one more. Each square is 10°. Shade the missing angle.`,
        representation: poly(n, { angleLabels: [...a.slice(0, -1).map((x) => `${x}°`), "?"] }),
      },
      { n, s: sum },
      deg(last / 10, [{ value: (360 - sum) / 10, mistake: "shp-sum-360" }, { value: (n * 180 - sum) / 10, mistake: "shp-sum-n180" }])
    );
  },

  // ---------------- PICTORIAL: polygons ----------------
  "pictorial|remember": (rng) => {
    const a = angles(rng, 4);
    return build(
      { ...base("p-remember", "pictorial", "remember", "quadrilateral sum", rng), prompt: "Find the angle marked x.", representation: poly(4, { angleLabels: [`${a[0]}°`, `${a[1]}°`, `${a[2]}°`, "x"] }) },
      { a: a[0], b: a[1], c: a[2] },
      `${a[3]}°`,
      [
        { text: `${540 - a[0] - a[1] - a[2]}°`, mistake: "shp-sum-n180" },
        { text: `${a[3] + 10}°`, mistake: null },
        { text: `${Math.abs(180 - a[0] - a[1] - a[2])}°`, mistake: "shp-quad-180" },
        { text: `${a[3] - 10}°`, mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const n = int(rng, 5, 8);
    return build(
      { ...base("p-understand", "pictorial", "understand", "polygon sum", rng), prompt: `Lines from one corner split this ${NAME[n]} into triangles. How many triangles, and what do its angles add up to?`, representation: poly(n, { fan: true }) },
      { n },
      `${n - 2} triangles, ${(n - 2) * 180}°`,
      [
        { text: `${n} triangles, ${n * 180}°`, mistake: "shp-sum-n180" },
        { text: `${n - 2} triangles, 360°`, mistake: "shp-sum-360" },
        { text: `${n - 3} triangles, ${(n - 3) * 180}°`, mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const n = pick(rng, [5, 6, 8, 9, 10, 12]);
    const I = 180 - 360 / n;
    return build(
      { ...base("p-apply", "pictorial", "apply", "regular polygons", rng), prompt: `This is a regular ${NAME[n]}. What is each interior angle?`, representation: poly(n, { regular: true }) },
      { n },
      `${I}°`,
      [
        { text: `${360 / n}°`, mistake: "shp-exterior-interior" },
        { text: `${(n - 2) * 180}°`, mistake: "shp-no-divide" },
        { text: `${+(360 - 360 / n).toFixed(1)}°`, mistake: null },
        { text: `${+((n * 180) / n).toFixed(1)}°`, mistake: "shp-sum-n180" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const a = angles(rng, 5);
    return build(
      { ...base("p-analyze", "pictorial", "analyze", "missing angle", rng), prompt: "Find the angle marked x in this pentagon.", representation: poly(5, { angleLabels: [...a.slice(0, 4).map((x) => `${x}°`), "x"] }) },
      { a: a[0], b: a[1], c: a[2], d: a[3] },
      `${a[4]}°`,
      [
        { text: `${a[4] - 180}°`, mistake: "shp-sum-360" },
        { text: `${a[4] + 360}°`, mistake: "shp-sum-n180" },
        { text: `${a[4] + 10}°`, mistake: null },
        { text: `${a[4] - 10}°`, mistake: null },
      ].filter((w) => !w.text.startsWith("-"))
    );
  },
  "pictorial|evaluate": (rng) => {
    const n = pick(rng, [5, 6, 8, 9, 10, 12]);
    const e = 360 / n;
    return build(
      { ...base("p-evaluate", "pictorial", "evaluate", "exterior angles", rng), prompt: `Each exterior angle of this regular polygon is ${e}°. What do its interior angles add up to?`, representation: poly(n, { regular: true }) },
      { n },
      `${(n - 2) * 180}°`,
      [
        { text: "360°", mistake: "shp-exterior-sum" },
        { text: `${n * 180}°`, mistake: "shp-sum-n180" },
        { text: `${180 - e}°`, mistake: "shp-no-divide" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const n = pick(rng, [5, 6, 7, 8, 9, 10, 12]);
    return build(
      { ...base("a-remember", "abstract", "remember", "polygon sum", rng), prompt: `What do the interior angles of a ${NAME[n]} (${n} sides) add up to?`, representation: null },
      { n },
      `${(n - 2) * 180}°`,
      [
        { text: `${n * 180}°`, mistake: "shp-sum-n180" },
        { text: "360°", mistake: "shp-sum-360" },
        { text: `${(n - 1) * 180}°`, mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const n = pick(rng, [5, 6, 7, 8, 9, 10, 12]);
    return build(
      { ...base("a-understand", "abstract", "understand", "exterior angles", rng), prompt: `What do the exterior angles of a ${NAME[n]} add up to (one at each corner)?`, representation: null },
      { n },
      "360°",
      [
        { text: `${(n - 2) * 180}°`, mistake: "shp-exterior-sum" },
        { text: `${n * 180}°`, mistake: "shp-sum-n180" },
        { text: "180°", mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const n = pick(rng, [5, 6, 8, 9, 10, 12, 15, 18, 20]);
    return build(
      { ...base("a-apply", "abstract", "apply", "regular polygons", rng), prompt: `Each interior angle of a regular polygon with ${n} sides is…`, representation: null },
      { n },
      `${180 - 360 / n}°`,
      [
        { text: `${360 / n}°`, mistake: "shp-exterior-interior" },
        { text: `${(n - 2) * 180}°`, mistake: "shp-no-divide" },
        { text: `${+(360 - 360 / n).toFixed(1)}°`, mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const n = pick(rng, [5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 36]);
    const I = 180 - 360 / n;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "regular polygons", rng), prompt: `Each interior angle of a regular polygon is ${I}°. How many sides does it have?`, representation: null },
      { n },
      String(n),
      [
        { text: String(+(360 / I).toFixed(2)), mistake: "shp-exterior-interior" },
        { text: String(n + 2), mistake: null },
        { text: String(n - 2), mistake: "shp-sum-n180" },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const n = int(rng, 5, 15);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "diagonals", rng), prompt: `How many diagonals does a polygon with ${n} sides have?`, representation: null },
      { n },
      String((n * (n - 3)) / 2),
      [
        { text: String((n * (n - 1)) / 2), mistake: "shp-diagonals" },
        { text: String(n * (n - 3)), mistake: null },
        { text: String(n - 3), mistake: null },
        { text: String((n * (n - 3)) / 2 + 1), mistake: null },
        { text: String(n), mistake: null },
      ]
    );
  },
};
