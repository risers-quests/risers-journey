import { Template, fmt, int, pick } from "../core.js";
import { Misconceptions, card, kit, safe } from "../m7/kit.js";

/**
 * Grade 3 Maths (CPA Maths 3, Macmillan, A Singapore Approach),
 * Chapters 1–4: Large Numbers (up to 9999), Addition and Subtraction,
 * Multiplication, Division. Built from each chapter's learning outcomes.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "m3-place": { label: "Mixes up place value and face value", detail: "Gives the face value (7) when asked the place value (700), or reads the wrong place.", childTip: "Face value is the digit itself. Place value is the digit times its place: 7 in the hundreds place is 700." },
  "m3-name": { label: "Reads or writes number names wrongly", detail: "Drops a zero place (4,056 read as 456) or swaps places.", childTip: "Read from the left: thousands, hundreds, tens, ones. A 0 holds its place." },
  "m3-order": { label: "Orders or compares numbers wrongly", detail: "Compares the last digits first, or forgets that more digits means bigger.", childTip: "Compare thousands first, then hundreds, then tens, then ones." },
  "m3-digits": { label: "Forms the largest or smallest number wrongly", detail: "Starts a number with 0, or puts digits in the wrong order.", childTip: "Largest: digits from biggest to smallest. Smallest: smallest first, but a number can't start with 0." },
  "m3-round": { label: "Rounds wrongly", detail: "Always rounds down, or rounds to the wrong place.", childTip: "Look at the digit to the right of the place: 5 or more, round up; less than 5, round down." },
  "m3-carry": { label: "Forgets to regroup (carry) when adding", detail: "Writes 13 in a column, or drops the carried 1.", childTip: "When a column adds to 10 or more, write the ones and carry the ten to the next column." },
  "m3-borrow": { label: "Subtracts the smaller digit from the larger", detail: "Takes 3 − 7 as 7 − 3 instead of regrouping.", childTip: "If the top digit is smaller, borrow 1 from the next column (10 more in this column)." },
  "m3-op": { label: "Uses the wrong operation", detail: "Adds when the question needs subtraction, or multiplies instead of dividing.", childTip: "Altogether / in all: add. How many more / left: subtract. Equal groups: multiply. Share equally: divide." },
  "m3-property": { label: "Misremembers a property", detail: "Thinks a + 0 = 0, a × 0 = a, or that order matters in addition.", childTip: "Adding 0 changes nothing. Multiplying by 0 gives 0, by 1 gives the same number. Order doesn't matter in + or ×." },
  "m3-table": { label: "Doesn't know a times-table fact", detail: "Adds the numbers, or is one row off in the table.", childTip: "Multiplication is equal groups: 7 × 6 is 7 groups of 6. Skip count by 6 seven times." },
  "m3-place-mult": { label: "Forgets the place value when multiplying", detail: "Multiplies only the ones, or forgets the 0 when multiplying by tens.", childTip: "Multiply every digit, and carry. When multiplying by a tens digit, write a 0 first." },
  "m3-remainder": { label: "Gets the remainder wrong", detail: "Leaves a remainder bigger than the divisor, or forgets it.", childTip: "The remainder is always smaller than the divisor. Check: divisor × quotient + remainder = dividend." },
  "m3-div-fact": { label: "Doesn't link division with multiplication", detail: "Guesses a quotient instead of using the times table.", childTip: "24 ÷ 4 asks: 4 times what is 24? Use the table of 4." },
};

const name1 = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function under100(n: number): string {
  if (n < 20) return name1[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? "-" + name1[n % 10] : "");
}
export function numberName(n: number): string {
  const th = Math.floor(n / 1000), h = Math.floor((n % 1000) / 100), r = n % 100;
  const parts: string[] = [];
  if (th) parts.push(`${name1[th]} thousand`);
  if (h) parts.push(`${name1[h]} hundred`);
  if (r) parts.push((parts.length ? "and " : "") + under100(r));
  const s = parts.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const PLACES = ["ones", "tens", "hundreds", "thousands"];
const digitsOf = (n: number) => [Math.floor(n / 1000), Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10];
const four = (rng: () => number) => int(rng, 1000, 9999);
const distinct4 = (rng: () => number) => {
  for (;;) {
    const n = four(rng);
    if (new Set(String(n)).size === 4) return n;
  }
};
const r10 = (n: number) => Math.round(n / 10) * 10;
const r100 = (n: number) => Math.round(n / 100) * 100;
const down10 = (n: number) => Math.floor(n / 10) * 10;
const down100 = (n: number) => Math.floor(n / 100) * 100;

// ---------------- Chapter 1: Large Numbers ----------------
const LN = kit("ln3", "g3-numbers");
export const NUMBERS_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const t = int(rng, 1, 9), o = int(rng, 1, 9);
    if (t === o) throw new Error("same");
    return LN.shade("remember", "tens and ones", rng, { t, o }, `Each square is 1. Shade ${t} tens and ${o} ones.`, 10, 10, t * 10 + o, "1 square = 1", [[o * 10 + t, "m3-place"], [t + o, "m3-place"]]);
  },
  "concrete|understand": (rng) => {
    const n = distinct4(rng);
    const p = int(rng, 1, 3);
    const d = digitsOf(n);
    const line = String(n).split("").join(" ");
    return LN.tap("understand", "the digit in a place", rng, { n, p }, `The number is ${fmt(n)}. Tap the digit in the ${PLACES[p]} place.`, line, String(d[3 - p]), [{ phrase: String(d[p === 3 ? 3 : 0]), mistake: "m3-place" }]);
  },
  "concrete|apply": (rng) => {
    const ns = new Set<number>();
    while (ns.size < 4) ns.add(four(rng));
    const a = [...ns].sort((x, y) => x - y).map(fmt);
    return LN.order("apply", "order numbers", rng, { a: ns.size }, "Put the numbers in order, smallest first.", a.join(" | "), [], [[[...a].reverse().join(" "), "m3-order"]]);
  },
  "concrete|analyze": (rng) => {
    const base = int(rng, 11, 98) * 100;
    const yes = base + int(rng, -49, 49), no = base + int(rng, 51, 99), no2 = base - int(rng, 51, 99);
    const line = [yes, no, no2].map(fmt).sort(() => rng() - 0.5).join("   ");
    return LN.tap("analyze", "rounding", rng, { base, yes }, `Tap the number that rounds to ${fmt(base)} (nearest hundred).`, line, fmt(yes), [{ phrase: fmt(no), mistake: "m3-round" }, { phrase: fmt(no2), mistake: "m3-round" }]);
  },
  "concrete|evaluate": (rng) => {
    const n = distinct4(rng);
    const d = digitsOf(n)[1];
    if (d === 0) throw new Error("zero");
    return LN.tap("evaluate", "check place value", rng, { n }, "One number in this working is wrong. Tap it.", `Place value of ${d} in ${fmt(n)} = ${d * 1000}`, String(d * 1000));
  },
  "pictorial|remember": (rng) => {
    const n = four(rng);
    const [th, h, t, o] = digitsOf(n);
    return LN.mc("pictorial", "remember", "read a place-value chart", rng, { n }, "What number is shown?", { kind: "place-value-chart", columns: [{ label: "Thousands", count: th }, { label: "Hundreds", count: h }, { label: "Tens", count: t }, { label: "Ones", count: o }] }, fmt(n), [[fmt(o * 1000 + t * 100 + h * 10 + th), "m3-place"], [String(th + h + t + o), "m3-place"], [fmt(th * 1000 + t * 100 + h * 10 + o), "m3-place"], [fmt(n + 1000), "m3-name"]]);
  },
  "pictorial|understand": (rng) => {
    const n = int(rng, 1001, 9899);
    if (n % 100 === 50 || n % 100 === 0) throw new Error("tie");
    const lo = down100(n);
    return LN.mc("pictorial", "understand", "round to the nearest hundred", rng, { n }, `Round ${fmt(n)} to the nearest hundred.`, { kind: "number-line", min: lo, max: lo + 100, step: 10, markers: [{ value: n, label: fmt(n) }], labelEvery: 5 }, fmt(r100(n)), [[fmt(r100(n) === lo ? lo + 100 : lo), "m3-round"], [fmt(r10(n)), "m3-round"], [fmt(Math.round(n / 1000) * 1000), "m3-round"]]);
  },
  "pictorial|apply": (rng) => {
    const ds = new Set<number>([0]);
    while (ds.size < 4) ds.add(int(rng, 1, 9));
    const d = [...ds];
    const asc = [...d].sort((a, b) => a - b);
    const smallest = Number(String(asc[1]) + "0" + asc.slice(2).join(""));
    const wrongLead = asc.join("");
    return LN.mc("pictorial", "apply", "smallest number from digits", rng, { d: Number(d.join("")) }, "Use each digit once. What is the smallest 4-digit number you can make?", card([`Digits: ${d.sort(() => rng() - 0.5).join("  ")}`]), fmt(smallest), [[wrongLead, "m3-digits"], [fmt(Number([...asc].reverse().join(""))), "m3-digits"], [fmt(Number(String(asc[1]) + asc.slice(2).join("") + "0")), "m3-digits"]]);
  },
  "pictorial|analyze": (rng) => {
    const th = int(rng, 1, 9), t = int(rng, 1, 9), o = int(rng, 1, 9);
    const n = th * 1000 + t * 10 + o;
    return LN.mc("pictorial", "analyze", "number names", rng, { n }, "Which number is this?", card([numberName(n)]), fmt(n), [[String(th * 100 + t * 10 + o), "m3-name"], [fmt(th * 1000 + t * 100 + o * 10), "m3-name"], [fmt(th * 1000 + t * 100 + o), "m3-name"]]);
  },
  "pictorial|evaluate": (rng) => {
    const n = distinct4(rng);
    const d = digitsOf(n)[0];
    const right = rng() < 0.5;
    return LN.mc("pictorial", "evaluate", "judge a claim", rng, { n, r: right ? 1 : 0 }, "Is Riya right?", card([`Riya: The ${right ? "place" : "face"} value of ${d} in ${fmt(n)} is ${fmt(d * 1000)}.`]), right ? "Yes: it is in the thousands place" : "No: the face value is just the digit", [
      [right ? "No: the face value is just the digit" : "Yes: it is in the thousands place", "m3-place"],
      ["No: the place value is the digit itself", "m3-place"],
      ["Yes: place and face value are always equal", "m3-place"],
    ]);
  },
  "abstract|remember": (rng) => {
    const n = four(rng);
    const [th, h, t, o] = digitsOf(n);
    if (h === 0 || t === 0) throw new Error("zero");
    return LN.mc("abstract", "remember", "number names", rng, { n }, `The number name of ${fmt(n)} is ___`, null, numberName(n), [[numberName(th * 100 + h * 10 + t || 1), "m3-name"], [numberName(th * 1000 + t * 100 + h * 10 + o), "m3-name"], [numberName(o * 1000 + t * 100 + h * 10 + th), "m3-name"]]);
  },
  "abstract|understand": (rng) => {
    const n = distinct4(rng);
    const p = int(rng, 1, 3);
    const d = digitsOf(n)[3 - p];
    if (d === 0) throw new Error("zero");
    const v = d * 10 ** p;
    return LN.mc("abstract", "understand", "place value", rng, { n, p }, `The place value of ${d} in ${fmt(n)} is ___`, null, fmt(v), [[String(d) + (p > 1 ? "" : " "), "m3-place"], [fmt(d * 10 ** ((p + 1) % 4)), "m3-place"], [fmt(d * 10 ** (p === 1 ? 2 : p - 1)), "m3-place"]].map(([a, b]) => [a.trim(), b]) as [string, string][]);
  },
  "abstract|apply": (rng) => {
    const n = four(rng);
    if (n % 10 === 5 || n % 10 === 0) throw new Error("tie");
    return LN.mc("abstract", "apply", "round to the nearest ten", rng, { n }, `${fmt(n)} rounded to the nearest ten is ___`, null, fmt(r10(n)), [[fmt(r10(n) === down10(n) ? down10(n) + 10 : down10(n)), "m3-round"], [fmt(r100(n)), "m3-round"], [fmt(r10(n) + 100), "m3-round"]]);
  },
  "abstract|analyze": (rng) => {
    const d = String(distinct4(rng)).split("").map(Number);
    if (d.includes(0)) throw new Error("zero");
    const big = Number([...d].sort((a, b) => b - a).join(""));
    return LN.mc("abstract", "analyze", "largest number from digits", rng, { d: Number(d.join("")) }, `The largest 4-digit number using ${d.join(", ")} (each once) is ___`, null, fmt(big), [[fmt(Number([...d].sort((a, b) => a - b).join(""))), "m3-digits"], [fmt(Number(d.join(""))), "m3-digits"], ["9,999", "m3-digits"]]);
  },
  "abstract|evaluate": (rng) => {
    const n = distinct4(rng);
    const d = digitsOf(n)[1];
    if (d < 2) throw new Error("small");
    return LN.mc("abstract", "evaluate", "place value minus face value", rng, { n }, `In ${fmt(n)}, the place value of ${d} minus its face value is ___`, null, String(d * 100 - d), [[String(d * 100), "m3-place"], ["0", "m3-place"], [String(d * 100 + d), "m3-place"]]);
  },
});

// ---------------- Chapter 2: Addition and Subtraction ----------------
const AS = kit("as3", "g3-addsub");
const noCarryAdd = (a: number, b: number) => Number(String(a).padStart(4, "0").split("").map((x, i) => (Number(x) + Number(String(b).padStart(4, "0")[i])) % 10).join(""));
const smallFromLarge = (a: number, b: number) => Number(String(a).padStart(4, "0").split("").map((x, i) => Math.abs(Number(x) - Number(String(b).padStart(4, "0")[i]))).join(""));
export const ADDSUB_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const a = int(rng, 15, 49), b = int(rng, 15, 49);
    if ((a % 10) + (b % 10) < 10) throw new Error("no carry");
    return AS.shade("remember", "adding with regrouping", rng, { a, b }, `Shade ${a} + ${b} squares.`, 10, 10, a + b, "1 square = 1", [[a + b - 10, "m3-carry"], [noCarryAdd(a, b), "m3-carry"]]);
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 41, 99), b = int(rng, 12, 39);
    if (a % 10 >= b % 10) throw new Error("no borrow");
    return AS.shade("understand", "subtracting with regrouping", rng, { a, b }, `Shade what is left: ${a} − ${b}.`, 10, 10, a - b, "1 square = 1", [[smallFromLarge(a, b), "m3-borrow"], [a + b, "m3-op"]]);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 1000, 5999), b = int(rng, 1000, 3999);
    const s = a + b;
    return AS.order("apply", "4-digit addition", rng, { a, b }, `Build the addition of ${fmt(a)} and ${fmt(b)}.`, `${fmt(a)} | + | ${fmt(b)} | = | ${fmt(s)}`, [fmt(noCarryAdd(a, b) === s ? s + 10 : noCarryAdd(a, b))], [[`${fmt(a)} + ${fmt(b)} = ${fmt(noCarryAdd(a, b) === s ? s + 10 : noCarryAdd(a, b))}`, "m3-carry"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 120, 880), b = int(rng, 110, 880);
    if (a % 100 === 50 || b % 100 === 50) throw new Error("tie");
    const est = r100(a) + r100(b);
    const line = [est, est + 100, est - 100, a + b].map(fmt);
    if (new Set(line).size < 4) throw new Error("dup");
    return AS.tap("analyze", "estimating a sum", rng, { a, b }, `Estimate ${a} + ${b} by rounding each to the nearest hundred. Tap the estimate.`, line.sort(() => rng() - 0.5).join("   "), fmt(est), [{ phrase: fmt(a + b), mistake: "m3-round" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 4000, 9000), b = int(rng, 1000, 3000);
    const w = smallFromLarge(a, b);
    if (w === a - b) throw new Error("no borrow");
    return AS.tap("evaluate", "check a subtraction", rng, { a, b }, "One number in this working is wrong. Tap it.", `${fmt(a)} − ${fmt(b)} = ${fmt(w)}`, fmt(w));
  },
  "pictorial|remember": (rng) => {
    const a = int(rng, 120, 900), b = int(rng, 120, 900);
    return AS.mc("pictorial", "remember", "part-whole: the whole", rng, { a, b }, "What is the whole?", { kind: "bars", bars: [{ name: "", parts: [{ value: a, label: String(a) }, { value: b, label: String(b) }] }], brace: { label: "?" } }, fmt(a + b), [[fmt(Math.abs(a - b)), "m3-op"], [fmt(noCarryAdd(a, b) === a + b ? a + b + 100 : noCarryAdd(a, b)), "m3-carry"], [fmt(a + b - 10), "m3-carry"]]);
  },
  "pictorial|understand": (rng) => {
    const w = int(rng, 500, 999), a = int(rng, 120, w - 100);
    if (w - a === a) throw new Error("coincidence");
    return AS.mc("pictorial", "understand", "part-whole: a missing part", rng, { w, a }, "What is the missing part?", { kind: "bars", bars: [{ name: "", parts: [{ value: a, label: String(a) }, { value: w - a, label: "?" }] }], brace: { label: String(w) } }, String(w - a), [[fmt(w + a), "m3-op"], [String(smallFromLarge(w, a) === w - a ? w - a + 10 : smallFromLarge(w, a)), "m3-borrow"], [String(w - a + 100), "m3-borrow"]]);
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 1200, 4800), b = int(rng, 1100, 4000);
    return AS.mc("pictorial", "apply", "word problem", rng, { a, b }, "How many people visited altogether?", card([`Saturday: ${fmt(a)} visitors`, `Sunday: ${fmt(b)} visitors`], "A science fair"), fmt(a + b), [[fmt(Math.abs(a - b)), "m3-op"], [fmt(noCarryAdd(a, b) === a + b ? a + b + 1000 : noCarryAdd(a, b)), "m3-carry"], [fmt(a + b - 100), "m3-carry"]]);
  },
  "pictorial|analyze": (rng) => {
    const a = int(rng, 3000, 9000), b = int(rng, 1000, a - 500);
    if (a - b === b) throw new Error("coincidence");
    return AS.mc("pictorial", "analyze", "comparing: how many more", rng, { a, b }, "How many more books does the library have than the shop?", { kind: "bars", bars: [{ name: "Library", parts: [{ value: a, label: fmt(a) }] }, { name: "Shop", parts: [{ value: b, label: fmt(b) }, { value: a - b, label: "?", ghost: true }] }] }, fmt(a - b), [[fmt(a + b), "m3-op"], [fmt(smallFromLarge(a, b) === a - b ? a - b + 100 : smallFromLarge(a, b)), "m3-borrow"], [fmt(a - b - 1000 > 0 ? a - b - 1000 : a - b + 1000), "m3-borrow"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 200, 900);
    const right = rng() < 0.5;
    return AS.mc("pictorial", "evaluate", "judge a claim", rng, { a, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${a} + 0 = ${a}` : `Riya: ${a} − 0 = 0`]), right ? "Yes: adding 0 doesn't change a number" : "No: taking away 0 leaves the number as it is", [
      [right ? "No: taking away 0 leaves the number as it is" : "Yes: adding 0 doesn't change a number", "m3-property"],
      ["No: the answer is always 0", "m3-property"],
      ["Yes: 0 makes every answer 0", "m3-property"],
    ]);
  },
  "abstract|remember": (rng) => {
    const a = int(rng, 100, 999), b = int(rng, 100, 999);
    if (a === b) throw new Error("same");
    return AS.mc("abstract", "remember", "order property", rng, { a, b }, `${a} + ${b} = ${b} + ___`, null, String(a), [[String(b), "m3-property"], [fmt(a + b), "m3-property"], ["0", "m3-property"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 1000, 6999), b = int(rng, 1000, 2999);
    if (noCarryAdd(a, b) === a + b) throw new Error("no carry");
    return AS.mc("abstract", "understand", "4-digit addition with regrouping", rng, { a, b }, `${fmt(a)} + ${fmt(b)} = ___`, null, fmt(a + b), [[fmt(noCarryAdd(a, b)), "m3-carry"], [fmt(a + b - 10), "m3-carry"], [fmt(a - b), "m3-op"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 2, 9) * 1000 + int(rng, 0, 9);
    const b = int(rng, 100, 999);
    return AS.mc("abstract", "apply", "subtracting across zeros", rng, { a, b }, `${fmt(a)} − ${fmt(b)} = ___`, null, fmt(a - b), [[fmt(smallFromLarge(a, b)), "m3-borrow"], [fmt(a - b + 1000), "m3-borrow"], [fmt(a + b), "m3-op"]]);
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 21, 99) * 10 + int(rng, 1, 9), b = int(rng, 11, 89) * 10 + int(rng, 1, 9);
    if (a % 10 === 5 || b % 10 === 5) throw new Error("tie");
    const est = r10(a) + r10(b);
    return AS.mc("abstract", "analyze", "estimate to the nearest ten", rng, { a, b }, `Estimate ${a} + ${b} by rounding each number to the nearest ten.`, null, fmt(est), [[fmt(a + b), "m3-round"], [fmt(r100(a) + r100(b)), "m3-round"], [fmt(down10(a) + down10(b) === est ? est + 20 : down10(a) + down10(b)), "m3-round"]]);
  },
  "abstract|evaluate": (rng) => {
    const total = int(rng, 3000, 9000), spent = int(rng, 1000, total - 500), more = int(rng, 100, 900);
    if ([spent, more, total].includes(total - spent + more)) throw new Error("coincidence");
    return AS.mc("abstract", "evaluate", "two-step word problem", rng, { total, spent, more }, `A shop had ${fmt(total)} pens. It sold ${fmt(spent)} and then got ${more} more. How many pens does it have now?`, null, fmt(total - spent + more), [[fmt(total - spent - more), "m3-op"], [fmt(total + spent + more), "m3-op"], [fmt(total - spent), "m3-op"]]);
  },
});

// ---------------- Chapter 3: Multiplication ----------------
const MU = kit("mu3", "g3-mult");
export const MULT_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const r = int(rng, 6, 9), c = int(rng, 2, 9);
    return MU.shade("remember", "arrays", rng, { r, c }, `Shade ${r} rows of ${c}.`, 9, 10, r * c, "1 square = 1", [[r + c, "m3-table"], [r * (c - 1), "m3-table"]]);
  },
  "concrete|understand": (rng) => {
    const t = int(rng, 6, 9), k = int(rng, 2, 9);
    const line = [t * k, t * k + 1, t * k - 2, t + k].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return MU.tap("understand", "times-table facts", rng, { t, k }, `Tap the answer to ${t} × ${k}.`, line.sort(() => rng() - 0.5).join("   "), String(t * k), [{ phrase: String(t + k), mistake: "m3-table" }]);
  },
  "concrete|apply": (rng) => {
    const t = int(rng, 6, 9), k = int(rng, 3, 9);
    return MU.order("apply", "multiplication on the number line", rng, { t, k }, `On a number line, ${k} jumps of ${t} start at 0. Build the multiplication.`, `${k} | × | ${t} | = | ${t * k}`, [String(t + k)], [[`${k} × ${t} = ${t + k}`, "m3-table"]]);
  },
  "concrete|analyze": (rng) => {
    const t = int(rng, 6, 9);
    const yes = t * int(rng, 3, 9);
    const nos = [yes + 1, yes + t - 1 === yes ? yes + 2 : yes + 2, yes - 1];
    const line = [yes, ...nos].map(String);
    if (new Set(line).size < 4 || nos.some((x) => x % t === 0)) throw new Error("dup");
    return MU.tap("analyze", "multiples", rng, { t, yes }, `Tap the number that is in the table of ${t}.`, line.sort(() => rng() - 0.5).join("   "), String(yes), [{ phrase: String(nos[0]), mistake: "m3-table" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 112, 399), b = int(rng, 3, 9);
    const w = (a % 10) * b % 10 + Math.floor(a / 10) * 10 * b; // forgot to carry from the ones
    if (w === a * b) throw new Error("no carry");
    return MU.tap("evaluate", "check a product", rng, { a, b }, "One number in this working is wrong. Tap it.", `${a} × ${b} = ${w}`, String(w));
  },
  "pictorial|remember": (rng) => {
    const r = int(rng, 2, 6), c = int(rng, 6, 9);
    return MU.mc("pictorial", "remember", "arrays", rng, { r, c }, "Which multiplication does this array show?", { kind: "grid", rows: r, cols: c, shadedCells: r * c, compact: true }, `${r} × ${c} = ${r * c}`, [[`${r} + ${c} = ${r + c}`, "m3-table"], [`${r} × ${c} = ${r * (c + 1)}`, "m3-table"], [`${r} × ${c} = ${r + c}`, "m3-table"]]);
  },
  "pictorial|understand": (rng) => {
    const t = int(rng, 6, 9), k = int(rng, 3, 6);
    const markers = Array.from({ length: k + 1 }, (_, i) => ({ value: i * t, label: i === k ? "?" : String(i * t) }));
    return MU.mc("pictorial", "understand", "jumps on the number line", rng, { t, k }, `${k} equal jumps of ${t}. Where do they land?`, { kind: "number-line", min: 0, max: t * k + t, step: t, markers }, String(t * k), [[String(t + k), "m3-table"], [String(t * (k + 1)), "m3-table"], [String(t * (k - 1)), "m3-table"]]);
  },
  "pictorial|apply": (rng) => {
    const g = int(rng, 3, 7), each = int(rng, 6, 9);
    return MU.mc("pictorial", "apply", "equal groups", rng, { g, each }, "How many muffins are there altogether?", { kind: "concrete", icon: "🧁", itemCount: g * each, groups: g, groupLabel: "plate" }, String(g * each), [[String(g + each), "m3-table"], [String(g * (each - 1)), "m3-table"], [String((g + 1) * each), "m3-table"]]);
  },
  "pictorial|analyze": (rng) => {
    const a = int(rng, 112, 450), b = int(rng, 12, 25);
    const w = a * (b % 10) + a * Math.floor(b / 10); // forgot the 0 for the tens
    return MU.mc("pictorial", "analyze", "3-digit × 2-digit word problem", rng, { a, b }, "How many seats are there in all?", card([`A hall has ${b} rows.`, `Each row has ${a} seats.`]), fmt(a * b), [[fmt(w), "m3-place-mult"], [fmt(a + b), "m3-op"], [fmt(a * b + a), "m3-place-mult"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 6, 9), b = int(rng, 2, 9);
    if (a === b) throw new Error("same");
    const right = rng() < 0.5;
    return MU.mc("pictorial", "evaluate", "judge a claim", rng, { a, b, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${a} × ${b} is the same as ${b} × ${a}.` : `Riya: ${a} × 0 = ${a}.`]), right ? "Yes: the order doesn't change the product" : "No: any number multiplied by 0 is 0", [
      [right ? "No: any number multiplied by 0 is 0" : "Yes: the order doesn't change the product", "m3-property"],
      ["No: the bigger number must come first", "m3-property"],
      ["Yes: multiplying by 0 keeps the number", "m3-property"],
    ]);
  },
  "abstract|remember": (rng) => {
    const t = int(rng, 6, 9), k = int(rng, 2, 10);
    return MU.mc("abstract", "remember", "tables of 6 to 9", rng, { t, k }, `${t} × ${k} = ___`, null, String(t * k), [[String(t * (k - 1)), "m3-table"], [String(t * (k + 1)), "m3-table"], [String(t + k), "m3-table"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 20, 999);
    const which = int(rng, 0, 1);
    return MU.mc("abstract", "understand", "properties of multiplication", rng, { a, w: which }, which ? `${a} × ___ = ${a}` : `${a} × 0 = ___`, null, which ? "1" : "0", which ? [["0", "m3-property"], [String(a), "m3-property"], ["10", "m3-property"]] : [[String(a), "m3-property"], ["1", "m3-property"], [String(a * 10), "m3-property"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 112, 999), b = int(rng, 3, 9);
    const w = (a % 10) * b % 10 + Math.floor(a / 10) * 10 * b;
    if (w === a * b) throw new Error("no carry");
    return MU.mc("abstract", "apply", "3-digit × 1-digit", rng, { a, b }, `${a} × ${b} = ___`, null, fmt(a * b), [[fmt(w), "m3-place-mult"], [fmt((a % 10) * b + Math.floor(a / 10)), "m3-place-mult"], [fmt(a + b), "m3-op"]]);
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 112, 499), b = int(rng, 12, 39);
    const w = a * (b % 10) + a * Math.floor(b / 10);
    return MU.mc("abstract", "analyze", "3-digit × 2-digit", rng, { a, b }, `${a} × ${b} = ___`, null, fmt(a * b), [[fmt(w), "m3-place-mult"], [fmt(a * (b % 10)), "m3-place-mult"], [fmt(a * b + 10), "m3-place-mult"]]);
  },
  "abstract|evaluate": (rng) => {
    const price = int(rng, 105, 499), n = int(rng, 4, 9);
    return MU.mc("abstract", "evaluate", "word problem", rng, { price, n }, `One school bag costs ₹${price}. What do ${n} bags cost?`, null, `₹${fmt(price * n)}`, [[`₹${price + n}`, "m3-op"], [`₹${fmt(price * (n - 1))}`, "m3-table"], [`₹${fmt(Math.floor(price / n))}`, "m3-op"]]);
  },
});

// ---------------- Chapter 4: Division ----------------
const DV = kit("dv3", "g3-div");
export const DIV_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const k = int(rng, 2, 9), q = int(rng, 2, 9);
    return DV.shade("remember", "equal sharing", rng, { k, q }, `${k * q} muffins are shared equally among ${k} plates. Shade the muffins on one plate.`, 2, 9, q, "1 square = 1 muffin", [[k, "m3-div-fact"], [k * q - k <= 18 ? k * q - k : -1, "m3-op"]]);
  },
  "concrete|understand": (rng) => {
    const d = int(rng, 3, 9), q = int(rng, 3, 5);
    const steps = Array.from({ length: q }, (_, i) => `${d * (q - i)} − ${d} = ${d * (q - i - 1)}`);
    return DV.order("understand", "division as repeated subtraction", rng, { d, q }, `Show ${d * q} ÷ ${d} as repeated subtraction, in order.`, steps.join(" | "), [], [[[...steps].reverse().join(" "), "m3-div-fact"]]);
  },
  "concrete|apply": (rng) => {
    const d = int(rng, 2, 9), q = int(rng, 3, 9);
    const line = [q, d * q - d, q + 1, d].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return DV.tap("apply", "division facts", rng, { d, q }, `Tap the answer to ${d * q} ÷ ${d}.`, line.sort(() => rng() - 0.5).join("   "), String(q), [{ phrase: String(d * q - d), mistake: "m3-op" }]);
  },
  "concrete|analyze": (rng) => {
    const d = int(rng, 3, 9), q = int(rng, 11, 99), r = int(rng, 1, d - 1);
    const n = d * q + r;
    return DV.order("analyze", "check a division", rng, { d, q, r }, `${n} ÷ ${d} gives quotient ${q} and remainder ${r}. Build the check.`, `${d} × ${q} | + | ${r} | = | ${n}`, [String(n + r)], [[`${d} × ${q} + ${r} = ${n + r}`, "m3-remainder"]]);
  },
  "concrete|evaluate": (rng) => {
    const d = int(rng, 3, 8), q = int(rng, 5, 30), r = int(rng, 1, d - 1);
    const n = d * q + r;
    const badQ = q - 1, badR = r + d;
    return DV.tap("evaluate", "check a remainder", rng, { d, q, r }, "The remainder in this working is wrong. Tap it.", `${n} ÷ ${d} = ${badQ} remainder ${badR}`, String(badR));
  },
  "pictorial|remember": (rng) => {
    const g = int(rng, 2, 6), each = int(rng, 2, 9);
    return DV.mc("pictorial", "remember", "equal grouping", rng, { g, each }, `These ${g * each} muffins are put ${each} on each plate. How many plates are needed?`, { kind: "concrete", icon: "🧁", itemCount: g * each, groups: g, groupLabel: "plate" }, `${g} plates`, [[`${g * each - each} plates`, "m3-op"], [`${g + each} plates`, "m3-div-fact"], [`${g + 1} plates`, "m3-div-fact"]]);
  },
  "pictorial|understand": (rng) => {
    const d = int(rng, 3, 9), q = int(rng, 3, 6);
    const markers = Array.from({ length: q + 1 }, (_, i) => ({ value: i * d, label: String(i * d) }));
    return DV.mc("pictorial", "understand", "division on the number line", rng, { d, q }, `Jumping back from ${d * q} to 0 in jumps of ${d}: how many jumps?`, { kind: "number-line", min: 0, max: d * q, step: d, markers }, `${q} jumps`, [[`${d} jumps`, "m3-div-fact"], [`${q + 1} jumps`, "m3-div-fact"], [`${d * q - d} jumps`, "m3-op"]]);
  },
  "pictorial|apply": (rng) => {
    const d = int(rng, 3, 9), q = int(rng, 21, 199);
    const n = d * q;
    return DV.mc("pictorial", "apply", "3-digit ÷ 1-digit word problem", rng, { d, q }, "How many stickers does each child get?", card([`${n} stickers`, `shared equally among ${d} children`]), String(q), [[fmt(n - d), "m3-op"], [String(q + 10), "m3-div-fact"], [fmt(n * d), "m3-op"]]);
  },
  "pictorial|analyze": (rng) => {
    const d = int(rng, 3, 9), q = int(rng, 11, 99), r = int(rng, 1, d - 1);
    const n = d * q + r;
    return DV.mc("pictorial", "analyze", "remainders", rng, { d, q, r }, "How many children get pencils, and how many pencils are left over?", card([`${n} pencils`, `${d} pencils for each child`]), `${q} children, ${r} left over`, [[`${q} children, ${r + d} left over`, "m3-remainder"], [`${q + 1} children, 0 left over`, "m3-remainder"], [`${q} children, 0 left over`, "m3-remainder"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 12, 99);
    const right = rng() < 0.5;
    return DV.mc("pictorial", "evaluate", "judge a claim", rng, { a, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${a} ÷ ${a} = 1` : `Riya: 0 ÷ ${a} = ${a}`]), right ? "Yes: a number divided by itself is 1" : "No: 0 divided by any number is 0", [
      [right ? "No: 0 divided by any number is 0" : "Yes: a number divided by itself is 1", "m3-property"],
      ["No: a number divided by itself is 0", "m3-property"],
      ["Yes: dividing never changes a number", "m3-property"],
    ]);
  },
  "abstract|remember": (rng) => {
    const d = int(rng, 2, 9), q = int(rng, 2, 10);
    return DV.mc("abstract", "remember", "division facts", rng, { d, q }, `${d * q} ÷ ${d} = ___`, null, String(q), [[String(q + 1), "m3-div-fact"], [String(q - 1 || 11), "m3-div-fact"], [String(d * q - d), "m3-op"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 15, 999), k = int(rng, 0, 2);
    const q = [`${a} ÷ ___ = ${a}`, `${a} ÷ ${a} = ___`, `0 ÷ ${a} = ___`][k];
    const right = ["1", "1", "0"][k];
    return DV.mc("abstract", "understand", "properties of division", rng, { a, k }, q, null, right, [[String(a), "m3-property"], ["1", "m3-property"], ["0", "m3-property"], [String(a + 1), "m3-property"]]);
  },
  "abstract|apply": (rng) => {
    const d = int(rng, 3, 9), q = int(rng, 101, 999);
    return DV.mc("abstract", "apply", "4-digit ÷ 1-digit", rng, { d, q }, `${fmt(d * q)} ÷ ${d} = ___`, null, String(q), [[String(q + 10), "m3-div-fact"], [String(q - 100 > 0 ? q - 100 : q + 100), "m3-div-fact"], [String(Number(String(q).split("").reverse().join(""))), "m3-place-mult"]]);
  },
  "abstract|analyze": (rng) => {
    const d = int(rng, 3, 9), q = int(rng, 11, 99), r = int(rng, 1, d - 1);
    const n = d * q + r;
    return DV.mc("abstract", "analyze", "quotient and remainder", rng, { d, q, r }, `${n} ÷ ${d} = ___`, null, `${q} R ${r}`, [[`${q - 1} R ${r + d}`, "m3-remainder"], [`${q} R 0`, "m3-remainder"], [`${q + 1} R ${r}`, "m3-remainder"]]);
  },
  "abstract|evaluate": (rng) => {
    const seats = int(rng, 4, 8), kids = seats * int(rng, 6, 20) + int(rng, 1, seats - 1);
    const vans = Math.ceil(kids / seats);
    return DV.mc("abstract", "evaluate", "word problem with a remainder", rng, { seats, kids }, `${kids} children go on a trip. Each van holds ${seats}. How many vans are needed?`, null, String(vans), [[String(vans - 1), "m3-remainder"], [String(kids - seats), "m3-op"], [String(kids * seats), "m3-op"]]);
  },
});
