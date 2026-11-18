import { Template, int, pick } from "../core.js";
import { Misconceptions, card, kit } from "./kit.js";

/** Grade 7 Maths, Chapter 3: Decimals (multiplying and dividing, by 10/100/1000). */
const K = kit("dec7", "g7-decimals");
export const MISCONCEPTIONS: Misconceptions = {
  "d7-point-places": { label: "Puts the decimal point in the wrong place", detail: "Counts decimal places wrongly when multiplying (0.3 × 0.2 = 0.6).", childTip: "Count the decimal places in both numbers; the answer has that many: 0.3 × 0.2 = 0.06." },
  "d7-shift-way": { label: "Moves the point the wrong way", detail: "Moves the point left when multiplying by 10, or right when dividing.", childTip: "× 10, 100, 1000: the number gets bigger, point moves right. ÷: smaller, point moves left." },
  "d7-shift-count": { label: "Moves the point the wrong number of places", detail: "Moves it 2 places for × 1000.", childTip: "One place for each zero: × 1000 moves the point 3 places." },
  "d7-div-decimal": { label: "Divides by a decimal wrongly", detail: "Doesn't make the divisor a whole number first.", childTip: "Multiply both numbers by 10 (or 100) until the divisor is whole: 4.8 ÷ 0.6 = 48 ÷ 6 = 8." },
};
const r = (x: number) => String(Math.round(x * 1e6) / 1e6);

export const DECIMALS_G7: Record<string, Template> = {
  "concrete|remember": (rng) => {
    const t = int(rng, 1, 9), k = int(rng, 2, 9);
    return K.shade("remember", "decimal × whole number", rng, { t, k }, `Each square is 0.1. Shade 0.${t} × ${k}.`, 10, 10, t * k, "1 square = 0.1", [[t + k, "d7-point-places"], [t, "d7-shift-count"]]);
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 1, 9), b = int(rng, 1, 9);
    return K.shade("understand", "decimal × decimal", rng, { a, b }, `The whole grid is 1. Shade 0.${a} × 0.${b}.`, 10, 10, a * b, "1 square = 0.01", [[a + b, "d7-point-places"], [a * b * 10 <= 100 ? a * b * 10 : 0, "d7-point-places"]]);
  },
  "concrete|apply": (rng) => {
    const x = int(rng, 11, 99) / 10, p = pick(rng, [10, 100, 1000]);
    return K.order("apply", "× 10, 100, 1000", rng, { x: x * 10, p }, `Build: ${r(x)} × ${p}`, `${r(x)} | × | ${p} | = | ${r(x * p)}`, [r(x / p)], [[`${r(x)} × ${p} = ${r(x / p)}`, "d7-shift-way"]]);
  },
  "concrete|analyze": (rng) => {
    const q = int(rng, 2, 9), d = int(rng, 2, 9);
    const n = (q * d) / 10;
    return K.order("analyze", "dividing by a decimal", rng, { q, d }, `Build: ${r(n)} ÷ 0.${d}`, `${r(n)} | ÷ | 0.${d} | = | ${q}`, [r(q / 10)], [[`${r(n)} ÷ 0.${d} = ${r(q / 10)}`, "d7-div-decimal"]]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 2, 9), b = int(rng, 2, 9);
    const wrong = r((a * b) / 10);
    return K.tap("evaluate", "checking a product", rng, { a, b }, "One number in this working is wrong. Tap it.", `0.${a} × 0.${b} = ${wrong}`, wrong);
  },
  "pictorial|remember": (rng) => {
    const n = int(rng, 1, 99);
    return K.mc("pictorial", "remember", "decimals on a grid", rng, { n }, "The whole grid is 1. What decimal is shaded?", { kind: "grid", rows: 10, cols: 10, shadedCells: n }, r(n / 100), [[String(n), "d7-shift-count"], [r(n / 10), "d7-shift-count"], [r((100 - n) / 100), "d7-point-places"]]);
  },
  "pictorial|understand": (rng) => {
    const t = int(rng, 1, 9), k = int(rng, 2, 5);
    return K.mc("pictorial", "understand", "repeated decimal", rng, { t, k }, `Each bar part is 0.${t}. How long is the whole bar?`, { kind: "bars", bars: [{ name: "", parts: Array.from({ length: k }, () => ({ value: 1, label: `0.${t}` })) }] }, r((t * k) / 10), [[`0.${t * k}`, "d7-point-places"], [r(t * k), "d7-shift-count"], [r((t + k) / 10), "d7-point-places"]]);
  },
  "pictorial|apply": (rng) => {
    const price = int(rng, 15, 95) / 10, q = int(rng, 3, 9);
    return K.mc("pictorial", "apply", "money", rng, { p: price * 10, q }, `One notebook costs ₹${r(price)}. What do ${q} cost?`, card([`1 notebook: ₹${r(price)}`, `${q} notebooks: ₹ ___`], "Price list"), `₹${r(price * q)}`, [[`₹${r((price * q) / 10)}`, "d7-point-places"], [`₹${r(price + q)}`, "d7-point-places"], [`₹${r(price * q * 10)}`, "d7-shift-count"]]);
  },
  "pictorial|analyze": (rng) => {
    const L = int(rng, 12, 48), parts = pick(rng, [4, 5, 8]);
    const len = L / parts;
    return K.mc("pictorial", "analyze", "sharing a length", rng, { L, parts }, `A ribbon ${L} m long is cut into ${parts} equal pieces. How long is each?`, { kind: "bars", bars: [{ name: "ribbon", parts: Array.from({ length: parts }, () => ({ value: 1, label: "?" })) }], brace: { label: `${L} m` } }, `${r(len)} m`, [[`${r(len * 10)} m`, "d7-shift-count"], [`${r(L * parts)} m`, "d7-div-decimal"], [`${r(len / 10)} m`, "d7-shift-count"]]);
  },
  "pictorial|evaluate": (rng) => {
    const x = int(rng, 11, 99) / 100, p = pick(rng, [10, 100]);
    const right = rng() < 0.5;
    const said = `${r(x)} ÷ ${p} = ${right ? r(x / p) : r(x * p)}`;
    return K.mc("pictorial", "evaluate", "checking division", rng, { x: x * 100, p, r: right ? 1 : 0 }, "Is Riya right?", card([`Riya: ${said}`]), right ? "Yes: dividing moves the point to the left" : "No: dividing moves the point left, not right", [
      [right ? "No: dividing moves the point left, not right" : "Yes: dividing moves the point to the left", "d7-shift-way"],
      ["No: the point doesn't move when dividing", "d7-shift-way"],
      ["Yes: dividing always makes a number bigger", "d7-shift-way"],
    ]);
  },
  "abstract|remember": (rng) => {
    const x = int(rng, 101, 999) / 100, p = pick(rng, [10, 100, 1000]);
    return K.mc("abstract", "remember", "× 10, 100, 1000", rng, { x: x * 100, p }, `${r(x)} × ${p} = ?`, null, r(x * p), [[r(x / p), "d7-shift-way"], [r(x * p * 10), "d7-shift-count"], [r(x * (p / 10)), "d7-shift-count"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 11, 99) / 10, b = int(rng, 2, 9) / 10;
    return K.mc("abstract", "understand", "decimal × decimal", rng, { a: a * 10, b: b * 10 }, `${r(a)} × ${r(b)} = ?`, null, r(a * b), [[r(a * b * 10), "d7-point-places"], [r(a * b / 10), "d7-point-places"], [r(a + b), "d7-point-places"]]);
  },
  "abstract|apply": (rng) => {
    const q = int(rng, 12, 98) / 10, k = int(rng, 2, 9);
    const n = q * k;
    return K.mc("abstract", "apply", "decimal ÷ whole number", rng, { q: q * 10, k }, `${r(n)} ÷ ${k} = ?`, null, r(q), [[r(q * 10), "d7-shift-count"], [r(q / 10), "d7-shift-count"], [r(n - k), "d7-div-decimal"]]);
  },
  "abstract|analyze": (rng) => {
    const q = int(rng, 2, 40), d = int(rng, 2, 9) / 10;
    const n = q * d;
    return K.mc("abstract", "analyze", "decimal ÷ decimal", rng, { q, d: d * 10 }, `${r(n)} ÷ ${r(d)} = ?`, null, String(q), [[r(q / 10), "d7-div-decimal"], [r(q * 10), "d7-div-decimal"], [r(n * d), "d7-div-decimal"]]);
  },
  "abstract|evaluate": (rng) => {
    const x = int(rng, 11, 999) / 100;
    return K.mc("abstract", "evaluate", "÷ 1000", rng, { x: x * 100 }, `${r(x)} ÷ 1000 = ?`, null, r(x / 1000), [[r(x * 1000), "d7-shift-way"], [r(x / 100), "d7-shift-count"], [r(x / 10000), "d7-shift-count"]]);
  },
};
