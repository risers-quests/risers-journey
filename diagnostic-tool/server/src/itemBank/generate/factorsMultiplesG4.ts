import { Rng, Template, build, buildActivity, gcd, int, pick } from "./core.js";
import { GroupActivity } from "../../types.js";

/**
 * Factors and Multiples, Grade 4 (book chapter 5): find factors and
 * multiples, common factors and common multiples, tell prime from
 * composite. Grade 4 only; Grade 5 keeps its own questions.
 *   concrete  hands-on: drag apples into baskets (no numbered counters):
 *             share equally, share with some left over, pack a set number
 *             per basket, find another equal sharing, test a claim
 *   pictorial arrays, a frog hopping on a number line, two frogs' common
 *             landings, packing two kinds of fruit, the one rectangle a
 *             prime number of squares makes
 *   abstract  a factor, a multiple, a prime, a common factor, the lowest
 *             common multiple
 */

const TOPIC = "factors-multiples";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "fm-unequal-groups": {
    label: "Groups not equal",
    detail: "Shares the apples out, but the baskets don't all hold the same number.",
    childTip: "Equal groups means every group has exactly the same number. Check each one.",
  },
  "fm-stops-early": {
    label: "Stops sharing too soon",
    detail: "Leaves enough in the pile to give every basket one more.",
    childTip: "Keep going until there aren't enough left to give each group one more.",
  },
  "fm-not-a-factor": {
    label: "Chooses a number that doesn't divide exactly",
    detail: "Picks a number of groups that leaves some over, so it isn't a factor.",
    childTip: "A factor shares the number out exactly, with none left over.",
  },
  "fm-trivial-grouping": {
    label: "Only finds the obvious grouping",
    detail: "Uses one group of everything, or one in each group, when another way was asked for.",
    childTip: "Every number can be 1 group or groups of 1. Look for the ones in between.",
  },
  "fm-factor-multiple-mixup": {
    label: "Mixes up factors and multiples",
    detail: "Gives a multiple when asked for a factor, or the other way round.",
    childTip: "Factors go into a number (they're smaller or equal). Multiples are in its times table (bigger or equal).",
  },
  "fm-adds": {
    label: "Adds instead of multiplying",
    detail: "Uses rows + columns (or number + number) where multiplication was needed.",
    childTip: "Equal rows mean multiply: rows × how many in each row.",
  },
  "fm-misreads-array": {
    label: "Miscounts the rows or columns",
    detail: "Reads an array as one row or column more or fewer than it has.",
    childTip: "Count the rows down the side and the columns along the top, slowly.",
  },
  "fm-skip-count-slip": {
    label: "Slips when counting in steps",
    detail: "Counts one jump too few or too many when skip counting.",
    childTip: "Count the jumps on your fingers as you say each number.",
  },
  "fm-odd-is-prime": {
    label: "Thinks odd means prime",
    detail: "Calls odd numbers like 15 or 21 prime, or says odd numbers can't be shared equally.",
    childTip: "15 is odd but 3 × 5 = 15, so it isn't prime. Check for any factor, not just 2.",
  },
  "fm-one-is-prime": {
    label: "Thinks 1 is prime",
    detail: "Chooses 1 as a prime number (a prime has exactly two factors; 1 has only one).",
    childTip: "A prime number has exactly two factors: 1 and itself. 1 has only one factor.",
  },
  "fm-common-one-only": {
    label: "Factor of only one number",
    detail: "Picks a factor of one of the numbers that doesn't go into the other.",
    childTip: "A common factor must go into both numbers. Check each one.",
  },
  "fm-not-highest": {
    label: "A common factor, but not the highest",
    detail: "Finds a number that goes into both, but a bigger one does too.",
    childTip: "List the factors of both numbers, then pick the biggest one they share.",
  },
  "fm-not-lowest": {
    label: "Multiplies to find the lowest common multiple",
    detail: "Uses a × b, which is a common multiple but not always the lowest.",
    childTip: "Count up in the bigger number until you reach one the smaller number goes into.",
  },
};

const NAMES = ["Priya", "Arjun", "Meera", "Kabir", "Ananya", "Rohan", "Zara", "Ishaan", "Diya", "Vihaan", "Sara", "Aditya"] as const;
const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const ODD_COMPOSITES = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49];
const factorsOf = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, n: number, rng: Rng) {
  return { id: `fm4-${cell}-${n}-${Math.floor(rng() * 1e6).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const apples = (extra: Partial<GroupActivity> & Pick<GroupActivity, "mode" | "items">): GroupActivity => ({
  kind: "group",
  icon: "🍎",
  itemMany: "apples",
  basketOne: "basket",
  ...extra,
});

export const FACTORS_MULTIPLES_G4_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: apples into baskets ----------------
  "concrete|remember": (rng) => {
    const k = int(rng, 2, 5);
    const m = int(rng, 2, 6);
    const n = k * m;
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "factors", n, rng), prompt: `Share the ${n} apples equally between ${k} baskets.`, representation: null },
      { n, k },
      apples({ mode: "equal", items: n, baskets: k })
    );
  },

  "concrete|understand": (rng) => {
    // Shares out with some left over: k is not a factor of n.
    const k = int(rng, 3, 5);
    const m = int(rng, 2, 5);
    const r = int(rng, 1, k - 1);
    const n = k * m + r;
    return buildActivity(
      {
        ...base("c-understand", "concrete", "understand", "factors", n, rng),
        prompt: `Share the ${n} apples equally between ${k} baskets. If some can't be shared, leave them in the pile.`,
        representation: null,
      },
      { n, k },
      apples({ mode: "equal", items: n, baskets: k })
    );
  },

  "concrete|apply": (rng) => {
    // Pack a set number per basket: n is a multiple of size.
    const size = int(rng, 3, 6);
    const m = int(rng, 2, 5);
    const n = size * m;
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "multiples", n, rng), prompt: `Pack all ${n} apples, with ${size} apples in each basket.`, representation: null },
      { n, size },
      apples({ mode: "size", items: n, size, maxBaskets: m + 2 })
    );
  },

  "concrete|analyze": (rng) => {
    // Another way to share with none left: a factor other than 1, 2 and n.
    const n = pick(rng, [12, 16, 18, 20, 24]);
    return buildActivity(
      {
        ...base("c-analyze", "concrete", "analyze", "factors", n, rng),
        prompt: `Share all ${n} apples equally into baskets, with none left over. Use more than 2 baskets, and put more than 1 apple in each.`,
        representation: null,
      },
      { n },
      apples({ mode: "find", items: n, maxBaskets: 12, avoid: [2] })
    );
  },

  "concrete|evaluate": (rng) => {
    // A claim about sharing equally; try it with the apples, then decide.
    const prime = rng() < 0.55;
    const n = prime ? pick(rng, [7, 11, 13, 17, 19]) : pick(rng, [9, 15, 21]);
    const name = pick(rng, NAMES);
    const f = factorsOf(n).filter((d) => d !== 1 && d !== n);
    const half = Math.floor(n / 2);
    const item = prime
      ? build(
          {
            ...base("c-evaluate", "concrete", "evaluate", "prime-composite", n, rng),
            prompt: `${name} says ${n} apples can be shared equally into baskets: more than 1 basket, more than 1 apple in each, none left over. Try it. Is ${name} right?`,
            representation: null,
          },
          { n, p: 1 },
          `No — only 1 basket of ${n}, or ${n} baskets of 1`,
          [
            { text: `Yes — 2 baskets of ${half}, with 1 left over`, mistake: "fm-stops-early" },
            { text: `Yes — any number of apples can be shared like that`, mistake: "fm-not-a-factor" },
            { text: `No — odd numbers can never be shared equally`, mistake: "fm-odd-is-prime" },
          ]
        )
      : build(
          {
            ...base("c-evaluate", "concrete", "evaluate", "prime-composite", n, rng),
            prompt: `${name} says ${n} apples can't be shared equally into baskets, because ${n} is odd. Try it. Is ${name} right?`,
            representation: null,
          },
          { n, p: 0 },
          `No — ${f[0]} baskets of ${n / f[0]} works`,
          [
            { text: `Yes — odd numbers can never be shared equally`, mistake: "fm-odd-is-prime" },
            { text: `Yes — only 1 basket of ${n} works`, mistake: "fm-trivial-grouping" },
            { text: `No — 2 baskets of ${half} works`, mistake: "fm-stops-early" },
          ]
        );
    return { ...item, activity: apples({ mode: "find", items: n, maxBaskets: 12 }) };
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const r = int(rng, 2, 6);
    const c = int(rng, 3, 8);
    if (r === c) return FACTORS_MULTIPLES_G4_TEMPLATES["pictorial|remember"](rng);
    return build(
      {
        ...base("p-remember", "pictorial", "remember", "factors", r * c, rng),
        prompt: "The squares are in equal rows. Which multiplication does the picture show?",
        representation: { kind: "grid", rows: r, cols: c, shadedCells: r * c, compact: true },
      },
      { r, c },
      `${r} × ${c} = ${r * c}`,
      [
        { text: `${r} + ${c} = ${r + c}`, mistake: "fm-adds" },
        { text: `${r} × ${c + 1} = ${r * (c + 1)}`, mistake: "fm-misreads-array" },
        { text: `${r + 1} × ${c} = ${(r + 1) * c}`, mistake: "fm-misreads-array" },
        { text: `${r - 1} × ${c} = ${(r - 1) * c}`, mistake: "fm-misreads-array" },
      ]
    );
  },

  "pictorial|understand": (rng) => {
    // A frog hops k at a time from 0: where after j hops? (multiples)
    const k = int(rng, 3, 9);
    const j = int(rng, 4, 7);
    const marks = Array.from({ length: 3 }, (_, i) => ({ value: (i + 1) * k, label: "🐸" }));
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "multiples", k * j, rng),
        prompt: `A frog starts at 0 and hops ${k} each time. The picture shows its first 3 landings. Where does it land after ${j} hops?`,
        representation: { kind: "number-line", min: 0, max: k * 9, step: k, labelEvery: 9, markers: marks },
      },
      { k, j },
      String(k * j),
      [
        { text: String(k * (j - 1)), mistake: "fm-skip-count-slip" },
        { text: String(k * (j + 1)), mistake: "fm-skip-count-slip" },
        { text: String(k + j), mistake: "fm-adds" },
      ]
    );
  },

  "pictorial|apply": (rng) => {
    // Two frogs: where do they first land on the same number? (lowest common multiple)
    const [a, b] = pick(rng, [[2, 3], [2, 5], [3, 4], [4, 6], [4, 10], [6, 8], [6, 9]] as const);
    const l = lcm(a, b);
    const max = l + b;
    const step = gcd(a, b);
    const ticks = max / step + 1;
    const markers: { value: number; label: string }[] = [];
    for (let v = a; v <= max; v += a) markers.push({ value: v, label: v % b === 0 ? "🔴🔵" : "🔴" });
    for (let v = b; v <= max; v += b) if (v % a !== 0) markers.push({ value: v, label: "🔵" });
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "common-multiples", l, rng),
        prompt: `The red frog hops ${a} at a time and the blue frog hops ${b} at a time, both from 0. Where do they first land on the same number?`,
        representation: { kind: "number-line", min: 0, max, step, labelEvery: ticks > 13 ? 2 : 1, markers },
      },
      { a, b },
      String(l),
      [
        { text: String(a * b === l ? 2 * l : a * b), mistake: "fm-not-lowest" },
        { text: String(a + b), mistake: "fm-adds" },
        { text: String(b), mistake: "fm-factor-multiple-mixup" },
        { text: String(2 * l), mistake: null },
      ]
    );
  },

  "pictorial|analyze": (rng) => {
    // Pack apples and oranges into equal bags: highest common factor.
    const [x, y] = pick(rng, [[12, 18], [8, 12], [10, 15], [12, 16], [16, 24], [18, 24], [12, 20]] as const);
    const h = gcd(x, y);
    const common = factorsOf(h).filter((d) => d !== 1 && d !== h);
    const onlyOne = [...factorsOf(x), ...factorsOf(y)].filter((d) => d > h && (x % d !== 0) !== (y % d !== 0));
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "common-factors", h, rng),
        prompt: "These apples and oranges are packed into bags. Every bag holds the same number of fruit, apples and oranges in separate bags, with none left over. What is the most fruit one bag can hold?",
        representation: {
          kind: "concrete",
          icon: "🍎",
          itemCount: 0,
          groups: 1,
          groupLabel: "fruit",
          segments: [
            { icon: "🍎", count: x, label: "Apples" },
            { icon: "🍊", count: y, label: "Oranges" },
          ],
        },
      },
      { x, y },
      String(h),
      [
        ...(onlyOne.length ? [{ text: String(onlyOne[0]), mistake: "fm-common-one-only" }] : []),
        ...(common.length ? [{ text: String(common[common.length - 1]), mistake: "fm-not-highest" }] : []),
        { text: String(lcm(x, y)), mistake: "fm-factor-multiple-mixup" },
        { text: String(Math.min(x, y)), mistake: "fm-common-one-only" },
        { text: "1", mistake: "fm-not-highest" },
      ]
    );
  },

  "pictorial|evaluate": (rng) => {
    // The one rectangle a number of squares makes: prime or not?
    const prime = rng() < 0.5;
    const n = prime ? pick(rng, [7, 11, 13, 17]) : pick(rng, [12, 15, 16, 18]);
    const name = pick(rng, NAMES);
    const f = factorsOf(n).filter((d) => d !== 1 && d !== n);
    const mid = f[Math.floor((f.length - 1) / 2)];
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "prime-composite", n, rng),
        prompt: `${name} made this one row from ${n} squares and says ${n} is a prime number, because it only makes one rectangle. Is ${name} right?`,
        representation: { kind: "grid", rows: 1, cols: n, shadedCells: n, compact: true },
      },
      { n, p: prime ? 1 : 0 },
      prime ? `Yes — ${n} squares only make 1 row of ${n}` : `No — ${n} squares can also make ${mid} rows of ${n / mid}`,
      prime
        ? [
            { text: `No — ${n} is odd, so it can't be prime`, mistake: "fm-odd-is-prime" },
            { text: `No — every number makes more than one rectangle`, mistake: "fm-not-a-factor" },
            { text: `No — ${n} squares can also make 2 rows of ${Math.floor(n / 2)}`, mistake: "fm-stops-early" },
          ]
        : [
            { text: `Yes — ${n} squares only make 1 row of ${n}`, mistake: "fm-trivial-grouping" },
            { text: `Yes — ${n} is ${n % 2 ? "odd" : "even"}, so it is prime`, mistake: "fm-odd-is-prime" },
            { text: `No — but only because ${n} is bigger than 10`, mistake: null },
          ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const n = pick(rng, [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48]);
    const fs = factorsOf(n).filter((d) => d > 2 && d < n);
    const right = pick(rng, fs);
    const non = Array.from({ length: n - 3 }, (_, i) => i + 3).filter((d) => n % d !== 0);
    const near = non.filter((d) => Math.abs(d - right) <= 3);
    return build(
      { ...base("a-remember", "abstract", "remember", "factors", n, rng), prompt: `Which of these is a factor of ${n}?`, representation: null },
      { n, f: right },
      String(right),
      [
        { text: String(2 * n), mistake: "fm-factor-multiple-mixup" },
        ...near.slice(0, 2).map((d) => ({ text: String(d), mistake: "fm-not-a-factor" })),
        ...non.slice(-2).map((d) => ({ text: String(d), mistake: "fm-not-a-factor" })),
      ]
    );
  },

  "abstract|understand": (rng) => {
    const k = int(rng, 3, 9);
    const m = int(rng, 3, 9);
    const right = k * m;
    const kFactor = factorsOf(k).filter((d) => d !== 1 && d !== k)[0] ?? 1;
    return build(
      { ...base("a-understand", "abstract", "understand", "multiples", right, rng), prompt: `Which of these is a multiple of ${k}?`, representation: null },
      { k, m },
      String(right),
      [
        { text: String(kFactor), mistake: "fm-factor-multiple-mixup" },
        ...((k + m) % k ? [{ text: String(k + m), mistake: "fm-adds" }] : []),
        { text: String(right + 1), mistake: "fm-skip-count-slip" },
        { text: String(right - 2), mistake: "fm-skip-count-slip" },
      ]
    );
  },

  "abstract|apply": (rng) => {
    const p = pick(rng, PRIMES);
    const odd = pick(rng, ODD_COMPOSITES);
    const even = pick(rng, [14, 22, 26, 34, 38, 46]);
    return build(
      { ...base("a-apply", "abstract", "apply", "prime-composite", p, rng), prompt: "Which of these is a prime number?", representation: null },
      { p, o: odd },
      String(p),
      [
        { text: String(odd), mistake: "fm-odd-is-prime" },
        { text: "1", mistake: "fm-one-is-prime" },
        { text: String(even), mistake: null },
      ]
    );
  },

  "abstract|analyze": (rng) => {
    const [x, y] = pick(rng, [[12, 18], [16, 24], [18, 24], [20, 30], [12, 30], [24, 36], [15, 25], [14, 21]] as const);
    const common = factorsOf(gcd(x, y)).filter((d) => d > 1);
    const right = pick(rng, common);
    const onlyX = factorsOf(x).filter((d) => d > 1 && y % d !== 0);
    const onlyY = factorsOf(y).filter((d) => d > 1 && x % d !== 0);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "common-factors", right, rng), prompt: `Which number is a common factor of ${x} and ${y}?`, representation: null },
      { x, y, f: right },
      String(right),
      [
        ...(onlyX.length ? [{ text: String(pick(rng, onlyX)), mistake: "fm-common-one-only" }] : []),
        ...(onlyY.length ? [{ text: String(pick(rng, onlyY)), mistake: "fm-common-one-only" }] : []),
        { text: String(lcm(x, y)), mistake: "fm-factor-multiple-mixup" },
        { text: String(x + y), mistake: "fm-adds" },
      ]
    );
  },

  "abstract|evaluate": (rng) => {
    // Is a × b the lowest common multiple?
    const coprime = rng() < 0.3;
    const [a, b] = coprime ? pick(rng, [[3, 4], [2, 5], [4, 5], [3, 5]] as const) : pick(rng, [[4, 6], [6, 8], [6, 9], [4, 10], [8, 12], [6, 10]] as const);
    const l = lcm(a, b);
    const name = pick(rng, NAMES);
    return build(
      {
        ...base("a-evaluate", "abstract", "evaluate", "common-multiples", a * b, rng),
        prompt: `${name} says the lowest common multiple of ${a} and ${b} is ${a * b}, because ${a} × ${b} = ${a * b}. Is ${name} right?`,
        representation: null,
      },
      { a, b },
      coprime ? `Yes — ${a * b} is the first number both go into` : `No — ${l} is a multiple of both, and it is smaller`,
      coprime
        ? [
            { text: `No — ${b * 2} is a multiple of both, and it is smaller`, mistake: "fm-factor-multiple-mixup" },
            { text: `No — the lowest common multiple is 1`, mistake: "fm-factor-multiple-mixup" },
            { text: `No — ${a} and ${b} have no common multiples`, mistake: null },
          ]
        : [
            { text: `Yes — multiplying always gives the lowest one`, mistake: "fm-not-lowest" },
            { text: `No — the lowest common multiple is ${gcd(a, b)}`, mistake: "fm-factor-multiple-mixup" },
            { text: `No — ${a} and ${b} have no common multiples`, mistake: null },
          ]
    );
  },
};

/** Independent answer check for the stress test. */
export function verify(item: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const right = item.choices.find((c) => c.id === item.correctChoiceId)?.text ?? "";
  const p = item.params;
  const isPrime = (n: number) => n > 1 && factorsOf(n).length === 2;
  switch (`${item.cpa}|${item.bloom}`) {
    case "concrete|evaluate":
      return right.startsWith("No") ? null : `claim about ${p.n} should be wrong: ${right}`;
    case "pictorial|remember":
      return right === `${p.r} × ${p.c} = ${p.r * p.c}` ? null : `array wrong: ${right}`;
    case "pictorial|understand":
      return Number(right) === p.k * p.j ? null : `hops wrong: ${right}`;
    case "pictorial|apply":
      return Number(right) === lcm(p.a, p.b) ? null : `LCM wrong: ${right}`;
    case "pictorial|analyze":
      return Number(right) === gcd(p.x, p.y) ? null : `HCF wrong: ${right}`;
    case "pictorial|evaluate":
      return right.startsWith(isPrime(p.n) ? "Yes" : "No") ? null : `${p.n} prime=${isPrime(p.n)}: ${right}`;
    case "abstract|remember":
      return p.n % Number(right) === 0 && item.choices.filter((c) => c.id !== item.correctChoiceId).every((c) => p.n % Number(c.text) !== 0) ? null : `factor question wrong for ${p.n}`;
    case "abstract|understand":
      return Number(right) % p.k === 0 && item.choices.filter((c) => c.id !== item.correctChoiceId).every((c) => Number(c.text) % p.k !== 0) ? null : `multiple question wrong for ${p.k}`;
    case "abstract|apply":
      return isPrime(Number(right)) && item.choices.filter((c) => c.id !== item.correctChoiceId).every((c) => !isPrime(Number(c.text))) ? null : `prime question wrong`;
    case "abstract|analyze":
      return p.x % Number(right) === 0 && p.y % Number(right) === 0 &&
        item.choices.filter((c) => c.id !== item.correctChoiceId).every((c) => p.x % Number(c.text) !== 0 || p.y % Number(c.text) !== 0)
        ? null
        : `common factor question wrong for ${p.x}, ${p.y}`;
    case "abstract|evaluate":
      return right.startsWith(lcm(p.a, p.b) === p.a * p.b ? "Yes" : "No") ? null : `LCM claim wrong: ${right}`;
  }
  return null;
}
