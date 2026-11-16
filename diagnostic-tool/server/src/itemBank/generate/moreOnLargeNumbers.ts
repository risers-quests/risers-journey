import { Rng, Template, build, buildActivity, int, pick } from "./core.js";

/**
 * More on Large Numbers, generated. One ladder built on place value, which
 * reading, writing, comparing and rounding all rest on:
 *   concrete  hands-on place-value chart (build, regroup, change a number)
 *   pictorial discs drawn in columns; number lines with an unlabelled arrow
 *   abstract  digit values, number words, rounding, comparing
 * Replaces a hand-written bank whose pictures gave answers away (legends
 * named the disc values; number lines printed the number to be read) and
 * whose levels tested unrelated skills.
 */

const TOPIC = "more-large-numbers";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "lnum-face-value": {
    label: "Gives the digit, not its value",
    detail: "Answers 7 for the value of the 7 in 3,782,410 (its value is 700,000).",
    childTip: "A digit's value depends on its place: the 7 in 3,782,410 is worth 700,000.",
  },
  "lnum-wrong-place": {
    label: "Reads the wrong place",
    detail: "Takes a digit's value from the place next door (70,000 instead of 700,000).",
    childTip: "Count the places from the right: ones, tens, hundreds, thousands…",
  },
  "lnum-drops-zero": {
    label: "Leaves out place-holding zeros",
    detail: "Writes 305,020 as 35,020 or 3,520: empty places are skipped instead of filled with 0.",
    childTip: "An empty column still needs a 0, or every digit slides into the wrong place.",
  },
  "lnum-extra-zero": {
    label: "Adds an extra zero",
    detail: "Writes one zero too many (5,000,003 for 500,003), moving digits a place too far.",
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
    detail: "Exactly halfway (455,000 to the nearest ten thousand) rounds up by convention; they round down or leave it.",
    childTip: "Exactly halfway always rounds up.",
  },
  "lnum-compares-wrong-end": {
    label: "Compares from the wrong end",
    detail: "Compares numbers by their last digits or by which digits appear, not from the biggest place.",
    childTip: "Compare from the left: the first place where the digits differ decides.",
  },
  "lnum-words-group": {
    label: "Mixes up the number-word groups",
    detail: "Says 'five hundred thousand' for 50,000 inside a number, or puts digits in the wrong thousands group.",
    childTip: "Split the number into groups of three from the right, then name each group.",
  },
};

const fmt = (n: number) => n.toLocaleString("en-US");
const PLACES = [1000000, 100000, 10000, 1000, 100, 10, 1];
const PLACE_NAME: Record<number, string> = { 1000000: "millions", 100000: "hundred thousands", 10000: "ten thousands", 1000: "thousands", 100: "hundreds", 10: "tens", 1: "ones" };
const SHORT: Record<number, string> = { 1000000: "M", 100000: "HTh", 10000: "TTh", 1000: "Th", 100: "H", 10: "T", 1: "O" };
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
function under1000(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${ONES[h]} hundred`);
  if (r) parts.push(r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? `-${ONES[r % 10]}` : ""));
  return parts.join(" and ");
}
/** International number words: 4,050,900 -> "Four million, fifty thousand, nine hundred". */
export function words(n: number): string {
  if (n === 0) return "Zero";
  const groups = [
    [Math.floor(n / 1e6) % 1000, "million"],
    [Math.floor(n / 1e3) % 1000, "thousand"],
    [n % 1000, ""],
  ] as const;
  const out = groups.filter(([g]) => g).map(([g, name]) => (name ? `${under1000(g)} ${name}` : under1000(g)));
  const s = out.join(", ");
  return s[0].toUpperCase() + s.slice(1);
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

const SIX = PLACES.slice(1); // hundred thousands … ones

export const MORE_ON_LARGE_NUMBERS_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: hands-on place-value chart ----------------
  "concrete|remember": (rng) => {
    // Two non-zero places side by side, e.g. 240,000.
    const top = pick(rng, [100000, 10000, 1000]);
    const n = int(rng, 1, 9) * top + int(rng, 1, 9) * (top / 10);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "place-value", n, rng), prompt: `Build the number ${fmt(n)} on the place-value chart.`, representation: null },
      { n },
      { kind: "place-value", mode: "build", columns: SIX, start: SIX.map(() => 0), target: n }
    );
  },

  "concrete|understand": (rng) => {
    // Zeros in the middle: the classic place-holder trap.
    const n = numberWith(rng, 6, int(rng, 2, 3));
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "place-value", n, rng), prompt: `Build the number ${fmt(n)} on the place-value chart.`, representation: null },
      { n },
      { kind: "place-value", mode: "build", columns: SIX, start: SIX.map(() => 0), target: n }
    );
  },

  "concrete|apply": (rng) => {
    // One column has 10-18 discs; regroup so every column has 9 or fewer.
    for (;;) {
      const n = numberWith(rng, 6, int(rng, 0, 1));
      const d = digitsOf(n, SIX);
      const i = int(rng, 1, 4); // column to overfill (not the biggest, not the ones)
      if (d[i - 1] === 0) continue;
      const start = [...d];
      start[i - 1] -= 1;
      start[i] += 10;
      return buildActivity(
        {
          ...base("c-apply", "concrete", "apply", "regrouping", n, rng),
          prompt: `The chart has ${start[i]} discs in the ${PLACE_NAME[SIX[i]]} column. Exchange 10 discs for 1 in the next column until every column has 9 or fewer, without changing the number.`,
          representation: null,
        },
        { n },
        { kind: "place-value", mode: "regroup", columns: SIX, start, target: n }
      );
    }
  },

  "concrete|analyze": (rng) => {
    // Add one in a place that holds a 9, so it has to carry.
    for (;;) {
      const p = pick(rng, [10000, 1000, 100]);
      const x = numberWith(rng, 6, 0);
      const d = digitsOf(x, SIX);
      const i = SIX.indexOf(p);
      d[i] = 9;
      const start = d;
      const from = valueOf(start, SIX);
      const target = from + p;
      if (target >= 1000000) continue;
      return buildActivity(
        {
          ...base("c-analyze", "concrete", "analyze", "regrouping", from, rng),
          prompt: `The chart shows ${fmt(from)}. Change it to show ${fmt(p)} more.`,
          representation: null,
        },
        { n: from, p },
        { kind: "place-value", mode: "change", columns: SIX, start, target }
      );
    }
  },

  "concrete|evaluate": (rng) => {
    // A claim about regrouping, checked by trying it on the chart.
    const h = int(rng, 1, 7);
    const t = int(rng, 11, 18);
    const real = (h + 1) * 100000 + (t - 10) * 10000;
    const truthful = rng() < 0.5;
    const claimed = truthful ? real : real - 100000;
    const name = pick(rng, NAMES);
    const start = [h, t, 0, 0, 0, 0];
    return {
      ...build(
        {
          ...base("c-evaluate", "concrete", "evaluate", "regrouping", h * 100 + t, rng),
          prompt: `${name} says ${h} hundred thousands and ${t} ten thousands make ${fmt(claimed)}. Check on the chart. Is ${name} right?`,
          representation: null,
        },
        { h, t },
        truthful
          ? `Yes: ${t} ten thousands is 1 hundred thousand and ${t - 10} ten thousands, so it's ${fmt(real)}`
          : `No: ${t} ten thousands is 1 hundred thousand and ${t - 10} ten thousands, so it's ${fmt(real)}`,
        [
          truthful
            ? { text: `No: there are more discs in the first, so it's bigger than ${fmt(claimed)}`, mistake: "lnum-counts-discs" }
            : { text: `Yes: ${h} hundred thousands and ${t - 10} ten thousands is ${fmt(claimed)}`, mistake: "lnum-no-regroup" },
          { text: `No: a column can't have more than 9 discs, so it isn't a number`, mistake: "lnum-no-regroup" },
          { text: `${truthful ? "No" : "Yes"}: it's ${fmt(h * 100000 + t * 1000)}`, mistake: "lnum-wrong-place" },
        ]
      ),
      activity: { kind: "place-value", mode: "regroup", columns: SIX, start, target: real },
    };
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    // Discs drawn in columns, with zeros: what number is it?
    const n = numberWith(rng, 6, int(rng, 1, 2));
    const d = digitsOf(n, SIX);
    return build(
      {
        ...base("p-remember", "pictorial", "remember", "place-value", n, rng),
        prompt: "What number do the discs on the place-value chart show?",
        representation: { kind: "place-value-chart", columns: SIX.map((p, i) => ({ label: SHORT[p], count: d[i] })) },
      },
      { n },
      fmt(n),
      [
        { text: fmt(dropZeros(n)), mistake: "lnum-drops-zero" },
        { text: fmt(Number(String(n).split("").reverse().join(""))), mistake: "lnum-reads-backwards" },
        { text: fmt(n * 10), mistake: "lnum-shifts-place" },
        { text: fmt(Math.floor(n / 10)), mistake: "lnum-shifts-place" },
        { text: String(d.reduce((s, x) => s + x, 0)), mistake: "lnum-counts-discs" },
      ]
    );
  },

  "pictorial|understand": (rng) => {
    // Read an unlabelled arrow on a number line marked in 10,000s.
    const start = int(rng, 1, 8) * 100000;
    const k = pick(rng, [1, 2, 3, 4, 6, 7, 8, 9]);
    const n = start + k * 10000;
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "number-line", n, rng),
        prompt: "What number is at the red dot?",
        representation: { kind: "number-line", min: start, max: start + 100000, step: 10000, labelEvery: 5, markers: [{ value: n, label: "?" }] },
      },
      { n },
      fmt(n),
      [
        { text: fmt(start + k * 1000), mistake: "lnum-misreads-scale" },
        { text: fmt(start + (k + 1) * 10000), mistake: null },
        { text: fmt(start + (k - 1) * 10000), mistake: null },
        { text: fmt(start + k * 100000), mistake: "lnum-misreads-scale" },
      ]
    );
  },

  "pictorial|apply": (rng) => {
    // Round to the nearest ten thousand, with the number line to help.
    const lo = int(rng, 10, 98) * 10000;
    const r = pick(rng, [1, 2, 3, 4, 6, 7, 8, 9]);
    const n = lo + r * 1000 + int(rng, 1, 9) * 100;
    const nearest = r >= 5 ? lo + 10000 : lo;
    const other = r >= 5 ? lo : lo + 10000;
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "rounding", n, rng),
        prompt: `${fmt(n)} is marked on the number line. Round it to the nearest ten thousand.`,
        representation: { kind: "number-line", min: lo, max: lo + 10000, step: 1000, labelEvery: 5, markers: [{ value: n, label: "▲" }] },
      },
      { n },
      fmt(nearest),
      [
        { text: fmt(other), mistake: "lnum-rounds-wrong-way" },
        { text: fmt(Math.round(n / 1000) * 1000), mistake: "lnum-rounds-wrong-place" },
        { text: fmt(Math.round(n / 100000) * 100000), mistake: "lnum-rounds-wrong-place" },
        { text: fmt(n), mistake: "lnum-rounds-wrong-place" },
        { text: fmt(nearest === lo ? lo - 10000 : lo + 20000), mistake: null },
      ]
    );
  },

  "pictorial|analyze": (rng) => {
    // Three unlabelled points; which letter is a given number?
    const start = int(rng, 1, 8) * 100000;
    const ks = new Set<number>();
    while (ks.size < 3) ks.add(int(rng, 1, 9));
    const vals = [...ks].sort((x, y) => x - y).map((k) => start + k * 10000 + int(rng, 1, 9) * 100);
    const letters = ["A", "B", "C"];
    const ask = int(rng, 0, 2);
    const n = vals[ask];
    const shuffled = [...vals].sort(() => rng() - 0.5);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "comparing-ordering", n, rng),
        prompt: `A, B and C mark ${shuffled.map(fmt).join(", ")} (not in that order). Which letter is ${fmt(n)}?`,
        representation: { kind: "number-line", min: start, max: start + 100000, step: 10000, labelEvery: 5, markers: vals.map((v, i) => ({ value: v, label: letters[i] })) },
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
    const lo = int(rng, 10, 98) * 10000;
    const n = lo + 5000;
    const name = pick(rng, NAMES);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "rounding", n, rng),
        prompt: `${name} says ${fmt(n)} rounds to ${fmt(lo)} because it's exactly in the middle. Is ${name} right?`,
        representation: { kind: "number-line", min: lo, max: lo + 10000, step: 1000, labelEvery: 5, markers: [{ value: n, label: "▲" }], highlightRange: [lo, lo + 10000] },
      },
      { n },
      `No: exactly halfway rounds up, to ${fmt(lo + 10000)}`,
      [
        { text: `Yes: halfway numbers round down`, mistake: "lnum-halfway-down" },
        { text: `No: it stays ${fmt(n)}, because halfway numbers don't round`, mistake: "lnum-halfway-down" },
        { text: `Yes: it's nearer ${fmt(lo)}`, mistake: "lnum-misreads-scale" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    // Value of one digit in a 7-digit number (the digit appears once).
    for (;;) {
      const n = numberWith(rng, 7, int(rng, 0, 2));
      const s = String(n);
      const i = int(rng, 0, 4); // millions … hundreds (a tens digit's "one place smaller" is the digit itself)
      const d = Number(s[i]);
      if (d < 2 || s.split("").filter((x) => x === s[i]).length > 1) continue;
      const place = PLACES[i];
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
    // Number words, 7 digits with zeros.
    for (;;) {
      const n = numberWith(rng, 7, int(rng, 2, 3));
      const th = Math.floor(n / 1000) % 1000;
      const wrongGroup = th >= 10 && th < 100 ? n - th * 1000 + th * 10000 : th >= 100 && th % 100 === 0 ? n - th * 1000 + (th / 10) * 1000 : null;
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
    const place = pick(rng, [10000, 100000, 1000000]);
    for (;;) {
      const n = numberWith(rng, 7, int(rng, 0, 2));
      const next = (n % place) / place;
      if (Math.abs(next - 0.5) < 0.05) continue; // not right at halfway here
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
          { text: fmt(Math.round(n / (place * 10)) * place * 10), mistake: "lnum-rounds-wrong-place" },
          { text: fmt(n), mistake: "lnum-rounds-wrong-place" },
          { text: fmt(right + place), mistake: null },
          { text: fmt(Math.max(place, right - place)), mistake: null },
        ]
      );
    }
  },

  "abstract|analyze": (rng) => {
    // Three numbers from the same digits: which is greatest (or smallest)?
    for (;;) {
      const lead = int(rng, 1, 9);
      const digits = [int(rng, 1, 9), int(rng, 0, 9), int(rng, 1, 9), 0, int(rng, 1, 9), 0];
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
      const byEnd = [...list].sort((x, y) => (greatest ? (y % 1000) - (x % 1000) : (x % 1000) - (y % 1000)))[0];
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
    // Build a number from a description of its places.
    const len = pick(rng, [6, 7]);
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

/** Independent answer check for the stress test: recomputes each right answer from the numbers. */
export function verify(item: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string; activity?: unknown }): string | null {
  const right = item.choices.find((c) => c.id === item.correctChoiceId)?.text ?? "";
  const p = item.params;
  const num = (t: string) => Number(t.replace(/,/g, ""));
  switch (`${item.cpa}|${item.bloom}`) {
    case "pictorial|remember":
    case "pictorial|understand":
    case "abstract|evaluate":
      return num(right) === p.n ? null : `right answer ${right} is not ${p.n}`;
    case "pictorial|apply":
      return num(right) === Math.round(p.n / 10000) * 10000 ? null : `rounding ${p.n} gave ${right}`;
    case "abstract|apply":
      return num(right) === Math.round(p.n / p.place) * p.place ? null : `rounding ${p.n} to ${p.place} gave ${right}`;
    case "abstract|remember": {
      const d = Number(String(p.n)[p.i]);
      return num(right) === d * 10 ** (String(p.n).length - 1 - p.i) ? null : `digit value wrong: ${right}`;
    }
    case "abstract|understand":
      return right === words(p.n) ? null : `words wrong: ${right}`;
    case "abstract|analyze": {
      const list = [p.n, p.m, p.o];
      return num(right) === Math.max(...list) || num(right) === Math.min(...list) ? null : `not the greatest/smallest: ${right}`;
    }
  }
  return null;
}
