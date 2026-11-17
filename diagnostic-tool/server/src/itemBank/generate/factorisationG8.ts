import { Rng, Template, build, buildActivity, gcd, int, pick } from "./core.js";
import { GroupActivity } from "../../types.js";
import { bracket, expr } from "./algebra.js";

/**
 * Factorisation, Grade 8 (book chapter 13), simple cases only: a common
 * factor a(x + y), perfect squares (x ± y)², a² − b², and (x + a)(x + b).
 *   concrete  hands-on: share each term's tiles between the same number of
 *             groups (that number is the common factor); find the highest
 *             common factor; check a factorisation that isn't finished
 *   pictorial rectangles with a known area and one side; a square's side
 *             from its area; a square with a square cut out, rearranged
 *   abstract  common factor, a² − b², x² + px + q (positive, then mixed signs),
 *             which one is a² − b²
 */

const TOPIC = "g8-factorisation";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "fac-partial": {
    label: "Takes the factor out of one term only",
    detail: "Writes 6x + 9 as 3(2x + 9).",
    childTip: "Divide every term by the common factor. Check by multiplying back out.",
  },
  "fac-not-highest": {
    label: "Doesn't take out the highest common factor",
    detail: "Writes 8x + 12 as 2(4x + 6), which still has a common factor.",
    childTip: "Look inside the bracket: if the terms still share a factor, take it out too.",
  },
  "fac-wrong-pair": {
    label: "Picks numbers that don't fit both",
    detail: "For x² + 5x + 6, picks numbers that multiply to 6 but don't add to 5 (or the other way).",
    childTip: "You need two numbers that multiply to the last term AND add to the middle one.",
  },
  "fac-sign-pair": {
    label: "Puts the signs the wrong way round",
    detail: "Writes x² − x − 6 as (x + 3)(x − 2) instead of (x − 3)(x + 2).",
    childTip: "Multiply your brackets back out to check the middle sign.",
  },
  "fac-diff-as-square": {
    label: "Writes a² − b² as (a − b)²",
    detail: "Factorises x² − 9 as (x − 3)².",
    childTip: "x² − 9 = (x − 3)(x + 3). Multiplying (x − 3)² out gives x² − 6x + 9.",
  },
  "fac-sum-of-squares": {
    label: "Factorises a sum of squares",
    detail: "Thinks x² + 9 = (x − 3)(x + 3). Only a difference of squares factorises that way.",
    childTip: "(x − 3)(x + 3) = x² − 9, with a minus. x² + 9 doesn't factorise like that.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `fac8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const xTiles = (extra: Partial<GroupActivity> & Pick<GroupActivity, "mode" | "items">): GroupActivity => ({ kind: "group", icon: "🟦", itemMany: "x-tiles", basketOne: "group", basketIcon: "", ...extra });
const ones = (extra: Partial<GroupActivity> & Pick<GroupActivity, "mode" | "items">): GroupActivity => ({ kind: "group", icon: "🟨", itemMany: "ones", basketOne: "group", basketIcon: "", ...extra });
/** a and b with no common factor, so k is the highest common factor of ka and kb. */
function coprime(rng: Rng, lo: number, hi: number): [number, number] {
  for (;;) {
    const a = int(rng, lo, hi), b = int(rng, lo, hi);
    if (a !== b && gcd(a, b) === 1) return [a, b];
  }
}

export const FACTORISATION_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: sharing each term's tiles ----------------
  "concrete|remember": (rng) => {
    const k = int(rng, 2, 4), [a, b] = coprime(rng, 1, 5);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "common factor", rng), prompt: `${expr([[k * a, "x"], [k * b, ""]])} has ${k * a} x-tiles. Share the x-tiles equally between the ${k} groups.`, representation: null },
      { k, a, b },
      xTiles({ mode: "equal", items: k * a, baskets: k })
    );
  },
  "concrete|understand": (rng) => {
    const k = int(rng, 2, 4), [a, b] = coprime(rng, 1, 5);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "common factor", rng), prompt: `${expr([[k * a, "x"], [k * b, ""]])} has ${k * b} ones. Share the ones equally between the ${k} groups.`, representation: null },
      { k, a, b },
      ones({ mode: "equal", items: k * b, baskets: k })
    );
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 2, 4), [a, b] = coprime(rng, 1, 5);
    return build(
      {
        ...base("c-apply", "concrete", "apply", "common factor", rng),
        prompt: `Share the ${k * a} x-tiles of ${expr([[k * a, "x"], [k * b, ""]])} between ${k} groups. Each group also gets ${b} of the ${k * b} ones. So ${expr([[k * a, "x"], [k * b, ""]])} = ?`,
        representation: null,
        activity: xTiles({ mode: "equal", items: k * a, baskets: k }),
      },
      { k, a, b },
      `${k}${bracket(a, "x", b)}`,
      [
        { text: `${k}${bracket(a, "x", k * b)}`, mistake: "fac-partial" },
        { text: `${k}${bracket(k * a, "x", b)}`, mistake: "fac-partial" },
        { text: `${k}x(${a} + ${b})`, mistake: null },
      ]
    );
  },
  "concrete|analyze": (rng) => {
    const k = pick(rng, [4, 6]), [a, b] = coprime(rng, 1, 3);
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "highest common factor", rng),
        prompt: `Share the ${k * a} x-tiles of ${expr([[k * a, "x"], [k * b, ""]])} into equal groups in a new way (not 1 group, not 1 in each). What is the HIGHEST common factor of ${k * a}x and ${k * b}?`,
        representation: null,
        activity: xTiles({ mode: "find", items: k * a, maxBaskets: 12 }),
      },
      { k, a, b },
      String(k),
      [
        { text: "2", mistake: "fac-not-highest" },
        { text: String(k / 2), mistake: "fac-not-highest" },
        { text: String(k * a * k * b), mistake: null },
        { text: "1", mistake: null },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const k = 4, [a, b] = coprime(rng, 1, 5);
    const name = pick(rng, ["Riya", "Arjun", "Meera", "Kabir", "Diya", "Rohan"]);
    return build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "highest common factor", rng),
        prompt: `${name} factorises ${expr([[k * a, "x"], [k * b, ""]])} as 2${bracket(2 * a, "x", 2 * b)}. Share the ${k * a} x-tiles between 4 groups. Is ${name} finished?`,
        representation: null,
        activity: xTiles({ mode: "equal", items: k * a, baskets: k }),
      },
      { a, b },
      `No: 4 is a bigger common factor, so it is 4${bracket(a, "x", b)}`,
      [
        { text: `Yes: 2${bracket(2 * a, "x", 2 * b)} is fully factorised`, mistake: "fac-not-highest" },
        { text: `No: it is 4${bracket(a, "x", 4 * b)}`, mistake: "fac-partial" },
        { text: `No: it is 2${bracket(2 * a, "x", 4 * b)}`, mistake: "fac-partial" },
      ]
    );
  },

  // ---------------- PICTORIAL: rectangles and squares ----------------
  "pictorial|remember": (rng) => {
    const k = int(rng, 2, 7), [a, b] = coprime(rng, 1, 6);
    const area = expr([[k * a, "x"], [k * b, ""]]);
    return build(
      { ...base("p-remember", "pictorial", "remember", "common factor", rng), prompt: `This rectangle has area ${area} and one side ${k}. How long is the other side?`, representation: { kind: "shape", shape: "rectangle", sideLabels: ["?", String(k)], note: `Area = ${area}` } },
      { k, a, b },
      expr([[a, "x"], [b, ""]]),
      [
        { text: expr([[a, "x"], [k * b, ""]]), mistake: "fac-partial" },
        { text: expr([[k * a, "x"], [b, ""]]), mistake: "fac-partial" },
        { text: expr([[a + b, "x"]]), mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    let m = int(rng, 1, 7), nn = int(rng, 1, 7);
    if (m === nn) nn = m + 1;
    const area = expr([[1, "x²"], [m + nn, "x"], [m * nn, ""]]);
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "x² + px + q", rng),
        prompt: `This rectangle has area ${area}. One side is ${expr([[1, "x"], [m, ""]])}. What is the other side?`,
        representation: { kind: "shape", shape: "rectangle", sideLabels: ["?", expr([[1, "x"], [m, ""]])], note: `Area = ${area}` },
      },
      { m, nn },
      expr([[1, "x"], [nn, ""]]),
      [
        { text: expr([[1, "x"], [m * nn, ""]]), mistake: "fac-wrong-pair" },
        { text: expr([[1, "x"], [m + nn, ""]]), mistake: "fac-wrong-pair" },
        { text: expr([[1, "x"], [-nn, ""]]), mistake: "fac-sign-pair" },
        { text: expr([[1, "x"], [nn + 1, ""]]), mistake: null },
        { text: expr([[1, "x"], [-m, ""]]), mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const b = int(rng, 2, 9);
    const s = pick(rng, [1, -1]);
    const area = expr([[1, "x²"], [s * 2 * b, "x"], [b * b, ""]]);
    return build(
      { ...base("p-apply", "pictorial", "apply", "perfect squares", rng), prompt: `This square has area ${area}. How long is each side?`, representation: { kind: "shape", shape: "square", sideLabels: ["?"], note: `Area = ${area}` } },
      { b, s },
      expr([[1, "x"], [s * b, ""]]),
      [
        { text: expr([[1, "x"], [-s * b, ""]]), mistake: "fac-sign-pair" },
        { text: expr([[1, "x"], [s * 2 * b, ""]]), mistake: "fac-wrong-pair" },
        { text: expr([[1, "x"], [s * b * b, ""]]), mistake: "fac-wrong-pair" },
        { text: expr([[1, "x"], [s * (b + 1), ""]]), mistake: null },
        { text: expr([[1, "x"], [-s * 2 * b, ""]]), mistake: null },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const b = int(rng, 2, 9);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "a² − b²", rng),
        prompt: `A ${b} by ${b} square is cut from the corner of an x by x square. The piece left, x² − ${b * b}, is rearranged into a rectangle. What are its sides?`,
        representation: { kind: "shape", shape: "square", sideLabels: ["x"], note: `cut out: ${b} by ${b}` },
      },
      { b },
      `${bracket(1, "x", -b)} and ${bracket(1, "x", b)}`,
      [
        { text: `${bracket(1, "x", -b)} and ${bracket(1, "x", -b)}`, mistake: "fac-diff-as-square" },
        { text: `${bracket(1, "x", b)} and ${bracket(1, "x", b)}`, mistake: null },
        { text: `x and ${bracket(1, "x", -b * b)}`, mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    let m = int(rng, 2, 6), nn = int(rng, 2, 6);
    if (m === nn) nn = m + 1;
    const area = expr([[1, "x²"], [m + nn, "x"], [m * nn, ""]]);
    const name = pick(rng, ["Kabir", "Sara", "Ishaan", "Anaya", "Rohan", "Meera"]);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "x² + px + q", rng),
        prompt: `A rectangle has area ${area}. ${name} says its sides are ${bracket(1, "x", 1)} and ${bracket(1, "x", m * nn)}. Is ${name} right?`,
        representation: { kind: "shape", shape: "rectangle", sideLabels: ["?", "?"], note: `Area = ${area}` },
      },
      { m, nn },
      `No: they are ${bracket(1, "x", m)} and ${bracket(1, "x", nn)}, since ${m} × ${nn} = ${m * nn} and ${m} + ${nn} = ${m + nn}`,
      [
        { text: `Yes: 1 × ${m * nn} = ${m * nn}`, mistake: "fac-wrong-pair" },
        { text: `No: they are ${bracket(1, "x", -m)} and ${bracket(1, "x", -nn)}`, mistake: "fac-sign-pair" },
        { text: `No: they are ${bracket(1, "x", m + nn)} and ${bracket(1, "x", m * nn)}`, mistake: "fac-wrong-pair" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const k = pick(rng, [4, 6, 8, 9, 10, 12]), [a, b] = coprime(rng, 1, 7);
    const d = [2, 3].find((p) => k % p === 0 && k !== p) ?? 2;
    return build(
      { ...base("a-remember", "abstract", "remember", "common factor", rng), prompt: `Factorise ${expr([[k * a, "x"], [k * b, ""]])} fully.`, representation: null },
      { k, a, b },
      `${k}${bracket(a, "x", b)}`,
      [
        { text: `${d}${bracket((k / d) * a, "x", (k / d) * b)}`, mistake: "fac-not-highest" },
        { text: `${k}${bracket(a, "x", k * b)}`, mistake: "fac-partial" },
        { text: `${k}x(${a} + ${b})`, mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const b = int(rng, 2, 12);
    return build(
      { ...base("a-understand", "abstract", "understand", "a² − b²", rng), prompt: `Factorise ${expr([[1, "x²"], [-b * b, ""]])}.`, representation: null },
      { b },
      `${bracket(1, "x", -b)}${bracket(1, "x", b)}`,
      [
        { text: `${bracket(1, "x", -b)}²`, mistake: "fac-diff-as-square" },
        { text: `${bracket(1, "x", b)}²`, mistake: null },
        { text: `${bracket(1, "x", -b * b)}${bracket(1, "x", 1)}`, mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    let m = int(rng, 2, 9), nn = int(rng, 2, 9);
    if (m === nn) nn = m + 1;
    return build(
      { ...base("a-apply", "abstract", "apply", "x² + px + q", rng), prompt: `Factorise ${expr([[1, "x²"], [m + nn, "x"], [m * nn, ""]])}.`, representation: null },
      { m, nn },
      `${bracket(1, "x", Math.min(m, nn))}${bracket(1, "x", Math.max(m, nn))}`,
      [
        { text: `${bracket(1, "x", 1)}${bracket(1, "x", m * nn)}`, mistake: "fac-wrong-pair" },
        { text: `${bracket(1, "x", -Math.min(m, nn))}${bracket(1, "x", -Math.max(m, nn))}`, mistake: "fac-sign-pair" },
        { text: `${bracket(1, "x", m + nn)}${bracket(1, "x", m * nn)}`, mistake: "fac-wrong-pair" },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const m = int(rng, 3, 9), nn = int(rng, 1, m - 1);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "x² + px + q", rng), prompt: `Factorise ${expr([[1, "x²"], [-(m - nn), "x"], [-m * nn, ""]])}.`, representation: null },
      { m, nn },
      `${bracket(1, "x", -m)}${bracket(1, "x", nn)}`,
      [
        { text: `${bracket(1, "x", m)}${bracket(1, "x", -nn)}`, mistake: "fac-sign-pair" },
        { text: `${bracket(1, "x", -m)}${bracket(1, "x", -nn)}`, mistake: "fac-sign-pair" },
        { text: `${bracket(1, "x", -m * nn)}${bracket(1, "x", 1)}`, mistake: "fac-wrong-pair" },
        { text: `${bracket(1, "x", -nn)}${bracket(1, "x", m)}`, mistake: "fac-sign-pair" },
        { text: `${bracket(1, "x", m * nn)}${bracket(1, "x", -1)}`, mistake: "fac-wrong-pair" },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const b = int(rng, 2, 9);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "a² − b²", rng), prompt: `Which of these can be factorised as ${bracket(1, "x", -b)}${bracket(1, "x", b)}?`, representation: null },
      { b },
      expr([[1, "x²"], [-b * b, ""]]),
      [
        { text: expr([[1, "x²"], [b * b, ""]]), mistake: "fac-sum-of-squares" },
        { text: expr([[1, "x²"], [-2 * b, "x"], [b * b, ""]]), mistake: "fac-diff-as-square" },
        { text: expr([[1, "x²"], [-2 * b, ""]]), mistake: null },
        { text: expr([[1, "x²"], [2 * b, "x"], [b * b, ""]]), mistake: null },
        { text: expr([[1, "x²"], [-b, ""]]), mistake: null },
      ]
    );
  },
};
