import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { GroupActivity } from "../../types.js";
import { bracket, expr } from "./algebra.js";

/**
 * Algebraic Expressions, Grade 8 (book chapter 11), including operations:
 * like and unlike terms, adding and subtracting, the value of an
 * expression, multiplying (monomial × binomial, binomial × binomial) and
 * dividing by a monomial. Integer coefficients, as the book says.
 *   concrete  hands-on: bags of marbles, every bag holding x: make 3x, make
 *             2x + 3x, make 3x + 2 and find its value, collect like terms,
 *             test "2x + 3 = 5x"
 *   pictorial algebra tiles (x-tiles and ones), rectangles whose sides are
 *             expressions (area = product), dividing an area by a side
 *   abstract  value, subtracting, a × (b + c), (ax + b)(cx + d), dividing
 */

const TOPIC = "g8-expressions";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "alg-unlike-terms": {
    label: "Adds unlike terms",
    detail: "Writes 2x + 3 as 5x, joining terms that aren't alike.",
    childTip: "Only add terms with the same letters: 2x + 3x = 5x, but 2x + 3 stays 2x + 3.",
  },
  "alg-multiplies-like": {
    label: "Multiplies when adding like terms",
    detail: "Writes x + x as x² or 2x + 3x as 5x².",
    childTip: "Adding x's counts them: 2x + 3x = 5x. Only x × x makes x².",
  },
  "alg-concatenates": {
    label: "Puts the number next to the coefficient",
    detail: "With x = 5, reads 3x as 35 instead of 3 × 5.",
    childTip: "3x means 3 × x. Put the number in brackets: 3(5) = 15.",
  },
  "alg-sign-distribution": {
    label: "Doesn't change every sign when taking away brackets",
    detail: "Works out (5x + 2) − (3x − 4) as 2x − 2: the minus only reached the first term.",
    childTip: "Taking away a bracket changes the sign of everything inside it.",
  },
  "alg-partial-distribution": {
    label: "Multiplies only the first term in brackets",
    detail: "Writes 3(x + 4) as 3x + 4.",
    childTip: "Multiply every term inside the bracket: 3(x + 4) = 3x + 12.",
  },
  "alg-misses-cross": {
    label: "Misses the middle terms",
    detail: "Writes (x + 2)(x + 3) as x² + 6, leaving out 2x and 3x.",
    childTip: "Each term in the first bracket multiplies each term in the second: four products.",
  },
  "alg-power-slip": {
    label: "Gets the power wrong when multiplying",
    detail: "Writes x × x as x (or 2x · 3x as 6x), losing the square.",
    childTip: "x × x = x². Add the powers of the same letter.",
  },
  "alg-divide-one-term": {
    label: "Divides only one term",
    detail: "Writes (6x² + 4x) ÷ 2x as 3x + 4x: the second term wasn't divided.",
    childTip: "Divide every term by the divisor.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `ex8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const bags = (extra: Partial<GroupActivity> & Pick<GroupActivity, "mode" | "items">): GroupActivity => ({ kind: "group", icon: "🔵", itemMany: "marbles", basketOne: "bag", basketIcon: "👝", ...extra });
const tiles = (x: number, ones: number) => ({
  kind: "concrete" as const,
  icon: "🟦",
  itemCount: x + ones,
  groups: 1,
  groupLabel: "",
  segments: [
    { icon: "🟦", count: x, label: "x-tile" },
    { icon: "🟨", count: ones, label: "one" },
  ],
});

export const EXPRESSIONS_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: bags of marbles (every bag holds x) ----------------
  "concrete|remember": (rng) => {
    const a = int(rng, 2, 4), k = int(rng, 3, 5);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "terms", rng), prompt: `x = ${k}, so each bag holds ${k} marbles and stands for one x. Put ${k} marbles in each bag you need to show ${a}x.`, representation: null },
      { a, k },
      bags({ mode: "size", items: a * k, size: k, maxBaskets: a + 2 })
    );
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 1, 3), b = int(rng, 1, 3), k = int(rng, 2, 4);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "like terms", rng), prompt: `x = ${k}, so each bag holds ${k} marbles and stands for one x. Put ${k} marbles in each bag you need to show ${expr([[a, "x"]])} + ${expr([[b, "x"]])}.`, representation: null },
      { a, b, k },
      bags({ mode: "size", items: (a + b) * k, size: k, maxBaskets: a + b + 2 })
    );
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 2, 4), k = int(rng, 3, 6), r = int(rng, 1, k - 1);
    const v = a * k + r;
    return build(
      {
        ...base("c-apply", "concrete", "apply", "value", rng),
        prompt: `x = ${k}, so each bag holds ${k} marbles and stands for one x. Show ${a}x + ${r}: put ${k} marbles in each of ${a} bags and leave ${r} in the pile. How many marbles is ${a}x + ${r} when x = ${k}?`,
        representation: null,
        activity: bags({ mode: "size", items: v, size: k, maxBaskets: a + 2 }),
      },
      { a, k, r },
      String(v),
      [
        { text: String(Number(`${a}${k}`) + r), mistake: "alg-concatenates" },
        { text: String((a + r) * k), mistake: "alg-unlike-terms" },
        { text: String(a + k + r), mistake: null },
        { text: String(a * k * r), mistake: null },
      ]
    );
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 1, 3), c = int(rng, 1, 3), k = int(rng, 3, 4), b = int(rng, 1, k - 1);
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "like terms", rng),
        prompt: `x = ${k}, so each bag holds ${k} marbles and stands for one x; loose marbles are the number part. Show ${expr([[a, "x"], [b, ""], [c, "x"]])} with bags of ${k} and loose marbles. Which is the same expression, simplified?`,
        representation: null,
        activity: bags({ mode: "size", items: (a + c) * k + b, size: k, maxBaskets: a + c + 2 }),
      },
      { a, b, c, k },
      expr([[a + c, "x"], [b, ""]]),
      [
        { text: expr([[a + b + c, "x"]]), mistake: "alg-unlike-terms" },
        { text: expr([[a + c, "x²"], [b, ""]]), mistake: "alg-multiplies-like" },
        { text: expr([[a + c + b, ""]]), mistake: null },
        { text: expr([[a * c, "x"], [b, ""]]), mistake: null },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 2, 3), k = int(rng, 3, 5), b = int(rng, 1, k - 1); // fewer loose than a bag holds
    const name = pick(rng, ["Meera", "Arjun", "Kabir", "Diya", "Rohan", "Sara"]);
    return build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "like terms", rng),
        prompt: `${name} says ${a}x + ${b} = ${a + b}x. Test it with x = ${k}: put ${k} marbles in each bag to show ${a}x, and leave the other ${b} in the pile. That's ${a}x + ${b}. Would ${a + b} full bags (${a + b}x) be the same?`,
        representation: null,
        activity: bags({ mode: "size", items: a * k + b, size: k, maxBaskets: a }),
      },
      { a, b, k },
      `No: ${a}x + ${b} is ${a * k + b} marbles, but ${a + b}x is ${(a + b) * k}`,
      [
        { text: `Yes: ${a} + ${b} = ${a + b}`, mistake: "alg-unlike-terms" },
        { text: `No: it is ${a * b}x`, mistake: null },
        { text: `No: it is ${a + b}x²`, mistake: "alg-multiplies-like" },
      ]
    );
  },

  // ---------------- PICTORIAL: tiles and area ----------------
  "pictorial|remember": (rng) => {
    const a = int(rng, 2, 6), b = int(rng, 1, 7);
    return build(
      { ...base("p-remember", "pictorial", "remember", "terms", rng), prompt: "Each blue tile is x and each yellow tile is 1. Which expression do the tiles show?", representation: tiles(a, b) },
      { a, b },
      expr([[a, "x"], [b, ""]]),
      [
        { text: expr([[a + b, "x"]]), mistake: "alg-unlike-terms" },
        { text: expr([[b, "x"], [a, ""]]), mistake: null },
        { text: expr([[a * b, "x"]]), mistake: null },
        { text: expr([[a, "x"], [b + 1, ""]]), mistake: null },
        { text: expr([[a, "x²"], [b, ""]]), mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const a = int(rng, 2, 5), b = int(rng, 1, 6), c = int(rng, 1, 4);
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "like terms", rng),
        prompt: `The tiles show ${expr([[a, "x"], [b, ""]])} and then ${c} more x-tiles. Which is the total, simplified?`,
        representation: tiles(a + c, b),
      },
      { a, b, c },
      expr([[a + c, "x"], [b, ""]]),
      [
        { text: expr([[a + b + c, "x"]]), mistake: "alg-unlike-terms" },
        { text: expr([[a + c, "x²"], [b, ""]]), mistake: "alg-multiplies-like" },
        { text: expr([[a * c, "x"], [b, ""]]), mistake: null },
        { text: expr([[a + c + 1, "x"], [b, ""]]), mistake: null },
        { text: expr([[a + c, "x"], [b + 1, ""]]), mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 2, 7), b = int(rng, 2, 9);
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "multiplying", rng),
        prompt: `A rectangle is ${a} long and ${expr([[1, "x"], [b, ""]])} wide. What is its area?`,
        representation: { kind: "shape", shape: "rectangle", sideLabels: [expr([[1, "x"], [b, ""]]), String(a)] },
      },
      { a, b },
      expr([[a, "x"], [a * b, ""]]),
      [
        { text: expr([[a, "x"], [b, ""]]), mistake: "alg-partial-distribution" },
        { text: expr([[a + 1, "x"], [b, ""]]), mistake: null },
        { text: expr([[a * b, "x"]]), mistake: "alg-unlike-terms" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const a = int(rng, 1, 6);
    let b = int(rng, 2, 7);
    if (b === a) b = a + 1;
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "binomial × binomial", rng),
        prompt: `A rectangle has sides ${expr([[1, "x"], [a, ""]])} and ${expr([[1, "x"], [b, ""]])}. What is its area?`,
        representation: { kind: "shape", shape: "rectangle", sideLabels: [expr([[1, "x"], [a, ""]]), expr([[1, "x"], [b, ""]])] },
      },
      { a, b },
      expr([[1, "x²"], [a + b, "x"], [a * b, ""]]),
      [
        { text: expr([[1, "x²"], [a * b, ""]]), mistake: "alg-misses-cross" },
        { text: expr([[2, "x"], [a * b, ""]]), mistake: "alg-power-slip" },
        { text: expr([[1, "x²"], [a * b, "x"], [a + b, ""]]), mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const k = int(rng, 2, 5), a = int(rng, 1, 5), b = int(rng, 1, 7);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "dividing", rng),
        prompt: `This rectangle has area ${expr([[k * a, "x"], [k * b, ""]])} and one side ${k}. How long is the other side?`,
        representation: { kind: "shape", shape: "rectangle", sideLabels: ["?", String(k)], note: `Area = ${expr([[k * a, "x"], [k * b, ""]])}` },
      },
      { k, a, b },
      expr([[a, "x"], [b, ""]]),
      [
        { text: expr([[a, "x"], [k * b, ""]]), mistake: "alg-divide-one-term" },
        { text: expr([[k * a, "x"], [b, ""]]), mistake: "alg-divide-one-term" },
        { text: expr([[a + b, "x"]]), mistake: "alg-unlike-terms" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const a = int(rng, 2, 9), k = int(rng, 2, 9), b = int(rng, 1, 9);
    return build(
      { ...base("a-remember", "abstract", "remember", "value", rng), prompt: `Find the value of ${expr([[a, "x"], [b, ""]])} when x = ${k}.`, representation: null },
      { a, k, b },
      String(a * k + b),
      [
        { text: String(Number(`${a}${k}`) + b), mistake: "alg-concatenates" },
        { text: String((a + b) * k), mistake: "alg-unlike-terms" },
        { text: String(a + k + b), mistake: null },
        { text: String(a * k + b + 1), mistake: null },
        { text: String(a * k - b), mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 4, 9), c = int(rng, 1, a - 1), b = int(rng, 1, 9), d = int(rng, 1, 9);
    return build(
      { ...base("a-understand", "abstract", "understand", "subtracting", rng), prompt: `${bracket(a, "x", b)} − ${bracket(c, "x", -d)} = ?`, representation: null },
      { a, b, c, d },
      expr([[a - c, "x"], [b + d, ""]]),
      [
        { text: expr([[a - c, "x"], [b - d, ""]]), mistake: "alg-sign-distribution" },
        { text: expr([[a - c + b + d, "x"]]), mistake: "alg-unlike-terms" },
        { text: expr([[a + c, "x"], [b + d, ""]]), mistake: "alg-sign-distribution" },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 2, 6), b = int(rng, 2, 5), c = int(rng, 1, 9);
    const s = pick(rng, [1, -1]);
    return build(
      { ...base("a-apply", "abstract", "apply", "monomial × binomial", rng), prompt: `${a}x${bracket(b, "x", s * c)} = ?`, representation: null },
      { a, b, c, s },
      expr([[a * b, "x²"], [s * a * c, "x"]]),
      [
        { text: expr([[a * b, "x²"], [s * c, ""]]), mistake: "alg-partial-distribution" },
        { text: expr([[a * b, "x"], [s * a * c, "x"]]), mistake: "alg-power-slip" },
        { text: expr([[a * b, "x²"], [s * a * c, "x²"]]), mistake: null },
        { text: expr([[a + b, "x²"], [s * a * c, "x"]]), mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 1, 3), b = int(rng, 1, 6) * pick(rng, [1, -1]), c = int(rng, 1, 3), d = int(rng, 1, 6) * pick(rng, [1, -1]);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "binomial × binomial", rng), prompt: `${bracket(a, "x", b)}${bracket(c, "x", d)} = ?`, representation: null },
      { a, b, c, d },
      expr([[a * c, "x²"], [a * d + b * c, "x"], [b * d, ""]]),
      [
        { text: expr([[a * c, "x²"], [b * d, ""]]), mistake: "alg-misses-cross" },
        { text: expr([[a * c, "x²"], [a * d + b * c, "x"], [b + d, ""]]), mistake: null },
        { text: expr([[a * c, "x"], [a * d + b * c, "x"], [b * d, ""]]), mistake: "alg-power-slip" },
        { text: expr([[a * c, "x²"], [-(a * d + b * c), "x"], [b * d, ""]]), mistake: null },
        { text: expr([[a * c, "x²"], [a * d + b * c + 1, "x"], [b * d, ""]]), mistake: null },
        { text: expr([[a + c, "x²"], [a * d + b * c, "x"], [b * d, ""]]), mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const k = int(rng, 2, 5), a = int(rng, 2, 6), b = int(rng, 1, 7);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "dividing", rng), prompt: `(${expr([[k * a, "x³"], [k * b, "x²"]])}) ÷ ${k}x = ?`, representation: null },
      { k, a, b },
      expr([[a, "x²"], [b, "x"]]),
      [
        { text: expr([[a, "x²"], [k * b, "x²"]]), mistake: "alg-divide-one-term" },
        { text: expr([[a, "x³"], [b, "x²"]]), mistake: "alg-power-slip" },
        { text: expr([[a, "x³"], [b, "x"]]), mistake: null },
      ]
    );
  },
};
