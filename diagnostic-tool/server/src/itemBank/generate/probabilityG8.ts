import { Rng, Template, build, buildActivity, gcd, int, pick } from "./core.js";
import { FigureSpec, ShadeActivity } from "../../types.js";

/**
 * Probability, Grade 8 (book chapter 25): the chance of an event with
 * equally likely outcomes (coins, dice, cards, spinners) as
 * favourable ÷ total, 0 to 1, "not" as 1 minus, experimental probability
 * from results, and why past results don't change the next toss.
 *   concrete  hands-on: shade the outcomes that make an event happen (die
 *             faces 1–6, cards 1–10, 1–12, 1–20)
 *   pictorial spinners, coin-toss results, outcomes of two coins
 *   abstract  a single outcome, a bag of counters, "not", two dice, which
 *             number can be a probability
 */

const TOPIC = "g8-probability";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "pr-complement": {
    label: "Gives the opposite event",
    detail: "Counts the outcomes where the event does NOT happen.",
    childTip: "Read the event again and count only the outcomes that make it happen.",
  },
  "pr-boundary": {
    label: "Includes the end number wrongly",
    detail: "Counts 4 as 'greater than 4'.",
    childTip: "'Greater than 4' starts at 5. 'At least 4' includes 4.",
  },
  "pr-one-prime": {
    label: "Counts 1 as prime",
    detail: "1 has only one factor, so it isn't prime.",
    childTip: "A prime has exactly two factors. 1 has only one.",
  },
  "pr-and-or": {
    label: "Mixes up 'and' with 'or'",
    detail: "Counts only outcomes that are both when either one would do.",
    childTip: "'Or' means either one (or both). 'And' means both at once.",
  },
  "pr-count-not-chance": {
    label: "Gives the count, not the probability",
    detail: "Answers 3 instead of 3/6.",
    childTip: "Probability = favourable outcomes ÷ all outcomes.",
  },
  "pr-odds": {
    label: "Divides by the unfavourable outcomes",
    detail: "Uses favourable ÷ unfavourable (like 2/4) instead of favourable ÷ total (2/6).",
    childTip: "Divide by ALL the outcomes, not just the ones where it doesn't happen.",
  },
  "pr-count-sections": {
    label: "Treats unequal sections as equally likely",
    detail: "Counts sections on a spinner even when they are different sizes.",
    childTip: "A bigger section is more likely. Use its fraction of the whole circle.",
  },
  "pr-outcomes": {
    label: "Misses some outcomes",
    detail: "Thinks two coins have 3 outcomes (2 heads, 2 tails, one of each), missing that HT and TH are different.",
    childTip: "List them: HH, HT, TH, TT. Four equally likely outcomes.",
  },
  "pr-gambler": {
    label: "Thinks past results change the next chance",
    detail: "Expects tails to be 'due' after several heads.",
    childTip: "A coin has no memory: every toss is 1/2 heads, whatever came before.",
  },
  "pr-experiment-theory": {
    label: "Mixes up experimental and expected probability",
    detail: "Gives 1/2 when the question asks what happened in the experiment (or the other way round).",
    childTip: "Experimental probability = times it happened ÷ number of tries.",
  },
  "pr-more-than-1": {
    label: "Thinks a probability can be more than 1 (or negative)",
    detail: "Every probability is between 0 (impossible) and 1 (certain).",
    childTip: "Probability is always from 0 to 1.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `pr8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const frac = (a: number, b: number) => {
  if (a === 0) return "0";
  const g = gcd(a, b);
  return b / g === 1 ? String(a / g) : `${a / g}/${b / g}`;
};
/** Numbers 1…n in a grid (2 rows for more than 6); shade the ones in `pick`. */
function cards(n: number, yes: (k: number) => boolean, wrong: { test: (k: number) => boolean; mistake: string }[]): ShadeActivity {
  const all = Array.from({ length: n }, (_, i) => i + 1);
  const cellsOf = (t: (k: number) => boolean) => all.filter(t).map((k) => k - 1);
  const target = cellsOf(yes);
  const key = (c: number[]) => c.join(",");
  const ws = wrong.map((w) => ({ cells: cellsOf(w.test), mistake: w.mistake })).filter((w, i, arr) => w.cells.length && key(w.cells) !== key(target) && arr.findIndex((x) => key(x.cells) === key(w.cells)) === i);
  return { kind: "shade", mode: "free", rows: n > 6 ? 2 : 1, cols: n > 6 ? n / 2 : n, numbered: true, target: target.length, targetCells: target, wrongSets: ws };
}
const isPrime = (k: number) => k > 1 && Array.from({ length: k - 2 }, (_, i) => i + 2).every((d) => k % d !== 0);
const spinner = (slices: { value: number; label: string }[]): FigureSpec => ({ kind: "figure", figure: "pie", slices });
const COLOURS = ["red", "blue", "green", "yellow", "purple"];

export const PROBABILITY_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: shade the outcomes ----------------
  "concrete|remember": (rng) => {
    const even = rng() < 0.5;
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "outcomes", rng), prompt: `A die is rolled. Shade every outcome that is ${even ? "an even" : "an odd"} number.`, representation: null },
      { e: even ? 1 : 0 },
      cards(6, (k) => (k % 2 === 0) === even, [{ test: (k) => (k % 2 === 0) !== even, mistake: "pr-complement" }])
    );
  },
  "concrete|understand": (rng) => {
    const k0 = int(rng, 2, 4);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "outcomes", rng), prompt: `A die is rolled. Shade every outcome that is greater than ${k0}.`, representation: null },
      { k0 },
      cards(6, (k) => k > k0, [{ test: (k) => k >= k0, mistake: "pr-boundary" }, { test: (k) => k <= k0, mistake: "pr-complement" }])
    );
  },
  "concrete|apply": (rng) => {
    const n = pick(rng, [10, 12]);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "outcomes", rng), prompt: `Cards numbered 1 to ${n} are shuffled and one is picked. Shade every card that is a prime number.`, representation: null },
      { n },
      cards(n, isPrime, [{ test: (k) => isPrime(k) || k === 1, mistake: "pr-one-prime" }])
    );
  },
  "concrete|analyze": (rng) => {
    const n = 12, m = pick(rng, [2, 3, 4, 5]);
    const fav = Math.floor(n / m);
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "probability", rng),
        prompt: `Cards 1 to ${n}: shade the multiples of ${m}. If one card is picked at random, what is the probability it is a multiple of ${m}?`,
        representation: null,
        activity: cards(n, (k) => k % m === 0, []),
      },
      { m },
      frac(fav, n),
      [
        { text: String(fav), mistake: "pr-count-not-chance" },
        { text: frac(fav, n - fav), mistake: "pr-odds" },
        { text: frac(n - fav, n), mistake: "pr-complement" },
        { text: frac(1, m), mistake: null },
        { text: frac(fav + 1, n), mistake: null },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const [a, b] = pick(rng, [[4, 5], [3, 5], [4, 6], [3, 4], [5, 6]] as const);
    return buildActivity(
      { ...base("c-evaluate", "concrete", "evaluate", "or", rng), prompt: `Cards 1 to 20. Shade every card that is a multiple of ${a} OR a multiple of ${b} (or both).`, representation: null },
      { a, b },
      cards(20, (k) => k % a === 0 || k % b === 0, [{ test: (k) => k % a === 0 && k % b === 0, mistake: "pr-and-or" }, { test: (k) => k % a === 0, mistake: "pr-and-or" }])
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const n = pick(rng, [4, 5, 6, 8]);
    const names = Array.from({ length: n }, (_, i) => COLOURS[i % 3]);
    const target = names[0];
    const fav = names.filter((x) => x === target).length;
    return build(
      { ...base("p-remember", "pictorial", "remember", "spinners", rng), prompt: `This spinner has ${n} equal sections. What is the probability of landing on ${target}?`, representation: spinner(names.map((c) => ({ value: 1, label: c }))) },
      { n },
      frac(fav, n),
      [
        { text: String(fav), mistake: "pr-count-not-chance" },
        { text: frac(fav, n - fav), mistake: "pr-odds" },
        { text: frac(1, 3), mistake: "pr-outcomes" },
        { text: frac(n - fav, n), mistake: "pr-complement" },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const [a, b, c] = pick(rng, [[180, 90, 90], [120, 120, 120], [90, 90, 180], [240, 60, 60], [180, 120, 60], [270, 45, 45]] as const);
    if (a === b && b === c) return PROBABILITY_G8_TEMPLATES["pictorial|understand"](rng);
    return build(
      { ...base("p-understand", "pictorial", "understand", "spinners", rng), prompt: "What is the probability that this spinner lands on A?", representation: spinner([{ value: a, label: "A" }, { value: b, label: "B" }, { value: c, label: "C" }]) },
      { a, b },
      frac(a, 360),
      [
        { text: "1/3", mistake: "pr-count-sections" },
        { text: frac(a, b + c), mistake: "pr-odds" },
        { text: frac(b + c, 360), mistake: "pr-complement" },
        { text: frac(b, 360), mistake: null },
        { text: "1/2", mistake: null },
        { text: "1/4", mistake: null },
        { text: "2/3", mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const N = pick(rng, [20, 40, 50, 60, 100]), h = int(rng, Math.round(N * 0.3), Math.round(N * 0.7));
    if (h * 2 === N) return PROBABILITY_G8_TEMPLATES["pictorial|apply"](rng);
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "experiments", rng),
        prompt: `A coin was tossed ${N} times. The bars show the results. What is the experimental probability of heads?`,
        representation: { kind: "bars", bars: [{ name: "Heads", parts: [{ value: h, label: String(h) }] }, { name: "Tails", parts: [{ value: N - h, label: String(N - h) }] }] },
      },
      { N, h },
      frac(h, N),
      [
        { text: "1/2", mistake: "pr-experiment-theory" },
        { text: frac(h, N - h), mistake: "pr-odds" },
        { text: String(h), mistake: "pr-count-not-chance" },
        { text: frac(N - h, N), mistake: "pr-complement" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const both = pick(rng, ["heads", "tails"]);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "two coins", rng),
        prompt: `Two coins are tossed together. What is the probability of getting two ${both}?`,
        representation: { kind: "concrete", icon: "🪙", itemCount: 2, groups: 1, groupLabel: "two coins" },
      },
      { b: both === "heads" ? 1 : 0 },
      "1/4",
      [
        { text: "1/3", mistake: "pr-outcomes" },
        { text: "1/2", mistake: null },
        { text: "2", mistake: "pr-count-not-chance" },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const k = int(rng, 4, 8);
    const name = pick(rng, ["Riya", "Arjun", "Meera", "Kabir", "Diya", "Rohan"]);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "independence", rng),
        prompt: `A fair coin has landed heads ${k} times in a row. ${name} says tails is now more likely. Is ${name} right?`,
        representation: { kind: "bars", bars: [{ name: "Heads", parts: [{ value: k, label: String(k) }] }, { name: "Tails", parts: [{ value: 0.2, label: "0" }] }] },
      },
      { k },
      "No: the next toss is still 1/2 heads, 1/2 tails",
      [
        { text: "Yes: tails is due after so many heads", mistake: "pr-gambler" },
        { text: `No: heads is now more likely, ${k}/${k}`, mistake: "pr-experiment-theory" },
        { text: `Yes: tails is now ${k}/${k + 1}`, mistake: "pr-gambler" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const f = int(rng, 1, 6);
    return build(
      { ...base("a-remember", "abstract", "remember", "probability", rng), prompt: `A die is rolled. What is the probability of getting a ${f}?`, representation: null },
      { f },
      "1/6",
      [
        { text: "1/5", mistake: "pr-odds" },
        { text: String(f), mistake: "pr-count-not-chance" },
        { text: "5/6", mistake: "pr-complement" },
        { text: `${f}/6`, mistake: null },
      ].filter((w) => w.text !== "1/6")
    );
  },
  "abstract|understand": (rng) => {
    const r = int(rng, 2, 9), b = int(rng, 2, 9);
    if (r === b) return PROBABILITY_G8_TEMPLATES["abstract|understand"](rng);
    return build(
      { ...base("a-understand", "abstract", "understand", "probability", rng), prompt: `A bag has ${r} red and ${b} blue counters. One is taken without looking. What is the probability it is red?`, representation: null },
      { r, b },
      frac(r, r + b),
      [
        { text: frac(r, b), mistake: "pr-odds" },
        { text: String(r), mistake: "pr-count-not-chance" },
        { text: frac(b, r + b), mistake: "pr-complement" },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const d = pick(rng, [5, 7, 8, 9, 10, 12]), a = int(rng, 1, d - 1);
    if (gcd(a, d) !== 1) return PROBABILITY_G8_TEMPLATES["abstract|apply"](rng);
    return build(
      { ...base("a-apply", "abstract", "apply", "not", rng), prompt: `The probability that it rains tomorrow is ${a}/${d}. What is the probability that it does NOT rain?`, representation: null },
      { a, d },
      frac(d - a, d),
      [
        { text: `${a}/${d}`, mistake: "pr-complement" },
        { text: frac(d, a), mistake: "pr-more-than-1" },
        { text: frac(d - a, a), mistake: "pr-odds" },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const s = int(rng, 3, 11);
    const ways = 6 - Math.abs(7 - s);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "two dice", rng), prompt: `Two dice are rolled and the numbers added. What is the probability the total is ${s}?`, representation: null },
      { s },
      frac(ways, 36),
      [
        { text: "1/11", mistake: "pr-outcomes" },
        { text: frac(ways, 12), mistake: "pr-outcomes" },
        { text: String(ways), mistake: "pr-count-not-chance" },
        { text: frac(1, 36), mistake: "pr-outcomes" },
      ].filter((w) => w.text !== frac(ways, 36))
    );
  },
  "abstract|evaluate": (rng) => {
    const right = pick(rng, ["0.35", "3/8", "0", "1", "7/9"]);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "range", rng), prompt: "Which of these could be a probability?", representation: null },
      { r: ["0.35", "3/8", "0", "1", "7/9"].indexOf(right) },
      right,
      [
        { text: pick(rng, ["9/7", "1.4", "5/3"]), mistake: "pr-more-than-1" },
        { text: pick(rng, ["−0.2", "−1/4"]), mistake: "pr-more-than-1" },
        { text: pick(rng, ["120%", "2", "3/2"]), mistake: "pr-more-than-1" },
      ]
    );
  },
};
