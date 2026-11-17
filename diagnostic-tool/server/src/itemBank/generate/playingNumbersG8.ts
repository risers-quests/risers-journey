import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { PlaceValueActivity } from "../../types.js";

/**
 * Playing with Numbers, Grade 8 (book chapter 5): 2- and 3-digit numbers
 * in general form (100a + 10b + c), numbers with their digits swapped,
 * divisibility by 3 and 9 from the general form, puzzles.
 *   concrete  hands-on place-value chart: build 100a + 10b + c, regroup
 *             10 × a + (more than 9 ones), add ab and ba, take ba from ab,
 *             build a number and test it for 9
 *   pictorial place-value charts: general form, ab + ba, tests for 3 and 9,
 *             remainders, a missing digit
 *   abstract  general form, which is divisible by 9, ab − ba, a reversal
 *             puzzle, a claim about 3 and 9
 */

const TOPIC = "g8-playing-numbers";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "play-place-value": {
    label: "Loses the place value of digits",
    detail: "Writes the number with digits a, b, c as a + b + c, or 10a + b + c, or puts the digits in the wrong places.",
    childTip: "The hundreds digit is worth 100 × it, the tens digit 10 × it: 100a + 10b + c.",
  },
  "play-swap": {
    label: "Doesn't swap the digits",
    detail: "Uses the same number twice instead of the number with its digits swapped.",
    childTip: "Swapping 47 gives 74: the tens digit becomes the ones digit.",
  },
  "play-sum-11": {
    label: "Thinks ab + ba is a multiple of 10",
    detail: "ab + ba = 11(a + b), not 10(a + b).",
    childTip: "(10a + b) + (10b + a) = 11a + 11b = 11(a + b).",
  },
  "play-reverse-diff": {
    label: "Mixes up the sum and difference rules",
    detail: "Uses 9 for ab + ba or 11 for ab − ba.",
    childTip: "ab + ba = 11(a + b); ab − ba = 9(a − b). Write them out to check.",
  },
  "play-small-from-big": {
    label: "Takes the smaller digit from the bigger one",
    detail: "Subtracts in each column the easy way round instead of exchanging, e.g. 72 − 27 = 55.",
    childTip: "If the top digit is smaller, exchange a ten for 10 ones first.",
  },
  "play-last-digit": {
    label: "Uses the last digit to test for 3 or 9",
    detail: "Thinks a number is divisible by 3 or 9 if its last digit is.",
    childTip: "For 3 and 9, add all the digits. Only 2, 5 and 10 look at the last digit.",
  },
  "play-3-for-9": {
    label: "Thinks divisible by 3 means divisible by 9",
    detail: "Uses the test for 3 when the question is about 9.",
    childTip: "For 9, the digit sum must be a multiple of 9, not just of 3.",
  },
  "play-no-reduce": {
    label: "Gives the digit sum as the remainder",
    detail: "Says the remainder on dividing by 9 is the digit sum, even when it is 9 or more.",
    childTip: "Keep going: if the digit sum is 9 or more, take away 9s until it is less than 9.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `play8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const COLS = [1000, 100, 10, 1];
const digitsOf = (v: number) => COLS.map((p) => Math.floor(v / p) % 10);
const chart = (mode: "build" | "change", start: number, target: number, wrong: { value: number; mistake: string }[]): PlaceValueActivity => ({
  kind: "place-value",
  mode,
  columns: COLS,
  start: mode === "build" ? COLS.map(() => 0) : digitsOf(start),
  target,
  wrong: wrong.filter((w, i) => w.value !== target && w.value >= 0 && w.value < 10000 && wrong.findIndex((x) => x.value === w.value) === i),
});
const pv = (a: number, b: number, c?: number) => ({
  kind: "place-value-chart" as const,
  columns: c === undefined ? [{ label: "T", count: a }, { label: "O", count: b }] : [{ label: "H", count: a }, { label: "T", count: b }, { label: "O", count: c }],
});
const LETTERS = [["a", "b", "c"], ["x", "y", "z"], ["p", "q", "r"], ["l", "m", "n"]] as const;

/** A 3-digit number whose digit sum is a multiple of 3 (and of 9 when nine is true). */
function threeDigit(rng: Rng, nine: boolean): [number, number, number] {
  for (;;) {
    const a = int(rng, 1, 9), b = int(rng, 0, 9), c = int(rng, 0, 9);
    const s = a + b + c;
    if (s % 3 === 0 && (s % 9 === 0) === nine) return [a, b, c];
  }
}

export const PLAYING_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: the place-value chart ----------------
  "concrete|remember": (rng) => {
    const a = int(rng, 1, 9), b = int(rng, 0, 9);
    let c = int(rng, 1, 9);
    if (c === a) c = a === 9 ? 1 : a + 1;
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "general form", rng), prompt: `Build 100 × ${a} + 10 × ${b} + ${c} on the chart.`, representation: null },
      { a, b, c },
      chart("build", 0, 100 * a + 10 * b + c, [
        { value: 100 * c + 10 * b + a, mistake: "play-place-value" },
        { value: a + b + c, mistake: "play-place-value" },
        { value: 10 * a + b + c, mistake: "play-place-value" },
      ])
    );
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 1, 8), u = int(rng, 11, 19);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "general form", rng), prompt: `Build 10 × ${a} + ${u} on the chart.`, representation: null },
      { a, u },
      chart("build", 0, 10 * a + u, [{ value: 100 * a + u, mistake: "play-place-value" }, { value: a + u, mistake: "play-place-value" }])
    );
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 1, 9);
    let b = int(rng, 1, 9);
    if (b === a) b = a === 9 ? 1 : a + 1;
    const ab = 10 * a + b, ba = 10 * b + a;
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "reversals", rng), prompt: `The chart shows ${ab}. Add the number you get by swapping its digits.`, representation: null },
      { a, b },
      chart("change", ab, ab + ba, [{ value: 2 * ab, mistake: "play-swap" }, { value: 10 * (a + b), mistake: "play-sum-11" }])
    );
  },
  "concrete|analyze": (rng) => {
    const b = int(rng, 1, 7);
    const a = int(rng, b + 2, 9);
    const ab = 10 * a + b, ba = 10 * b + a;
    return buildActivity(
      { ...base("c-analyze", "concrete", "analyze", "reversals", rng), prompt: `The chart shows ${ab}. Take away the number you get by swapping its digits.`, representation: null },
      { a, b },
      chart("change", ab, ab - ba, [{ value: 11 * (a - b), mistake: "play-small-from-big" }])
    );
  },
  "concrete|evaluate": (rng) => {
    const nine = rng() < 0.5;
    const [a, b, c] = threeDigit(rng, nine);
    const n = 100 * a + 10 * b + c, s = a + b + c;
    return build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "divisibility", rng),
        prompt: `Build ${n} on the chart. Is ${n} divisible by 9?`,
        representation: null,
        activity: chart("build", 0, n, [{ value: 100 * c + 10 * b + a, mistake: "play-place-value" }]),
      },
      { a, b, c },
      nine ? `Yes: its digits add up to ${s}, a multiple of 9` : `No: its digits add up to ${s}, which 9 doesn't divide`,
      [
        nine
          ? { text: `No: its digits add up to ${s}, which 9 doesn't divide`, mistake: null }
          : { text: `Yes: its digits add up to ${s}, which 3 divides`, mistake: "play-3-for-9" },
        { text: `${c === 9 || c === 0 ? "Yes" : "No"}: look at its last digit, ${c}`, mistake: "play-last-digit" },
        { text: `${n % 2 === 0 ? "Yes: it is even" : "No: it is odd"}`, mistake: null },
        { text: `Yes: its digits add up to ${s}`, mistake: nine ? null : "play-3-for-9" },
      ]
    );
  },

  // ---------------- PICTORIAL: place-value charts ----------------
  "pictorial|remember": (rng) => {
    const a = int(rng, 1, 9), b = int(rng, 0, 9);
    let c = int(rng, 1, 9);
    if (c === a) c = a === 9 ? 1 : a + 1;
    return build(
      { ...base("p-remember", "pictorial", "remember", "general form", rng), prompt: "Which is this number in general form?", representation: pv(a, b, c) },
      { a, b, c },
      `100 × ${a} + 10 × ${b} + ${c}`,
      [
        { text: `${a} + ${b} + ${c}`, mistake: "play-place-value" },
        { text: `10 × ${a} + ${b} + ${c}`, mistake: "play-place-value" },
        { text: `100 × ${c} + 10 × ${b} + ${a}`, mistake: "play-place-value" },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const a = int(rng, 1, 9);
    let b = int(rng, 1, 9);
    if (b === a) b = a === 9 ? 1 : a + 1;
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "reversals", rng),
        prompt: `Add this number to the number with its digits swapped. Whatever the digits, the answer is always a multiple of which number?`,
        representation: pv(a, b),
      },
      { a, b },
      "11",
      [
        { text: "10", mistake: "play-sum-11" },
        { text: "9", mistake: "play-reverse-diff" },
        { text: "2", mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 1, 9), b = int(rng, 0, 9), c = int(rng, 0, 9);
    const s = a + b + c, n = 100 * a + 10 * b + c;
    const yes = s % 3 === 0;
    return build(
      { ...base("p-apply", "pictorial", "apply", "divisibility", rng), prompt: "Is this number divisible by 3?", representation: pv(a, b, c) },
      { a, b, c },
      `${yes ? "Yes" : "No"}: ${a} + ${b} + ${c} = ${s}`,
      [
        { text: `${yes ? "No" : "Yes"}: ${a} + ${b} + ${c} = ${s}`, mistake: null },
        { text: `${c % 3 === 0 ? "Yes" : "No"}: look at the last digit, ${c}`, mistake: "play-last-digit" },
        { text: n % 2 === 0 ? "No: it is even" : "Yes: it is odd", mistake: null },
        { text: `${yes ? "No" : "Yes"}: look at the last digit, ${c}`, mistake: "play-last-digit" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const a = int(rng, 1, 9), b = int(rng, 0, 9), c = int(rng, 0, 9);
    const s = a + b + c;
    return build(
      { ...base("p-analyze", "pictorial", "analyze", "remainders", rng), prompt: "What is the remainder when this number is divided by 9?", representation: pv(a, b, c) },
      { a, b, c },
      String(s % 9),
      [
        { text: String(c % 9), mistake: "play-last-digit" },
        { text: String(s), mistake: "play-no-reduce" },
        { text: String(s % 3), mistake: "play-3-for-9" },
        { text: String((s + 1) % 9), mistake: null },
        { text: String((s + 2) % 9), mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    let a = 1, c = 0, d = 0;
    while (d === 0) {
      a = int(rng, 1, 9);
      c = int(rng, 0, 9);
      d = (9 - ((a + c) % 9)) % 9;
    }
    const three = [(d + 3) % 9, (d + 6) % 9].filter((x) => x !== 0 && x !== d);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "missing digit", rng),
        prompt: "The tens column is empty. Which digit goes in the tens so that the number is divisible by 9?",
        representation: pv(a, 0, c),
      },
      { a, c },
      String(d),
      [
        ...three.map((x) => ({ text: String(x), mistake: "play-3-for-9" })),
        ...(9 - c !== d && c > 0 ? [{ text: String(9 - c), mistake: "play-last-digit" }] : []),
        { text: String(Math.min(9, d + 1)), mistake: null },
        { text: String(Math.max(1, d - 1)), mistake: null },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const i = int(rng, 0, LETTERS.length - 1);
    const [x, y, z] = LETTERS[i];
    return build(
      { ...base("a-remember", "abstract", "remember", "general form", rng), prompt: `A 3-digit number has hundreds digit ${x}, tens digit ${y} and ones digit ${z}. Which is the number?`, representation: null },
      { i },
      `100${x} + 10${y} + ${z}`,
      [
        { text: `${x} + ${y} + ${z}`, mistake: "play-place-value" },
        { text: `100${z} + 10${y} + ${x}`, mistake: "play-place-value" },
        { text: `${x} × ${y} × ${z}`, mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const [a, b, c] = threeDigit(rng, true);
    const [d, e, f] = threeDigit(rng, false);
    let g = 0;
    while (g === 0 || g % 9 === 0) g = int(rng, 10, 99) * 10 + 9; // ends in 9, not a multiple of 9
    let h = int(rng, 100, 999);
    while (h % 9 === 0 || h % 3 === 0) h = int(rng, 100, 999);
    return build(
      { ...base("a-understand", "abstract", "understand", "divisibility", rng), prompt: "Which of these is divisible by 9?", representation: null },
      { a, b, c, d, e, f, g, h },
      String(100 * a + 10 * b + c),
      [
        { text: String(100 * d + 10 * e + f), mistake: "play-3-for-9" },
        { text: String(g), mistake: "play-last-digit" },
        { text: String(h), mistake: null },
        { text: String(100 * a + 10 * b + c + 3), mistake: "play-3-for-9" },
        { text: String(100 * a + 10 * b + c + 1), mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const b = int(rng, 1, 7);
    const a = int(rng, b + 2, 9);
    return build(
      { ...base("a-apply", "abstract", "apply", "reversals", rng), prompt: `${10 * a + b} − ${10 * b + a} = ?`, representation: null },
      { a, b },
      String(9 * (a - b)),
      [
        { text: String(11 * (a - b)), mistake: "play-small-from-big" },
        { text: String(10 * (a - b)), mistake: null },
        { text: String(a - b), mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const t = int(rng, 3, 17);
    const S = 11 * t;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "puzzles", rng), prompt: `A 2-digit number plus the number with its digits swapped makes ${S}. What do its two digits add up to?`, representation: null },
      { t },
      String(t),
      [
        { text: String(+(S / 10).toFixed(1)), mistake: "play-sum-11" },
        { text: String(t + 1), mistake: null },
        { text: String(S - 11), mistake: null },
        { text: String(t - 1), mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    let k = 0;
    while (k % 3 !== 0 || k % 9 === 0) k = int(rng, 12, 300);
    let m = 0;
    while (m % 9 !== 0) m = int(rng, 18, 300);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "divisibility", rng), prompt: `Sam says: "Every number divisible by 3 is also divisible by 9." Is Sam right?`, representation: null },
      { k, m },
      `No: ${k} is divisible by 3 but not by 9`,
      [
        { text: "Yes: 9 is a multiple of 3", mistake: "play-3-for-9" },
        { text: `Yes: for example, ${m} is divisible by both`, mistake: "play-3-for-9" },
        { text: `No: ${m} is divisible by 9 but not by 3`, mistake: null },
      ]
    );
  },
};
