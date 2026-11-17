import { Rng, Template, build, buildActivity, fmt, int, pick } from "./core.js";
import { FigureSpec, ShadeActivity } from "../../types.js";

/**
 * Area of a Trapezium and a Polygon, Grade 8 (book chapter 22), and of a
 * semicircle: rectangles and triangles as the building blocks, the
 * trapezium ½(a + b)h, a polygon split into simpler shapes (including a
 * diagonal with two heights), and half of πr² (π = 22/7).
 *   concrete  hands-on: 1 square = 1 cm²; shade the area of a rectangle,
 *             triangle, trapezium, house shape, and a trapezium with a
 *             slanting side marked
 *   pictorial trapeziums with their height, a house shape, semicircles,
 *             a rectangle with a semicircle on top
 *   abstract  trapezium area, a field split by a diagonal, a missing side,
 *             a semicircle's area and radius
 */

const TOPIC = "g8-area";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "ar-no-half": {
    label: "Forgets the half",
    detail: "Uses base × height for a triangle, or (a + b) × h for a trapezium, without halving.",
    childTip: "A triangle is half a rectangle. A trapezium's area is ½ × (sum of parallel sides) × height.",
  },
  "ar-one-side": {
    label: "Uses only one parallel side",
    detail: "Works out a trapezium's area with just one of its parallel sides.",
    childTip: "Add both parallel sides, then halve: ½(a + b) is the average width.",
  },
  "ar-slant-height": {
    label: "Uses the slanting side as the height",
    detail: "The height must be straight up (at right angles to the base), not along the sloping side.",
    childTip: "Height is the dashed line at a right angle to the base, not the sloping edge.",
  },
  "ar-perimeter": {
    label: "Works out the perimeter instead",
    detail: "Adds up the sides when the area (the space inside) was asked for.",
    childTip: "Area counts squares inside (cm²). Perimeter is the distance round (cm).",
  },
  "ar-missing-part": {
    label: "Leaves out part of the shape",
    detail: "Splits the shape but adds up only some of the parts.",
    childTip: "Split the shape, find each part, then add ALL the parts.",
  },
  "ar-semicircle-full": {
    label: "Uses the whole circle for a semicircle",
    detail: "Uses πr² without halving.",
    childTip: "A semicircle is half a circle: ½ × π × r².",
  },
  "ar-diameter-radius": {
    label: "Uses the diameter as the radius",
    detail: "Puts the diameter into πr².",
    childTip: "Radius = diameter ÷ 2. Halve it before squaring.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `ar8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const area = (target: number, wrong: { value: number; mistake: string }[]): ShadeActivity => ({
  kind: "shade",
  rows: 10,
  cols: 10,
  target,
  unit: "Each square = 1 cm²",
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= 100 && wrong.findIndex((x) => x.value === w.value) === i),
});
const trap = (a: number, b: number, h: string, slant?: string): FigureSpec => ({
  kind: "figure",
  figure: "quad",
  quad: "trapezium",
  sideLabels: [`${a} cm`, slant ?? "", `${b} cm`, ""],
  heightLabel: h,
});
const house = (w: number, h: number, t: number): FigureSpec => ({ kind: "figure", figure: "quad", quad: "house", sideLabels: [`${h} cm`, "", "", "", `${w} cm`], note: `Roof height ${t} cm (from the top of the walls)` });
const sq = (n: number) => `${fmt(+n.toFixed(2))} cm²`;
/** (a + b) even so ½(a + b)h is whole, and the area at most `max`. */
function trapSides(rng: Rng, max: number): [number, number, number] {
  for (;;) {
    const a = int(rng, 3, 12), b = int(rng, 3, 14), h = int(rng, 2, 10);
    if (a !== b && h !== a && h !== b && (a + b) % 2 === 0 && ((a + b) / 2) * h <= max) return [Math.min(a, b), Math.max(a, b), h];
  }
}

export const AREA_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: shade the area, 1 cm² a square ----------------
  "concrete|remember": (rng) => {
    const a = int(rng, 3, 10), b = int(rng, 2, 9);
    if (a * b > 100 || a === b) return AREA_G8_TEMPLATES["concrete|remember"](rng);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "rectangles", rng), prompt: `A rectangle is ${a} cm by ${b} cm. Shade its area.`, representation: null },
      { a, b },
      area(a * b, [{ value: 2 * (a + b), mistake: "ar-perimeter" }, { value: a + b, mistake: "ar-perimeter" }])
    );
  },
  "concrete|understand": (rng) => {
    const b = 2 * int(rng, 2, 7), h = int(rng, 3, 12);
    if (b * h > 100) return AREA_G8_TEMPLATES["concrete|understand"](rng);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "triangles", rng), prompt: `A triangle has base ${b} cm and height ${h} cm. Shade its area.`, representation: null },
      { b, h },
      area((b * h) / 2, [{ value: b * h, mistake: "ar-no-half" }])
    );
  },
  "concrete|apply": (rng) => {
    const [a, b, h] = trapSides(rng, 100);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "trapeziums", rng), prompt: `A trapezium has parallel sides ${a} cm and ${b} cm, ${h} cm apart. Shade its area.`, representation: trap(a, b, `${h} cm`) },
      { a, b, h },
      area(((a + b) / 2) * h, [{ value: (a + b) * h, mistake: "ar-no-half" }, { value: a * h, mistake: "ar-one-side" }, { value: b * h, mistake: "ar-one-side" }])
    );
  },
  "concrete|analyze": (rng) => {
    const w = 2 * int(rng, 2, 5), h = int(rng, 3, 7), t = int(rng, 2, 6);
    const A = w * h + (w * t) / 2;
    if (A > 100) return AREA_G8_TEMPLATES["concrete|analyze"](rng);
    return buildActivity(
      { ...base("c-analyze", "concrete", "analyze", "polygons", rng), prompt: `This house shape is a ${w} cm by ${h} cm rectangle with a triangle roof ${t} cm high on top. Shade its whole area.`, representation: house(w, h, t) },
      { w, h, t },
      area(A, [{ value: w * h + w * t, mistake: "ar-no-half" }, { value: w * h, mistake: "ar-missing-part" }])
    );
  },
  "concrete|evaluate": (rng) => {
    for (;;) {
      const [a, b, h] = trapSides(rng, 100);
      const s = h + int(rng, 1, 3);
      if (((a + b) / 2) * s > 100) continue;
      return buildActivity(
        {
          ...base("c-evaluate", "concrete", "evaluate", "trapeziums", rng),
          prompt: `A trapezium has parallel sides ${a} cm and ${b} cm. Its sloping side is ${s} cm and its height (dashed) is ${h} cm. Shade its area.`,
          representation: trap(a, b, `${h} cm`, `${s} cm`),
        },
        { a, b, h, s },
        area(((a + b) / 2) * h, [{ value: ((a + b) / 2) * s, mistake: "ar-slant-height" }, { value: (a + b) * h, mistake: "ar-no-half" }])
      );
    }
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const [a, b, h] = trapSides(rng, 400);
    return build(
      { ...base("p-remember", "pictorial", "remember", "trapeziums", rng), prompt: "What is the area of this trapezium?", representation: trap(a, b, `${h} cm`) },
      { a, b, h },
      sq(((a + b) / 2) * h),
      [
        { text: sq((a + b) * h), mistake: "ar-no-half" },
        { text: sq(a * h), mistake: "ar-one-side" },
        { text: sq(a + b + 2 * h), mistake: "ar-perimeter" },
        { text: sq(((a + b) / 2) * h + h), mistake: null },
        { text: sq(a * b), mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const [a, b, h] = trapSides(rng, 400);
    const A = ((a + b) / 2) * h;
    return build(
      { ...base("p-understand", "pictorial", "understand", "trapeziums", rng), prompt: `This trapezium has area ${A} cm². What is its height?`, representation: trap(a, b, "h") },
      { a, b, h },
      `${h} cm`,
      [
        { text: `${fmt(+(A / (a + b)).toFixed(2))} cm`, mistake: "ar-no-half" },
        { text: `${fmt(+(A / a).toFixed(2))} cm`, mistake: "ar-one-side" },
        { text: `${2 * h} cm`, mistake: null },
        { text: `${h + 1} cm`, mistake: null },
        { text: `${h + 2} cm`, mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const w = 2 * int(rng, 3, 12), h = int(rng, 3, 12), t = int(rng, 2, 9);
    return build(
      { ...base("p-apply", "pictorial", "apply", "polygons", rng), prompt: `The house shape is a ${w} cm by ${h} cm rectangle with a triangle roof ${t} cm high. What is its area?`, representation: house(w, h, t) },
      { w, h, t },
      sq(w * h + (w * t) / 2),
      [
        { text: sq(w * h + w * t), mistake: "ar-no-half" },
        { text: sq(w * h), mistake: "ar-missing-part" },
        { text: sq(w * (h + t)), mistake: "ar-no-half" },
        { text: sq(w * h + (w * t) / 2 + 10), mistake: null },
        { text: sq(w * h + t), mistake: null },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const k = pick(rng, [1, 2, 3]);
    const d = 14 * k, r = 7 * k;
    return build(
      { ...base("p-analyze", "pictorial", "analyze", "semicircles", rng), prompt: `The semicircle has diameter AB = ${d} cm. What is its area? (π = 22/7)`, representation: { kind: "figure", figure: "circle", part: "semicircle", partLabel: `${d} cm` } },
      { k },
      sq((11 * r * r) / 7),
      [
        { text: sq((22 * r * r) / 7), mistake: "ar-semicircle-full" },
        { text: sq((11 * d * d) / 7), mistake: "ar-diameter-radius" },
        { text: sq((11 * r) / 7 * 2), mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const k = pick(rng, [1, 2]);
    const w = 14 * k, r = 7 * k, h = int(rng, 5, 20);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "composite shapes", rng),
        prompt: `A window is a ${w} cm by ${h} cm rectangle with a semicircle on top (diameter ${w} cm). What is its area? (π = 22/7)`,
        representation: { kind: "figure", figure: "circle", part: "semicircle", partLabel: `${w} cm`, note: `Rectangle below: ${w} cm × ${h} cm` },
      },
      { k, h },
      sq(w * h + (11 * r * r) / 7),
      [
        { text: sq(w * h + (22 * r * r) / 7), mistake: "ar-semicircle-full" },
        { text: sq(w * h + (11 * w * w) / 7), mistake: "ar-diameter-radius" },
        { text: sq(w * h), mistake: "ar-missing-part" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const [a, b, h] = trapSides(rng, 600);
    return build(
      { ...base("a-remember", "abstract", "remember", "trapeziums", rng), prompt: `Find the area of a trapezium with parallel sides ${a} cm and ${b} cm and height ${h} cm.`, representation: null },
      { a, b, h },
      sq(((a + b) / 2) * h),
      [
        { text: sq((a + b) * h), mistake: "ar-no-half" },
        { text: sq(b * h), mistake: "ar-one-side" },
        { text: sq(a * b * h), mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const r = pick(rng, [7, 14, 21, 3.5, 28]);
    return build(
      { ...base("a-understand", "abstract", "understand", "semicircles", rng), prompt: `Find the area of a semicircle of radius ${r} cm. (π = 22/7)`, representation: null },
      { r: r * 2 },
      sq((11 * r * r) / 7),
      [
        { text: sq((22 * r * r) / 7), mistake: "ar-semicircle-full" },
        { text: sq((11 * 4 * r * r) / 7), mistake: "ar-diameter-radius" },
        { text: sq((22 * r) / 7), mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const d = 2 * int(rng, 5, 20), h1 = int(rng, 3, 12), h2 = int(rng, 3, 12);
    return build(
      {
        ...base("a-apply", "abstract", "apply", "polygons", rng),
        prompt: `Quadrilateral ABCD has diagonal AC = ${d} m. The heights from B and D to AC are ${h1} m and ${h2} m. What is its area?`,
        representation: null,
      },
      { d, h1, h2 },
      `${(d * (h1 + h2)) / 2} m²`,
      [
        { text: `${d * (h1 + h2)} m²`, mistake: "ar-no-half" },
        { text: `${(d * h1) / 2} m²`, mistake: "ar-missing-part" },
        { text: `${d + h1 + h2} m²`, mistake: "ar-perimeter" },
        { text: `${(d * (h1 + h2)) / 2 + 2} m²`, mistake: null },
        { text: `${(d * h2) / 2 + d} m²`, mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const [a, b, h] = trapSides(rng, 600);
    const A = ((a + b) / 2) * h;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "trapeziums", rng), prompt: `A trapezium has area ${A} cm², height ${h} cm and one parallel side ${a} cm. How long is the other parallel side?`, representation: null },
      { a, b, h },
      `${b} cm`,
      [
        { text: `${fmt(+(A / h - a).toFixed(2))} cm`, mistake: "ar-no-half" },
        { text: `${fmt(+((2 * A) / h).toFixed(2))} cm`, mistake: "ar-one-side" },
        { text: `${fmt(+(A / h).toFixed(2))} cm`, mistake: "ar-one-side" },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const k = pick(rng, [1, 2, 3, 4]);
    const r = 7 * k, A = 77 * k * k;
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "semicircles", rng), prompt: `A semicircle has area ${fmt(A)} cm². What is its diameter? (π = 22/7)`, representation: null },
      { k },
      `${2 * r} cm`,
      [
        { text: `${r} cm`, mistake: "ar-diameter-radius" },
        { text: `${fmt(+Math.sqrt((7 * A) / 22).toFixed(2))} cm`, mistake: "ar-semicircle-full" },
        { text: `${4 * r} cm`, mistake: null },
      ]
    );
  },
};
