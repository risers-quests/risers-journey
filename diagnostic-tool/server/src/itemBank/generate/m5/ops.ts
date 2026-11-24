import { Template, fmt, int, pick } from "../core.js";
import { card, kit, noEcho, safe } from "../m7/kit.js";

/**
 * Grade 5 Maths (CPA Maths 5), Chapter 2 "Operations on Large Numbers",
 * split into its four operations so the report can say which one has the
 * gap (staff feedback: one combined topic hid it). Each has its own
 * CPA × Bloom walk: Addition, Subtraction, Multiplication, Division.
 * Numbers stay below 1 crore (the book's range). Mistake names are the
 * shared ones (m3-…), as at Grade 4.
 */
const W = 8;
const digits = (n: number) => String(n).padStart(W, "0").split("").map(Number);
const noCarry = (a: number, b: number) => Number(digits(a).map((x, i) => (x + digits(b)[i]) % 10).join(""));
const smallFromLarge = (a: number, b: number) => Number(digits(a).map((x, i) => Math.abs(x - digits(b)[i])).join(""));
const r = (n: number, to: number) => Math.round(n / to) * to;
const tie = (n: number, to: number) => n % to === to / 2;
/** a × b with the tens row not shifted (the classic slip). */
const noShift = (a: number, b: number) => a * (b % 10) + a * Math.floor(b / 10);
const shuffle = <T,>(xs: T[], rng: () => number) => xs.sort(() => rng() - 0.5);

// ---------------- Addition ----------------
const AD = kit("ad5", "g5-add");
export const ADD_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const a = int(rng, 12, 45), b = int(rng, 12, 40);
    if ((a % 10) + (b % 10) >= 10 || a + b > 90) throw new Error("carry");
    return AD.shade("remember", "adding lakhs", rng, { a, b }, `Each square is 1 lakh. Shade ${fmt(a * 100000)} + ${fmt(b * 100000)}.`, 9, 10, a + b, "1 square = 1,00,000", [[a + b - 10, "m3-carry"], [Math.abs(a - b), "m3-op"]]);
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 15, 55), b = int(rng, 15, 35);
    if ((a % 10) + (b % 10) < 10 || a + b > 90) throw new Error("no carry");
    return AD.shade("understand", "adding with regrouping", rng, { a, b }, `Each square is 10,000. Shade ${fmt(a * 10000)} + ${fmt(b * 10000)}. When a row of ten fills, carry on to the next row.`, 9, 10, a + b, "1 square = 10,000", [[a + b - 10, "m3-carry"], [noCarry(a, b), "m3-carry"]]);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 1000000, 5000000), b = int(rng, 1000000, 4000000);
    const s = a + b, w = noCarry(a, b);
    if (w === s) throw new Error("no carry");
    return AD.order("apply", "7-digit addition", rng, { a, b }, `Build the addition of ${fmt(a)} and ${fmt(b)}.`, `${fmt(a)} | + | ${fmt(b)} | = | ${fmt(s)}`, [fmt(w)], [[`${fmt(a)} + ${fmt(b)} = ${fmt(w)}`, "m3-carry"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 120000, 880000), b = int(rng, 110000, 600000);
    if (tie(a, 10000) || tie(b, 10000)) throw new Error("tie");
    const est = r(a, 10000) + r(b, 10000);
    const line = [est, est + 10000, est - 10000, r(a, 1000) + r(b, 1000)].map(fmt);
    if (new Set(line).size < 4) throw new Error("dup");
    return AD.tap("analyze", "estimating a sum", rng, { a, b }, `Estimate ${fmt(a)} + ${fmt(b)} by rounding each to the nearest ten thousand. Tap the estimate.`, shuffle(line, rng).join("   "), fmt(est), [{ phrase: fmt(r(a, 1000) + r(b, 1000)), mistake: "m3-round" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 1000000, 5000000), b = int(rng, 1000000, 4000000);
    const w = noCarry(a, b);
    if (w === a + b) throw new Error("no carry");
    return AD.tap("evaluate", "check a sum", rng, { a, b }, "One number in this working is wrong. Tap it.", `${fmt(a)} + ${fmt(b)} = ${fmt(w)}`, fmt(w));
  },
  "pictorial|remember": (rng) => {
    const a = int(rng, 100000, 999999), b = int(rng, 100000, 999999);
    return AD.mc("pictorial", "remember", "part-whole: the whole", rng, { a, b }, "What is the whole?", { kind: "bars", bars: [{ name: "", parts: [{ value: a, label: fmt(a) }, { value: b, label: fmt(b) }] }], brace: { label: "?" } }, fmt(a + b), [[fmt(Math.abs(a - b)), "m3-op"], [fmt(noCarry(a, b) === a + b ? a + b + 10000 : noCarry(a, b)), "m3-carry"], [fmt(a + b - 1000), "m3-carry"]]);
  },
  "pictorial|understand": (rng) => {
    const a = int(rng, 1200000, 4800000), b = int(rng, 1100000, 4000000);
    if (noCarry(a, b) === a + b) throw new Error("no carry");
    return AD.mc("pictorial", "understand", "word problem: altogether", rng, { a, b }, "How many people voted in the two towns altogether?", card([`Town A: ${fmt(a)} voters`, `Town B: ${fmt(b)} voters`], "An election"), fmt(a + b), [[fmt(Math.abs(a - b)), "m3-op"], [fmt(noCarry(a, b)), "m3-carry"], [fmt(a + b - 100000), "m3-carry"]]);
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 1000000, 3000000), b = int(rng, 500000, 2000000), c = int(rng, 100000, 900000);
    const s = a + b + c;
    if (s >= 10000000) throw new Error("big");
    return AD.mc("pictorial", "apply", "adding three numbers", rng, { a, b, c }, "How much did the school raise in all?", card([`Term 1: ₹${fmt(a)}`, `Term 2: ₹${fmt(b)}`, `Term 3: ₹${fmt(c)}`]), `₹${fmt(s)}`, [[`₹${fmt(a + b)}`, "m3-op"], [`₹${fmt(s - 100000)}`, "m3-carry"], [`₹${fmt(s + 10000)}`, "m3-carry"]]);
  },
  "pictorial|analyze": (rng) => {
    const b = int(rng, 1200000, 4000000), more = int(rng, 150000, 900000);
    const a = b + more;
    return AD.mc("pictorial", "analyze", "comparison: how many in the bigger one", rng, { b, more }, `Town B has ${fmt(b)} people. Town A has ${fmt(more)} more than Town B. How many people live in Town A?`, { kind: "bars", bars: [{ name: "Town A", parts: [{ value: b, label: fmt(b) }, { value: more, label: fmt(more) }] }, { name: "Town B", parts: [{ value: b, label: fmt(b) }] }], brace: { label: "?" } }, fmt(a), [[fmt(b - more), "m3-op"], [fmt(noCarry(b, more) === a ? a + 10000 : noCarry(b, more)), "m3-carry"], [fmt(more), "m3-op"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 210000, 890000), b = int(rng, 110000, 490000);
    if (tie(a, 10000) || tie(b, 10000)) throw new Error("tie");
    const right = rng() < 0.5;
    const est = r(a, 10000) + r(b, 10000);
    const said = right ? est : r(a, 1000) + r(b, 1000) + 20000;
    if (!right && said === est) throw new Error("same");
    return AD.mc("pictorial", "evaluate", "judge an estimate", rng, { a, b, r: right ? 1 : 0 }, "Riya estimated the sum to the nearest ten thousand. Is she right?", card([`${fmt(a)} + ${fmt(b)}`, `Riya's estimate: ${fmt(said)}`]), right ? "Yes: she rounded each number to the nearest ten thousand first" : "No: rounding each to the nearest ten thousand gives a different estimate", [
      [right ? "No: rounding each to the nearest ten thousand gives a different estimate" : "Yes: she rounded each number to the nearest ten thousand first", "m3-round"],
      ["No: an estimate must be the exact answer", "m3-round"],
      ["Yes: any number close enough is fine", "m3-round"],
    ]);
  },
  "abstract|remember": (rng) => {
    const a = int(rng, 100000, 999999), b = int(rng, 100000, 999999);
    if (a === b) throw new Error("same");
    const k = int(rng, 0, 1);
    return k === 0
      ? AD.mc("abstract", "remember", "addition terms", rng, { a, b, k }, `In ${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}, the number ${fmt(a + b)} is the ___`, null, "sum", [["addend", "m3-op"], ["difference", "m3-op"], ["product", "m3-op"]])
      : AD.mc("abstract", "remember", "order property of addition", rng, { a, b, k }, `${fmt(a)} + ${fmt(b)} = ${fmt(b)} + ___`, null, fmt(a), [[fmt(b), "m3-property"], ["0", "m3-property"], [fmt(a + b), "m3-property"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 1000000, 6000000), b = int(rng, 1000000, 3500000);
    if (noCarry(a, b) === a + b) throw new Error("no carry");
    return AD.mc("abstract", "understand", "7-digit addition", rng, { a, b }, `${fmt(a)} + ${fmt(b)} = ___`, null, fmt(a + b), [[fmt(noCarry(a, b)), "m3-carry"], [fmt(a + b - 100000), "m3-carry"], [fmt(a - b), "m3-op"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 1000000, 4000000), b = int(rng, 1000000, 3000000), c = int(rng, 100000, 999999);
    const s = a + b + c;
    if (s >= 10000000 || noCarry(noCarry(a, b), c) === s) throw new Error("no carry");
    return AD.mc("abstract", "apply", "adding three numbers", rng, { a, b, c }, `${fmt(a)} + ${fmt(b)} + ${fmt(c)} = ___`, null, fmt(s), [[fmt(noCarry(noCarry(a, b), c)), "m3-carry"], [fmt(a + b), "m3-op"], [fmt(s - 1000000), "m3-carry"]]);
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 1000000, 5000000), s = int(rng, a + 500000, 9900000);
    const b = s - a;
    return AD.mc("abstract", "analyze", "missing addend", rng, { a, s }, `${fmt(a)} + ___ = ${fmt(s)}`, null, fmt(b), [[fmt(s + a >= 10000000 ? b + 100000 : s + a), "m3-op"], [fmt(smallFromLarge(s, a) === b ? b + 10000 : smallFromLarge(s, a)), "m3-borrow"], [fmt(b - 100000 > 0 ? b - 100000 : b + 1000000), "m3-carry"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 250000, 900000), b = int(rng, 150000, 800000), c = int(rng, 10000, 99000);
    const ans = a + b + c;
    return AD.mc("abstract", "evaluate", "two-step word problem", rng, { a, b, c }, `A library had ${fmt(a)} books. It bought ${fmt(b)} more, and then ${fmt(c)} were donated. How many books does it have now?`, null, fmt(ans), [[fmt(a + b), "m3-op"], [fmt(a + b - c), "m3-op"], [fmt(ans + 100000), "m3-carry"]]);
  },
}));

// ---------------- Subtraction ----------------
const SU = kit("su5", "g5-sub");
export const SUB_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const a = int(rng, 35, 89), b = int(rng, 11, 30);
    if (a % 10 < b % 10) throw new Error("borrow");
    return SU.shade("remember", "taking away lakhs", rng, { a, b }, `Each square is 1 lakh. Shade what is left: ${fmt(a * 100000)} − ${fmt(b * 100000)}.`, 9, 10, a - b, "1 square = 1,00,000", [[a + b <= 90 ? a + b : a - b - 10, "m3-op"], [a - b - 10, "m3-borrow"]]);
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 41, 90), b = int(rng, 12, 38);
    if (a % 10 >= b % 10 || b >= a) throw new Error("no borrow");
    return SU.shade("understand", "subtracting with regrouping", rng, { a, b }, `Each square is 10,000. Shade what is left: ${fmt(a * 10000)} − ${fmt(b * 10000)}. Break a full row into ten if you need to.`, 9, 10, a - b, "1 square = 10,000", [[smallFromLarge(a, b), "m3-borrow"], [a - b + 10, "m3-borrow"]]);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 3000000, 9800000), b = int(rng, 1000000, 2900000);
    const d = a - b, w = smallFromLarge(a, b);
    if (w === d) throw new Error("no borrow");
    return SU.order("apply", "7-digit subtraction", rng, { a, b }, `Build the subtraction of ${fmt(b)} from ${fmt(a)}.`, `${fmt(a)} | − | ${fmt(b)} | = | ${fmt(d)}`, [fmt(w)], [[`${fmt(a)} − ${fmt(b)} = ${fmt(w)}`, "m3-borrow"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 510000, 980000), b = int(rng, 110000, 490000);
    if (tie(a, 10000) || tie(b, 10000)) throw new Error("tie");
    const est = r(a, 10000) - r(b, 10000);
    const line = [est, est + 10000, r(a, 10000) + r(b, 10000), r(a, 1000) - r(b, 1000)].map(fmt);
    if (new Set(line).size < 4) throw new Error("dup");
    return SU.tap("analyze", "estimating a difference", rng, { a, b }, `Estimate ${fmt(a)} − ${fmt(b)} by rounding each to the nearest ten thousand. Tap the estimate.`, shuffle(line, rng).join("   "), fmt(est), [{ phrase: fmt(r(a, 10000) + r(b, 10000)), mistake: "m3-op" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 4000000, 9900000), b = int(rng, 1000000, 3900000);
    const w = smallFromLarge(a, b);
    if (w === a - b) throw new Error("no borrow");
    return SU.tap("evaluate", "check a difference", rng, { a, b }, "One number in this working is wrong. Tap it.", `${fmt(a)} − ${fmt(b)} = ${fmt(w)}`, fmt(w));
  },
  "pictorial|remember": (rng) => {
    const w = int(rng, 500000, 999999), a = int(rng, 100000, w - 100000);
    if (w - a === a) throw new Error("same");
    return SU.mc("pictorial", "remember", "part-whole: a missing part", rng, { w, a }, "What is the missing part?", { kind: "bars", bars: [{ name: "", parts: [{ value: a, label: fmt(a) }, { value: w - a, label: "?" }] }], brace: { label: fmt(w) } }, fmt(w - a), [[fmt(w + a), "m3-op"], [fmt(smallFromLarge(w, a) === w - a ? w - a + 10000 : smallFromLarge(w, a)), "m3-borrow"], [fmt(w - a + 1000), "m3-borrow"]]);
  },
  "pictorial|understand": (rng) => {
    const a = int(rng, 3000000, 9000000), b = int(rng, 1000000, a - 500000);
    if (smallFromLarge(a, b) === a - b) throw new Error("no borrow");
    return SU.mc("pictorial", "understand", "comparison: how many more", rng, { a, b }, "How many more people live in Town A than in Town B?", { kind: "bars", bars: [{ name: "Town A", parts: [{ value: a, label: fmt(a) }] }, { name: "Town B", parts: [{ value: b, label: fmt(b) }, { value: a - b, label: "?", ghost: true }] }] }, fmt(a - b), [[fmt(smallFromLarge(a, b)), "m3-borrow"], [fmt(a - b + 100000), "m3-borrow"], [fmt(b), "m3-op"]]);
  },
  "pictorial|apply": (rng) => {
    const have = int(rng, 2000000, 9000000), spent = int(rng, 500000, have - 300000);
    if (smallFromLarge(have, spent) === have - spent) throw new Error("no borrow");
    return SU.mc("pictorial", "apply", "word problem: how much is left", rng, { have, spent }, "How much money is left?", card([`A school had ₹${fmt(have)}.`, `It spent ₹${fmt(spent)} on a new building.`]), `₹${fmt(have - spent)}`, [[`₹${fmt(have + spent >= 10000000 ? have - spent + 100000 : have + spent)}`, "m3-op"], [`₹${fmt(smallFromLarge(have, spent))}`, "m3-borrow"], [`₹${fmt(have - spent + 10000)}`, "m3-borrow"]]);
  },
  "pictorial|analyze": (rng) => {
    const total = int(rng, 3000000, 9000000), a = int(rng, 500000, 1500000), b = int(rng, 500000, 1500000);
    const left = total - a - b;
    return SU.mc("pictorial", "analyze", "two parts taken away", rng, { total, a, b }, "How many tickets are still unsold?", { kind: "bars", bars: [{ name: "", parts: [{ value: a, label: fmt(a) }, { value: b, label: fmt(b) }, { value: left, label: "?" }] }], brace: { label: fmt(total) } }, fmt(left), [[fmt(total - a), "m3-op"], [fmt(total - a + b), "m3-op"], [fmt(left + 100000), "m3-borrow"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 3000000, 9000000), b = int(rng, 1000000, a - 500000);
    const right = rng() < 0.5;
    const shown = right ? a - b : smallFromLarge(a, b);
    if (!right && shown === a - b) throw new Error("no borrow");
    return SU.mc("pictorial", "evaluate", "checking subtraction by adding", rng, { a, b, r: right ? 1 : 0 }, "Arjun checks his answer by adding. Is his subtraction right?", card([`${fmt(a)} − ${fmt(b)} = ${fmt(shown)}`, `Check: ${fmt(shown)} + ${fmt(b)} = ${fmt(shown + b)}`]), right ? "Yes: adding back gives the first number" : "No: adding back doesn't give the first number", [
      [right ? "No: adding back doesn't give the first number" : "Yes: adding back gives the first number", "m3-borrow"],
      ["Yes: you can't check a subtraction", "m3-op"],
      ["No: you check by subtracting again", "m3-op"],
    ]);
  },
  "abstract|remember": (rng) => {
    const a = int(rng, 500000, 999999), b = int(rng, 100000, 499999);
    const k = int(rng, 0, 1);
    return k === 0
      ? SU.mc("abstract", "remember", "subtraction terms", rng, { a, b, k }, `In ${fmt(a)} − ${fmt(b)} = ${fmt(a - b)}, the number ${fmt(a - b)} is the ___`, null, "difference", [["sum", "m3-op"], ["minuend", "m3-op"], ["subtrahend", "m3-op"]])
      : SU.mc("abstract", "remember", "subtracting 0 and itself", rng, { a, b, k }, `${fmt(a)} − ${fmt(a)} = ___`, null, "0", [[fmt(a), "m3-property"], ["1", "m3-property"], [fmt(a * 2), "m3-op"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 3000000, 9900000), b = int(rng, 1000000, 2900000);
    if (smallFromLarge(a, b) === a - b) throw new Error("no borrow");
    return SU.mc("abstract", "understand", "7-digit subtraction", rng, { a, b }, `${fmt(a)} − ${fmt(b)} = ___`, null, fmt(a - b), [[fmt(smallFromLarge(a, b)), "m3-borrow"], [fmt(a - b + 100000), "m3-borrow"], [fmt(a - b - 10000), "m3-borrow"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 2, 9) * 1000000 + int(rng, 0, 9), b = int(rng, 100000, 999999);
    return SU.mc("abstract", "apply", "subtracting across zeros", rng, { a, b }, `${fmt(a)} − ${fmt(b)} = ___`, null, fmt(a - b), [[fmt(smallFromLarge(a, b)), "m3-borrow"], [fmt(a - b + 1000000), "m3-borrow"], [fmt(a - b - 100000), "m3-borrow"]]);
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 3000000, 9000000), d = int(rng, 500000, a - 1000000);
    const b = a - d;
    return SU.mc("abstract", "analyze", "missing number", rng, { a, d }, `${fmt(a)} − ___ = ${fmt(d)}`, null, fmt(b), [[fmt(a + d >= 10000000 ? b + 100000 : a + d), "m3-op"], [fmt(smallFromLarge(a, d) === b ? b + 10000 : smallFromLarge(a, d)), "m3-borrow"], [fmt(d), "m3-op"]]);
  },
  "abstract|evaluate": (rng) => {
    const have = int(rng, 3000000, 9000000), spent = int(rng, 1000000, have - 1500000), got = int(rng, 100000, 900000);
    const ans = have - spent + got;
    if (ans >= 10000000) throw new Error("big");
    return SU.mc("abstract", "evaluate", "two-step word problem", rng, { have, spent, got }, `A trust had ₹${fmt(have)}. It spent ₹${fmt(spent)} and then received ₹${fmt(got)}. How much does it have now?`, null, `₹${fmt(ans)}`, [[`₹${fmt(have - spent - got)}`, "m3-op"], [`₹${fmt(have - spent)}`, "m3-op"], [`₹${fmt(ans + 100000)}`, "m3-borrow"]]);
  },
}));

// ---------------- Multiplication ----------------
const MU = kit("mu5", "g5-mult");
export const MULT_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const t = int(rng, 12, 19), k = int(rng, 2, 6);
    if (t * k > 90) throw new Error("big");
    return MU.shade("remember", "times tables", rng, { t, k }, `Shade ${k} rows of ${t}.`, 9, 10, t * k, "1 square = 1", [[t + k, "m3-table"], [t * (k - 1), "m3-table"]]);
  },
  "concrete|understand": (rng) => {
    const n = int(rng, 112, 9999), p = pick(rng, [10, 100, 1000]);
    if (n * p >= 10000000 || n % 10 === 0) throw new Error("big");
    const line = [n * p, n * p * 10, n + p, n * (p / 10 || 1)].map(fmt);
    if (new Set(line).size < 4) throw new Error("dup");
    return MU.tap("understand", "multiplying by 10, 100, 1000", rng, { n, p }, `Tap ${fmt(n)} × ${fmt(p)}.`, shuffle(line, rng).join("   "), fmt(n * p), [{ phrase: fmt(n * p * 10), mistake: "m3-place-mult" }]);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 112, 899), b = int(rng, 21, 89);
    const t = Math.floor(b / 10) * 10, o = b % 10;
    if (!o) throw new Error("zero");
    return MU.order("apply", "splitting the multiplier", rng, { a, b }, `Split ${b} into tens and ones: build ${a} × ${b}.`, `${a} × ${t} | + | ${a} × ${o} | = | ${fmt(a * b)}`, [fmt(noShift(a, b))], [[`${a} × ${t} + ${a} × ${o} = ${fmt(noShift(a, b))}`, "m3-place-mult"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 2100, 8900), b = int(rng, 21, 89);
    if (tie(a, 1000) || tie(b, 10)) throw new Error("tie");
    const est = r(a, 1000) * r(b, 10);
    const line = [est, est * 10, est / 10, r(a, 100) * r(b, 10)].map(fmt);
    if (new Set(line).size < 4) throw new Error("dup");
    return MU.tap("analyze", "estimating a product", rng, { a, b }, `Estimate ${fmt(a)} × ${b}: round ${fmt(a)} to the nearest thousand and ${b} to the nearest ten. Tap the estimate.`, shuffle(line, rng).join("   "), fmt(est), [{ phrase: fmt(est * 10), mistake: "m3-place-mult" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 312, 989), b = int(rng, 21, 89);
    const w = noShift(a, b);
    if (w === a * b || b % 10 === 0) throw new Error("same");
    return MU.tap("evaluate", "check a product", rng, { a, b }, "One number in this working is wrong. Tap it.", `${a} × ${b} = ${fmt(w)}`, fmt(w));
  },
  "pictorial|remember": (rng) => {
    const t = int(rng, 12, 19), k = int(rng, 3, 9);
    const markers = Array.from({ length: k + 1 }, (_, i) => ({ value: i * t, label: i === k ? "?" : String(i * t) }));
    return MU.mc("pictorial", "remember", "tables on the number line", rng, { t, k }, `${k} jumps of ${t} on the number line. Where do they land?`, { kind: "number-line", min: 0, max: t * (k + 1), step: t, markers }, String(t * k), [[String(t + k), "m3-table"], [String(t * (k + 1)), "m3-table"], [String(t * (k - 1)), "m3-table"]]);
  },
  "pictorial|understand": (rng) => {
    const a = int(rng, 112, 489), b = int(rng, 12, 29);
    const ah = Math.floor(a / 100) * 100, ar = a % 100, bt = Math.floor(b / 10) * 10, bo = b % 10;
    if (!ar || !bo) throw new Error("zero");
    return MU.mc("pictorial", "understand", "the area model", rng, { a, b }, `The grid splits ${a} × ${b} into four parts. What is the product?`, card([`×       ${ah}       ${ar}`, `${bt}    ${fmt(ah * bt)}    ${fmt(ar * bt)}`, `${bo}      ${fmt(ah * bo)}     ${fmt(ar * bo)}`], "Area model"), fmt(a * b), [[fmt(ah * bt + ar * bo), "m3-place-mult"], [fmt(a * b - ar * bt), "m3-place-mult"], [fmt(a * b + 100), "m3-place-mult"]]);
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 1012, 4999), b = int(rng, 12, 85);
    return MU.mc("pictorial", "apply", "4-digit × 2-digit word problem", rng, { a, b }, "How many seats are there in all?", card([`A stadium has ${b} sections.`, `Each section has ${fmt(a)} seats.`]), fmt(a * b), [[fmt(noShift(a, b)), "m3-place-mult"], [fmt(a + b), "m3-op"], [fmt(a * b + a), "m3-place-mult"]]);
  },
  "pictorial|analyze": (rng) => {
    const each = int(rng, 112, 899), k = int(rng, 3, 9);
    const total = each * k;
    return MU.mc("pictorial", "analyze", "times as many", rng, { each, k }, `Box B holds ${k} times as many beads as Box A. Box A holds ${each}. How many does Box B hold?`, { kind: "bars", bars: [{ name: "Box A", parts: [{ value: 1, label: String(each) }] }, { name: "Box B", parts: Array.from({ length: k }, (_, i) => ({ value: 1, label: i === 0 ? "?" : "" })) }], brace: { label: "?" } }, fmt(total), [[fmt(each + k), "m3-op"], [fmt(each * (k + 1)), "m3-table"], [fmt(total + 10), "m3-table"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 12, 999);
    const right = rng() < 0.5;
    return MU.mc("pictorial", "evaluate", "judge a claim", rng, { a, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${a} × 10,000 = ${fmt(a * 10000)}` : `Riya: ${a} × 1,000 = ${fmt(a * 100)}`]), right ? "Yes: write four zeros after the number" : "No: × 1,000 means three zeros after the number", [
      [right ? "No: × 10,000 means three zeros" : "Yes: × 1,000 means two zeros", "m3-place-mult"],
      ["No: multiplying by 10s never adds zeros", "m3-place-mult"],
      ["Yes: the number of zeros doesn't matter", "m3-place-mult"],
    ]);
  },
  "abstract|remember": (rng) => {
    const t = int(rng, 12, 19), k = int(rng, 3, 9);
    return MU.mc("abstract", "remember", "times tables", rng, { t, k }, `${t} × ${k} = ___`, null, String(t * k), [[String(t * (k - 1)), "m3-table"], [String(t * (k + 1)), "m3-table"], [String(t + k), "m3-table"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 12, 999), b = int(rng, 12, 99), c = int(rng, 2, 9);
    if (a === b) throw new Error("same");
    const k = int(rng, 0, 2);
    const q = [`${a} × ${b} = ${b} × ___`, `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ___`, `${fmt(a)} × 0 × ${c} = ___`][k];
    const ans = [String(a), String(c), "0"][k];
    return MU.mc("abstract", "understand", "properties of multiplication", rng, { a, b, c, k }, q, null, ans, [[String(b), "m3-property"], ["1", "m3-property"], [fmt(a * c), "m3-property"], [String(b + c), "m3-property"]].filter(([t]) => t !== ans) as [string, string][]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 112, 999), b = int(rng, 112, 999);
    const w = a * (b % 10) + a * (Math.floor(b / 10) % 10) * 10 + a * Math.floor(b / 100) * 10;
    if (w === a * b) throw new Error("same");
    return MU.mc("abstract", "apply", "3-digit × 3-digit", rng, { a, b }, `${a} × ${b} = ___`, null, fmt(a * b), [[fmt(w), "m3-place-mult"], [fmt(a * (b % 100)), "m3-place-mult"], [fmt(a * b + 1000), "m3-place-mult"]]);
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 1012, 9999), b = int(rng, 112, 999);
    if (a * b >= 10000000) throw new Error("big");
    const w = a * (b % 10) + a * (Math.floor(b / 10) % 10) * 10 + a * Math.floor(b / 100) * 10;
    if (w === a * b) throw new Error("same");
    return MU.mc("abstract", "analyze", "4-digit × 3-digit", rng, { a, b }, `${fmt(a)} × ${b} = ___`, null, fmt(a * b), [[fmt(w), "m3-place-mult"], [fmt(a * b + 10000), "m3-place-mult"], [fmt(a * (b % 100)), "m3-place-mult"]]);
  },
  "abstract|evaluate": (rng) => {
    const p = int(rng, 112, 899), n = int(rng, 12, 48), fee = int(rng, 1000, 9000);
    const ans = p * n + fee;
    return MU.mc("abstract", "evaluate", "two-step word problem", rng, { p, n, fee }, `A school buys ${n} chairs at ₹${fmt(p)} each and pays ₹${fmt(fee)} for delivery. What is the total cost?`, null, `₹${fmt(ans)}`, [[`₹${fmt(p * (n + fee))}`, "m3-op"], [`₹${fmt(p * n)}`, "m3-op"], [`₹${fmt(noShift(p, n) + fee === ans ? ans + 1000 : noShift(p, n) + fee)}`, "m3-place-mult"]]);
  },
}));

// ---------------- Division ----------------
const DV = kit("dv5", "g5-div");
export const DIV_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const k = int(rng, 2, 9), q = int(rng, 2, 9);
    return DV.shade("remember", "equal sharing", rng, { k, q }, `${fmt(k * q * 1000)} sheets of paper are shared equally among ${k} classes. Each square is 1,000 sheets: shade one class's share.`, 2, 9, q, "1 square = 1,000", [[k, "m3-div-fact"], [Math.min(18, k * q - k), "m3-op"]]);
  },
  "concrete|understand": (rng) => {
    const p = pick(rng, [10, 100, 1000]), q = int(rng, 112, 9999);
    const n = q * p;
    if (n >= 10000000 || q % 10 === 0) throw new Error("big");
    const line = [q, q * 10, n - p, Math.floor(q / 10)].map(fmt);
    if (new Set(line).size < 4) throw new Error("dup");
    return DV.tap("understand", "dividing by 10, 100, 1000", rng, { p, q }, `Tap ${fmt(n)} ÷ ${fmt(p)}.`, shuffle(line, rng).join("   "), fmt(q), [{ phrase: fmt(q * 10), mistake: "m3-place-mult" }]);
  },
  "concrete|apply": (rng) => {
    const d = int(rng, 12, 45), q = int(rng, 112, 899), rem = int(rng, 1, d - 1);
    const n = d * q + rem;
    if (n > 99999) throw new Error("big");
    return DV.order("apply", "checking a division", rng, { d, q, rem }, `${fmt(n)} ÷ ${d} gives quotient ${q} and remainder ${rem}. Build the check.`, `${d} × ${q} | + | ${rem} | = | ${fmt(n)}`, [fmt(n + rem)], [[`${d} × ${q} + ${rem} = ${fmt(n + rem)}`, "m3-remainder"]]);
  },
  "concrete|analyze": (rng) => {
    const d = int(rng, 21, 89), n = int(rng, 21000, 89000);
    if (tie(d, 10)) throw new Error("tie");
    const rd = r(d, 10), rn = r(n, rd * 10);
    const est = Math.round(rn / rd);
    const line = [est, est * 10, est + 100, rd].map(fmt);
    if (new Set(line).size < 4 || rn === 0) throw new Error("dup");
    return DV.tap("analyze", "estimating a quotient", rng, { d, n }, `Estimate ${fmt(n)} ÷ ${d}: round ${d} to ${rd} and use a nearby multiple of ${rd} (${fmt(rn)}). Tap the estimate.`, shuffle(line, rng).join("   "), fmt(est), [{ phrase: fmt(est * 10), mistake: "m3-place-mult" }]);
  },
  "concrete|evaluate": (rng) => {
    const d = int(rng, 12, 35), q = int(rng, 112, 900), rem = int(rng, 1, d - 1);
    const n = d * q + rem;
    return DV.tap("evaluate", "check a remainder", rng, { d, q, rem }, "The remainder in this working is wrong. Tap it.", `${fmt(n)} ÷ ${d} = ${q - 1} remainder ${rem + d}`, String(rem + d));
  },
  "pictorial|remember": (rng) => {
    const d = int(rng, 6, 15), q = int(rng, 3, 7);
    const markers = Array.from({ length: q + 1 }, (_, i) => ({ value: i * d, label: String(i * d) }));
    return DV.mc("pictorial", "remember", "division as repeated subtraction", rng, { d, q }, `Jumping back from ${d * q} to 0 in jumps of ${d}: how many jumps?`, { kind: "number-line", min: 0, max: d * q, step: d, markers }, `${q} jumps`, [[`${d} jumps`, "m3-div-fact"], [`${q + 1} jumps`, "m3-div-fact"], [`${d * q - d} jumps`, "m3-op"]]);
  },
  "pictorial|understand": (rng) => {
    const d = int(rng, 12, 48), q = int(rng, 112, 950);
    const n = d * q;
    if (n > 99999) throw new Error("big");
    return DV.mc("pictorial", "understand", "5-digit ÷ 2-digit", rng, { d, q }, "How many boxes are filled?", card([`${fmt(n)} pencils`, `${d} pencils in each box`]), String(q), [[String(q + 1), "m3-div-fact"], [fmt(n - d), "m3-op"], [String(Math.floor(q / 10)), "m3-place-mult"]]);
  },
  "pictorial|apply": (rng) => {
    const d = int(rng, 12, 45), q = int(rng, 1012, 9999);
    const n = d * q;
    if (n >= 1000000) throw new Error("big");
    return DV.mc("pictorial", "apply", "6-digit ÷ 2-digit word problem", rng, { d, q }, "How much does each class get?", card([`₹${fmt(n)}`, `shared equally among ${d} classes`]), `₹${fmt(q)}`, [[`₹${fmt(q + 10)}`, "m3-div-fact"], [`₹${fmt(n - d)}`, "m3-op"], [`₹${fmt(Math.floor(q / 10))}`, "m3-place-mult"]]);
  },
  "pictorial|analyze": (rng) => {
    const d = int(rng, 24, 60), q = int(rng, 112, 900), rem = int(rng, 1, d - 1);
    const n = d * q + rem;
    if (n > 99999) throw new Error("big");
    return DV.mc("pictorial", "analyze", "5-digit ÷ 2-digit with a remainder", rng, { d, q, rem }, "How many full buses, and how many people left over?", card([`${fmt(n)} people`, `${d} people in each bus`]), `${q} buses, ${rem} left over`, [[`${q - 1} buses, ${rem + d} left over`, "m3-remainder"], [`${q + 1} buses, 0 left over`, "m3-remainder"], [`${q} buses, 0 left over`, "m3-remainder"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 120, 99999);
    const right = rng() < 0.5;
    return DV.mc("pictorial", "evaluate", "judge a claim", rng, { a, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${fmt(a)} ÷ 1 = ${fmt(a)}` : `Riya: ${fmt(a)} ÷ 0 = 0`]), right ? "Yes: dividing by 1 leaves the number the same" : "No: we cannot divide by 0", [
      [right ? "No: dividing by 1 gives 1" : "Yes: any number ÷ 0 is 0", "m3-property"],
      ["No: dividing by 1 gives 0", "m3-property"],
      ["Yes: division never changes a number", "m3-property"],
    ]);
  },
  "abstract|remember": (rng) => {
    const p = pick(rng, [10, 100, 1000]), q = int(rng, 112, 9999);
    const n = q * p;
    if (n >= 10000000 || q % 10 === 0) throw new Error("big");
    return DV.mc("abstract", "remember", "dividing by 10, 100, 1000", rng, { p, q }, `${fmt(n)} ÷ ${fmt(p)} = ___`, null, fmt(q), [[fmt(q * 10), "m3-place-mult"], [fmt(Math.floor(q / 10)), "m3-place-mult"], [fmt(n - p), "m3-op"]]);
  },
  "abstract|understand": (rng) => {
    const d = int(rng, 12, 49), q = int(rng, 112, 999);
    const n = d * q;
    if (n > 99999) throw new Error("big");
    return DV.mc("abstract", "understand", "5-digit ÷ 2-digit", rng, { d, q }, `${fmt(n)} ÷ ${d} = ___`, null, String(q), [[String(q + 1), "m3-div-fact"], [String(q - 1), "m3-div-fact"], [String(q * 10 > 9999 ? q + 10 : q * 10), "m3-place-mult"]]);
  },
  "abstract|apply": (rng) => {
    const d = int(rng, 112, 450), q = int(rng, 12, 99), rem = int(rng, 1, d - 1);
    const n = d * q + rem;
    if (n > 99999) throw new Error("big");
    return DV.mc("abstract", "apply", "5-digit ÷ 3-digit", rng, { d, q, rem }, `${fmt(n)} ÷ ${d} = ___`, null, `${q} R ${rem}`, [[`${q - 1} R ${rem + d}`, "m3-remainder"], [`${q} R 0`, "m3-remainder"], [`${q + 1} R ${rem}`, "m3-div-fact"]]);
  },
  "abstract|analyze": (rng) => {
    const k = int(rng, 3, 6), avg = int(rng, 120, 950);
    const vals = Array.from({ length: k - 1 }, () => avg + int(rng, -90, 90));
    const last = avg * k - vals.reduce((s, v) => s + v, 0);
    if (last < 10) throw new Error("neg");
    const all = [...vals, last];
    const sum = avg * k;
    return DV.mc("abstract", "analyze", "average", rng, { k, avg }, `Find the average of ${all.map(fmt).join(", ")}.`, null, fmt(avg), [[fmt(sum), "m3-op"], [fmt(Math.round(sum / (k + 1))), "m3-div-fact"], [fmt(avg + 10), "m3-div-fact"]]);
  },
  "abstract|evaluate": (rng) => {
    const seats = int(rng, 35, 60), groups = int(rng, 112, 500), extra = int(rng, 1, seats - 1);
    const kids = seats * groups + extra;
    return DV.mc("abstract", "evaluate", "word problem with a remainder", rng, { seats, kids }, `${fmt(kids)} people travel to a match. Each bus holds ${seats}. How many buses are needed?`, null, String(groups + 1), [[String(groups), "m3-remainder"], [String(groups + 2), "m3-remainder"], [fmt(kids - seats), "m3-op"]]);
  },
}));
