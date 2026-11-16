import { Rng, Template, build, buildActivity, int, pick } from "./core.js";

/**
 * Operations on Large Numbers, generated. One ladder: the four operations
 * with large numbers, built on place value.
 *   concrete  hands-on place-value chart: add, add with an exchange,
 *             subtract by breaking 1 into 10, make a number 10x / 100x bigger
 *   pictorial bar models drawn to scale (part-whole, comparison, equal
 *             units, "times as many")
 *   abstract  x10/x100, carrying, subtracting across zeros, order of
 *             operations, checking an answer by estimating
 * Wrong options are the results of real mistakes (adding without carrying,
 * taking the smaller digit from the larger, working left to right…),
 * computed from the numbers. Replaces a bank whose concrete level was
 * small times tables, whose estimation picture contradicted itself
 * (19 x 21 grid, 190 shaded) and whose levels tested unrelated skills.
 */

const TOPIC = "operations-large-numbers";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "ops-forgets-carry": {
    label: "Forgets to carry",
    detail: "Adds each column but drops the 1 carried into the next column (7 + 5 written as 2, nothing carried).",
    childTip: "When a column adds up to 10 or more, write the ones and carry the ten to the next column.",
  },
  "ops-smaller-from-larger": {
    label: "Takes the smaller digit from the larger",
    detail: "In each column subtracts whichever digit is smaller from the larger, instead of exchanging (3 − 7 becomes 7 − 3).",
    childTip: "If the top digit is smaller, exchange 1 from the next column first.",
  },
  "ops-borrow-across-zero": {
    label: "Can't exchange across zeros",
    detail: "Subtracting from a number like 503,000, doesn't exchange through the zeros correctly.",
    childTip: "Across zeros, exchange from the first non-zero column and pass it along: 500 becomes 4 hundreds, 9 tens, 10 ones.",
  },
  "ops-wrong-operation": {
    label: "Picks the wrong operation",
    detail: "Adds when the situation needs subtracting (or the reverse), e.g. finding a missing part by adding.",
    childTip: "Ask: do I know the whole? If so, the missing part is the whole take away the other part.",
  },
  "ops-left-to-right": {
    label: "Works left to right",
    detail: "In 250 + 40 × 2, adds first instead of multiplying first.",
    childTip: "Multiply and divide before you add and subtract.",
  },
  "ops-zeros-wrong": {
    label: "Wrong number of zeros",
    detail: "Multiplying or dividing by 10, 100 or 1,000 moves the digits the wrong number of places.",
    childTip: "×10 moves every digit one place bigger; ×100 two places; ÷ moves them smaller.",
  },
  "ops-units-miscounted": {
    label: "Miscounts the units in a bar model",
    detail: "For 'A is 3 times B, together 240', divides by 3 instead of 4 (forgets B's own unit).",
    childTip: "Count every equal unit in the whole bar model before dividing.",
  },
  "ops-wrong-column": {
    label: "Adds in the wrong place",
    detail: "Puts the added or taken amount in the wrong column (10 times too big or small).",
    childTip: "Line up the places: thousands under thousands.",
  },
  "ops-accepts-unreasonable": {
    label: "Doesn't check the size of an answer",
    detail: "Accepts an answer far too big or small instead of estimating first.",
    childTip: "Round the numbers and estimate first, so you know roughly what to expect.",
  },
  "ops-estimate-off": {
    label: "Estimates with the wrong rounding",
    detail: "Rounds to the wrong place, or uses awkward numbers, so the estimate is off by a factor of 10.",
    childTip: "Round each number to one non-zero digit, then calculate.",
  },
};

const fmt = (n: number) => n.toLocaleString("en-US");
const SIX = [100000, 10000, 1000, 100, 10, 1];
const NAMES = ["Priya", "Arjun", "Meera", "Kabir", "Ananya", "Rohan", "Zara", "Ishaan", "Diya", "Vihaan", "Sara", "Aditya"] as const;
const digits = (n: number) => SIX.map((p) => Math.floor(n / p) % 10);

/** Column-by-column sum with no carrying: the "forgets to carry" answer. */
export function addNoCarry(a: number, b: number): number {
  return SIX.reduce((s, p) => s + ((Math.floor(a / p) % 10 + Math.floor(b / p) % 10) % 10) * p, 0);
}
/** Column-by-column |difference|: the "smaller from larger" answer. */
export function subSmallerFromLarger(a: number, b: number): number {
  return SIX.reduce((s, p) => s + Math.abs((Math.floor(a / p) % 10) - (Math.floor(b / p) % 10)) * p, 0);
}
/** True when adding a + b needs at least one carry. */
const carries = (a: number, b: number) => addNoCarry(a, b) !== a + b;
/** True when a − b needs at least one exchange. */
const exchanges = (a: number, b: number) => subSmallerFromLarger(a, b) !== a - b;

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, n: number, rng: Rng) {
  return { id: `op-g-${cell}-${n}-${Math.floor(rng() * 1e6).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
/** A round-ish number with `sig` significant digits below 1,000,000. */
function roundish(rng: Rng, lo: number, hi: number, step: number): number {
  return int(rng, Math.ceil(lo / step), Math.floor(hi / step)) * step;
}
const chart = (start: number, target: number, wrong: { value: number; mistake: string }[]) => ({
  kind: "place-value" as const,
  mode: "change" as const,
  columns: SIX,
  start: digits(start),
  target,
  // Drop impossible results and ones equal to the right answer; if two
  // mistakes give the same number, it can't tell them apart: keep the first.
  wrong: wrong.filter((w, i) => w.value !== target && w.value >= 0 && w.value < 1000000 && wrong.findIndex((x) => x.value === w.value) === i),
});
const THINGS = [
  ["visitors to a fair", "visitors"],
  ["books in a library", "books"],
  ["seeds in a farm store", "seeds"],
  ["tickets sold", "tickets"],
  ["steps walked in a month", "steps"],
  ["bricks for a building", "bricks"],
] as const;

export const OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: hands-on place-value chart ----------------
  "concrete|remember": (rng) => {
    // Add with no exchanging.
    for (;;) {
      const a = roundish(rng, 110000, 780000, 10000);
      const b = roundish(rng, 11000, 99000, 1000);
      if (carries(a, b) || a + b >= 1000000) continue;
      return buildActivity(
        { ...base("c-remember", "concrete", "remember", "addition", a + b, rng), prompt: `The chart shows ${fmt(a)}. Add ${fmt(b)} to it.`, representation: null },
        { a, b },
        chart(a, a + b, [{ value: a + b * 10, mistake: "ops-wrong-column" }, { value: a + b / 10, mistake: "ops-wrong-column" }])
      );
    }
  },

  "concrete|understand": (rng) => {
    // Add with an exchange (10 discs -> 1 in the next column).
    for (;;) {
      const a = roundish(rng, 110000, 880000, 1000);
      const b = roundish(rng, 2000, 98000, 1000);
      if (!carries(a, b) || a + b >= 1000000) continue;
      return buildActivity(
        { ...base("c-understand", "concrete", "understand", "addition", a + b, rng), prompt: `The chart shows ${fmt(a)}. Add ${fmt(b)} to it. If a column gets 10 or more, exchange.`, representation: null },
        { a, b },
        chart(a, a + b, [{ value: addNoCarry(a, b), mistake: "ops-forgets-carry" }, { value: a + b * 10, mistake: "ops-wrong-column" }])
      );
    }
  },

  "concrete|apply": (rng) => {
    // Subtract with breaking 1 into 10.
    for (;;) {
      const a = roundish(rng, 210000, 980000, 1000);
      const b = roundish(rng, 2000, 99000, 1000);
      if (!exchanges(a, b) || b >= a) continue;
      return buildActivity(
        { ...base("c-apply", "concrete", "apply", "subtraction", a - b, rng), prompt: `The chart shows ${fmt(a)}. Take away ${fmt(b)}. If a column hasn't enough, break 1 from the next column into 10.`, representation: null },
        { a, b },
        chart(a, a - b, [{ value: subSmallerFromLarger(a, b), mistake: "ops-smaller-from-larger" }, { value: a + b, mistake: "ops-wrong-operation" }])
      );
    }
  },

  "concrete|analyze": (rng) => {
    // Make a number 10 or 100 times bigger: every disc moves up.
    const f = pick(rng, [10, 100]);
    const n = f === 10 ? int(rng, 101, 99999) : int(rng, 101, 9999);
    if (n * f >= 1000000 || n % 10 === 0) return OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES["concrete|analyze"](rng);
    return buildActivity(
      { ...base("c-analyze", "concrete", "analyze", "multiply-by-10-100", n, rng), prompt: `The chart shows ${fmt(n)}. Change it to show ${fmt(n)} × ${f}.`, representation: null },
      { a: n, f },
      chart(n, n * f, [{ value: n * (f === 10 ? 100 : 10), mistake: "ops-zeros-wrong" }, { value: n + f, mistake: "ops-wrong-operation" }])
    );
  },

  "concrete|evaluate": (rng) => {
    // A claim about subtracting across zeros, checked on the chart.
    const h = int(rng, 3, 9);
    const a = h * 100000;
    const b = int(rng, 1, 9) * 1000 + int(rng, 1, 9) * 100;
    const right = a - b;
    const wrong = subSmallerFromLarger(a, b);
    const truthful = rng() < 0.5;
    const claimed = truthful ? right : wrong;
    const name = pick(rng, NAMES);
    return {
      ...build(
        {
          ...base("c-evaluate", "concrete", "evaluate", "subtraction", a + b, rng),
          prompt: `${name} says ${fmt(a)} − ${fmt(b)} = ${fmt(claimed)}. Check on the chart. Is ${name} right?`,
          representation: null,
        },
        { a, b },
        truthful ? `Yes: ${fmt(a)} − ${fmt(b)} is ${fmt(right)}` : `No: it's ${fmt(right)}, after exchanging through the zeros`,
        [
          truthful
            ? { text: `No: it's ${fmt(wrong)}`, mistake: "ops-smaller-from-larger" }
            : { text: `Yes: take each small digit from the zero`, mistake: "ops-smaller-from-larger" },
          { text: `${truthful ? "No" : "Yes"}: you can't take away from zeros, so the answer is ${fmt(a)}`, mistake: "ops-borrow-across-zero" },
          { text: `No: it's ${fmt(right + 10000)}`, mistake: "ops-borrow-across-zero" },
          { text: `No: it's ${fmt(right - 1000)}`, mistake: null },
        ]
      ),
      activity: { kind: "place-value", mode: "change", columns: SIX, start: digits(a), target: right },
    };
  },

  // ---------------- PICTORIAL: bar models, to scale ----------------
  "pictorial|remember": (rng) => {
    // Part-whole: two parts known, whole unknown.
    const [what, unit] = pick(rng, THINGS);
    const p = roundish(rng, 120000, 480000, 1000);
    const q = roundish(rng, 110000, 470000, 1000);
    return build(
      {
        ...base("p-remember", "pictorial", "remember", "part-whole", p + q, rng),
        prompt: `The bar model shows ${what} on two days. Which calculation finds the total?`,
        representation: { kind: "bars", bars: [{ name: "", parts: [{ value: p, label: fmt(p) }, { value: q, label: fmt(q) }] }], brace: { label: "?" } },
      },
      { p, q },
      `${fmt(p)} + ${fmt(q)}`,
      [
        { text: `${fmt(Math.max(p, q))} − ${fmt(Math.min(p, q))}`, mistake: "ops-wrong-operation" },
        { text: `${fmt(p)} × ${fmt(q)}`, mistake: "ops-wrong-operation" },
        { text: `${fmt(Math.max(p, q))} ÷ 2`, mistake: "ops-wrong-operation" },
      ]
    );
  },

  "pictorial|understand": (rng) => {
    // Part-whole: whole and one part known, other part unknown.
    const [what] = pick(rng, THINGS);
    const whole = roundish(rng, 300000, 950000, 1000);
    const p = roundish(rng, 100000, whole - 100000, 1000);
    const q = whole - p;
    if (q === p) return OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES["pictorial|understand"](rng); // the answer would be printed on the other part
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "part-whole", whole, rng),
        prompt: `The bar model shows ${what}. How many in the part marked "?"`,
        representation: { kind: "bars", bars: [{ name: "", parts: [{ value: p, label: fmt(p) }, { value: q, label: "?" }] }], brace: { label: fmt(whole) } },
      },
      { whole, p },
      fmt(q),
      [
        { text: fmt(whole + p), mistake: "ops-wrong-operation" },
        { text: fmt(subSmallerFromLarger(whole, p)), mistake: "ops-smaller-from-larger" },
        { text: fmt(q + 10000), mistake: null },
        { text: fmt(Math.abs(q - 10000)), mistake: null },
      ]
    );
  },

  "pictorial|apply": (rng) => {
    // Comparison: two bars, how many more?
    for (;;) {
      const [unit, place] = pick(rng, [["visitors", "Fair"], ["books", "Library"], ["tickets", "Cinema"], ["seeds", "Farm"], ["bricks", "Factory"]] as const);
      const big = roundish(rng, 300000, 900000, 100);
      const small = roundish(rng, 100000, big - 50000, 100);
      if (!exchanges(big, small) || big - small === small) continue; // difference mustn't equal a printed bar
      const nameA = `${place} A`;
      const nameB = `${place} B`;
      return build(
        {
          ...base("p-apply", "pictorial", "apply", "comparison", big, rng),
          prompt: `The bars compare the number of ${unit} at ${nameA} and ${nameB}. How many more ${unit} at ${nameA}?`,
          representation: {
            kind: "bars",
            bars: [
              { name: nameA, parts: [{ value: big, label: fmt(big) }] },
              { name: nameB, parts: [{ value: small, label: fmt(small) }, { value: big - small, label: "?", ghost: true }] },
            ],
          },
        },
        { big, small },
        fmt(big - small),
        [
          { text: fmt(subSmallerFromLarger(big, small)), mistake: "ops-smaller-from-larger" },
          { text: fmt(big + small), mistake: "ops-wrong-operation" },
          { text: fmt(big - small + 1000), mistake: null },
          { text: fmt(big - small - 1000), mistake: null },
        ]
      );
    }
  },

  "pictorial|analyze": (rng) => {
    // Equal units: total known, find one unit (division).
    const k = int(rng, 3, 8);
    const unitV = roundish(rng, 12000, 120000, 1000);
    const total = k * unitV;
    if (total >= 1000000) return OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES["pictorial|analyze"](rng);
    const [what] = pick(rng, THINGS);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "equal-units", total, rng),
        prompt: `${fmt(total)} ${what.split(" ")[0]} are split into ${k} equal parts, as the bar model shows. How many in each part?`,
        representation: { kind: "bars", bars: [{ name: "", parts: Array.from({ length: k }, (_, i) => ({ value: 1, label: i === 0 ? "?" : "" })) }], brace: { label: fmt(total) } },
      },
      { total, k },
      fmt(unitV),
      [
        { text: fmt(total * k), mistake: "ops-wrong-operation" },
        { text: fmt(total - k), mistake: "ops-wrong-operation" },
        { text: fmt(unitV * 10), mistake: "ops-zeros-wrong" },
        { text: fmt(Math.round(unitV / 10)), mistake: "ops-zeros-wrong" },
      ]
    );
  },

  "pictorial|evaluate": (rng) => {
    // "A is k times as many as B; together N." B = N / (k + 1).
    const k = int(rng, 2, 5);
    const b = roundish(rng, 20000, 150000, 1000);
    const total = b * (k + 1);
    if (total >= 1000000) return OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES["pictorial|evaluate"](rng);
    const name = pick(rng, NAMES);
    const wrongB = Math.round(total / k);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "times-as-many", total, rng),
        prompt: `Shop A sold ${k} times as many tickets as Shop B: ${fmt(total)} altogether. ${name} says Shop B sold ${fmt(wrongB)}. Is ${name} right?`,
        representation: {
          kind: "bars",
          bars: [
            { name: "Shop A", parts: Array.from({ length: k }, () => ({ value: 1, label: "" })) },
            { name: "Shop B", parts: [{ value: 1, label: "?" }] },
          ],
          brace: { label: fmt(total) },
        },
      },
      { total, k },
      `No: there are ${k + 1} equal units, so Shop B sold ${fmt(b)}`,
      [
        { text: `Yes: ${fmt(total)} ÷ ${k} = ${fmt(wrongB)}`, mistake: "ops-units-miscounted" },
        { text: `No: Shop B sold ${fmt(total * k)}`, mistake: "ops-wrong-operation" },
        { text: `No: half of ${fmt(total)}, so ${fmt(total / 2)}`, mistake: "ops-units-miscounted" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const f = pick(rng, [10, 100, 1000]);
    const n = int(rng, 12, 980) * (f === 1000 ? 1 : int(rng, 1, 9));
    if (n * f >= 10000000 || n % 10 === 0) return OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES["abstract|remember"](rng);
    const divide = rng() < 0.4;
    const big = n * f;
    return build(
      { ...base("a-remember", "abstract", "remember", "multiply-by-10-100", big, rng), prompt: divide ? `${fmt(big)} ÷ ${fmt(f)} = ?` : `${fmt(n)} × ${fmt(f)} = ?`, representation: null },
      { n, f, d: divide ? 1 : 0 },
      fmt(divide ? n : big),
      divide
        ? [
            { text: fmt(n * 10), mistake: "ops-zeros-wrong" },
            { text: fmt(big / 10 === n ? n * 100 : big / 10), mistake: "ops-zeros-wrong" },
            { text: fmt(big - f), mistake: "ops-wrong-operation" },
            { text: fmt(Math.max(1, Math.round(n / 10))), mistake: "ops-zeros-wrong" },
          ]
        : [
            { text: fmt(big * 10), mistake: "ops-zeros-wrong" },
            { text: fmt(big / 10), mistake: "ops-zeros-wrong" },
            { text: fmt(n + f), mistake: "ops-wrong-operation" },
          ]
    );
  },

  "abstract|understand": (rng) => {
    // Add with carrying.
    for (;;) {
      const a = int(rng, 100000, 699999);
      const b = int(rng, 100000, 299999);
      if (!carries(a, b) || a + b >= 1000000) continue;
      return build(
        { ...base("a-understand", "abstract", "understand", "addition", a + b, rng), prompt: `${fmt(a)} + ${fmt(b)} = ?`, representation: null },
        { a, b },
        fmt(a + b),
        [
          { text: fmt(addNoCarry(a, b)), mistake: "ops-forgets-carry" },
          { text: fmt(a + b + 10000), mistake: null },
          { text: fmt(a + b - 1000), mistake: null },
          { text: fmt(Math.abs(a - b)), mistake: "ops-wrong-operation" },
        ]
      );
    }
  },

  "abstract|apply": (rng) => {
    // Subtract across zeros.
    for (;;) {
      const a = int(rng, 2, 9) * 100000 + int(rng, 0, 9) * 1000 * (rng() < 0.5 ? 0 : 1);
      const b = int(rng, 10000, 99999);
      if (b >= a || !exchanges(a, b)) continue;
      return build(
        { ...base("a-apply", "abstract", "apply", "subtraction", a - b, rng), prompt: `${fmt(a)} − ${fmt(b)} = ?`, representation: null },
        { a, b },
        fmt(a - b),
        [
          { text: fmt(subSmallerFromLarger(a, b)), mistake: "ops-smaller-from-larger" },
          { text: fmt(a - b + 10000), mistake: "ops-borrow-across-zero" },
          { text: fmt(a - b + 1000), mistake: "ops-borrow-across-zero" },
          { text: fmt(a + b), mistake: "ops-wrong-operation" },
        ]
      );
    }
  },

  "abstract|analyze": (rng) => {
    // Order of operations: a + b × c  or  a − b × c.
    const plus = rng() < 0.6;
    const b = roundish(rng, 2000, 90000, 1000);
    const c = int(rng, 2, 9);
    const a = roundish(rng, plus ? 10000 : b * c + 10000, plus ? 500000 : b * c + 500000, 1000);
    const right = plus ? a + b * c : a - b * c;
    const ltr = plus ? (a + b) * c : (a - b) * c;
    if (right === a || right === b) return OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES["abstract|analyze"](rng);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "order-of-operations", right, rng), prompt: `${fmt(a)} ${plus ? "+" : "−"} ${fmt(b)} × ${c} = ?`, representation: null },
      { a, b, c, plus: plus ? 1 : 0 },
      fmt(right),
      [
        { text: fmt(ltr), mistake: "ops-left-to-right" },
        { text: fmt(plus ? a + b + c : a - b - c), mistake: "ops-wrong-operation" },
        { text: fmt(plus ? a + b * c * 10 : Math.abs(a - b * c * 10)), mistake: "ops-zeros-wrong" },
        { text: fmt(right + 1000), mistake: null },
      ]
    );
  },

  "abstract|evaluate": (rng) => {
    // Is a claimed product sensible? Check by estimating.
    const a = int(rng, 1100, 9800);
    const b = int(rng, 11, 89);
    const real = a * b;
    const lead = (n: number) => Number(String(n)[0]) * 10 ** (String(n).length - 1);
    const est = lead(a) * Math.round(b / 10) * 10;
    const truthful = rng() < 0.4;
    const claimed = truthful ? real : rng() < 0.5 ? Math.round(real / 10) : real * 10;
    const name = pick(rng, NAMES);
    return build(
      {
        ...base("a-evaluate", "abstract", "evaluate", "estimation", real, rng),
        prompt: `${name} worked out ${fmt(a)} × ${b} = ${fmt(claimed)}. Without working it out exactly, is that sensible?`,
        representation: null,
      },
      { a, b, claimed },
      truthful ? `Yes: about ${fmt(lead(a))} × ${Math.round(b / 10) * 10} = ${fmt(est)}, so it's about the right size` : `No: about ${fmt(lead(a))} × ${Math.round(b / 10) * 10} = ${fmt(est)}, so it's ${claimed > real ? "far too big" : "far too small"}`,
      [
        truthful
          ? { text: `No: multiplying by ${b} should give a much bigger number`, mistake: "ops-estimate-off" }
          : { text: `Yes: it has about the right digits`, mistake: "ops-accepts-unreasonable" },
        { text: `${truthful ? "No" : "Yes"}: about ${fmt(lead(a))} × ${b} ≈ ${fmt(lead(a) * b * (truthful ? 10 : 1))}`, mistake: "ops-estimate-off" },
        { text: `You can't tell without working it out exactly`, mistake: "ops-accepts-unreasonable" },
      ]
    );
  },
};

/** Independent answer check for the stress test. */
export function verify(item: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const right = item.choices.find((c) => c.id === item.correctChoiceId)?.text ?? "";
  const p = item.params;
  const num = (t: string) => Number(t.replace(/,/g, ""));
  switch (`${item.cpa}|${item.bloom}`) {
    case "pictorial|understand":
      return num(right) === p.whole - p.p ? null : `missing part wrong: ${right}`;
    case "pictorial|apply":
      return num(right) === p.big - p.small ? null : `difference wrong: ${right}`;
    case "pictorial|analyze":
      return num(right) * p.k === p.total ? null : `unit wrong: ${right}`;
    case "pictorial|evaluate":
      return right.includes(fmt(p.total / (p.k + 1))) ? null : `Shop B should be ${p.total / (p.k + 1)}: ${right}`;
    case "abstract|remember":
      return num(right) === (p.d ? p.n : p.n * p.f) ? null : `×/÷ wrong: ${right}`;
    case "abstract|understand":
      return num(right) === p.a + p.b ? null : `sum wrong: ${right}`;
    case "abstract|apply":
      return num(right) === p.a - p.b ? null : `difference wrong: ${right}`;
    case "abstract|analyze":
      return num(right) === (p.plus ? p.a + p.b * p.c : p.a - p.b * p.c) ? null : `order of operations wrong: ${right}`;
    case "abstract|evaluate": {
      const sensible = p.claimed === p.a * p.b;
      return right.startsWith(sensible ? "Yes" : "No") ? null : `sensible=${sensible} but answer "${right}"`;
    }
  }
  return null;
}
