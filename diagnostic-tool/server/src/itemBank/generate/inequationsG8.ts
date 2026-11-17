import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { ShadeActivity } from "../../types.js";
import { expr, n } from "./algebra.js";

/**
 * Linear Inequations, Grade 8 (book chapter 15), with number lines:
 * reading and drawing x < k, x ≥ k and ranges on a number line, solving
 * (the sign flips when multiplying or dividing by a negative), and solution
 * sets in natural numbers and integers.
 *   concrete  hands-on: shade the natural numbers (squares numbered 1–20)
 *             that make an inequation true
 *   pictorial number lines with open and closed dots: read one, find a
 *             member, list the integers in a range, check someone's drawing
 *   abstract  x + a > b, −ax ≤ b, ax − b < c, a natural-number solution
 *             set, the largest integer
 */

const TOPIC = "g8-inequations";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "ineq-endpoint": {
    label: "Includes or leaves out the end number wrongly",
    detail: "Mixes up < with ≤ (or > with ≥): an open dot means the number is not included.",
    childTip: "≤ and ≥ include the end number (closed dot ●); < and > don't (open dot ○).",
  },
  "ineq-direction": {
    label: "Reads the direction backwards",
    detail: "Takes the shaded part to the right as 'less than', or the other way round.",
    childTip: "Right of the number is greater; left is less.",
  },
  "ineq-as-equation": {
    label: "Gives one number instead of a range",
    detail: "Answers x = 4 for x ≥ 4, as if it were an equation.",
    childTip: "An inequation has many answers: every number on the shaded side.",
  },
  "ineq-flip-not": {
    label: "Doesn't flip the sign when dividing by a negative",
    detail: "From −2x ≥ 6 writes x ≥ −3 instead of x ≤ −3.",
    childTip: "Multiplying or dividing both sides by a negative number flips < and >.",
  },
  "ineq-flip-wrong": {
    label: "Flips the sign when it shouldn't",
    detail: "Flips < and > after adding, subtracting, or dividing by a positive number.",
    childTip: "Only multiplying or dividing by a negative flips the sign.",
  },
  "ineq-sign-move": {
    label: "Moves a term across without changing its sign",
    detail: "From x + 3 > 7 writes x > 10.",
    childTip: "Take 3 away from both sides: x > 7 − 3.",
  },
  "ineq-wrong-inverse": {
    label: "Undoes with the wrong operation",
    detail: "Subtracts the 3 in 3x instead of dividing by it.",
    childTip: "3x means 3 × x, so divide both sides by 3.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `ineq8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const naturals = (target: number, wrong: { value: number; mistake: string }[]): ShadeActivity => ({
  kind: "shade",
  rows: 2,
  cols: 10,
  numbered: true,
  target,
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= 20 && wrong.findIndex((x) => x.value === w.value) === i),
});
const line = (k: number, closed: boolean, right: boolean, min = -10, max = 10) => ({
  kind: "number-line" as const,
  min,
  max,
  step: 1,
  labelEvery: 2,
  markers: [{ value: k, label: closed ? "●" : "○" }],
  highlightRange: (right ? [k, max] : [min, k]) as [number, number],
});

export const INEQUATIONS_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: shade the natural numbers ----------------
  "concrete|remember": (rng) => {
    const k = int(rng, 3, 18);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "solution sets", rng), prompt: `Shade every natural number x with x ≤ ${k}.`, representation: null },
      { k },
      naturals(k, [{ value: k - 1, mistake: "ineq-endpoint" }])
    );
  },
  "concrete|understand": (rng) => {
    const k = int(rng, 3, 19);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "solution sets", rng), prompt: `Shade every natural number x with x < ${k}.`, representation: null },
      { k },
      naturals(k - 1, [{ value: k, mistake: "ineq-endpoint" }])
    );
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 1, 6), b = a + int(rng, 2, 12);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "solving", rng), prompt: `Shade every natural number x with x + ${a} ≤ ${b}.`, representation: null },
      { a, b },
      naturals(b - a, [{ value: b + a, mistake: "ineq-sign-move" }, { value: b - a - 1, mistake: "ineq-endpoint" }])
    );
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 2, 4);
    let c = int(rng, a + 1, 6 * a);
    if (c % a === 0) c += 1;
    return buildActivity(
      { ...base("c-analyze", "concrete", "analyze", "solving", rng), prompt: `Shade every natural number x with ${a}x < ${c}.`, representation: null },
      { a, c },
      naturals(Math.floor((c - 1) / a), [{ value: c - a, mistake: "ineq-wrong-inverse" }, { value: c - 1, mistake: "ineq-wrong-inverse" }])
    );
  },
  "concrete|evaluate": (rng) => {
    const k = int(rng, 3, 15);
    return build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "negatives", rng),
        prompt: `Shade every natural number x with −x ≥ −${k}. Which inequation says the same thing?`,
        representation: null,
        activity: naturals(k, []),
      },
      { k },
      `x ≤ ${k}`,
      [
        { text: `x ≥ ${k}`, mistake: "ineq-flip-not" },
        { text: `x < ${k}`, mistake: "ineq-endpoint" },
        { text: `x ≤ −${k}`, mistake: null },
      ]
    );
  },

  // ---------------- PICTORIAL: number lines ----------------
  "pictorial|remember": (rng) => {
    const k = int(rng, -7, 7);
    return build(
      { ...base("p-remember", "pictorial", "remember", "number lines", rng), prompt: "Which inequation does the number line show?", representation: line(k, true, true) },
      { k },
      `x ≥ ${n(k)}`,
      [
        { text: `x > ${n(k)}`, mistake: "ineq-endpoint" },
        { text: `x ≤ ${n(k)}`, mistake: "ineq-direction" },
        { text: `x = ${n(k)}`, mistake: "ineq-as-equation" },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const k = int(rng, -7, 7);
    return build(
      { ...base("p-understand", "pictorial", "understand", "number lines", rng), prompt: "Which inequation does the number line show?", representation: line(k, false, false) },
      { k },
      `x < ${n(k)}`,
      [
        { text: `x ≤ ${n(k)}`, mistake: "ineq-endpoint" },
        { text: `x > ${n(k)}`, mistake: "ineq-direction" },
        { text: `x = ${n(k)}`, mistake: "ineq-as-equation" },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const k = int(rng, -6, 5), inside = k + int(rng, 1, 4);
    return build(
      { ...base("p-apply", "pictorial", "apply", "number lines", rng), prompt: "Which number is in the solution shown?", representation: line(k, false, true) },
      { k, inside },
      n(inside),
      [
        { text: n(k), mistake: "ineq-endpoint" },
        { text: n(k - 1), mistake: "ineq-direction" },
        { text: n(k - 3), mistake: "ineq-direction" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const l = int(rng, -6, 2), r = l + int(rng, 2, 5);
    const list = (a: number, b: number) => (a > b ? "none" : Array.from({ length: b - a + 1 }, (_, i) => n(a + i)).join(", "));
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "ranges", rng),
        prompt: `The number line shows ${n(l)} < x ≤ ${n(r)}. Which integers are in it?`,
        representation: { kind: "number-line", min: -10, max: 10, step: 1, labelEvery: 2, markers: [{ value: l, label: "○" }, { value: r, label: "●" }], highlightRange: [l, r] },
      },
      { l, r },
      list(l + 1, r),
      [
        { text: list(l, r), mistake: "ineq-endpoint" },
        { text: list(l + 1, r - 1), mistake: "ineq-endpoint" },
        { text: list(l, r - 1), mistake: "ineq-endpoint" },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const k = int(rng, 1, 7), a = pick(rng, [2, 3]);
    const name = pick(rng, ["Riya", "Arjun", "Meera", "Kabir", "Diya", "Rohan"]);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "negatives", rng),
        prompt: `${name} solved −${a}x ≥ ${a * k} and drew this number line. Is it right?`,
        representation: line(-k, true, true),
      },
      { k, a },
      `No: dividing by −${a} flips the sign, so x ≤ −${k}`,
      [
        { text: `Yes: x ≥ −${k}`, mistake: "ineq-flip-not" },
        { text: `No: it should be x ≥ ${k}`, mistake: null },
        { text: `No: it should be x > −${k}, with an open dot`, mistake: "ineq-endpoint" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const a = int(rng, 1, 12), b = int(rng, -10, 20);
    return build(
      { ...base("a-remember", "abstract", "remember", "solving", rng), prompt: `Solve x + ${a} > ${n(b)}.`, representation: null },
      { a, b },
      `x > ${n(b - a)}`,
      [
        { text: `x > ${n(b + a)}`, mistake: "ineq-sign-move" },
        { text: `x < ${n(b - a)}`, mistake: "ineq-flip-wrong" },
        { text: `x = ${n(b - a)}`, mistake: "ineq-as-equation" },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 2, 6), q = int(rng, 1, 9) * pick(rng, [1, -1]);
    const b = a * q;
    return build(
      { ...base("a-understand", "abstract", "understand", "negatives", rng), prompt: `Solve −${a}x ≤ ${n(b)}.`, representation: null },
      { a, q },
      `x ≥ ${n(-q)}`,
      [
        { text: `x ≤ ${n(-q)}`, mistake: "ineq-flip-not" },
        { text: `x ≥ ${n(q)}`, mistake: null },
        { text: `x ≤ ${n(q)}`, mistake: "ineq-flip-not" },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 2, 6), x = int(rng, -5, 10), b = int(rng, 1, 12);
    const c = a * x - b;
    return build(
      { ...base("a-apply", "abstract", "apply", "solving", rng), prompt: `Solve ${expr([[a, "x"], [-b, ""]])} < ${n(c)}.`, representation: null },
      { a, x, b },
      `x < ${n(x)}`,
      [
        { text: `x < ${n(+((c - b) / a).toFixed(2))}`, mistake: "ineq-sign-move" },
        { text: `x > ${n(x)}`, mistake: "ineq-flip-wrong" },
        { text: `x < ${n(+(c / a + b).toFixed(2))}`, mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 2, 4), k = int(rng, 3, 6), b = int(rng, 1, 9);
    const c = a * k + b;
    const set = (lo: number, hi: number) => `{${Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).join(", ")}}`;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "solution sets", rng), prompt: `x is a natural number and ${expr([[a, "x"], [b, ""]])} ≤ ${c}. What is the solution set?`, representation: null },
      { a, k, b },
      set(1, k),
      [
        { text: set(1, k - 1), mistake: "ineq-endpoint" },
        { text: `{${k}}`, mistake: "ineq-as-equation" },
        { text: set(0, k), mistake: null },
        { text: set(k, k + 3).replace("}", ", …}"), mistake: "ineq-direction" },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 2, 5), k = int(rng, 2, 9), b = int(rng, 1, 12);
    const c = b - a * k;
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "negatives", rng), prompt: `What is the largest integer x with ${expr([[-a, "x"], [b, ""]])} ≥ ${n(c)}?`, representation: null },
      { a, k, b },
      String(k),
      [
        { text: n(-k), mistake: null },
        { text: String(k - 1), mistake: "ineq-endpoint" },
        { text: `There is none: x ≥ ${k}`, mistake: "ineq-flip-not" },
      ]
    );
  },
};
