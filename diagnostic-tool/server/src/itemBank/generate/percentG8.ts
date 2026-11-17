import { Rng, Template, build, buildActivity, fmt, int, pick } from "./core.js";
import { ShadeActivity } from "../../types.js";

/**
 * Percent and Percentage, Grade 8 (book chapter 7): percent of a whole that
 * isn't 100, percent as a decimal, finding the whole, percentage increase
 * and decrease, successive changes.
 *   concrete  hands-on: shade p% of grids of 100, 50 and 20 squares; shade
 *             p% and then p% of the rest; up p% then down p%
 *   pictorial shaded grids of 100, 50 and 20 squares; a change in shading;
 *             a claim about going up and down by the same percent
 *   abstract  p% as a decimal, p% of a number, the whole from a part,
 *             percentage decrease, two increases in a row
 */

const TOPIC = "g8-percent";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "pct-of-100-only": {
    label: "Treats every whole as 100",
    detail: "Shades or counts p squares for p%, even when the whole isn't 100 squares.",
    childTip: "Percent means out of 100. If the whole is 50, then 10% is 5, not 10.",
  },
  "pct-complement": {
    label: "Gives the other part",
    detail: "Gives the part not shaded (or not asked for): 100% − p% instead of p%.",
    childTip: "Read again which part the question asks about.",
  },
  "pct-decimal-shift": {
    label: "Puts the decimal point in the wrong place",
    detail: "Writes 5% as 0.5 or 35% as 3.5.",
    childTip: "Percent means divide by 100: move the point two places left. 5% = 0.05.",
  },
  "pct-inverse": {
    label: "Takes the percent of the part, not finds the whole",
    detail: "Given that 20% of a number is 30, works out 20% of 30.",
    childTip: "If 20% is 30, then 1% is 30 ÷ 20, and 100% is 100 times that.",
  },
  "pct-change-not-percent": {
    label: "Gives the change, not the percentage change",
    detail: "Says the increase is 5 when the question asks for a percent.",
    childTip: "Percentage change = change ÷ the starting amount × 100.",
  },
  "pct-wrong-base": {
    label: "Divides by the new amount",
    detail: "Works out a percentage change as a part of the new amount, not the original.",
    childTip: "Always compare the change with where you started.",
  },
  "pct-adds-percent": {
    label: "Adds percents that act one after another",
    detail: "Thinks 20% up then 20% down gets back to the start, or that 20% then 25% is 45%.",
    childTip: "The second percent works on the new amount, not the old one. Work it out step by step.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `pct8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const shade = (rows: number, cols: number, target: number, wrong: { value: number; mistake: string }[], unit?: string): ShadeActivity => ({
  kind: "shade",
  rows,
  cols,
  target,
  unit,
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= rows * cols && wrong.findIndex((x) => x.value === w.value) === i),
});
const pc = (n: number) => `${+n.toFixed(1)}%`;
const dec = (n: number) => String(+n.toFixed(4));

export const PERCENT_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: shading ----------------
  "concrete|remember": (rng) => {
    const p = int(rng, 6, 94);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "percent", rng), prompt: `Shade ${p}% of the grid.`, representation: null },
      { p },
      shade(10, 10, p, [{ value: 100 - p, mistake: "pct-complement" }])
    );
  },
  "concrete|understand": (rng) => {
    const p = 2 * int(rng, 3, 24);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "percent of a whole", rng), prompt: `This grid has 50 squares. Shade ${p}% of it.`, representation: null },
      { p },
      shade(5, 10, p / 2, [{ value: p, mistake: "pct-of-100-only" }, { value: 50 - p / 2, mistake: "pct-complement" }])
    );
  },
  "concrete|apply": (rng) => {
    const p = 5 * int(rng, 2, 18);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "percent of a whole", rng), prompt: `This grid has 20 squares. Shade ${p}% of it.`, representation: null },
      { p },
      shade(4, 5, p / 5, [{ value: p, mistake: "pct-of-100-only" }, { value: 20 - p / 5, mistake: "pct-complement" }])
    );
  },
  "concrete|analyze": (rng) => {
    const p = pick(rng, [10, 20, 30, 40, 50]);
    const total = p + (p * (100 - p)) / 100;
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "successive change", rng),
        prompt: `Shade ${p}% of the grid. Then shade ${p}% of the squares that are still white. What percent of the grid is shaded now?`,
        representation: null,
        activity: shade(10, 10, total, []),
      },
      { p },
      `${total}%`,
      [
        { text: `${2 * p}%`, mistake: "pct-adds-percent" },
        { text: `${p}%`, mistake: null },
        { text: `${p * p / 100}%`, mistake: null },
        { text: `${100 - total}%`, mistake: "pct-complement" },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const p = pick(rng, [10, 20, 30, 40, 50]);
    const end = 100 - (p * p) / 100;
    return buildActivity(
      {
        ...base("c-evaluate", "concrete", "evaluate", "successive change", rng),
        prompt: `A price of ₹100 goes up by ${p}%, then the new price comes down by ${p}%. Each square is ₹1. Shade the final price.`,
        representation: null,
      },
      { p },
      shade(10, 10, end, [{ value: 100, mistake: "pct-adds-percent" }], "Each square = ₹1")
    );
  },

  // ---------------- PICTORIAL: shaded grids ----------------
  "pictorial|remember": (rng) => {
    const s = int(rng, 6, 94);
    return build(
      { ...base("p-remember", "pictorial", "remember", "percent", rng), prompt: "What percent of the grid is shaded?", representation: { kind: "grid", rows: 10, cols: 10, shadedCells: s, compact: true } },
      { s },
      `${s}%`,
      [
        { text: `${100 - s}%`, mistake: "pct-complement" },
        { text: pc(s / 10), mistake: "pct-decimal-shift" },
        { text: `${s + 10}%`, mistake: null },
        { text: `${s - 10}%`, mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const s = int(rng, 3, 47);
    return build(
      { ...base("p-understand", "pictorial", "understand", "percent of a whole", rng), prompt: "What percent of this grid of 50 squares is shaded?", representation: { kind: "grid", rows: 5, cols: 10, shadedCells: s, compact: true } },
      { s },
      `${2 * s}%`,
      [
        { text: `${s}%`, mistake: "pct-of-100-only" },
        { text: `${100 - 2 * s}%`, mistake: "pct-complement" },
        { text: `${50 - s}%`, mistake: "pct-of-100-only" },
        { text: `${2 * s + 2}%`, mistake: null },
        { text: `${2 * s - 2}%`, mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const s = int(rng, 2, 18);
    return build(
      { ...base("p-apply", "pictorial", "apply", "percent of a whole", rng), prompt: "What percent of this grid of 20 squares is shaded?", representation: { kind: "grid", rows: 4, cols: 5, shadedCells: s, compact: true } },
      { s },
      `${5 * s}%`,
      [
        { text: `${s}%`, mistake: "pct-of-100-only" },
        { text: `${100 - 5 * s}%`, mistake: "pct-complement" },
        { text: `${2 * s}%`, mistake: null },
        { text: `${5 * s + 5}%`, mistake: null },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const [a, b] = pick(rng, [[20, 25], [25, 30], [40, 50], [50, 60], [20, 30], [40, 60], [25, 40], [50, 70], [60, 75]] as const);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "percentage change", rng),
        prompt: `Last week ${a} squares were shaded. This week ${b} are shaded, as shown. By what percent did the shading increase?`,
        representation: { kind: "grid", rows: 10, cols: 10, shadedCells: b, compact: true },
      },
      { a, b },
      pc(((b - a) / a) * 100),
      [
        { text: pc(b - a), mistake: "pct-change-not-percent" },
        { text: pc(((b - a) / b) * 100), mistake: "pct-wrong-base" },
        { text: pc(b), mistake: null },
        { text: pc(((b - a) / a) * 100 + 5), mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const p = pick(rng, [10, 20, 30, 40, 50]);
    const end = 100 - (p * p) / 100;
    const name = pick(rng, ["Riya", "Arjun", "Meera", "Kabir", "Diya", "Rohan"]);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "successive change", rng),
        prompt: `The grid shows a price of ₹100 (₹1 a square). It goes up by ${p}%, then comes down by ${p}%. ${name} says it ends back at ₹100. Is ${name} right?`,
        representation: { kind: "grid", rows: 10, cols: 10, shadedCells: 100, compact: true },
      },
      { p },
      `No: it ends at ₹${end}, because the ${p}% off is taken from ₹${100 + p}`,
      [
        { text: `Yes: up ${p}% and down ${p}% cancel out`, mistake: "pct-adds-percent" },
        { text: `No: it ends at ₹${100 + (p * p) / 100}, a little higher`, mistake: null },
        { text: `No: it ends at ₹${100 - p}`, mistake: null },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const p = pick(rng, [int(rng, 1, 9), int(rng, 11, 99)]);
    return build(
      { ...base("a-remember", "abstract", "remember", "percent as a decimal", rng), prompt: `Write ${p}% as a decimal.`, representation: null },
      { p },
      dec(p / 100),
      [
        { text: dec(p / 10), mistake: "pct-decimal-shift" },
        { text: dec(p / 1000), mistake: "pct-decimal-shift" },
        { text: String(p), mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const p = 5 * int(rng, 1, 19);
    const N = 20 * int(rng, 3, 40);
    return build(
      { ...base("a-understand", "abstract", "understand", "percent of a number", rng), prompt: `What is ${p}% of ${fmt(N)}?`, representation: null },
      { p, N },
      fmt((p * N) / 100),
      [
        { text: fmt(((100 - p) * N) / 100), mistake: "pct-complement" },
        { text: fmt((p * N) / 10), mistake: "pct-decimal-shift" },
        { text: fmt(N - p), mistake: null },
        { text: fmt((p * N) / 1000), mistake: "pct-decimal-shift" },
        { text: fmt((p * N) / 100 + 10), mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const p = pick(rng, [5, 10, 20, 25, 40, 50]);
    const whole = (100 / p) * int(rng, 2, 30) * (p === 40 ? 2 : 1);
    const x = (p * whole) / 100;
    return build(
      { ...base("a-apply", "abstract", "apply", "finding the whole", rng), prompt: `${fmt(x)} is ${p}% of which number?`, representation: null },
      { p, whole },
      fmt(whole),
      [
        { text: dec((p * x) / 100), mistake: "pct-inverse" },
        { text: fmt(x * p), mistake: null },
        { text: fmt(x + p), mistake: null },
        { text: fmt(whole / 10), mistake: "pct-decimal-shift" },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const a = 20 * int(rng, 3, 25);
    const p = pick(rng, [5, 10, 15, 20, 25, 30, 40]);
    const b = a - (a * p) / 100;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "percentage change", rng), prompt: `A price falls from ₹${fmt(a)} to ₹${fmt(b)}. What is the percentage decrease?`, representation: null },
      { a, p },
      `${p}%`,
      [
        { text: pc(a - b), mistake: "pct-change-not-percent" },
        { text: pc(((a - b) / b) * 100), mistake: "pct-wrong-base" },
        { text: pc(100 - p), mistake: "pct-complement" },
        { text: pc(p + 5), mistake: null },
        { text: pc(2 * p), mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const [p, q] = pick(rng, [[10, 10], [20, 25], [25, 20], [10, 20], [50, 20], [20, 50], [25, 40], [40, 25]] as const);
    const overall = Math.round(((1 + p / 100) * (1 + q / 100) - 1) * 100);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "successive change", rng), prompt: `A number is increased by ${p}%, then the result is increased by ${q}%. What is the total increase?`, representation: null },
      { p, q },
      `${overall}%`,
      [
        { text: `${p + q}%`, mistake: "pct-adds-percent" },
        { text: `${(p * q) / 10}%`, mistake: null },
        { text: `${overall + 5}%`, mistake: null },
        { text: `${Math.max(p, q)}%`, mistake: null },
      ]
    );
  },
};
