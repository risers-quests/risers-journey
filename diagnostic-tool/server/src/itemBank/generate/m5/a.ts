import { Template, fmt, gcd, int, pick } from "../core.js";
import { Misconceptions, card, kit, noEcho, safe } from "../m7/kit.js";

/**
 * Grade 5 Maths (CPA Maths 5), generated: Factors and Multiples, Four
 * Operations of Fractions, Decimals, Geometry, Measurement, Perimeter and
 * Area. Replaces the hand-written banks (one fixed question per level).
 * Built from each chapter's learning outcomes.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "m5-divisibility": { label: "Misapplies a divisibility test", detail: "Checks the last digit for 3 or 9, or the digit sum for 4.", childTip: "2: even last digit. 3 and 9: digit sum divides by 3 or 9. 4: last two digits divide by 4. 5: ends in 0 or 5. 10: ends in 0." },
  "m5-hcf-lcm": { label: "Mixes up HCF and LCM", detail: "Gives the LCM for the HCF, or multiplies the numbers for the LCM.", childTip: "HCF: the biggest number that divides both (common primes, smallest powers). LCM: the smallest number both divide into (all primes, biggest powers)." },
  "m5-prime-factor": { label: "Gets a prime factorisation wrong", detail: "Includes a composite factor (4, 6, 9), or misses a repeated prime.", childTip: "Keep dividing by primes (2, 3, 5, 7…) until 1 is left, and write every prime used." },
  "m5-frac-add": { label: "Adds or subtracts fractions wrongly", detail: "Adds tops and bottoms (1/2 + 1/3 = 2/5), or forgets to make the denominators the same.", childTip: "Make the denominators the same first (use the LCM), then add or subtract only the numerators." },
  "m5-frac-mult": { label: "Multiplies or divides fractions wrongly", detail: "Cross-multiplies when multiplying, or forgets to flip the second fraction when dividing.", childTip: "Multiply: top × top, bottom × bottom. Divide: multiply by the reciprocal (flip the second fraction)." },
  "m5-frac-compare": { label: "Compares fractions wrongly", detail: "Compares only the numerators or only the denominators of unlike fractions.", childTip: "Make the denominators the same, then compare the numerators." },
  "m5-mixed": { label: "Mishandles mixed numbers", detail: "Converts 2 1/3 to 3/3 or 2/3, or forgets the whole part.", childTip: "2 1/3 = (2 × 3 + 1)/3 = 7/3. Convert mixed numbers to improper fractions before multiplying or dividing." },
  "m5-dec-place": { label: "Lines up decimals wrongly", detail: "Lines up the last digits instead of the decimal points, or thinks 0.45 > 0.5.", childTip: "Line up the decimal points. Compare tenths first, then hundredths: 0.5 = 0.50 > 0.45." },
  "m5-dec-mult": { label: "Places the decimal point wrongly when multiplying or dividing", detail: "Writes 0.3 × 0.2 = 0.6 instead of 0.06.", childTip: "Count the decimal places in both numbers: 0.3 × 0.2 has two places, so 0.06." },
  "m5-angle-kind": { label: "Names the kind of angle wrongly", detail: "Mixes up acute, right, obtuse, straight and reflex.", childTip: "Acute < 90°, right = 90°, obtuse between 90° and 180°, straight = 180°, reflex > 180°." },
  "m5-protractor": { label: "Reads the wrong protractor scale", detail: "Reads 130° for a 50° angle (the outer scale instead of the inner).", childTip: "Start from the scale that reads 0° on the arm you lined up; check: is the angle smaller or bigger than a right angle?" },
  "m5-parallel": { label: "Mixes up parallel and perpendicular lines", detail: "Calls lines that meet at 90° parallel.", childTip: "Parallel lines never meet and stay the same distance apart. Perpendicular lines meet at a right angle." },
  "m5-triangle-area": { label: "Forgets the ½ in a triangle's area", detail: "Uses base × height for a triangle.", childTip: "A triangle is half of a rectangle: area = ½ × base × height." },
};

const fr = (n: number, d: number) => {
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
};
const mixed = (n: number, d: number) => {
  const g = gcd(n, d);
  n /= g; d /= g;
  if (n % d === 0) return String(n / d);
  return n > d ? `${Math.floor(n / d)} ${n % d}/${d}` : `${n}/${d}`;
};
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
const factorise = (n: number) => { const f: number[] = []; for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; } return f; };

// ---------------- Chapter 3: Factors and Multiples ----------------
const FM = kit("fm5", "factors-multiples");
const TESTS: [number, string][] = [[2, "2"], [3, "3"], [4, "4"], [5, "5"], [9, "9"], [10, "10"]];
export const FACTORS_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const n = pick(rng, [12, 18, 20, 24, 28, 30, 36]);
    const fs = Array.from({ length: n }, (_, i) => i + 1).filter((x) => n % x === 0);
    const k = int(rng, 1, Math.floor(fs.length / 2) - 1);
    return FM.shade("remember", "factor pairs as arrays", rng, { n, k }, `Arrange ${n} counters in ${fs[k]} equal rows. Shade one row.`, 2, 18, n / fs[k], "1 square = 1 counter", [[fs[k], "m3-table"], [n - fs[k] <= 36 ? n - fs[k] : -1, "m3-op"]]);
  },
  "concrete|understand": (rng) => {
    const [t] = pick(rng, TESTS);
    const yes = t * int(rng, 120, 999);
    const no = [yes + 1, yes + 2, yes - 1].filter((x) => x % t !== 0);
    if (no.length < 2) throw new Error("few");
    return FM.tap("understand", "tests of divisibility", rng, { t, yes }, `Tap the number that is divisible by ${t}.`, [yes, ...no.slice(0, 3)].map(fmt).sort(() => rng() - 0.5).join("   "), fmt(yes), [{ phrase: fmt(no[0]), mistake: "m5-divisibility" }]);
  },
  "concrete|apply": (rng) => {
    const n = pick(rng, [12, 18, 20, 24, 30, 36, 40, 42, 45, 48, 60, 66, 70, 72, 84, 90]);
    const primes = [...new Set(factorise(n))];
    const comp = [4, 6, 8, 9, 10].find((c) => n % c === 0)!;
    const line = [2, 3, 4, 5, 6, 7, 9, 10, 11].map(String).join("   ");
    return FM.tap("apply", "prime factors", rng, { n }, `Tap every prime factor of ${n}.`, line, primes.map(String), [{ phrase: String(comp), mistake: "m5-prime-factor" }]);
  },
  "concrete|analyze": (rng) => {
    const a = pick(rng, [12, 18, 24, 30, 36]), b = pick(rng, [16, 20, 27, 40, 45, 48]);
    const h = gcd(a, b), l = lcm(a, b);
    if (h === 1 || h === a || h === b) throw new Error("trivial");
    const line = [h, l, a * b, h * 2].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return FM.tap("analyze", "HCF", rng, { a, b }, `Tap the HCF of ${a} and ${b}.`, line.sort(() => rng() - 0.5).join("   "), String(h), [{ phrase: String(l), mistake: "m5-hcf-lcm" }]);
  },
  "concrete|evaluate": (rng) => {
    const n = pick(rng, [36, 48, 72, 60, 90]);
    const f = factorise(n);
    const bad = [...f]; bad.splice(0, 2, f[0] * f[1]);
    return FM.tap("evaluate", "check a factorisation", rng, { n }, "This should be a prime factorisation. Tap the number that is not prime.", `${n} = ${bad.join(" × ")}`, String(f[0] * f[1]));
  },
  "pictorial|remember": (rng) => {
    const r = int(rng, 2, 6), c = int(rng, 3, 9);
    if (r === c) throw new Error("square");
    return FM.mc("pictorial", "remember", "factors from an array", rng, { r, c }, "The array shows a factor pair of the total. Which pair?", { kind: "grid", rows: r, cols: c, shadedCells: r * c, compact: true }, `${r} and ${c}`, [[`${r} and ${r * c}`, "m3-table"], [`${r + c} and ${r * c}`, "m3-table"], [`${r - 1} and ${c + 1}`, "m3-table"]]);
  },
  "pictorial|understand": (rng) => {
    const n = pick(rng, [24, 36, 40, 48, 60, 72]);
    const f = factorise(n);
    return FM.mc("pictorial", "understand", "factor tree", rng, { n }, `A factor tree for ${n} ends in these primes. Which is the prime factorisation?`, card([`${n}`, `↓ ${f.join(", ")}`], "Factor tree"), f.join(" × "), [[`${f[0] * f[1]} × ${f.slice(2).join(" × ")}`, "m5-prime-factor"], [`${f.slice(1).join(" × ")}`, "m5-prime-factor"], [`2 × ${n / 2}`, "m5-prime-factor"]]);
  },
  "pictorial|apply": (rng) => {
    const a = pick(rng, [4, 6, 8, 9, 10, 12]), b = pick(rng, [6, 8, 10, 15, 16]);
    if (a === b) throw new Error("same");
    const l = lcm(a, b);
    if (l === a * b) throw new Error("coprime");
    return FM.mc("pictorial", "apply", "LCM in a word problem", rng, { a, b }, "After how many minutes do both bells ring together again?", card([`Bell A rings every ${a} minutes.`, `Bell B rings every ${b} minutes.`, "They just rang together."]), `${l} minutes`, [[`${a * b} minutes`, "m5-hcf-lcm"], [`${gcd(a, b)} minutes`, "m5-hcf-lcm"], [`${a + b} minutes`, "m3-op"]]);
  },
  "pictorial|analyze": (rng) => {
    const a = pick(rng, [24, 36, 48, 60]), b = pick(rng, [18, 30, 42, 54]);
    const h = gcd(a, b);
    return FM.mc("pictorial", "analyze", "HCF in a word problem", rng, { a, b }, "What is the longest length of rope that measures both exactly?", card([`Rope A: ${a} m`, `Rope B: ${b} m`]), `${h} m`, [[`${lcm(a, b)} m`, "m5-hcf-lcm"], [`${h / 2} m`, "m5-hcf-lcm"], [`${Math.abs(a - b) === h ? h * 2 : Math.abs(a - b)} m`, "m3-op"]]);
  },
  "pictorial|evaluate": (rng) => {
    const n = 3 * int(rng, 100, 999) + 1;
    const ds = String(n).split("").reduce((x, y) => x + Number(y), 0);
    const right = rng() < 0.5;
    return FM.mc("pictorial", "evaluate", "judge a claim", rng, { n, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${n} is not divisible by 3, because its digit sum ${ds} is not.` : `Riya: ${n} is divisible by 3, because its last digit is ${n % 10}.`]), right ? "Yes: the test for 3 uses the digit sum" : "No: the test for 3 uses the digit sum, not the last digit", [
      [right ? "No: the test for 3 uses the last digit" : "Yes: the last digit decides", "m5-divisibility"],
      ["No: no number is divisible by 3", "m5-divisibility"],
      ["Yes: every odd number is divisible by 3", "m5-divisibility"],
    ]);
  },
  "abstract|remember": (rng) => {
    const i = int(rng, 0, 3);
    const q: [string, string, string[]][] = [["A number is divisible by 9 if ___", "its digit sum is divisible by 9", ["it ends in 9", "it is odd", "its last two digits make 9"]], ["A number is divisible by 4 if ___", "its last two digits make a number divisible by 4", ["it ends in 4", "its digit sum is 4", "it is even"]], ["A number is divisible by 5 if ___", "it ends in 0 or 5", ["its digit sum is 5", "it is odd", "it ends in 5 only"]], ["A prime number has exactly ___", "two factors: 1 and itself", ["one factor", "three factors", "no factors"]]];
    return FM.mc("abstract", "remember", "rules", rng, { i }, q[i][0], null, q[i][1], q[i][2].map((t) => [t, "m5-divisibility"] as [string, string]));
  },
  "abstract|understand": (rng) => {
    const n = pick(rng, [24, 30, 36, 42, 48, 54, 60, 66, 72, 84]);
    const f = factorise(n);
    return FM.mc("abstract", "understand", "prime factorisation", rng, { n }, `The prime factorisation of ${n} is ___`, null, f.join(" × "), [[`${f[0] * f[1]} × ${f.slice(2).join(" × ")}`, "m5-prime-factor"], [`2 × ${n / 2}`, "m5-prime-factor"], [f.slice(1).join(" × "), "m5-prime-factor"]]);
  },
  "abstract|apply": (rng) => {
    const a = pick(rng, [12, 16, 18, 20, 24, 30]), b = pick(rng, [8, 15, 27, 36, 40, 45]);
    const h = gcd(a, b);
    if (h === 1 || a === b) throw new Error("trivial");
    return FM.mc("abstract", "apply", "HCF", rng, { a, b }, `The HCF of ${a} and ${b} is ___`, null, String(h), [[String(lcm(a, b)), "m5-hcf-lcm"], [String(h === 2 ? 4 : 2), "m5-hcf-lcm"], [String(a * b), "m5-hcf-lcm"]]);
  },
  "abstract|analyze": (rng) => {
    const a = pick(rng, [4, 6, 8, 9, 12, 15]), b = pick(rng, [6, 10, 14, 16, 18, 20]);
    const l = lcm(a, b);
    if (a === b || l === a * b) throw new Error("coprime");
    return FM.mc("abstract", "analyze", "LCM", rng, { a, b }, `The LCM of ${a} and ${b} is ___`, null, String(l), [[String(a * b), "m5-hcf-lcm"], [String(gcd(a, b)), "m5-hcf-lcm"], [String(l * 2), "m5-hcf-lcm"]]);
  },
  "abstract|evaluate": (rng) => {
    const h = int(rng, 2, 9), x = int(rng, 2, 7), y = int(rng, 2, 7);
    if (gcd(x, y) !== 1 || x === y) throw new Error("not coprime");
    const a = h * x, b = h * y;
    return FM.mc("abstract", "evaluate", "HCF × LCM", rng, { h, x, y }, `HCF of two numbers is ${h} and LCM is ${h * x * y}. One number is ${a}. The other is ___`, null, String(b), [[String(h * x * y), "m5-hcf-lcm"], [String(h * x * y / h), "m5-hcf-lcm"], [String(a + h), "m5-hcf-lcm"]]);
  },
}));

// ---------------- Chapter 4: Four Operations of Fractions ----------------
const FO = kit("fo5", "four-operations-fractions");
export const FRACTIONS_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const d = pick(rng, [2, 3, 4]), k = pick(rng, [2, 3]);
    const n = int(rng, 1, d - 1);
    return FO.shade("remember", "equivalent fractions", rng, { n, d, k }, `The strip has ${d * k} equal parts. Shade a fraction equal to ${n}/${d}.`, 1, d * k, n * k, "1 square = 1 part", [[n, "m5-frac-compare"], [d * k - n * k, "m3-frac-rest"]]);
  },
  "concrete|understand": (rng) => {
    const d = pick(rng, [6, 8, 10, 12]), a = int(rng, 1, d / 2), b = int(rng, 1, d / 2 - 1);
    if (gcd(a, d) === 1 && false) throw new Error();
    return FO.shade("understand", "adding like fractions", rng, { a, b, d }, `The strip has ${d} equal parts. Shade ${a}/${d} + ${b}/${d}.`, 1, d, a + b, "1 square = 1 part", [[Math.min(d, a * b), "m5-frac-add"], [Math.abs(a - b), "m3-op"]]);
  },
  "concrete|apply": (rng) => {
    const fs = [[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [5, 6], [2, 5]].sort(() => rng() - 0.5).slice(0, 4);
    const sorted = [...fs].sort((x, y) => x[0] / x[1] - y[0] / y[1]);
    if (new Set(fs.map(([n, d]) => n / d)).size < 4) throw new Error("tie");
    return FO.order("apply", "ordering unlike fractions", rng, { a: fs[0][0] * 10 + fs[0][1], b: fs[1][0] * 10 + fs[1][1] }, "Put the fractions in order, smallest first.", sorted.map(([n, d]) => `${n}/${d}`).join(" | "), [], [[[...sorted].sort((x, y) => x[1] - y[1]).map(([n, d]) => `${n}/${d}`).join(" "), "m5-frac-compare"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 1, 4), b = pick(rng, [3, 4, 5]), c = int(rng, 1, 3), d = pick(rng, [2, 3, 6]);
    if (b === d || a >= b || c >= d) throw new Error("bad");
    const right = fr(a * d + c * b, b * d);
    const line = [right, `${a + c}/${b + d}`, fr(a * c, b * d), fr(a * d + c * b + 1, b * d)];
    if (new Set(line).size < 4) throw new Error("dup");
    return FO.tap("analyze", "adding unlike fractions", rng, { a, b, c, d }, `Tap ${a}/${b} + ${c}/${d} (simplest form).`, line.sort(() => rng() - 0.5).join("   "), right, [{ phrase: `${a + c}/${b + d}`, mistake: "m5-frac-add" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 1, 4), b = pick(rng, [3, 5, 7]), c = int(rng, 1, 4), d = pick(rng, [2, 4, 6]);
    if (a >= b || c >= d) throw new Error("bad");
    return FO.tap("evaluate", "check a sum", rng, { a, b, c, d }, "One number in this working is wrong. Tap it.", `${a}/${b} + ${c}/${d} = ${a + c}/${b + d}`, `${a + c}/${b + d}`);
  },
  "pictorial|remember": (rng) => {
    const d = pick(rng, [4, 6, 8, 9, 10, 12]);
    const gs = [2, 3, 4, 5, 6].filter((x) => d % x === 0 && x < d);
    const gg = pick(rng, gs), n = gg * int(rng, 1, d / gg - 1);
    return FO.mc("pictorial", "remember", "simplest form", rng, { n, d }, "What fraction is shaded, in its simplest form?", { kind: "pie", pies: [{ slices: d, shaded: n }] }, fr(n, d), [[`${n}/${d}`, "m5-frac-compare"], [fr(d - n, d), "m3-frac-rest"], [`${d}/${n}`, "m3-frac-parts"]]);
  },
  "pictorial|understand": (rng) => {
    const w = int(rng, 2, 9), d = pick(rng, [3, 4, 5]), n = int(rng, 1, d - 1);
    return FO.mc("pictorial", "understand", "fraction of a whole number", rng, { w, n, d }, `What is ${n}/${d} of ${w * d}?`, { kind: "bar-model", totalLabel: String(w * d), parts: d, highlightParts: n }, String(w * n), [[String(w), "m5-frac-mult"], [String(w * d * n), "m5-frac-mult"], [String(w * (d - n)), "m3-frac-rest"]]);
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 1, 5), b = pick(rng, [2, 3, 4]), c = int(rng, 1, 3), d = pick(rng, [3, 4, 6]);
    if (a % b === 0 || c >= d) throw new Error("bad");
    const total = (a * d + c * b);
    return FO.mc("pictorial", "apply", "mixed numbers word problem", rng, { a, b, c, d }, "How much flour is used altogether?", card([`Cake: ${mixed(a + b, b)} kg`, `Bread: ${c}/${d} kg`]), `${mixed(total + b * d, b * d)} kg`, [[`${mixed(a + b + c, b + d)} kg`, "m5-frac-add"], [`${mixed(total, b * d)} kg`, "m5-mixed"], [`${mixed(total + 2 * b * d, b * d)} kg`, "m5-mixed"]]);
  },
  "pictorial|analyze": (rng) => {
    const a = int(rng, 1, 4), b = pick(rng, [3, 5, 7]), c = int(rng, 1, 4), d = pick(rng, [2, 4, 5]);
    if (a >= b || c >= d || b === d) throw new Error("bad");
    return FO.mc("pictorial", "analyze", "fraction × fraction", rng, { a, b, c, d }, `What is ${a}/${b} of ${c}/${d}?`, card([`${a}/${b} × ${c}/${d}`]), fr(a * c, b * d), [[fr(a * d, b * c), "m5-frac-mult"], [`${a * c}/${b + d}`, "m5-frac-mult"], [fr(a * d + c * b, b * d), "m5-frac-add"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return FO.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: To divide by 2/3, I multiply by 3/2." : "Riya: 1/2 + 1/3 = 2/5"]), right ? "Yes: dividing by a fraction means multiplying by its reciprocal" : "No: 1/2 + 1/3 = 3/6 + 2/6 = 5/6", [
      [right ? "No: you multiply by 2/3" : "Yes: add the tops and add the bottoms", right ? "m5-frac-mult" : "m5-frac-add"],
      ["No: you can't divide by a fraction", "m5-frac-mult"],
      ["Yes: the answer is always smaller", "m5-frac-add"],
    ]);
  },
  "abstract|remember": (rng) => {
    const n = int(rng, 1, 5), d = pick(rng, [3, 4, 5, 7]), w = int(rng, 1, 5);
    if (n >= d) throw new Error("bad");
    return FO.mc("abstract", "remember", "mixed to improper", rng, { n, d, w }, `${w} ${n}/${d} as an improper fraction is ___`, null, `${w * d + n}/${d}`, [[`${w + n}/${d}`, "m5-mixed"], [`${w * n + d}/${d}`, "m5-mixed"], [`${w * d}/${d + n}`, "m5-mixed"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 3, 9), b = pick(rng, [4, 6, 8, 10]), c = int(rng, 1, 5);
    if (a <= c || a >= b) throw new Error("bad");
    return FO.mc("abstract", "understand", "subtracting unlike fractions", rng, { a, b, c }, `${a}/${b} − ${c}/${b / 2} = ___`, null, fr(a - 2 * c, b), [[`${a - c}/${b - b / 2}`, "m5-frac-add"], [fr(a - c, b), "m5-frac-add"], [fr(Math.abs(a - 2 * c) + 1, b), "m5-frac-add"]].filter(([t]) => !t.includes("-") && !t.startsWith("0")) as [string, string][]);
  },
  "abstract|apply": (rng) => {
    const n = int(rng, 1, 5), d = pick(rng, [3, 4, 5, 6, 7]), w = int(rng, 2, 9);
    if (n >= d) throw new Error("bad");
    return FO.mc("abstract", "apply", "fraction × whole number", rng, { n, d, w }, `${n}/${d} × ${w} = ___`, null, mixed(n * w, d), [[`${n * w}/${d * w}`, "m5-frac-mult"], [mixed(n, d * w), "m5-frac-mult"], [mixed(n + w, d), "m5-frac-mult"]]);
  },
  "abstract|analyze": (rng) => {
    const n = int(rng, 1, 5), d = pick(rng, [3, 4, 5, 7]), w = int(rng, 2, 6);
    if (n >= d) throw new Error("bad");
    return FO.mc("abstract", "analyze", "fraction ÷ whole number", rng, { n, d, w }, `${n}/${d} ÷ ${w} = ___`, null, fr(n, d * w), [[mixed(n * w, d), "m5-frac-mult"], [fr(n, d + w), "m5-frac-mult"], [fr(w, n * d), "m5-frac-mult"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 1, 4), b = pick(rng, [3, 5, 7]), c = int(rng, 1, 4), d = pick(rng, [2, 4, 6]);
    if (a >= b || c >= d) throw new Error("bad");
    return FO.mc("abstract", "evaluate", "fraction ÷ fraction", rng, { a, b, c, d }, `${a}/${b} ÷ ${c}/${d} = ___`, null, mixed(a * d, b * c), [[fr(a * c, b * d), "m5-frac-mult"], [mixed(b * c, a * d), "m5-frac-mult"], [mixed(a * d + 1, b * c), "m5-frac-mult"]]);
  },
}));

// ---------------- Chapter 5: Decimals ----------------
const DE = kit("de5", "decimals");
const d2 = (x: number) => String(Math.round(x * 1000) / 1000);
export const DECIMALS_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const h = int(rng, 11, 89);
    if (h % 10 === 0) throw new Error("round");
    return DE.shade("remember", "hundredths on a grid", rng, { h }, `Shade ${(h / 100).toFixed(2)} of the 100-square grid.`, 10, 10, h, "1 square = 0.01", [[Math.floor(h / 10) + (h % 10), "m5-dec-place"], [(h % 10) * 10 + Math.floor(h / 10), "m5-dec-place"]]);
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 11, 45), b = int(rng, 11, 45);
    if (a + b > 100 || (a % 10) + (b % 10) < 10) throw new Error("no carry");
    return DE.shade("understand", "adding decimals", rng, { a, b }, `Shade ${(a / 100).toFixed(2)} + ${(b / 100).toFixed(2)} on the grid.`, 10, 10, a + b, "1 square = 0.01", [[a + b - 10, "m5-dec-place"], [Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10, "m5-dec-place"]]);
  },
  "concrete|apply": (rng) => {
    const vals = new Set<string>();
    while (vals.size < 4) vals.add(pick(rng, ["0.5", "0.45", "0.405", "0.54", "0.05", "0.4", "0.504", "0.055"]));
    const v = [...vals];
    const sorted = [...v].sort((x, y) => Number(x) - Number(y));
    return DE.order("apply", "ordering decimals", rng, { a: Number(v[0]) * 1000, b: Number(v[1]) * 1000 }, "Put the decimals in order, smallest first.", sorted.join(" | "), [], [[[...v].sort((x, y) => x.length - y.length || Number(x) - Number(y)).join(" "), "m5-dec-place"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 2, 9), b = int(rng, 2, 9);
    const right = d2(a * b / 100);
    const line = [right, d2(a * b / 10), d2(a * b / 1000), String(a * b)];
    if (new Set(line).size < 4) throw new Error("dup");
    return DE.tap("analyze", "multiplying decimals", rng, { a, b }, `Tap 0.${a} × 0.${b}.`, line.sort(() => rng() - 0.5).join("   "), right, [{ phrase: d2(a * b / 10), mistake: "m5-dec-mult" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 12, 89), b = int(rng, 2, 9);
    return DE.tap("evaluate", "check a sum", rng, { a, b }, "One number in this working is wrong. Tap it.", `${(a / 10).toFixed(1)} + 0.0${b} = ${((a + b) / 10).toFixed(1)}`, ((a + b) / 10).toFixed(1));
  },
  "pictorial|remember": (rng) => {
    const t = int(rng, 1, 9), h = int(rng, 1, 9), o = int(rng, 1, 9);
    return DE.mc("pictorial", "remember", "place-value chart", rng, { o, t, h }, "What decimal is shown?", { kind: "place-value-chart", columns: [{ label: "Ones", count: o }, { label: "Tenths", count: t }, { label: "Hundredths", count: h }] }, `${o}.${t}${h}`, [[`${o}.${h}${t}`, "m5-dec-place"], [`${o}${t}.${h}`, "m5-dec-place"], [`${o}.0${t}${h}`, "m5-dec-place"]]);
  },
  "pictorial|understand": (rng) => {
    const n = int(rng, 1, 99), dd = pick(rng, [10, 100, 1000]);
    if (n >= dd || n % 10 === 0) throw new Error("bad");
    const dec = (n / dd).toFixed(String(dd).length - 1);
    return DE.mc("pictorial", "understand", "fraction to decimal", rng, { n, dd }, "Write the fraction as a decimal.", card([`${n}/${dd}`]), dec, [[(n / (dd === 10 ? 100 : 10)).toFixed(dd === 10 ? 2 : 1), "m5-dec-place"], [`${n}.${dd}`, "m5-dec-place"], [(n / dd * 10).toFixed(String(dd).length - 1), "m5-dec-place"]]);
  },
  "pictorial|apply": (rng) => {
    const p = int(rng, 1200, 9900), q = int(rng, 3, 8);
    return DE.mc("pictorial", "apply", "decimals word problem", rng, { p, q }, "How much ribbon is used?", card([`${q} pieces`, `${(p / 1000).toFixed(3)} m each`]), `${d2(p * q / 1000)} m`, [[`${d2(p * q / 100)} m`, "m5-dec-mult"], [`${d2(p / 1000 + q)} m`, "m3-op"], [`${d2(p * q / 10000)} m`, "m5-dec-mult"]]);
  },
  "pictorial|analyze": (rng) => {
    const q = int(rng, 12, 98), d = int(rng, 2, 9);
    const n = q * d;
    return DE.mc("pictorial", "analyze", "dividing decimals", rng, { q, d }, "How much does each glass get?", card([`${(n / 100).toFixed(2)} L of juice`, `shared equally into ${d} glasses`]), `${(q / 100).toFixed(2)} L`, [[`${(q / 10).toFixed(1)} L`, "m5-dec-mult"], [`${(q / 1000).toFixed(3)} L`, "m5-dec-mult"], [`${((n - d) / 100).toFixed(2)} L`, "m3-op"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = int(rng, 1, 9), b = int(rng, 10, 99);
    if (b % 10 === 0 || a * 10 === b) throw new Error("bad");
    const big = a * 10 > b ? `0.${a}` : `0.${b}`;
    const right = rng() < 0.5;
    return DE.mc("pictorial", "evaluate", "judge a claim", rng, { a, b, r: right ? 1 : 0 }, "Is Riya right?", card([`Riya: ${right ? big : big === `0.${a}` ? `0.${b}` : `0.${a}`} is the bigger number.`]), right ? "Yes: compare tenths first" : "No: compare tenths first, not the number of digits", [
      [right ? "No: the one with more digits is bigger" : "Yes: more digits means bigger", "m5-dec-place"],
      ["They are equal", "m5-dec-place"],
      ["No: decimals can't be compared", "m5-dec-place"],
    ]);
  },
  "abstract|remember": (rng) => {
    const n = int(rng, 11, 999), dd = pick(rng, [100, 1000]);
    if (n >= dd || n % 10 === 0) throw new Error("bad");
    const dec = (n / dd).toFixed(String(dd).length - 1);
    return DE.mc("abstract", "remember", "decimal to fraction", rng, { n, dd }, `${dec} as a fraction is ___`, null, fr(n, dd), [[`${n}/${dd / 10}`, "m5-dec-place"], [`${n}/${dd * 10}`, "m5-dec-place"], [`${dd}/${n}`, "m3-frac-parts"]].filter(([t]) => t !== fr(n, dd)) as [string, string][]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 100, 999), b = int(rng, 11, 99);
    return DE.mc("abstract", "understand", "adding decimals", rng, { a, b }, `${(a / 100).toFixed(2)} + ${(b / 10).toFixed(1)} = ___`, null, ((a + b * 10) / 100).toFixed(2), [[((a + b) / 100).toFixed(2), "m5-dec-place"], [((a * 10 + b) / 1000).toFixed(3), "m5-dec-place"], [((a + b * 10 + 10) / 100).toFixed(2), "m5-dec-place"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 200, 999), b = int(rng, 11, 99);
    if (a <= b * 10) throw new Error("order");
    return DE.mc("abstract", "apply", "subtracting decimals", rng, { a, b }, `${(a / 100).toFixed(2)} − ${(b / 10).toFixed(1)} = ___`, null, ((a - b * 10) / 100).toFixed(2), [[((a - b) / 100).toFixed(2), "m5-dec-place"], [((a + b * 10) / 100).toFixed(2), "m3-op"], [((a - b * 10 + 10) / 100).toFixed(2), "m3-borrow"]]);
  },
  "abstract|analyze": (rng) => {
    const a = int(rng, 11, 99), b = int(rng, 2, 9);
    return DE.mc("abstract", "analyze", "decimal × decimal", rng, { a, b }, `${(a / 10).toFixed(1)} × 0.${b} = ___`, null, d2(a * b / 100), [[d2(a * b / 10), "m5-dec-mult"], [d2(a * b / 1000), "m5-dec-mult"], [d2(a / 10 + b / 10), "m3-op"]]);
  },
  "abstract|evaluate": (rng) => {
    const q = int(rng, 11, 99), d = pick(rng, [10, 100]);
    return DE.mc("abstract", "evaluate", "dividing by 10 and 100", rng, { q, d }, `${(q / 10).toFixed(1)} ÷ ${d} = ___`, null, d2(q / 10 / d), [[d2(q / 10 * d), "m5-dec-mult"], [d2(q / 10 / (d === 10 ? 100 : 10)), "m5-dec-mult"], [d2(q / 1000 / d), "m5-dec-mult"]]);
  },
}));

// ---------------- Chapter 6: Geometry ----------------
const GE = kit("ge5", "geometry");
const kindOf = (x: number) => (x < 90 ? "Acute" : x === 90 ? "Right" : x < 180 ? "Obtuse" : x === 180 ? "Straight" : "Reflex");
export const GEOMETRY_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const x = 10 * int(rng, 1, 17);
    return GE.shade("remember", "measuring angles", rng, { x }, `Each square is 10°. Shade an angle of ${x}°.`, 2, 9, x / 10, "1 square = 10°", [[18 - x / 10, "m5-protractor"], [Math.min(18, x / 10 + 1), "m5-protractor"]]);
  },
  "concrete|understand": (rng) => {
    const x = 5 * int(rng, 2, 70);
    const k = kindOf(x).toLowerCase();
    return GE.tap("understand", "kinds of angle", rng, { x }, `Tap the kind of angle ${x}° is.`, "acute   right   obtuse   straight   reflex", k, [{ phrase: k === "acute" ? "obtuse" : "acute", mistake: "m5-angle-kind" }]);
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 1, 3);
    return GE.order("apply", "ordering angles", rng, { k }, "Put the kinds of angle in order, smallest first.", "acute | right | obtuse | straight | reflex", [], [["acute obtuse right straight reflex", "m5-angle-kind"]]);
  },
  "concrete|analyze": (rng) => {
    const x = 10 * int(rng, 2, 16);
    if (x === 90) throw new Error("right");
    return GE.shade("analyze", "reading a protractor", rng, { x }, `A protractor's outer scale reads ${180 - x}° and its inner scale reads ${x}° on the same arm. The angle opens from the inner 0°. Each square is 10°: shade the angle.`, 2, 9, x / 10, "1 square = 10°", [[(180 - x) / 10, "m5-protractor"]]);
  },
  "concrete|evaluate": (rng) => {
    const b: [string, string][] = [["Parallel lines meet at a right angle.", "meet"], ["An obtuse angle is less than 90°.", "less"], ["Perpendicular lines never meet.", "never"], ["A reflex angle is less than 180°.", "less"]];
    const i = int(rng, 0, b.length - 1);
    return GE.tap("evaluate", "check a fact", rng, { i }, "One word in this sentence is wrong. Tap it.", b[i][0], b[i][1]);
  },
  "pictorial|remember": (rng) => {
    const x = 5 * int(rng, 2, 70);
    if (x === 180) throw new Error("straight");
    return GE.mc("pictorial", "remember", "kinds of angle", rng, { x }, "What kind of angle is marked?", { kind: "figure", figure: "pie", slices: [{ value: x, label: `${x}°` }, { value: 360 - x, label: "" }] }, kindOf(x), ["Acute", "Right", "Obtuse", "Straight", "Reflex"].filter((k) => k !== kindOf(x)).slice(0, 3).map((t) => [t, "m5-angle-kind"] as [string, string]));
  },
  "pictorial|understand": (rng) => {
    const x = 10 * int(rng, 2, 16);
    if (x === 90) throw new Error("right");
    return GE.mc("pictorial", "understand", "reading a protractor", rng, { x }, "The arm passes 0° on the inner scale. What does the angle measure?", card([`Inner scale: ${x}°`, `Outer scale: ${180 - x}°`], "Protractor"), `${x}°`, [[`${180 - x}°`, "m5-protractor"], [`${90 - x > 0 ? 90 - x : x - 90}°`, "m5-protractor"], [`${360 - x}°`, "m5-protractor"]]);
  },
  "pictorial|apply": (rng) => {
    const shapes: ["rectangle" | "square", string][] = [["rectangle", "Its opposite sides are parallel and its corners are right angles"], ["square", "Its opposite sides are parallel and its corners are right angles"]];
    const i = int(rng, 0, 1);
    return GE.mc("pictorial", "apply", "parallel and perpendicular sides", rng, { i }, `Which is true about this ${shapes[i][0]}?`, { kind: "shape", shape: shapes[i][0] }, shapes[i][1], [["Its sides never meet", "m5-parallel"], ["None of its sides are perpendicular", "m5-parallel"], ["All its sides meet at 45°", "m5-parallel"]]);
  },
  "pictorial|analyze": (rng) => {
    const x = 5 * int(rng, 4, 32);
    return GE.mc("pictorial", "analyze", "angles on a straight line", rng, { x }, "The two angles make a straight line. What is the missing angle?", { kind: "figure", figure: "pie", slices: [{ value: x, label: `${x}°` }, { value: 180 - x, label: "?" }, { value: 180, label: "" }] }, `${180 - x}°`, [[`${90 - x > 0 ? 90 - x : 360 - x}°`, "m5-angle-kind"], [`${360 - x}°`, "m5-angle-kind"], [`${x + 10}°`, "m5-angle-kind"]].filter(([t]) => t !== `${x}°`) as [string, string][]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return GE.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: The two rails of a railway track are parallel." : "Riya: The hands of a clock at 3 o'clock are parallel."]), right ? "Yes: they never meet" : "No: at 3 o'clock they are perpendicular", [
      [right ? "No: they are perpendicular" : "Yes: they never meet", "m5-parallel"],
      ["No: parallel lines meet far away", "m5-parallel"],
      ["Yes: all straight lines are parallel", "m5-parallel"],
    ]);
  },
  "abstract|remember": (rng) => {
    const i = int(rng, 0, 3);
    const q: [string, string, string[]][] = [["An angle less than 90° is ___", "acute", ["obtuse", "right", "reflex"]], ["An angle greater than 180° is ___", "reflex", ["obtuse", "straight", "acute"]], ["A straight angle measures ___", "180°", ["90°", "360°", "100°"]], ["Angles are measured with a ___", "protractor", ["compass", "ruler", "set square only"]]];
    return GE.mc("abstract", "remember", "angle facts", rng, { i }, q[i][0], null, q[i][1], q[i][2].map((t) => [t, "m5-angle-kind"] as [string, string]));
  },
  "abstract|understand": (rng) => {
    const x = 5 * int(rng, 2, 70);
    return GE.mc("abstract", "understand", "kinds of angle", rng, { x }, `An angle of ${x}° is ___`, null, kindOf(x).toLowerCase(), ["acute", "right", "obtuse", "straight", "reflex"].filter((k) => k !== kindOf(x).toLowerCase()).slice(0, 3).map((t) => [t, "m5-angle-kind"] as [string, string]));
  },
  "abstract|apply": (rng) => {
    const x = 5 * int(rng, 2, 17);
    return GE.mc("abstract", "apply", "angles in a right angle", rng, { x }, `A right angle is split into two parts. One part is ${x}°. The other is ___`, null, `${90 - x}°`, [[`${180 - x}°`, "m5-angle-kind"], [`${x}°`, "m5-angle-kind"], [`${360 - x}°`, "m5-angle-kind"]].filter(([t]) => t !== `${90 - x}°`) as [string, string][]);
  },
  "abstract|analyze": (rng) => {
    const h = int(rng, 1, 5);
    return GE.mc("abstract", "analyze", "angles on a clock", rng, { h }, `What angle do the hands of a clock make at ${h} o'clock?`, null, `${h * 30}°`, [[`${h * 5}°`, "m5-protractor"], [`${360 - h * 30}°`, "m5-protractor"], [`${h * 15}°`, "m5-protractor"]]);
  },
  "abstract|evaluate": (rng) => {
    const i = int(rng, 0, 2);
    const q: [string, string, string[]][] = [["Two lines that meet at a right angle are ___", "perpendicular", ["parallel", "curved", "equal"]], ["Two lines that never meet are ___", "parallel", ["perpendicular", "intersecting", "crossing"]], ["The opposite edges of a ruler are ___", "parallel", ["perpendicular", "intersecting", "curved"]]];
    return GE.mc("abstract", "evaluate", "parallel and perpendicular", rng, { i }, q[i][0], null, q[i][1], q[i][2].map((t) => [t, "m5-parallel"] as [string, string]));
  },
}));

// ---------------- Chapter 7: Measurement ----------------
const ME = kit("me5", "measurement");
const UNITS: [string, string, number][] = [["km", "m", 1000], ["m", "cm", 100], ["cm", "mm", 10], ["kg", "g", 1000], ["g", "mg", 1000], ["L", "mL", 1000]];
export const MEASUREMENT_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const kg = int(rng, 1, 3), g = 250 * int(rng, 1, 3);
    return ME.shade("remember", "kilograms and grams", rng, { kg, g }, `Each square is 250 g. Shade ${kg} kg ${g} g.`, 2, 9, kg * 4 + g / 250, "1 square = 250 g", [[kg + g / 250, "m3-convert"], [Math.min(18, kg * 10 + g / 250), "m3-convert"]]);
  },
  "concrete|understand": (rng) => {
    const L = int(rng, 1, 3), ml = 250 * int(rng, 1, 3), n = int(rng, 2, 3);
    const total = (L * 1000 + ml) * n;
    if (total / 250 > 18) throw new Error("big");
    return ME.shade("understand", "multiplying capacity", rng, { L, ml, n }, `${n} bottles each hold ${L} L ${ml} mL. Each square is 250 mL: shade the total.`, 2, 9, total / 250, "1 square = 250 mL", [[(L * 1000 + ml) / 250, "m3-op"], [Math.min(18, (L * 1000 + ml * n) / 250), "m3-units"]]);
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 1, 3);
    return ME.order("apply", "units of weight", rng, { k }, "Put the units in order, smallest first.", "mg | g | kg", [], [["kg g mg", "m3-convert"]]);
  },
  "concrete|analyze": (rng) => {
    const [big, small, f] = pick(rng, UNITS);
    const n = int(rng, 2, 9), r = int(rng, 1, f === 10 ? 9 : 99);
    const right = n * f + r;
    const line = [right, n * 10 + r, n * (f === 1000 ? 100 : 1000) + r, n + r].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return ME.tap("analyze", "converting units", rng, { n, r, f }, `Tap ${n} ${big} ${r} ${small} in ${small}.`, line.sort(() => rng() - 0.5).join("   "), String(right), [{ phrase: String(n * 10 + r), mistake: "m3-convert" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 2, 6), x = 100 * int(rng, 6, 9), n = int(rng, 2, 4);
    return ME.tap("evaluate", "multiplying measures", rng, { a, x, n }, "One number in this answer is wrong (it needs regrouping). Tap it.", `${a} kg ${x} g × ${n} = ${a * n} kg ${x * n} g`, String(x * n));
  },
  "pictorial|remember": (rng) => {
    const [big, small, f] = pick(rng, UNITS);
    return ME.mc("pictorial", "remember", "relating units", rng, { f }, `How many ${small} make 1 ${big}?`, card([`1 ${big} = ? ${small}`]), String(f), [[String(f === 10 ? 100 : 10), "m3-convert"], [String(f === 1000 ? 100 : 1000), "m3-convert"], [String(f * 10), "m3-convert"]]);
  },
  "pictorial|understand": (rng) => {
    const a = 50 * int(rng, 20, 90), b = 50 * int(rng, 20, 90);
    const s = a + b;
    return ME.mc("pictorial", "understand", "adding lengths", rng, { a, b }, "How far did Riya walk altogether?", { kind: "bars", bars: [{ name: "", parts: [{ value: a, label: `${a} m` }, { value: b, label: `${b} m` }] }], brace: { label: "?" } }, `${Math.floor(s / 1000)} km ${s % 1000} m`, [[`${s} km`, "m3-units"], [`${Math.floor(s / 100)} km ${s % 100} m`, "m3-convert"], [`${Math.abs(a - b)} m`, "m3-op"]]);
  },
  "pictorial|apply": (rng) => {
    const total = int(rng, 5, 15), n = int(rng, 3, 8), each = 50 * int(rng, 2, 18);
    const left = total * 1000 - n * each;
    if (left <= 0) throw new Error("neg");
    return ME.mc("pictorial", "apply", "capacity word problem", rng, { total, n, each }, "How much water is left in the tank?", card([`The tank has ${total} L.`, `${n} buckets of ${each} mL are taken out.`]), `${Math.floor(left / 1000)} L ${left % 1000} mL`, [[`${total - n} L ${each} mL`, "m3-units"], [`${Math.floor((total * 1000 - each) / 1000)} L ${(total * 1000 - each) % 1000} mL`, "m3-op"], [`${Math.floor((left + 1000) / 1000)} L ${left % 1000} mL`, "m3-borrow"]]);
  },
  "pictorial|analyze": (rng) => {
    const n = int(rng, 3, 8), q = int(rng, 1, 5) * 1000 + 50 * int(rng, 1, 19);
    const total = n * q;
    return ME.mc("pictorial", "analyze", "dividing a measure", rng, { n, q }, "How much does each bag hold?", card([`${Math.floor(total / 1000)} kg ${total % 1000} g of rice`, `shared equally into ${n} bags`]), `${Math.floor(q / 1000)} kg ${q % 1000} g`, [[`${Math.floor(total / 1000 / n)} kg ${Math.floor((total % 1000) / n)} g`, "m3-units"], [`${q} kg`, "m3-convert"], [`${Math.floor(q / 1000) + 1} kg ${q % 1000} g`, "m3-units"]]);
  },
  "pictorial|evaluate": (rng) => {
    const n = int(rng, 2, 9);
    const right = rng() < 0.5;
    return ME.mc("pictorial", "evaluate", "judge a claim", rng, { n, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${n} g = ${n * 1000} mg` : `Riya: ${n} g = ${n * 100} mg`]), right ? "Yes: 1 g = 1000 mg" : "No: 1 g = 1000 mg", [
      [right ? "No: 1 g = 100 mg" : "Yes: 1 g = 100 mg", "m3-convert"],
      ["No: 1 g = 10 mg", "m3-convert"],
      ["Yes: milligrams are bigger than grams", "m3-convert"],
    ]);
  },
  "abstract|remember": (rng) => {
    const mm = int(rng, 1100, 9900);
    if (mm % 1000 === 0) throw new Error("whole");
    return ME.mc("abstract", "remember", "millimetres to metres", rng, { mm }, `${fmt(mm)} mm = ___ m`, null, String(mm / 1000), [[String(mm / 100), "m3-convert"], [String(mm / 10), "m3-convert"], [String(mm * 1000), "m3-convert"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 3, 9), b = int(rng, 1, a - 1), x = 50 * int(rng, 1, 9), y = 50 * int(rng, x / 50 + 1, 19);
    const left = a * 1000 + x - b * 1000 - y;
    return ME.mc("abstract", "understand", "subtracting weights", rng, { a, b, x, y }, `${a} kg ${x} g − ${b} kg ${y} g = ___`, null, `${Math.floor(left / 1000)} kg ${left % 1000} g`, [[`${a - b} kg ${y - x} g`, "m3-borrow"], [`${a - b} kg ${x + 1000 - y} g`, "m3-borrow"], [`${a + b} kg ${x + y} g`, "m3-op"]]);
  },
  "abstract|apply": (rng) => {
    const m = int(rng, 2, 9), cm = int(rng, 10, 95), n = int(rng, 2, 6);
    const t = (m * 100 + cm) * n;
    return ME.mc("abstract", "apply", "multiplying lengths", rng, { m, cm, n }, `${m} m ${cm} cm × ${n} = ___`, null, `${Math.floor(t / 100)} m ${t % 100} cm`, [[`${m * n} m ${cm * n} cm`, "m3-units"], [`${m * n} m ${(cm * n) % 100} cm`, "m3-units"], [`${m + n} m ${cm} cm`, "m3-op"]]);
  },
  "abstract|analyze": (rng) => {
    const each = 50 * int(rng, 3, 9), L = int(rng, 2, 9);
    const n = Math.floor(L * 1000 / each);
    if (L * 1000 % each) throw new Error("not whole");
    return ME.mc("abstract", "analyze", "how many fit", rng, { each, L }, `How many ${each} mL cups can be filled from ${L} L?`, null, String(n), [[String(Math.floor(L * 100 / each) || 1), "m3-convert"], [String(L * each), "m3-op"], [String(n + 1), "m3-op"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 2, 6), b = 10 * int(rng, 150, 650);
    if (a * 1000 === b) throw new Error("equal");
    const big = a * 1000 > b ? `${a} kg` : `${fmt(b)} g`;
    return ME.mc("abstract", "evaluate", "comparing", rng, { a, b }, `Which is heavier: ${a} kg or ${fmt(b)} g?`, null, big, [[big === `${a} kg` ? `${fmt(b)} g` : `${a} kg`, "m3-convert"], ["They are equal", "m3-convert"], ["You can't compare kg and g", "m3-convert"]]);
  },
}));

// ---------------- Chapter 8: Perimeter and Area ----------------
const PA = kit("pa5", "perimeter-area");
export const AREA_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const l = int(rng, 3, 9), b = int(rng, 2, 7);
    if (l === b) throw new Error("square");
    return PA.shade("remember", "area of a rectangle", rng, { l, b }, `Shade a ${l} cm × ${b} cm rectangle (1 square = 1 sq cm).`, 7, 9, l * b, "1 square = 1 sq cm", [[2 * (l + b), "m4-area"], [l + b, "m4-area"]]);
  },
  "concrete|understand": (rng) => {
    const b = 2 * int(rng, 2, 4), h = int(rng, 2, 7);
    return PA.shade("understand", "area of a triangle", rng, { b, h }, `A triangle has base ${b} cm and height ${h} cm. Shade its area (1 square = 1 sq cm).`, 7, 9, b * h / 2, "1 square = 1 sq cm", [[b * h, "m5-triangle-area"], [b + h, "m4-area"]]);
  },
  "concrete|apply": (rng) => {
    const l = int(rng, 4, 20), b = int(rng, 2, 12);
    if (l === b) throw new Error("square");
    return PA.order("apply", "perimeter of a rectangle", rng, { l, b }, `Build the perimeter of a ${l} cm × ${b} cm rectangle.`, `2 × (${l} + ${b}) | = | ${2 * (l + b)} cm`, [`${l * b} cm`], [[`2 × (${l} + ${b}) = ${l * b} cm`, "m4-perimeter"]]);
  },
  "concrete|analyze": (rng) => {
    const s = int(rng, 3, 15);
    const line = [s * s, 4 * s, 2 * s, s + 4].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return PA.tap("analyze", "area of a square", rng, { s }, `A square has side ${s} cm. Tap its area (sq cm).`, line.sort(() => rng() - 0.5).join("   "), String(s * s), [{ phrase: String(4 * s), mistake: "m4-area" }]);
  },
  "concrete|evaluate": (rng) => {
    const b = int(rng, 4, 12), h = int(rng, 3, 10);
    return PA.tap("evaluate", "check a triangle's area", rng, { b, h }, "One number in this working is wrong. Tap it.", `Area of triangle = ${b} × ${h} = ${b * h} sq cm`, String(b * h));
  },
  "pictorial|remember": (rng) => {
    const l = int(rng, 5, 25), b = int(rng, 3, 15);
    if (l === b) throw new Error("square");
    return PA.mc("pictorial", "remember", "area of a rectangle", rng, { l, b }, "What is the area?", { kind: "shape", shape: "rectangle", sideLabels: [`${l} cm`, `${b} cm`] }, `${l * b} sq cm`, [[`${2 * (l + b)} sq cm`, "m4-area"], [`${l + b} sq cm`, "m4-area"], [`${l * b} cm`, "m3-units"]]);
  },
  "pictorial|understand": (rng) => {
    const b = 2 * int(rng, 2, 10), h = int(rng, 3, 15);
    return PA.mc("pictorial", "understand", "area of a triangle", rng, { b, h }, "What is the area of the triangle?", { kind: "shape", shape: "right-triangle", sideLabels: [`${h} cm`, `${b} cm`, ""] }, `${b * h / 2} sq cm`, [[`${b * h} sq cm`, "m5-triangle-area"], [`${b + h} sq cm`, "m4-area"], [`${b * h / 2} cm`, "m3-units"]]);
  },
  "pictorial|apply": (rng) => {
    const r = int(rng, 3, 6), c = int(rng, 4, 9), halves = 2 * int(rng, 1, 3);
    return PA.mc("pictorial", "apply", "area of an irregular shape", rng, { r, c, halves }, `An irregular shape covers the shaded full squares plus ${halves} half squares. What is its area?`, { kind: "grid", rows: r, cols: c, shadedCells: r * c - 2, compact: true }, `${r * c - 2 + halves / 2} sq units`, [[`${r * c - 2 + halves} sq units`, "m4-area"], [`${r * c - 2} sq units`, "m4-area"], [`${r * c} sq units`, "m4-area"]]);
  },
  "pictorial|analyze": (rng) => {
    const L = int(rng, 8, 15), B = int(rng, 6, 10), l = int(rng, 2, L - 4), b = int(rng, 2, B - 3);
    return PA.mc("pictorial", "analyze", "area of a composite shape", rng, { L, B, l, b }, "A smaller rectangle is cut out of a bigger one. What area is left?", card([`Big rectangle: ${L} cm × ${B} cm`, `Cut out: ${l} cm × ${b} cm`]), `${L * B - l * b} sq cm`, [[`${L * B + l * b} sq cm`, "m3-op"], [`${(L - l) * (B - b)} sq cm`, "m4-area"], [`${2 * (L + B) - 2 * (l + b)} sq cm`, "m4-perimeter"]]);
  },
  "pictorial|evaluate": (rng) => {
    const b = int(rng, 4, 12), h = int(rng, 3, 9);
    const right = rng() < 0.5;
    return PA.mc("pictorial", "evaluate", "judge an answer", rng, { b, h, r: right ? 1 : 0 }, `Riya says the triangle's area is ${right ? b * h / 2 : b * h} sq cm. Is she right?`, { kind: "shape", shape: "right-triangle", sideLabels: [`${h} cm`, `${b} cm`, ""] }, right ? "Yes: ½ × base × height" : "No: she forgot the ½", [
      [right ? "No: area = base × height" : "Yes: area = base × height", "m5-triangle-area"],
      ["No: area = base + height", "m4-area"],
      ["Yes: triangles and rectangles have the same area", "m5-triangle-area"],
    ]);
  },
  "abstract|remember": (rng) => {
    const i = int(rng, 0, 2);
    const q: [string, string, string[], string][] = [["Area of a rectangle = ___", "length × breadth", ["2 × (length + breadth)", "length + breadth", "4 × length"], "m4-area"], ["Area of a triangle = ___", "½ × base × height", ["base × height", "base + height", "2 × base × height"], "m5-triangle-area"], ["Perimeter of a square = ___", "4 × side", ["side × side", "2 × side", "side + 4"], "m4-perimeter"]];
    return PA.mc("abstract", "remember", "formulas", rng, { i }, q[i][0], null, q[i][1], q[i][2].map((t) => [t, q[i][3]] as [string, string]));
  },
  "abstract|understand": (rng) => {
    const A = int(rng, 4, 15) * int(rng, 3, 9), l = int(rng, 3, 15);
    if (A % l || A / l === l) throw new Error("no");
    return PA.mc("abstract", "understand", "missing side from area", rng, { A, l }, `A rectangle has area ${A} sq cm and length ${l} cm. Its breadth is ___`, null, `${A / l} cm`, [[`${A - l} cm`, "m4-area"], [`${A * l} cm`, "m4-area"], [`${A / 2 - l} cm`, "m4-perimeter"]].filter(([t]) => !t.startsWith("-") && t !== "0 cm") as [string, string][]);
  },
  "abstract|apply": (rng) => {
    const s = int(rng, 5, 30);
    return PA.mc("abstract", "apply", "area from perimeter", rng, { s }, `A square has perimeter ${4 * s} cm. Its area is ___`, null, `${s * s} sq cm`, [[`${4 * s * 4 * s} sq cm`, "m4-area"], [`${2 * s} sq cm`, "m4-area"], [`${s * 4} sq cm`, "m4-area"]]);
  },
  "abstract|analyze": (rng) => {
    const l = int(rng, 10, 30), b = int(rng, 6, 20), cost = int(rng, 5, 25);
    return PA.mc("abstract", "analyze", "cost of tiling", rng, { l, b, cost }, `A floor is ${l} m × ${b} m. Tiling costs ₹${cost} per sq m. What is the cost?`, null, `₹${fmt(l * b * cost)}`, [[`₹${fmt(2 * (l + b) * cost)}`, "m4-perimeter"], [`₹${fmt((l + b) * cost)}`, "m4-area"], [`₹${fmt(l * b)}`, "m3-op"]]);
  },
  "abstract|evaluate": (rng) => {
    const b = int(rng, 4, 20), h = int(rng, 3, 15);
    if ((b * h) % 2) throw new Error("odd");
    return PA.mc("abstract", "evaluate", "triangle and rectangle", rng, { b, h }, `A triangle and a rectangle share the same base ${b} cm and height ${h} cm. The triangle's area is ___`, null, `${b * h / 2} sq cm, half the rectangle's`, [[`${b * h} sq cm, the same as the rectangle's`, "m5-triangle-area"], [`${b * h * 2} sq cm, double the rectangle's`, "m5-triangle-area"], [`${b + h} sq cm`, "m4-area"]]);
  },
}));
