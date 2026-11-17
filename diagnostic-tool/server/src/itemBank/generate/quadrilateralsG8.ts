import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { FigureSpec, ShadeActivity } from "../../types.js";

/**
 * Special Types of Quadrilaterals, Grade 8 (book chapter 17), properties by
 * verification: a parallelogram's opposite sides and angles are equal and
 * its diagonals bisect each other; a rectangle's diagonals are equal; a
 * rhombus's diagonals bisect each other at right angles; a square's are
 * equal and at right angles. And how the shapes belong to each other.
 *   concrete  hands-on: each square is 10° (or 1 cm); shade an opposite
 *             angle, a next-door angle, half a diagonal, half a rhombus angle
 *   pictorial the quadrilaterals with angles and diagonals marked
 *   abstract  opposite and next-door angles, equal diagonals, which
 *             properties fit, which shape is also which
 */

const TOPIC = "g8-quadrilaterals";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "qd-opposite-sum": {
    label: "Thinks opposite angles add up to 180°",
    detail: "Opposite angles of a parallelogram are equal; it's next-door angles that add up to 180°.",
    childTip: "Opposite angles: equal. Next-door angles: add to 180°.",
  },
  "qd-adjacent-equal": {
    label: "Thinks next-door angles are equal",
    detail: "Gives a parallelogram's next-door angle the same size, instead of 180° minus it.",
    childTip: "Next-door angles of a parallelogram add up to 180°.",
  },
  "qd-adjacent-360": {
    label: "Uses 360° for two next-door angles",
    detail: "Sets two next-door angles of a parallelogram equal to 360° in total.",
    childTip: "All four angles make 360°; two next-door ones make 180°.",
  },
  "qd-bisect-whole": {
    label: "Mixes up half a diagonal and the whole",
    detail: "Diagonals bisect each other: each part is half the diagonal, not all of it.",
    childTip: "Bisect means cut into two equal halves: AO is half of AC.",
  },
  "qd-not-halved": {
    label: "Doesn't halve the angle at the diagonal",
    detail: "A rhombus's diagonal cuts its angle in half.",
    childTip: "In a rhombus, each diagonal splits the corner's angle into two equal parts.",
  },
  "qd-diag-equal-all": {
    label: "Thinks all diagonals are equal",
    detail: "Diagonals are equal only in a rectangle (and a square), not in every parallelogram or rhombus.",
    childTip: "Equal diagonals: rectangle and square only.",
  },
  "qd-diag-right-all": {
    label: "Thinks all diagonals meet at right angles",
    detail: "Diagonals meet at 90° only in a rhombus (and a square).",
    childTip: "Diagonals at right angles: rhombus and square only.",
  },
  "qd-hierarchy": {
    label: "Doesn't see which shapes are also which",
    detail: "Thinks a square is not a rectangle or a rhombus, or that every rectangle is a square.",
    childTip: "A square is a rectangle AND a rhombus: it has all their properties. Not the other way round.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `qd8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const shade = (target: number, wrong: { value: number; mistake: string }[], unit: string): ShadeActivity => ({
  kind: "shade",
  rows: 10,
  cols: 10,
  target,
  unit,
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= 100 && wrong.findIndex((x) => x.value === w.value) === i),
});
const quad = (q: FigureSpec["quad"], extra: Partial<FigureSpec> = {}): FigureSpec => ({ kind: "figure", figure: "quad", quad: q, vertexLabels: ["A", "B", "C", "D"], ...extra });
const notRight = (rng: Rng, lo: number, hi: number, step: number) => {
  for (;;) {
    const a = step * int(rng, lo / step, hi / step);
    if (a !== 90) return a;
  }
};
type Kind = "parallelogram" | "rectangle" | "rhombus" | "square";
const DIAG: Record<Kind, { right: boolean; equal: boolean }> = {
  parallelogram: { right: false, equal: false },
  rectangle: { right: false, equal: true },
  rhombus: { right: true, equal: false },
  square: { right: true, equal: true },
};
const px = (k: number) => (k === 1 ? "x" : `${k}x`);
const diagText = (right: boolean, equal: boolean) => `${right ? "At 90°" : "Not at 90°"}, ${equal ? "equal" : "not equal"}`;

export const QUADRILATERALS_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng) => {
    const a = notRight(rng, 40, 140, 10);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "opposite angles", rng), prompt: `In parallelogram ABCD, angle A is ${a}°. Each square is 10°. Shade angle C (opposite A).`, representation: quad("parallelogram", { angleLabels: [`${a}°`, "", "?", ""] }) },
      { a },
      shade(a / 10, [{ value: (180 - a) / 10, mistake: "qd-opposite-sum" }], "Each square = 10°")
    );
  },
  "concrete|understand": (rng) => {
    const a = notRight(rng, 40, 140, 10);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "next-door angles", rng), prompt: `In parallelogram ABCD, angle A is ${a}°. Each square is 10°. Shade angle B (next to A).`, representation: quad("parallelogram", { angleLabels: [`${a}°`, "?", "", ""] }) },
      { a },
      shade((180 - a) / 10, [{ value: a / 10, mistake: "qd-adjacent-equal" }, { value: (360 - a) / 10, mistake: "qd-adjacent-360" }], "Each square = 10°")
    );
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 2, 9);
    const q = pick(rng, ["parallelogram", "rectangle", "rhombus"] as const);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "diagonals bisect", rng), prompt: `In this ${q}, diagonal AC is ${2 * k} cm. The diagonals cross at O. Each square is 1 cm. Shade the length AO.`, representation: quad(q, { diagonals: true, note: `AC = ${2 * k} cm` }) },
      { k, q: ["parallelogram", "rectangle", "rhombus"].indexOf(q) },
      shade(k, [{ value: 2 * k, mistake: "qd-bisect-whole" }], "Each square = 1 cm")
    );
  },
  "concrete|analyze": (rng) => {
    const a = notRight(rng, 40, 160, 20);
    return buildActivity(
      { ...base("c-analyze", "concrete", "analyze", "rhombus diagonals", rng), prompt: `In rhombus ABCD, angle A is ${a}°. Diagonal AC cuts it in two. Each square is 10°. Shade angle CAB.`, representation: quad("rhombus", { diagonals: true, angleLabels: [`${a}°`, "", "", ""] }) },
      { a },
      shade(a / 20, [{ value: a / 10, mistake: "qd-not-halved" }], "Each square = 10°")
    );
  },
  "concrete|evaluate": (rng) => {
    const name = pick(rng, ["Kabir", "Riya", "Arjun", "Meera", "Diya", "Rohan"]);
    const q = pick(rng, ["parallelogram", "rectangle"] as const);
    return build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "diagonals", rng),
        prompt: `Each square is 10°. Shade the angle at which a rhombus's diagonals cross. ${name} says the diagonals of every ${q} cross at that angle too. Is ${name} right?`,
        representation: quad("rhombus", { diagonals: true }),
        activity: shade(9, [], "Each square = 10°"),
      },
      { q: q === "rectangle" ? 1 : 0 },
      `No: only a rhombus's (or a square's) diagonals cross at 90°`,
      [
        { text: `Yes: every ${q}'s diagonals cross at 90°`, mistake: "qd-diag-right-all" },
        { text: `Yes: diagonals always bisect each other at 90°`, mistake: "qd-diag-right-all" },
        { text: `No: a rhombus's diagonals don't cross at 90° either`, mistake: null },
      ]
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const a = notRight(rng, 40, 140, 5);
    return build(
      { ...base("p-remember", "pictorial", "remember", "next-door angles", rng), prompt: "ABCD is a parallelogram. Find x.", representation: quad("parallelogram", { angleLabels: [`${a}°`, "x", "", ""] }) },
      { a },
      `${180 - a}°`,
      [
        { text: `${a}°`, mistake: "qd-adjacent-equal" },
        { text: `${360 - a}°`, mistake: "qd-adjacent-360" },
        { text: "90°", mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const k = int(rng, 3, 15);
    return build(
      { ...base("p-understand", "pictorial", "understand", "rectangle diagonals", rng), prompt: `ABCD is a rectangle and AO = ${k} cm. How long is diagonal BD?`, representation: quad("rectangle", { diagonals: true, diagonalLabels: [`${k} cm`, "", "", ""] }) },
      { k },
      `${2 * k} cm`,
      [
        { text: `${k} cm`, mistake: "qd-bisect-whole" },
        { text: `${4 * k} cm`, mistake: null },
        { text: "You can't tell: BD isn't marked", mistake: "qd-diag-equal-all" },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const [p, q] = pick(rng, [[3, 2], [4, 5], [7, 2], [5, 1], [2, 1], [3, 1], [5, 4], [7, 5], [2, 7]] as const);
    const x = 180 / (p + q);
    return build(
      { ...base("p-apply", "pictorial", "apply", "next-door angles", rng), prompt: `In this parallelogram, two next-door angles are ${px(p)} and ${px(q)}. What is the larger angle?`, representation: quad("parallelogram", { angleLabels: [px(p), px(q), "", ""] }) },
      { p, q },
      `${Math.max(p, q) * x}°`,
      [
        { text: `${Math.max(p, q) * (360 / (p + q))}°`, mistake: "qd-adjacent-360" },
        { text: `${x}°`, mistake: null },
        { text: `${Math.min(p, q) * x}°`, mistake: null },
        { text: "90°", mistake: "qd-adjacent-equal" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const kind = pick(rng, ["parallelogram", "rectangle", "rhombus", "square"] as const);
    const d = DIAG[kind];
    const options = [
      { right: !d.right, equal: d.equal, mistake: d.right ? null : "qd-diag-right-all" },
      { right: d.right, equal: !d.equal, mistake: d.equal ? null : "qd-diag-equal-all" },
      { right: !d.right, equal: !d.equal, mistake: null },
    ];
    return build(
      { ...base("p-analyze", "pictorial", "analyze", "diagonals", rng), prompt: `ABCD is a ${kind}. How do its diagonals cross: at 90° or not, and equal or not?`, representation: quad(kind, { diagonals: true }) },
      { k: ["parallelogram", "rectangle", "rhombus", "square"].indexOf(kind) },
      diagText(d.right, d.equal),
      options.map((o) => ({ text: diagText(o.right, o.equal), mistake: o.mistake }))
    );
  },
  "pictorial|evaluate": (rng) => {
    const name = pick(rng, ["Riya", "Arjun", "Meera", "Kabir", "Diya", "Rohan"]);
    return build(
      { ...base("p-evaluate", "pictorial", "evaluate", "which shape is which", rng), prompt: `${name} says this square is also a rectangle and a rhombus. Is ${name} right?`, representation: quad("square", { diagonals: true }) },
      { n: Math.floor(rng() * 1e6) },
      "Yes: it has every property of both",
      [
        { text: "No: a square is only a square", mistake: "qd-hierarchy" },
        { text: "It's a rectangle, but not a rhombus", mistake: "qd-hierarchy" },
        { text: "It's a rhombus, but not a rectangle", mistake: "qd-hierarchy" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const a = notRight(rng, 40, 140, 5);
    return build(
      { ...base("a-remember", "abstract", "remember", "opposite angles", rng), prompt: `In parallelogram PQRS, angle P = ${a}° and angle Q = ${180 - a}°. What is angle R?`, representation: null },
      { a },
      `${a}°`,
      [
        { text: `${180 - a}°`, mistake: "qd-opposite-sum" },
        { text: `${360 - a}°`, mistake: null },
        { text: "90°", mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    for (;;) {
      const x = int(rng, 20, 50), p = int(rng, 0, 30), q = 180 - 3 * x - p;
      if (q < -20 || q > 40 || q === p) continue;
      const A = x + p, B = 2 * x + q;
      if (A === B || A <= 0 || B <= 0) continue;
      const fmtB = q === 0 ? "2x" : `2x ${q > 0 ? "+" : "−"} ${Math.abs(q)}`;
      const fmtA = p === 0 ? "x" : `x + ${p}`;
      return build(
        { ...base("a-understand", "abstract", "understand", "next-door angles", rng), prompt: `Two next-door angles of a parallelogram are (${fmtA})° and (${fmtB})°. What is the smaller angle?`, representation: null },
        { x, p },
        `${Math.min(A, B)}°`,
        [
          { text: `${x}°`, mistake: null },
          { text: `${Math.max(A, B)}°`, mistake: null },
          { text: `${Math.min((360 - p - q) / 3 + p, (2 * (360 - p - q)) / 3 + q)}°`, mistake: "qd-adjacent-360" },
          { text: "90°", mistake: "qd-adjacent-equal" },
        ].filter((w) => Number.isInteger(parseFloat(w.text)))
      );
    }
  },
  "abstract|apply": (rng) => {
    const x = int(rng, 2, 9), a = int(rng, 2, 4), c = a + int(rng, 1, 3), b = int(rng, 1, 12);
    const d = a * x + b - c * x;
    const AC = a * x + b;
    const fmtD = d === 0 ? `${c}x` : `${c}x ${d > 0 ? "+" : "−"} ${Math.abs(d)}`;
    return build(
      { ...base("a-apply", "abstract", "apply", "rectangle diagonals", rng), prompt: `In rectangle ABCD, AC = (${a}x + ${b}) cm and BD = (${fmtD}) cm. How long is AC?`, representation: null },
      { x, a, c, b },
      `${AC} cm`,
      [
        { text: `${x} cm`, mistake: null },
        { text: `${AC / 2} cm`, mistake: "qd-bisect-whole" },
        { text: `${2 * AC} cm`, mistake: "qd-bisect-whole" },
        { text: "You can't tell: AC and BD aren't equal", mistake: "qd-diag-equal-all" },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const kind = pick(rng, ["parallelogram", "rectangle", "rhombus"] as const);
    const right = { parallelogram: "Its diagonals bisect each other", rectangle: "Its diagonals are equal and bisect each other", rhombus: "Its diagonals bisect each other at right angles" }[kind];
    return build(
      { ...base("a-analyze", "abstract", "analyze", "properties", rng), prompt: `Which is true for every ${kind}?`, representation: null },
      { k: ["parallelogram", "rectangle", "rhombus"].indexOf(kind) },
      right,
      [
        ...(kind !== "rectangle" ? [{ text: "Its diagonals are equal", mistake: "qd-diag-equal-all" }] : []),
        ...(kind !== "rhombus" ? [{ text: "Its diagonals meet at right angles", mistake: "qd-diag-right-all" }] : []),
        { text: "All its angles are equal", mistake: kind === "rectangle" ? null : "qd-adjacent-equal" },
        { text: "Its next-door angles are equal", mistake: "qd-adjacent-equal" },
      ].filter((w) => w.text !== right)
    );
  },
  "abstract|evaluate": (rng) => {
    const v = int(rng, 0, 2);
    const right = ["Every square is a rhombus", "Every square is a rectangle", "Every rectangle is a parallelogram"][v];
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "which shape is which", rng), prompt: "Which of these is always true?", representation: null },
      { v },
      right,
      [
        { text: "Every rhombus is a square", mistake: "qd-hierarchy" },
        { text: "Every rectangle is a square", mistake: "qd-hierarchy" },
        { text: "A square is not a rectangle", mistake: "qd-hierarchy" },
        { text: "Every parallelogram is a rectangle", mistake: "qd-hierarchy" },
      ]
    );
  },
};
