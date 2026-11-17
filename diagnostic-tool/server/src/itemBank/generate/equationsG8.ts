import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { GroupActivity } from "../../types.js";
import { bracket, expr } from "./algebra.js";

/**
 * Linear Equations in One Variable, Grade 8 (book chapter 14), with word
 * problems: ax + b = c, brackets, x on both sides, x/a + b = c, and
 * setting up an equation from words (sums, perimeters, consecutive numbers).
 *   concrete  hands-on: bags of sweets, every bag holding x; take away the
 *             loose sweets, then share what's left between the bags
 *   pictorial bar models (bags and loose ones), a rectangle's perimeter,
 *             consecutive numbers, both sides of a balance
 *   abstract  ax + b = c, a(x + b) = c, x/a + b = c, ax + b = cx + d, a word
 *             problem
 */

const TOPIC = "g8-linear-equations";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "eq-sign-move": {
    label: "Moves a term across without changing its sign",
    detail: "From 3x + 5 = 20 writes 3x = 25.",
    childTip: "Do the same to both sides: take 5 away from both, so 3x = 20 − 5.",
  },
  "eq-divide-first": {
    label: "Divides before taking away",
    detail: "From 3x + 5 = 20 writes x + 5 = 20 ÷ 3 (only part of a side was divided).",
    childTip: "Undo the + 5 first, then divide the whole side by 3.",
  },
  "eq-wrong-inverse": {
    label: "Undoes with the wrong operation",
    detail: "Subtracts the 3 in 3x instead of dividing by it.",
    childTip: "3x means 3 × x, so undo it by dividing by 3.",
  },
  "eq-brackets": {
    label: "Drops the brackets",
    detail: "Treats 2(x + 3) = 16 as 2x + 3 = 16.",
    childTip: "Multiply out (2x + 6) or divide both sides by 2 first: x + 3 = 8.",
  },
  "eq-word-setup": {
    label: "Sets up the word problem wrongly",
    detail: "Picks the wrong unknown or the wrong relation from the words.",
    childTip: "Write what x stands for first, then each part of the sentence in terms of x.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `eq8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const bagsOf = (items: number, baskets: number): GroupActivity => ({ kind: "group", mode: "equal", icon: "🍬", itemMany: "sweets", basketOne: "bag", basketIcon: "👝", items, baskets });
const n1 = (x: number) => String(+x.toFixed(2)).replace("-", "−");
const bagBars = (a: number, x: number, b: number, total: number) => ({
  kind: "bars" as const,
  bars: [{ name: "Total", parts: [...Array.from({ length: a }, () => ({ value: x, label: "x" })), ...(b ? [{ value: b, label: String(b) }] : [])] }],
  brace: { label: String(total) },
});

export const EQUATIONS_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: bags of sweets ----------------
  "concrete|remember": (rng) => {
    const a = int(rng, 2, 4), x = int(rng, 2, 6);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "ax = c", rng), prompt: `${a}x = ${a * x}: ${a} bags hold ${a * x} sweets, the same in each. Share the sweets equally between the ${a} bags to find x.`, representation: null },
      { a, x },
      bagsOf(a * x, a)
    );
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 2, 4), x = int(rng, 2, 5), b = int(rng, 1, 6);
    return buildActivity(
      {
        ...base("c-understand", "concrete", "understand", "ax + b = c", rng),
        prompt: `${expr([[a, "x"], [b, ""]])} = ${a * x + b}. Take the ${b} loose sweets away from both sides: ${a * x} are left. Share them equally between the ${a} bags.`,
        representation: null,
      },
      { a, x, b },
      bagsOf(a * x, a)
    );
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 2, 4), x = int(rng, 2, 5), b = int(rng, 1, 6);
    const N = a * x + b;
    return build(
      {
        ...base("c-apply", "concrete", "apply", "ax + b = c", rng),
        prompt: `${a} bags of x sweets and ${b} loose sweets make ${N}: ${expr([[a, "x"], [b, ""]])} = ${N}. Share the ${N - b} sweets that belong in bags between the ${a} bags. What is x?`,
        representation: null,
        activity: bagsOf(N - b, a),
      },
      { a, x, b },
      String(x),
      [
        { text: n1((N + b) / a), mistake: "eq-sign-move" },
        { text: n1(N / a - b), mistake: "eq-divide-first" },
        { text: String(N - b - a), mistake: "eq-wrong-inverse" },
        { text: String(x + 1), mistake: null },
        { text: String(x + 2), mistake: null },
        { text: String(x * a), mistake: null },
      ]
    );
  },
  "concrete|analyze": (rng) => {
    const c = int(rng, 1, 2), a = c + int(rng, 2, 3), x = int(rng, 2, 4), b = int(rng, 1, 5);
    const d = (a - c) * x + b;
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "x on both sides", rng),
        prompt: `${expr([[a, "x"], [b, ""]])} = ${expr([[c, "x"], [d, ""]])}. Take ${c} bag${c > 1 ? "s" : ""} and ${b} loose sweets from both sides, then share the ${d - b} sweets left between the ${a - c} bag${a - c > 1 ? "s" : ""}. What is x?`,
        representation: null,
        activity: bagsOf(d - b, a - c),
      },
      { a, b, c, x },
      String(x),
      [
        { text: n1((d + b) / (a - c)), mistake: "eq-sign-move" },
        { text: n1((d - b) / (a + c)), mistake: "eq-sign-move" },
        { text: n1((d - b) / a), mistake: null },
        { text: String(x + 1), mistake: null },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const x = int(rng, 2, 6), b = int(rng, 1, 5);
    const N = 2 * (x + b);
    const name = pick(rng, ["Ravi", "Meera", "Arjun", "Diya", "Kabir", "Sara"]);
    return build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "brackets", rng),
        prompt: `2${bracket(1, "x", b)} = ${N}: 2 groups, each a bag of x and ${b} loose sweets. Share the ${N} sweets between the 2 groups. ${name} says x = ${n1((N - b) / 2)}. Is ${name} right?`,
        representation: null,
        activity: { kind: "group", mode: "equal", icon: "🍬", itemMany: "sweets", basketOne: "group", basketIcon: "", items: N, baskets: 2 },
      },
      { x, b },
      `No: each group is x + ${b} = ${N / 2}, so x = ${x}`,
      [
        { text: `Yes: 2x + ${b} = ${N}, so x = ${n1((N - b) / 2)}`, mistake: "eq-brackets" },
        { text: `No: x = ${N / 2 + b}`, mistake: "eq-sign-move" },
        { text: `No: x = ${N - b}`, mistake: null },
        { text: `No: x = ${x + 1}`, mistake: null },
      ]
    );
  },

  // ---------------- PICTORIAL: bar models ----------------
  "pictorial|remember": (rng) => {
    const a = int(rng, 2, 5), x = int(rng, 3, 12), b = int(rng, 2, 9);
    const N = a * x + b;
    return build(
      { ...base("p-remember", "pictorial", "remember", "ax + b = c", rng), prompt: `The bar shows ${expr([[a, "x"], [b, ""]])} = ${N}. What is x?`, representation: bagBars(a, x, b, N) },
      { a, x, b },
      String(x),
      [
        { text: n1((N + b) / a), mistake: "eq-sign-move" },
        { text: n1(N / a - b), mistake: "eq-divide-first" },
        { text: String(N - b - a), mistake: "eq-wrong-inverse" },
        { text: String(x + 1), mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const x = int(rng, 5, 40), d = int(rng, 2, 15);
    const T = 2 * x + d;
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "word problems", rng),
        prompt: `Sita has ${d} more stickers than Ravi. Together they have ${T}. How many does Ravi have?`,
        representation: { kind: "bars", bars: [{ name: "Ravi", parts: [{ value: x, label: "x" }] }, { name: "Sita", parts: [{ value: x, label: "x" }, { value: d, label: `${d}` }] }] },
      },
      { x, d },
      String(x),
      [
        { text: n1((T + d) / 2), mistake: "eq-sign-move" },
        { text: n1(T / 2 - d), mistake: "eq-divide-first" },
        { text: String(T - d), mistake: "eq-wrong-inverse" },
        { text: String(x + d), mistake: "eq-word-setup" },
        { text: String(x + 1), mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const d = int(rng, 2, 10);
    let w = int(rng, 3, 20);
    if (w === d) w += 1;
    const P = 2 * (2 * w + d);
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "word problems", rng),
        prompt: `A rectangle is ${d} cm longer than it is wide. Its perimeter is ${P} cm. How wide is it?`,
        representation: { kind: "shape", shape: "rectangle", sideLabels: [`w + ${d}`, "w"], note: `Perimeter = ${P} cm` },
      },
      { w, d },
      `${w} cm`,
      [
        { text: `${n1((P - d) / 4)} cm`, mistake: "eq-brackets" },
        { text: `${n1((P / 2 + d) / 2)} cm`, mistake: "eq-sign-move" },
        { text: `${n1(P / 4)} cm`, mistake: "eq-word-setup" },
        { text: `${w + d} cm`, mistake: "eq-word-setup" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const k = int(rng, 5, 60);
    const S = 3 * k + 3;
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "word problems", rng),
        prompt: `Three consecutive numbers add up to ${S}. What is the smallest?`,
        representation: { kind: "bars", bars: [{ name: "1st", parts: [{ value: k, label: "x" }] }, { name: "2nd", parts: [{ value: k, label: "x" }, { value: 1, label: "1" }] }, { name: "3rd", parts: [{ value: k, label: "x" }, { value: 2, label: "2" }] }] },
      },
      { k },
      String(k),
      [
        { text: String(k + 1), mistake: "eq-word-setup" },
        { text: n1((S + 3) / 3), mistake: "eq-sign-move" },
        { text: String(S - 3), mistake: "eq-wrong-inverse" },
        { text: String(k - 1), mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const c = int(rng, 1, 3), a = c + int(rng, 1, 3), x = int(rng, 2, 9), b = int(rng, 1, 9);
    const d = (a - c) * x + b;
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "x on both sides", rng),
        prompt: `The two bars are equal: ${expr([[a, "x"], [b, ""]])} = ${expr([[c, "x"], [d, ""]])}. What is x?`,
        representation: {
          kind: "bars",
          bars: [
            { name: "Left", parts: [...Array.from({ length: a }, () => ({ value: x, label: "x" })), { value: b, label: String(b) }] },
            { name: "Right", parts: [...Array.from({ length: c }, () => ({ value: x, label: "x" })), { value: d, label: String(d) }] },
          ],
        },
      },
      { a, b, c, x },
      String(x),
      [
        { text: n1((d + b) / (a - c)), mistake: "eq-sign-move" },
        { text: n1((d - b) / (a + c)), mistake: "eq-sign-move" },
        { text: n1((d - b) / a), mistake: null },
        { text: String(x + 1), mistake: null },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const a = int(rng, 2, 9), x = int(rng, -9, 15), b = int(rng, 1, 20) * pick(rng, [1, -1]);
    const N = a * x + b;
    return build(
      { ...base("a-remember", "abstract", "remember", "ax + b = c", rng), prompt: `Solve ${expr([[a, "x"], [b, ""]])} = ${n1(N)}.`, representation: null },
      { a, x, b },
      `x = ${n1(x)}`,
      [
        { text: `x = ${n1((N + b) / a)}`, mistake: "eq-sign-move" },
        { text: `x = ${n1(N / a - b)}`, mistake: "eq-divide-first" },
        { text: `x = ${n1(N - b - a)}`, mistake: "eq-wrong-inverse" },
        { text: `x = ${n1(x + 1)}`, mistake: null },
        { text: `x = ${n1((x) + 2)}`, mistake: null },
        { text: `x = ${n1((x) - 1)}`, mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 2, 6), x = int(rng, 1, 12), b = int(rng, 1, 9);
    const N = a * (x + b);
    return build(
      { ...base("a-understand", "abstract", "understand", "brackets", rng), prompt: `Solve ${a}${bracket(1, "x", b)} = ${N}.`, representation: null },
      { a, x, b },
      `x = ${x}`,
      [
        { text: `x = ${n1((N - b) / a)}`, mistake: "eq-brackets" },
        { text: `x = ${N / a + b}`, mistake: "eq-sign-move" },
        { text: `x = ${N - a - b}`, mistake: "eq-wrong-inverse" },
        { text: `x = ${n1((x) + 2)}`, mistake: null },
        { text: `x = ${n1((x) - 1)}`, mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 2, 6), c = int(rng, 5, 15), b = int(rng, 1, c - 1);
    return build(
      { ...base("a-apply", "abstract", "apply", "fractions", rng), prompt: `Solve x/${a} + ${b} = ${c}.`, representation: null },
      { a, b, c },
      `x = ${a * (c - b)}`,
      [
        { text: `x = ${a * c - b}`, mistake: "eq-divide-first" },
        { text: `x = ${n1((c - b) / a)}`, mistake: "eq-wrong-inverse" },
        { text: `x = ${a * (c + b)}`, mistake: "eq-sign-move" },
        { text: `x = ${n1((a * (c - b)) + 2)}`, mistake: null },
        { text: `x = ${n1((a * (c - b)) - 1)}`, mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const c = int(rng, 1, 5), a = c + int(rng, 1, 4), x = int(rng, -6, 10), b = int(rng, -9, 9);
    const d = (a - c) * x + b;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "x on both sides", rng), prompt: `Solve ${expr([[a, "x"], [b, ""]])} = ${expr([[c, "x"], [d, ""]])}.`, representation: null },
      { a, b, c, x },
      `x = ${n1(x)}`,
      [
        { text: `x = ${n1((d + b) / (a - c))}`, mistake: "eq-sign-move" },
        { text: `x = ${n1((d - b) / (a + c))}`, mistake: "eq-sign-move" },
        { text: `x = ${n1((d - b) / a)}`, mistake: null },
        { text: `x = ${n1(x + 1)}`, mistake: null },
        { text: `x = ${n1((x) + 2)}`, mistake: null },
        { text: `x = ${n1((x) - 1)}`, mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const small = int(rng, 5, 60), k = int(rng, 2, 30);
    const S = 2 * small + k;
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "word problems", rng), prompt: `Two numbers add up to ${S}. One is ${k} more than the other. What is the smaller number?`, representation: null },
      { small, k },
      String(small),
      [
        { text: n1((S + k) / 2), mistake: "eq-sign-move" },
        { text: n1(S / 2), mistake: "eq-word-setup" },
        { text: String(S - k), mistake: "eq-wrong-inverse" },
        { text: String(small + k), mistake: "eq-word-setup" },
        { text: `${small + 2}`, mistake: null },
        { text: `${small - 1}`, mistake: null },
      ]
    );
  },
};
