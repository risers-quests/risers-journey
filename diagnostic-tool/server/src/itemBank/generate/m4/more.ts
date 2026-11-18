import { Template, int, pick } from "../core.js";
import { Misconceptions, card, kit, safe } from "../m7/kit.js";

/**
 * Grade 4 Maths (CPA Maths 4, Macmillan), Chapters 8–14: Shapes,
 * Measurement, Perimeter and Area, Time, Money, Data Handling, Patterns
 * and Symmetry. Built from each chapter's learning outcomes. Reuses the
 * Grade 3 mistake names (m3-…) where the skill is the same.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "m4-open-closed": { label: "Mixes up open and closed figures, or polygon names", detail: "Calls a figure with a gap closed, or a curved figure a polygon, or names a polygon by the wrong number of sides.", childTip: "A closed figure starts and ends at the same point. A polygon is closed and made only of straight sides: 5 sides pentagon, 6 hexagon, 8 octagon." },
  "m4-circle": { label: "Mixes up the parts of a circle", detail: "Confuses radius and diameter, or chord and arc.", childTip: "Radius: centre to the edge. Diameter: edge to edge through the centre (2 × radius). Chord: any edge-to-edge line. Arc: part of the curved edge." },
  "m4-net-view": { label: "Misreads nets or views of solids", detail: "Can't tell which net folds into a cube, or mixes up top and front views.", childTip: "Plan: from the top. Elevation: from the front. Side view: from the side. A cube's net has 6 squares that fold with no overlap." },
  "m4-perimeter": { label: "Gets the perimeter wrong", detail: "Adds only two sides, or multiplies length by breadth.", childTip: "Perimeter is the distance all the way round: add every side. Rectangle: 2 × (length + breadth). Square: 4 × side." },
  "m4-area": { label: "Gets the area wrong", detail: "Counts the edges instead of the squares inside, or adds instead of multiplies.", childTip: "Area is the space inside: count the squares, or length × breadth for a rectangle. Half squares make one whole together." },
  "m4-24h": { label: "Converts between 12-hour and 24-hour time wrongly", detail: "Forgets to add 12 for p.m. times, or writes 12:30 a.m. as 12:30.", childTip: "p.m. times after 1 p.m.: add 12 (3:15 p.m. = 15:15). 12 midnight is 00:00. a.m. times stay the same." },
  "m4-duration": { label: "Works out time durations wrongly", detail: "Subtracts times like ordinary numbers (2:10 − 1:50 = 0:60), or forgets to cross the hour.", childTip: "Count on: from the start time to the next hour, then on to the end time." },
  "m4-dates": { label: "Counts days between dates wrongly", detail: "Forgets different month lengths, or counts the first day too.", childTip: "Count the days left in the first month, then add the days in the next month. Remember 30 and 31-day months." },
  "m4-pie": { label: "Misreads a pie chart", detail: "Treats each slice as one item, or misjudges a half or a quarter.", childTip: "The whole circle is the total. Half the circle is half the total, a quarter is a quarter of the total." },
  "m4-mirror": { label: "Draws mirror images wrongly", detail: "Copies the shape without flipping it, or moves it the wrong distance from the mirror line.", childTip: "Each point of a mirror image is the same distance from the mirror line, on the other side, and left and right swap." },
};

type B = "remember" | "understand" | "apply" | "analyze" | "evaluate";
const bank = (K: ReturnType<typeof kit>, bloom: B, sub: string, b: [string, string, string[], string][]): Template => (rng) => {
  const i = int(rng, 0, b.length - 1);
  const [q, a, w, m] = b[i];
  return K.mc("abstract", bloom, sub, rng, { i }, q, null, a, w.map((t) => [t, m] as [string, string]));
};

// ---------------- Chapter 8: Shapes ----------------
const SH = kit("sh4", "g4-shapes");
const POLY: [number, string][] = [[3, "Triangle"], [4, "Quadrilateral"], [5, "Pentagon"], [6, "Hexagon"], [8, "Octagon"]];
export const SHAPES_G4: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const i = int(rng, 0, POLY.length - 1);
    return SH.tap("remember", "polygons", rng, { i }, `Tap the polygon with ${POLY[i][0]} sides.`, POLY.map(([, n]) => n.toLowerCase()).sort(() => rng() - 0.5).join("   "), POLY[i][1].toLowerCase(), [{ phrase: POLY[(i + 1) % POLY.length][1].toLowerCase(), mistake: "m4-open-closed" }]);
  },
  "concrete|understand": (rng) => {
    const r = int(rng, 2, 9);
    return SH.shade("understand", "radius and diameter", rng, { r }, `A circle has radius ${r} cm. Each square is 1 cm: shade its diameter.`, 2, 9, 2 * r, "1 square = 1 cm", [[r, "m4-circle"], [Math.min(18, r + 2), "m4-circle"]]);
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 1, 3);
    return SH.order("apply", "views of a solid", rng, { k }, "Match each view to where you look from, in this order: plan, front elevation, side view.", "from the top | from the front | from the side", [], [["from the front from the top from the side", "m4-net-view"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 3, 9), b = int(rng, 2, 9);
    return SH.shade("analyze", "measuring line segments", rng, { a, b }, `Line segment AB is ${a} cm and BC is ${b} cm, in a straight line. Each square is 1 cm: shade AC.`, 2, 9, a + b, "1 square = 1 cm", [[Math.abs(a - b), "m3-units"], [Math.max(a, b), "m3-units"]]);
  },
  "concrete|evaluate": (rng) => {
    const b: [string, string][] = [["A circle is a polygon with no sides.", "polygon"], ["The diameter of a circle is half its radius.", "half"], ["A hexagon has eight sides.", "eight"], ["A tangram has five pieces.", "five"]];
    const i = int(rng, 0, b.length - 1);
    return SH.tap("evaluate", "check a fact", rng, { i }, "One word in this sentence is wrong. Tap it.", b[i][0], b[i][1]);
  },
  "pictorial|remember": (rng) => {
    const i = int(rng, 0, POLY.length - 1);
    return SH.mc("pictorial", "remember", "naming polygons", rng, { i }, "What is this polygon called?", { kind: "figure", figure: "polygon", sides: POLY[i][0], regular: true }, POLY[i][1], [...POLY.filter((_, k) => k !== i).map(([, n]) => [n, "m4-open-closed"] as [string, string])]);
  },
  "pictorial|understand": (rng) => {
    const parts: ["radius" | "diameter" | "chord" | "arc", string][] = [["radius", "Radius"], ["diameter", "Diameter"], ["chord", "Chord"], ["arc", "Arc"]];
    const i = int(rng, 0, 3);
    return SH.mc("pictorial", "understand", "parts of a circle", rng, { i }, "What is the highlighted part of the circle called?", { kind: "figure", figure: "circle", part: parts[i][0] }, parts[i][1], [...parts.filter((_, k) => k !== i).map(([, n]) => [n, "m4-circle"] as [string, string]), ["Centre", "m4-circle"]]);
  },
  "pictorial|apply": (rng) => {
    const d = 2 * int(rng, 2, 12);
    return SH.mc("pictorial", "apply", "radius from diameter", rng, { d }, "What is the radius?", { kind: "figure", figure: "circle", part: "diameter", partLabel: `${d} cm` }, `${d / 2} cm`, [[`${d * 2} cm`, "m4-circle"], [`${d} cm`, "m4-circle"], [`${d / 2 + 2} cm`, "m4-circle"]]);
  },
  "pictorial|analyze": (rng) => {
    const solids: ["cube" | "cuboid" | "square-pyramid" | "cylinder", string, string][] = [["cube", "6 squares", "Cube"], ["cuboid", "6 rectangles", "Cuboid"], ["square-pyramid", "1 square and 4 triangles", "Square pyramid"], ["cylinder", "2 circles and 1 rectangle", "Cylinder"]];
    const i = int(rng, 0, 3);
    return SH.mc("pictorial", "analyze", "nets of solids", rng, { i }, "A net is made of the shapes on the card. Which solid does it fold into?", card([`Net: ${solids[i][1]}`]), solids[i][2], solids.filter((_, k) => k !== i).map(([, , n]) => [n, "m4-net-view"] as [string, string]));
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return SH.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: A diameter is the longest chord of a circle." : "Riya: A circle is a polygon because it is closed."]), right ? "Yes: it passes through the centre" : "No: a polygon has only straight sides", [
      [right ? "No: a polygon has only straight sides" : "Yes: it passes through the centre", "m4-circle"],
      ["No: all chords are the same length", "m4-circle"],
      ["Yes: every closed figure is a polygon", "m4-open-closed"],
    ]);
  },
  "abstract|remember": bank(SH, "remember", "open and closed figures", [
    ["A figure that begins and ends at the same point is ___", "closed", ["open", "a ray", "a line"], "m4-open-closed"],
    ["A polygon with 8 sides is an ___", "octagon", ["hexagon", "pentagon", "heptagon"], "m4-open-closed"],
    ["A polygon is made of ___", "straight line segments only", ["curves only", "curves and lines", "dots only"], "m4-open-closed"],
  ]),
  "abstract|understand": (rng) => {
    const r = int(rng, 3, 25);
    return SH.mc("abstract", "understand", "radius and diameter", rng, { r }, `The radius of a circle is ${r} cm. Its diameter is ___`, null, `${2 * r} cm`, [[`${r / 2} cm`, "m4-circle"], [`${r + 2} cm`, "m4-circle"], [`${4 * r} cm`, "m4-circle"]].filter(([t]) => t !== `${r} cm`) as [string, string][]);
  },
  "abstract|apply": bank(SH, "apply", "parts of a circle", [
    ["The fixed point in the middle of a circle is its ___", "centre", ["radius", "arc", "chord"], "m4-circle"],
    ["A line segment joining any two points on a circle is a ___", "chord", ["radius", "centre", "arc"], "m4-circle"],
    ["A part of the curved edge of a circle is an ___", "arc", ["chord", "radius", "diameter"], "m4-circle"],
    ["To draw a circle accurately, we use a ___", "compass", ["protractor", "set square", "ruler only"], "m4-circle"],
  ]),
  "abstract|analyze": bank(SH, "analyze", "views and nets", [
    ["The view of an object from the top is its ___", "plan", ["elevation", "side view", "net"], "m4-net-view"],
    ["The view of an object from the front is its ___", "elevation", ["plan", "side view", "net"], "m4-net-view"],
    ["The net of a cube has ___ squares.", "6", ["4", "8", "12"], "m4-net-view"],
  ]),
  "abstract|evaluate": bank(SH, "evaluate", "tangrams and polygons", [
    ["A tangram is made of ___ pieces.", "7", ["5", "6", "8"], "m3-shape-count"],
    ["Which is NOT a polygon?", "circle", ["triangle", "hexagon", "square"], "m4-open-closed"],
    ["How many triangles are in a tangram?", "5", ["7", "3", "4"], "m3-shape-count"],
  ]),
});

// ---------------- Chapter 9: Measurement ----------------
const ME = kit("me4", "g4-measure");
const UNITS: [string, string, number][] = [["m", "cm", 100], ["cm", "mm", 10], ["km", "m", 1000], ["kg", "g", 1000], ["L", "mL", 1000]];
export const MEASURE_G4: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const cm = int(rng, 2, 8);
    return ME.shade("remember", "centimetres and millimetres", rng, { cm }, `Each square is 5 mm. Shade ${cm} cm.`, 2, 9, cm * 2, "1 square = 5 mm", [[cm, "m3-convert"], [Math.min(18, cm * 10), "m3-convert"]]);
  },
  "concrete|understand": (rng) => {
    const km = int(rng, 1, 3), m = 250 * int(rng, 1, 3);
    return ME.shade("understand", "kilometres and metres", rng, { km, m }, `Each square is 250 m. Shade ${km} km ${m} m.`, 2, 9, km * 4 + m / 250, "1 square = 250 m", [[km + m / 250, "m3-convert"], [km * 10 + m / 250 <= 18 ? km * 10 + m / 250 : -1, "m3-convert"]]);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 2, 8), b = int(rng, 1, 5), x = 100 * int(rng, 3, 9), y = 100 * int(rng, 2, 9);
    const s = a * 1000 + x + b * 1000 + y;
    const good = `${Math.floor(s / 1000)} kg ${s % 1000} g`, bad = `${a + b} kg ${x + y} g`;
    if (good === bad) throw new Error("no regroup");
    return ME.order("apply", "adding weights", rng, { a, b, x, y }, "Build the addition.", `${a} kg ${x} g | + | ${b} kg ${y} g | = | ${good}`, [bad], [[`${a} kg ${x} g + ${b} kg ${y} g = ${bad}`, "m3-units"]]);
  },
  "concrete|analyze": (rng) => {
    const [big, small, f] = pick(rng, UNITS);
    const n = int(rng, 2, 9);
    const line = [n * f, n * (f === 10 ? 100 : 10), n * (f === 1000 ? 100 : 1000), n + f].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return ME.tap("analyze", "converting units", rng, { n, f }, `Tap how many ${small} make ${n} ${big}.`, line.sort(() => rng() - 0.5).join("   "), String(n * f), [{ phrase: String(n * (f === 10 ? 100 : 10)), mistake: "m3-convert" }]);
  },
  "concrete|evaluate": (rng) => {
    const L = int(rng, 3, 9), ml = 100 * int(rng, 2, 8);
    const bad = `${L - 1} L ${ml} mL`;
    return ME.tap("evaluate", "subtracting volumes", rng, { L, ml }, "One number in this answer is wrong. Tap it.", `${L} L − ${ml} mL = ${L - 1} L ${ml} mL`, `${ml}`);
  },
  "pictorial|remember": (rng) => {
    const [big, small, f] = pick(rng, UNITS);
    return ME.mc("pictorial", "remember", "relating units", rng, { f }, `How many ${small} make 1 ${big}?`, card([`1 ${big} = ? ${small}`]), String(f), [[String(f === 10 ? 100 : 10), "m3-convert"], [String(f === 1000 ? 100 : 1000), "m3-convert"], [String(f * 10), "m3-convert"]]);
  },
  "pictorial|understand": (rng) => {
    const a = 50 * int(rng, 4, 18), b = 50 * int(rng, 4, 18);
    const s = a + b;
    const ans = s >= 1000 ? `${Math.floor(s / 1000)} L ${s % 1000} mL` : `${s} mL`;
    return ME.mc("pictorial", "understand", "adding volumes", rng, { a, b }, "How much juice is there in the two jugs together?", { kind: "bars", bars: [{ name: "", parts: [{ value: a, label: `${a} mL` }, { value: b, label: `${b} mL` }] }], brace: { label: "?" } }, ans, [[`${s} L`, "m3-units"], [`${Math.abs(a - b) || 50} mL`, "m3-op"], [`${s / 100} L`, "m3-convert"]]);
  },
  "pictorial|apply": (rng) => {
    const total = int(rng, 4, 9), part = int(rng, 1, total - 2), m = 50 * int(rng, 2, 19);
    const left = total * 1000 - part * 1000 - m;
    return ME.mc("pictorial", "apply", "distance word problem", rng, { total, part, m }, "How far is it still to go?", card([`The trip is ${total} km.`, `Riya has walked ${part} km ${m} m.`]), `${Math.floor(left / 1000)} km ${left % 1000} m`, [[`${total - part} km ${m} m`, "m3-units"], [`${total - part} km ${1000 - m} m`, "m3-units"], [`${total + part} km ${m} m`, "m3-op"]]);
  },
  "pictorial|analyze": (rng) => {
    const items: [string, string, string[]][] = [["A school bag", "about 3 kg", ["about 3 g", "about 300 kg", "about 30 kg"]], ["A water bottle", "about 1 L", ["about 1 mL", "about 100 L", "about 10 mL"]], ["The length of a pencil", "about 15 cm", ["about 15 m", "about 15 mm", "about 15 km"]], ["The height of a door", "about 2 m", ["about 2 cm", "about 20 m", "about 2 km"]]];
    const i = int(rng, 0, items.length - 1);
    return ME.mc("pictorial", "analyze", "estimating", rng, { i }, "What is the best estimate?", card([items[i][0]]), items[i][1], items[i][2].map((t) => [t, "m3-convert"] as [string, string]));
  },
  "pictorial|evaluate": (rng) => {
    const n = int(rng, 2, 9);
    const right = rng() < 0.5;
    return ME.mc("pictorial", "evaluate", "judge a claim", rng, { n, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${n} cm = ${n * 10} mm` : `Riya: ${n} cm = ${n * 100} mm`]), right ? "Yes: 1 cm = 10 mm" : "No: 1 cm = 10 mm, not 100", [
      [right ? "No: 1 cm = 10 mm, not 100" : "Yes: 1 cm = 10 mm", "m3-convert"],
      ["No: 1 cm = 1000 mm", "m3-convert"],
      ["Yes: 1 cm = 100 mm", "m3-convert"],
    ]);
  },
  "abstract|remember": (rng) => {
    const [big, small, f] = pick(rng, UNITS);
    const n = int(rng, 2, 9), r = int(rng, 1, f === 10 ? 9 : f / 10 - 1) * (f === 10 ? 1 : 1);
    if (r === 0) throw new Error("zero");
    return ME.mc("abstract", "remember", "converting", rng, { n, f, r }, `${n} ${big} ${r} ${small} = ___ ${small}`, null, String(n * f + r), [[String(n * 10 + r), "m3-convert"], [String(n + r), "m3-convert"], [String(n * f * 10 + r), "m3-convert"]]);
  },
  "abstract|understand": (rng) => {
    const g = int(rng, 1100, 9900);
    if (g % 1000 === 0) throw new Error("whole");
    return ME.mc("abstract", "understand", "grams to kilograms", rng, { g }, `${g} g = ___`, null, `${Math.floor(g / 1000)} kg ${g % 1000} g`, [[`${Math.floor(g / 100)} kg ${g % 100} g`, "m3-convert"], [`${g} kg`, "m3-convert"], [`${Math.floor(g / 10)} kg ${g % 10} g`, "m3-convert"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 3, 9), b = int(rng, 1, a - 1), x = int(rng, 10, 45), y = int(rng, x + 5, 95);
    const left = a * 100 + x - (b * 100 + y);
    if (left % 100 === x || left % 100 === y || Math.floor(left / 100) === b) throw new Error("coincidence");
    return ME.mc("abstract", "apply", "subtracting lengths", rng, { a, b, x, y }, `${a} m ${x} cm − ${b} m ${y} cm = ___`, null, `${Math.floor(left / 100)} m ${left % 100} cm`, [[`${a - b} m ${y - x} cm`, "m3-borrow"], [`${a - b} m ${x + 100 - y + 10} cm`, "m3-borrow"], [`${a + b} m ${x + y} cm`, "m3-op"]]);
  },
  "abstract|analyze": (rng) => {
    const each = 250 * int(rng, 1, 3), n = int(rng, 4, 8);
    const ml = each * n;
    return ME.mc("abstract", "analyze", "word problem", rng, { each, n }, `${n} glasses each hold ${each} mL. How much water fills them all?`, null, ml >= 1000 ? `${Math.floor(ml / 1000)} L ${ml % 1000} mL` : `${ml} mL`, [[`${ml} L`, "m3-convert"], [`${each + n} mL`, "m3-op"], [`${Math.floor(ml / 100)} L`, "m3-convert"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 2, 5), b = 100 * int(rng, 15, 55);
    if (a * 1000 === b) throw new Error("equal");
    const big = a * 1000 > b ? `${a} km` : `${b} m`;
    return ME.mc("abstract", "evaluate", "comparing", rng, { a, b }, `Which is longer: ${a} km or ${b} m?`, null, big, [[big === `${a} km` ? `${b} m` : `${a} km`, "m3-convert"], ["They are equal", "m3-convert"], ["You can't compare km and m", "m3-convert"]]);
  },
});

// ---------------- Chapter 10: Perimeter and Area ----------------
const PA = kit("pa4", "g4-area");
export const AREA_G4: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const l = int(rng, 3, 9), b = int(rng, 2, 6);
    if (l === b) throw new Error("square");
    return PA.shade("remember", "area by counting squares", rng, { l, b }, `Shade a rectangle ${l} squares long and ${b} squares wide (1 square = 1 sq cm).`, 6, 9, l * b, "1 square = 1 sq cm", [[2 * (l + b), "m4-area"], [l + b, "m4-area"]]);
  },
  "concrete|understand": (rng) => {
    const s = int(rng, 2, 6);
    return PA.shade("understand", "area of a square", rng, { s }, `Shade a square of side ${s} cm (1 square = 1 sq cm).`, 6, 9, s * s, "1 square = 1 sq cm", [[4 * s, "m4-area"], [2 * s, "m4-area"]]);
  },
  "concrete|apply": (rng) => {
    const l = int(rng, 4, 15), b = int(rng, 2, 9);
    if (l === b) throw new Error("square");
    return PA.order("apply", "perimeter of a rectangle", rng, { l, b }, `Build the perimeter of a ${l} cm by ${b} cm rectangle.`, `2 × (${l} + ${b}) | = | ${2 * (l + b)} cm`, [`${l * b} cm`], [[`2 × (${l} + ${b}) = ${l * b} cm`, "m4-perimeter"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 3, 9), b = int(rng, 3, 9), c = int(rng, Math.abs(a - b) + 1, a + b - 1);
    const line = [a + b + c, a + b, a * b, a + b + c + 1].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return PA.tap("analyze", "perimeter of a triangle", rng, { a, b, c }, `A triangle has sides ${a} cm, ${b} cm and ${c} cm. Tap its perimeter (in cm).`, line.sort(() => rng() - 0.5).join("   "), String(a + b + c), [{ phrase: String(a + b), mistake: "m4-perimeter" }]);
  },
  "concrete|evaluate": (rng) => {
    const s = int(rng, 3, 12);
    return PA.tap("evaluate", "check a perimeter", rng, { s }, "One number in this working is wrong. Tap it.", `Perimeter of a square of side ${s} cm = 2 × ${s} = ${2 * s} cm`, "2");
  },
  "pictorial|remember": (rng) => {
    const l = int(rng, 4, 15), b = int(rng, 2, 9);
    if (l === b) throw new Error("square");
    return PA.mc("pictorial", "remember", "perimeter of a rectangle", rng, { l, b }, "What is the perimeter?", { kind: "shape", shape: "rectangle", sideLabels: [`${l} cm`, `${b} cm`] }, `${2 * (l + b)} cm`, [[`${l * b} cm`, "m4-perimeter"], [`${l + b} cm`, "m4-perimeter"], [`${2 * l + b} cm`, "m4-perimeter"]]);
  },
  "pictorial|understand": (rng) => {
    const r = int(rng, 2, 5), c = int(rng, 3, 8);
    const half = 2 * int(rng, 1, 2);
    return PA.mc("pictorial", "understand", "area of a shape on a grid", rng, { r, c, half }, `The shape covers the full squares shown, plus ${half} half squares. What is its area?`, { kind: "grid", rows: r, cols: c, shadedCells: r * c - 1, compact: true }, `${r * c - 1 + half / 2} sq units`, [[`${r * c - 1 + half} sq units`, "m4-area"], [`${r * c - 1} sq units`, "m4-area"], [`${2 * (r + c)} sq units`, "m4-perimeter"]]);
  },
  "pictorial|apply": (rng) => {
    const s = int(rng, 3, 15);
    return PA.mc("pictorial", "apply", "perimeter of a square", rng, { s }, "What is the perimeter of this square?", { kind: "shape", shape: "square", sideLabels: [`${s} cm`] }, `${4 * s} cm`, [[`${s * s} cm`, "m4-perimeter"], [`${2 * s} cm`, "m4-perimeter"], [`${s + 4} cm`, "m4-perimeter"]]);
  },
  "pictorial|analyze": (rng) => {
    const sides = [int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9)];
    const p = sides.reduce((x, y) => x + y, 0);
    return PA.mc("pictorial", "analyze", "perimeter of a closed figure", rng, { a: sides[0], b: sides[1], c: sides[2], d: sides[3], e: sides[4] }, "What is the perimeter of this closed figure?", { kind: "figure", figure: "polygon", sides: 5, regular: false, sideLabels: sides.map((x) => `${x} cm`) }, `${p} cm`, [[`${p - sides[4]} cm`, "m4-perimeter"], [`${sides[0] * sides[1]} cm`, "m4-area"], [`${p + 5} cm`, "m4-perimeter"]]);
  },
  "pictorial|evaluate": (rng) => {
    const l = int(rng, 4, 9), b = int(rng, 2, 3);
    const right = rng() < 0.5;
    return PA.mc("pictorial", "evaluate", "judge an answer", rng, { l, b, r: right ? 1 : 0 }, `Riya says the area is ${right ? l * b : 2 * (l + b)} sq cm. Is she right?`, { kind: "shape", shape: "rectangle", sideLabels: [`${l} cm`, `${b} cm`] }, right ? "Yes: area = length × breadth" : "No: that is the perimeter", [
      [right ? "No: that is the perimeter" : "Yes: area = length × breadth", "m4-area"],
      ["No: area = length + breadth", "m4-area"],
      ["Yes: area and perimeter are the same", "m4-area"],
    ]);
  },
  "abstract|remember": bank(PA, "remember", "meanings", [
    ["The distance around a closed figure is its ___", "perimeter", ["area", "volume", "diameter"], "m4-perimeter"],
    ["The space covered by a flat figure is its ___", "area", ["perimeter", "length", "height"], "m4-area"],
    ["Area is measured in ___", "square units (sq cm)", ["cm", "kg", "L"], "m4-area"],
  ]),
  "abstract|understand": (rng) => {
    const l = int(rng, 4, 20), b = int(rng, 2, 12);
    if (l === b) throw new Error("square");
    return PA.mc("abstract", "understand", "area of a rectangle", rng, { l, b }, `A rectangle is ${l} cm long and ${b} cm wide. Its area is ___`, null, `${l * b} sq cm`, [[`${2 * (l + b)} sq cm`, "m4-area"], [`${l + b} sq cm`, "m4-area"], [`${l * b} cm`, "m3-units"]]);
  },
  "abstract|apply": (rng) => {
    const s = int(rng, 4, 25);
    return PA.mc("abstract", "apply", "side from perimeter", rng, { s }, `A square has perimeter ${4 * s} cm. Its side is ___`, null, `${s} cm`, [[`${2 * s} cm`, "m4-perimeter"], [`${4 * s - 4} cm`, "m4-perimeter"], [`${s + 4} cm`, "m4-perimeter"]]);
  },
  "abstract|analyze": (rng) => {
    const l = int(rng, 10, 40), b = int(rng, 5, 20), cost = int(rng, 2, 9);
    return PA.mc("abstract", "analyze", "fencing word problem", rng, { l, b, cost }, `A garden is ${l} m by ${b} m. Fencing costs ₹${cost} per metre. What does it cost to fence it?`, null, `₹${2 * (l + b) * cost}`, [[`₹${l * b * cost}`, "m4-area"], [`₹${(l + b) * cost}`, "m4-perimeter"], [`₹${2 * (l + b)}`, "m3-op"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 4, 9), b = a + int(rng, 2, 5);
    return PA.mc("abstract", "evaluate", "comparing shapes", rng, { a, b }, `A square has side ${a} cm. A rectangle is ${b} cm by ${a - 1} cm. Which has the bigger area?`, null, a * a > b * (a - 1) ? "The square" : a * a < b * (a - 1) ? "The rectangle" : "Both are equal", [["The square", "m4-area"], ["The rectangle", "m4-area"], ["Both are equal", "m4-area"], ["You can't tell without the perimeter", "m4-area"]]);
  },
});

// ---------------- Chapter 11: Time ----------------
const TI = kit("ti4", "g4-time");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_IN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const hm = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")}`;
export const TIME_G4: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const k = int(rng, 1, 11), extra = int(rng, 1, 4);
    return TI.shade("remember", "time to the exact minute", rng, { k, extra }, `The minute hand is ${extra} small marks past ${k}. Shade one square per minute past the hour.`, 6, 10, 5 * k + extra, "1 square = 1 minute", [[k + extra, "m3-clock"], [5 * k, "m3-clock"]]);
  },
  "concrete|understand": (rng) => {
    const s = int(rng, 0, 7);
    const order = MONTHS.slice(s, s + 5);
    return TI.order("understand", "chronological order", rng, { s }, "Put these months in order.", order.join(" | "), [], [[[order[0], order[2], order[1], order[3], order[4]].join(" "), "m3-calendar"]]);
  },
  "concrete|apply": (rng) => {
    const h = int(rng, 1, 11), m = int(rng, 1, 59);
    const t24 = `${h + 12}:${String(m).padStart(2, "0")}`;
    const line = [t24, hm(h, m), `${h + 10}:${String(m).padStart(2, "0")}`, `${h + 2}:${String(m).padStart(2, "0")}`];
    if (new Set(line).size < 4) throw new Error("dup");
    return TI.tap("apply", "24-hour clock", rng, { h, m }, `Tap ${hm(h, m)} p.m. in the 24-hour clock.`, line.sort(() => rng() - 0.5).join("   "), t24, [{ phrase: hm(h, m), mistake: "m4-24h" }]);
  },
  "concrete|analyze": (rng) => {
    const m = int(rng, 0, 11);
    const right = String(DAYS_IN[m]);
    return TI.tap("analyze", "days in a month", rng, { m }, `Tap the number of days in ${MONTHS[m]} (not a leap year).`, "28   30   31   29", right, [{ phrase: right === "31" ? "30" : "31", mistake: "m3-calendar" }]);
  },
  "concrete|evaluate": (rng) => {
    const h = int(rng, 1, 9), m = 10 * int(rng, 3, 5), d = 10 * int(rng, 3, 5);
    const end = h * 60 + m + d;
    const wrong = `${h}:${m + d}`;
    if (m + d < 60) throw new Error("no cross");
    return TI.tap("evaluate", "adding time", rng, { h, m, d }, "The end time in this working is wrong. Tap it.", `Starts ${hm(h, m)}, lasts ${d} minutes, ends ${wrong}`, wrong, []);
  },
  "pictorial|remember": (rng) => {
    const h = int(rng, 1, 12), m = int(rng, 1, 59);
    if (m % 5 === 0) throw new Error("round");
    return TI.mc("pictorial", "remember", "reading a clock", rng, { h, m }, "What time is it?", card([`The hour hand is just past ${h}.`, `The minute hand is ${m % 5} small mark${m % 5 > 1 ? "s" : ""} after ${Math.floor(m / 5) || 12}.`], "A clock"), hm(h, m), [[hm(h, Math.floor(m / 5) + (m % 5)), "m3-clock"], [hm(h, Math.floor(m / 5) * 5), "m3-clock"], [hm(h === 12 ? 1 : h + 1, m), "m3-clock"]]);
  },
  "pictorial|understand": (rng) => {
    const h = int(rng, 13, 23), m = int(rng, 1, 59);
    return TI.mc("pictorial", "understand", "24-hour to 12-hour", rng, { h, m }, "Write this time in the 12-hour clock.", card([`${h}:${String(m).padStart(2, "0")}`], "24-hour clock"), `${hm(h - 12, m)} p.m.`, [[`${hm(h - 12, m)} a.m.`, "m4-24h"], [`${hm(h - 10, m)} p.m.`, "m4-24h"], [`${hm(h, m)} a.m.`, "m4-24h"]]);
  },
  "pictorial|apply": (rng) => {
    const h = int(rng, 8, 16), m1 = int(rng, 30, 55), d = int(rng, 20, 55);
    const end = h * 60 + m1 + d;
    return TI.mc("pictorial", "apply", "how long", rng, { h, m1, d }, "How long did the event last?", card([`Started: ${h}:${String(m1).padStart(2, "0")}`, `Ended: ${Math.floor(end / 60)}:${String(end % 60).padStart(2, "0")}`]), `${d} minutes`, [[`${Math.abs((end % 60) - m1) + 100 * (Math.floor(end / 60) - h) === d ? d + 10 : Math.abs((end % 60) - m1) + 100 * (Math.floor(end / 60) - h)} minutes`, "m4-duration"], [`${d + 60} minutes`, "m4-duration"], [`${d - 10} minutes`, "m4-duration"]]);
  },
  "pictorial|analyze": (rng) => {
    const m = int(rng, 0, 10), a = int(rng, 10, DAYS_IN[m] - 2), b = int(rng, 3, 20);
    const days = DAYS_IN[m] - a + b;
    return TI.mc("pictorial", "analyze", "days between dates", rng, { m, a, b }, "How many days from the first date to the second?", card([`From ${a} ${MONTHS[m]}`, `To ${b} ${MONTHS[m + 1]}`]), `${days} days`, [[`${30 - a + b === days ? days + 2 : 30 - a + b} days`, "m4-dates"], [`${days + 1} days`, "m4-dates"], [`${Math.abs(b - a) + 1} days`, "m4-dates"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return TI.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: We need leap years because a year is about 365 and a quarter days long." : "Riya: Every year has 366 days."]), right ? "Yes: the extra quarter days add up to 1 day every 4 years" : "No: only leap years have 366 days", [
      [right ? "No: only leap years have 366 days" : "Yes: the extra quarter days add up to 1 day every 4 years", "m3-calendar"],
      ["No: leap years have 360 days", "m3-calendar"],
      ["Yes: February always has 29 days", "m3-calendar"],
    ]);
  },
  "abstract|remember": bank(TI, "remember", "days and years", [
    ["An ordinary year has ___ days.", "365", ["366", "360", "52"], "m3-calendar"],
    ["A leap year has ___ days.", "366", ["365", "364", "400"], "m3-calendar"],
    ["A leap year comes once every ___ years.", "4", ["2", "10", "100"], "m3-calendar"],
    ["In a leap year, February has ___ days.", "29", ["28", "30", "31"], "m3-calendar"],
  ]),
  "abstract|understand": (rng) => {
    const h = int(rng, 1, 11), m = int(rng, 1, 59);
    return TI.mc("abstract", "understand", "12-hour to 24-hour", rng, { h, m }, `${hm(h, m)} p.m. in the 24-hour clock is ___`, null, `${h + 12}:${String(m).padStart(2, "0")}`, [[`${h + 10}:${String(m).padStart(2, "0")}`, "m4-24h"], [`0${h}:${String(m).padStart(2, "0")}`.slice(-5), "m4-24h"], [`${h + 2}:${String(m).padStart(2, "0")}`, "m4-24h"]]);
  },
  "abstract|apply": (rng) => {
    const h = int(rng, 1, 5), m = int(rng, 5, 55);
    return TI.mc("abstract", "apply", "hours to minutes", rng, { h, m }, `${h} hours ${m} minutes = ___ minutes`, null, String(h * 60 + m), [[String(h * 100 + m), "m4-duration"], [String(h + m), "m4-duration"], [String(h * 60), "m4-duration"]]);
  },
  "abstract|analyze": (rng) => {
    const y = pick(rng, [2020, 2024, 2028, 2023, 2025, 2026, 2030]);
    const leap = y % 4 === 0;
    return TI.mc("abstract", "analyze", "is it a leap year?", rng, { y }, `Is ${y} a leap year?`, null, leap ? "Yes: it divides exactly by 4" : "No: it does not divide exactly by 4", [[leap ? "No: it does not divide exactly by 4" : "Yes: it divides exactly by 4", "m3-calendar"], ["Yes: every even year is a leap year", "m3-calendar"], ["No: leap years end in 0", "m3-calendar"]]);
  },
  "abstract|evaluate": (rng) => {
    const h = int(rng, 6, 10), m = 5 * int(rng, 1, 11), d = 5 * int(rng, 7, 20);
    const end = h * 60 + m + d;
    return TI.mc("abstract", "evaluate", "end time", rng, { h, m, d }, `A train leaves at ${hm(h, m)} a.m. and the trip takes ${d} minutes. When does it arrive?`, null, `${hm(Math.floor(end / 60), end % 60)} a.m.`, [end + 5, end - 5, end + 60, end - 10].map((t) => [`${hm(Math.floor(t / 60), t % 60)} a.m.`, "m4-duration"] as [string, string]));
  },
});

// ---------------- Chapter 12: Money ----------------
const MO = kit("mo4", "g4-money");
const rs = (p: number) => `₹${Math.floor(p / 100)}.${String(p % 100).padStart(2, "0")}`;
export const MONEY_G4: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const r = 50 * int(rng, 2, 18);
    return MO.shade("remember", "counting money", rng, { r }, `Each square is a ₹50 note. Shade ₹${r}.`, 2, 9, r / 50, "1 square = ₹50", [[r / 100, "m3-money-op"], [Math.min(18, r / 50 + 2), "m3-money-op"]]);
  },
  "concrete|understand": (rng) => {
    const p = int(rng, 1000, 99999);
    if (p % 100 === 0) throw new Error("round");
    const line = [rs(p), `₹${p}`, `₹${(p / 10).toFixed(2)}`, `₹${Math.floor(p / 1000)}.${String(p % 1000).padStart(3, "0")}`];
    if (new Set(line).size < 4) throw new Error("dup");
    return MO.tap("understand", "paise to rupees", rng, { p }, `Tap ${p} paise in rupees.`, line.sort(() => rng() - 0.5).join("   "), rs(p), [{ phrase: `₹${p}`, mistake: "m3-paise" }]);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 100, 900) * 100 + 5 * int(rng, 2, 19), b = int(rng, 100, 500) * 100 + 5 * int(rng, 2, 19);
    if (a <= b) throw new Error("order");
    return MO.order("apply", "subtracting money", rng, { a, b }, "Build the subtraction.", `${rs(a)} | − | ${rs(b)} | = | ${rs(a - b)}`, [rs(a + b)], [[`${rs(a)} − ${rs(b)} = ${rs(a + b)}`, "m3-op"]]);
  },
  "concrete|analyze": (rng) => {
    const r = int(rng, 10, 999), p = 5 * int(rng, 1, 19);
    const right = r * 100 + p;
    const line = [right, r * 10 + p, r + p, r * 1000 + p].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return MO.tap("analyze", "rupees to paise", rng, { r, p }, `Tap ${rs(right)} in paise.`, line.sort(() => rng() - 0.5).join("   "), String(right), [{ phrase: String(r * 10 + p), mistake: "m3-paise" }]);
  },
  "concrete|evaluate": (rng) => {
    const price = int(rng, 15, 95), n = int(rng, 3, 9);
    return MO.tap("evaluate", "check a bill", rng, { price, n }, "One amount in this bill is wrong. Tap it.", `${n} notebooks at ₹${price} each = ₹${price + n}`, `₹${price + n}`);
  },
  "pictorial|remember": (rng) => {
    const r = int(rng, 10, 999), p = 5 * int(rng, 1, 19);
    return MO.mc("pictorial", "remember", "rupees to paise", rng, { r, p }, "How many paise is this?", card([rs(r * 100 + p)]), `${r * 100 + p} p`, [[`${r * 10 + p} p`, "m3-paise"], [`${r + p} p`, "m3-paise"], [`${r * 1000 + p} p`, "m3-paise"]]);
  },
  "pictorial|understand": (rng) => {
    const a = int(rng, 100, 900) * 100 + 5 * int(rng, 2, 19), b = int(rng, 100, 900) * 100 + 5 * int(rng, 2, 19);
    return MO.mc("pictorial", "understand", "adding money", rng, { a, b }, "How much do the two items cost together?", card([`Bag: ${rs(a)}`, `Shoes: ${rs(b)}`]), rs(a + b), [[rs(a + b - 100), "m3-money-op"], [rs(Math.abs(a - b)), "m3-op"], [rs(a + b + 100), "m3-money-op"]]);
  },
  "pictorial|apply": (rng) => {
    const items: [string, number][] = [["Pen", int(rng, 12, 45)], ["Notebook", int(rng, 35, 85)], ["Ruler", int(rng, 10, 30)]];
    const q = [int(rng, 2, 6), int(rng, 2, 5), int(rng, 1, 4)];
    const total = items.reduce((s, [, p], i) => s + p * q[i], 0);
    return MO.mc("pictorial", "apply", "making a bill", rng, { a: items[0][1], b: items[1][1], c: items[2][1], x: q[0], y: q[1], z: q[2] }, "What is the total of the bill?", card(items.map(([n, p], i) => `${n}: ${q[i]} × ₹${p}`), "Bill"), `₹${total}`, [[`₹${items.reduce((s, [, p]) => s + p, 0)}`, "m3-money-op"], [`₹${total - items[2][1] * q[2]}`, "m3-money-op"], [`₹${total + 10}`, "m3-money-op"]]);
  },
  "pictorial|analyze": (rng) => {
    const n = int(rng, 3, 9), each = int(rng, 1200, 9900);
    return MO.mc("pictorial", "analyze", "dividing money", rng, { n, each }, "How much does each child get?", card([`${rs(n * each)} shared equally`, `among ${n} children`]), rs(each), [[rs(n * each - n * 100), "m3-op"], [rs(each + 100), "m3-money-op"], [rs(each * 10), "m3-paise"]]);
  },
  "pictorial|evaluate": (rng) => {
    const r = int(rng, 20, 90), p = 5 * int(rng, 1, 19);
    const right = rng() < 0.5;
    return MO.mc("pictorial", "evaluate", "judge a claim", rng, { r, p, k: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${rs(r * 100 + p)} = ${r * 100 + p} p` : `Riya: ${rs(r * 100 + p)} = ${r * 10 + p} p`]), right ? "Yes: multiply rupees by 100" : "No: multiply rupees by 100, not 10", [
      [right ? "No: multiply rupees by 100, not 10" : "Yes: multiply rupees by 100", "m3-paise"],
      ["No: divide by 100", "m3-paise"],
      ["Yes: ₹1 = 10 p", "m3-paise"],
    ]);
  },
  "abstract|remember": (rng) => {
    const p = int(rng, 1000, 99999);
    if (p % 100 === 0) throw new Error("round");
    return MO.mc("abstract", "remember", "paise to rupees", rng, { p }, `${p} p = ___`, null, rs(p), [[`₹${p}`, "m3-paise"], [`₹${(p / 10).toFixed(2)}`, "m3-paise"], [`₹${Math.floor(p / 100)}`, "m3-paise"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 100, 999) * 100 + 5 * int(rng, 1, 19), n = int(rng, 3, 9);
    return MO.mc("abstract", "understand", "multiplying money", rng, { a, n }, `${rs(a)} × ${n} = ___`, null, rs(a * n), [[rs(a + n * 100), "m3-op"], [rs(Math.floor(a / 100) * n * 100 + (a % 100)), "m3-money-op"], [rs(a * (n - 1)), "m3-money-op"]]);
  },
  "abstract|apply": (rng) => {
    const have = 100 * int(rng, 5, 20) * 100, a = int(rng, 100, 400) * 100 + 50, b = int(rng, 100, 300) * 100 + 25;
    if (a + b >= have || have - a - b === a || have - a - b === b) throw new Error("too much");
    return MO.mc("abstract", "apply", "two-step problem", rng, { have, a, b }, `Riya has ${rs(have)}. She buys a toy for ${rs(a)} and a book for ${rs(b)}. How much is left?`, null, rs(have - a - b), [[rs(have - a), "m3-op"], [rs(a + b), "m3-op"], [rs(have - a + b), "m3-op"]]);
  },
  "abstract|analyze": (rng) => {
    const n = int(rng, 4, 9), price = int(rng, 25, 120);
    return MO.mc("abstract", "analyze", "unit price", rng, { n, price }, `${n} pens cost ₹${n * price}. What does one pen cost?`, null, `₹${price}`, [[`₹${n * price - n}`, "m3-op"], [`₹${price + n}`, "m3-money-op"], [`₹${price * 2}`, "m3-money-op"]]);
  },
  "abstract|evaluate": (rng) => {
    const paid = pick(rng, [500, 1000, 2000]) * 100, cost = int(rng, 100, paid / 100 - 20) * 100 + 5 * int(rng, 1, 19);
    return MO.mc("abstract", "evaluate", "change", rng, { paid, cost }, `A bill comes to ${rs(cost)}. You pay ${rs(paid)}. How much change do you get?`, null, rs(paid - cost), [[rs(paid - cost + 100), "m3-op"], [rs(paid + cost), "m3-op"], [rs(paid - cost - 10 > 0 ? paid - cost - 10 : paid - cost + 10), "m3-money-op"]]);
  },
});

// ---------------- Chapter 13: Data Handling ----------------
const DH = kit("dh4", "g4-data");
const SPORTS = ["Cricket", "Football", "Tennis", "Hockey"];
export const DATA_G4: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const n = 5 * int(rng, 2, 18);
    return DH.shade("remember", "drawing a bar", rng, { n }, `Each square on the bar graph stands for 5 children. Shade the bar for ${n} children.`, 2, 9, n / 5, "1 square = 5 children", [[Math.min(18, n), "m3-key"], [n / 5 + 1, "m3-key"]]);
  },
  "concrete|understand": (rng) => {
    const total = 4 * int(rng, 3, 4);
    return DH.shade("understand", "pie chart", rng, { total }, `${total} children were asked. Half like cricket. Shade one square for each child who likes cricket.`, 2, 9, total / 2, "1 square = 1 child", [[total / 4, "m4-pie"], [Math.min(18, total), "m4-pie"]]);
  },
  "concrete|apply": (rng) => {
    const v = SPORTS.map(() => 10 * int(rng, 2, 12));
    if (new Set(v).size < 4) throw new Error("tie");
    const order = SPORTS.map((s, i) => [s, v[i]] as [string, number]).sort((a, b) => b[1] - a[1]).map(([s]) => s);
    return DH.order("apply", "ordering data", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `Votes: ${SPORTS.map((s, i) => `${s} ${v[i]}`).join(", ")}. Put the sports from most to fewest votes.`, order.join(" | "), [], [[[...order].reverse().join(" "), "m3-graph"]]);
  },
  "concrete|analyze": (rng) => {
    const v = SPORTS.map(() => 10 * int(rng, 2, 12));
    if (new Set(v).size < 4) throw new Error("tie");
    const max = SPORTS[v.indexOf(Math.max(...v))], min = SPORTS[v.indexOf(Math.min(...v))];
    return DH.tap("analyze", "reading data", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `${SPORTS.map((s, i) => `${s}: ${v[i]}`).join("; ")}. Tap the most popular sport.`, SPORTS.join("   "), max, [{ phrase: min, mistake: "m3-graph" }]);
  },
  "concrete|evaluate": (rng) => {
    const k = 10, h = int(rng, 3, 9);
    return DH.tap("evaluate", "reading the scale", rng, { h }, "One number in this working is wrong. Tap it.", `Each square = ${k} votes. A bar ${h} squares tall = ${h + k} votes`, String(h + k));
  },
  "pictorial|remember": (rng) => {
    const v = [int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9)].map((x) => x * 10);
    const names = ["Mon", "Tue", "Wed"];
    const i = int(rng, 0, 2);
    return DH.mc("pictorial", "remember", "reading a bar graph", rng, { a: v[0], b: v[1], c: v[2], i }, `How many books were sold on ${names[i]}?`, card(names.map((n, k) => `${n}: ${"█".repeat(v[k] / 10)}`), "Books sold (each █ = 10)"), String(v[i]), [[String(v[i] / 10), "m3-key"], [String(v[i] + 10), "m3-key"], [String(v.reduce((x, y) => x + y, 0)), "m3-graph"]]);
  },
  "pictorial|understand": (rng) => {
    const total = 4 * int(rng, 5, 25);
    return DH.mc("pictorial", "understand", "pie chart: a half", rng, { total }, `${total} children were asked about fruit. How many chose mango?`, { kind: "figure", figure: "pie", slices: [{ value: 2, label: "Mango" }, { value: 1, label: "Apple" }, { value: 1, label: "Banana" }] }, String(total / 2), [[String(total / 4), "m4-pie"], [String(total / 3 % 1 === 0 ? total / 3 : total / 2 + 2), "m4-pie"], [String(total), "m4-pie"]]);
  },
  "pictorial|apply": (rng) => {
    const total = 4 * int(rng, 5, 25);
    return DH.mc("pictorial", "apply", "pie chart: a quarter", rng, { total }, `${total} children chose a colour. How many chose blue?`, { kind: "figure", figure: "pie", slices: [{ value: 2, label: "Red" }, { value: 1, label: "Blue" }, { value: 1, label: "Green" }] }, String(total / 4), [[String(total / 2), "m4-pie"], [String(total - total / 4), "m4-pie"], [String(total / 4 + 1), "m4-pie"]]);
  },
  "pictorial|analyze": (rng) => {
    const v = [int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9)].map((x) => x * 10);
    if (new Set(v).size < 3) throw new Error("tie");
    const names = ["Class A", "Class B", "Class C"];
    const mx = Math.max(...v), mn = Math.min(...v);
    return DH.mc("pictorial", "analyze", "comparing bars", rng, { a: v[0], b: v[1], c: v[2] }, "How many more trees did the top class plant than the bottom class?", card(names.map((n, k) => `${n}: ${"█".repeat(v[k] / 10)}`), "Trees planted (each █ = 10)"), String(mx - mn), [[String((mx - mn) / 10), "m3-key"], [String(mx + mn), "m3-graph"], [String(mx), "m3-graph"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return DH.mc("pictorial", "evaluate", "judge a conclusion", rng, { r: right ? 1 : 0 }, `Riya says ${right ? "more than half" : "exactly one quarter"} of the children chose cricket. Is she right?`, { kind: "figure", figure: "pie", slices: [{ value: 5, label: "Cricket" }, { value: 2, label: "Football" }, { value: 1, label: "Tennis" }] }, right ? "Yes: the cricket slice is more than half the circle" : "No: the cricket slice is more than half the circle", [
      [right ? "No: the cricket slice is exactly a quarter" : "Yes: each slice is a quarter", "m4-pie"],
      ["No: you can't tell from a pie chart", "m4-pie"],
      ["Yes: the biggest slice is always a quarter", "m4-pie"],
    ]);
  },
  "abstract|remember": bank(DH, "remember", "data words", [
    ["A pie chart shows data as parts of a ___", "circle", ["bar", "table", "line"], "m4-pie"],
    ["In a bar graph, the length of each bar shows ___", "how many or how much", ["the colour", "the name", "the date"], "m3-graph"],
    ["The whole circle of a pie chart stands for ___", "the total", ["one item", "the biggest group", "nothing"], "m4-pie"],
  ]),
  "abstract|understand": (rng) => {
    const total = 4 * int(rng, 5, 30);
    return DH.mc("abstract", "understand", "fractions of a pie", rng, { total }, `In a pie chart of ${total} people, a quarter of the circle is 'Yes'. How many said yes?`, null, String(total / 4), [[String(total / 2), "m4-pie"], [String(total - 4), "m4-pie"], [String(4), "m4-pie"]]);
  },
  "abstract|apply": (rng) => {
    const k = pick(rng, [5, 10, 20]), n = int(rng, 3, 9);
    return DH.mc("abstract", "apply", "scale of a bar graph", rng, { k, n }, `On a bar graph each square is ${k}. How many squares tall is the bar for ${n * k}?`, null, String(n), [[String(n * k), "m3-key"], [String(n + k), "m3-key"], [String(n + 1), "m3-key"]]);
  },
  "abstract|analyze": (rng) => {
    const v = SPORTS.map(() => 10 * int(rng, 2, 12));
    if (new Set(v).size < 4) throw new Error("tie");
    return DH.mc("abstract", "analyze", "totals", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `Votes: ${SPORTS.map((s, i) => `${s} ${v[i]}`).join(", ")}. How many votes in all?`, null, String(v.reduce((x, y) => x + y, 0)), [[String(Math.max(...v)), "m3-graph"], [String(v.reduce((x, y) => x + y, 0) - 10), "m3-graph"], [String(v.length), "m3-graph"]]);
  },
  "abstract|evaluate": (rng) => {
    const v = SPORTS.map(() => 10 * int(rng, 2, 12));
    if (new Set(v).size < 4) throw new Error("tie");
    const min = SPORTS[v.indexOf(Math.min(...v))];
    return DH.mc("abstract", "evaluate", "drawing a conclusion", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `Votes: ${SPORTS.map((s, i) => `${s} ${v[i]}`).join(", ")}. The school will drop the least popular sport. Which?`, null, min, SPORTS.filter((s) => s !== min).map((s) => [s, "m3-graph"] as [string, string]));
  },
});

// ---------------- Chapter 14: Patterns and Symmetry ----------------
const PS = kit("ps4", "g4-patterns");
export const PATTERNS_G4: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const s = int(rng, 2, 20), k = int(rng, 3, 12);
    const seq = [0, 1, 2, 3].map((i) => s + i * k);
    const next = s + 4 * k;
    const line = [next, next + 1, next + k, s + 3 * k + 2].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return PS.tap("remember", "increasing patterns", rng, { s, k }, `${seq.join(", ")}, … Tap the next number.`, line.sort(() => rng() - 0.5).join("   "), String(next), [{ phrase: String(next + k), mistake: "m3-pattern" }]);
  },
  "concrete|understand": (rng) => {
    const n = int(rng, 2, 4);
    return PS.shade("understand", "growing shape patterns", rng, { n }, `A growing pattern uses 1, 3, 5, 7, … squares. Shade the ${n + 4}th step.`, 2, 9, 2 * (n + 4) - 1, "1 square", [[2 * (n + 4) - 3, "m3-pattern"], [n + 4, "m3-pattern"]]);
  },
  "concrete|apply": (rng) => {
    const s = 5 * int(rng, 12, 20), k = 5 * int(rng, 1, 3);
    const seq = [0, 1, 2, 3, 4].map((i) => s - i * k);
    return PS.order("apply", "decreasing patterns", rng, { s, k }, `The rule is 'subtract ${k}', starting at ${s}. Build the pattern.`, seq.join(" | "), [String(s - 4 * k + k * 2)], [[[...seq].reverse().join(" "), "m3-pattern"]]);
  },
  "concrete|analyze": (rng) => {
    const sym = ["A", "H", "M", "T", "U", "V", "W", "X", "Y", "O"], not = ["F", "G", "J", "L", "N", "P", "Q", "R", "S", "Z"];
    const y = pick(rng, sym);
    const n = [...not].sort(() => rng() - 0.5).slice(0, 3);
    return PS.tap("analyze", "symmetric letters", rng, { y: sym.indexOf(y) }, "Tap the letter that has a line of symmetry.", [y, ...n].sort(() => rng() - 0.5).join("   "), y, [{ phrase: n[0], mistake: "m3-symmetry" }]);
  },
  "concrete|evaluate": (rng) => {
    const k = int(rng, 1, 3);
    return PS.tap("evaluate", "tiling", rng, { k }, "One word in this sentence is wrong. Tap it.", "Tiling covers a surface with shapes that leave gaps.", "leave");
  },
  "pictorial|remember": (rng) => {
    const s = int(rng, 2, 30), k = int(rng, 2, 15);
    const seq = [0, 1, 2, 3].map((i) => s + i * k);
    return PS.mc("pictorial", "remember", "the rule", rng, { s, k }, "What is the rule of this pattern?", card([seq.join(",  ") + ",  …"]), `Add ${k}`, [[`Add ${k + 1}`, "m3-pattern"], [`Add ${s}`, "m3-pattern"], [`Multiply by ${k}`, "m3-pattern"]]);
  },
  "pictorial|understand": (rng) => {
    const all: ["square" | "rectangle" | "circle" | "triangle", string, string[]][] = [["square", "4", ["2", "1", "8"]], ["rectangle", "2", ["4", "1", "0"]], ["circle", "Countless (endless)", ["4", "1", "2"]]];
    const i = int(rng, 0, 2);
    return PS.mc("pictorial", "understand", "lines of symmetry", rng, { i }, "How many lines of symmetry does this shape have?", { kind: "shape", shape: all[i][0] }, all[i][1], all[i][2].map((t) => [t, "m3-symmetry"] as [string, string]));
  },
  "pictorial|apply": (rng) => {
    const cols = 8, r = int(rng, 1, 3), left = int(rng, 1, 3);
    const right = cols - left + 1;
    return PS.mc("pictorial", "apply", "completing a symmetric figure", rng, { r, left }, `The line of symmetry runs down the middle of the grid. Column ${left} is coloured. Which column completes the symmetric figure?`, { kind: "grid", rows: 3, cols, cells: [(r - 1) * cols + (left - 1)] }, `Column ${right}`, [[`Column ${left + 4}`, "m4-mirror"], [`Column ${left + 1}`, "m4-mirror"], [`Column ${cols / 2}`, "m4-mirror"]]);
  },
  "pictorial|analyze": (rng) => {
    const words: [string, string][] = [["b", "d"], ["p", "q"], ["d", "b"], ["q", "p"]];
    const i = int(rng, 0, 3);
    return PS.mc("pictorial", "analyze", "mirror images", rng, { i }, "A mirror stands upright to the right of this letter. What does its mirror image look like?", card([`Letter: ${words[i][0]}`]), words[i][1], ["b", "d", "p", "q"].filter((x) => x !== words[i][1]).map((x) => [x, "m4-mirror"] as [string, string]));
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return PS.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: Regular hexagons can tile a floor with no gaps, like a honeycomb." : "Riya: Circles can tile a floor with no gaps."]), right ? "Yes: hexagons fit together exactly" : "No: circles always leave gaps", [
      [right ? "No: circles always leave gaps" : "Yes: hexagons fit together exactly", "m3-symmetry"],
      ["No: no shape can tile", "m3-symmetry"],
      ["Yes: every shape tiles", "m3-symmetry"],
    ]);
  },
  "abstract|remember": bank(PS, "remember", "words", [
    ["Covering a surface with shapes, leaving no gaps or overlaps, is called ___", "tiling", ["symmetry", "a pattern", "a net"], "m3-symmetry"],
    ["A line that divides a figure into two matching halves is a line of ___", "symmetry", ["tiling", "pattern", "chord"], "m3-symmetry"],
    ["A sequence repeated over and over again is a ___", "pattern", ["net", "chord", "tile"], "m3-pattern"],
  ]),
  "abstract|understand": (rng) => {
    const s = int(rng, 60, 150), k = int(rng, 3, 15);
    const seq = [0, 1, 2, 3].map((i) => s - i * k);
    return PS.mc("abstract", "understand", "decreasing patterns", rng, { s, k }, `${seq.join(", ")}, ___`, null, String(s - 4 * k), [[String(s - 4 * k + 1), "m3-pattern"], [String(s - 5 * k), "m3-pattern"], [String(s - 3 * k + k * 2), "m3-pattern"]]);
  },
  "abstract|apply": (rng) => {
    const s = int(rng, 1, 5), m = pick(rng, [2, 3]);
    const seq = [0, 1, 2, 3].map((i) => s * m ** i);
    return PS.mc("abstract", "apply", "multiplying patterns", rng, { s, m }, `${seq.join(", ")}, ___`, null, String(s * m ** 4), [[String(seq[3] + (seq[3] - seq[2])), "m3-pattern"], [String(seq[3] + m), "m3-pattern"], [String(s * m ** 5), "m3-pattern"]]);
  },
  "abstract|analyze": (rng) => {
    const s = int(rng, 1, 20), k = int(rng, 3, 12), n = int(rng, 8, 15);
    return PS.mc("abstract", "analyze", "a later term", rng, { s, k, n }, `A pattern starts at ${s} and adds ${k} each time. What is the ${n}th number?`, null, String(s + (n - 1) * k), [[String(s + n * k), "m3-pattern"], [String(n * k), "m3-pattern"], [String(s + (n - 2) * k), "m3-pattern"]]);
  },
  "abstract|evaluate": bank(PS, "evaluate", "symmetry", [
    ["Which letter has NO line of symmetry?", "R", ["A", "H", "M"], "m3-symmetry"],
    ["How many lines of symmetry does an equilateral triangle have?", "3", ["1", "0", "6"], "m3-symmetry"],
    ["Which shape does NOT tile a floor on its own?", "circle", ["square", "regular hexagon", "equilateral triangle"], "m3-symmetry"],
  ]),
});
