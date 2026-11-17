import { Rng, Template, build, buildActivity, fmt, gradeNow, int, pick } from "./core.js";

/**
 * More on Large Numbers, generated. One ladder built on place value, which
 * reading, writing, comparing and rounding all rest on:
 *   concrete  hands-on place-value chart (build, regroup, change a number)
 *   pictorial discs drawn in columns; number lines with an unlabelled arrow
 *   abstract  digit values, number words, rounding, comparing
 * Numbers and number names follow the school's books: Indian grouping
 * (37,82,410) and lakhs/crores. Grade 4 (book chapter 1) goes up to
 * 9,99,999 and adds face value, largest/smallest numbers from given digits,
 * rounding to tens/hundreds/thousands and Roman numerals.
 * Replaces a hand-written bank whose pictures gave answers away (legends
 * named the disc values; number lines printed the number to be read) and
 * whose levels tested unrelated skills.
 */

const TOPIC = "more-large-numbers";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "lnum-face-value": {
    label: "Gives the digit, not its value",
    detail: "Answers 7 for the place value of the 7 in 37,82,410 (its place value is 7,00,000).",
    childTip: "A digit's value depends on its place: the 7 in 37,82,410 is worth 7,00,000.",
  },
  "lnum-wrong-place": {
    label: "Reads the wrong place",
    detail: "Takes a digit's value from the place next door (70,000 instead of 7,00,000).",
    childTip: "Count the places from the right: ones, tens, hundreds, thousands…",
  },
  "lnum-drops-zero": {
    label: "Leaves out place-holding zeros",
    detail: "Writes 3,05,020 as 35,020 or 3,520: empty places are skipped instead of filled with 0.",
    childTip: "An empty column still needs a 0, or every digit slides into the wrong place.",
  },
  "lnum-extra-zero": {
    label: "Adds an extra zero",
    detail: "Writes one zero too many (50,00,003 for 5,00,003), moving digits a place too far.",
    childTip: "Count the places you need before writing the zeros.",
  },
  "lnum-shifts-place": {
    label: "Puts digits one place off",
    detail: "Builds or writes the number ten times too big or too small.",
    childTip: "Check which column each digit belongs in before you start.",
  },
  "lnum-reads-backwards": {
    label: "Reads the columns the wrong way round",
    detail: "Reads the place-value chart from the ones end, reversing the digits.",
    childTip: "Read a number from its biggest place (the left) to the ones.",
  },
  "lnum-counts-discs": {
    label: "Counts discs, not their values",
    detail: "Treats more discs as a bigger number, ignoring which column they're in.",
    childTip: "One disc in a big column can be worth more than many in a small one.",
  },
  "lnum-no-regroup": {
    label: "Doesn't exchange tens",
    detail: "Leaves 10 or more discs in a column instead of exchanging 10 for 1 in the next place.",
    childTip: "Ten in one place make one in the next place to the left.",
  },
  "lnum-changes-value": {
    label: "Changes the number while regrouping",
    detail: "Exchanges discs unevenly (e.g. 10 for 10 in the next place), so the number changes.",
    childTip: "Swap exactly 10 discs for 1 disc in the next column, nothing else.",
  },
  "lnum-wrong-column": {
    label: "Adds in the wrong place",
    detail: "Asked to add 10,000, adds 1,000 or 100,000 instead.",
    childTip: "Find the column that matches the amount before adding.",
  },
  "lnum-forgets-carry": {
    label: "Forgets to carry",
    detail: "When a column goes past 9, drops the extra instead of carrying 1 to the next place.",
    childTip: "When a column reaches 10, it becomes 0 and the next column gets one more.",
  },
  "lnum-misreads-scale": {
    label: "Misreads the number line's steps",
    detail: "Reads each small step as the wrong amount (1,000 instead of 10,000).",
    childTip: "Work out what each small step is worth from the labelled numbers first.",
  },
  "lnum-rounds-wrong-way": {
    label: "Rounds the wrong way",
    detail: "Always rounds down (or up) instead of to the nearer multiple.",
    childTip: "Round to whichever end is nearer.",
  },
  "lnum-rounds-wrong-place": {
    label: "Rounds to the wrong place",
    detail: "Rounds to the nearest thousand when asked for the nearest ten thousand (or similar).",
    childTip: "Underline the place you're rounding to, then look at the digit just right of it.",
  },
  "lnum-halfway-down": {
    label: "Rounds halfway numbers down",
    detail: "Exactly halfway (4,55,000 to the nearest ten thousand) rounds up by convention; they round down or leave it.",
    childTip: "Exactly halfway always rounds up.",
  },
  "lnum-compares-wrong-end": {
    label: "Compares from the wrong end",
    detail: "Compares numbers by their last digits or by which digits appear, not from the biggest place.",
    childTip: "Compare from the left: the first place where the digits differ decides.",
  },
  "lnum-words-group": {
    label: "Mixes up the number-word groups",
    detail: "Reads a group in the wrong place, e.g. says 'fifty thousand' for 5,000 inside a number.",
    childTip: "Mark the groups from the right: 3 digits (hundreds), then 2 at a time (thousands, lakhs, crores). Name each group.",
  },
  "lnum-place-for-face": {
    label: "Mixes up face value and place value",
    detail: "Asked for the face value of a digit (the digit itself), gives its place value.",
    childTip: "Face value is just the digit. Place value is what it is worth in its place.",
  },
  "lnum-zero-first": {
    label: "Puts 0 first",
    detail: "Making the smallest number from given digits, starts with 0, which leaves a number with one digit fewer.",
    childTip: "A number can't start with 0. Put the smallest digit that isn't 0 first, then the 0.",
  },
  "lnum-largest-smallest": {
    label: "Mixes up largest and smallest",
    detail: "Orders the digits the wrong way round (smallest first when the largest number was asked for, or the reverse).",
    childTip: "For the largest number, put the biggest digit in the biggest place.",
  },
  "roman-repeats": {
    label: "Repeats a Roman letter 4 times",
    detail: "Writes 40 as XXXX or 4 as IIII; a Roman letter is never repeated more than 3 times in a row.",
    childTip: "No letter more than 3 times in a row: 4 is IV (one before five), 40 is XL.",
  },
  "roman-order": {
    label: "Puts the smaller Roman letter on the wrong side",
    detail: "Writes 40 as LX (that is 60): a smaller letter after a bigger one adds, before it takes away.",
    childTip: "Smaller letter before a bigger one: take away (IX = 9). After it: add (XI = 11).",
  },
};

const PLACES = [1000000, 100000, 10000, 1000, 100, 10, 1];
const PLACE_NAME: Record<number, string> = { 1000000: "ten lakhs", 100000: "lakhs", 10000: "ten thousands", 1000: "thousands", 100: "hundreds", 10: "tens", 1: "ones" };
const SHORT: Record<number, string> = { 1000000: "TL", 100000: "L", 10000: "TTh", 1000: "Th", 100: "H", 10: "T", 1: "O" };
const NAMES = ["Priya", "Arjun", "Meera", "Kabir", "Ananya", "Rohan", "Zara", "Ishaan", "Diya", "Vihaan", "Sara", "Aditya"] as const;

const digitsOf = (n: number, cols: number[]) => cols.map((p) => Math.floor(n / p) % 10);
const valueOf = (counts: number[], cols: number[]) => counts.reduce((s, c, i) => s + c * cols[i], 0);
/** The number with its zeros squeezed out (305,020 -> 3,520): the "drops zero" mistake. */
export function dropZeros(n: number): number {
  const s = String(n);
  const lead = s[0];
  const rest = s.slice(1).replace(/0/g, "");
  return Number(lead + rest);
}

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function under100(n: number): string {
  return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : "");
}
function under1000(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${ONES[h]} hundred`);
  if (r) parts.push(under100(r));
  return parts.join(" ");
}
/** Indian number names, as the books write them: 40,50,900 -> "Forty lakh fifty thousand nine hundred". */
export function words(n: number): string {
  if (n === 0) return "Zero";
  const groups = [
    [Math.floor(n / 1e7), "crore"],
    [Math.floor(n / 1e5) % 100, "lakh"],
    [Math.floor(n / 1e3) % 100, "thousand"],
  ] as const;
  const out: string[] = groups.filter(([g]) => g).map(([g, name]) => `${g < 100 ? under100(g) : under1000(g)} ${name}`);
  if (n % 1000) out.push(under1000(n % 1000));
  const s = out.join(" ");
  return s[0].toUpperCase() + s.slice(1);
}

/** Roman numerals 1-100 (I, V, X, L, C), as Grade 4 uses them. */
export function roman(n: number): string {
  const table: [number, string][] = [[100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  for (const [v, r] of table) while (n >= v) { out += r; n -= v; }
  return out;
}
/** The "repeat 4 times" mistake: 44 -> XXXXIIII, 49 -> XXXXVIIII. */
function romanRepeats(n: number): string {
  const table: [number, string][] = [[100, "C"], [50, "L"], [10, "X"], [5, "V"], [1, "I"]];
  let out = "";
  for (const [v, r] of table) while (n >= v) { out += r; n -= v; }
  return out;
}
/** The "wrong side" mistake: subtractive pairs written backwards (XL -> LX, IV -> VI). */
function romanBackwards(n: number): string {
  return roman(n).replace(/XC|XL|IX|IV/g, (p) => p[1] + p[0]);
}

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, n: number, rng: Rng) {
  return { id: `ln-g-${cell}-${n}-${Math.floor(rng() * 1e6).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
/** A number with `len` digits, a non-zero first digit, and `zeros` zero digits somewhere after it. */
function numberWith(rng: Rng, len: number, zeros: number): number {
  for (;;) {
    const d = [int(rng, 1, 9), ...Array.from({ length: len - 1 }, () => int(rng, 1, 9))];
    const spots = new Set<number>();
    while (spots.size < zeros) spots.add(int(rng, 1, len - 1));
    spots.forEach((i) => (d[i] = 0));
    const n = Number(d.join(""));
    if (String(n).length === len) return n;
  }
}

const SIX = PLACES.slice(1); // lakhs … ones
/**
 * Both grades use the 6-column chart (lakhs … ones): the Grade 4 book goes
 * up to 9,99,999. G() and D() are 1 and 0 for the place-value questions; only
 * rounding (Grade 4: to the nearest thousand, Grade 5: ten thousand) is one
 * place smaller at Grade 4, through R().
 */
const G = () => 1;
const D = () => 0;
const R = () => (gradeNow() === 4 ? 10 : 1);
const BIG = () => PLACE_NAME[100000];
const SMALL = () => PLACE_NAME[10000];
const COLS = () => SIX;

export const MORE_ON_LARGE_NUMBERS_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: hands-on place-value chart ----------------
  "concrete|remember": (rng) => {
    // Two non-zero places side by side, e.g. 240,000.
    const top = pick(rng, [(100000 / G()), (10000 / G()), (1000 / G())]);
    const n = int(rng, 1, 9) * top + int(rng, 1, 9) * (top / 10);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "place-value", n, rng), prompt: `Build the number ${fmt(n)} on the place-value chart.`, representation: null },
      { n },
      { kind: "place-value", mode: "build", columns: COLS(), start: COLS().map(() => 0), target: n }
    );
  },

  "concrete|understand": (rng) => {
    // Zeros in the middle: the classic place-holder trap.
    const n = numberWith(rng, 6 - D(), int(rng, 2, 3));
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "place-value", n, rng), prompt: `Build the number ${fmt(n)} on the place-value chart.`, representation: null },
      { n },
      { kind: "place-value", mode: "build", columns: COLS(), start: COLS().map(() => 0), target: n }
    );
  },

  "concrete|apply": (rng) => {
    // One column has 10-18 discs; regroup so every column has 9 or fewer.
    for (;;) {
      const n = numberWith(rng, 6 - D(), int(rng, 0, 1));
      const d = digitsOf(n, COLS());
      const i = int(rng, 1, 4); // column to overfill (not the biggest, not the ones)
      if (d[i - 1] === 0) continue;
      const start = [...d];
      start[i - 1] -= 1;
      start[i] += 10;
      return buildActivity(
        {
          ...base("c-apply", "concrete", "apply", "regrouping", n, rng),
          prompt: `The chart has ${start[i]} discs in the ${PLACE_NAME[COLS()[i]]} column. Exchange 10 discs for 1 in the next column until every column has 9 or fewer, without changing the number.`,
          representation: null,
        },
        { n },
        { kind: "place-value", mode: "regroup", columns: COLS(), start, target: n }
      );
    }
  },

  "concrete|analyze": (rng) => {
    // Add one in a place that holds a 9, so it has to carry.
    for (;;) {
      const p = pick(rng, [(10000 / G()), (1000 / G()), 100]);
      const x = numberWith(rng, 6 - D(), 0);
      const d = digitsOf(x, COLS());
      const i = COLS().indexOf(p);
      d[i] = 9;
      const start = d;
      const from = valueOf(start, COLS());
      const target = from + p;
      if (target >= (1000000 / G())) continue;
      return buildActivity(
        {
          ...base("c-analyze", "concrete", "analyze", "regrouping", from, rng),
          prompt: `The chart shows ${fmt(from)}. Change it to show ${fmt(p)} more.`,
          representation: null,
        },
        { n: from, p },
        { kind: "place-value", mode: "change", columns: COLS(), start, target }
      );
    }
  },

  "concrete|evaluate": (rng) => {
    // A claim about regrouping, checked by trying it on the chart.
    const h = int(rng, 1, 7);
    const t = int(rng, 11, 18);
    const real = (h + 1) * (100000 / G()) + (t - 10) * (10000 / G());
    const truthful = rng() < 0.5;
    const claimed = truthful ? real : real - (100000 / G());
    const name = pick(rng, NAMES);
    const start = [h, t, ...Array(COLS().length - 2).fill(0)];
    return {
      ...build(
        {
          ...base("c-evaluate", "concrete", "evaluate", "regrouping", h * 100 + t, rng),
          prompt: `${name} says ${h} ${BIG()} and ${t} ${SMALL()} make ${fmt(claimed)}. Check on the chart. Is ${name} right?`,
          representation: null,
        },
        { h, t },
        truthful
          ? `Yes: ${t} ${SMALL()} is 1 ${BIG().replace(/s$/, "")} and ${t - 10} ${SMALL()}, so it's ${fmt(real)}`
          : `No: ${t} ${SMALL()} is 1 ${BIG().replace(/s$/, "")} and ${t - 10} ${SMALL()}, so it's ${fmt(real)}`,
        [
          truthful
            ? { text: `No: there are more discs in the first, so it's bigger than ${fmt(claimed)}`, mistake: "lnum-counts-discs" }
            : { text: `Yes: ${h} ${BIG()} and ${t - 10} ${SMALL()} is ${fmt(claimed)}`, mistake: "lnum-no-regroup" },
          { text: `No: a column can't have more than 9 discs, so it isn't a number`, mistake: "lnum-no-regroup" },
          { text: `${truthful ? "No" : "Yes"}: it's ${fmt(h * (100000 / G()) + t * (1000 / G()))}`, mistake: "lnum-wrong-place" },
        ]
      ),
      activity: { kind: "place-value", mode: "regroup", columns: COLS(), start, target: real },
    };
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    // Discs drawn in columns, with zeros: what number is it?
    const n = numberWith(rng, 6 - D(), int(rng, 1, 2));
    const d = digitsOf(n, COLS());
    return build(
      {
        ...base("p-remember", "pictorial", "remember", "place-value", n, rng),
        prompt: "What number do the discs on the place-value chart show?",
        representation: { kind: "place-value-chart", columns: COLS().map((p, i) => ({ label: SHORT[p], count: d[i] })) },
      },
      { n },
      fmt(n),
      [
        { text: fmt(dropZeros(n)), mistake: "lnum-drops-zero" },
        { text: fmt(Number(String(n).split("").reverse().join(""))), mistake: "lnum-reads-backwards" },
        ...(gradeNow() === 4 && n * 10 >= 1000000 ? [] : [{ text: fmt(n * 10), mistake: "lnum-shifts-place" }]),
        { text: fmt(Math.floor(n / 10)), mistake: "lnum-shifts-place" },
        { text: String(d.reduce((s, x) => s + x, 0)), mistake: "lnum-counts-discs" },
        { text: fmt(n + 100000 < 1000000 ? n + 100000 : n - 100000), mistake: null },
      ]
    );
  },

  "pictorial|understand": (rng) => {
    // Read an unlabelled arrow on a number line marked in 10,000s.
    const start = int(rng, 1, 8) * (100000 / G());
    const k = pick(rng, [1, 2, 3, 4, 6, 7, 8, 9]);
    const n = start + k * (10000 / G());
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "number-line", n, rng),
        prompt: "What number is at the red dot?",
        representation: { kind: "number-line", min: start, max: start + (100000 / G()), step: (10000 / G()), labelEvery: 5, markers: [{ value: n, label: "?" }] },
      },
      { n },
      fmt(n),
      [
        { text: fmt(start + k * (1000 / G())), mistake: "lnum-misreads-scale" },
        { text: fmt(start + (k + 1) * (10000 / G())), mistake: null },
        { text: fmt(start + (k - 1) * (10000 / G())), mistake: null },
        { text: fmt(start + k * (100000 / G())), mistake: "lnum-misreads-scale" },
      ]
    );
  },

  "pictorial|apply": (rng) => {
    // Round to the nearest ten thousand, with the number line to help.
    const lo = int(rng, 10, 98) * (10000 / R());
    const r = pick(rng, [1, 2, 3, 4, 6, 7, 8, 9]);
    const n = lo + r * (1000 / R()) + int(rng, 1, 9) * (100 / R());
    const nearest = r >= 5 ? lo + (10000 / R()) : lo;
    const other = r >= 5 ? lo : lo + (10000 / R());
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "rounding", n, rng),
        prompt: `${fmt(n)} is marked on the number line. Round it to the nearest ${PLACE_NAME[10000 / R()].replace(/s$/, "")}.`,
        representation: { kind: "number-line", min: lo, max: lo + (10000 / R()), step: (1000 / R()), labelEvery: 5, markers: [{ value: n, label: "▲" }] },
      },
      { n },
      fmt(nearest),
      [
        { text: fmt(other), mistake: "lnum-rounds-wrong-way" },
        { text: fmt(Math.round(n / (1000 / R())) * (1000 / R())), mistake: "lnum-rounds-wrong-place" },
        { text: fmt(Math.round(n / (100000 / R())) * (100000 / R())), mistake: "lnum-rounds-wrong-place" },
        { text: fmt(n), mistake: "lnum-rounds-wrong-place" },
        { text: fmt(nearest === lo ? lo - (10000 / R()) : lo + (20000 / R())), mistake: null },
      ]
    );
  },

  "pictorial|analyze": (rng) => {
    // Three unlabelled points; which letter is a given number?
    const start = int(rng, 1, 8) * (100000 / G());
    const ks = new Set<number>();
    while (ks.size < 3) ks.add(int(rng, 1, 9));
    const vals = [...ks].sort((x, y) => x - y).map((k) => start + k * (10000 / G()) + int(rng, 1, 9) * 100);
    const letters = ["A", "B", "C"];
    const ask = int(rng, 0, 2);
    const n = vals[ask];
    const shuffled = [...vals].sort(() => rng() - 0.5);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "comparing-ordering", n, rng),
        prompt: `A, B and C mark ${shuffled.map(fmt).join(", ")} (not in that order). Which letter is ${fmt(n)}?`,
        representation: { kind: "number-line", min: start, max: start + (100000 / G()), step: (10000 / G()), labelEvery: 5, markers: vals.map((v, i) => ({ value: v, label: letters[i] })) },
      },
      { n, s: start },
      letters[ask],
      [
        ...letters.filter((_, i) => i !== ask).map((l) => ({ text: l, mistake: "lnum-compares-wrong-end" })),
        { text: "They're too close to tell", mistake: null },
      ]
    );
  },

  "pictorial|evaluate": (rng) => {
    // Exactly halfway: rounds up.
    const lo = int(rng, 10, 98) * (10000 / R());
    const n = lo + (5000 / R());
    const name = pick(rng, NAMES);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "rounding", n, rng),
        prompt: `${name} says ${fmt(n)} rounds to ${fmt(lo)} because it's exactly in the middle. Is ${name} right?`,
        representation: { kind: "number-line", min: lo, max: lo + (10000 / R()), step: (1000 / R()), labelEvery: 5, markers: [{ value: n, label: "▲" }], highlightRange: [lo, lo + (10000 / R())] },
      },
      { n },
      `No: exactly halfway rounds up, to ${fmt(lo + (10000 / R()))}`,
      [
        { text: `Yes: halfway numbers round down`, mistake: "lnum-halfway-down" },
        { text: `No: it stays ${fmt(n)}, because halfway numbers don't round`, mistake: "lnum-halfway-down" },
        { text: `Yes: it's nearer ${fmt(lo)}`, mistake: "lnum-misreads-scale" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    if (gradeNow() === 4) return GRADE4_ABSTRACT["remember"](rng);
    // Value of one digit in a 7-digit number (the digit appears once).
    for (;;) {
      const n = numberWith(rng, 7 - 2 * D(), int(rng, 0, 2));
      const s = String(n);
      const i = int(rng, 0, 4 - 2 * D()); // biggest place … hundreds (a tens digit's "one place smaller" is the digit itself)
      const d = Number(s[i]);
      if (d < 2 || s.split("").filter((x) => x === s[i]).length > 1) continue;
      const place = PLACES[i + 2 * D()]; // a 5-digit number (Grade 4) starts two places lower
      return build(
        { ...base("a-remember", "abstract", "remember", "place-value", n, rng), prompt: `What is the value of the digit ${d} in ${fmt(n)}?`, representation: null },
        { n, i },
        fmt(d * place),
        [
          { text: fmt(d * place / 10), mistake: "lnum-wrong-place" },
          { text: fmt(d * place * 10), mistake: "lnum-wrong-place" },
          { text: String(d), mistake: "lnum-face-value" },
        ]
      );
    }
  },

  "abstract|understand": (rng) => {
    if (gradeNow() === 4) return GRADE4_ABSTRACT["understand"](rng);
    // Number words, 7 digits with zeros.
    for (;;) {
      const n = numberWith(rng, 7 - 2 * D(), int(rng, 2, 3));
      // The thousands group is 2 digits (Indian grouping). The trap reads a
      // single-digit group as tens (5 thousand -> fifty thousand), or a round
      // one as units (50 thousand -> five thousand).
      const th = Math.floor(n / 1000) % 100;
      const wrongGroup = th >= 1 && th <= 9 ? n + th * 9000 : th >= 10 && th % 10 === 0 ? n - th * 900 : null;
      const opts = [
        ...(wrongGroup !== null ? [{ text: words(wrongGroup), mistake: "lnum-words-group" }] : []),
        { text: words(n * 10), mistake: "lnum-shifts-place" },
        { text: words(dropZeros(n)), mistake: "lnum-drops-zero" },
        { text: words(Math.floor(n / 10)), mistake: "lnum-shifts-place" },
      ];
      return build(
        { ...base("a-understand", "abstract", "understand", "reading-writing-numbers", n, rng), prompt: `Which is ${fmt(n)} in words?`, representation: null },
        { n },
        words(n),
        opts
      );
    }
  },

  "abstract|apply": (rng) => {
    if (gradeNow() === 4) return GRADE4_ABSTRACT["apply"](rng);
    const place = pick(rng, [(10000 / G() / G()), (100000 / G() / G()), (1000000 / G() / G())]);
    for (;;) {
      const n = numberWith(rng, 7 - 2 * D(), int(rng, 0, 2));
      const next = (n % place) / place;
      if (Math.abs(next - 0.5) < 0.05) continue; // not right at halfway here
      if (n % (place / 10) === 0) continue; // already round: the question would show its answer
      const down = Math.floor(n / place) * place;
      const up = down + place;
      const right = next >= 0.5 ? up : down;
      return build(
        { ...base("a-apply", "abstract", "apply", "rounding", n, rng), prompt: `Round ${fmt(n)} to the nearest ${PLACE_NAME[place].replace(/s$/, "")}.`, representation: null },
        { n, place },
        fmt(right),
        [
          { text: fmt(right === up ? down : up), mistake: "lnum-rounds-wrong-way" },
          { text: fmt(Math.round(n / (place / 10)) * (place / 10)), mistake: "lnum-rounds-wrong-place" },
          ...(Math.round(n / (place * 10)) > 0 ? [{ text: fmt(Math.round(n / (place * 10)) * place * 10), mistake: "lnum-rounds-wrong-place" }] : []),
          { text: fmt(n), mistake: "lnum-rounds-wrong-place" },
          { text: fmt(right + place), mistake: null },
          { text: fmt(Math.max(place, right - place)), mistake: null },
          { text: fmt(right + 2 * place), mistake: null },
        ]
      );
    }
  },

  "abstract|analyze": (rng) => {
    if (gradeNow() === 4) return GRADE4_ABSTRACT["analyze"](rng);
    // Three numbers from the same digits: which is greatest (or smallest)?
    for (;;) {
      const lead = int(rng, 1, 9);
      const digits = [int(rng, 1, 9), int(rng, 0, 9), int(rng, 1, 9), 0, int(rng, 1, 9), 0].slice(2 * D());
      const nums = new Set<number>();
      for (let k = 0; k < 30 && nums.size < 3; k++) {
        const p = [...digits].sort(() => rng() - 0.5);
        if (p[0] === 0) continue;
        nums.add(Number(`${lead}${p.join("")}`));
      }
      if (nums.size < 3) continue;
      const list = [...nums];
      const greatest = rng() < 0.6;
      const right = greatest ? Math.max(...list) : Math.min(...list);
      // The trap: the number that looks biggest from the right-hand end.
      const byEnd = [...list].sort((x, y) => (greatest ? (y % (1000 / G())) - (x % (1000 / G())) : (x % (1000 / G())) - (y % (1000 / G()))))[0];
      return build(
        { ...base("a-analyze", "abstract", "analyze", "comparing-ordering", right, rng), prompt: `Which is the ${greatest ? "greatest" : "smallest"}: ${list.map(fmt).join(", ")}?`, representation: null },
        { n: list[0], m: list[1], o: list[2] },
        fmt(right),
        [
          ...list.filter((x) => x !== right).map((x) => ({ text: fmt(x), mistake: x === byEnd ? "lnum-compares-wrong-end" : null })),
          { text: "They're equal, because they use the same digits", mistake: "lnum-compares-wrong-end" },
        ]
      );
    }
  },

  "abstract|evaluate": (rng) => {
    if (gradeNow() === 4) return GRADE4_ABSTRACT["evaluate"](rng);
    // Build a number from a description of its places.
    const len = pick(rng, [6, 7]) - 2 * D();
    const places = PLACES.slice(7 - len);
    const i = int(rng, 0, 1); // a big place
    const j = int(rng, len - 3, len - 1); // a small place
    const di = int(rng, 1, 9);
    const dj = int(rng, 1, 9);
    const n = di * places[i] + dj * places[j];
    const others = places.filter((_, k) => k !== i && k !== j).length;
    return build(
      {
        ...base("a-evaluate", "abstract", "evaluate", "place-value", n, rng),
        prompt: `A ${len}-digit number has ${di} in the ${PLACE_NAME[places[i]]} place, ${dj} in the ${PLACE_NAME[places[j]]} place, and 0 in the other ${others} places. What is the number?`,
        representation: null,
      },
      { n },
      fmt(n),
      [
        { text: fmt(di * places[i] * 10 + dj * places[j]), mistake: "lnum-extra-zero" },
        { text: fmt(dropZeros(n)), mistake: "lnum-drops-zero" },
        { text: fmt(di * places[i] + dj * places[j] * 10), mistake: "lnum-shifts-place" },
        { text: fmt(di * places[i] / 10 + dj * places[j]), mistake: "lnum-drops-zero" },
      ]
    );
  },
};

/**
 * Grade 4 abstract questions, from the book's chapter 1 outcomes: place and
 * face value, number names up to 9,99,999, rounding to the nearest ten,
 * hundred or thousand, the largest/smallest number from given digits, and
 * the rules for Roman numerals.
 */
const GRADE4_ABSTRACT: Record<string, Template> = {
  remember: (rng) => {
    for (;;) {
      const n = numberWith(rng, 6, int(rng, 0, 1));
      const s = String(n);
      const i = int(rng, 0, 3); // lakhs … hundreds
      const d = Number(s[i]);
      if (d < 2 || s.split("").filter((x) => x === s[i]).length > 1) continue;
      const place = 10 ** (5 - i);
      const face = rng() < 0.4;
      const b = { ...base("a-remember", "abstract", "remember", "place-value", n, rng), representation: null };
      return face
        ? build(
            { ...b, prompt: `What is the face value of ${d} in ${fmt(n)}?` },
            { n, i, f: 1 },
            String(d),
            [
              { text: fmt(d * place), mistake: "lnum-place-for-face" },
              { text: fmt(d * place / 10), mistake: "lnum-place-for-face" },
              { text: fmt(i === 0 ? d * place / 100 : d * place * 10), mistake: "lnum-place-for-face" },
            ]
          )
        : build(
            { ...b, prompt: `What is the place value of ${d} in ${fmt(n)}?` },
            { n, i, f: 0 },
            fmt(d * place),
            [
              { text: String(d), mistake: "lnum-face-value" },
              { text: fmt(d * place / 10), mistake: "lnum-wrong-place" },
              { text: fmt(i === 0 ? d * place / 100 : d * place * 10), mistake: "lnum-wrong-place" },
            ]
          );
    }
  },

  understand: (rng) => {
    const n = numberWith(rng, pick(rng, [5, 6]), int(rng, 1, 2));
    const th = Math.floor(n / 1000) % 100;
    const wrongGroup = th >= 1 && th <= 9 ? n + th * 9000 : th >= 10 && th % 10 === 0 ? n - th * 900 : null;
    return build(
      { ...base("a-understand", "abstract", "understand", "reading-writing-numbers", n, rng), prompt: `Which is the number name for ${fmt(n)}?`, representation: null },
      { n },
      words(n),
      [
        ...(wrongGroup !== null ? [{ text: words(wrongGroup), mistake: "lnum-words-group" }] : []),
        { text: words(dropZeros(n)), mistake: "lnum-drops-zero" },
        ...(n * 10 < 1000000 ? [{ text: words(n * 10), mistake: "lnum-shifts-place" }] : []),
        { text: words(Math.floor(n / 10)), mistake: "lnum-shifts-place" },
        { text: words(n + 10 ** (String(n).length - 1)), mistake: null },
        { text: words(n - 10 ** (String(n).length - 1) || n + 1), mistake: null },
      ]
    );
  },

  apply: (rng) => {
    const place = pick(rng, [10, 100, 1000]);
    for (;;) {
      const n = numberWith(rng, pick(rng, [5, 6]), int(rng, 0, 1));
      const next = (n % place) / place;
      if (Math.abs(next - 0.5) < 0.05 || n % (place / 10 || 1) === 0 && place > 10) continue;
      if (n % place === 0) continue;
      if (n >= 980000) continue; // rounding up must stay below 10,00,000
      const down = Math.floor(n / place) * place;
      const up = down + place;
      const right = next >= 0.5 ? up : down;
      return build(
        { ...base("a-apply", "abstract", "apply", "rounding", n, rng), prompt: `Round ${fmt(n)} to the nearest ${PLACE_NAME[place].replace(/s$/, "")}.`, representation: null },
        { n, place },
        fmt(right),
        [
          { text: fmt(right === up ? down : up), mistake: "lnum-rounds-wrong-way" },
          ...(place > 10 ? [{ text: fmt(Math.round(n / (place / 10)) * (place / 10)), mistake: "lnum-rounds-wrong-place" }] : []),
          { text: fmt(Math.round(n / (place * 10)) * place * 10), mistake: "lnum-rounds-wrong-place" },
          { text: fmt(n), mistake: "lnum-rounds-wrong-place" },
          { text: fmt(right + place), mistake: null },
          { text: fmt(right - place), mistake: null },
          { text: fmt(right + 2 * place), mistake: null },
        ]
      );
    }
  },

  analyze: (rng) => {
    // Largest or smallest number from 6 (or 5) different digits, one of them 0.
    const len = pick(rng, [5, 6]);
    const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => rng() - 0.5).slice(0, len - 1);
    const given = [...pool, 0].sort(() => rng() - 0.5);
    if (given[0] === 0) given.push(given.shift()!); // keep the list itself from starting with 0
    const asc = [...given].sort((a, b) => a - b); // 0 first
    const desc = [...asc].reverse();
    const smallest = Number([asc[1], 0, ...asc.slice(2)].join(""));
    const zeroFirst = Number(asc.join("")); // one digit short
    const largest = Number(desc.join(""));
    const ascNoZero = Number([asc[1], ...asc.slice(2), 0].join(""));
    const wantLargest = rng() < 0.5;
    const right = wantLargest ? largest : smallest;
    const nearMiss = Number([...desc.slice(0, len - 2), desc[len - 1], desc[len - 2]].join(""));
    return build(
      {
        ...base("a-analyze", "abstract", "analyze", "comparing-ordering", right, rng),
        prompt: `Use each of the digits ${given.join(", ")} once. What is the ${wantLargest ? "largest" : "smallest"} ${len}-digit number you can make?`,
        representation: null,
      },
      { n: right, d: Number(given.join("")), l: wantLargest ? 1 : 0 },
      fmt(right),
      wantLargest
        ? [
            { text: fmt(smallest), mistake: "lnum-largest-smallest" },
            { text: fmt(Number(given.join(""))), mistake: null },
            { text: fmt(nearMiss), mistake: null },
            { text: fmt(Number([desc[1], desc[0], ...desc.slice(2)].join(""))), mistake: null },
          ]
        : [
            { text: fmt(zeroFirst), mistake: "lnum-zero-first" },
            { text: fmt(largest), mistake: "lnum-largest-smallest" },
            { text: fmt(ascNoZero), mistake: null },
            { text: fmt(Number(given.join(""))), mistake: null },
          ]
    );
  },

  evaluate: (rng) => {
    // A claim about a Roman numeral, checked against the rules.
    const name = pick(rng, NAMES);
    for (;;) {
      const n = int(rng, 4, 99);
      const hasPair = /XC|XL|IX|IV/.test(roman(n));
      if (!hasPair && rng() < 0.7) continue; // mostly numbers where the rules matter
      const truthful = !hasPair || rng() < 0.3;
      const claimed = truthful ? roman(n) : romanRepeats(n);
      const r = roman(n);
      const b = { ...base("a-evaluate", "abstract", "evaluate", "roman-numerals", n, rng), representation: null };
      const prompt = `${name} writes ${n} in Roman numerals as ${claimed}. Is ${name} right?`;
      if (truthful) {
        const wrongs = [
          ...(hasPair ? [{ text: `No: it should be ${romanRepeats(n)}`, mistake: "roman-repeats" }, { text: `No: it should be ${romanBackwards(n)}`, mistake: "roman-order" }] : []),
          { text: `No: it should be ${roman(n + 10 <= 100 ? n + 10 : n - 10)}`, mistake: null },
          { text: `No: it should be ${roman(n + 1 <= 100 ? n + 1 : n - 1)}`, mistake: null },
          { text: `No: it should be ${roman(n + 5 <= 100 ? n + 5 : n - 5)}`, mistake: null },
        ];
        return build({ ...b, prompt }, { n, t: 1 }, `Yes, ${claimed} is ${n}`, wrongs);
      }
      return build(
        { ...b, prompt },
        { n, t: 0 },
        `No: a letter can't be used more than 3 times in a row. It is ${r}`,
        [
          { text: `Yes, ${claimed} is ${n}`, mistake: "roman-repeats" },
          { text: `No: it is ${romanBackwards(n)}`, mistake: "roman-order" },
          { text: `No: it is ${roman(n + 10 <= 100 ? n + 10 : n - 10)}`, mistake: null },
        ]
      );
    }
  },
};

/** Independent answer check for the stress test: recomputes each right answer from the numbers. */
export function verify(item: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string; activity?: unknown }): string | null {
  const right = item.choices.find((c) => c.id === item.correctChoiceId)?.text ?? "";
  const p = item.params;
  const num = (t: string) => Number(t.replace(/,/g, ""));
  switch (`${item.cpa}|${item.bloom}`) {
    case "abstract|evaluate":
      if (p.g === 4) return right.endsWith(roman(p.n)) || (p.t === 1 && right.startsWith("Yes")) ? null : `roman ${p.n}: ${right}`;
      return num(right) === p.n ? null : `right answer ${right} is not ${p.n}`;
    case "pictorial|remember":
    case "pictorial|understand":
      return num(right) === p.n ? null : `right answer ${right} is not ${p.n}`;
    case "pictorial|apply":
      return num(right) === Math.round(p.n / (p.g === 4 ? 1000 : 10000)) * (p.g === 4 ? 1000 : 10000) ? null : `rounding ${p.n} gave ${right}`;
    case "abstract|apply":
      return num(right) === Math.round(p.n / p.place) * p.place ? null : `rounding ${p.n} to ${p.place} gave ${right}`;
    case "abstract|remember": {
      const d = Number(String(p.n)[p.i]);
      if (p.f === 1) return right === String(d) ? null : `face value wrong: ${right}`;
      return num(right) === d * 10 ** (String(p.n).length - 1 - p.i) ? null : `digit value wrong: ${right}`;
    }
    case "abstract|understand":
      return right === words(p.n) ? null : `words wrong: ${right}`;
    case "abstract|analyze": {
      if (p.g === 4) {
        const ds = String(p.d).split("").map(Number).sort((a, b) => a - b);
        const want = p.l === 1 ? Number([...ds].reverse().join("")) : Number([ds[1], 0, ...ds.slice(2)].join(""));
        return num(right) === want ? null : `digits ${p.d}: ${right} is not the ${p.l === 1 ? "largest" : "smallest"}`;
      }
      const list = [p.n, p.m, p.o];
      return num(right) === Math.max(...list) || num(right) === Math.min(...list) ? null : `not the greatest/smallest: ${right}`;
    }
  }
  return null;
}
