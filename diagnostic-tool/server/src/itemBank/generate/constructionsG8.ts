import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { FigureSpec, ShadeActivity } from "../../types.js";

/**
 * Constructions, Grade 8 (book chapter 18), ruler and compasses: a
 * quadrilateral from four sides and a diagonal; three sides and two
 * diagonals; three sides and two included angles; two adjacent sides and
 * three angles. On screen we can't use compasses, so this checks what a
 * construction depends on: five measurements, which triangle to draw first,
 * when a length or angle is impossible.
 *   concrete  hands-on: draw rectangles and squares to size on a grid;
 *             shade the longest a diagonal can be (1 square = 1 cm)
 *   pictorial quadrilaterals with their given measurements
 *   abstract  which measurements are enough, included angles, possible
 *             diagonals, possible angles, the order of steps
 */

const TOPIC = "g8-constructions";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "con-four-enough": {
    label: "Thinks four measurements fix a quadrilateral",
    detail: "Four sides alone can make many shapes (push the corners and it leans); five measurements are needed.",
    childTip: "Make a frame with 4 sticks: it wobbles. A fifth measurement (a diagonal or an angle) holds it.",
  },
  "con-triangle-inequality": {
    label: "Allows a side as long as the other two together",
    detail: "A diagonal must be shorter than the two sides it joins, added together; equal or longer makes a flat line or no triangle.",
    childTip: "Any side of a triangle is less than the other two added together.",
  },
  "con-one-triangle": {
    label: "Checks only one of the two triangles",
    detail: "A diagonal is a side of two triangles; it must fit both.",
    childTip: "The diagonal AC is in triangle ABC and triangle ACD. Check both.",
  },
  "con-step-order": {
    label: "Starts with a triangle that isn't known",
    detail: "Begins with a triangle whose three sides aren't all given.",
    childTip: "Start with the triangle whose three sides you know, then add the fourth corner.",
  },
  "con-angle-sum": {
    label: "Forgets the angles must add up to 360°",
    detail: "Accepts angles that already add up to 360° or more, or uses 180° for the fourth angle.",
    childTip: "A quadrilateral's angles add up to exactly 360°.",
  },
  "con-wrong-pair": {
    label: "Picks angles that aren't between the given sides",
    detail: "An included angle is the one between two given sides.",
    childTip: "For sides AB, BC, CD the included angles are at B (between AB and BC) and C.",
  },
  "con-swaps": {
    label: "Swaps length and height",
    detail: "Draws the rectangle on its side: the length going down instead of across.",
    childTip: "Length goes across, height goes down. Count squares along the top first.",
  },
  "con-perimeter": {
    label: "Doesn't halve the perimeter",
    detail: "Takes the length from the whole perimeter instead of from half of it (length + height).",
    childTip: "Perimeter = 2 × (length + height), so length + height is half the perimeter.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `con8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const ROWS = 8, COLS = 10;
const rect = (w: number, h: number) => Array.from({ length: h }, (_, r) => Array.from({ length: w }, (_, c) => r * COLS + c)).flat();
const draw = (w: number, h: number, wrong: { w: number; h: number; mistake: string }[]): ShadeActivity => ({
  kind: "shade",
  mode: "free",
  rows: ROWS,
  cols: COLS,
  target: w * h,
  targetCells: rect(w, h),
  wrongSets: wrong.filter((x) => x.w >= 1 && x.h >= 1 && x.w <= COLS && x.h <= ROWS && !(x.w === w && x.h === h)).map((x) => ({ cells: rect(x.w, x.h), mistake: x.mistake })),
  unit: "Each square = 1 cm",
});
const length = (target: number, wrong: { value: number; mistake: string }[]): ShadeActivity => ({
  kind: "shade",
  rows: 10,
  cols: 10,
  target,
  unit: "Each square = 1 cm",
  wrong: wrong.filter((w, i) => w.value !== target && w.value >= 0 && w.value <= 100 && wrong.findIndex((x) => x.value === w.value) === i),
});
const quad = (extra: Partial<FigureSpec> = {}): FigureSpec => ({ kind: "figure", figure: "quad", quad: "general", vertexLabels: ["A", "B", "C", "D"], ...extra });
const SETS = ["Four sides and one diagonal", "Three sides and two diagonals", "Three sides and the two angles between them", "Two next-door sides and three angles"];

export const CONSTRUCTIONS_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: drawing to size ----------------
  "concrete|remember": (rng) => {
    const w = int(rng, 2, 8);
    let h = int(rng, 2, 6);
    if (h === w) h = w > 2 ? w - 1 : 3;
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "drawing to size", rng), prompt: `Shade a rectangle ${w} cm long (across) and ${h} cm high, starting at the top-left corner.`, representation: null },
      { w, h },
      draw(w, h, [{ w: h, h: w, mistake: "con-swaps" }])
    );
  },
  "concrete|understand": (rng) => {
    const s = int(rng, 2, 7);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "drawing to size", rng), prompt: `Shade a square with sides of ${s} cm, starting at the top-left corner.`, representation: null },
      { s },
      draw(s, s, [])
    );
  },
  "concrete|apply": (rng) => {
    const w = int(rng, 2, 7), h = int(rng, 2, 6);
    const P = 2 * (w + h);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "drawing to size", rng), prompt: `A rectangle is ${w} cm long and has a perimeter of ${P} cm. Shade it, starting at the top-left corner.`, representation: null },
      { w, h },
      draw(w, h, [{ w, h: P - 2 * w, mistake: "con-perimeter" }, { w: h, h: w, mistake: "con-swaps" }])
    );
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 3, 12), b = int(rng, 3, 12);
    return buildActivity(
      { ...base("c-analyze", "concrete", "analyze", "possible lengths", rng), prompt: `In triangle ABC, AB = ${a} cm and BC = ${b} cm. AC is a whole number of cm. Shade the longest AC can be.`, representation: null },
      { a, b },
      length(a + b - 1, [{ value: a + b, mistake: "con-triangle-inequality" }])
    );
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 3, 10), b = int(rng, 3, 10), c = int(rng, 3, 10), d = int(rng, 3, 10);
    if (a + b === c + d) return CONSTRUCTIONS_G8_TEMPLATES["concrete|evaluate"](rng);
    const lo = Math.min(a + b, c + d), hi = Math.max(a + b, c + d);
    return buildActivity(
      {
        ...base("c-evaluate", "concrete", "evaluate", "possible lengths", rng),
        prompt: `Quadrilateral ABCD has AB = ${a}, BC = ${b}, CD = ${c}, DA = ${d} (cm). Diagonal AC is a whole number of cm. Shade the longest AC can be.`,
        representation: quad({ sideLabels: [`${a}`, `${b}`, `${c}`, `${d}`], diagonals: false }),
      },
      { a, b, c, d },
      length(lo - 1, [{ value: hi - 1, mistake: "con-one-triangle" }, { value: lo, mistake: "con-triangle-inequality" }])
    );
  },

  // ---------------- PICTORIAL: quadrilaterals with their measurements ----------------
  "pictorial|remember": (rng) => build(
    { ...base("p-remember", "pictorial", "remember", "measurements needed", rng), prompt: "How many measurements do you need to construct one exact quadrilateral like ABCD?", representation: quad() },
    { n: Math.floor(rng() * 1e6) },
    "5",
    [
      { text: "4", mistake: "con-four-enough" },
      { text: "3", mistake: null },
      { text: "8", mistake: null },
    ]
  ),
  "pictorial|understand": (rng) => {
    const useAC = rng() < 0.5;
    const [a, b, c, d, e] = Array.from({ length: 5 }, () => int(rng, 4, 9));
    const right = useAC ? "Triangle ABC: AB, BC and AC are all known" : "Triangle ABD: AB, DA and BD are all known";
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "order of steps", rng),
        prompt: `You know AB, BC, CD, DA and the diagonal ${useAC ? "AC" : "BD"}. Which triangle do you construct first?`,
        representation: quad({ sideLabels: [`${a}`, `${b}`, `${c}`, `${d}`], note: `${useAC ? "AC" : "BD"} = ${e} cm` }),
      },
      { useAC: useAC ? 1 : 0, a, b, c, d, e },
      right,
      [
        { text: useAC ? "Triangle ABD: AB, DA and BD" : "Triangle ABC: AB, BC and AC", mistake: "con-step-order" },
        { text: "Start by drawing angle A", mistake: "con-step-order" },
        { text: useAC ? "Triangle BCD: BC, CD and BD" : "Triangle ACD: CD, DA and AC", mistake: "con-step-order" },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 3, 9), b = int(rng, 3, 9);
    const ok = rng() < 0.5;
    const ac = ok ? int(rng, Math.abs(a - b) + 1, a + b - 1) : a + b + int(rng, 0, 3);
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "possible lengths", rng),
        prompt: `Can ABCD be constructed with AB = ${a} cm, BC = ${b} cm and diagonal AC = ${ac} cm?`,
        representation: quad({ sideLabels: [`${a} cm`, `${b} cm`, "", ""], diagonals: false, note: `AC = ${ac} cm` }),
      },
      { a, b, ac },
      ok ? `Yes: ${ac} is less than ${a} + ${b} = ${a + b}` : `No: AC must be less than ${a} + ${b} = ${a + b}`,
      [
        ok ? { text: `No: AC must be less than ${Math.max(a, b)}`, mistake: null } : { text: "Yes: any length of diagonal works", mistake: "con-triangle-inequality" },
        ok ? { text: `No: AC must equal ${a} + ${b}`, mistake: null } : { text: `Yes: ${ac} is close enough to ${a + b}`, mistake: "con-triangle-inequality" },
        { text: `${ok ? "No" : "Yes"}: it depends on CD and DA only`, mistake: "con-one-triangle" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const possible = rng() < 0.5;
    const p = 5 * int(rng, 14, 24), q = 5 * int(rng, 14, 24);
    const r = possible ? 5 * int(rng, 14, Math.min(34, (355 - p - q) / 5)) : Math.max(5 * int(rng, 14, 34), 360 - p - q + 5 * int(rng, 0, 6));
    const s = p + q + r;
    if (possible && s >= 360) return CONSTRUCTIONS_G8_TEMPLATES["pictorial|analyze"](rng);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "possible angles", rng),
        prompt: `Can a quadrilateral have angles A = ${p}°, B = ${q}° and C = ${r}°?`,
        representation: quad({ angleLabels: [`${p}°`, `${q}°`, `${r}°`, "?"] }),
      },
      { p, q, r },
      possible ? `Yes: angle D would be ${360 - s}°` : `No: they already add up to ${s}°`,
      [
        possible ? { text: `No: they already add up to ${s}°`, mistake: null } : { text: `Yes: angle D would be ${Math.abs(360 - s) || 5}°`, mistake: "con-angle-sum" },
        { text: `Yes: angle D would be ${Math.abs(180 - s)}°`, mistake: "con-angle-sum" },
        { text: "Yes: any three angles work", mistake: "con-angle-sum" },
        { text: `Yes: angle D would be ${Math.abs(540 - s)}°`, mistake: "con-angle-sum" },
        { text: "No: a quadrilateral can't have an angle over 90°", mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => build(
    { ...base("p-evaluate", "pictorial", "evaluate", "measurements needed", rng), prompt: "Which of these is NOT enough to construct one exact quadrilateral?", representation: quad() },
    { n: Math.floor(rng() * 1e6) },
    "Four sides only",
    [
      { text: SETS[0], mistake: null },
      { text: SETS[1], mistake: null },
      { text: SETS[3], mistake: null },
    ]
  ),

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const v = int(rng, 0, 3);
    return build(
      { ...base("a-remember", "abstract", "remember", "measurements needed", rng), prompt: "Which of these is enough to construct one exact quadrilateral?", representation: null },
      { v },
      SETS[v],
      [
        { text: "Four sides", mistake: "con-four-enough" },
        { text: "Four angles", mistake: "con-four-enough" },
        { text: "Two sides and two angles", mistake: "con-four-enough" },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const v = int(rng, 0, 1);
    const [s1, s2, s3, right, wrong1, wrong2] = v ? ["BC", "CD", "DA", "∠C and ∠D", "∠A and ∠B", "∠B and ∠C"] : ["AB", "BC", "CD", "∠B and ∠C", "∠A and ∠D", "∠A and ∠B"];
    return build(
      { ...base("a-understand", "abstract", "understand", "included angles", rng), prompt: `You are given ${s1}, ${s2} and ${s3}, and the two angles included between them. Which angles are they?`, representation: null },
      { v },
      right,
      [
        { text: wrong1, mistake: "con-wrong-pair" },
        { text: wrong2, mistake: "con-wrong-pair" },
        { text: v ? "∠A and ∠D" : "∠C and ∠D", mistake: "con-wrong-pair" },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 4, 12), b = int(rng, 4, 12);
    let ok = int(rng, Math.abs(a - b) + 1, a + b - 1);
    if (ok === a || ok === b) ok = ok + 1 < a + b ? ok + 1 : ok - 1;
    if (ok === a || ok === b) ok = Math.abs(a - b) + 1;
    return build(
      { ...base("a-apply", "abstract", "apply", "possible lengths", rng), prompt: `AB = ${a} cm and BC = ${b} cm. Which could diagonal AC be?`, representation: null },
      { a, b, ok },
      `${ok} cm`,
      [
        { text: `${a + b} cm`, mistake: "con-triangle-inequality" },
        { text: `${a + b + int(rng, 1, 4)} cm`, mistake: "con-triangle-inequality" },
        { text: `${Math.abs(a - b)} cm`, mistake: "con-triangle-inequality" },
        { text: `${a + b + 5} cm`, mistake: "con-triangle-inequality" },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const p = 5 * int(rng, 18, 30), q = 5 * int(rng, 18, 30);
    const r = 360 - p - q + 5 * int(rng, 0, 8);
    const s = p + q + r;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "possible angles", rng), prompt: `Can quadrilateral ABCD have ∠A = ${p}°, ∠B = ${q}° and ∠C = ${r}°?`, representation: null },
      { p, q, r },
      `No: those three already make ${s}°, leaving nothing for ∠D`,
      [
        { text: `Yes: ∠D = ${Math.abs(s - 360) || 0}°`, mistake: "con-angle-sum" },
        { text: `Yes: ∠D = ${Math.abs(540 - s)}°`, mistake: "con-angle-sum" },
        { text: "Yes: angles can be anything", mistake: "con-angle-sum" },
      ]
    );
  },
  "abstract|evaluate": (rng) => build(
    { ...base("a-evaluate", "abstract", "evaluate", "order of steps", rng), prompt: "You know AB, BC, CD and both diagonals AC and BD. What is the best way to start?", representation: null },
    { n: Math.floor(rng() * 1e6) },
    "Construct triangle ABC, then find D with arcs of BD from B and CD from C",
    [
      { text: "Construct triangle ACD first", mistake: "con-step-order" },
      { text: "Construct triangle ABD first", mistake: "con-step-order" },
      { text: "Draw AB, then find D using DA", mistake: "con-step-order" },
    ]
  ),
};
