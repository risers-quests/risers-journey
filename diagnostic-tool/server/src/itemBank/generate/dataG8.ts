import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { FigureSpec, ShadeActivity } from "../../types.js";

/**
 * Data Handling, Grade 8 (book chapter 24): grouping raw data into classes
 * (10–20 means 10 up to but not including 20), frequency, bar graphs, and
 * simple pie charts (angle = part ÷ total × 360°).
 *   concrete  hands-on: shade one square per value that falls in a class;
 *             shade a pie sector's angle (10° a square), the missing sector,
 *             the people a sector stands for
 *   pictorial bar graphs and pie charts to read and compare
 *   abstract  class width, which class a boundary value goes in, a pie
 *             angle, people from an angle, a frequency count
 */

const TOPIC = "g8-data";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "dh-boundary": {
    label: "Puts a boundary value in the wrong class",
    detail: "In classes 10–20, 20–30, a value of exactly 20 belongs in 20–30, not 10–20.",
    childTip: "10–20 means from 10 up to (but not including) 20. A 20 starts the next class.",
  },
  "dh-miscount": {
    label: "Miscounts the values in a class",
    detail: "Misses or double-counts values when grouping.",
    childTip: "Go through the list once, tallying each value as you go, and cross it off.",
  },
  "dh-pie-value": {
    label: "Uses the number itself as the angle",
    detail: "Draws 15 people as a 15° sector, without working out their share of 360°.",
    childTip: "Angle = (part ÷ total) × 360°.",
  },
  "dh-pie-percent": {
    label: "Uses 100 instead of 360",
    detail: "Works out a pie angle as a percentage (out of 100) instead of out of 360°.",
    childTip: "A full circle is 360°, not 100. Angle = part ÷ total × 360°.",
  },
  "dh-class-width": {
    label: "Gets the class width wrong",
    detail: "Counts 10–20 as 11 wide, or gives the upper limit as the width.",
    childTip: "Class width = upper limit − lower limit: 20 − 10 = 10.",
  },
  "dh-read-graph": {
    label: "Reads the graph wrongly",
    detail: "Adds when the question asks for a difference, or picks the wrong bar or sector.",
    childTip: "Read each bar's value carefully, then do exactly what the question asks.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `dh8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const shade = (target: number, wrong: { value: number; mistake: string }[], unit: string, rows = 4): ShadeActivity => ({
  kind: "shade",
  rows,
  cols: 10,
  target,
  unit,
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= rows * 10 && wrong.findIndex((x) => x.value === w.value) === i),
});
/** Raw marks with some values exactly on the class boundaries. */
function marks(rng: Rng, lo: number, hi: number): number[] {
  const n = int(rng, 16, 24);
  const list = Array.from({ length: n }, () => int(rng, 0, 49));
  list[0] = lo; // a boundary value in the class
  list[1] = hi; // and one on its top edge (belongs to the next class)
  if (rng() < 0.7) list[2] = hi;
  return list.sort(() => rng() - 0.5);
}
const inClass = (list: number[], lo: number, hi: number) => list.filter((x) => x >= lo && x < hi).length;
const SPORTS = ["Cricket", "Football", "Kabaddi", "Badminton", "Chess", "Hockey"];
const pie = (slices: { value: number; label: string }[]): FigureSpec => ({ kind: "figure", figure: "pie", slices });
/** A total and four parts whose pie angles are whole multiples of 10° (the total is a multiple of 36). */
function pieData(rng: Rng): { T: number; parts: number[] } {
  const T = pick(rng, [36, 72, 108, 144, 180]);
  const unit = T / 36; // people per 10°
  for (;;) {
    const k = [int(rng, 3, 12), int(rng, 3, 12), int(rng, 3, 12)];
    const last = 36 - k.reduce((a, x) => a + x, 0);
    if (last >= 3) return { T, parts: [...k, last].map((x) => x * unit) };
  }
}

export const DATA_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng) => {
    const lo = pick(rng, [10, 20, 30]), hi = lo + 10;
    const list = marks(rng, lo, hi);
    const right = inClass(list, lo, hi);
    return buildActivity(
      {
        ...base("c-remember", "concrete", "remember", "grouping", rng),
        prompt: `Test marks: ${list.join(", ")}. Shade one square for each mark in the class ${lo}–${hi} (from ${lo} up to, not including, ${hi}).`,
        representation: null,
      },
      { lo, s: list.reduce((a, x) => a * 31 + x, 7) % 1e9 },
      shade(right, [{ value: list.filter((x) => x >= lo && x <= hi).length, mistake: "dh-boundary" }, { value: list.filter((x) => x > lo && x <= hi).length, mistake: "dh-boundary" }], "Each square = 1 mark")
    );
  },
  "concrete|understand": (rng) => {
    const { T, parts } = pieData(rng);
    const i = int(rng, 0, parts.length - 1), p = parts[i];
    const angle = Math.round((p / T) * 360);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "pie charts", rng), prompt: `${p} out of ${T} children chose ${SPORTS[i]}. Each square is 10°. Shade the angle of its sector in a pie chart.`, representation: null },
      { T, p },
      shade(angle / 10, [{ value: p / 10, mistake: "dh-pie-value" }, { value: p, mistake: "dh-pie-value" }, { value: Math.round(((p / T) * 100) / 10), mistake: "dh-pie-percent" }], "Each square = 10°", 10)
    );
  },
  "concrete|apply": (rng) => {
    const lo = pick(rng, [25, 30, 35]), hi = lo + 5;
    const n = int(rng, 14, 20);
    const list = Array.from({ length: n }, () => int(rng, 20, 44));
    list[0] = hi;
    list[1] = lo;
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "grouping", rng), prompt: `Daily temperatures (°C): ${list.join(", ")}. Shade one square for each day in the class ${lo}–${hi}.`, representation: null },
      { lo, s: list.reduce((a, x) => a * 31 + x, 7) % 1e9 },
      shade(inClass(list, lo, hi), [{ value: list.filter((x) => x >= lo && x <= hi).length, mistake: "dh-boundary" }], "Each square = 1 day")
    );
  },
  "concrete|analyze": (rng) => {
    const a = 10 * int(rng, 6, 12), b = 10 * int(rng, 5, 10), c = 10 * int(rng, 4, 9);
    const d = 360 - a - b - c;
    if (d < 30) return DATA_G8_TEMPLATES["concrete|analyze"](rng);
    return buildActivity(
      {
        ...base("c-analyze", "concrete", "analyze", "pie charts", rng),
        prompt: `A pie chart has sectors of ${a}°, ${b}° and ${c}°, and one more. Each square is 10°. Shade the missing sector.`,
        representation: pie([{ value: a, label: `${a}°` }, { value: b, label: `${b}°` }, { value: c, label: `${c}°` }, { value: d, label: "?" }]),
      },
      { a, b, c },
      shade(d / 10, [{ value: (100 - (a + b + c) / 3.6) / 10, mistake: "dh-pie-percent" }], "Each square = 10°", 10)
    );
  },
  "concrete|evaluate": (rng) => {
    const T = pick(rng, [36, 72, 90, 180, 60]);
    const a = 10 * int(rng, 3, 15);
    const people = (T * a) / 360;
    if (!Number.isInteger(people) || people > 40) return DATA_G8_TEMPLATES["concrete|evaluate"](rng);
    return buildActivity(
      { ...base("c-evaluate", "concrete", "evaluate", "reading pie charts", rng), prompt: `${T} people were asked their favourite fruit. The mango sector is ${a}°. Shade one square for each person who chose mango.`, representation: pie([{ value: a, label: `mango ${a}°` }, { value: 360 - a, label: "others" }]) },
      { T, a },
      shade(people, [{ value: a / 10, mistake: "dh-pie-value" }, { value: Math.round((T * a) / 100), mistake: "dh-pie-percent" }], "Each square = 1 person")
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const k = 4;
    const vals = Array.from({ length: k }, () => int(rng, 3, 30));
    if (new Set(vals).size < k) return DATA_G8_TEMPLATES["pictorial|remember"](rng);
    const names = SPORTS.slice(0, k);
    const max = vals.indexOf(Math.max(...vals)), min = vals.indexOf(Math.min(...vals));
    return build(
      { ...base("p-remember", "pictorial", "remember", "bar graphs", rng), prompt: "Which sport did the most children choose?", representation: { kind: "bars", bars: names.map((n, i) => ({ name: n, parts: [{ value: vals[i], label: String(vals[i]) }] })) } },
      { a: vals[0], b: vals[1], c: vals[2], d: vals[3] },
      names[max],
      names.filter((_, i) => i !== max).map((n, i) => ({ text: n, mistake: names.indexOf(n) === min ? "dh-read-graph" : null }))
    );
  },
  "pictorial|understand": (rng) => {
    const { T, parts } = pieData(rng);
    const i = int(rng, 0, parts.length - 1);
    const angles = parts.map((p) => Math.round((p / T) * 360));
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "reading pie charts", rng),
        prompt: `This pie chart shows the favourite sports of ${T} children. How many chose ${SPORTS[i]}?`,
        representation: pie(parts.map((_, j) => ({ value: angles[j], label: `${SPORTS[j]} ${angles[j]}°` }))),
      },
      { T, i, a: angles[0], b: angles[1] },
      String(parts[i]),
      [
        { text: String(angles[i]), mistake: "dh-pie-value" },
        { text: String(Math.round((angles[i] / 100) * T)), mistake: "dh-pie-percent" },
        { text: String(parts[i] + 2), mistake: null },
        { text: String(Math.max(1, parts[i] - 2)), mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const vals = Array.from({ length: 4 }, () => int(rng, 4, 40));
    let [i, j] = [int(rng, 0, 3), int(rng, 0, 3)];
    if (i === j || vals[i] === vals[j]) return DATA_G8_TEMPLATES["pictorial|apply"](rng);
    if (vals[i] < vals[j]) [i, j] = [j, i]; // "how many more chose A than B": A is the bigger
    const names = SPORTS.slice(0, 4);
    return build(
      { ...base("p-apply", "pictorial", "apply", "bar graphs", rng), prompt: `How many more children chose ${names[i]} than ${names[j]}?`, representation: { kind: "bars", bars: names.map((n, k) => ({ name: n, parts: [{ value: vals[k], label: String(vals[k]) }] })) } },
      { a: vals[0], b: vals[1], c: vals[2], d: vals[3], i, j },
      String(vals[i] - vals[j]),
      [
        { text: String(vals[i] + vals[j]), mistake: "dh-read-graph" },
        { text: String(vals[j] - vals[i]), mistake: "dh-read-graph" },
        { text: String(vals[i]), mistake: "dh-read-graph" },
        { text: String(vals[i] - vals[j] + 1), mistake: null },
        { text: String(vals[i] - vals[j] + 2), mistake: null },
        { text: String(vals[i] - vals[j] + 3), mistake: null },
      ].filter((w) => !w.text.startsWith("-"))
    );
  },
  "pictorial|analyze": (rng) => {
    const angles = pick(rng, [[90, 120, 60, 90], [180, 90, 45, 45], [72, 144, 108, 36], [90, 90, 120, 60], [36, 180, 72, 72]] as const);
    const i = int(rng, 0, 3);
    const pct = (angles[i] / 360) * 100;
    return build(
      { ...base("p-analyze", "pictorial", "analyze", "pie charts", rng), prompt: `What percent of the children chose ${SPORTS[i]}?`, representation: pie(angles.map((a, j) => ({ value: a, label: `${SPORTS[j]} ${a}°` }))) },
      { i, a: angles[0], b: angles[1] },
      `${+pct.toFixed(1)}%`,
      [
        { text: `${angles[i]}%`, mistake: "dh-pie-value" },
        { text: `${+((angles[i] / 100) * 36).toFixed(1)}%`, mistake: "dh-pie-percent" },
        { text: `${+(pct + 5).toFixed(1)}%`, mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const f = [int(rng, 2, 8), int(rng, 4, 12), int(rng, 3, 10), int(rng, 1, 6)];
    const classes = ["0–10", "10–20", "20–30", "30–40"];
    const top = f.indexOf(Math.max(...f));
    if (f.filter((x) => x === f[top]).length > 1) return DATA_G8_TEMPLATES["pictorial|evaluate"](rng);
    const claimClass = pick(rng, [0, 1, 2, 3].filter((x) => x !== top));
    const name = pick(rng, ["Riya", "Arjun", "Meera", "Kabir", "Diya", "Rohan"]);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "grouped data", rng),
        prompt: `The bar graph shows how many children scored in each class of marks. ${name} says most children scored ${classes[claimClass]}. Is ${name} right?`,
        representation: { kind: "bars", bars: classes.map((c, i) => ({ name: c, parts: [{ value: f[i], label: String(f[i]) }] })) },
      },
      { a: f[0], b: f[1], c: f[2], d: f[3], k: claimClass },
      `No: the most children (${f[top]}) scored ${classes[top]}`,
      [
        { text: `Yes: ${classes[claimClass]} has ${f[claimClass]} children`, mistake: "dh-read-graph" },
        { text: `No: the most scored ${classes[f.indexOf(Math.min(...f))]}`, mistake: "dh-read-graph" },
        { text: "You can't tell from a bar graph", mistake: null },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const w = pick(rng, [5, 10, 20, 25]), lo = w * int(rng, 1, 8);
    return build(
      { ...base("a-remember", "abstract", "remember", "classes", rng), prompt: `What is the width of the class ${lo}–${lo + w}?`, representation: null },
      { w, lo },
      String(w),
      [
        { text: String(w + 1), mistake: "dh-class-width" },
        { text: String(lo + w), mistake: "dh-class-width" },
        { text: String(lo + w / 2), mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const w = pick(rng, [5, 10, 20]), b = w * int(rng, 2, 8);
    return build(
      { ...base("a-understand", "abstract", "understand", "classes", rng), prompt: `The classes are ${b - w}–${b}, ${b}–${b + w}, ${b + w}–${b + 2 * w}. Which class does a value of exactly ${b} go in?`, representation: null },
      { w, b },
      `${b}–${b + w}`,
      [
        { text: `${b - w}–${b}`, mistake: "dh-boundary" },
        { text: "Both of them", mistake: "dh-boundary" },
        { text: `${b + w}–${b + 2 * w}`, mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const { T, parts } = pieData(rng);
    const p = parts[0];
    return build(
      { ...base("a-apply", "abstract", "apply", "pie charts", rng), prompt: `${p} of ${T} students walk to school. What is the angle of their sector in a pie chart?`, representation: null },
      { T, p },
      `${Math.round((p / T) * 360)}°`,
      [
        { text: `${p}°`, mistake: "dh-pie-value" },
        { text: `${+((p / T) * 100).toFixed(1)}°`, mistake: "dh-pie-percent" },
        { text: `${Math.round((p / T) * 180)}°`, mistake: null },
        { text: `${Math.round((p / T) * 360) + 10}°`, mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const T = pick(rng, [36, 72, 120, 180, 240, 720]); // not 360: the answer would equal the angle
    const a = 10 * int(rng, 2, 18);
    const people = (T * a) / 360;
    if (!Number.isInteger(people)) return DATA_G8_TEMPLATES["abstract|analyze"](rng);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "reading pie charts", rng), prompt: `In a pie chart of ${T} families, the sector for 'cycle' is ${a}°. How many families is that?`, representation: null },
      { T, a },
      String(people),
      [
        { text: String(a), mistake: "dh-pie-value" },
        { text: String(+((T * a) / 100).toFixed(1)), mistake: "dh-pie-percent" },
        { text: String(people * 2), mistake: null },
        { text: String(people + 1), mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const lo = pick(rng, [10, 20, 30]), hi = lo + 10;
    const list = Array.from({ length: int(rng, 10, 14) }, () => int(rng, 0, 49));
    list[0] = hi;
    list[1] = lo;
    const right = inClass(list, lo, hi);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "frequency", rng), prompt: `Marks: ${list.join(", ")}. What is the frequency of the class ${lo}–${hi}?`, representation: null },
      { lo, s: list.reduce((a, x) => a * 31 + x, 7) % 1e9 },
      String(right),
      [
        { text: String(list.filter((x) => x >= lo && x <= hi).length), mistake: "dh-boundary" },
        { text: String(list.filter((x) => x > lo && x <= hi).length), mistake: "dh-boundary" },
        { text: String(right + 1), mistake: "dh-miscount" },
        { text: String(Math.max(0, right - 1)), mistake: "dh-miscount" },
        { text: String(right + 2), mistake: "dh-miscount" },
      ]
    );
  },
};
