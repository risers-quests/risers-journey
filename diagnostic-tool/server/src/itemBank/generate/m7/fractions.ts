import { Template, gcd, int } from "../core.js";
import { Misconceptions, card, kit } from "./kit.js";

/** Grade 7 Maths, Chapter 2: Fractions (types, the four operations, 'of', reciprocals, word problems). */
const K = kit("frc7", "g7-fractions");
export const MISCONCEPTIONS: Misconceptions = {
  "f7-add-across": { label: "Adds tops and bottoms", detail: "Writes 1/2 + 1/3 = 2/5.", childTip: "Make the denominators the same first: 1/2 + 1/3 = 3/6 + 2/6 = 5/6." },
  "f7-mult-denom": { label: "Multiplies only the numerator (or keeps the denominator)", detail: "Writes 2/3 × 4/5 = 8/5 or 8/3.", childTip: "Multiply tops together and bottoms together: 2/3 × 4/5 = 8/15." },
  "f7-div-flip": { label: "Doesn't flip the divisor", detail: "Divides tops and bottoms, or flips the wrong fraction.", childTip: "Dividing by a fraction is multiplying by its reciprocal: 2/3 ÷ 4/5 = 2/3 × 5/4." },
  "f7-reciprocal": { label: "Gets the reciprocal wrong", detail: "Gives the same fraction or its negative.", childTip: "The reciprocal turns the fraction upside down: 3/7 → 7/3. Their product is 1." },
  "f7-type": { label: "Mixes up kinds of fractions", detail: "Calls 7/4 proper, or 3/8 improper.", childTip: "Proper: top < bottom. Improper: top ≥ bottom. Mixed: a whole number and a proper fraction." },
  "f7-of": { label: "Misreads 'of'", detail: "Divides or adds instead of multiplying for 'of'.", childTip: "'of' means multiply: 3/4 of 20 = 3/4 × 20 = 15." },
  "f7-simplify": { label: "Doesn't simplify", detail: "Leaves 6/8 instead of 3/4.", childTip: "Divide top and bottom by their highest common factor." },
};
const f = (n: number, d: number) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
const raw = (n: number, d: number) => `${n}/${d}`;

export const FRACTIONS_G7: Record<string, Template> = {
  "concrete|remember": (rng) => {
    const d = [4, 5, 8, 10][int(rng, 0, 3)], n = int(rng, 1, d - 1), w = 2;
    return K.shade("remember", "fraction of a set", rng, { n, d }, `This grid has ${d * w} squares. Shade ${raw(n, d)} of it.`, w, d, n * w, "", [[n, "f7-of"], [d * w - n * w, "f7-type"]]);
  },
  "concrete|understand": (rng) => {
    const d = [3, 4, 5, 6][int(rng, 0, 3)], n = int(rng, 1, d - 1), k = int(rng, 2, 4);
    const total = d * k;
    return K.shade("understand", "a fraction of a number", rng, { n, d, k }, `${raw(n, d)} of ${total} = ? Shade that many squares.`, Math.ceil(total / 6) , 6, n * k, "", [[n, "f7-of"], [total - n * k, "f7-type"], [Math.round(total / n), "f7-of"]]);
  },
  "concrete|apply": (rng) => {
    const d = [3, 4, 5][int(rng, 0, 2)], a = int(rng, 1, d - 1), b = int(rng, 1, d - 1);
    if (a + b >= d) return FRACTIONS_G7["concrete|apply"](rng);
    return K.shade("apply", "adding like fractions", rng, { d, a, b }, `Shade ${raw(a, d)} + ${raw(b, d)} of this grid of ${d * 4} squares.`, 4, d, (a + b) * 4, "", [[(a + b) * 2, "f7-add-across"], [a * 4, "f7-add-across"]]);
  },
  "concrete|analyze": (rng) => {
    const n = int(rng, 2, 9), d = int(rng, 2, 9);
    if (n === d) return FRACTIONS_G7["concrete|analyze"](rng);
    return K.order("analyze", "reciprocal", rng, { n, d }, `Build: ${raw(n, d)} × (its reciprocal) = 1`, `${raw(n, d)} | × | ${raw(d, n)} | = | 1`, [raw(n, d)], [[`${raw(n, d)} × ${raw(n, d)} = 1`, "f7-reciprocal"]]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 1, 4), b = int(rng, 2, 5), c = int(rng, 1, 4), d = int(rng, 2, 5);
    if (a >= b || c >= d || b === d) return FRACTIONS_G7["concrete|evaluate"](rng);
    const wrong = raw(a + c, b + d);
    return K.tap("evaluate", "checking a sum", rng, { a, b, c, d }, "One part of this working is wrong. Tap it.", `${raw(a, b)} + ${raw(c, d)} = ${wrong}`, wrong);
  },
  "pictorial|remember": (rng) => {
    const slices = [4, 6, 8][int(rng, 0, 2)], sh = int(rng, 1, slices - 1);
    return K.mc("pictorial", "remember", "naming a fraction", rng, { slices, sh }, "What fraction of the pizza is coloured?", { kind: "pie", pies: [{ slices, shaded: sh }] }, f(sh, slices), [[f(slices - sh, slices) === f(sh, slices) ? raw(sh, slices + 1) : f(slices - sh, slices), "f7-type"], [raw(slices, sh), "f7-reciprocal"], [raw(sh, slices + 2), "f7-type"]]);
  },
  "pictorial|understand": (rng) => {
    const slices = 4, whole = int(rng, 1, 2), sh = int(rng, 1, 3);
    const n = whole * slices + sh;
    const pies = [...Array(whole).fill({ slices, shaded: slices }), { slices, shaded: sh }];
    return K.mc("pictorial", "understand", "improper and mixed", rng, { whole, sh }, "How many pizzas are coloured, as an improper fraction?", { kind: "pie", pies }, raw(n, slices), [[raw(sh, slices), "f7-type"], [raw(slices, n), "f7-reciprocal"], [raw(n, slices * (whole + 1)), "f7-type"]]);
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 1, 3), b = int(rng, 1, 3);
    return K.mc("pictorial", "apply", "fraction of a fraction", rng, { a, b }, "The shaded part is what fraction of the whole rectangle?", { kind: "grid", rows: 4, cols: 4, cells: Array.from({ length: a * b }, (_, i) => Math.floor(i / b) * 4 + (i % b)) }, f(a * b, 16), [[raw(a + b, 8), "f7-add-across"], [raw(a * b, 4), "f7-mult-denom"], [f(16 - a * b, 16), "f7-type"]]);
  },
  "pictorial|analyze": (rng) => {
    const d = [4, 5, 6][int(rng, 0, 2)], n = int(rng, 1, d - 1), m = d * int(rng, 3, 8);
    return K.mc("pictorial", "analyze", "word problem with 'of'", rng, { d, n, m }, `A class has ${m} pupils. ${raw(n, d)} of them walk to school. How many walk?`, { kind: "bars", bars: [{ name: "pupils", parts: Array.from({ length: d }, (_, i) => ({ value: 1, label: i < n ? "walk" : "" })) }], brace: { label: String(m) } }, String((m / d) * n), [[String(m / d), "f7-of"], [String(m - (m / d) * n), "f7-type"], [String(m * n), "f7-of"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 1, 4), b = int(rng, 5, 9), c = int(rng, 1, 4), d = int(rng, 5, 9);
    const right = rng() < 0.5;
    const said = right ? `${raw(a, b)} ÷ ${raw(c, d)} = ${raw(a, b)} × ${raw(d, c)}` : `${raw(a, b)} ÷ ${raw(c, d)} = ${raw(b, a)} × ${raw(c, d)}`;
    return K.mc("pictorial", "evaluate", "checking division", rng, { a, b, c, d, r: right ? 1 : 0 }, "Is Riya's first step right?", card([`Riya: ${said}`]), right ? "Yes: multiply by the reciprocal of the divisor" : "No: flip the divisor, not the first fraction", [
      [right ? "No: flip the divisor, not the first fraction" : "Yes: multiply by the reciprocal of the divisor", "f7-div-flip"],
      ["No: divide tops and bottoms straight across", "f7-div-flip"],
      ["Yes: either fraction can be flipped", "f7-div-flip"],
    ]);
  },
  "abstract|remember": (rng) => {
    const n = int(rng, 2, 9), d = int(rng, 2, 9);
    if (n === d) return FRACTIONS_G7["abstract|remember"](rng);
    return K.mc("abstract", "remember", "reciprocal", rng, { n, d }, `The reciprocal of ${raw(n, d)} is ___`, null, raw(d, n), [[raw(n, d), "f7-reciprocal"], [`−${raw(n, d)}`, "f7-reciprocal"], [`1 ${raw(n, d)}`, "f7-reciprocal"]]);
  },
  "abstract|understand": (rng) => {
    const b = int(rng, 2, 6), d = int(rng, 2, 6), a = int(rng, 1, b - 1), c = int(rng, 1, d - 1);
    if (b === d) return FRACTIONS_G7["abstract|understand"](rng);
    return K.mc("abstract", "understand", "adding unlike fractions", rng, { a, b, c, d }, `${raw(a, b)} + ${raw(c, d)} = ?`, null, f(a * d + c * b, b * d), [[raw(a + c, b + d), "f7-add-across"], [raw(a + c, b * d), "f7-add-across"], [raw(a * d + c * b, b * d) === f(a * d + c * b, b * d) ? raw(a * c, b * d) : raw(a * d + c * b, b * d), "f7-simplify"]]);
  },
  "abstract|apply": (rng) => {
    const b = int(rng, 2, 9), d = int(rng, 2, 9), a = int(rng, 1, b - 1), c = int(rng, 1, d - 1);
    return K.mc("abstract", "apply", "multiplying", rng, { a, b, c, d }, `${raw(a, b)} × ${raw(c, d)} = ? (simplest form)`, null, f(a * c, b * d), [[f(a * c, b + d), "f7-mult-denom"], [f(a * c, b), "f7-mult-denom"], [f(a * d + c * b, b * d), "f7-add-across"]]);
  },
  "abstract|analyze": (rng) => {
    const b = int(rng, 2, 9), d = int(rng, 2, 9), a = int(rng, 1, b - 1), c = int(rng, 1, d - 1);
    if ([f(a, b), f(c, d)].includes(f(a * d, b * c))) throw new Error("answer shown in the question");
    return K.mc("abstract", "analyze", "dividing", rng, { a, b, c, d }, `${raw(a, b)} ÷ ${raw(c, d)} = ? (simplest form)`, null, f(a * d, b * c), [[f(a * c, b * d), "f7-div-flip"], [f(b * c, a * d), "f7-div-flip"], [f(b * d, a * c), "f7-div-flip"]]);
  },
  "abstract|evaluate": (rng) => {
    const w = int(rng, 1, 4), n = int(rng, 1, 3), d = 4, k = int(rng, 2, 6);
    const top = (w * d + n) * k;
    return K.mc("abstract", "evaluate", "mixed × whole", rng, { w, n, k }, `${w} ${raw(n, d)} × ${k} = ? (simplest form)`, null, f(top, d), [[f(w * k * d + n, d), "f7-mult-denom"], [f((w * d + n), d * k), "f7-mult-denom"], [f(w * k * d + n * k + d, d), "f7-type"]]);
  },
};
