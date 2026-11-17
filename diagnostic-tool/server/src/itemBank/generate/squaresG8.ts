import { Rng, Template, build, buildActivity, fmt, int, pick } from "./core.js";
import { GroupActivity } from "../../types.js";

/**
 * Squares and Square Roots, Grade 8 (book chapter 3): square numbers,
 * patterns, square roots by prime factors, square roots of decimals,
 * perfect squares and the smallest multiplier.
 *   concrete  hands-on: lay tiles in equal rows to make a square; test a
 *             number that won't make one; the biggest square from a pile
 *   pictorial square grids, squares with their area given, the tiles
 *             needed for the next square
 *   abstract  √(n²), spotting a perfect square, prime factors, the smallest
 *             multiplier, √(a² + b²) is not a + b
 */

const TOPIC = "g8-squares";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "sq-doubles": {
    label: "Doubles instead of squaring",
    detail: "Works out 7² as 14.",
    childTip: "Squaring means a number times itself: 7² = 7 × 7.",
  },
  "sq-root-halves": {
    label: "Halves to find a square root",
    detail: "Says √64 = 32.",
    childTip: "√64 asks: which number times itself is 64? Check by squaring your answer.",
  },
  "sq-not-perfect": {
    label: "Calls a number square when it isn't",
    detail: "Thinks a number like 48 can be laid out as a square.",
    childTip: "A square number is n × n. Find the squares either side to check.",
  },
  "sq-last-digit": {
    label: "Judges a square by its last digit",
    detail: "Thinks a number ending in 1, 4, 5, 6, 9 or 0 must be a square.",
    childTip: "Squares only end in 0, 1, 4, 5, 6, 9, but plenty of other numbers do too. Check it.",
  },
  "sq-decimal-places": {
    label: "Wrong number of decimal places in a root",
    detail: "Says √1.44 = 0.12. The root has half as many decimal places.",
    childTip: "Square your answer to check: 1.2 × 1.2 = 1.44.",
  },
  "sq-factor-pairs": {
    label: "Pairs the prime factors wrongly",
    detail: "Takes a prime once for every factor, or misses that one has no partner.",
    childTip: "Write the primes, ring them in pairs, take one from each pair.",
  },
  "sq-missing-corner": {
    label: "Forgets the corner tile",
    detail: "Says the next square needs 2n more tiles instead of 2n + 1.",
    childTip: "Add a row and a column, then the one corner tile where they meet.",
  },
  "sq-adds-roots": {
    label: "Splits a root over +",
    detail: "Thinks √(9 + 16) = √9 + √16.",
    childTip: "Add inside the root first: √(9 + 16) = √25 = 5.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `sq8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const tiles = (extra: Partial<GroupActivity> & Pick<GroupActivity, "mode" | "items">): GroupActivity => ({
  kind: "group",
  icon: "🟩",
  itemMany: "tiles",
  basketOne: "row",
  basketIcon: "",
  ...extra,
});
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [20, 21, 29]] as const;

export const SQUARES_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: tiles into equal rows ----------------
  "concrete|remember": (rng) => {
    const n = int(rng, 3, 5);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "square numbers", rng), prompt: `Share the ${n * n} tiles equally between the ${n} rows.`, representation: null },
      { n },
      tiles({ mode: "equal", items: n * n, baskets: n })
    );
  },
  "concrete|understand": (rng) => {
    const n = int(rng, 3, 5);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "square numbers", rng), prompt: `Lay the ${n * n} tiles in rows of ${n}. Use as many rows as you need.`, representation: null },
      { n },
      tiles({ mode: "size", items: n * n, size: n, maxBaskets: n + 2 })
    );
  },
  "concrete|apply": (rng) => {
    const n = int(rng, 3, 5);
    const N = n * n;
    return build(
      { ...base("c-apply", "concrete", "apply", "square roots", rng), prompt: `Share the ${N} tiles equally between the rows to make a square. What is √${N}?`, representation: null, activity: tiles({ mode: "equal", items: N, baskets: n }) },
      { n },
      String(n),
      [
        { text: fmt(N / 2), mistake: "sq-root-halves" },
        { text: String(n + 1), mistake: null },
        { text: String(n - 1), mistake: null },
        { text: String(2 * n), mistake: "sq-doubles" },
      ]
    );
  },
  "concrete|analyze": (rng) => {
    const n = int(rng, 3, 4);
    const r = int(rng, 1, 2 * n);
    const N = n * n + r;
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "perfect squares", rng),
        prompt: `Lay the ${N} tiles in rows of ${n}. Can all ${N} tiles make a square, with none left over?`,
        representation: null,
        activity: tiles({ mode: "size", items: N, size: n, maxBaskets: Math.ceil(N / n) + 1 }),
      },
      { n, r },
      `No: ${N} is not a square number`,
      [
        { text: `Yes: ${N} tiles make a square`, mistake: "sq-not-perfect" },
        { text: `Yes, with ${n} in each row`, mistake: "sq-not-perfect" },
        { text: "No: a square needs an even number of tiles", mistake: null },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const n = int(rng, 3, 4);
    const left = int(rng, 1, 2 * n);
    const N = n * n + left;
    return build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "perfect squares", rng),
        prompt: `Lay the ${N} tiles in rows of ${n}. What is the biggest square you can make, and how many tiles are left?`,
        representation: null,
        activity: tiles({ mode: "size", items: N, size: n, maxBaskets: Math.ceil(N / n) + 1 }),
      },
      { n, left },
      `${n} by ${n}, with ${left} left`,
      [
        { text: `${n + 1} by ${n + 1}, with none left`, mistake: "sq-not-perfect" },
        { text: `${n - 1} by ${n - 1}, with ${N - (n - 1) ** 2} left`, mistake: null },
        { text: `${n} by ${n}, with ${N - 2 * n} left`, mistake: "sq-doubles" },
        { text: `${n} by ${Math.floor(N / n)}, with ${N % n} left`, mistake: "sq-not-perfect" },
      ]
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const n = int(rng, 4, 9);
    return build(
      { ...base("p-remember", "pictorial", "remember", "square numbers", rng), prompt: "How many small squares are in this square?", representation: { kind: "grid", rows: n, cols: n, compact: true } },
      { n },
      String(n * n),
      [
        { text: String(2 * n), mistake: "sq-doubles" },
        { text: String(4 * n), mistake: null },
        { text: String((n + 1) * (n + 1)), mistake: null },
        { text: String(n * (n - 1)), mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const n = int(rng, 6, 15);
    const N = n * n;
    return build(
      { ...base("p-understand", "pictorial", "understand", "square roots", rng), prompt: `This square has an area of ${N} cm². How long is each side?`, representation: { kind: "shape", shape: "square", sideLabels: ["?"], note: `Area = ${N} cm²` } },
      { n },
      `${n} cm`,
      [
        { text: `${fmt(N / 2)} cm`, mistake: "sq-root-halves" },
        { text: `${fmt(N / 4)} cm`, mistake: null },
        { text: `${n + 1} cm`, mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const x = pick(rng, [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25]);
    const area = (x * x) / 100;
    return build(
      { ...base("p-apply", "pictorial", "apply", "decimal roots", rng), prompt: `This square has an area of ${area} m². How long is each side?`, representation: { kind: "shape", shape: "square", sideLabels: ["?"], note: `Area = ${area} m²` } },
      { x },
      `${x / 10} m`,
      [
        { text: `${+(x / 100).toFixed(2)} m`, mistake: "sq-decimal-places" },
        { text: `${x} m`, mistake: "sq-decimal-places" },
        { text: `${+(area / 2).toFixed(4)} m`, mistake: "sq-root-halves" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const n = int(rng, 4, 9);
    return build(
      { ...base("p-analyze", "pictorial", "analyze", "patterns", rng), prompt: `How many more small squares are needed to make the next bigger square (${n + 1} by ${n + 1})?`, representation: { kind: "grid", rows: n, cols: n, compact: true } },
      { n },
      String(2 * n + 1),
      [
        { text: String(2 * n), mistake: "sq-missing-corner" },
        { text: String(n + 1), mistake: null },
        { text: String((n + 1) * (n + 1)), mistake: null },
        { text: "1", mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const n = int(rng, 5, 12);
    const N = n * n + int(rng, 1, 2 * n);
    const name = pick(rng, ["Ravi", "Anaya", "Kabir", "Meera", "Arjun", "Zara"]);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "perfect squares", rng),
        prompt: `This square has an area of ${N} cm². ${name} says each side is a whole number of centimetres. Is ${name} right?`,
        representation: { kind: "shape", shape: "square", sideLabels: ["?"], note: `Area = ${N} cm²` },
      },
      { n, N },
      `No: ${n}² = ${n * n} and ${n + 1}² = ${(n + 1) * (n + 1)}, so the side is between ${n} and ${n + 1} cm`,
      [
        { text: `Yes: the side is ${n} cm`, mistake: "sq-not-perfect" },
        { text: `Yes: the side is ${fmt(N / 2)} cm`, mistake: "sq-root-halves" },
        { text: `Yes: the side is ${n + 1} cm`, mistake: "sq-not-perfect" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const n = int(rng, 11, 25);
    return build(
      { ...base("a-remember", "abstract", "remember", "square roots", rng), prompt: `√${n * n} = ?`, representation: null },
      { n },
      String(n),
      [
        { text: fmt((n * n) / 2), mistake: "sq-root-halves" },
        { text: String(n + 1), mistake: null },
        { text: String(n - 1), mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const k = int(rng, 11, 30);
    const sq = k * k;
    const lastDigitTrap = sq + 10; // ends like a square, isn't one
    const near = Math.floor(sq / 10) * 10 + pick(rng, [2, 3, 7, 8]);
    return build(
      { ...base("a-understand", "abstract", "understand", "perfect squares", rng), prompt: "Which of these is a perfect square?", representation: null },
      { k },
      fmt(sq),
      [
        { text: fmt(lastDigitTrap), mistake: "sq-last-digit" },
        { text: fmt(k * (k + 1)), mistake: "sq-not-perfect" },
        { text: fmt(near), mistake: null },
        { text: fmt(sq - 10), mistake: "sq-last-digit" },
      ]
    );
  },
  "abstract|apply": (rng) => {
    // x = 2^i × 3^j × 5^k with at least two prime factors; ask √(x²).
    let x = 1, i = 0, j = 0, k = 0;
    while (x < 12 || x > 90 || i + j + k < 2) {
      i = int(rng, 0, 3);
      j = int(rng, 0, 2);
      k = int(rng, 0, 1);
      x = 2 ** i * 3 ** j * 5 ** k;
    }
    const p = i ? 2 : j ? 3 : 5;
    return build(
      { ...base("a-apply", "abstract", "apply", "prime factors", rng), prompt: `Using prime factors, find √${fmt(x * x)}.`, representation: null },
      { i, j, k },
      String(x),
      [
        { text: String(x * p), mistake: "sq-factor-pairs" },
        { text: String(x / p), mistake: "sq-factor-pairs" },
        { text: fmt((x * x) / 2), mistake: "sq-root-halves" },
        { text: String(2 * x), mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const s = int(rng, 2, 6);
    const p = pick(rng, [2, 3, 5, 7]);
    const n = s * s * p;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "smallest multiplier", rng), prompt: `What is the smallest number ${n} must be multiplied by to make a perfect square?`, representation: null },
      { s, p },
      String(p),
      [
        { text: String(s), mistake: "sq-factor-pairs" },
        { text: String(p * p), mistake: "sq-factor-pairs" },
        { text: String(s * p), mistake: null },
        { text: p === 2 ? "3" : "2", mistake: "sq-factor-pairs" },
        { text: String(n), mistake: null },
        { text: String(p ** 3), mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const [a, b, c] = pick(rng, TRIPLES);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "roots and sums", rng), prompt: `Is √(${a * a} + ${b * b}) equal to √${a * a} + √${b * b}?`, representation: null },
      { a, b },
      `No: √(${a * a} + ${b * b}) = √${c * c} = ${c}, but √${a * a} + √${b * b} = ${a + b}`,
      [
        { text: `Yes: both are ${a + b}`, mistake: "sq-adds-roots" },
        { text: "Yes: a square root can be split over +", mistake: "sq-adds-roots" },
        { text: `No: √(${a * a} + ${b * b}) = ${fmt((a * a + b * b) / 2)}`, mistake: "sq-root-halves" },
      ]
    );
  },
};
