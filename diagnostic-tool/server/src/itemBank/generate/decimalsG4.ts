import { Rng, Template, build, buildActivity, int, pick } from "./core.js";

/**
 * Decimals, Grade 4 (book chapter 7): tenths, hundredths and thousandths as
 * fractions and decimals, the place-value chart, number discs, reading
 * decimals, mixed fractions as decimals. Grade 4 only.
 *   concrete  colour a tenths strip or a hundred square; make a decimal with
 *             number discs; colour two amounts to compare them
 *   pictorial hundred squares, number discs, a number line
 *   abstract  decimals and fractions in symbols
 * Amounts are kept as whole numbers of thousandths internally, so there is
 * no rounding error anywhere.
 */

const TOPIC = "decimals";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "dec4-rest": {
    label: "Counts the part not coloured",
    detail: "Reads the uncoloured part (0.3) instead of the coloured part (0.7).",
    childTip: "Count the coloured parts, then check: coloured and uncoloured together make 1 whole.",
  },
  "dec4-tenths-hundredths": {
    label: "Mixes up tenths and hundredths",
    detail: "Writes 7/100 as 0.7, or 0.4 as 4 hundredths: puts a digit one place out after the point.",
    childTip: "After the point: tenths first, then hundredths, then thousandths. 7 hundredths is 0.07.",
  },
  "dec4-shifts-place": {
    label: "Puts the decimal point in the wrong place",
    detail: "Makes the number 10 times too big or too small (23.48 as 234.8).",
    childTip: "Line up the ones: the decimal point always sits just after the ones digit.",
  },
  "dec4-reverses": {
    label: "Reads the digits backwards",
    detail: "Reads 0.35 as 53 hundredths.",
    childTip: "Read from the point outwards: 0.35 is 3 tenths and 5 hundredths, 35 hundredths.",
  },
  "dec4-longer-is-bigger": {
    label: "Thinks more digits means bigger",
    detail: "Says 0.35 is more than 0.4 because 35 is more than 4.",
    childTip: "Compare tenths first: 0.4 has 4 tenths, 0.35 has only 3. Or write 0.4 as 0.40.",
  },
  "dec4-zero-changes": {
    label: "Thinks a zero at the end changes a decimal",
    detail: "Thinks 0.50 and 0.5 are different amounts.",
    childTip: "50 hundredths is the same as 5 tenths: 0.50 = 0.5. A zero at the end changes nothing.",
  },
  "dec4-face-value": {
    label: "Gives the digit, not its value",
    detail: "Says the 4 in 16.542 is worth 4, not 4 hundredths (0.04).",
    childTip: "A digit's value depends on its place: in 16.542, the 4 is in the hundredths place.",
  },
  "dec4-digits-as-whole": {
    label: "Reads the decimal part as a whole number",
    detail: "Writes 0.45 as 45/10, or 3 4/10 as 34.",
    childTip: "Two digits after the point means hundredths: 0.45 = 45/100.",
  },
};

const NAMES = ["Priya", "Arjun", "Meera", "Kabir", "Ananya", "Rohan", "Zara", "Ishaan", "Diya", "Vihaan", "Sara", "Aditya"] as const;

/** A number of thousandths written as a decimal with `places` places (e.g. 2348 thousandths, 2 → "2.35" is never used: callers pass exact amounts). */
export function dec(thousandths: number, places: number): string {
  const neg = thousandths < 0;
  const t = Math.abs(thousandths);
  const whole = Math.floor(t / 1000);
  const frac = String(t % 1000).padStart(3, "0").slice(0, places);
  return (neg ? "-" : "") + (places ? `${whole}.${frac}` : String(whole));
}

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, n: number, rng: Rng) {
  return { id: `dec4-${cell}-${n}-${Math.floor(rng() * 1e6).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}

export const DECIMALS_G4_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng) => {
    // Colour tenths on a strip of 10.
    const k = pick(rng, [1, 2, 3, 4, 6, 7, 8, 9]);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "tenths", k, rng), prompt: `The strip is 1 whole, cut into 10 equal parts. Colour ${dec(k * 100, 1)} of it.`, representation: null },
      { k },
      { kind: "tiles", rows: 1, cols: 10, mode: "count", target: k, wrong: [{ value: 10 - k, mistake: "dec4-rest" }] }
    );
  },

  "concrete|understand": (rng) => {
    // Colour hundredths on a hundred square.
    for (;;) {
      const t = int(rng, 1, 9);
      const h = int(rng, 1, 9);
      const n = t * 10 + h;
      if (t === h) continue;
      const wrong = [
        { value: h * 10 + t, mistake: "dec4-reverses" },
        { value: 100 - n, mistake: "dec4-rest" },
        { value: t + h, mistake: "dec4-digits-as-whole" },
      ].filter((w, i, all) => w.value !== n && all.findIndex((x) => x.value === w.value) === i);
      return buildActivity(
        { ...base("c-understand", "concrete", "understand", "hundredths", n, rng), prompt: `The square is 1 whole, cut into 100 equal parts. Colour ${dec(n * 10, 2)} of it.`, representation: null },
        { n },
        { kind: "tiles", rows: 10, cols: 10, mode: "count", target: n, wrong }
      );
    }
  },

  "concrete|apply": (rng) => {
    // Make a decimal with number discs (counted in hundredths).
    const tens = int(rng, 0, 3);
    const ones = int(rng, 1, 9);
    const tenths = int(rng, 1, 9);
    const hund = int(rng, 1, 9);
    const n = tens * 1000 + ones * 100 + tenths * 10 + hund; // hundredths
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "number-discs", n, rng), prompt: `Make ${dec(n * 10, 2)} with number discs.`, representation: null },
      { n },
      {
        kind: "measure",
        what: "discs",
        unit: "hundredths",
        pieces: [
          { value: 1000, label: "10" },
          { value: 100, label: "1" },
          { value: 10, label: "0.1" },
          { value: 1, label: "0.01" },
        ],
        target: n,
        wrong: [
          { value: tens * 100 + ones * 10 + tenths * 1 + hund * 0, mistake: "dec4-shifts-place" },
          { value: tens * 1000 + ones * 100 + hund * 10 + tenths, mistake: "dec4-reverses" },
        ].filter((w) => w.value !== n && w.value > 0),
      }
    );
  },

  "concrete|analyze": (rng) => {
    // Compare tenths with hundredths: colour both to check.
    const a = int(rng, 2, 8); // a tenths
    const b = (a - 1) * 10 + int(rng, 1, 9); // a little less, but more hundredths digits
    return {
      ...build(
        {
          ...base("c-analyze", "concrete", "analyze", "comparing-decimals", a * 100 + b, rng),
          prompt: `Which is greater, ${dec(a * 100, 1)} or ${dec(b * 10, 2)}? Colour them on the hundred square to check, then choose.`,
          representation: null,
        },
        { a, b },
        `${dec(a * 100, 1)} is greater`,
        [
          { text: `${dec(b * 10, 2)} is greater, because ${b} is more than ${a}`, mistake: "dec4-longer-is-bigger" },
          { text: "They are the same", mistake: null },
          { text: "You can't compare tenths with hundredths", mistake: null },
        ]
      ),
      activity: { kind: "tiles", rows: 10, cols: 10, mode: "count", target: a * 10 },
    };
  },

  "concrete|evaluate": (rng) => {
    // Does a zero at the end change a decimal?
    const k = int(rng, 2, 9);
    const name = pick(rng, NAMES);
    const truthful = rng() < 0.5;
    const a = dec(k * 100, 1);
    const b = `${a}0`;
    return {
      ...build(
        {
          ...base("c-evaluate", "concrete", "evaluate", "equal-decimals", k, rng),
          prompt: truthful
            ? `${name} says ${a} and ${b} are the same amount. Colour both on the hundred square to check. Is ${name} right?`
            : `${name} says ${b} is more than ${a}, because it has more digits. Colour both on the hundred square to check. Is ${name} right?`,
          representation: null,
        },
        { k, t: truthful ? 1 : 0 },
        truthful ? `Yes — ${k * 10} hundredths is the same as ${k} tenths` : `No — ${k * 10} hundredths is the same as ${k} tenths`,
        truthful
          ? [
              { text: `No — ${b} is more, because it has more digits`, mistake: "dec4-longer-is-bigger" },
              { text: `No — ${b} is ten times as much`, mistake: "dec4-zero-changes" },
              { text: `No — ${a} is more, because it is shorter`, mistake: null },
            ]
          : [
              { text: `Yes — ${b} has more digits, so it is more`, mistake: "dec4-longer-is-bigger" },
              { text: `No — ${b} is ten times as much`, mistake: "dec4-zero-changes" },
              { text: `No — ${a} is more, because it is shorter`, mistake: null },
            ]
      ),
      activity: { kind: "tiles", rows: 10, cols: 10, mode: "count", target: k * 10 },
    };
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    for (;;) {
      const t = int(rng, 1, 8);
      const h = int(rng, 1, 9);
      const n = t * 10 + h;
      if (t === h) continue;
      return build(
        {
          ...base("p-remember", "pictorial", "remember", "hundredths", n, rng),
          prompt: "The square is 1 whole. What decimal is coloured?",
          representation: { kind: "grid", rows: 10, cols: 10, shadedCells: n, compact: true },
        },
        { n },
        dec(n * 10, 2),
        [
          { text: dec(n * 100, 1), mistake: "dec4-shifts-place" },
          { text: dec((100 - n) * 10, 2), mistake: "dec4-rest" },
          { text: dec(n, 3), mistake: "dec4-tenths-hundredths" },
          { text: dec((h * 10 + t) * 10, 2), mistake: "dec4-reverses" },
        ]
      );
    }
  },

  "pictorial|understand": (rng) => {
    // Read number discs on a place-value chart.
    for (;;) {
      const tens = int(rng, 1, 4);
      const ones = int(rng, 0, 5);
      const tenths = int(rng, 1, 5);
      const hund = int(rng, 1, 5);
      if (tenths === hund) continue;
      const n = tens * 1000 + ones * 100 + tenths * 10 + hund; // hundredths
      return build(
        {
          ...base("p-understand", "pictorial", "understand", "number-discs", n, rng),
          prompt: "What decimal do the number discs show?",
          representation: {
            kind: "place-value-chart",
            columns: [
              { label: "T", count: tens },
              { label: "O", count: ones },
              { label: "t", count: tenths },
              { label: "h", count: hund },
            ],
          },
        },
        { n },
        dec(n * 10, 2),
        [
          { text: dec(n * 100, 1), mistake: "dec4-shifts-place" },
          { text: dec((tens * 1000 + ones * 100 + hund * 10 + tenths) * 10, 2), mistake: "dec4-reverses" },
          { text: String(n), mistake: "dec4-digits-as-whole" },
          { text: dec(n, 3), mistake: "dec4-shifts-place" },
        ]
      );
    }
  },

  "pictorial|apply": (rng) => {
    // A point on a number line in tenths.
    const w = int(rng, 0, 5);
    const k = pick(rng, [1, 2, 3, 4, 6, 7, 8, 9]);
    const v = w * 1000 + k * 100; // thousandths
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "tenths", v, rng),
        prompt: "What decimal is at the red dot?",
        representation: { kind: "number-line", min: w, max: w + 1, step: 0.1, labelEvery: 10, markers: [{ value: v / 1000, label: "?" }] },
      },
      { v },
      dec(v, 1),
      [
        { text: dec(w * 1000 + k * 10, 2), mistake: "dec4-tenths-hundredths" },
        { text: dec(w * 1000 + (10 - k) * 100, 1), mistake: "dec4-rest" },
        { text: String(w * 10 + k), mistake: "dec4-digits-as-whole" },
        { text: dec((w + 1) * 1000 + k * 100, 1), mistake: null },
      ]
    );
  },

  "pictorial|analyze": (rng) => {
    // Place value of one digit, read from discs (up to thousandths).
    for (;;) {
      const ones = int(rng, 1, 5);
      const t = int(rng, 1, 5);
      const h = int(rng, 1, 5);
      const th = int(rng, 1, 5);
      const ds = [ones, t, h, th];
      const at = int(rng, 1, 3); // ask about tenths, hundredths or thousandths
      const digit = ds[at];
      if (ds.filter((x) => x === digit).length > 1) continue;
      const n = ones * 1000 + t * 100 + h * 10 + th; // thousandths
      const words = ["ones", "tenths", "hundredths", "thousandths"];
      const value = (place: number) => `${digit} ${words[place]} (${dec(digit * [1000, 100, 10, 1][place], [0, 1, 2, 3][place])})`;
      return build(
        {
          ...base("p-analyze", "pictorial", "analyze", "place-value", n * 10 + at, rng),
          prompt: `The discs show ${dec(n, 3)}. What is the value of the digit ${digit}?`,
          representation: {
            kind: "place-value-chart",
            columns: [
              { label: "O", count: ones },
              { label: "t", count: t },
              { label: "h", count: h },
              { label: "th", count: th },
            ],
          },
        },
        { n, at },
        value(at),
        [0, 1, 2, 3].filter((p) => p !== at).map((p) => ({ text: value(p), mistake: p === 0 ? "dec4-face-value" : "dec4-tenths-hundredths" }))
      );
    }
  },

  "pictorial|evaluate": (rng) => {
    // 0.50 and 0.5: who is right?
    const k = int(rng, 2, 9);
    const a = pick(rng, NAMES);
    const b = pick(rng, NAMES.filter((x) => x !== a));
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "equal-decimals", k, rng),
        prompt: `${a} says the coloured part is ${dec(k * 100, 1)}0. ${b} says it is ${dec(k * 100, 1)}. Who is right?`,
        representation: { kind: "grid", rows: 10, cols: 10, shadedCells: k * 10, compact: true },
      },
      { k },
      `Both — ${k * 10} hundredths is the same as ${k} tenths`,
      [
        { text: `Only ${a} — there are ${k * 10} small squares`, mistake: "dec4-zero-changes" },
        { text: `Only ${b} — ${dec(k * 100, 1)}0 is ten times too big`, mistake: "dec4-zero-changes" },
        { text: `Neither — it is ${k}.0`, mistake: "dec4-shifts-place" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    // A fraction with denominator 10, 100 or 1000 as a decimal.
    const den = pick(rng, [10, 100, 1000]);
    const num = den === 10 ? int(rng, 1, 9) : den === 100 ? pick(rng, [int(rng, 1, 9), int(rng, 11, 99)]) : pick(rng, [int(rng, 1, 9), int(rng, 11, 99), int(rng, 101, 999)]);
    if (num % 10 === 0) return DECIMALS_G4_TEMPLATES["abstract|remember"](rng);
    const places = String(den).length - 1;
    const th = (num * 1000) / den;
    return build(
      { ...base("a-remember", "abstract", "remember", "fraction-to-decimal", num * 10000 + den, rng), prompt: `Write ${num}/${den} as a decimal.`, representation: null },
      { num, den },
      dec(th, places),
      [
        ...(places > 1 ? [{ text: dec(th * 10, places - 1), mistake: "dec4-tenths-hundredths" }] : []),
        ...(places < 3 ? [{ text: dec(th / 10, places + 1), mistake: "dec4-tenths-hundredths" }] : []),
        { text: String(num), mistake: "dec4-digits-as-whole" },
        { text: dec(th * 100, Math.max(0, places - 2)), mistake: "dec4-shifts-place" },
        { text: `${num}.${den}`, mistake: null },
      ]
    );
  },

  "abstract|understand": (rng) => {
    // A decimal as a fraction (not simplified, as the book writes it).
    const twoPlace = rng() < 0.6;
    const num = twoPlace ? int(rng, 11, 99) : int(rng, 1, 9);
    if (num % 10 === 0) return DECIMALS_G4_TEMPLATES["abstract|understand"](rng);
    const den = twoPlace ? 100 : 10;
    const d = dec((num * 1000) / den, twoPlace ? 2 : 1);
    return build(
      { ...base("a-understand", "abstract", "understand", "decimal-to-fraction", num * 1000 + den, rng), prompt: `Write ${d} as a fraction.`, representation: null },
      { num, den },
      `${num}/${den}`,
      [
        { text: `${num}/${den === 100 ? 10 : 100}`, mistake: den === 100 ? "dec4-digits-as-whole" : "dec4-tenths-hundredths" },
        { text: `${num}/${den * 10}`, mistake: "dec4-tenths-hundredths" },
        { text: `${den}/${num}`, mistake: null },
        { text: `1/${num}`, mistake: null },
      ]
    );
  },

  "abstract|apply": (rng) => {
    // A mixed fraction or an expanded form as a decimal.
    const w = int(rng, 1, 9);
    const t = int(rng, 1, 9);
    const h = int(rng, 1, 9);
    if (t === h) return DECIMALS_G4_TEMPLATES["abstract|apply"](rng);
    const expanded = rng() < 0.5;
    const th = w * 1000 + t * 100 + h * 10;
    const prompt = expanded ? `${w} + ${dec(t * 100, 1)} + ${dec(h * 10, 2)} = ?` : `Write ${w} ${t * 10 + h}/100 as a decimal.`;
    return build(
      { ...base("a-apply", "abstract", "apply", "mixed-to-decimal", th + (expanded ? 1 : 0), rng), prompt, representation: null },
      { th, e: expanded ? 1 : 0 },
      dec(th, 2),
      [
        { text: dec(w * 1000 + h * 100 + t * 10, 2), mistake: "dec4-reverses" },
        { text: dec(w * 1000 + t * 10 + h, 3), mistake: "dec4-tenths-hundredths" },
        { text: String(w * 100 + t * 10 + h), mistake: "dec4-digits-as-whole" },
        { text: dec(w * 1000 + (t + h) * 100, 1), mistake: null },
      ]
    );
  },

  "abstract|analyze": (rng) => {
    // Value of a digit in a decimal with 3 places.
    for (;;) {
      const ds = [int(rng, 1, 9), int(rng, 0, 9), int(rng, 1, 9), int(rng, 1, 9), int(rng, 1, 9)]; // tens, ones, t, h, th
      const at = int(rng, 2, 4);
      const digit = ds[at];
      if (ds.filter((x) => x === digit).length > 1) continue;
      const n = ds[0] * 10000 + ds[1] * 1000 + ds[2] * 100 + ds[3] * 10 + ds[4]; // thousandths
      const valueAt = (p: number) => dec(digit * [10000, 1000, 100, 10, 1][p], [0, 0, 1, 2, 3][p]);
      return build(
        { ...base("a-analyze", "abstract", "analyze", "place-value", n * 10 + at, rng), prompt: `What is the value of the digit ${digit} in ${dec(n, 3)}?`, representation: null },
        { n, at },
        valueAt(at),
        [
          ...[2, 3, 4].filter((p) => p !== at).map((p) => ({ text: valueAt(p), mistake: "dec4-tenths-hundredths" })),
          { text: String(digit), mistake: "dec4-face-value" },
          { text: valueAt(1), mistake: "dec4-face-value" },
        ]
      );
    }
  },

  "abstract|evaluate": (rng) => {
    // Which values make up a decimal (expanded form): is the claim right?
    for (;;) {
      const w = int(rng, 1, 9);
      const t = int(rng, 0, 9);
      const h = int(rng, 1, 9);
      const th = int(rng, 1, 9);
      if (new Set([w, t, h, th]).size < 4 || t === 0) continue;
      const n = w * 1000 + t * 100 + h * 10 + th;
      const name = pick(rng, NAMES);
      const truthful = rng() < 0.4;
      const parts = (a: number, b: number, c: number) => `${w} + ${dec(a, 1)} + ${dec(b, 2)} + ${dec(c, 3)}`;
      const right = parts(t * 100, h * 10, th);
      const claim = truthful ? right : `${w} + ${dec(t * 100, 1)} + ${dec(h * 100, 1)} + ${dec(th * 10, 2)}`;
      return build(
        { ...base("a-evaluate", "abstract", "evaluate", "expanded-form", n, rng), prompt: `${name} says ${dec(n, 3)} = ${claim}. Is ${name} right?`, representation: null },
        { n, t: truthful ? 1 : 0 },
        truthful ? `Yes — ${t} tenths, ${h} hundredths and ${th} thousandths` : `No — it is ${right}`,
        truthful
          ? [
              { text: `No — it is ${w} + ${dec(t * 100, 1)} + ${dec(h * 100, 1)} + ${dec(th * 10, 2)}`, mistake: "dec4-tenths-hundredths" },
              { text: `No — it is ${w} + ${t} + ${h} + ${th}`, mistake: "dec4-face-value" },
              { text: `No — the digits after the point can't be split up`, mistake: null },
            ]
          : [
              { text: `Yes — each digit is worth a tenth`, mistake: "dec4-tenths-hundredths" },
              { text: `No — it is ${w} + ${t} + ${h} + ${th}`, mistake: "dec4-face-value" },
              { text: `No — the digits after the point can't be split up`, mistake: null },
            ]
      );
    }
  },
};

/** Independent answer check for the stress test. */
export function verify(item: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const right = item.choices.find((c) => c.id === item.correctChoiceId)?.text ?? "";
  const p = item.params;
  const num = (t: string) => Number(t);
  switch (`${item.cpa}|${item.bloom}`) {
    case "concrete|analyze":
      return parseFloat(right) === p.a / 10 && p.a / 10 > p.b / 100 ? null : `comparison wrong: ${right}`;
    case "pictorial|remember":
      return Math.abs(num(right) - p.n / 100) < 1e-9 ? null : `hundredths wrong: ${right}`;
    case "pictorial|understand":
      return Math.abs(num(right) - p.n / 100) < 1e-9 ? null : `discs wrong: ${right}`;
    case "pictorial|apply":
      return Math.abs(num(right) - p.v / 1000) < 1e-9 ? null : `number line wrong: ${right}`;
    case "abstract|remember":
      return Math.abs(num(right) - p.num / p.den) < 1e-9 && !item.choices.some((c) => c.id !== item.correctChoiceId && Math.abs(Number(c.text) - p.num / p.den) < 1e-9) ? null : `fraction to decimal wrong: ${right}`;
    case "abstract|understand":
      return right === `${p.num}/${p.den}` ? null : `decimal to fraction wrong: ${right}`;
    case "abstract|apply":
      return Math.abs(num(right) - p.th / 1000) < 1e-9 ? null : `mixed to decimal wrong: ${right}`;
    case "abstract|analyze":
    case "pictorial|analyze": {
      const s = String(p.n).padStart(item.cpa === "abstract" ? 5 : 4, "0");
      const idx = item.cpa === "abstract" ? p.at : p.at;
      const places = item.cpa === "abstract" ? [10, 1, 0.1, 0.01, 0.001] : [1, 0.1, 0.01, 0.001];
      const want = Number(s[idx]) * places[idx];
      const got = Number(right.match(/\(([\d.]+)\)/)?.[1] ?? right);
      return Math.abs(got - want) < 1e-9 ? null : `place value wrong: ${right} (want ${want})`;
    }
    case "concrete|evaluate":
    case "abstract|evaluate":
      return right.startsWith(p.t ? "Yes" : "No") ? null : `claim marked wrongly: ${right}`;
    case "pictorial|evaluate":
      return right.startsWith("Both") ? null : `0.50 = 0.5 not chosen: ${right}`;
  }
  return null;
}
