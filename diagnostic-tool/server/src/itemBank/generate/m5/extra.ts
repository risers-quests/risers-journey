import { Rng, Template, fmt, int, pick } from "../core.js";
import { Misconceptions, card, kit, noEcho, safe } from "../m7/kit.js";

/**
 * Grade 5 additions to Chapters 1 and 2 (CPA Maths 5): the Indian and the
 * international system of numeration, Roman numerals (recall, sum and
 * difference), averages, and properties of the four operations. Mixed into
 * the existing More on Large Numbers / Operations on Large Numbers topics
 * at Grade 5 only (see generate/index.ts), so Grade 4 is unchanged.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "m5-intl": { label: "Mixes up the Indian and international systems", detail: "Puts commas in the wrong places, or thinks 1 million = 1 lakh.", childTip: "Indian: 3 digits, then 2 at a time (10,00,000 = ten lakh). International: 3 at a time (1,000,000 = one million). 1 million = 10 lakh; 10 million = 1 crore." },
  "m5-roman": { label: "Reads or writes Roman numerals wrongly", detail: "Writes IIII for 4, or reads IX as 11.", childTip: "I 1, V 5, X 10, L 50, C 100, D 500, M 1000. A smaller letter before a bigger one is subtracted (IX = 9); after it is added (XI = 11). No letter repeats more than 3 times." },
  "m5-average": { label: "Finds the average wrongly", detail: "Divides by the wrong count, or forgets to add all the values first.", childTip: "Average = sum of all the values ÷ how many values there are." },
  "m5-property": { label: "Misremembers a property of operations", detail: "Thinks subtraction or division can be done in any order, or that a × 0 = a.", childTip: "Addition and multiplication: order doesn't matter. Subtraction and division: it does. a + 0 = a, a × 1 = a, a × 0 = 0, a ÷ 1 = a." },
};

const intl = (n: number) => n.toLocaleString("en-US");
const R: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
export const roman = (n: number) => { let s = ""; for (const [v, r] of R) while (n >= v) { s += r; n -= v; } return s; };
const naive = (n: number) => { let s = ""; for (const [v, r] of R.filter(([, r]) => r.length === 1)) while (n >= v) { s += r; n -= v; } return s; };

// ---------------- Chapter 1 additions ----------------
const LN = kit("ln5x", "more-large-numbers");
export const LARGE_EXTRA_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const n = int(rng, 1, 9) * 1000000 + int(rng, 101, 999) * 1000 + int(rng, 101, 999);
    const m = Math.floor(n / 1000000), th = Math.floor((n % 1000000) / 1000), o = n % 1000;
    return LN.order("remember", "reading the international system", rng, { n }, `Build the international name of ${intl(n)}.`, `${m} million | ${th} thousand | ${o}`, [`${Math.floor(n / 100000)} lakh`], [[`${Math.floor(n / 100000)} lakh ${th} thousand ${o}`, "m5-intl"]]);
  },
  "concrete|understand": (rng) => {
    const n = int(rng, 11, 99);
    return LN.tap("understand", "Roman numerals", rng, { n }, `Tap ${n} in Roman numerals.`, [roman(n), naive(n), roman(n + 10), roman(n - 1)].filter((x, i, a) => a.indexOf(x) === i).sort(() => rng() - 0.5).join("   "), roman(n), naive(n) !== roman(n) ? [{ phrase: naive(n), mistake: "m5-roman" }] : []);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 10, 60), b = int(rng, 5, 39);
    return LN.order("apply", "adding Roman numerals", rng, { a, b }, "Build the sum in Roman numerals.", `${roman(a)} + ${roman(b)} | = | ${roman(a + b)}`, [naive(a + b) !== roman(a + b) ? naive(a + b) : roman(a + b + 1)], [[`${roman(a)} + ${roman(b)} = ${naive(a + b) !== roman(a + b) ? naive(a + b) : roman(a + b + 1)}`, "m5-roman"]]);
  },
  "concrete|analyze": (rng) => {
    const m = int(rng, 1, 9);
    const line = [`${m} million`, `${m} lakh`, `${m * 10} million`, `${m} crore`].join("   ");
    return LN.tap("analyze", "lakhs and millions", rng, { m }, `${m * 10} lakh is the same as … Tap it.`, line, `${m} million`, [{ phrase: `${m} lakh`, mistake: "m5-intl" }]);
  },
  "concrete|evaluate": (rng) => {
    const n = int(rng, 1000000, 9999999);
    const indian = fmt(n);
    return LN.tap("evaluate", "check the commas", rng, { n }, "This should be in the international system. Tap the number that is grouped the Indian way.", `International: ${indian}`, indian);
  },
  "pictorial|remember": (rng) => {
    const n = int(rng, 1000000, 9999999);
    return LN.mc("pictorial", "remember", "international system", rng, { n }, "How is this number written in the international system?", card([`Indian system: ${fmt(n)}`]), intl(n), [[fmt(n) + " ", "m5-intl"], [String(n).replace(/(\d)(?=(\d{2})+$)/g, "$1,"), "m5-intl"], [intl(n * 10), "m5-intl"]].map(([t, m]) => [t.trim(), m]) as [string, string][]);
  },
  "pictorial|understand": (rng) => {
    const n = int(rng, 1000000, 9999999);
    const mil = Math.floor(n / 1000000), th = Math.floor((n % 1000000) / 1000);
    return LN.mc("pictorial", "understand", "reading international numbers", rng, { n }, "How do you read this number in the international system?", card([intl(n)]), `${mil} million ${th} thousand ${n % 1000}`, [[`${mil} lakh ${th} thousand ${n % 1000}`, "m5-intl"], [`${Math.floor(n / 100000)} lakh ${Math.floor((n % 100000) / 1000)} thousand ${n % 1000}`, "m5-intl"], [`${mil} crore ${th} thousand ${n % 1000}`, "m5-intl"]]);
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 50, 900), b = int(rng, 10, 99);
    if (a <= b) throw new Error("order");
    return LN.mc("pictorial", "apply", "subtracting Roman numerals", rng, { a, b }, "What is the difference, in Roman numerals?", card([`${roman(a)} − ${roman(b)}`]), roman(a - b), [[naive(a - b) !== roman(a - b) ? naive(a - b) : roman(a - b + 10), "m5-roman"], [roman(a + b), "m3-op"], [roman(a - b + 1), "m5-roman"]]);
  },
  "pictorial|analyze": (rng) => {
    const n = int(rng, 40, 999);
    return LN.mc("pictorial", "analyze", "reading Roman numerals", rng, { n }, "What number is this?", card([roman(n)]), String(n), [[String(n + 2 * (roman(n).includes("IX") || roman(n).includes("IV") ? 1 : 10)), "m5-roman"], [String(n + 10), "m5-roman"], [String(n - 1), "m5-roman"]].filter(([t]) => t !== String(n)) as [string, string][]);
  },
  "pictorial|evaluate": (rng) => {
    const n = pick(rng, [4, 9, 40, 90, 14, 19, 49, 99]);
    const right = rng() < 0.5;
    return LN.mc("pictorial", "evaluate", "judge a claim", rng, { n, r: right ? 1 : 0 }, "Is Riya right?", card([`Riya: ${n} in Roman numerals is ${right ? roman(n) : naive(n)}.`]), right ? "Yes: a smaller letter before a bigger one is subtracted" : "No: a letter can't repeat 4 times; use subtraction", [
      [right ? "No: the letters should be repeated" : "Yes: just repeat the letters", "m5-roman"],
      ["No: Roman numerals can't show that number", "m5-roman"],
      ["Yes: any order works", "m5-roman"],
    ]);
  },
  "abstract|remember": (rng) => {
    const i = int(rng, 0, 3);
    const q: [string, string, string[]][] = [["In Roman numerals, L stands for ___", "50", ["5", "100", "500"]], ["In Roman numerals, D stands for ___", "500", ["50", "1000", "100"]], ["1 million = ___ lakh", "10", ["1", "100", "1000"]], ["1 crore = ___ million", "10", ["1", "100", "1000"]]];
    return LN.mc("abstract", "remember", "facts", rng, { i }, q[i][0], null, q[i][1], q[i][2].map((t) => [t, i < 2 ? "m5-roman" : "m5-intl"] as [string, string]));
  },
  "abstract|understand": (rng) => {
    const n = int(rng, 100, 2500);
    return LN.mc("abstract", "understand", "writing Roman numerals", rng, { n }, `${n} in Roman numerals is ___`, null, roman(n), [[naive(n) !== roman(n) ? naive(n) : roman(n + 1), "m5-roman"], [roman(n + 10), "m5-roman"], [roman(n - 100 > 0 ? n - 100 : n + 100), "m5-roman"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 20, 400), b = int(rng, 20, 400);
    return LN.mc("abstract", "apply", "Roman sum", rng, { a, b }, `${roman(a)} + ${roman(b)} = ___`, null, roman(a + b), [[naive(a + b) !== roman(a + b) ? naive(a + b) : roman(a + b - 1), "m5-roman"], [roman(Math.abs(a - b) || 1), "m3-op"], [roman(a + b + 10), "m5-roman"]]);
  },
  "abstract|analyze": (rng) => {
    const m = int(rng, 2, 99);
    return LN.mc("abstract", "analyze", "millions to lakhs", rng, { m }, `${m} million = ___`, null, `${fmt(m * 10)} lakh`, [[`${m} lakh`, "m5-intl"], [`${fmt(m * 100)} lakh`, "m5-intl"], [`${m} crore`, "m5-intl"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 1000000, 9999999), b = a + pick(rng, [-1, 1]) * int(rng, 100000, 900000);
    return LN.mc("abstract", "evaluate", "comparing across systems", rng, { a, b }, `Which is bigger: ${fmt(a)} (Indian) or ${intl(b)} (international)?`, null, a > b ? fmt(a) : intl(b), [[a > b ? intl(b) : fmt(a), "m5-intl"], ["They are equal", "m5-intl"], ["You can't compare different systems", "m5-intl"]]);
  },
}));

// ---------------- Chapter 2 additions: averages and properties ----------------
const OP = kit("op5x", "operations-large-numbers");
const vals = (rng: Rng, n: number, lo: number, hi: number) => {
  for (;;) {
    const v = Array.from({ length: n }, () => int(rng, lo, hi));
    if (v.reduce((x, y) => x + y, 0) % n === 0) return v;
  }
};
export const OPS_EXTRA_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const v = vals(rng, 3, 2, 9);
    const avg = v.reduce((x, y) => x + y, 0) / 3;
    return OP.shade("remember", "average as levelling", rng, { a: v[0], b: v[1], c: v[2] }, `Three towers have ${v.join(", ")} blocks. Make them level: shade the height of one levelled tower.`, 2, 9, avg, "1 square = 1 block", [[Math.max(...v), "m5-average"], [Math.min(18, v[0] + v[1] + v[2]), "m5-average"]]);
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 12, 99), b = int(rng, 12, 99);
    if (a === b) throw new Error("same");
    return OP.tap("understand", "order property", rng, { a, b }, `${a} × ${b} = ${b} × ___  Tap the missing number.`, [a, b, a * b, a + b].map(String).sort(() => rng() - 0.5).join("   "), String(a), [{ phrase: String(b), mistake: "m5-property" }]);
  },
  "concrete|apply": (rng) => {
    const v = vals(rng, 4, 10, 60);
    const s = v.reduce((x, y) => x + y, 0);
    return OP.order("apply", "finding an average", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `Find the average of ${v.join(", ")}.`, `${s} | ÷ | 4 | = | ${s / 4}`, ["3", String(s / 3 | 0)], [[`${s} ÷ 3 = ${s / 3 | 0}`, "m5-average"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 100, 999);
    const k = int(rng, 0, 2);
    const q = [`${a} × 0`, `${a} ÷ 1`, `${a} + 0`][k];
    const ans = ["0", String(a), String(a)][k];
    const line = ["0", "1", String(a), String(a + 1)].join("   ");
    return OP.tap("analyze", "properties with 0 and 1", rng, { a, k }, `Tap the value of ${q}.`, line, ans, [{ phrase: k === 0 ? String(a) : "0", mistake: "m5-property" }]);
  },
  "concrete|evaluate": (rng) => {
    const v = vals(rng, 5, 10, 40);
    const s = v.reduce((x, y) => x + y, 0);
    return OP.tap("evaluate", "check an average", rng, { a: v[0], b: v[1], c: v[2], d: v[3], e: v[4] }, "One number in this working is wrong. Tap it.", `Average of ${v.join(", ")} = ${s} ÷ 4`, "4");
  },
  "pictorial|remember": (rng) => {
    const v = vals(rng, 4, 20, 90);
    const s = v.reduce((x, y) => x + y, 0);
    return OP.mc("pictorial", "remember", "average from a table", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, "What is the average score?", card(v.map((x, i) => `Test ${i + 1}: ${x}`), "Riya's scores"), String(s / 4), [[String(s), "m5-average"], [String(Math.round(s / 3)), "m5-average"], [String(Math.max(...v)), "m5-average"]]);
  },
  "pictorial|understand": (rng) => {
    const v = vals(rng, 5, 100, 400);
    const s = v.reduce((x, y) => x + y, 0);
    return OP.mc("pictorial", "understand", "average word problem", rng, { a: v[0], b: v[1], c: v[2], d: v[3], e: v[4] }, "What was the average number of visitors per day?", card(["Mon–Fri visitors:", v.join(", ")]), String(s / 5), [[String(s), "m5-average"], [String(Math.round(s / 7)), "m5-average"], [String((Math.max(...v) + Math.min(...v)) / 2), "m5-average"]]);
  },
  "pictorial|apply": (rng) => {
    const avg = int(rng, 20, 60), n = int(rng, 3, 6);
    return OP.mc("pictorial", "apply", "total from an average", rng, { avg, n }, "How many runs did the batter score in all?", card([`${n} matches`, `Average: ${avg} runs per match`]), String(avg * n), [[String(avg), "m5-average"], [String(avg + n), "m5-average"], [String(Math.round(avg / n)), "m5-average"]]);
  },
  "pictorial|analyze": (rng) => {
    const a = int(rng, 1000, 9999), b = int(rng, 1000, 9999);
    if (a === b) throw new Error("same");
    return OP.mc("pictorial", "analyze", "which property", rng, { a, b }, "Which property does this show?", card([`${fmt(a)} + ${fmt(b)} = ${fmt(b)} + ${fmt(a)}`]), "Order (commutative) property of addition", [["Subtraction can be done in any order", "m5-property"], ["Adding 0 changes nothing", "m5-property"], ["Multiplying by 1 changes nothing", "m5-property"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 100, 999), b = int(rng, 10, 99);
    const right = rng() < 0.5;
    return OP.mc("pictorial", "evaluate", "judge a claim", rng, { a, b, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${a} × ${b} = ${b} × ${a}` : `Riya: ${a} − ${b} = ${b} − ${a}`]), right ? "Yes: order doesn't matter in multiplication" : "No: order matters in subtraction", [
      [right ? "No: order always matters" : "Yes: order never matters", "m5-property"],
      ["No: both sides are always 0", "m5-property"],
      ["Yes: every operation works in any order", "m5-property"],
    ]);
  },
  "abstract|remember": (rng) => {
    const i = int(rng, 0, 1);
    return OP.mc("abstract", "remember", "meaning of average", rng, { i }, i ? "To find an average, divide the total by ___" : "Average = ___", null, i ? "the number of values" : "sum of the values ÷ number of values", i ? [["the biggest value", "m5-average"], ["2", "m5-average"], ["the total again", "m5-average"]] : [["biggest value − smallest value", "m5-average"], ["sum of the values × number of values", "m5-average"], ["the middle value only", "m5-average"]]);
  },
  "abstract|understand": (rng) => {
    const v = vals(rng, 4, 11, 99);
    const s = v.reduce((x, y) => x + y, 0);
    return OP.mc("abstract", "understand", "finding an average", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `The average of ${v.join(", ")} is ___`, null, String(s / 4), [[String(s), "m5-average"], [String(Math.round(s / 3)), "m5-average"], [String(s / 2), "m5-average"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 1000, 9999), k = int(rng, 0, 2);
    const q = [`${fmt(a)} × 1 = ___`, `${fmt(a)} − 0 = ___`, `0 ÷ ${fmt(a)} = ___`][k];
    const ans = [fmt(a), fmt(a), "0"][k];
    return OP.mc("abstract", "apply", "properties with 0 and 1", rng, { a, k }, q, null, ans, [["0", "m5-property"], ["1", "m5-property"], [fmt(a), "m5-property"], [fmt(a + 1), "m5-property"]]);
  },
  "abstract|analyze": (rng) => {
    const n = int(rng, 4, 6), avg = int(rng, 30, 70), extra = int(rng, 10, 40);
    const newAvg = (avg * n + avg + extra * (n + 1)) / (n + 1);
    if (!Number.isInteger(newAvg)) throw new Error("not whole");
    const x = newAvg * (n + 1) - avg * n;
    return OP.mc("abstract", "analyze", "missing value from an average", rng, { n, avg, x }, `The average of ${n} numbers is ${avg}. One more number makes the average ${newAvg}. What is the new number?`, null, String(x), [[String(newAvg), "m5-average"], [String(newAvg - avg), "m5-average"], [String(newAvg * (n + 1)), "m5-average"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 20, 99), b = int(rng, 2, 9), c = int(rng, 2, 9);
    return OP.mc("abstract", "evaluate", "grouping property", rng, { a, b, c }, `(${a} × ${b}) × ${c} = ${a} × (${b} × ___)`, null, String(c), [[String(a), "m5-property"], [String(b * c), "m5-property"], [String(a * b), "m5-property"]]);
  },
}));
