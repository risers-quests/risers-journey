import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { FigureSpec, ShadeActivity } from "../../types.js";

/**
 * Representing 3-D in 2-D, Grade 8 (book chapter 19): solids drawn on flat
 * paper (hidden edges dashed), counting faces, vertices and edges, and
 * Euler's relation F + V − E = 2 for solids with flat faces (cubes,
 * cuboids, tetrahedrons, prisms and pyramids).
 *   concrete  hands-on: shade one square for each face, vertex or edge of
 *             the solid shown; use F + V − E = 2 to shade the edges
 *   pictorial solid drawings: name it, count it, check Euler, prisms and
 *             pyramids with different bases
 *   abstract  Euler's relation, edges from F and V, faces of a prism,
 *             edges of a pyramid, is this solid possible
 */

const TOPIC = "g8-solids";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "d3-faces-vertices": {
    label: "Mixes up faces, vertices and edges",
    detail: "Counts corners when asked for faces, or faces when asked for edges.",
    childTip: "Faces are the flat sides, edges are where two faces meet, vertices are the corners.",
  },
  "d3-edges-double": {
    label: "Counts each edge twice",
    detail: "Counts edges face by face, so every edge is counted once for each of its two faces.",
    childTip: "Each edge is shared by two faces. Count round the top, round the bottom, then the uprights.",
  },
  "d3-hidden": {
    label: "Forgets the hidden faces or edges",
    detail: "Counts only what is drawn with solid lines, missing the dashed (hidden) ones at the back.",
    childTip: "Dashed lines are edges you can't see from here. They still count.",
  },
  "d3-euler-sign": {
    label: "Uses the wrong signs in Euler's relation",
    detail: "Writes F + V + E = 2 or F − V + E = 2.",
    childTip: "Faces plus vertices minus edges is 2. For a cube: 6 + 8 − 12 = 2.",
  },
  "d3-prism-pyramid": {
    label: "Mixes up prisms and pyramids",
    detail: "Uses a prism's counts for a pyramid (or the other way round), or confuses the names.",
    childTip: "A prism has two equal ends joined by rectangles. A pyramid has one base and a point.",
  },
};

type Solid = Exclude<NonNullable<FigureSpec["solid"]>, "cylinder">; // Euler is for solids with flat faces
const SOLIDS: Record<Solid, { name: string; F: number; V: number; E: number; hidden: number; other: string }> = {
  cube: { name: "cube", F: 6, V: 8, E: 12, hidden: 3, other: "square pyramid" },
  cuboid: { name: "cuboid", F: 6, V: 8, E: 12, hidden: 3, other: "square pyramid" },
  "triangular-prism": { name: "triangular prism", F: 5, V: 6, E: 9, hidden: 3, other: "triangular pyramid" },
  "pentagonal-prism": { name: "pentagonal prism", F: 7, V: 10, E: 15, hidden: 3, other: "pentagonal pyramid" },
  "hexagonal-prism": { name: "hexagonal prism", F: 8, V: 12, E: 18, hidden: 3, other: "hexagonal pyramid" },
  "square-pyramid": { name: "square pyramid", F: 5, V: 5, E: 8, hidden: 3, other: "cube" },
  tetrahedron: { name: "tetrahedron (triangular pyramid)", F: 4, V: 4, E: 6, hidden: 3, other: "triangular prism" },
  "pentagonal-pyramid": { name: "pentagonal pyramid", F: 6, V: 6, E: 10, hidden: 3, other: "pentagonal prism" },
};
const KEYS = Object.keys(SOLIDS) as Solid[];
const fig = (solid: Solid): FigureSpec => ({ kind: "figure", figure: "solid", solid });
const PRISMS: Solid[] = ["triangular-prism", "pentagonal-prism", "hexagonal-prism"];
const PYRAMIDS: Solid[] = ["square-pyramid", "tetrahedron", "pentagonal-pyramid"];
const SIDES: Partial<Record<Solid, number>> = { "triangular-prism": 3, "pentagonal-prism": 5, "hexagonal-prism": 6, "square-pyramid": 4, tetrahedron: 3, "pentagonal-pyramid": 5 };
const POLY: Record<number, string> = { 3: "triangle", 4: "square", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "nonagon", 10: "decagon" };

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `d38-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const count = (target: number, wrong: { value: number; mistake: string }[]): ShadeActivity => ({
  kind: "shade",
  rows: 4,
  cols: 10,
  target,
  wrong: wrong.filter((w, i) => w.value !== target && w.value >= 0 && w.value <= 40 && wrong.findIndex((x) => x.value === w.value) === i),
});
const fve = (F: number, V: number, E: number) => `${F} faces, ${V} vertices, ${E} edges`;

export const SOLIDS_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: shade one square for each ----------------
  "concrete|remember": (rng) => {
    const k = pick(rng, KEYS), s = SOLIDS[k];
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "faces", rng), prompt: `Shade one square for each FACE of this ${s.name}.`, representation: fig(k) },
      { k: KEYS.indexOf(k) },
      count(s.F, [{ value: s.V, mistake: "d3-faces-vertices" }, { value: s.E, mistake: "d3-faces-vertices" }, { value: 3, mistake: "d3-hidden" }])
    );
  },
  "concrete|understand": (rng) => {
    const k = pick(rng, KEYS), s = SOLIDS[k];
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "vertices", rng), prompt: `Shade one square for each VERTEX (corner) of this ${s.name}.`, representation: fig(k) },
      { k: KEYS.indexOf(k) },
      count(s.V, [{ value: s.F, mistake: "d3-faces-vertices" }, { value: s.E, mistake: "d3-faces-vertices" }, { value: s.V - 1, mistake: "d3-hidden" }])
    );
  },
  "concrete|apply": (rng) => {
    const k = pick(rng, KEYS), s = SOLIDS[k];
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "edges", rng), prompt: `Shade one square for each EDGE of this ${s.name}. Dashed edges are hidden at the back.`, representation: fig(k) },
      { k: KEYS.indexOf(k) },
      count(s.E, [{ value: 2 * s.E, mistake: "d3-edges-double" }, { value: s.E - s.hidden, mistake: "d3-hidden" }, { value: s.V, mistake: "d3-faces-vertices" }])
    );
  },
  "concrete|analyze": (rng) => {
    const k = pick(rng, KEYS), s = SOLIDS[k];
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "Euler", rng),
        prompt: `This ${s.name} has ${s.F} faces and ${s.V} vertices: shade ${s.F} + ${s.V} squares. It has ${s.E} edges. What is faces + vertices − edges?`,
        representation: fig(k),
        activity: count(s.F + s.V, []),
      },
      { k: KEYS.indexOf(k) },
      "2",
      [
        { text: String(s.F + s.V + s.E), mistake: "d3-euler-sign" },
        { text: "0", mistake: null },
        { text: String(s.F - s.V + s.E), mistake: "d3-euler-sign" },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const k = pick(rng, KEYS), s = SOLIDS[k];
    return buildActivity(
      { ...base("c-evaluate", "concrete", "evaluate", "Euler", rng), prompt: `A solid with flat faces has ${s.F} faces and ${s.V} vertices. Use F + V − E = 2 and shade one square for each of its edges.`, representation: null },
      { k: KEYS.indexOf(k) },
      count(s.E, [{ value: s.F + s.V + 2, mistake: "d3-euler-sign" }])
    );
  },

  // ---------------- PICTORIAL: solid drawings ----------------
  "pictorial|remember": (rng) => {
    const k = pick(rng, KEYS), s = SOLIDS[k];
    const others = KEYS.filter((x) => x !== k && SOLIDS[x].name !== s.name).map((x) => SOLIDS[x].name);
    return build(
      { ...base("p-remember", "pictorial", "remember", "naming solids", rng), prompt: "What is this solid called?", representation: fig(k) },
      { k: KEYS.indexOf(k) },
      s.name,
      [
        { text: s.other, mistake: "d3-prism-pyramid" },
        ...others.sort(() => rng() - 0.5).slice(0, 3).map((t) => ({ text: t, mistake: null })),
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const k = pick(rng, KEYS), s = SOLIDS[k];
    return build(
      { ...base("p-understand", "pictorial", "understand", "counting", rng), prompt: `How many faces, vertices and edges does this ${s.name} have?`, representation: fig(k) },
      { k: KEYS.indexOf(k) },
      fve(s.F, s.V, s.E),
      [
        { text: fve(s.V, s.F, s.E), mistake: "d3-faces-vertices" },
        { text: fve(s.F, s.V, 2 * s.E), mistake: "d3-edges-double" },
        { text: fve(s.F - 1, s.V - 1, s.E - s.hidden), mistake: "d3-hidden" },
        { text: fve(s.F + 1, s.V, s.E), mistake: null },
        { text: fve(s.F, s.V + 2, s.E), mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const k = pick(rng, KEYS), s = SOLIDS[k];
    return build(
      { ...base("p-apply", "pictorial", "apply", "Euler", rng), prompt: `For this ${s.name}, work out faces + vertices − edges.`, representation: fig(k) },
      { k: KEYS.indexOf(k) },
      `${s.F} + ${s.V} − ${s.E} = 2`,
      [
        { text: `${s.F} + ${s.V} + ${s.E} = ${s.F + s.V + s.E}`, mistake: "d3-euler-sign" },
        { text: `${s.F} + ${s.V} − ${2 * s.E} = ${s.F + s.V - 2 * s.E}`, mistake: "d3-edges-double" },
        { text: `${s.F} − ${s.V} + ${s.E} = ${s.F - s.V + s.E}`, mistake: "d3-euler-sign" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const k = pick(rng, PRISMS), n = SIDES[k]!;
    const m = pick(rng, [4, 7, 8, 9, 10].filter((x) => x !== n));
    return build(
      { ...base("p-analyze", "pictorial", "analyze", "prisms", rng), prompt: `This ${SOLIDS[k].name} has ${SOLIDS[k].E} edges. How many edges does a prism with a ${POLY[m]} base have?`, representation: fig(k) },
      { n, m },
      String(3 * m),
      [
        { text: String(2 * m), mistake: "d3-prism-pyramid" },
        { text: String(m + 2), mistake: "d3-faces-vertices" },
        { text: String(SOLIDS[k].E), mistake: null },
        { text: String(3 * m + 2), mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const k = pick(rng, PYRAMIDS), n = SIDES[k]!;
    const name = pick(rng, ["Kabir", "Riya", "Arjun", "Meera", "Diya", "Rohan"]);
    return build(
      { ...base("p-evaluate", "pictorial", "evaluate", "pyramids", rng), prompt: `${name} says a pyramid with an n-sided base has 3n edges. Check with this ${SOLIDS[k].name} (base: ${n} sides). Is ${name} right?`, representation: fig(k) },
      { n },
      `No: it has ${2 * n} edges, so 2n (n round the base, n up to the top)`,
      [
        { text: `Yes: ${3 * n} edges`, mistake: "d3-prism-pyramid" },
        { text: `No: it has ${n + 1} edges`, mistake: "d3-faces-vertices" },
        { text: `No: it has ${4 * n} edges`, mistake: "d3-edges-double" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => build(
    { ...base("a-remember", "abstract", "remember", "Euler", rng), prompt: "Euler's relation for a solid with F faces, V vertices and E edges is…", representation: null },
    { n: Math.floor(rng() * 1e6) },
    "F + V − E = 2",
    [
      { text: "F + V + E = 2", mistake: "d3-euler-sign" },
      { text: "F − V + E = 2", mistake: "d3-euler-sign" },
      { text: "F + E − V = 2", mistake: "d3-euler-sign" },
    ]
  ),
  "abstract|understand": (rng) => {
    const F = int(rng, 4, 20), V = int(rng, 4, 20);
    if (F + V - 2 < Math.max(F, V) + 2) return SOLIDS_G8_TEMPLATES["abstract|understand"](rng);
    return build(
      { ...base("a-understand", "abstract", "understand", "Euler", rng), prompt: `A solid has ${F} faces and ${V} vertices. How many edges does it have?`, representation: null },
      { F, V },
      String(F + V - 2),
      [
        { text: String(F + V + 2), mistake: "d3-euler-sign" },
        { text: String(Math.abs(F - V) + 2), mistake: "d3-euler-sign" },
        { text: String(F + V), mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const n = int(rng, 3, 10);
    return build(
      { ...base("a-apply", "abstract", "apply", "prisms", rng), prompt: `How many faces does a prism with a ${n}-sided base have?`, representation: null },
      { n },
      String(n + 2),
      [
        { text: String(n + 1), mistake: "d3-prism-pyramid" },
        { text: String(2 * n), mistake: "d3-faces-vertices" },
        { text: String(3 * n), mistake: "d3-faces-vertices" },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const n = int(rng, 3, 10);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "pyramids", rng), prompt: `How many edges does a pyramid with a ${n}-sided base have?`, representation: null },
      { n },
      String(2 * n),
      [
        { text: String(3 * n), mistake: "d3-prism-pyramid" },
        { text: String(n + 1), mistake: "d3-faces-vertices" },
        { text: String(n), mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const ok = rng() < 0.5;
    const k = pick(rng, KEYS), s = SOLIDS[k];
    const E = ok ? s.E : s.E + pick(rng, [-2, -1, 1, 2]);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "Euler", rng), prompt: `Can a solid with flat faces have ${s.F} faces, ${s.V} vertices and ${E} edges?`, representation: null },
      { k: KEYS.indexOf(k), E },
      ok ? `Yes: ${s.F} + ${s.V} − ${E} = 2` : `No: ${s.F} + ${s.V} − ${E} = ${s.F + s.V - E}, not 2`,
      [
        ok ? { text: `No: ${s.F} + ${s.V} + ${E} isn't 2`, mistake: "d3-euler-sign" } : { text: "Yes: any numbers can work", mistake: "d3-euler-sign" },
        { text: ok ? `No: it needs ${s.F + s.V} edges` : `Yes: ${s.F} + ${s.V} − ${E} is close to 2`, mistake: null },
        { text: ok ? `No: edges must be fewer than faces` : `Yes: ${s.F} − ${s.V} + ${E} = ${s.F - s.V + E}`, mistake: ok ? "d3-faces-vertices" : "d3-euler-sign" },
      ]
    );
  },
};
