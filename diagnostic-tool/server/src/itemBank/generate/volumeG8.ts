import { Rng, Template, build, buildActivity, fmt, int, pick } from "./core.js";
import { FigureSpec, GroupActivity, ShadeActivity } from "../../types.js";

/**
 * Surface Area, Volume and Capacity, Grade 8 (book chapter 23): cube,
 * cuboid and cylinder (π = 22/7). Volume as layers of unit cubes, surface
 * area as the faces (or the net), the cylinder's curved and total surface,
 * capacity (1 cm³ = 1 mL, 1000 cm³ = 1 L, 1 m³ = 1000 L).
 *   concrete  hands-on: pack unit cubes in layers (volume); shade one
 *             square per cm² of a cube's or cuboid's surface; shade a tank's
 *             capacity in litres
 *   pictorial cuboids, cubes and cylinders with their measurements
 *   abstract  cube volume, cuboid surface area, cylinder volume, a missing
 *             height, a tank in litres
 */

const TOPIC = "g8-volume";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "vol-adds-dims": {
    label: "Adds the measurements instead of multiplying",
    detail: "Works out a volume as length + breadth + height.",
    childTip: "Volume = length × breadth × height: how many 1 cm cubes fit inside.",
  },
  "vol-one-layer": {
    label: "Counts only one layer",
    detail: "Gives length × breadth (one layer of cubes) and forgets the height.",
    childTip: "One layer is l × b cubes. There are h layers.",
  },
  "vol-surface-volume": {
    label: "Mixes up surface area and volume",
    detail: "Gives the space inside when the outside covering was asked for, or the other way round.",
    childTip: "Surface area: the faces, in cm² (wrapping paper). Volume: the inside, in cm³ (sand to fill it).",
  },
  "vol-sa-half": {
    label: "Counts only half the faces",
    detail: "Adds lb + bh + hl without doubling: every face has an opposite twin.",
    childTip: "A cuboid has 3 pairs of equal faces: 2(lb + bh + hl).",
  },
  "vol-cube-power": {
    label: "Uses the wrong power for a cube",
    detail: "Uses a² for a cube's volume, or 6a instead of 6a² for its surface.",
    childTip: "Volume of a cube = a × a × a = a³. Surface = 6 faces, each a × a: 6a².",
  },
  "vol-cyl-diameter": {
    label: "Uses the diameter as the radius",
    detail: "Puts the diameter into πr²h or 2πrh.",
    childTip: "Radius = half the diameter. Halve it first.",
  },
  "vol-cyl-curved-total": {
    label: "Mixes up curved and total surface",
    detail: "Leaves out the two circular ends (or adds them when only the curved surface was asked for).",
    childTip: "Curved: 2πrh (the label round a tin). Total: add the two ends, 2πr².",
  },
  "vol-capacity-units": {
    label: "Gets the litre conversion wrong",
    detail: "Uses 100 cm³ = 1 L, or 1 m³ = 100 L.",
    childTip: "1000 cm³ = 1 litre, and 1 m³ = 1000 litres.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `vol8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const BOXES = [[3, 2, 2], [3, 3, 2], [4, 2, 3], [2, 2, 4], [5, 2, 2], [3, 2, 4], [4, 3, 2], [2, 2, 3], [4, 2, 2]] as const;
const cubes = (l: number, b: number, h: number): GroupActivity => ({ kind: "group", mode: "size", icon: "🧊", itemMany: "cubes", basketOne: "layer", basketIcon: "", items: l * b * h, size: l * b, maxBaskets: h + 2 });
const shade = (target: number, wrong: { value: number; mistake: string }[], unit: string): ShadeActivity => ({
  kind: "shade",
  rows: 10,
  cols: 10,
  target,
  unit,
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= 100 && wrong.findIndex((x) => x.value === w.value) === i),
});
const solid = (s: "cube" | "cuboid" | "cylinder", note: string): FigureSpec => ({ kind: "figure", figure: "solid", solid: s, note });
const n2 = (x: number) => fmt(+x.toFixed(2));

export const VOLUME_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng) => {
    const [l, b, h] = pick(rng, BOXES);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "volume", rng), prompt: `Build a ${l} cm × ${b} cm × ${h} cm cuboid from 1 cm cubes: pack the cubes in layers of ${l} × ${b}.`, representation: solid("cuboid", `${l} cm × ${b} cm × ${h} cm`) },
      { l, b, h },
      cubes(l, b, h)
    );
  },
  "concrete|understand": (rng) => {
    const [l, b, h] = pick(rng, BOXES);
    return build(
      {
        ...base("c-understand", "concrete", "understand", "volume", rng),
        prompt: `Pack the 1 cm cubes in layers of ${l} × ${b} to build a cuboid ${h} layers high. What is its volume?`,
        representation: solid("cuboid", `${l} cm × ${b} cm × ${h} cm`),
        activity: cubes(l, b, h),
      },
      { l, b, h },
      `${l * b * h} cm³`,
      [
        { text: `${l + b + h} cm³`, mistake: "vol-adds-dims" },
        { text: `${l * b} cm³`, mistake: "vol-one-layer" },
        { text: `${2 * (l * b + b * h + h * l)} cm³`, mistake: "vol-surface-volume" },
        { text: `${l * b * h + 1} cm³`, mistake: null },
        { text: `${l * b * (h + 1)} cm³`, mistake: null },
      ]
    );
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 2, 4);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "surface area", rng), prompt: `A cube has edges of ${a} cm. Shade one square for each cm² of its surface (all its faces).`, representation: solid("cube", `edge ${a} cm`) },
      { a },
      shade(6 * a * a, [{ value: a ** 3, mistake: "vol-surface-volume" }, { value: 6 * a, mistake: "vol-cube-power" }, { value: 4 * a * a, mistake: "vol-sa-half" }], "Each square = 1 cm²")
    );
  },
  "concrete|analyze": (rng) => {
    for (;;) {
      const l = int(rng, 2, 6), b = int(rng, 1, 4), h = int(rng, 1, 4);
      const S = 2 * (l * b + b * h + h * l);
      if (S > 100 || l === b || b === h || l === h) continue;
      return buildActivity(
        { ...base("c-analyze", "concrete", "analyze", "surface area", rng), prompt: `A box is ${l} cm × ${b} cm × ${h} cm. Shade one square for each cm² of its surface (all six faces).`, representation: solid("cuboid", `${l} cm × ${b} cm × ${h} cm`) },
        { l, b, h },
        shade(S, [{ value: S / 2, mistake: "vol-sa-half" }, { value: l * b * h, mistake: "vol-surface-volume" }], "Each square = 1 cm²")
      );
    }
  },
  "concrete|evaluate": (rng) => {
    const [l, b, h] = pick(rng, [[20, 10, 10], [20, 10, 20], [20, 20, 10], [25, 20, 10], [20, 20, 20], [30, 20, 10], [40, 25, 10], [50, 20, 10]] as const);
    const V = l * b * h;
    return buildActivity(
      { ...base("c-evaluate", "concrete", "evaluate", "capacity", rng), prompt: `A fish tank is ${l} cm × ${b} cm × ${h} cm. Each square is 1 litre. Shade how many litres it holds.`, representation: solid("cuboid", `${l} cm × ${b} cm × ${h} cm`) },
      { l, b, h },
      shade(V / 1000, [{ value: V / 100, mistake: "vol-capacity-units" }, { value: V / 10, mistake: "vol-capacity-units" }], "Each square = 1 L")
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const l = int(rng, 3, 15), b = int(rng, 2, 10), h = int(rng, 2, 10);
    return build(
      { ...base("p-remember", "pictorial", "remember", "volume", rng), prompt: "What is the volume of this cuboid?", representation: solid("cuboid", `${l} cm × ${b} cm × ${h} cm`) },
      { l, b, h },
      `${l * b * h} cm³`,
      [
        { text: `${l + b + h} cm³`, mistake: "vol-adds-dims" },
        { text: `${2 * (l * b + b * h + h * l)} cm³`, mistake: "vol-surface-volume" },
        { text: `${l * b} cm³`, mistake: "vol-one-layer" },
        { text: `${l * b * h + l * b} cm³`, mistake: null },
        { text: `${l * b * (h - 1)} cm³`, mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const a = int(rng, 2, 15);
    return build(
      { ...base("p-understand", "pictorial", "understand", "surface area", rng), prompt: "What is the total surface area of this cube?", representation: solid("cube", `edge ${a} cm`) },
      { a },
      `${6 * a * a} cm²`,
      [
        { text: `${a ** 3} cm²`, mistake: "vol-surface-volume" },
        { text: `${6 * a} cm²`, mistake: "vol-cube-power" },
        { text: `${4 * a * a} cm²`, mistake: "vol-sa-half" },
        { text: `${6 * a * a + 6} cm²`, mistake: null },
        { text: `${5 * a * a} cm²`, mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const r = pick(rng, [7, 14, 3.5, 21]), h = int(rng, 2, 20);
    const V = (22 / 7) * r * r * h;
    return build(
      { ...base("p-apply", "pictorial", "apply", "cylinder volume", rng), prompt: `This cylinder has radius ${r} cm and height ${h} cm. What is its volume? (π = 22/7)`, representation: solid("cylinder", `r = ${r} cm, h = ${h} cm`) },
      { r: r * 2, h },
      `${n2(V)} cm³`,
      [
        { text: `${n2(4 * V)} cm³`, mistake: "vol-cyl-diameter" },
        { text: `${n2(2 * (22 / 7) * r * h)} cm³`, mistake: "vol-surface-volume" },
        { text: `${n2((22 / 7) * r * h)} cm³`, mistake: "vol-cube-power" },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const r = pick(rng, [7, 14, 3.5]), h = int(rng, 3, 20);
    const curved = 2 * (22 / 7) * r * h, ends = 2 * (22 / 7) * r * r;
    return build(
      { ...base("p-analyze", "pictorial", "analyze", "cylinder surface", rng), prompt: `A closed tin has radius ${r} cm and height ${h} cm. What is its TOTAL surface area? (π = 22/7)`, representation: solid("cylinder", `r = ${r} cm, h = ${h} cm`) },
      { r: r * 2, h },
      `${n2(curved + ends)} cm²`,
      [
        { text: `${n2(curved)} cm²`, mistake: "vol-cyl-curved-total" },
        { text: `${n2((22 / 7) * r * r * h)} cm²`, mistake: "vol-surface-volume" },
        { text: `${n2(2 * curved + 4 * ends)} cm²`, mistake: "vol-cyl-diameter" },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const [l, b, h] = pick(rng, [[50, 40, 30], [60, 50, 40], [80, 50, 50], [100, 50, 40], [40, 30, 25], [120, 50, 50]] as const);
    const V = l * b * h;
    return build(
      { ...base("p-evaluate", "pictorial", "evaluate", "capacity", rng), prompt: "How many litres of water does this tank hold when full?", representation: solid("cuboid", `${l} cm × ${b} cm × ${h} cm`) },
      { l, b, h },
      `${fmt(V / 1000)} L`,
      [
        { text: `${fmt(V / 100)} L`, mistake: "vol-capacity-units" },
        { text: `${fmt(V)} L`, mistake: "vol-capacity-units" },
        { text: `${n2(V / 10000)} L`, mistake: "vol-capacity-units" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const a = int(rng, 2, 12);
    return build(
      { ...base("a-remember", "abstract", "remember", "volume", rng), prompt: `What is the volume of a cube with edge ${a} cm?`, representation: null },
      { a },
      `${fmt(a ** 3)} cm³`,
      [
        { text: `${a * a} cm³`, mistake: "vol-cube-power" },
        { text: `${3 * a} cm³`, mistake: "vol-adds-dims" },
        { text: `${6 * a * a} cm³`, mistake: "vol-surface-volume" },
        { text: `${fmt(a ** 3 + a)} cm³`, mistake: null },
        { text: `${fmt((a + 1) ** 3)} cm³`, mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const l = int(rng, 3, 20), b = int(rng, 2, 12), h = int(rng, 2, 12);
    const half = l * b + b * h + h * l;
    return build(
      { ...base("a-understand", "abstract", "understand", "surface area", rng), prompt: `Find the total surface area of a cuboid ${l} cm × ${b} cm × ${h} cm.`, representation: null },
      { l, b, h },
      `${fmt(2 * half)} cm²`,
      [
        { text: `${fmt(half)} cm²`, mistake: "vol-sa-half" },
        { text: `${fmt(l * b * h)} cm²`, mistake: "vol-surface-volume" },
        { text: `${2 * (l + b + h)} cm²`, mistake: "vol-adds-dims" },
        { text: `${fmt(2 * half + 10)} cm²`, mistake: null },
        { text: `${fmt(4 * half)} cm²`, mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const d = pick(rng, [14, 28, 7, 42]), h = int(rng, 2, 30);
    const r = d / 2, V = (22 / 7) * r * r * h;
    return build(
      { ...base("a-apply", "abstract", "apply", "cylinder volume", rng), prompt: `A cylinder has diameter ${d} cm and height ${h} cm. Find its volume. (π = 22/7)`, representation: null },
      { d, h },
      `${n2(V)} cm³`,
      [
        { text: `${n2(4 * V)} cm³`, mistake: "vol-cyl-diameter" },
        { text: `${n2(2 * (22 / 7) * r * h)} cm³`, mistake: "vol-surface-volume" },
        { text: `${n2(V / 2)} cm³`, mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const l = int(rng, 3, 20), b = int(rng, 2, 12), h = int(rng, 2, 15);
    if (h === l || h === b) return VOLUME_G8_TEMPLATES["abstract|analyze"](rng);
    const V = l * b * h;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "missing measurement", rng), prompt: `A cuboid has volume ${fmt(V)} cm³, length ${l} cm and breadth ${b} cm. What is its height?`, representation: null },
      { l, b, h },
      `${h} cm`,
      [
        { text: `${n2(V / (l + b))} cm`, mistake: "vol-adds-dims" },
        { text: `${fmt(V - l * b)} cm`, mistake: null },
        { text: `${n2(V / l)} cm`, mistake: "vol-one-layer" },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const [l, b, h] = pick(rng, [[2, 1.5, 1], [3, 2, 1], [2.5, 2, 1.2], [4, 2.5, 1], [3, 1.5, 2], [5, 2, 1.5]] as const);
    const V = Math.round(l * b * h * 1000) / 1000;
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "capacity", rng), prompt: `A water tank is ${l} m × ${b} m × ${h} m. How many litres does it hold?`, representation: null },
      { l: l * 10, b: b * 10, h: h * 10 },
      `${fmt(V * 1000)} L`,
      [
        { text: `${fmt(V * 100)} L`, mistake: "vol-capacity-units" },
        { text: `${fmt(V * 1000000)} L`, mistake: "vol-capacity-units" },
        { text: `${n2(V)} L`, mistake: "vol-capacity-units" },
      ]
    );
  },
};
