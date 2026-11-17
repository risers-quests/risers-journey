import { Rng, Template, build, buildActivity, fmt, int, pick } from "./core.js";
import { ShadeActivity } from "../../types.js";
import { bracket, expr } from "./algebra.js";

/**
 * Identities, Grade 8 (book chapter 12): (a + b)² = a² + 2ab + b²,
 * (a − b)² = a² − 2ab + b², a² − b² = (a − b)(a + b), and using them to
 * work out squares and products quickly.
 *   concrete  hands-on: shade squares on a grid to show (a + b)², the three
 *             parts a² + 2ab + b², (a − b)², a² − b², and (a + b)² − (a − b)²
 *   pictorial squares and rectangles with expression sides: (x + b)²,
 *             (x − b)², (ax + b)², (x + b)(x − b), 103² by the picture
 *   abstract  (y + b)², x² − b² as a product, 102 × 98, (ax + by)²,
 *             a² + b² from a + b and ab
 */

const TOPIC = "g8-identities";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "id-no-middle": {
    label: "Leaves out the middle term",
    detail: "Writes (a + b)² as a² + b² (or (a − b)² as a² − b²).",
    childTip: "Draw the square: there are two a × b rectangles as well. (a + b)² = a² + 2ab + b².",
  },
  "id-middle-ab": {
    label: "Uses ab instead of 2ab",
    detail: "Writes (a + b)² as a² + ab + b², counting only one of the two rectangles.",
    childTip: "(a + b)(a + b) gives ab twice: once from a × b, once from b × a.",
  },
  "id-sign-slip": {
    label: "Gets a sign wrong in the identity",
    detail: "Writes (a − b)² as a² + 2ab + b² or a² − 2ab − b².",
    childTip: "(a − b)²: the middle is −2ab, the last term +b² (a minus times a minus is a plus).",
  },
  "id-diff-as-square": {
    label: "Mixes up a² − b² and (a − b)²",
    detail: "Thinks a² − b² is the same as (a − b)².",
    childTip: "a² − b² = (a − b)(a + b): one bracket has a minus, the other a plus.",
  },
  "id-coefficient-square": {
    label: "Doesn't square the number in front",
    detail: "Writes (3x)² as 3x² instead of 9x².",
    childTip: "(3x)² = 3x × 3x = 9x². Square the number too.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `id8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const shade = (target: number, wrong: { value: number; mistake: string }[]): ShadeActivity => ({
  kind: "shade",
  rows: 10,
  cols: 10,
  target,
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= 100 && wrong.findIndex((x) => x.value === w.value) === i),
});
const sq = (side: string) => ({ kind: "shape" as const, shape: "square" as const, sideLabels: [side] });
const V = ["x", "y", "a", "m", "p"] as const;

export const IDENTITIES_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: shading squares ----------------
  "concrete|remember": (rng) => {
    const a = int(rng, 3, 6), b = int(rng, 2, 4);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "(a + b)²", rng), prompt: `Shade (${a} + ${b})² squares.`, representation: null },
      { a, b },
      shade((a + b) ** 2, [{ value: a * a + b * b, mistake: "id-no-middle" }, { value: a * a + a * b + b * b, mistake: "id-middle-ab" }])
    );
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 3, 6), b = int(rng, 2, 4);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "(a + b)²", rng), prompt: `Shade ${a}² + 2 × ${a} × ${b} + ${b}² squares. (It's one way to write (${a} + ${b})².)`, representation: null },
      { a, b },
      shade((a + b) ** 2, [{ value: a * a + a * b + b * b, mistake: "id-middle-ab" }, { value: a * a + b * b, mistake: "id-no-middle" }])
    );
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 7, 10), b = int(rng, 2, a - 3);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "(a − b)²", rng), prompt: `Shade (${a} − ${b})² squares.`, representation: null },
      { a, b },
      shade((a - b) ** 2, [{ value: a * a - b * b, mistake: "id-diff-as-square" }])
    );
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 6, 10), b = int(rng, 2, a - 2);
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "a² − b²", rng),
        prompt: `Shade ${a}² − ${b}² squares. Which product gives the same number?`,
        representation: null,
        activity: shade(a * a - b * b, []),
      },
      { a, b },
      `(${a} − ${b}) × (${a} + ${b})`,
      [
        { text: `(${a} − ${b}) × (${a} − ${b})`, mistake: "id-diff-as-square" },
        { text: `(${a} + ${b}) × (${a} + ${b})`, mistake: null },
        { text: `${a} × ${b}`, mistake: null },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 3, 6), b = int(rng, 1, Math.min(a - 1, 4));
    return buildActivity(
      { ...base("c-evaluate", "concrete", "evaluate", "using identities", rng), prompt: `Shade (${a} + ${b})² − (${a} − ${b})² squares. (Use the identities: most of it cancels.)`, representation: null },
      { a, b },
      shade(4 * a * b, [{ value: 2 * a * b, mistake: "id-middle-ab" }, { value: 2 * b * b, mistake: "id-sign-slip" }])
    );
  },

  // ---------------- PICTORIAL: squares and rectangles with expression sides ----------------
  "pictorial|remember": (rng) => {
    const v = pick(rng, V), b = int(rng, 2, 9);
    return build(
      { ...base("p-remember", "pictorial", "remember", "(a + b)²", rng), prompt: `What is the area of this square?`, representation: sq(expr([[1, v], [b, ""]])) },
      { b, v: V.indexOf(v) },
      expr([[1, `${v}²`], [2 * b, v], [b * b, ""]]),
      [
        { text: expr([[1, `${v}²`], [b * b, ""]]), mistake: "id-no-middle" },
        { text: expr([[1, `${v}²`], [b, v], [b * b, ""]]), mistake: "id-middle-ab" },
        { text: expr([[1, `${v}²`], [2 * b, v], [2 * b, ""]]), mistake: null },
        { text: expr([[1, `${v}²`], [2 * b, v]]), mistake: null },
        { text: expr([[2, v], [b * b, ""]]), mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const v = pick(rng, V), b = int(rng, 2, 9);
    return build(
      { ...base("p-understand", "pictorial", "understand", "(a − b)²", rng), prompt: `What is the area of this square?`, representation: sq(expr([[1, v], [-b, ""]])) },
      { b, v: V.indexOf(v) },
      expr([[1, `${v}²`], [-2 * b, v], [b * b, ""]]),
      [
        { text: expr([[1, `${v}²`], [-b * b, ""]]), mistake: "id-diff-as-square" },
        { text: expr([[1, `${v}²`], [2 * b, v], [b * b, ""]]), mistake: "id-sign-slip" },
        { text: expr([[1, `${v}²`], [-2 * b, v], [-b * b, ""]]), mistake: "id-sign-slip" },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const v = pick(rng, V), a = int(rng, 2, 5), b = int(rng, 1, 7);
    return build(
      { ...base("p-apply", "pictorial", "apply", "(ax + b)²", rng), prompt: `What is the area of this square?`, representation: sq(expr([[a, v], [b, ""]])) },
      { a, b, v: V.indexOf(v) },
      expr([[a * a, `${v}²`], [2 * a * b, v], [b * b, ""]]),
      [
        { text: expr([[a, `${v}²`], [2 * a * b, v], [b * b, ""]]), mistake: "id-coefficient-square" },
        { text: expr([[a * a, `${v}²`], [b * b, ""]]), mistake: "id-no-middle" },
        { text: expr([[a * a, `${v}²`], [a * b, v], [b * b, ""]]), mistake: "id-middle-ab" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const v = pick(rng, V), b = int(rng, 2, 9);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "a² − b²", rng),
        prompt: `A rectangle has sides ${expr([[1, v], [b, ""]])} and ${expr([[1, v], [-b, ""]])}. What is its area?`,
        representation: { kind: "shape", shape: "rectangle", sideLabels: [expr([[1, v], [b, ""]]), expr([[1, v], [-b, ""]])] },
      },
      { b, v: V.indexOf(v) },
      expr([[1, `${v}²`], [-b * b, ""]]),
      [
        { text: expr([[1, `${v}²`], [-2 * b, v], [b * b, ""]]), mistake: "id-diff-as-square" },
        { text: expr([[1, `${v}²`], [b * b, ""]]), mistake: "id-sign-slip" },
        { text: expr([[1, `${v}²`], [-2 * b, ""]]), mistake: null },
        { text: expr([[1, `${v}²`], [-b, ""]]), mistake: null },
        { text: expr([[1, `${v}²`], [2 * b, v], [-b * b, ""]]), mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const c = int(rng, 1, 9);
    const big = pick(rng, [100, 1000]);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "using identities", rng),
        prompt: `The square has side ${fmt(big)} + ${c}. Use (a + b)² to find ${fmt(big + c)}².`,
        representation: sq(`${fmt(big)} + ${c}`),
      },
      { c, big },
      fmt((big + c) ** 2),
      [
        { text: fmt(big * big + c * c), mistake: "id-no-middle" },
        { text: fmt(big * big + big * c + c * c), mistake: "id-middle-ab" },
        { text: fmt(big * big + 2 * big * c), mistake: null },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const v = pick(rng, V), b = int(rng, 2, 12);
    return build(
      { ...base("a-remember", "abstract", "remember", "(a + b)²", rng), prompt: `${bracket(1, v, b)}² = ?`, representation: null },
      { b, v: V.indexOf(v) },
      expr([[1, `${v}²`], [2 * b, v], [b * b, ""]]),
      [
        { text: expr([[1, `${v}²`], [b * b, ""]]), mistake: "id-no-middle" },
        { text: expr([[1, `${v}²`], [b, v], [b * b, ""]]), mistake: "id-middle-ab" },
        { text: expr([[1, `${v}²`], [2 * b, v], [2 * b, ""]]), mistake: null },
        { text: expr([[1, `${v}²`], [2 * b, v]]), mistake: null },
        { text: expr([[2, v], [b * b, ""]]), mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const v = pick(rng, V), b = int(rng, 2, 12);
    return build(
      { ...base("a-understand", "abstract", "understand", "a² − b²", rng), prompt: `Write ${expr([[1, `${v}²`], [-b * b, ""]])} as a product.`, representation: null },
      { b, v: V.indexOf(v) },
      `${bracket(1, v, -b)}${bracket(1, v, b)}`,
      [
        { text: `${bracket(1, v, -b)}²`, mistake: "id-diff-as-square" },
        { text: `${bracket(1, v, b)}²`, mistake: null },
        { text: `${bracket(1, v, -b * b)}${bracket(1, v, 1)}`, mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const c = int(rng, 1, 9);
    return build(
      { ...base("a-apply", "abstract", "apply", "a² − b²", rng), prompt: `Use an identity: ${100 + c} × ${100 - c} = ?`, representation: null },
      { c },
      fmt(10000 - c * c),
      [
        { text: fmt(10000 + c * c), mistake: "id-sign-slip" },
        { text: fmt((100 - c) ** 2), mistake: "id-diff-as-square" },
        { text: fmt(10000 - 2 * c), mistake: null },
        { text: "10,000", mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 2, 5), b = int(rng, 2, 5);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "(ax + by)²", rng), prompt: `(${a}x + ${b}y)² = ?`, representation: null },
      { a, b },
      expr([[a * a, "x²"], [2 * a * b, "xy"], [b * b, "y²"]]),
      [
        { text: expr([[a * a, "x²"], [b * b, "y²"]]), mistake: "id-no-middle" },
        { text: expr([[a, "x²"], [2 * a * b, "xy"], [b, "y²"]]), mistake: "id-coefficient-square" },
        { text: expr([[a * a, "x²"], [a * b, "xy"], [b * b, "y²"]]), mistake: "id-middle-ab" },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    let a = int(rng, 1, 9), b = int(rng, 1, 9);
    if (a === b) b = a + 1;
    const s = a + b, p = a * b;
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "using identities", rng), prompt: `a + b = ${s} and ab = ${p}. Find a² + b².`, representation: null },
      { s, p },
      String(s * s - 2 * p),
      [
        { text: String(s * s), mistake: "id-no-middle" },
        { text: String(s * s + 2 * p), mistake: "id-sign-slip" },
        { text: String(s * s - p), mistake: "id-middle-ab" },
      ]
    );
  },
};
