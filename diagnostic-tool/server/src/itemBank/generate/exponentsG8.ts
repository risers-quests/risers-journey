import { Rng, Template, build, buildActivity, fmt, int, pick, sup } from "./core.js";
import { PlaceValueActivity } from "../../types.js";

/**
 * Exponents (Powers), Grade 8 (book chapter 2): powers with integral
 * exponents, the laws of exponents, zero and negative exponents, powers of
 * negative numbers, powers of 10.
 *   concrete  hands-on place-value chart: build 10ⁿ, 10ᵐ × 10ⁿ, a number in
 *             powers of 10, 10ᵐ ÷ 10ⁿ, (10ᵐ)ⁿ
 *   pictorial square grids (a²; 2ᵐ × 2ⁿ squares), place-value charts
 *             (powers of 10, negative powers as tenths, hundredths …)
 *   abstract  negative exponents, aᵐ × aⁿ, powers of negative numbers,
 *             aᵐ ÷ aⁿ, (aᵐ)ⁿ
 */

const TOPIC = "g8-exponents";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "exp-times-not-power": {
    label: "Multiplies the base by the power",
    detail: "Works out 10⁴ as 40 or 3² as 6.",
    childTip: "The small number says how many times to multiply the base by itself: 3² = 3 × 3.",
  },
  "exp-extra-zero": {
    label: "One zero too many or too few",
    detail: "Writes 10⁴ as 1,00,000 (or 1,000), off by one place.",
    childTip: "10ⁿ is 1 followed by n zeros. Count the zeros, not the digits.",
  },
  "exp-swaps": {
    label: "Swaps the base and the power",
    detail: "Reads 5² as 2⁵.",
    childTip: "The big number is what's multiplied; the small raised number counts how many times.",
  },
  "exp-multiply-powers": {
    label: "Multiplies the powers when multiplying",
    detail: "Writes aᵐ × aⁿ as aᵐˣⁿ instead of aᵐ⁺ⁿ.",
    childTip: "Multiplying powers of the same base: add the powers. 2³ × 2² = 2⁵.",
  },
  "exp-multiplies-bases": {
    label: "Multiplies the bases too",
    detail: "Writes 3² × 3⁴ as 9⁶. The base stays the same.",
    childTip: "Same base in, same base out: only the power changes.",
  },
  "exp-divide-adds": {
    label: "Adds the powers when dividing",
    detail: "Writes aᵐ ÷ aⁿ as aᵐ⁺ⁿ.",
    childTip: "Dividing powers of the same base: subtract the powers.",
  },
  "exp-divide-order": {
    label: "Subtracts the powers the wrong way round",
    detail: "Writes 2³ ÷ 2⁵ as 2² instead of 2⁻² (= 1/2²).",
    childTip: "Always first power minus second power. A bigger bottom power gives a fraction.",
  },
  "exp-power-add": {
    label: "Adds the powers for a power of a power",
    detail: "Writes (aᵐ)ⁿ as aᵐ⁺ⁿ instead of aᵐˣⁿ.",
    childTip: "(a²)³ = a² × a² × a² = a⁶: multiply the powers.",
  },
  "exp-negative-means-negative": {
    label: "Thinks a negative power makes the number negative",
    detail: "Writes 2⁻³ as −8. A negative power means 1 over the power.",
    childTip: "a⁻ⁿ = 1/aⁿ. It's a small positive fraction, not a negative number.",
  },
  "exp-ignores-negative": {
    label: "Ignores the minus in the power",
    detail: "Treats 10⁻² as if it were 10².",
    childTip: "The minus in the power means 'one over': 10⁻² = 1/100.",
  },
  "exp-neg-base-sign": {
    label: "Gets the sign of a negative base wrong",
    detail: "Says (−3)² = −9, or (−2)³ = 8.",
    childTip: "Even power of a negative: positive. Odd power: negative.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `exp8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const COLS = [1000000, 100000, 10000, 1000, 100, 10, 1];
const chart = (target: number, wrong: { value: number; mistake: string }[]): PlaceValueActivity => ({
  kind: "place-value",
  mode: "build",
  columns: COLS,
  start: COLS.map(() => 0),
  target,
  wrong: wrong.filter((w, i) => w.value !== target && w.value > 0 && w.value < 10000000 && wrong.findIndex((x) => x.value === w.value) === i),
});
const p10 = (n: number) => 10 ** n;
const pvChart = (digits: Record<number, number>) => ({
  kind: "place-value-chart" as const,
  columns: [6, 5, 4, 3, 2, 1, 0].map((k) => ({ label: ["O", "T", "H", "Th", "TTh", "L", "TL"][k], count: digits[k] ?? 0 })),
});

export const EXPONENTS_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: build powers of 10 on the chart ----------------
  "concrete|remember": (rng) => {
    const n = int(rng, 2, 5);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "powers of 10", rng), prompt: `Build 10${sup(n)} on the chart.`, representation: null },
      { n },
      chart(p10(n), [{ value: 10 * n, mistake: "exp-times-not-power" }, { value: p10(n + 1), mistake: "exp-extra-zero" }, { value: p10(n - 1), mistake: "exp-extra-zero" }])
    );
  },
  "concrete|understand": (rng) => {
    const [m, n] = pick(rng, [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [4, 1]] as const);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "multiply powers", rng), prompt: `Build 10${sup(m)} × 10${sup(n)} on the chart.`, representation: null },
      { m, n },
      chart(p10(m + n), [{ value: p10(m * n), mistake: "exp-multiply-powers" }])
    );
  },
  "concrete|apply": (rng) => {
    const m = int(rng, 3, 5);
    const n = int(rng, 1, m - 1);
    const a = int(rng, 2, 9);
    const b = int(rng, 1, 9);
    const t = a * p10(m) + b * p10(n);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "expanded form", rng), prompt: `Build ${a} × 10${sup(m)} + ${b} × 10${sup(n)} on the chart.`, representation: null },
      { a, b, m, n },
      chart(t, [
        { value: a * p10(m + 1) + b * p10(n + 1), mistake: "exp-extra-zero" },
        { value: a * p10(m - 1) + b * p10(n - 1), mistake: "exp-extra-zero" },
        { value: a * 10 * m + b * 10 * n, mistake: "exp-times-not-power" },
      ])
    );
  },
  "concrete|analyze": (rng) => {
    const m = int(rng, 3, 5);
    const n = int(rng, 1, Math.min(m - 1, 6 - m));
    return buildActivity(
      { ...base("c-analyze", "concrete", "analyze", "divide powers", rng), prompt: `Build 10${sup(m)} ÷ 10${sup(n)} on the chart.`, representation: null },
      { m, n },
      chart(p10(m - n), [{ value: p10(m + n), mistake: "exp-divide-adds" }])
    );
  },
  "concrete|evaluate": (rng) => {
    const [m, n] = pick(rng, [[2, 3], [3, 2], [1, 3], [3, 1], [1, 4], [4, 1]] as const);
    return buildActivity(
      { ...base("c-evaluate", "concrete", "evaluate", "power of a power", rng), prompt: `Build (10${sup(m)})${sup(n)} on the chart.`, representation: null },
      { m, n },
      chart(p10(m * n), [{ value: p10(m + n), mistake: "exp-power-add" }])
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const a = int(rng, 3, 8);
    return build(
      { ...base("p-remember", "pictorial", "remember", "squares as powers", rng), prompt: "How many small squares are there, written as a power?", representation: { kind: "grid", rows: a, cols: a, compact: true } },
      { a },
      `${a}${sup(2)}`,
      [
        { text: `${a} × 2`, mistake: "exp-times-not-power" },
        { text: `2${sup(a)}`, mistake: "exp-swaps" },
        { text: `${a}${sup(3)}`, mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const n = int(rng, 2, 5);
    return build(
      { ...base("p-understand", "pictorial", "understand", "powers of 10", rng), prompt: "Which power of 10 does this chart show?", representation: pvChart({ [n]: 1 }) },
      { n },
      `10${sup(n)}`,
      [
        { text: `10 × ${n}`, mistake: "exp-times-not-power" },
        { text: `10${sup(n + 1)}`, mistake: "exp-extra-zero" },
        { text: `${n}${sup(10)}`, mistake: "exp-swaps" },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const [m, n] = pick(rng, [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]] as const);
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "multiply powers", rng),
        prompt: `This grid has 2${sup(m)} rows and 2${sup(n)} columns. How many squares is that, as a power of 2?`,
        representation: { kind: "grid", rows: 2 ** m, cols: 2 ** n, compact: true },
      },
      { m, n },
      `2${sup(m + n)}`,
      [
        { text: `2${sup(m * n)}`, mistake: "exp-multiply-powers" },
        { text: `4${sup(m + n)}`, mistake: "exp-multiplies-bases" },
        { text: `2${sup(m + n + 1)}`, mistake: null },
        { text: `2 × ${m + n}`, mistake: "exp-times-not-power" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const n = int(rng, 1, 4);
    const labels = ["O", "t", "h", "th", "tth"];
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "negative powers", rng),
        prompt: "Which power of 10 does this chart show?",
        representation: { kind: "place-value-chart", columns: labels.map((l, i) => ({ label: l, count: i === n ? 1 : 0 })) },
      },
      { n },
      `10${sup(-n)}`,
      [
        { text: `−10${sup(n)}`, mistake: "exp-negative-means-negative" },
        { text: `10${sup(n)}`, mistake: "exp-ignores-negative" },
        { text: `10${sup(-(n + 1))}`, mistake: "exp-extra-zero" },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const m = int(rng, 3, 5);
    const n = int(rng, 1, m - 2);
    const a = int(rng, 2, 9);
    const b = int(rng, 1, 9);
    const name = pick(rng, ["Arun", "Meera", "Kabir", "Diya", "Rohan", "Sara"]);
    const right = `${a} × 10${sup(m)} + ${b} × 10${sup(n)}`;
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "expanded form", rng),
        prompt: `${name} writes this number as ${a} × 10${sup(m + 1)} + ${b} × 10${sup(n + 1)}. Is that right?`,
        representation: pvChart({ [m]: a, [n]: b }),
      },
      { a, b, m, n },
      `No: it is ${right}`,
      [
        { text: "Yes, that's right", mistake: "exp-extra-zero" },
        { text: `No: it is ${a}${sup(m)} + ${b}${sup(n)}`, mistake: null },
        { text: `No: it is ${a} × 10${sup(m)} + ${b} × 10${sup(n + 1)}`, mistake: "exp-extra-zero" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const a = int(rng, 2, 9);
    const n = int(rng, 2, 4);
    return build(
      { ...base("a-remember", "abstract", "remember", "negative powers", rng), prompt: `${a}${sup(-n)} = ?`, representation: null },
      { a, n },
      `1/${a}${sup(n)}`,
      [
        { text: `−${a}${sup(n)}`, mistake: "exp-negative-means-negative" },
        { text: `−${a * n}`, mistake: "exp-times-not-power" },
        { text: `${a}${sup(n)}`, mistake: "exp-ignores-negative" },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 2, 9);
    let m = int(rng, 2, 7);
    let n = int(rng, 3, 8);
    if (m === n || m * n === m + n) n = m + 1;
    return build(
      { ...base("a-understand", "abstract", "understand", "multiply powers", rng), prompt: `${a}${sup(m)} × ${a}${sup(n)} = ?`, representation: null },
      { a, m, n },
      `${a}${sup(m + n)}`,
      [
        { text: `${a}${sup(m * n)}`, mistake: "exp-multiply-powers" },
        { text: `${a * a}${sup(m + n)}`, mistake: "exp-multiplies-bases" },
        { text: `${a}${sup(Math.abs(m - n))}`, mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 2, 5);
    const n = int(rng, 2, a > 3 ? 4 : 5);
    const v = (-a) ** n;
    return build(
      { ...base("a-apply", "abstract", "apply", "negative base", rng), prompt: `(−${a})${sup(n)} = ?`, representation: null },
      { a, n },
      fmt(v).replace("-", "−"),
      [
        { text: fmt(-v).replace("-", "−"), mistake: "exp-neg-base-sign" },
        { text: fmt((n % 2 ? -1 : 1) * a * n).replace("-", "−"), mistake: "exp-times-not-power" },
        { text: fmt((-a) ** (n - 1)).replace("-", "−"), mistake: null },
        { text: fmt(-((-a) ** (n - 1))).replace("-", "−"), mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 2, 9);
    const m = int(rng, 2, 5);
    const n = m + int(rng, 1, 4);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "divide powers", rng), prompt: `${a}${sup(m)} ÷ ${a}${sup(n)} = ?`, representation: null },
      { a, m, n },
      `1/${a}${sup(n - m)}`,
      [
        { text: `${a}${sup(n - m)}`, mistake: "exp-divide-order" },
        { text: `${a}${sup(m + n)}`, mistake: "exp-divide-adds" },
        { text: `−${a}${sup(n - m)}`, mistake: "exp-negative-means-negative" },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 2, 9);
    const [m, n] = pick(rng, [[2, 3], [3, 2], [2, 4], [4, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5]] as const);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "power of a power", rng), prompt: `Which is equal to (${a}${sup(m)})${sup(n)}?`, representation: null },
      { a, m, n },
      `${a}${sup(m * n)}`,
      [
        { text: `${a}${sup(m + n)}`, mistake: "exp-power-add" },
        { text: `${a * n}${sup(m)}`, mistake: null },
        { text: `${a}${sup(m)} × ${n}`, mistake: "exp-times-not-power" },
      ]
    );
  },
};
