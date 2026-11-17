import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { FigureSpec, ShadeActivity } from "../../types.js";

/**
 * Circles, Grade 8 (book chapter 21): centre, radius and diameter, arc,
 * chord, sector and segment; the diameter is the longest chord.
 *   concrete  hands-on: 1 square = 1 cm; shade a diameter from the radius,
 *             a radius from the diameter, the longest chord, how far a point
 *             is outside the circle
 *   pictorial circles with one part highlighted: name it; which chord is a
 *             diameter; a claim about a chord's length
 *   abstract  diameter and radius, the names of the parts, which statement
 *             is true
 */

const TOPIC = "g8-circles";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "cir-radius-diameter": {
    label: "Mixes up radius and diameter",
    detail: "Uses the radius where the diameter is needed (or the other way round): the diameter is twice the radius.",
    childTip: "Radius: centre to the edge. Diameter: edge to edge through the centre = 2 × radius.",
  },
  "cir-chord-diameter": {
    label: "Thinks every chord is a diameter",
    detail: "Calls any chord a diameter, or thinks a diameter isn't a chord.",
    childTip: "A chord joins two points on the circle. A diameter is the chord that goes through the centre.",
  },
  "cir-arc-chord": {
    label: "Mixes up an arc and a chord",
    detail: "An arc is part of the curved edge; a chord is the straight line joining its ends.",
    childTip: "Arc: curved, along the circle. Chord: straight, across it.",
  },
  "cir-sector-segment": {
    label: "Mixes up sector and segment",
    detail: "A sector is a slice between two radii; a segment is cut off by a chord.",
    childTip: "Sector: like a slice of pizza (two radii). Segment: cut off by one straight chord.",
  },
  "cir-longest-chord": {
    label: "Thinks a chord can be longer than the diameter",
    detail: "The diameter is the longest chord of a circle.",
    childTip: "Every chord is at most as long as the diameter, 2 × the radius.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `cir8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const length = (target: number, wrong: { value: number; mistake: string }[]): ShadeActivity => ({
  kind: "shade",
  rows: 4,
  cols: 10,
  target,
  unit: "Each square = 1 cm",
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= 40 && wrong.findIndex((x) => x.value === w.value) === i),
});
const circle = (part: FigureSpec["part"], partLabel?: string): FigureSpec => ({ kind: "figure", figure: "circle", part, partLabel });
const NAMES = ["radius", "diameter", "chord", "arc", "sector", "segment"] as const;

export const CIRCLES_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: lengths ----------------
  "concrete|remember": (rng) => {
    const r = int(rng, 2, 15);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "radius and diameter", rng), prompt: `A circle has radius ${r} cm. Shade the length of its diameter.`, representation: circle("radius", `${r} cm`) },
      { r },
      length(2 * r, [{ value: r, mistake: "cir-radius-diameter" }, { value: Math.round(r / 2), mistake: "cir-radius-diameter" }])
    );
  },
  "concrete|understand": (rng) => {
    const r = int(rng, 2, 18);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "radius and diameter", rng), prompt: `A circle has diameter ${2 * r} cm. Shade the length of its radius.`, representation: circle("diameter", `${2 * r} cm`) },
      { r },
      length(r, [{ value: 2 * r, mistake: "cir-radius-diameter" }, { value: 4 * r, mistake: "cir-radius-diameter" }])
    );
  },
  "concrete|apply": (rng) => {
    const r = int(rng, 2, 18);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "longest chord", rng), prompt: `A circle has radius ${r} cm. Shade the length of the LONGEST chord it can have.`, representation: circle("chord") },
      { r },
      length(2 * r, [{ value: r, mistake: "cir-radius-diameter" }, { value: 2 * r - 1, mistake: "cir-longest-chord" }])
    );
  },
  "concrete|analyze": (rng) => {
    const r = int(rng, 3, 15), c = 2 * r + int(rng, 1, 5);
    const name = pick(rng, ["Kabir", "Riya", "Arjun", "Meera", "Diya", "Rohan"]);
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "longest chord", rng),
        prompt: `A circle has radius ${r} cm: shade its diameter. ${name} draws a chord ${c} cm long in it. Is that possible?`,
        representation: circle("radius", `${r} cm`),
        activity: length(2 * r, []),
      },
      { r, c },
      `No: no chord is longer than the diameter, ${2 * r} cm`,
      [
        { text: `Yes: chords can be any length`, mistake: "cir-longest-chord" },
        { text: `Yes: it's less than ${4 * r} cm`, mistake: "cir-radius-diameter" },
        { text: `No: chords must be shorter than the radius, ${r} cm`, mistake: "cir-radius-diameter" },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const r = int(rng, 2, 12), d = r + int(rng, 2, 12);
    return buildActivity(
      { ...base("c-evaluate", "concrete", "evaluate", "radius", rng), prompt: `A circle has radius ${r} cm. Point P is ${d} cm from the centre. Shade how far P is outside the circle.`, representation: circle("radius", `${r} cm`) },
      { r, d },
      length(d - r, [{ value: d - 2 * r, mistake: "cir-radius-diameter" }])
    );
  },

  // ---------------- PICTORIAL: name the part ----------------
  "pictorial|remember": (rng) => {
    const part = pick(rng, ["radius", "diameter", "chord"] as const);
    const wrongs: Record<string, { text: string; mistake: string | null }[]> = {
      radius: [{ text: "diameter", mistake: "cir-radius-diameter" }, { text: "chord", mistake: "cir-chord-diameter" }, { text: "arc", mistake: "cir-arc-chord" }],
      diameter: [{ text: "radius", mistake: "cir-radius-diameter" }, { text: "arc", mistake: "cir-arc-chord" }, { text: "sector", mistake: null }],
      chord: [{ text: "diameter", mistake: "cir-chord-diameter" }, { text: "arc", mistake: "cir-arc-chord" }, { text: "radius", mistake: "cir-radius-diameter" }],
    };
    return build(
      { ...base("p-remember", "pictorial", "remember", "parts", rng), prompt: "What is the highlighted line called?", representation: circle(part) },
      { p: NAMES.indexOf(part) },
      part,
      wrongs[part]
    );
  },
  "pictorial|understand": (rng) => {
    const part = pick(rng, ["arc", "sector", "segment"] as const);
    const wrongs: Record<string, { text: string; mistake: string | null }[]> = {
      arc: [{ text: "chord", mistake: "cir-arc-chord" }, { text: "segment", mistake: null }, { text: "radius", mistake: null }],
      sector: [{ text: "segment", mistake: "cir-sector-segment" }, { text: "arc", mistake: null }, { text: "semicircle", mistake: null }],
      segment: [{ text: "sector", mistake: "cir-sector-segment" }, { text: "chord", mistake: null }, { text: "arc", mistake: "cir-arc-chord" }],
    };
    return build(
      { ...base("p-understand", "pictorial", "understand", "parts", rng), prompt: "What is the highlighted part called?", representation: circle(part) },
      { p: NAMES.indexOf(part) },
      part,
      wrongs[part]
    );
  },
  "pictorial|apply": (rng) => {
    const r = int(rng, 2, 20);
    return build(
      { ...base("p-apply", "pictorial", "apply", "radius and diameter", rng), prompt: `The diameter AB is ${2 * r} cm. How long is the radius?`, representation: circle("diameter", `${2 * r} cm`) },
      { r },
      `${r} cm`,
      [
        { text: `${4 * r} cm`, mistake: "cir-radius-diameter" },
        { text: `${2 * r} cm`, mistake: "cir-radius-diameter" },
        { text: `${r + 1} cm`, mistake: null },
      ]
    );
  },
  "pictorial|analyze": (rng) => build(
    { ...base("p-analyze", "pictorial", "analyze", "diameter", rng), prompt: "AB and CD are chords. Which one is a diameter?", representation: circle("two-chords") },
    { n: Math.floor(rng() * 1e6) },
    "AB: it goes through the centre O",
    [
      { text: "CD: it is a chord", mistake: "cir-chord-diameter" },
      { text: "Both: every chord is a diameter", mistake: "cir-chord-diameter" },
      { text: "Neither: a diameter isn't a chord", mistake: "cir-chord-diameter" },
    ]
  ),
  "pictorial|evaluate": (rng) => {
    const r = int(rng, 3, 15), c = 2 * r + int(rng, 1, 6);
    const name = pick(rng, ["Kabir", "Riya", "Arjun", "Meera", "Diya", "Rohan"]);
    return build(
      { ...base("p-evaluate", "pictorial", "evaluate", "longest chord", rng), prompt: `This circle has radius ${r} cm. ${name} says chord AB is ${c} cm long. Is that possible?`, representation: circle("chord") },
      { r, c },
      `No: the longest chord is the diameter, ${2 * r} cm`,
      [
        { text: "Yes: chords can be any length", mistake: "cir-longest-chord" },
        { text: `Yes: ${c} cm is less than ${4 * r} cm`, mistake: "cir-radius-diameter" },
        { text: `No: chords must be shorter than ${r} cm`, mistake: "cir-radius-diameter" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const r = pick(rng, [int(rng, 2, 25), int(rng, 2, 25) + 0.5]);
    return build(
      { ...base("a-remember", "abstract", "remember", "radius and diameter", rng), prompt: `A circle has radius ${r} cm. What is its diameter?`, representation: null },
      { r: r * 2 },
      `${2 * r} cm`,
      [
        { text: `${r / 2} cm`, mistake: "cir-radius-diameter" },
        { text: `${r} cm`, mistake: "cir-radius-diameter" },
        { text: `${+(r * r).toFixed(2)} cm`, mistake: null },
        { text: `${2 * r + 2} cm`, mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const d = int(rng, 4, 50);
    return build(
      { ...base("a-understand", "abstract", "understand", "radius and diameter", rng), prompt: `A circle has diameter ${d} cm. What is its radius?`, representation: null },
      { d },
      `${d / 2} cm`,
      [
        { text: `${2 * d} cm`, mistake: "cir-radius-diameter" },
        { text: `${d} cm`, mistake: "cir-radius-diameter" },
        { text: `${d / 4} cm`, mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const v = int(rng, 0, 2);
    const [def, right, w] = [
      ["A straight line joining two points on a circle is called a…", "chord", [{ text: "diameter", mistake: "cir-chord-diameter" }, { text: "arc", mistake: "cir-arc-chord" }, { text: "radius", mistake: null }]],
      ["Part of the curved edge of a circle is called an…", "arc", [{ text: "chord", mistake: "cir-arc-chord" }, { text: "segment", mistake: null }, { text: "sector", mistake: null }]],
      ["A line from the centre to a point on the circle is called a…", "radius", [{ text: "diameter", mistake: "cir-radius-diameter" }, { text: "chord", mistake: "cir-chord-diameter" }, { text: "arc", mistake: null }]],
    ][v] as [string, string, { text: string; mistake: string | null }[]];
    return build({ ...base("a-apply", "abstract", "apply", "parts", rng), prompt: def, representation: null }, { v }, right, w);
  },
  "abstract|analyze": (rng) => {
    const v = int(rng, 0, 1);
    const [def, right, w] = [
      ["The region between a chord and its arc is called a…", "segment", [{ text: "sector", mistake: "cir-sector-segment" }, { text: "arc", mistake: "cir-arc-chord" }, { text: "semicircle", mistake: null }]],
      ["The region between two radii and the arc between them is called a…", "sector", [{ text: "segment", mistake: "cir-sector-segment" }, { text: "chord", mistake: null }, { text: "diameter", mistake: null }]],
    ][v] as [string, string, { text: string; mistake: string | null }[]];
    return build({ ...base("a-analyze", "abstract", "analyze", "parts", rng), prompt: def, representation: null }, { v }, right, w);
  },
  "abstract|evaluate": (rng) => {
    const v = int(rng, 0, 1);
    const right = ["Every diameter is a chord", "The diameter is the longest chord"][v];
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "chords", rng), prompt: "Which of these is true?", representation: null },
      { v },
      right,
      [
        { text: "Every chord is a diameter", mistake: "cir-chord-diameter" },
        { text: "A chord can be longer than the diameter", mistake: "cir-longest-chord" },
        { text: "An arc is a straight line", mistake: "cir-arc-chord" },
      ]
    );
  },
};
