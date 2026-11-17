import { Rng, Template, build, buildActivity, gcd, int, pick, rat } from "./core.js";
import { ShareActivity } from "../../types.js";

/**
 * Rational Numbers, Grade 8 (book chapter 1): what p/q means, rational
 * numbers on the number line, comparing (negatives included), a rational
 * number between two others, the four operations, reciprocals and the
 * properties.
 *   concrete  hands-on: share rotis between friends (a fraction is a share);
 *             make a fraction; equal shares; who gets more
 *   pictorial number lines from −2 to 2: read a point, compare negatives,
 *             find a number between, mixed numbers, jumps left and right
 *   abstract  reciprocals, adding, dividing, the distributive property,
 *             the greatest of four
 */

const TOPIC = "g8-rational-numbers";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "rat-sign-slip": {
    label: "Loses or flips the minus sign",
    detail: "Gets the size right but the sign wrong (e.g. reads −3/4 as 3/4).",
    childTip: "Left of 0 is negative. Check the sign last, every time.",
  },
  "rat-negative-order": {
    label: "Orders negative numbers backwards",
    detail: "Thinks −5/6 is greater than −1/6 because 5 is greater than 1.",
    childTip: "On the number line, further right is greater. −1/6 is to the right of −5/6.",
  },
  "rat-compare-parts": {
    label: "Compares just the tops or bottoms",
    detail: "Decides which fraction is bigger from the numerators or denominators alone.",
    childTip: "Make the denominators the same first, then compare.",
  },
  "rat-not-between": {
    label: "Picks a number outside the gap",
    detail: "Gives a number that is not between the two numbers asked about.",
    childTip: "Put your answer on the number line: it must sit between the two points.",
  },
  "rat-miscount": {
    label: "Miscounts the marks on the number line",
    detail: "Counts one mark too many or too few from 0.",
    childTip: "Count the jumps from 0, not the marks, and say the fraction each time.",
  },
  "rat-whole-part": {
    label: "Drops the whole number part",
    detail: "Reads −1 2/3 as −2/3, forgetting the whole one.",
    childTip: "Count the whole jumps first, then the small ones.",
  },
  "rat-wrong-way": {
    label: "Counts from the wrong whole number",
    detail: "Reads a point between −2 and −1 by counting back from −2 instead of from −1.",
    childTip: "Start from 0 and move left: first to −1, then the extra parts.",
  },
  "rat-direction": {
    label: "Moves the wrong way",
    detail: "Adds when the jump is to the left (subtracting), or the other way round.",
    childTip: "Taking away moves left on the number line; adding moves right.",
  },
  "rat-reciprocal-sign": {
    label: "Changes the sign when taking the reciprocal",
    detail: "Says the reciprocal of −2/5 is 5/2. The reciprocal keeps its sign.",
    childTip: "Reciprocal: flip the fraction, keep the sign. −2/5 × −5/2 = 1.",
  },
  "rat-inverse-mixup": {
    label: "Mixes up reciprocal and additive inverse",
    detail: "Gives the number that adds to 0 when the one that multiplies to 1 was asked for (or the other way round).",
    childTip: "Additive inverse: adds to 0 (change the sign). Reciprocal: multiplies to 1 (flip it).",
  },
  "rat-add-across": {
    label: "Adds tops and bottoms",
    detail: "Works out 1/2 + 1/3 as 2/5, adding numerators and denominators.",
    childTip: "Only add fractions with the same denominator. Make them the same first.",
  },
  "rat-adds-tops": {
    label: "Adds the tops over a common bottom without converting",
    detail: "Uses a common denominator but doesn't change the numerators to match.",
    childTip: "When the bottom is multiplied, multiply the top by the same number.",
  },
  "rat-no-flip": {
    label: "Divides without flipping",
    detail: "Multiplies straight across when dividing fractions.",
    childTip: "Dividing by a fraction is multiplying by its reciprocal: flip the second one.",
  },
  "rat-flip-first": {
    label: "Flips the wrong fraction",
    detail: "Takes the reciprocal of the first fraction instead of the second.",
    childTip: "Keep the first, change ÷ to ×, flip the second.",
  },
  "rat-distrib-partial": {
    label: "Multiplies only the first term in brackets",
    detail: "Writes a × (b + c) as a × b + c.",
    childTip: "Everything inside the brackets gets multiplied: a × b + a × c.",
  },
  "rat-same-added": {
    label: "Adds the same number to top and bottom",
    detail: "Thinks 2/3 is the same as 3/4 (adding 1 to each). Equal fractions multiply both, not add.",
    childTip: "Equal fractions: multiply (or divide) the top and bottom by the same number.",
  },
};

const PEOPLE = ["friends", "children", "cousins", "players"] as const;
const FOOD = [
  ["roti", "rotis"],
  ["cake", "cakes"],
  ["pizza", "pizzas"],
  ["chocolate bar", "chocolate bars"],
] as const;

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `rat8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
function share(rng: Rng, mode: "share" | "build", wholes: number, people: number): ShareActivity {
  const [one, many] = pick(rng, FOOD);
  return { kind: "share", mode, wholes, people, itemOne: one, itemMany: many, personOne: "friend", peopleLabel: pick(rng, PEOPLE) };
}
/** n/d in lowest terms with a real minus sign (2/4 shows as 1/2, 4/4 as 1). */
const q = (n: number, d: number) => rat(n, d);
const coprimeTo = (rng: Rng, d: number, lo: number, hi: number) => {
  for (let i = 0; i < 50; i++) {
    const n = int(rng, lo, hi);
    if (gcd(n, d) === 1) return n;
  }
  return 1;
};
const line = (min: number, max: number, d: number, markers: { value: number; label: string }[]) => ({ kind: "number-line" as const, min, max, step: 1 / d, labelEvery: d, markers });

export const RATIONAL_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: sharing (a fraction is a share) ----------------
  "concrete|remember": (rng) => {
    const p = int(rng, 3, 6);
    const w = coprimeTo(rng, p, 1, p - 1);
    const a = share(rng, "share", w, p);
    return buildActivity({ ...base("c-remember", "concrete", "remember", "meaning", rng), prompt: `Share the ${w} ${w === 1 ? a.itemOne : a.itemMany} equally between ${p} ${a.peopleLabel}.`, representation: null }, { w, p }, a);
  },
  "concrete|understand": (rng) => {
    const p = int(rng, 2, 4);
    const w = p + coprimeTo(rng, p, 1, p - 1);
    const a = share(rng, "share", w, p);
    return buildActivity({ ...base("c-understand", "concrete", "understand", "meaning", rng), prompt: `Share the ${w} ${a.itemMany} equally between ${p} ${a.peopleLabel}. Cut them if you need to.`, representation: null }, { w, p }, a);
  },
  "concrete|apply": (rng) => {
    const p = int(rng, 3, 6);
    const w = coprimeTo(rng, p, 1, p - 1);
    const a = share(rng, "build", w, p);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "meaning", rng), prompt: `Show ${w}/${p} by sharing: choose how many ${a.itemMany} and how many ${a.peopleLabel}, then share them out.`, representation: null },
      { w, p },
      a
    );
  },
  "concrete|analyze": (rng) => {
    const p = int(rng, 3, 5);
    const w = coprimeTo(rng, p, 1, p - 1);
    const a = share(rng, "share", w, p);
    return build(
      { ...base("c-analyze", "concrete", "analyze", "equivalent", rng), prompt: `Share the ${w} ${w === 1 ? a.itemOne : a.itemMany} between ${p} ${a.peopleLabel}. Each gets ${w}/${p}. Which share is exactly the same size?`, representation: null, activity: a },
      { w, p },
      `${2 * w}/${2 * p}`,
      [
        { text: `${w + 1}/${p + 1}`, mistake: "rat-same-added" },
        { text: `${p}/${w}`, mistake: "fd-flips" },
        { text: `${w}/${2 * p}`, mistake: null },
        { text: `${2 * w}/${p}`, mistake: null },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    // Two sharings; the one with more people and more food gets less.
    const p1 = int(rng, 2, 4);
    const w1 = coprimeTo(rng, p1, 1, p1 - 1);
    const p2 = p1 + int(rng, 1, 3);
    let w2 = w1 + 1;
    if (w2 >= p2 || w2 * p1 === w1 * p2) w2 = w1;
    const a = share(rng, "share", w1, p1);
    const first = w1 * p2 > w2 * p1;
    const one = `Each of the ${p1} ${a.peopleLabel} sharing ${w1}`;
    const two = `Each of the ${p2} ${a.peopleLabel} sharing ${w2}`;
    return build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "compare", rng),
        prompt: `${w1} ${w1 === 1 ? a.itemOne : a.itemMany} are shared between ${p1} ${a.peopleLabel}, and ${w2} between ${p2}. Try the first sharing. Who gets more?`,
        representation: null,
        activity: a,
      },
      { w1, p1, w2, p2 },
      first ? one : two,
      [
        { text: first ? two : one, mistake: "rat-compare-parts" },
        { text: "They get the same", mistake: null },
        { text: "You can't tell without cutting both", mistake: null },
      ]
    );
  },

  // ---------------- PICTORIAL: number lines ----------------
  "pictorial|remember": (rng) => {
    const d = pick(rng, [3, 4, 5, 6, 8]);
    const a = coprimeTo(rng, d, 1, d - 1);
    const s = rng() < 0.7 ? -1 : 1;
    return build(
      { ...base("p-remember", "pictorial", "remember", "number line", rng), prompt: "Which rational number is at P?", representation: line(-1, 1, d, [{ value: (s * a) / d, label: "P" }]) },
      { a, d, s },
      q(s * a, d),
      [
        { text: q(-s * a, d), mistake: "rat-sign-slip" },
        { text: q(s * (a + 1), d), mistake: "rat-miscount" },
        { text: q(s * d, a), mistake: "fd-flips" },
        { text: q(s * (a - 1), d), mistake: "rat-miscount" },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const d = pick(rng, [5, 6, 7, 8]);
    const a = int(rng, 1, d - 3);
    const b = int(rng, a + 2, d - 1);
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "compare", rng),
        prompt: `A is ${q(-a, d)} and B is ${q(-b, d)}. Which is greater?`,
        representation: line(-1, 1, d, [{ value: -a / d, label: "A" }, { value: -b / d, label: "B" }]),
      },
      { a, b, d },
      `${q(-a, d)}: it is further right`,
      [
        { text: `${q(-b, d)}: ${b} is more than ${a}`, mistake: "rat-negative-order" },
        { text: `${q(-b, d)}: it is further from 0`, mistake: "rat-negative-order" },
        { text: "They are equal: both are negative", mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const d = pick(rng, [4, 5, 6, 8]);
    const a = int(rng, -d, d - 2);
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "between", rng),
        prompt: `P is ${q(a, d)} and Q is ${q(a + 2, d)}. Which rational number lies between P and Q?`,
        representation: line(-2, 2, d, [{ value: a / d, label: "P" }, { value: (a + 2) / d, label: "Q" }]),
      },
      { a, d },
      q(a + 1, d),
      [
        { text: q(a + 3, d), mistake: "rat-not-between" },
        { text: q(a - 1, d), mistake: "rat-not-between" },
        { text: q(2 * a + 2, d), mistake: null },
        { text: q(a + 4, d), mistake: "rat-not-between" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const d = pick(rng, [3, 4, 5]);
    const r = coprimeTo(rng, d, 1, d - 1);
    const m = d + r;
    return build(
      { ...base("p-analyze", "pictorial", "analyze", "mixed numbers", rng), prompt: "Which mixed number is at P?", representation: line(-2, 2, d, [{ value: -m / d, label: "P" }]) },
      { r, d },
      `−1 ${r}/${d}`,
      [
        { text: `−${r}/${d}`, mistake: "rat-whole-part" },
        { text: `1 ${r}/${d}`, mistake: "rat-sign-slip" },
        { text: `−1 ${d - r}/${d}`, mistake: "rat-wrong-way" },
        { text: `−2 ${r}/${d}`, mistake: "rat-miscount" },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const d = pick(rng, [3, 4, 5, 6]);
    const a = int(rng, -d + 1, d);
    let b = int(rng, 1, d);
    if (a === 2 * b) b = b === d ? 1 : b + 1; // the landing point isn't the jump itself
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "add and subtract", rng),
        prompt: `Start at A (${q(a, d)}) and jump ${b}/${d} to the left. Where do you land?`,
        representation: line(-2, 2, d, [{ value: a / d, label: "A" }]),
      },
      { a, b, d },
      q(a - b, d),
      [
        { text: q(a + b, d), mistake: "rat-direction" },
        { text: q(b - a, d), mistake: "rat-sign-slip" },
        { text: q(a - b + 1, d), mistake: "rat-miscount" },
        { text: q(a - b - 1, d), mistake: "rat-miscount" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const b = int(rng, 3, 9);
    const a = coprimeTo(rng, b, 2, 9);
    return build(
      { ...base("a-remember", "abstract", "remember", "reciprocal", rng), prompt: `What is the reciprocal of −${a}/${b}?`, representation: null },
      { a, b },
      `−${b}/${a}`,
      [
        { text: `${b}/${a}`, mistake: "rat-reciprocal-sign" },
        { text: `${a}/${b}`, mistake: "rat-inverse-mixup" },
        { text: `−${a}/${b}`, mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const b = int(rng, 2, 7);
    let d = int(rng, 3, 9);
    if (d === b) d = b + 1;
    const a = coprimeTo(rng, b, 1, b - 1);
    const c = coprimeTo(rng, d, 1, d - 1);
    const s = rng() < 0.5 ? -1 : 1;
    const second = s < 0 ? `(−${c}/${d})` : `${c}/${d}`;
    return build(
      { ...base("a-understand", "abstract", "understand", "add", rng), prompt: `${a}/${b} + ${second} = ?`, representation: null },
      { a, b, c, d, s },
      rat(a * d + s * c * b, b * d),
      [
        { text: rat(a + s * c, b + d), mistake: "rat-add-across" },
        { text: rat(a + s * c, b * d), mistake: "rat-adds-tops" },
        { text: rat(a * d - s * c * b, b * d), mistake: "rat-sign-slip" },
        { text: rat(-(a * d + s * c * b), b * d), mistake: "rat-sign-slip" },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const b = int(rng, 2, 7);
    const a = coprimeTo(rng, b, 1, 8);
    const d = int(rng, 2, 7);
    const c = coprimeTo(rng, d, 1, 8);
    return build(
      { ...base("a-apply", "abstract", "apply", "divide", rng), prompt: `(−${a}/${b}) ÷ ${c}/${d} = ?`, representation: null },
      { a, b, c, d },
      rat(-a * d, b * c),
      [
        { text: rat(-a * c, b * d), mistake: "rat-no-flip" },
        { text: rat(-b * c, a * d), mistake: "rat-flip-first" },
        { text: rat(a * d, b * c), mistake: "rat-sign-slip" },
        { text: rat(-b * d, a * c), mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const f = () => {
      const d = int(rng, 2, 9);
      return `${rng() < 0.4 ? "−" : ""}${coprimeTo(rng, d, 1, d - 1)}/${d}`;
    };
    const x = f();
    let y = f();
    let z = f();
    while (y === x) y = f();
    while (z === x || z === y) z = f();
    const X = `(${x})`, Y = `(${y})`, Z = `(${z})`;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "properties", rng), prompt: `Which is always true? (the distributive property)`, representation: null },
      { n: Math.floor(rng() * 1e6) },
      `${X} × [${Y} + ${Z}] = ${X} × ${Y} + ${X} × ${Z}`,
      [
        { text: `${X} × [${Y} + ${Z}] = ${X} × ${Y} + ${Z}`, mistake: "rat-distrib-partial" },
        { text: `${X} × [${Y} + ${Z}] = ${X} + ${Y} × ${Z}`, mistake: null },
        { text: `${X} × [${Y} + ${Z}] = [${X} × ${Y}] × [${X} × ${Z}]`, mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    // Two positives (the larger written with smaller numbers) and two negatives (one with big numbers).
    const d1 = int(rng, 3, 5);
    const n1 = coprimeTo(rng, d1, 1, d1 - 1);
    let d2 = int(rng, 7, 12);
    let n2 = int(rng, 1, d2 - 1);
    for (let i = 0; i < 30 && (n2 * d1 >= n1 * d2 || gcd(n2, d2) !== 1); i++) (d2 = int(rng, 7, 12)), (n2 = int(rng, 1, d2 - 1));
    if (n2 * d1 >= n1 * d2) (n2 = 1), (d2 = 12);
    const d3 = int(rng, 6, 9);
    const n3 = coprimeTo(rng, d3, 4, d3 - 1);
    const d4 = int(rng, 2, 4);
    const n4 = coprimeTo(rng, d4, 1, d4 - 1);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "compare", rng), prompt: `Which is the greatest: ${n2}/${d2}, −${n3}/${d3}, ${n1}/${d1}, −${n4}/${d4}?`, representation: null },
      { n1, d1, n2, d2, n3, d3, n4, d4 },
      `${n1}/${d1}`,
      [
        { text: `${n2}/${d2}`, mistake: "rat-compare-parts" },
        { text: `−${n3}/${d3}`, mistake: "rat-negative-order" },
        { text: `−${n4}/${d4}`, mistake: "rat-negative-order" },
      ]
    );
  },
};
