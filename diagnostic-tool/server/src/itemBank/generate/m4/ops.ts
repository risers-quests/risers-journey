import { Template, fmt, int, pick } from "../core.js";
import { card, kit, safe } from "../m7/kit.js";

/**
 * Grade 4 Maths (CPA Maths 4), Chapters 2–4 as separate topics:
 * Addition and Subtraction (up to 6 digits, estimating), Multiplication
 * (×10…10 000, properties, tables of 11–15, grid method, 3- and 4-digit
 * products, estimating), Division (÷10, 100, 1000; 3-digit ÷ 2-digit;
 * 4-digit ÷ 1- and 2-digit; properties; estimating). Numbers stay below
 * 10,00,000 (the book's range). Mistake names are the Grade 3 ones (m3-…).
 */
const noCarry = (a: number, b: number) => Number(String(a).padStart(6, "0").split("").map((x, i) => (Number(x) + Number(String(b).padStart(6, "0")[i])) % 10).join(""));
const smallFromLarge = (a: number, b: number) => Number(String(a).padStart(6, "0").split("").map((x, i) => Math.abs(Number(x) - Number(String(b).padStart(6, "0")[i]))).join(""));
const r100 = (n: number) => Math.round(n / 100) * 100;
const r1000 = (n: number) => Math.round(n / 1000) * 1000;

// ---------------- Chapter 2: Addition and Subtraction ----------------
const AS = kit("as4", "g4-addsub");
export const ADDSUB_G4: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const a = int(rng, 15, 55), b = int(rng, 15, 40);
    if ((a % 10) + (b % 10) < 10 || a + b > 90) throw new Error("no carry");
    return AS.shade("remember", "adding with regrouping", rng, { a, b }, `Each square is 1,000. Shade ${fmt(a * 1000)} + ${fmt(b * 1000)}.`, 9, 10, a + b, "1 square = 1,000", [[a + b - 10, "m3-carry"], [noCarry(a, b), "m3-carry"]]);
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 51, 90), b = int(rng, 12, 45);
    if (a % 10 >= b % 10) throw new Error("no borrow");
    return AS.shade("understand", "subtracting with regrouping", rng, { a, b }, `Each square is 1,000. Shade what is left: ${fmt(a * 1000)} − ${fmt(b * 1000)}.`, 9, 10, a - b, "1 square = 1,000", [[smallFromLarge(a, b), "m3-borrow"], [a + b <= 90 ? a + b : -1, "m3-op"]]);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 100000, 500000), b = int(rng, 100000, 400000);
    const s = a + b, w = noCarry(a, b) === s ? s + 1000 : noCarry(a, b);
    return AS.order("apply", "6-digit addition", rng, { a, b }, `Build the addition of ${fmt(a)} and ${fmt(b)}.`, `${fmt(a)} | + | ${fmt(b)} | = | ${fmt(s)}`, [fmt(w)], [[`${fmt(a)} + ${fmt(b)} = ${fmt(w)}`, "m3-carry"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 12000, 88000), b = int(rng, 11000, 60000);
    if (a % 1000 === 500 || b % 1000 === 500) throw new Error("tie");
    const est = r1000(a) + r1000(b);
    const line = [est, est + 1000, est - 1000, r100(a) + r100(b)].map(fmt);
    if (new Set(line).size < 4) throw new Error("dup");
    return AS.tap("analyze", "estimating a sum", rng, { a, b }, `Estimate ${fmt(a)} + ${fmt(b)} by rounding each to the nearest thousand. Tap the estimate.`, line.sort(() => rng() - 0.5).join("   "), fmt(est), [{ phrase: fmt(r100(a) + r100(b)), mistake: "m3-round" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 400000, 900000), b = int(rng, 100000, 300000);
    const w = smallFromLarge(a, b);
    if (w === a - b) throw new Error("no borrow");
    return AS.tap("evaluate", "check a subtraction", rng, { a, b }, "One number in this working is wrong. Tap it.", `${fmt(a)} − ${fmt(b)} = ${fmt(w)}`, fmt(w));
  },
  "pictorial|remember": (rng) => {
    const a = int(rng, 10000, 99999), b = int(rng, 10000, 99999);
    return AS.mc("pictorial", "remember", "part-whole: the whole", rng, { a, b }, "What is the whole?", { kind: "bars", bars: [{ name: "", parts: [{ value: a, label: fmt(a) }, { value: b, label: fmt(b) }] }], brace: { label: "?" } }, fmt(a + b), [[fmt(Math.abs(a - b)), "m3-op"], [fmt(noCarry(a, b) === a + b ? a + b + 1000 : noCarry(a, b)), "m3-carry"], [fmt(a + b - 100), "m3-carry"]]);
  },
  "pictorial|understand": (rng) => {
    const w = int(rng, 200000, 900000), a = int(rng, 100000, w - 50000);
    if (w - a === a) throw new Error("coincidence");
    return AS.mc("pictorial", "understand", "part-whole: a missing part", rng, { w, a }, "What is the missing part?", { kind: "bars", bars: [{ name: "", parts: [{ value: a, label: fmt(a) }, { value: w - a, label: "?" }] }], brace: { label: fmt(w) } }, fmt(w - a), [[fmt(smallFromLarge(w, a) === w - a ? w - a + 1000 : smallFromLarge(w, a)), "m3-borrow"], [fmt(w - a + 10000), "m3-borrow"], [fmt(w - a - 100), "m3-borrow"]]);
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 120000, 480000), b = int(rng, 110000, 400000);
    return AS.mc("pictorial", "apply", "word problem", rng, { a, b }, "How many people visited in the two years altogether?", card([`2024: ${fmt(a)} visitors`, `2025: ${fmt(b)} visitors`], "A museum"), fmt(a + b), [[fmt(Math.abs(a - b)), "m3-op"], [fmt(noCarry(a, b) === a + b ? a + b + 10000 : noCarry(a, b)), "m3-carry"], [fmt(a + b - 1000), "m3-carry"]]);
  },
  "pictorial|analyze": (rng) => {
    const a = int(rng, 300000, 900000), b = int(rng, 100000, a - 50000);
    if (a - b === b) throw new Error("coincidence");
    return AS.mc("pictorial", "analyze", "how many more", rng, { a, b }, "How many more people live in Town A than in Town B?", { kind: "bars", bars: [{ name: "Town A", parts: [{ value: a, label: fmt(a) }] }, { name: "Town B", parts: [{ value: b, label: fmt(b) }, { value: a - b, label: "?", ghost: true }] }] }, fmt(a - b), [[fmt(a + b) , "m3-op"], [fmt(smallFromLarge(a, b) === a - b ? a - b + 1000 : smallFromLarge(a, b)), "m3-borrow"], [fmt(a - b + 10000), "m3-borrow"]].filter(([t]) => Number(t.replace(/,/g, "")) < 1000000) as [string, string][]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 21000, 89000), b = int(rng, 11000, 49000);
    if (a % 1000 === 500 || b % 1000 === 500) throw new Error("tie");
    const right = rng() < 0.5;
    const said = right ? r1000(a) - r1000(b) : r100(a) - r100(b) + 5000;
    if (!right && said === r1000(a) - r1000(b)) throw new Error("same");
    return AS.mc("pictorial", "evaluate", "judge an estimate", rng, { a, b, r: right ? 1 : 0 }, "Riya estimated the difference to the nearest thousand. Is she right?", card([`${fmt(a)} − ${fmt(b)}`, `Riya's estimate: ${fmt(said)}`]), right ? "Yes: she rounded each number to the nearest thousand first" : "No: rounding each to the nearest thousand gives a different estimate", [
      [right ? "No: rounding each to the nearest thousand gives a different estimate" : "Yes: she rounded each number to the nearest thousand first", "m3-round"],
      ["No: you can't estimate a difference", "m3-round"],
      ["Yes: any number close enough is fine", "m3-round"],
    ]);
  },
  "abstract|remember": (rng) => {
    const a = int(rng, 10000, 99999), b = int(rng, 10000, 99999);
    if (a === b) throw new Error("same");
    return AS.mc("abstract", "remember", "addition terms", rng, { a, b }, `In ${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}, the number ${fmt(a + b)} is the ___`, null, "sum", [["addend", "m3-op"], ["difference", "m3-op"], ["minuend", "m3-op"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 100000, 600000), b = int(rng, 100000, 350000);
    if (noCarry(a, b) === a + b) throw new Error("no carry");
    return AS.mc("abstract", "understand", "6-digit addition", rng, { a, b }, `${fmt(a)} + ${fmt(b)} = ___`, null, fmt(a + b), [[fmt(noCarry(a, b)), "m3-carry"], [fmt(a + b - 1000), "m3-carry"], [fmt(a - b), "m3-op"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 2, 9) * 100000 + int(rng, 0, 9), b = int(rng, 10000, 99999);
    return AS.mc("abstract", "apply", "subtracting across zeros", rng, { a, b }, `${fmt(a)} − ${fmt(b)} = ___`, null, fmt(a - b), [[fmt(smallFromLarge(a, b)), "m3-borrow"], [fmt(a - b + 100000), "m3-borrow"], [fmt(a - b - 10000), "m3-borrow"]]);
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 1200, 9800), b = int(rng, 1100, 8800);
    if (a % 100 === 50 || b % 100 === 50) throw new Error("tie");
    const est = r100(a) + r100(b);
    return AS.mc("abstract", "analyze", "estimate to the nearest hundred", rng, { a, b }, `Estimate ${fmt(a)} + ${fmt(b)} by rounding each to the nearest hundred.`, null, fmt(est), [[fmt(a + b), "m3-round"], [fmt(r1000(a) + r1000(b)), "m3-round"], [fmt(Math.floor(a / 100) * 100 + Math.floor(b / 100) * 100 === est ? est + 200 : Math.floor(a / 100) * 100 + Math.floor(b / 100) * 100), "m3-round"]]);
  },
  "abstract|evaluate": (rng) => {
    const have = int(rng, 300000, 900000), spent = int(rng, 100000, have - 100000), got = int(rng, 10000, 90000);
    const ans = have - spent + got;
    if ([have, spent, got].includes(ans) || ans >= 1000000) throw new Error("coincidence");
    return AS.mc("abstract", "evaluate", "two-step word problem", rng, { have, spent, got }, `A school had ₹${fmt(have)}. It spent ₹${fmt(spent)} on books and then received ₹${fmt(got)}. How much does it have now?`, null, `₹${fmt(ans)}`, [[`₹${fmt(have - spent - got)}`, "m3-op"], [`₹${fmt(have - spent)}`, "m3-op"], [`₹${fmt(ans + 10000)}`, "m3-carry"]]);
  },
});

// ---------------- Chapter 3: Multiplication ----------------
const MU = kit("mu4", "g4-mult");
export const MULT_G4: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const t = int(rng, 11, 15), k = int(rng, 2, 6);
    if (t * k > 90) throw new Error("big");
    return MU.shade("remember", "tables of 11 to 15", rng, { t, k }, `Shade ${k} rows of ${t}.`, 9, 10, t * k, "1 square = 1", [[t + k, "m3-table"], [t * (k - 1), "m3-table"]]);
  },
  "concrete|understand": (rng) => {
    const n = int(rng, 12, 99), p = pick(rng, [10, 100, 1000]);
    const line = [n * p, n * p * 10, n + p, n * (p / 10 || 1)].map(fmt);
    if (new Set(line).size < 4) throw new Error("dup");
    return MU.tap("understand", "multiplying by 10, 100, 1000", rng, { n, p }, `Tap ${n} × ${fmt(p)}.`, line.sort(() => rng() - 0.5).join("   "), fmt(n * p), [{ phrase: fmt(n * p * 10), mistake: "m3-place-mult" }]);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 21, 79), b = int(rng, 12, 39);
    const t = Math.floor(a / 10) * 10, o = a % 10;
    if (o === 0) throw new Error("zero");
    return MU.order("apply", "the grid method", rng, { a, b }, `Use the grid method: build ${a} × ${b}.`, `${t} × ${b} | + | ${o} × ${b} | = | ${fmt(a * b)}`, [fmt(t * b + o)], [[`${t} × ${b} + ${o} × ${b} = ${fmt(t * b + o)}`, "m3-place-mult"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 210, 890), b = int(rng, 21, 89);
    const est = Math.round(a / 100) * 100 * Math.round(b / 10) * 10;
    const line = [est, est * 10, est / 10, a * b].map(fmt);
    if (new Set(line).size < 4 || a % 100 === 50 || b % 10 === 5) throw new Error("dup");
    return MU.tap("analyze", "estimating a product", rng, { a, b }, `Estimate ${a} × ${b}: round ${a} to the nearest hundred and ${b} to the nearest ten. Tap the estimate.`, line.sort(() => rng() - 0.5).join("   "), fmt(est), [{ phrase: fmt(est * 10), mistake: "m3-place-mult" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 1012, 4999), b = int(rng, 3, 9);
    const w = (a % 10) * b % 10 + Math.floor(a / 10) * 10 * b;
    if (w === a * b) throw new Error("no carry");
    return MU.tap("evaluate", "check a product", rng, { a, b }, "One number in this working is wrong. Tap it.", `${fmt(a)} × ${b} = ${fmt(w)}`, fmt(w));
  },
  "pictorial|remember": (rng) => {
    const t = int(rng, 11, 15), k = int(rng, 3, 9);
    const markers = Array.from({ length: k + 1 }, (_, i) => ({ value: i * t, label: i === k ? "?" : String(i * t) }));
    return MU.mc("pictorial", "remember", "tables on the number line", rng, { t, k }, `${k} jumps of ${t} on the number line. Where do they land?`, { kind: "number-line", min: 0, max: t * (k + 1), step: t, markers }, String(t * k), [[String(t + k), "m3-table"], [String(t * (k + 1)), "m3-table"], [String(t * (k - 1)), "m3-table"]]);
  },
  "pictorial|understand": (rng) => {
    const a = int(rng, 21, 49), b = int(rng, 12, 29);
    const at = Math.floor(a / 10) * 10, ao = a % 10, bt = Math.floor(b / 10) * 10, bo = b % 10;
    if (!ao || !bo) throw new Error("zero");
    return MU.mc("pictorial", "understand", "the grid method", rng, { a, b }, `The grid splits ${a} × ${b} into four parts. What is the product?`, card([`×      ${at}      ${ao}`, `${bt}    ${at * bt}    ${ao * bt}`, `${bo}     ${at * bo}     ${ao * bo}`], "Grid"), fmt(a * b), [[fmt(at * bt + ao * bo), "m3-place-mult"], [fmt(a * b - ao * bt), "m3-place-mult"], [fmt(a * b + 10), "m3-place-mult"]]);
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 112, 899), b = int(rng, 12, 45);
    const w = a * (b % 10) + a * Math.floor(b / 10);
    return MU.mc("pictorial", "apply", "3-digit × 2-digit word problem", rng, { a, b }, "How many seats are there in all?", card([`A stadium has ${b} sections.`, `Each section has ${a} seats.`]), fmt(a * b), [[fmt(w), "m3-place-mult"], [fmt(a + b), "m3-op"], [fmt(a * b + a), "m3-place-mult"]]);
  },
  "pictorial|analyze": (rng) => {
    const a = int(rng, 1012, 9999), b = int(rng, 2, 9);
    if (a * b >= 100000) throw new Error("big");
    const w = (a % 10) * b % 10 + Math.floor(a / 10) * 10 * b;
    return MU.mc("pictorial", "analyze", "4-digit × 1-digit", rng, { a, b }, "How many bricks are needed?", card([`${b} walls`, `${fmt(a)} bricks for each wall`]), fmt(a * b), [[fmt(w === a * b ? a * b + 10 : w), "m3-place-mult"], [fmt(a + b), "m3-op"], [fmt(a * (b - 1)), "m3-table"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 12, 99);
    const right = rng() < 0.5;
    return MU.mc("pictorial", "evaluate", "judge a claim", rng, { a, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${a} × 10,000 = ${fmt(a * 10000)}` : `Riya: ${a} × 1,000 = ${fmt(a * 100)}`]), right ? "Yes: write four zeros after the number" : "No: × 1,000 means three zeros after the number", [
      [right ? "No: × 10,000 means three zeros" : "Yes: × 1,000 means two zeros", "m3-place-mult"],
      ["No: multiplying by 10s never adds zeros", "m3-place-mult"],
      ["Yes: the number of zeros doesn't matter", "m3-place-mult"],
    ]);
  },
  "abstract|remember": (rng) => {
    const t = int(rng, 11, 15), k = int(rng, 2, 10);
    return MU.mc("abstract", "remember", "tables of 11 to 15", rng, { t, k }, `${t} × ${k} = ___`, null, String(t * k), [[String(t * (k - 1)), "m3-table"], [String(t * (k + 1)), "m3-table"], [String(t + k), "m3-table"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 12, 999), b = int(rng, 2, 99), c = int(rng, 2, 9);
    const k = int(rng, 0, 2);
    const q = [`(${a} × ${c}) × 10 = ${a} × (___ × 10)`, `${a} × 1 × ${c} = ___`, `${a} × 0 × ${c} = ___`][k];
    const ans = [String(c), fmt(a * c), "0"][k];
    if (k === 0 && a === b) throw new Error("same");
    return MU.mc("abstract", "understand", "properties of multiplication", rng, { a, b, c, k }, q, null, ans, [[String(c + 1), "m3-property"], ["1", "m3-property"], [fmt(a * c + 1), "m3-property"], ["10", "m3-property"], [fmt(a), "m3-property"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 112, 999), b = int(rng, 12, 99);
    const w = a * (b % 10) + a * Math.floor(b / 10);
    return MU.mc("abstract", "apply", "3-digit × 2-digit", rng, { a, b }, `${a} × ${b} = ___`, null, fmt(a * b), [[fmt(w), "m3-place-mult"], [fmt(a * (b % 10)), "m3-place-mult"], [fmt(a * b + 100), "m3-place-mult"]]);
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 1012, 9999), b = int(rng, 12, 99);
    if (a * b >= 1000000) throw new Error("big");
    const w = a * (b % 10) + a * Math.floor(b / 10);
    return MU.mc("abstract", "analyze", "4-digit × 2-digit", rng, { a, b }, `${fmt(a)} × ${b} = ___`, null, fmt(a * b), [[fmt(w), "m3-place-mult"], [fmt(a * b + 1000), "m3-place-mult"], [fmt(a * (b % 10)), "m3-place-mult"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 310, 890), b = int(rng, 21, 89);
    if (a % 100 === 50 || b % 10 === 5) throw new Error("tie");
    const est = Math.round(a / 100) * 100 * Math.round(b / 10) * 10;
    return MU.mc("abstract", "evaluate", "estimating a product", rng, { a, b }, `Which is the best estimate of ${a} × ${b}?`, null, fmt(est), [[fmt(est * 10), "m3-place-mult"], [fmt(est / 10), "m3-place-mult"], [fmt(Math.floor(a / 100) * 100 * Math.floor(b / 10) * 10 === est ? est + 1000 : Math.floor(a / 100) * 100 * Math.floor(b / 10) * 10), "m3-round"]]);
  },
});

// ---------------- Chapter 4: Division ----------------
const DV = kit("dv4", "g4-div");
export const DIV_G4: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const k = int(rng, 2, 9), q = int(rng, 2, 9);
    return DV.shade("remember", "equal sharing", rng, { k, q }, `${k * q * 100} stickers are shared equally among ${k} children. Each square is 100 stickers: shade one child's share.`, 2, 9, q, "1 square = 100", [[k, "m3-div-fact"], [Math.min(18, k * q - k), "m3-op"]]);
  },
  "concrete|understand": (rng) => {
    const p = pick(rng, [10, 100, 1000]), q = int(rng, 12, 99);
    const n = q * p;
    const line = [q, q * 10, n - p, n / 10 === q ? q * 100 : n / 10].map(fmt);
    if (new Set(line).size < 4) throw new Error("dup");
    return DV.tap("understand", "dividing by 10, 100, 1000", rng, { p, q }, `Tap ${fmt(n)} ÷ ${fmt(p)}.`, line.sort(() => rng() - 0.5).join("   "), fmt(q), [{ phrase: fmt(q * 10), mistake: "m3-place-mult" }]);
  },
  "concrete|apply": (rng) => {
    const d = int(rng, 12, 45), q = int(rng, 11, 29), r = int(rng, 1, d - 1);
    const n = d * q + r;
    if (n > 999) throw new Error("big");
    return DV.order("apply", "checking a division", rng, { d, q, r }, `${n} ÷ ${d} gives quotient ${q} and remainder ${r}. Build the check.`, `${d} × ${q} | + | ${r} | = | ${n}`, [String(n + r)], [[`${d} × ${q} + ${r} = ${n + r}`, "m3-remainder"]]);
  },
  "concrete|analyze": (rng) => {
    const d = int(rng, 21, 89), n = int(rng, 2100, 8900);
    if (d % 10 === 5 || n % 1000 === 500) throw new Error("tie");
    const rd = Math.round(d / 10) * 10, rn = Math.round(n / rd) * rd;
    const est = Math.round(rn / rd);
    const line = [est, est * 10, est + 10, rd].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return DV.tap("analyze", "estimating a quotient", rng, { d, n }, `Estimate ${fmt(n)} ÷ ${d}: round ${d} to ${rd} and use a nearby multiple of ${rd} (${fmt(rn)}). Tap the estimate.`, line.sort(() => rng() - 0.5).join("   "), String(est), [{ phrase: String(est * 10), mistake: "m3-place-mult" }]);
  },
  "concrete|evaluate": (rng) => {
    const d = int(rng, 12, 25), q = int(rng, 12, 40), r = int(rng, 1, d - 1);
    const n = d * q + r;
    return DV.tap("evaluate", "check a remainder", rng, { d, q, r }, "The remainder in this working is wrong. Tap it.", `${fmt(n)} ÷ ${d} = ${q - 1} remainder ${r + d}`, String(r + d));
  },
  "pictorial|remember": (rng) => {
    const d = int(rng, 3, 9), q = int(rng, 3, 7);
    const markers = Array.from({ length: q + 1 }, (_, i) => ({ value: i * d, label: String(i * d) }));
    return DV.mc("pictorial", "remember", "division as repeated subtraction", rng, { d, q }, `Jumping back from ${d * q} to 0 in jumps of ${d}: how many jumps?`, { kind: "number-line", min: 0, max: d * q, step: d, markers }, `${q} jumps`, [[`${d} jumps`, "m3-div-fact"], [`${q + 1} jumps`, "m3-div-fact"], [`${d * q - d} jumps`, "m3-op"]]);
  },
  "pictorial|understand": (rng) => {
    const d = int(rng, 12, 35), q = int(rng, 11, 28);
    const n = d * q;
    if (n > 999) throw new Error("big");
    return DV.mc("pictorial", "understand", "3-digit ÷ 2-digit", rng, { d, q }, "How many boxes are filled?", card([`${n} pencils`, `${d} pencils in each box`]), String(q), [[String(q + 1), "m3-div-fact"], [String(n - d), "m3-op"], [String(q - 10 > 0 ? q - 10 : q + 10), "m3-div-fact"]]);
  },
  "pictorial|apply": (rng) => {
    const d = int(rng, 3, 9), q = int(rng, 1012, 3333);
    const n = d * q;
    if (n > 9999) throw new Error("big");
    return DV.mc("pictorial", "apply", "4-digit ÷ 1-digit", rng, { d, q }, "How much does each class get?", card([`₹${fmt(n)}`, `shared equally among ${d} classes`]), `₹${fmt(q)}`, [[`₹${fmt(q + 10)}`, "m3-div-fact"], [`₹${fmt(n - d)}`, "m3-op"], [`₹${fmt(Math.floor(q / 10))}`, "m3-place-mult"]]);
  },
  "pictorial|analyze": (rng) => {
    const d = int(rng, 12, 45), q = int(rng, 50, 250), r = int(rng, 1, d - 1);
    const n = d * q + r;
    if (n > 9999) throw new Error("big");
    return DV.mc("pictorial", "analyze", "4-digit ÷ 2-digit with a remainder", rng, { d, q, r }, "How many full buses, and how many people left over?", card([`${fmt(n)} people`, `${d} people in each bus`]), `${q} buses, ${r} left over`, [[`${q - 1} buses, ${r + d} left over`, "m3-remainder"], [`${q + 1} buses, 0 left over`, "m3-remainder"], [`${q} buses, 0 left over`, "m3-remainder"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 120, 9999);
    const right = rng() < 0.5;
    return DV.mc("pictorial", "evaluate", "judge a claim", rng, { a, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${fmt(a)} ÷ 1 = ${fmt(a)}` : `Riya: ${fmt(a)} ÷ 0 = 0`]), right ? "Yes: dividing by 1 leaves the number the same" : "No: we cannot divide by 0", [
      [right ? "No: dividing by 1 gives 1" : "Yes: any number ÷ 0 is 0", "m3-property"],
      ["No: dividing by 1 gives 0", "m3-property"],
      ["Yes: division never changes a number", "m3-property"],
    ]);
  },
  "abstract|remember": (rng) => {
    const p = pick(rng, [10, 100, 1000]), q = int(rng, 11, 999);
    const n = q * p;
    if (n >= 1000000) throw new Error("big");
    return DV.mc("abstract", "remember", "dividing by 10, 100, 1000", rng, { p, q }, `${fmt(n)} ÷ ${fmt(p)} = ___`, null, fmt(q), [[fmt(q * 10), "m3-place-mult"], [fmt(n / 10 === q ? q * 100 : n / 10), "m3-place-mult"], [fmt(n - p), "m3-op"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 15, 9999), k = int(rng, 0, 2);
    const q = [`${fmt(a)} ÷ ___ = ${fmt(a)}`, `${fmt(a)} ÷ ${fmt(a)} = ___`, `0 ÷ ${fmt(a)} = ___`][k];
    const ans = ["1", "1", "0"][k];
    return DV.mc("abstract", "understand", "properties of division", rng, { a, k }, q, null, ans, [["0", "m3-property"], ["1", "m3-property"], [fmt(a), "m3-property"], ["10", "m3-property"]]);
  },
  "abstract|apply": (rng) => {
    const d = int(rng, 12, 49), q = int(rng, 11, 89);
    const n = d * q;
    if (n > 999) throw new Error("big");
    return DV.mc("abstract", "apply", "3-digit ÷ 2-digit", rng, { d, q }, `${n} ÷ ${d} = ___`, null, String(q), [[String(q + 1), "m3-div-fact"], [String(q - 1), "m3-div-fact"], [String(q * 10), "m3-place-mult"]]);
  },
  "abstract|analyze": (rng) => {
    const d = int(rng, 12, 49), q = int(rng, 100, 450), r = int(rng, 1, d - 1);
    const n = d * q + r;
    if (n > 9999) throw new Error("big");
    return DV.mc("abstract", "analyze", "4-digit ÷ 2-digit", rng, { d, q, r }, `${fmt(n)} ÷ ${d} = ___`, null, `${q} R ${r}`, [[`${q - 1} R ${r + d}`, "m3-remainder"], [`${q} R 0`, "m3-remainder"], [`${q + 10} R ${r}`, "m3-div-fact"]]);
  },
  "abstract|evaluate": (rng) => {
    const seats = int(rng, 25, 55), groups = int(rng, 12, 60), extra = int(rng, 1, seats - 1);
    const kids = seats * groups + extra;
    if (kids > 9999) throw new Error("big");
    return DV.mc("abstract", "evaluate", "word problem with a remainder", rng, { seats, kids }, `${fmt(kids)} children go on a trip. Each bus holds ${seats}. How many buses are needed?`, null, String(groups + 1), [[String(groups), "m3-remainder"], [String(groups + 2), "m3-remainder"], [fmt(kids - seats), "m3-op"]]);
  },
});
