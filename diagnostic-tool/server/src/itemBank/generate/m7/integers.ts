import { Template, int, pick } from "../core.js";
import { Misconceptions, br, card, kit, neg } from "./kit.js";

/** Grade 7 Maths, Chapter 1: Integers (properties, the four operations). */
const K = kit("int7", "g7-integers");
export const MISCONCEPTIONS: Misconceptions = {
  "int-order-abs": { label: "Orders negatives by their size, not their value", detail: "Thinks −9 is greater than −2 because 9 > 2.", childTip: "On the number line, further left is smaller: −9 < −2." },
  "int-add-sign": { label: "Gets the sign wrong when adding", detail: "Adds the sizes and ignores the signs (−8 + 3 = 11 or 5).", childTip: "Different signs: subtract the sizes, keep the sign of the bigger one: −8 + 3 = −5." },
  "int-sub-neg": { label: "Doesn't change subtracting a negative into adding", detail: "Writes 5 − (−3) = 2.", childTip: "Subtracting a negative is adding: 5 − (−3) = 5 + 3 = 8." },
  "int-sign-mult": { label: "Gets the sign wrong when multiplying or dividing", detail: "Writes (−4) × (−3) = −12.", childTip: "Same signs give +, different signs give −." },
  "int-property": { label: "Mixes up the properties of integers", detail: "Confuses commutative, associative, identity and closure.", childTip: "Commutative: order doesn't matter (a + b = b + a). Identity: 0 for adding, 1 for multiplying. Division is not closed: 3 ÷ 2 is not an integer." },
  "int-count": { label: "Counts steps on the number line wrongly", detail: "Is one off, or counts the starting point.", childTip: "Count the jumps, not the marks." },
};

const distinct = (rng: () => number, n: number, lo: number, hi: number) => {
  const s = new Set<number>();
  while (s.size < n) s.add(int(rng, lo, hi));
  return [...s];
};
const PROPS: [string, string][] = [
  ["(−7) + 4 = 4 + (−7)", "Commutative property of addition"],
  ["(−2) × (3 × 5) = ((−2) × 3) × 5", "Associative property of multiplication"],
  ["(−9) + 0 = −9", "Additive identity (0)"],
  ["(−6) × 1 = −6", "Multiplicative identity (1)"],
  ["(−8) + 8 = 0", "Additive inverse"],
  ["(−4) × (5 + 2) = (−4) × 5 + (−4) × 2", "Distributive property"],
];

export const INTEGERS_G7: Record<string, Template> = {
  "concrete|remember": (rng) => {
    const xs = distinct(rng, 7, -15, 15).filter((x) => x !== 0);
    const line = [...xs, 0].sort(() => rng() - 0.5).map(neg).join("  ");
    const negs = xs.filter((x) => x < 0).map(neg);
    if (!negs.length) return INTEGERS_G7["concrete|remember"](rng);
    return K.tap("remember", "negative integers", rng, { s: xs.reduce((a, b) => a * 31 + b, 7) % 100000 }, "Tap every negative integer.", line, negs, [{ phrase: [...negs, "0"], mistake: "int-order-abs" }]);
  },
  "concrete|understand": (rng) => {
    let xs: number[];
    do xs = distinct(rng, 5, -12, 12); while (new Set(xs.map(Math.abs)).size < 5 || xs.filter((x) => x < 0).length < 2);
    const up = [...xs].sort((a, b) => a - b);
    const byAbs = [...xs].sort((a, b) => Math.abs(a) - Math.abs(b));
    return K.order("understand", "ordering", rng, { a: up[0], b: up[4], c: up[2] }, "Put these integers in order, least to greatest.", up.map(neg).join(" | "), [], [[byAbs.map(neg).join(" "), "int-order-abs"]]);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 2, 9), b = int(rng, 2, 9);
    const ans = a * b;
    return K.order("apply", "multiplying signs", rng, { a, b }, `Build a true sentence for (−${a}) × (−${b}).`, `(−${a}) | × | (−${b}) | = | ${ans}`, [`−${ans}`], [[`(−${a}) × (−${b}) = −${ans}`, "int-sign-mult"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 3, 9), b = int(rng, 2, 9);
    const ans = a + b;
    return K.order("analyze", "subtracting a negative", rng, { a, b }, `Build a true sentence for ${a} − (−${b}).`, `${a} | − | (−${b}) | = | ${ans}`, [String(a - b)], [[`${a} − (−${b}) = ${a - b}`, "int-sub-neg"]]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 6, 15), b = int(rng, 2, a - 2);
    const wrong = a + b;
    return K.tap("evaluate", "checking a sum", rng, { a, b }, "One number in this working is wrong. Tap it.", `−${a} + ${b} = ${wrong}`, String(wrong));
  },
  "pictorial|remember": (rng) => {
    const v = int(rng, -9, -1);
    return K.mc("pictorial", "remember", "the number line", rng, { v }, "What integer is marked on the number line?", { kind: "number-line", min: -10, max: 10, step: 1, labelEvery: 5, markers: [{ value: v, label: "?" }] }, neg(v), [[String(-v), "int-order-abs"], [neg(v - 1), "int-count"], [neg(v + 1), "int-count"]]);
  },
  "pictorial|understand": (rng) => {
    const a = int(rng, -9, -2), c = int(rng, 2, 9);
    return K.mc("pictorial", "understand", "distance on the number line", rng, { a, c }, "How many steps is it from A to B?", { kind: "number-line", min: -10, max: 10, step: 1, labelEvery: 5, markers: [{ value: a, label: "A" }, { value: c, label: "B" }] }, String(c - a), [[String(c + a), "int-add-sign"], [String(c - a - 1), "int-count"], [String(c - a + 1), "int-count"]]);
  },
  "pictorial|apply": (rng) => {
    const t = int(rng, -12, -3), k = int(rng, 4, 15);
    const now = t + k;
    return K.mc("pictorial", "apply", "rising temperature", rng, { t, k }, `This was the temperature at dawn (°C). By noon it rose by ${k} degrees. What was it at noon?`, { kind: "number-line", min: -15, max: 15, step: 1, labelEvery: 5, markers: [{ value: t, label: "dawn" }] }, `${neg(now)} °C`, [[`${neg(t - k)} °C`, "int-add-sign"], [`${neg(-t + k)} °C`, "int-add-sign"], [`${neg(now + 1)} °C`, "int-count"]]);
  },
  "pictorial|analyze": (rng) => {
    let a: number, b: number;
    do { a = int(rng, -15, -1); b = int(rng, -15, -1); } while (a === b);
    const big = Math.max(a, b);
    return K.mc("pictorial", "analyze", "comparing", rng, { a, b }, "Which integer is greater?", { kind: "number-line", min: -16, max: 0, step: 1, labelEvery: 4, markers: [{ value: a, label: "P" }, { value: b, label: "Q" }] }, big === a ? "P" : "Q", [[big === a ? "Q" : "P", "int-order-abs"], ["They are equal", "int-order-abs"], ["You can't tell from the line", "int-order-abs"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 2, 9), b = int(rng, 2, 9);
    const right = rng() < 0.5;
    const said = right ? `(−${a}) × ${b} = −${a * b}` : `(−${a}) × (−${b}) = −${a * b}`;
    return K.mc("pictorial", "evaluate", "checking signs", rng, { a, b, r: right ? 1 : 0 }, "Is Riya right?", card([`Riya: ${said}`]), right ? "Yes: different signs give a negative" : "No: two negatives give a positive", [
      [right ? "No: two negatives give a positive" : "Yes: different signs give a negative", "int-sign-mult"],
      ["Yes: the answer is always negative if a negative is involved", "int-sign-mult"],
      ["No: you should add, not multiply", "int-add-sign"],
    ]);
  },
  "abstract|remember": (rng) => {
    const [i, [eq, name]] = (() => { const i = int(rng, 0, PROPS.length - 1); return [i, PROPS[i]] as const; })();
    const others = PROPS.filter((_, k) => k !== i).sort(() => rng() - 0.5).slice(0, 3).map(([, n]) => [n, "int-property"] as [string, string]);
    return K.mc("abstract", "remember", "properties", rng, { i }, `Which property is shown? ${eq}`, null, name, others);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 6, 20), b = int(rng, 2, a - 1);
    return K.mc("abstract", "understand", "adding", rng, { a, b }, `−${a} + ${b} = ?`, null, neg(b - a), [[String(a - b), "int-add-sign"], [neg(-(a + b)), "int-add-sign"], [String(a + b), "int-add-sign"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, -12, 12), b = int(rng, 2, 12);
    return K.mc("abstract", "apply", "subtracting", rng, { a, b }, `${br(a)} − (−${b}) = ?`, null, neg(a + b), [[neg(a - b), "int-sub-neg"], [neg(-a - b), "int-add-sign"], [neg(a + b + 1), "int-count"]]);
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 2, 9), q = int(rng, 2, 9), s = pick(rng, [1, -1]);
    const n = a * q;
    return K.mc("abstract", "analyze", "dividing", rng, { a, q, s }, `(−${n}) ÷ ${br(s * a)} = ?`, null, neg(-s * q), [[neg(s * q), "int-sign-mult"], [neg(-s * (n - a)), "int-add-sign"], [neg(-s * q * 10), "int-count"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 2, 6), b = int(rng, 2, 6), c = int(rng, 2, 9);
    const right = -a * b + c;
    return K.mc("abstract", "evaluate", "order of operations", rng, { a, b, c }, `(−${a}) × ${b} + ${c} = ?`, null, neg(right), [[neg(-a * (b + c)), "int-property"], [neg(a * b + c), "int-sign-mult"], [neg(-a * b - c), "int-add-sign"]]);
  },
};
