import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { FigureSpec, ShadeActivity } from "../../types.js";

/**
 * Symmetry, Grade 8 (book chapter 20), reflection and rotation: lines of
 * symmetry, completing a pattern in a mirror line, rotational symmetry and
 * its order, the angle of rotation, shapes with one kind and not the other.
 *   concrete  hands-on: finish a pattern on a grid so the mirror line
 *             (vertical, horizontal, diagonal) is a line of symmetry, or so
 *             it looks the same after a half turn or a quarter turn
 *   pictorial regular polygons and special quadrilaterals: lines, order,
 *             angle of rotation
 *   abstract  letters' lines of symmetry and order, the angle from the
 *             order, shapes with both kinds, a claim
 */

const TOPIC = "g8-symmetry";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "sym-reflect-translate": {
    label: "Slides the pattern instead of reflecting it",
    detail: "Copies the shape across the line the same way round, instead of as a mirror image.",
    childTip: "A mirror image flips: a square 1 away from the line lands 1 away on the other side.",
  },
  "sym-wrong-mirror": {
    label: "Reflects in the wrong line",
    detail: "Uses a vertical line when the mirror line is the diagonal.",
    childTip: "Fold along the line drawn. With a diagonal mirror, rows become columns.",
  },
  "sym-reflect-not-rotate": {
    label: "Reflects when it should turn",
    detail: "Makes a mirror image when the pattern should look the same after a half turn.",
    childTip: "Turn the page upside down: a half turn moves the top-left to the bottom-right.",
  },
  "sym-order-partial": {
    label: "Turns only part of the way",
    detail: "Completes a half-turn pattern when a quarter-turn (order 4) one was asked for.",
    childTip: "Order 4 means it looks the same after every quarter turn: four copies.",
  },
  "sym-count-lines": {
    label: "Miscounts the lines of symmetry",
    detail: "Gives twice (or half) the number of lines a shape really has.",
    childTip: "A regular polygon with n sides has exactly n lines of symmetry. Fold to check each one.",
  },
  "sym-diagonal-rect": {
    label: "Thinks a rectangle's diagonals are lines of symmetry",
    detail: "Folding a rectangle along a diagonal doesn't match the halves.",
    childTip: "A rectangle has only 2 lines: across the middle each way. Its diagonals aren't mirror lines.",
  },
  "sym-order-1": {
    label: "Says order 0 for no rotational symmetry",
    detail: "Every shape looks the same after a full turn, so its order is at least 1.",
    childTip: "Order 1 means it only matches after a full turn: no rotational symmetry.",
  },
  "sym-angle": {
    label: "Uses the wrong angle of rotation",
    detail: "Gives the interior angle of the polygon, or 180°, instead of 360° ÷ the order.",
    childTip: "Angle of rotation = 360° ÷ order of rotational symmetry.",
  },
  "sym-parallelogram-line": {
    label: "Thinks a parallelogram has lines of symmetry",
    detail: "A parallelogram has a half-turn symmetry but no mirror line.",
    childTip: "Fold a paper parallelogram: the halves never match. Turn it half way: it does.",
  },
  "sym-rotation-as-line": {
    label: "Mixes up turning and mirror symmetry",
    detail: "Counts a half-turn match (like S or Z) as a line of symmetry.",
    childTip: "Line symmetry: fold to match. Rotational symmetry: turn to match. They're different.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `sym8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const N = 6;
type RC = [number, number];
const idx = ([r, c]: RC) => r * N + c;
const MAPS = {
  vertical: ([r, c]: RC): RC => [r, N - 1 - c],
  horizontal: ([r, c]: RC): RC => [N - 1 - r, c],
  diagonal: ([r, c]: RC): RC => [c, r],
  half: ([r, c]: RC): RC => [N - 1 - r, N - 1 - c],
  quarter: ([r, c]: RC): RC => [c, N - 1 - r],
};
/** A few squares inside a region, with at least `min` of them. */
function pattern(rng: Rng, inside: (p: RC) => boolean, min = 3, max = 5): RC[] {
  const all: RC[] = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (inside([r, c])) all.push([r, c]);
  const k = int(rng, min, Math.min(max, all.length));
  return all.sort(() => rng() - 0.5).slice(0, k);
}
const uniq = (ps: RC[]) => [...new Set(ps.map(idx))].sort((a, b) => a - b);
function grid(given: RC[], target: number[], wrong: { cells: number[]; mistake: string }[], extra: Partial<ShadeActivity>): ShadeActivity {
  const key = (c: number[]) => [...c].sort((a, b) => a - b).join(",");
  return {
    kind: "shade",
    mode: "free",
    rows: N,
    cols: N,
    target: target.length,
    given: uniq(given),
    targetCells: target,
    wrongSets: wrong.filter((w, i) => key(w.cells) !== key(target) && w.cells.every((c) => c >= 0 && c < N * N) && wrong.findIndex((x) => key(x.cells) === key(w.cells)) === i),
    ...extra,
  };
}
const fig = (extra: Partial<FigureSpec>): FigureSpec => ({ kind: "figure", figure: "polygon", ...extra });
const quad = (q: FigureSpec["quad"]): FigureSpec => ({ kind: "figure", figure: "quad", quad: q });
const NAME: Record<number, string> = { 3: "equilateral triangle", 4: "square", 5: "regular pentagon", 6: "regular hexagon", 8: "regular octagon", 9: "regular nonagon", 10: "regular decagon", 12: "regular dodecagon" };
const LINES: Record<string, number> = { A: 1, B: 1, C: 1, D: 1, E: 1, H: 2, I: 2, M: 1, T: 1, U: 1, V: 1, W: 1, X: 2, Y: 1, N: 0, S: 0, Z: 0 };
const ORDER: Record<string, number> = { H: 2, I: 2, N: 2, S: 2, X: 2, Z: 2, A: 1, E: 1, T: 1, U: 1, V: 1, M: 1, Y: 1 };

export const SYMMETRY_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: finish the pattern ----------------
  "concrete|remember": (rng) => {
    const g = pattern(rng, ([, c]) => c < N / 2);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "reflection", rng), prompt: "Shade squares so the dashed line is a line of symmetry.", representation: null },
      { p: uniq(g).reduce((s, x) => s * 37 + x, 1) % 1e9 },
      grid(g, uniq([...g, ...g.map(MAPS.vertical)]), [{ cells: uniq([...g, ...g.map(([r, c]) => [r, c + N / 2] as RC)]), mistake: "sym-reflect-translate" }], { mirror: "vertical" })
    );
  },
  "concrete|understand": (rng) => {
    const g = pattern(rng, ([r]) => r < N / 2);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "reflection", rng), prompt: "Shade squares so the dashed line is a line of symmetry.", representation: null },
      { p: uniq(g).reduce((s, x) => s * 37 + x, 1) % 1e9 },
      grid(g, uniq([...g, ...g.map(MAPS.horizontal)]), [{ cells: uniq([...g, ...g.map(([r, c]) => [r + N / 2, c] as RC)]), mistake: "sym-reflect-translate" }], { mirror: "horizontal" })
    );
  },
  "concrete|apply": (rng) => {
    const g = pattern(rng, ([r]) => r < N / 2);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "half turn", rng), prompt: "Shade squares so the pattern looks the same after a half turn about the dot (rotational symmetry of order 2).", representation: null },
      { p: uniq(g).reduce((s, x) => s * 37 + x, 1) % 1e9 },
      grid(g, uniq([...g, ...g.map(MAPS.half)]), [{ cells: uniq([...g, ...g.map(MAPS.horizontal)]), mistake: "sym-reflect-not-rotate" }], { centre: true })
    );
  },
  "concrete|analyze": (rng) => {
    const g = pattern(rng, ([r, c]) => r < N / 2 && c < N / 2, 2, 3);
    const q1 = g.map(MAPS.quarter), q2 = q1.map(MAPS.quarter), q3 = q2.map(MAPS.quarter);
    return buildActivity(
      { ...base("c-analyze", "concrete", "analyze", "quarter turn", rng), prompt: "Shade squares so the pattern looks the same after every quarter turn about the dot (rotational symmetry of order 4).", representation: null },
      { p: uniq(g).reduce((s, x) => s * 37 + x, 1) % 1e9 },
      grid(g, uniq([...g, ...q1, ...q2, ...q3]), [{ cells: uniq([...g, ...g.map(MAPS.half)]), mistake: "sym-order-partial" }, { cells: uniq([...g, ...g.map(MAPS.vertical), ...g.map(MAPS.horizontal), ...g.map(MAPS.half)]), mistake: "sym-reflect-not-rotate" }], { centre: true })
    );
  },
  "concrete|evaluate": (rng) => {
    const g = pattern(rng, ([r, c]) => r > c);
    return buildActivity(
      { ...base("c-evaluate", "concrete", "evaluate", "reflection", rng), prompt: "Shade squares so the dashed diagonal line is a line of symmetry.", representation: null },
      { p: uniq(g).reduce((s, x) => s * 37 + x, 1) % 1e9 },
      grid(g, uniq([...g, ...g.map(MAPS.diagonal)]), [{ cells: uniq([...g, ...g.map(MAPS.vertical)]), mistake: "sym-wrong-mirror" }, { cells: uniq([...g, ...g.map(MAPS.half)]), mistake: "sym-reflect-not-rotate" }], { mirror: "diagonal" })
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const n = pick(rng, [3, 5, 6, 8, 9, 10, 12]);
    return build(
      { ...base("p-remember", "pictorial", "remember", "lines of symmetry", rng), prompt: `How many lines of symmetry does this ${NAME[n]} have?`, representation: fig({ sides: n, regular: true }) },
      { n },
      String(n),
      [
        { text: String(2 * n), mistake: "sym-count-lines" },
        ...(n % 2 === 0 ? [{ text: String(n / 2), mistake: "sym-count-lines" }] : [{ text: String(n - 1), mistake: "sym-count-lines" }]),
        { text: "1", mistake: null },
        { text: "0", mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const [q, lines] = pick(rng, [["rectangle", 2], ["rhombus", 2], ["kite", 1], ["square", 4]] as const);
    return build(
      { ...base("p-understand", "pictorial", "understand", "lines of symmetry", rng), prompt: `How many lines of symmetry does this ${q} have?`, representation: quad(q) },
      { q: ["rectangle", "rhombus", "kite", "square"].indexOf(q) },
      String(lines),
      [
        { text: String(lines + 2), mistake: q === "rectangle" ? "sym-diagonal-rect" : "sym-count-lines" },
        { text: "0", mistake: null },
        { text: String(lines === 1 ? 2 : 1), mistake: "sym-count-lines" },
        { text: "8", mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const n = pick(rng, [3, 5, 6, 8, 9, 10, 12]);
    return build(
      { ...base("p-apply", "pictorial", "apply", "rotational order", rng), prompt: `What is the order of rotational symmetry of this ${NAME[n]}?`, representation: fig({ sides: n, regular: true }) },
      { n },
      String(n),
      [
        { text: "1", mistake: "sym-order-1" },
        { text: String(2 * n), mistake: "sym-count-lines" },
        { text: "0", mistake: "sym-order-1" },
      ]
    );
  },
  "pictorial|analyze": (rng) => build(
    { ...base("p-analyze", "pictorial", "analyze", "both kinds", rng), prompt: "How many lines of symmetry does this parallelogram have, and what is its order of rotational symmetry?", representation: quad("parallelogram") },
    { n: Math.floor(rng() * 1e6) },
    "0 lines, order 2",
    [
      { text: "2 lines, order 2", mistake: "sym-parallelogram-line" },
      { text: "0 lines, order 0", mistake: "sym-order-1" },
      { text: "2 lines, order 4", mistake: "sym-parallelogram-line" },
    ]
  ),
  "pictorial|evaluate": (rng) => {
    const n = pick(rng, [3, 5, 6, 8, 9, 10, 12]);
    return build(
      { ...base("p-evaluate", "pictorial", "evaluate", "angle of rotation", rng), prompt: `This ${NAME[n]} is turned about its centre. What is the smallest turn that makes it look the same?`, representation: fig({ sides: n, regular: true }) },
      { n },
      `${360 / n}°`,
      [
        { text: `${180 - 360 / n}°`, mistake: "sym-angle" },
        { text: "180°", mistake: "sym-angle" },
        { text: "360°", mistake: "sym-order-1" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const L = pick(rng, Object.keys(LINES));
    const right = LINES[L];
    return build(
      { ...base("a-remember", "abstract", "remember", "letters", rng), prompt: `How many lines of symmetry does the capital letter ${L} have?`, representation: null },
      { L: Object.keys(LINES).indexOf(L) },
      String(right),
      [0, 1, 2, 4].filter((x) => x !== right).map((x) => ({ text: String(x), mistake: right === 0 && ORDER[L] === 2 && x > 0 ? "sym-rotation-as-line" : x > right ? "sym-count-lines" : null }))
    );
  },
  "abstract|understand": (rng) => {
    const L = pick(rng, Object.keys(ORDER));
    const right = ORDER[L];
    return build(
      { ...base("a-understand", "abstract", "understand", "letters", rng), prompt: `What is the order of rotational symmetry of the capital letter ${L}?`, representation: null },
      { L: Object.keys(ORDER).indexOf(L) },
      String(right),
      [0, 1, 2, 4].filter((x) => x !== right).map((x) => ({ text: String(x), mistake: x === 0 ? "sym-order-1" : null }))
    );
  },
  "abstract|apply": (rng) => {
    const k = pick(rng, [2, 3, 4, 5, 6, 8, 9, 10, 12]);
    return build(
      { ...base("a-apply", "abstract", "apply", "angle of rotation", rng), prompt: `A shape has rotational symmetry of order ${k}. What is its smallest angle of rotation?`, representation: null },
      { k },
      `${360 / k}°`,
      [
        { text: `${+(180 / k).toFixed(1)}°`, mistake: "sym-angle" },
        { text: `${360 * k}°`, mistake: "sym-angle" },
        { text: `${360 - 360 / k}°`, mistake: "sym-angle" },
        { text: `${360 / k + 10}°`, mistake: null },
        { text: `${k * 10}°`, mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const right = pick(rng, ["a square", "a rectangle", "a rhombus", "a regular hexagon", "an equilateral triangle"]);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "both kinds", rng), prompt: "Which shape has BOTH a line of symmetry AND rotational symmetry (order more than 1)?", representation: null },
      { r: ["a square", "a rectangle", "a rhombus", "a regular hexagon", "an equilateral triangle"].indexOf(right) },
      right,
      [
        { text: "a parallelogram (not a rectangle or rhombus)", mistake: "sym-parallelogram-line" },
        { text: "an isosceles triangle", mistake: null },
        { text: "a kite", mistake: null },
        { text: "the letter S", mistake: "sym-rotation-as-line" },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const name = pick(rng, ["Riya", "Arjun", "Meera", "Kabir", "Diya", "Rohan"]);
    const ex = pick(rng, ["a parallelogram", "the letter S", "the letter Z", "the letter N"]);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "both kinds", rng), prompt: `${name} says: "Every shape with rotational symmetry also has a line of symmetry." Is ${name} right?`, representation: null },
      { e: ["a parallelogram", "the letter S", "the letter Z", "the letter N"].indexOf(ex) },
      `No: ${ex} has rotational symmetry of order 2 but no line of symmetry`,
      [
        { text: "Yes: turning and folding always go together", mistake: "sym-rotation-as-line" },
        { text: `Yes: ${ex} has a line of symmetry too`, mistake: ex === "a parallelogram" ? "sym-parallelogram-line" : "sym-rotation-as-line" },
        { text: "No: shapes with rotational symmetry never have a line of symmetry", mistake: null },
      ]
    );
  },
};
