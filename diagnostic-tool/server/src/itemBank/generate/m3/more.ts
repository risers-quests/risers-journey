import { Template, int, pick } from "../core.js";
import { Misconceptions, card, kit, safe } from "../m7/kit.js";

/**
 * Grade 3 Maths (CPA Maths 3), Chapters 5–11: Fractions, Shapes,
 * Measurement, Time, Money, Data Handling, Patterns and Symmetry.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "m3-frac-parts": { label: "Mixes up numerator and denominator", detail: "Writes 4/3 for 3 out of 4, or calls the bottom number the numerator.", childTip: "The denominator (bottom) is how many equal parts in all. The numerator (top) is how many parts we take." },
  "m3-frac-rest": { label: "Counts the parts not shaded", detail: "Names the unshaded part instead of the shaded part.", childTip: "Count the shaded parts for the top number, and all the equal parts for the bottom number." },
  "m3-frac-size": { label: "Thinks a bigger denominator means a bigger fraction", detail: "Thinks 1/4 is more than 1/2.", childTip: "The more equal parts a whole is cut into, the smaller each part: 1/2 > 1/3 > 1/4." },
  "m3-shape-name": { label: "Mixes up shape names", detail: "Confuses square and rectangle, cube and cuboid, cone and cylinder.", childTip: "Square: 4 equal sides. Rectangle: opposite sides equal. Cube: all faces squares. Cylinder: 2 flat circles and a curved face." },
  "m3-line-ray": { label: "Mixes up line, line segment and ray", detail: "Thinks a line segment goes on forever, or a ray has two end points.", childTip: "Line segment: 2 end points. Ray: 1 end point, goes on forever one way. Line: no end points, goes on both ways." },
  "m3-shape-count": { label: "Miscounts sides, corners, faces or edges", detail: "Counts a side twice or misses hidden faces.", childTip: "Touch each side or corner once as you count. A cube has 6 faces, 12 edges and 8 corners." },
  "m3-map": { label: "Reads a map wrongly", detail: "Mixes up left and right, or counts squares wrongly.", childTip: "Put your finger on the start and move one square at a time." },
  "m3-convert": { label: "Converts units wrongly", detail: "Uses 10 or 100 in place of 1000, or divides when it should multiply.", childTip: "1 m = 100 cm. 1 km = 1000 m. 1 kg = 1000 g. 1 L = 1000 mL. Big unit to small unit: multiply." },
  "m3-units": { label: "Adds or subtracts measures wrongly", detail: "Adds different units without changing them, or forgets to regroup (100 cm = 1 m).", childTip: "Change to the same unit first, then add or subtract. Regroup 100 cm as 1 m, 1000 g as 1 kg." },
  "m3-volume": { label: "Thinks a taller container holds more", detail: "Judges capacity by height alone.", childTip: "Pouring water into a different container doesn't change how much there is." },
  "m3-clock": { label: "Reads the clock wrongly", detail: "Reads the minute hand as the number it points to, or mixes up the hands.", childTip: "The short hand shows the hour. The long hand shows minutes: count in 5s, so 3 means 15 minutes." },
  "m3-calendar": { label: "Mixes up days, weeks, months and years", detail: "Uses 30 days in every month, or 10 months in a year.", childTip: "7 days in a week, 12 months in a year, 365 days in a year (366 in a leap year). Count the days on a calendar." },
  "m3-chrono": { label: "Puts events in the wrong time order", detail: "Mixes up what happens first.", childTip: "Ask what happens first, then next, then last." },
  "m3-paise": { label: "Converts rupees and paise wrongly", detail: "Uses 10 paise or 1000 paise in a rupee.", childTip: "₹1 = 100 paise. ₹4.50 = 450 paise." },
  "m3-money-op": { label: "Calculates with money wrongly", detail: "Adds rupees and paise wrongly, or uses the wrong operation in a bill.", childTip: "Line up the decimal points: rupees under rupees, paise under paise. For a bill, multiply each price by how many, then add." },
  "m3-key": { label: "Ignores the key of a pictograph", detail: "Counts symbols instead of using what each symbol stands for.", childTip: "Read the key first: if each 🍎 = 2, then 3 🍎 means 6." },
  "m3-tally": { label: "Reads tally marks wrongly", detail: "Counts a bundle of tallies as 4, or as 1.", childTip: "A bundle of 4 lines crossed by a fifth is 5." },
  "m3-graph": { label: "Draws the wrong conclusion from a graph", detail: "Picks the tallest picture row without comparing, or reads the wrong row.", childTip: "Compare the numbers, not just the pictures. Most is the biggest number." },
  "m3-pattern": { label: "Can't find the rule of a pattern", detail: "Continues a pattern with the wrong step.", childTip: "Find what changes each time (add 5? every third letter?), then do the same again." },
  "m3-symmetry": { label: "Misjudges symmetry or tiling", detail: "Thinks any line through a shape is a line of symmetry, or that circles tile.", childTip: "A line of symmetry folds a shape into two matching halves. Shapes tile when they fit together with no gaps or overlaps." },
};

const FRAC_WORD: Record<string, string> = { "1/2": "one-half", "1/3": "one-third", "1/4": "one-quarter", "2/3": "two-thirds", "3/4": "three-quarters" };

// ---------------- Chapter 5: Fractions ----------------
const FR = kit("fr3", "g3-fractions");
export const FRACTIONS_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const d = pick(rng, [2, 3, 4]);
    return FR.shade("remember", "one-half, one-third, one-quarter", rng, { d }, `The strip has ${d} equal parts. Shade ${FRAC_WORD[`1/${d}`]} of it.`, 1, d, 1, "1 square = 1 part", [[d - 1, "m3-frac-rest"], [d, "m3-frac-parts"]]);
  },
  "concrete|understand": (rng) => {
    const d = int(rng, 3, 8), n = int(rng, 1, d - 1);
    if (n === d - n) throw new Error("half");
    return FR.shade("understand", "shading a fraction", rng, { n, d }, `The strip has ${d} equal parts. Shade ${n}/${d} of it.`, 1, d, n, "1 square = 1 part", [[d - n, "m3-frac-rest"]]);
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 1, 3);
    return FR.order("apply", "comparing unit fractions", rng, { k }, "Put the fractions in order, biggest first.", "1/2 | 1/3 | 1/4", [], [["1/4 1/3 1/2", "m3-frac-size"]]);
  },
  "concrete|analyze": (rng) => {
    const d = pick(rng, [2, 3, 4]);
    const words = ["one-half", "one-third", "one-quarter"];
    return FR.tap("analyze", "fraction names", rng, { d }, `Tap the name of 1/${d}.`, words.join("   "), FRAC_WORD[`1/${d}`], words.filter((w) => w !== FRAC_WORD[`1/${d}`]).map((w) => ({ phrase: w, mistake: "m3-frac-size" })));
  },
  "concrete|evaluate": (rng) => {
    const d = int(rng, 3, 9), n = int(rng, 1, d - 1);
    return FR.tap("evaluate", "numerator and denominator", rng, { n, d }, "One word in this sentence is wrong. Tap it.", `In ${n}/${d}, the number ${d} is the numerator.`, "numerator.");
  },
  "pictorial|remember": (rng) => {
    const d = int(rng, 2, 8), n = int(rng, 1, d - 1);
    if (n === d - n) throw new Error("half");
    return FR.mc("pictorial", "remember", "naming a shaded fraction", rng, { n, d }, "What fraction of the pie is shaded?", { kind: "pie", pies: [{ slices: d, shaded: n }] }, `${n}/${d}`, [[`${d}/${n}`, "m3-frac-parts"], [`${d - n}/${d}`, "m3-frac-rest"], [`${n}/${d - n}`, "m3-frac-rest"]]);
  },
  "pictorial|understand": (rng) => {
    const d = int(rng, 3, 8), n = int(rng, 1, d - 1);
    if (n === d - n) throw new Error("half");
    return FR.mc("pictorial", "understand", "the part not shaded", rng, { n, d }, "What fraction of the pie is NOT shaded?", { kind: "pie", pies: [{ slices: d, shaded: n }] }, `${d - n}/${d}`, [[`${n}/${d}`, "m3-frac-rest"], [`${d}/${d - n}`, "m3-frac-parts"], [`${d - n}/${n}`, "m3-frac-parts"]]);
  },
  "pictorial|apply": (rng) => {
    const d = pick(rng, [2, 3, 4]);
    return FR.mc("pictorial", "apply", "fraction words", rng, { d }, "What part of the bar is shaded? Say it in words.", { kind: "bar-model", totalLabel: "1 whole", parts: d, highlightParts: 1 }, FRAC_WORD[`1/${d}`], ["one-half", "one-third", "one-quarter", "one-fifth"].filter((w) => w !== FRAC_WORD[`1/${d}`]).map((w) => [w, "m3-frac-size"] as [string, string]));
  },
  "pictorial|analyze": (rng) => {
    const d = pick(rng, [3, 4]), n = d - 1;
    return FR.mc("pictorial", "analyze", "more than one part", rng, { d }, "What fraction of the grid is shaded?", { kind: "grid", rows: 1, cols: d, shadedCells: n, compact: true }, `${n}/${d}`, [[`1/${d}`, "m3-frac-parts"], [`${d}/${n}`, "m3-frac-parts"], [`1/${n}`, "m3-frac-rest"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return FR.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: 1/2 of a pizza is more than 1/4 of the same pizza." : "Riya: 1/4 of a pizza is more than 1/2, because 4 is bigger than 2."]), right ? "Yes: halves are bigger pieces than quarters" : "No: cutting into more parts makes each part smaller", [
      [right ? "No: cutting into more parts makes each part smaller" : "Yes: halves are bigger pieces than quarters", "m3-frac-size"],
      ["Yes: the bigger the bottom number, the bigger the fraction", "m3-frac-size"],
      ["No: they are always the same", "m3-frac-size"],
    ]);
  },
  "abstract|remember": (rng) => {
    const d = int(rng, 3, 12), n = int(rng, 1, d - 1);
    return FR.mc("abstract", "remember", "the denominator", rng, { n, d }, `In ${n}/${d}, the denominator is ___`, null, String(d), [[String(n), "m3-frac-parts"], [String(n + d), "m3-frac-parts"], [String(d - n === n || d - n === d ? 1 : d - n), "m3-frac-rest"]]);
  },
  "abstract|understand": (rng) => {
    const d = int(rng, 3, 12), n = int(rng, 1, d - 1);
    return FR.mc("abstract", "understand", "the numerator", rng, { n, d }, `In ${n}/${d}, the numerator is ___`, null, String(n), [[String(d), "m3-frac-parts"], [String(d - n === n ? n + d : d - n), "m3-frac-rest"], [String(n + d), "m3-frac-parts"]]);
  },
  "abstract|apply": (rng) => {
    const d = int(rng, 3, 12), n = int(rng, 1, d - 1);
    if (n === d - n) throw new Error("half");
    return FR.mc("abstract", "apply", "writing a fraction", rng, { n, d }, `A cake is cut into ${d} equal pieces. ${n} pieces are eaten. What fraction is eaten?`, null, `${n}/${d}`, [[`${d}/${n}`, "m3-frac-parts"], [`${d - n}/${d}`, "m3-frac-rest"], [`${n}/${d - n}`, "m3-frac-rest"]]);
  },
  "abstract|analyze": (rng) => {
    const pairs: [string, string][] = [["1/2", "1/3"], ["1/3", "1/4"], ["1/2", "1/4"]];
    const i = int(rng, 0, 2);
    const [big, small] = pairs[i];
    return FR.mc("abstract", "analyze", "comparing unit fractions", rng, { i }, `Which is bigger: ${small} or ${big}?`, null, big === "1/2" ? `${big}, one-half` : `${big}, ${FRAC_WORD[big]}`, [[`${small}, ${FRAC_WORD[small]}`, "m3-frac-size"], ["They are equal", "m3-frac-size"], ["You can't tell", "m3-frac-size"]]);
  },
  "abstract|evaluate": (rng) => {
    const d = pick(rng, [2, 4]);
    const words = d === 2 ? "1 out of 2 equal parts" : "1 out of 4 equal parts";
    return FR.mc("abstract", "evaluate", "equal parts", rng, { d }, `A roti is broken into ${d} pieces of different sizes. Is each piece ${FRAC_WORD[`1/${d}`]}?`, null, `No: a fraction needs ${words}`, [[`Yes: there are ${d} pieces`, "m3-frac-parts"], ["Yes: any piece is a fraction", "m3-frac-parts"], ["No: fractions are only for pizzas", "m3-frac-parts"]]);
  },
});

// ---------------- Chapter 6: Shapes ----------------
const SH = kit("sh3", "g3-shapes");
type Q = [string, string, string[], string];
const qmc = (K: ReturnType<typeof kit>, cpa: "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", sub: string, bank: Q[]): Template => (rng) => {
  const i = int(rng, 0, bank.length - 1);
  const [q, a, w, m] = bank[i];
  return K.mc(cpa, bloom, sub, rng, { i }, q, null, a, w.map((t) => [t, m] as [string, string]));
};
const SOLIDS: [string, "cube" | "cuboid" | "cylinder" | "square-pyramid", number, number, number][] = [["Cube", "cube", 6, 12, 8], ["Cuboid", "cuboid", 6, 12, 8], ["Cylinder", "cylinder", 3, 2, 0]];
export const SHAPES_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const qs: [string, string][] = [["Tap the solid that can only roll and has no flat face.", "sphere"], ["Tap the solid with one flat circle and one point.", "cone"], ["Tap the solid with two flat circles and a curved face.", "cylinder"], ["Tap the solid whose six faces are all squares.", "cube"]];
    const i = int(rng, 0, 3);
    const line = ["cube", "cuboid", "sphere", "cylinder", "cone"].sort(() => rng() - 0.5).join("   ");
    const other = i === 3 ? "cuboid" : i === 1 ? "cylinder" : "cone";
    return SH.tap("remember", "solid shapes", rng, { i }, qs[i][0], line, qs[i][1], [{ phrase: other, mistake: "m3-shape-name" }]);
  },
  "concrete|understand": (rng) => {
    const qs: [string, string, string][] = [["Tap the one that has two end points.", "segment", "ray"], ["Tap the one that has one end point and goes on forever one way.", "ray", "line"], ["Tap the one that has no end points.", "line", "segment"]];
    const i = int(rng, 0, 2);
    return SH.tap("understand", "line, line segment and ray", rng, { i }, qs[i][0], "point   line   segment   ray", qs[i][1], [{ phrase: qs[i][2], mistake: "m3-line-ray" }]);
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 1, 3);
    return SH.order("apply", "sides of plane shapes", rng, { k }, "Put the shapes in order of how many sides they have, fewest first.", "triangle | square | pentagon | hexagon", [], [["square triangle pentagon hexagon", "m3-shape-count"]]);
  },
  "concrete|analyze": (rng) => {
    const l = int(rng, 3, 8), b = int(rng, 2, 6);
    if (l === b) throw new Error("square");
    return SH.shade("analyze", "making shapes on a grid", rng, { l, b }, `Shade a rectangle ${l} squares long and ${b} squares wide.`, 8, 9, l * b, "1 square", [[2 * (l + b), "m3-shape-count"], [l + b, "m3-shape-count"]]);
  },
  "concrete|evaluate": (rng) => {
    const bank: [string, string][] = [["A triangle has four sides and three corners.", "four"], ["A square has four equal sides and five corners.", "five"], ["A circle has one straight side.", "straight"], ["A cone has two flat faces.", "two"]];
    const i = int(rng, 0, bank.length - 1);
    return SH.tap("evaluate", "check a fact", rng, { i }, "One word in this sentence is wrong. Tap it.", bank[i][0], bank[i][1]);
  },
  "pictorial|remember": (rng) => {
    const all: ["triangle" | "rectangle" | "square" | "circle", string][] = [["triangle", "Triangle"], ["rectangle", "Rectangle"], ["square", "Square"], ["circle", "Circle"]];
    const i = int(rng, 0, 3);
    return SH.mc("pictorial", "remember", "plane shapes", rng, { i }, "What is this shape called?", { kind: "shape", shape: all[i][0] }, all[i][1], [...all.filter((_, k) => k !== i).map(([, n]) => [n, "m3-shape-name"] as [string, string])]);
  },
  "pictorial|understand": (rng) => {
    const i = int(rng, 0, 2);
    const [n, solid] = SOLIDS[i];
    return SH.mc("pictorial", "understand", "solid shapes", rng, { i }, "What is this solid called?", { kind: "figure", figure: "solid", solid }, n, ["Cube", "Cuboid", "Cylinder", "Cone", "Sphere"].filter((x) => x !== n).map((x) => [x, "m3-shape-name"] as [string, string]));
  },
  "pictorial|apply": (rng) => {
    const i = int(rng, 0, 1);
    const [n, solid, f, e, v] = SOLIDS[i];
    const ask = int(rng, 0, 2);
    const what = ["faces", "edges", "corners"][ask];
    const right = [f, e, v][ask];
    return SH.mc("pictorial", "apply", "faces, edges and corners", rng, { i, ask }, `How many ${what} does this ${n.toLowerCase()} have?`, { kind: "figure", figure: "solid", solid }, String(right), [[String(right === 6 ? 4 : right - 4 || 3), "m3-shape-count"], [String(right === 12 ? 8 : right + 4), "m3-shape-count"], [String(right + 2), "m3-shape-count"], [String(right - 2), "m3-shape-count"]]);
  },
  "pictorial|analyze": (rng) => {
    const places = ["Park", "School", "Shop", "Bank"];
    const r = 2, c1 = int(rng, 1, 2), gap = int(rng, 2, 3);
    const c2 = c1 + gap;
    const a = int(rng, 0, 3);
    let b = int(rng, 0, 3);
    if (b === a) b = (a + 1) % 4;
    return SH.mc("pictorial", "analyze", "reading a simple map", rng, { c1, gap, a, b }, `On the map, how many squares is the ${places[b]} to the right of the ${places[a]}?`, { kind: "grid", rows: 3, cols: 6, markers: [{ row: r, col: c1, label: places[a] }, { row: r, col: c2, label: places[b] }] }, `${gap} squares`, [[`${gap + 1} squares`, "m3-map"], [`${gap - 1} squares`, "m3-map"], [`${c2} squares`, "m3-map"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return SH.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: Every square is also a rectangle." : "Riya: A cuboid has 6 faces that are all squares."]), right ? "Yes: a square has opposite sides equal, like a rectangle" : "No: a cuboid's faces are rectangles; a cube's are squares", [
      [right ? "No: a cuboid's faces are rectangles; a cube's are squares" : "Yes: a square has opposite sides equal, like a rectangle", "m3-shape-name"],
      ["No: squares and rectangles are never alike", "m3-shape-name"],
      ["Yes: a cuboid and a cube are the same", "m3-shape-name"],
    ]);
  },
  "abstract|remember": qmc(SH, "abstract", "remember", "line, line segment and ray", [
    ["A line segment has ___ end points.", "two", ["one", "no", "three"], "m3-line-ray"],
    ["A ray has ___ end point.", "one", ["two", "no", "three"], "m3-line-ray"],
    ["A line has ___ end points.", "no", ["one", "two", "four"], "m3-line-ray"],
  ]),
  "abstract|understand": qmc(SH, "abstract", "understand", "plane shapes", [
    ["A shape with 3 sides and 3 corners is a ___", "triangle", ["square", "circle", "rectangle"], "m3-shape-name"],
    ["A shape with 4 equal sides is a ___", "square", ["triangle", "circle", "cone"], "m3-shape-name"],
    ["A round flat shape with no corners is a ___", "circle", ["sphere", "square", "triangle"], "m3-shape-name"],
    ["A rectangle has ___ corners.", "4", ["3", "5", "0"], "m3-shape-count"],
  ]),
  "abstract|apply": qmc(SH, "abstract", "apply", "solid shapes", [
    ["A ball is shaped like a ___", "sphere", ["circle", "cone", "cylinder"], "m3-shape-name"],
    ["A brick is shaped like a ___", "cuboid", ["cube", "cylinder", "rectangle"], "m3-shape-name"],
    ["A birthday cap is shaped like a ___", "cone", ["cylinder", "triangle", "sphere"], "m3-shape-name"],
    ["A tin of paint is shaped like a ___", "cylinder", ["cuboid", "circle", "cone"], "m3-shape-name"],
    ["A dice is shaped like a ___", "cube", ["square", "cuboid", "sphere"], "m3-shape-name"],
  ]),
  "abstract|analyze": qmc(SH, "abstract", "analyze", "faces, edges and corners", [
    ["A cube has ___ faces.", "6", ["4", "8", "12"], "m3-shape-count"],
    ["A cube has ___ edges.", "12", ["6", "8", "4"], "m3-shape-count"],
    ["A cuboid has ___ corners.", "8", ["6", "12", "4"], "m3-shape-count"],
    ["A cylinder has ___ flat faces.", "2", ["1", "3", "0"], "m3-shape-count"],
    ["A cone has ___ flat face.", "1", ["2", "0", "3"], "m3-shape-count"],
  ]),
  "abstract|evaluate": qmc(SH, "abstract", "evaluate", "tangrams", [
    ["A tangram has ___ pieces.", "7", ["5", "4", "10"], "m3-shape-count"],
    ["Most tangram pieces are ___", "triangles", ["circles", "cubes", "cones"], "m3-shape-name"],
    ["Which shape can roll and also stack?", "cylinder", ["sphere", "cube", "cuboid"], "m3-shape-name"],
  ]),
});

// ---------------- Chapter 7: Measurement ----------------
const ME = kit("me3", "g3-measure");
const UNITS: [string, string, number][] = [["m", "cm", 100], ["km", "m", 1000], ["kg", "g", 1000], ["L", "mL", 1000]];
export const MEASURE_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const kg = int(rng, 1, 4);
    return ME.shade("remember", "kilograms and grams", rng, { kg }, `Each square is 100 g. Shade ${kg} kg.`, 5, 9, kg * 10, "1 square = 100 g", [[kg, "m3-convert"], [kg * 100 <= 45 ? kg * 100 : -1, "m3-convert"]]);
  },
  "concrete|understand": (rng) => {
    const m = int(rng, 2, 7), cm = 10 * int(rng, 1, 9);
    return ME.shade("understand", "metres and centimetres", rng, { m, cm }, `Each square is 10 cm. Shade ${m} m ${cm} cm.`, 9, 9, m * 10 + cm / 10, "1 square = 10 cm", [[m + cm / 10, "m3-convert"], [m * 100 + cm <= 81 ? m * 100 + cm : -1, "m3-convert"]]);
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 1, 3);
    return ME.order("apply", "units of length", rng, { k }, "Put the units in order, smallest first.", "mm | cm | m | km", [], [["km m cm mm", "m3-convert"]]);
  },
  "concrete|analyze": (rng) => {
    const [big, small, f] = pick(rng, UNITS);
    const n = int(rng, 2, 9);
    const line = [n * f, n * 10, n * (f === 100 ? 1000 : 100), n + f].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return ME.tap("analyze", "converting units", rng, { n, f }, `Tap how many ${small} make ${n} ${big}.`, line.sort(() => rng() - 0.5).join("   "), String(n * f), [{ phrase: String(n * 10), mistake: "m3-convert" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 2, 6), b = int(rng, 2, 6), x = 10 * int(rng, 6, 9), y = 10 * int(rng, 3, 9);
    const wrongCm = x + y;
    if (wrongCm < 100) throw new Error("no regroup");
    return ME.tap("evaluate", "adding lengths", rng, { a, b, x, y }, "One number in this answer is wrong (it needs regrouping). Tap it.", `${a} m ${x} cm + ${b} m ${y} cm = ${a + b} m ${wrongCm} cm`, String(wrongCm));
  },
  "pictorial|remember": (rng) => {
    const [big, small, f] = pick(rng, UNITS);
    return ME.mc("pictorial", "remember", "standard units", rng, { f }, `How many ${small} make 1 ${big}?`, card([`1 ${big} = ? ${small}`]), String(f), [[String(f === 100 ? 1000 : 100), "m3-convert"], ["10", "m3-convert"], [String(f * 10), "m3-convert"]]);
  },
  "pictorial|understand": (rng) => {
    const a = 100 * int(rng, 2, 9), b = 100 * int(rng, 2, 9);
    return ME.mc("pictorial", "understand", "adding weights", rng, { a, b }, "How heavy are the two bags together?", { kind: "bars", bars: [{ name: "", parts: [{ value: a, label: `${a} g` }, { value: b, label: `${b} g` }] }], brace: { label: "?" } }, a + b >= 1000 ? `${Math.floor((a + b) / 1000)} kg ${(a + b) % 1000} g` : `${a + b} g`, [[`${a + b} kg`, "m3-units"], [`${Math.abs(a - b) || 100} g`, "m3-units"], [`${(a + b) / 100} kg`, "m3-convert"]]);
  },
  "pictorial|apply": (rng) => {
    const total = int(rng, 3, 9), used = 100 * int(rng, 2, 8);
    return ME.mc("pictorial", "apply", "subtracting capacity", rng, { total, used }, "How much juice is left?", card([`A jug has ${total} L of juice.`, `Riya pours out ${used} mL.`]), `${total - 1} L ${1000 - used} mL`, [[`${total} L ${used} mL`, "m3-units"], [`${total - 1} L ${used} mL`, "m3-units"], [`${total * 100 - used} mL`, "m3-convert"]]);
  },
  "pictorial|analyze": (rng) => {
    const L = int(rng, 1, 3);
    return ME.mc("pictorial", "analyze", "conservation of volume", rng, { L }, "Which container has more water now?", card([`${L} L of water is poured from a short, wide bowl into a tall, thin bottle.`]), "Both have the same amount", [["The tall bottle", "m3-volume"], ["The wide bowl", "m3-volume"], ["You can't tell any more", "m3-volume"]]);
  },
  "pictorial|evaluate": (rng) => {
    const n = int(rng, 2, 9);
    const right = rng() < 0.5;
    return ME.mc("pictorial", "evaluate", "judge a claim", rng, { n, r: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ${n} km = ${n * 1000} m` : `Riya: ${n} kg = ${n * 100} g`]), right ? "Yes: 1 km = 1000 m" : "No: 1 kg = 1000 g", [
      [right ? "No: 1 kg = 1000 g" : "Yes: 1 km = 1000 m", "m3-convert"],
      ["No: 1 km = 100 m", "m3-convert"],
      ["Yes: 1 kg = 100 g", "m3-convert"],
    ]);
  },
  "abstract|remember": qmc(ME, "abstract", "remember", "choosing a unit", [
    ["The length of a pencil is best measured in ___", "cm", ["km", "kg", "L"], "m3-convert"],
    ["The distance between two cities is best measured in ___", "km", ["cm", "mm", "g"], "m3-convert"],
    ["The weight of a watermelon is best measured in ___", "kg", ["L", "km", "mL"], "m3-convert"],
    ["The water in a bucket is best measured in ___", "L", ["kg", "m", "cm"], "m3-convert"],
  ]),
  "abstract|understand": (rng) => {
    const m = int(rng, 2, 9), cm = int(rng, 5, 95);
    if (cm % 10 === 0) throw new Error("round");
    return ME.mc("abstract", "understand", "converting lengths", rng, { m, cm }, `${m} m ${cm} cm = ___ cm`, null, String(m * 100 + cm), [[String(m * 10 + cm), "m3-convert"], [String(m + cm), "m3-convert"], [String(m * 1000 + cm), "m3-convert"]]);
  },
  "abstract|apply": (rng) => {
    const a = int(rng, 2, 9), b = int(rng, 1, 5), x = 50 * int(rng, 4, 18), y = 50 * int(rng, 4, 18);
    const sum = a * 1000 + x + b * 1000 + y;
    return ME.mc("abstract", "apply", "adding kg and g", rng, { a, b, x, y }, `${a} kg ${x} g + ${b} kg ${y} g = ___`, null, `${Math.floor(sum / 1000)} kg ${sum % 1000} g`, [[`${a + b} kg ${x + y} g`, "m3-units"], [`${a + b + 1} kg ${x + y} g`, "m3-units"], [`${a + b} kg ${Math.abs(x - y) || 50} g`, "m3-units"]]);
  },
  "abstract|analyze": (rng) => {
    const total = int(rng, 4, 9), part = int(rng, 1, total - 2), cm = 10 * int(rng, 1, 9);
    const left = total * 100 - part * 100 - cm;
    return ME.mc("abstract", "analyze", "subtracting lengths", rng, { total, part, cm }, `A ribbon is ${total} m long. ${part} m ${cm} cm is cut off. How much is left?`, null, `${Math.floor(left / 100)} m ${left % 100} cm`, [[`${total - part} m ${cm} cm`, "m3-units"], [`${total - part} m ${100 - cm} cm`, "m3-units"], [`${total + part} m ${cm} cm`, "m3-units"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 2, 4), b = 100 * int(rng, 21, 39);
    if (a * 1000 === b) throw new Error("equal");
    const big = a * 1000 > b ? `${a} kg` : `${b} g`;
    return ME.mc("abstract", "evaluate", "comparing measures", rng, { a, b }, `Which is heavier: ${a} kg or ${b} g?`, null, big, [[big === `${a} kg` ? `${b} g` : `${a} kg`, "m3-convert"], ["They weigh the same", "m3-convert"], ["You can't compare kg and g", "m3-convert"]]);
  },
});

// ---------------- Chapter 8: Time ----------------
const TI = kit("ti3", "g3-time");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_IN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const hm = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")}`;
export const TIME_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const k = int(rng, 1, 11);
    return TI.shade("remember", "minutes in 5s", rng, { k }, `The minute hand points to ${k}. Each square is 5 minutes: shade how many minutes past the hour.`, 2, 6, k, "1 square = 5 minutes", [[k <= 12 ? Math.min(12, k + 1) : 1, "m3-clock"]]);
  },
  "concrete|understand": (rng) => {
    const s = int(rng, 0, 5);
    const order = MONTHS.slice(s, s + 4);
    return TI.order("understand", "months of the year", rng, { s }, "Put the months in order.", order.join(" | "), [], [[[order[1], order[0], order[2], order[3]].join(" "), "m3-calendar"]]);
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 1, 3);
    const ev = ["Wake up", "Brush teeth", "Go to school", "Eat lunch", "Go to bed"];
    return TI.order("apply", "chronological order", rng, { k }, "Put Riya's day in order.", ev.join(" | "), [], [[["Brush teeth", "Wake up", "Go to school", "Eat lunch", "Go to bed"].join(" "), "m3-chrono"]]);
  },
  "concrete|analyze": (rng) => {
    const m = int(rng, 0, 11);
    const line = ["28", "30", "31", "29"].join("   ");
    const right = m === 1 ? "28" : String(DAYS_IN[m]);
    return TI.tap("analyze", "days in a month", rng, { m }, `Tap how many days ${MONTHS[m]} has (not a leap year).`, line, right, [{ phrase: right === "31" ? "30" : "31", mistake: "m3-calendar" }]);
  },
  "concrete|evaluate": (rng) => {
    const bank: [string, string][] = [["A week has 7 days and a year has 10 months.", "10"], ["There are 60 minutes in an hour and 30 hours in a day.", "30"], ["A year has 12 months and 360 days.", "360"]];
    const i = int(rng, 0, bank.length - 1);
    return TI.tap("evaluate", "check a fact", rng, { i }, "One number here is wrong. Tap it.", bank[i][0], bank[i][1]);
  },
  "pictorial|remember": (rng) => {
    const h = int(rng, 1, 12), k = int(rng, 1, 11);
    return TI.mc("pictorial", "remember", "time to 5 minutes", rng, { h, k }, "What time is it?", card([`The hour hand is just past ${h}.`, `The minute hand points to ${k}.`], "A clock"), hm(h, 5 * k), [[hm(h, k), "m3-clock"], [hm(k, 5 * h <= 55 ? 5 * h : 0), "m3-clock"], [hm(h === 12 ? 1 : h + 1, 5 * k), "m3-clock"]]);
  },
  "pictorial|understand": (rng) => {
    const h = int(rng, 1, 11), k = int(rng, 1, 11);
    return TI.mc("pictorial", "understand", "time to 5 minutes", rng, { h, k }, "Where does the minute hand point?", card([`The time is ${hm(h, 5 * k)}.`]), `At ${k}`, [[`At ${h}`, "m3-clock"], [`At ${(k + 6) % 12 || 12}`, "m3-clock"], [`At ${(k + 1) % 12 || 12}`, "m3-clock"], [`At ${(k + 3) % 12 || 12}`, "m3-clock"]]);
  },
  "pictorial|apply": (rng) => {
    const start = int(rng, 0, 6), n = int(rng, 2, 12);
    if (n % 7 === 0) throw new Error("same day");
    return TI.mc("pictorial", "apply", "reading a calendar", rng, { start, n }, `The 1st of this month is a ${DAYS[start]}. What day is the ${n + 1}th?`, card([`1st: ${DAYS[start]}`]), DAYS[(start + n) % 7], [[DAYS[(start + n + 1) % 7], "m3-calendar"], [DAYS[(start + n + 6) % 7], "m3-calendar"], [DAYS[(start + n + 3) % 7], "m3-calendar"]]);
  },
  "pictorial|analyze": (rng) => {
    const h = int(rng, 1, 9), m1 = 5 * int(rng, 0, 6), d = 5 * int(rng, 3, 10);
    const end = h * 60 + m1 + d;
    return TI.mc("pictorial", "analyze", "how long", rng, { h, m1, d }, "How long was the match?", card([`Started: ${hm(h, m1)}`, `Ended: ${hm(Math.floor(end / 60), end % 60)}`]), `${d} minutes`, [[`${d + 5} minutes`, "m3-clock"], [`${d - 5} minutes`, "m3-clock"], [`${d + 40} minutes`, "m3-clock"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return TI.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: There are 52 weeks in a year." : "Riya: Every month has 30 days."]), right ? "Yes: 52 weeks and 1 or 2 days" : "No: months have 28, 29, 30 or 31 days", [
      [right ? "No: months have 28, 29, 30 or 31 days" : "Yes: 52 weeks and 1 or 2 days", "m3-calendar"],
      ["No: there are 12 weeks in a year", "m3-calendar"],
      ["Yes: every month is the same length", "m3-calendar"],
    ]);
  },
  "abstract|remember": qmc(TI, "abstract", "remember", "days, weeks, months and years", [
    ["1 week = ___ days", "7", ["5", "10", "30"], "m3-calendar"],
    ["1 year = ___ months", "12", ["10", "52", "365"], "m3-calendar"],
    ["1 hour = ___ minutes", "60", ["100", "30", "24"], "m3-clock"],
    ["1 day = ___ hours", "24", ["12", "60", "7"], "m3-clock"],
  ]),
  "abstract|understand": (rng) => {
    const d = int(rng, 0, 6), n = int(rng, 2, 5);
    return TI.mc("abstract", "understand", "days of the week", rng, { d, n }, `Today is ${DAYS[d]}. What day will it be in ${n} days?`, null, DAYS[(d + n) % 7], [[DAYS[(d + n + 1) % 7], "m3-calendar"], [DAYS[(d + 7 - n) % 7], "m3-calendar"], [DAYS[(d + n + 6) % 7], "m3-calendar"]]);
  },
  "abstract|apply": (rng) => {
    const w = int(rng, 2, 9), extra = int(rng, 1, 6);
    return TI.mc("abstract", "apply", "weeks and days", rng, { w, extra }, `${w} weeks ${extra} days = ___ days`, null, String(w * 7 + extra), [[String(w * 10 + extra), "m3-calendar"], [String(w + extra), "m3-calendar"], [String(w * 5 + extra), "m3-calendar"]]);
  },
  "abstract|analyze": (rng) => {
    const m = int(rng, 0, 11);
    return TI.mc("abstract", "analyze", "months", rng, { m }, `Which month comes just after ${MONTHS[m]}?`, null, MONTHS[(m + 1) % 12], [[MONTHS[(m + 11) % 12], "m3-calendar"], [MONTHS[(m + 2) % 12], "m3-calendar"], [MONTHS[(m + 6) % 12], "m3-calendar"]]);
  },
  "abstract|evaluate": (rng) => {
    const y = pick(rng, [2024, 2028, 2025, 2026, 2027, 2032]);
    const leap = y % 4 === 0;
    return TI.mc("abstract", "evaluate", "leap years", rng, { y }, `How many days does February have in ${y}?`, null, leap ? "29" : "28", [[leap ? "28" : "29", "m3-calendar"], ["30", "m3-calendar"], ["31", "m3-calendar"]]);
  },
});

// ---------------- Chapter 9: Money ----------------
const MO = kit("mo3", "g3-money");
const rs = (p: number) => `₹${Math.floor(p / 100)}.${String(p % 100).padStart(2, "0")}`;
export const MONEY_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const r = 10 * int(rng, 2, 9);
    return MO.shade("remember", "counting money", rng, { r }, `Each square is a ₹10 note. Shade ₹${r}.`, 2, 9, r / 10, "1 square = ₹10", [[r / 10 + 1, "m3-money-op"], [Math.min(18, r / 5), "m3-money-op"]]);
  },
  "concrete|understand": (rng) => {
    const r = int(rng, 1, 9);
    return MO.shade("understand", "rupees and paise", rng, { r }, `Each square is 50 paise. Shade ₹${r}.`, 2, 9, 2 * r, "1 square = 50 p", [[r, "m3-paise"], [Math.min(18, 2 * r + 2), "m3-paise"]]);
  },
  "concrete|apply": (rng) => {
    const a = int(rng, 10, 90) * 100 + 50, b = int(rng, 10, 60) * 100 + 25;
    return MO.order("apply", "adding money", rng, { a, b }, "Build the addition.", `${rs(a)} | + | ${rs(b)} | = | ${rs(a + b)}`, [rs(a + b + 100)], [[`${rs(a)} + ${rs(b)} = ${rs(a + b + 100)}`, "m3-money-op"]]);
  },
  "concrete|analyze": (rng) => {
    const r = int(rng, 2, 9), p = 5 * int(rng, 2, 19);
    const right = r * 100 + p;
    const line = [right, r * 10 + p, r + p, r * 1000 + p].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return MO.tap("analyze", "rupees to paise", rng, { r, p }, `Tap ${rs(right)} in paise.`, line.sort(() => rng() - 0.5).join("   "), String(right), [{ phrase: String(r * 10 + p), mistake: "m3-paise" }]);
  },
  "concrete|evaluate": (rng) => {
    const price = int(rng, 12, 45), n = int(rng, 3, 6);
    const w = price + n;
    return MO.tap("evaluate", "check a bill", rng, { price, n }, "One amount in this bill is wrong. Tap it.", `${n} pens at ₹${price} each = ₹${w}`, `₹${w}`);
  },
  "pictorial|remember": (rng) => {
    const r = int(rng, 1, 9), p = 5 * int(rng, 1, 19);
    return MO.mc("pictorial", "remember", "writing money in figures", rng, { r, p }, "How do you write this in figures?", card([`${r} rupees ${p} paise`]), rs(r * 100 + p), [[`₹${r}.${p}0`.replace(/(\.\d\d)0$/, "$1") === rs(r * 100 + p) ? `₹${p}.${r}` : `₹${r}.${p}0`, "m3-paise"], [`₹${r}${p}`, "m3-paise"], [`₹${p}.${String(r).padStart(2, "0")}`, "m3-paise"]]);
  },
  "pictorial|understand": (rng) => {
    const notes = int(rng, 2, 9), note = pick(rng, [100, 200, 500]);
    return MO.mc("pictorial", "understand", "counting notes", rng, { notes, note }, "How much money is this?", { kind: "concrete", icon: "💵", itemCount: notes, groups: 1, groupLabel: `₹${note} note`, key: `Each 💵 = ₹${note}` }, `₹${notes * note}`, [[`₹${notes}`, "m3-money-op"], [`₹${notes * 100 === notes * note ? notes * 200 : notes * 100}`, "m3-money-op"], [`₹${notes + note}`, "m3-money-op"]]);
  },
  "pictorial|apply": (rng) => {
    const items: [string, number][] = [["Notebook", int(rng, 20, 45)], ["Pencil", int(rng, 4, 9)], ["Eraser", int(rng, 3, 8)]];
    const q = [int(rng, 2, 4), int(rng, 3, 6), int(rng, 1, 3)];
    const total = items.reduce((s, [, p], i) => s + p * q[i], 0);
    return MO.mc("pictorial", "apply", "making a bill", rng, { a: items[0][1], b: items[1][1], c: items[2][1] }, "What is the total of the bill?", card(items.map(([n, p], i) => `${n}: ${q[i]} × ₹${p}`), "Bill"), `₹${total}`, [[`₹${items.reduce((s, [, p]) => s + p, 0) + q.reduce((s, x) => s + x, 0)}`, "m3-money-op"], [`₹${items.reduce((s, [, p]) => s + p, 0)}`, "m3-money-op"], [`₹${total + 10}`, "m3-money-op"]]);
  },
  "pictorial|analyze": (rng) => {
    const paid = pick(rng, [100, 200, 500]), cost = int(rng, 25, paid - 10);
    return MO.mc("pictorial", "analyze", "change", rng, { paid, cost }, "How much change should Riya get?", card([`Toy: ₹${cost}`, `Riya pays: ₹${paid}`]), `₹${paid - cost}`, [[`₹${paid + cost}`, "m3-money-op"], [`₹${paid - cost + 10}`, "m3-money-op"], [`₹${cost}`, "m3-money-op"]]);
  },
  "pictorial|evaluate": (rng) => {
    const r = int(rng, 2, 9);
    const right = rng() < 0.5;
    return MO.mc("pictorial", "evaluate", "judge a claim", rng, { r, k: right ? 1 : 0 }, "Is Riya right?", card([right ? `Riya: ₹${r} = ${r * 100} paise` : `Riya: ₹${r} = ${r * 10} paise`]), right ? "Yes: ₹1 = 100 paise" : "No: ₹1 = 100 paise, not 10", [
      [right ? "No: ₹1 = 100 paise, not 10" : "Yes: ₹1 = 100 paise", "m3-paise"],
      ["No: ₹1 = 1000 paise", "m3-paise"],
      ["Yes: ₹1 = 10 paise", "m3-paise"],
    ]);
  },
  "abstract|remember": (rng) => {
    const p = 100 * int(rng, 2, 9) + 5 * int(rng, 1, 19);
    return MO.mc("abstract", "remember", "paise to rupees", rng, { p }, `${p} paise = ___`, null, rs(p), [[`₹${p}`, "m3-paise"], [`₹${(p / 10).toFixed(2)}`, "m3-paise"], [`₹${Math.floor(p / 100)}`, "m3-paise"]]);
  },
  "abstract|understand": (rng) => {
    const a = int(rng, 20, 90) * 100 + 5 * int(rng, 2, 19), b = int(rng, 10, 50) * 100 + 5 * int(rng, 2, 19);
    if (a <= b || a - b === b) throw new Error("order");
    const bad = Math.abs((a % 100) - (b % 100)) + (Math.floor(a / 100) - Math.floor(b / 100)) * 100;
    return MO.mc("abstract", "understand", "subtracting money", rng, { a, b }, `${rs(a)} − ${rs(b)} = ___`, null, rs(a - b), [[rs(bad === a - b ? a - b + 100 : bad), "m3-money-op"], [rs(a + b), "m3-money-op"], [rs(a - b + 10), "m3-money-op"]]);
  },
  "abstract|apply": (rng) => {
    const p = int(rng, 12, 85), n = int(rng, 3, 9);
    return MO.mc("abstract", "apply", "multiplying money", rng, { p, n }, `One mango costs ₹${p}. What do ${n} mangoes cost?`, null, `₹${p * n}`, [[`₹${p + n}`, "m3-money-op"], [`₹${p * (n - 1)}`, "m3-money-op"], [`₹${p * n + 10}`, "m3-money-op"]]);
  },
  "abstract|analyze": (rng) => {
    const n = int(rng, 3, 9), each = int(rng, 12, 60);
    return MO.mc("abstract", "analyze", "dividing money", rng, { n, each }, `${n} friends share ₹${n * each} equally. How much does each get?`, null, `₹${each}`, [[`₹${n * each - n}`, "m3-money-op"], [`₹${each + n}`, "m3-money-op"], [`₹${each * 2}`, "m3-money-op"]]);
  },
  "abstract|evaluate": (rng) => {
    const have = 100 * int(rng, 2, 5), a = int(rng, 40, 90), b = int(rng, 40, 90);
    const left = have - a - b;
    if (left === a || left === b || a === b) throw new Error("coincidence");
    return MO.mc("abstract", "evaluate", "two-step money problem", rng, { have, a, b }, `Riya has ₹${have}. She buys a book for ₹${a} and a bag for ₹${b}. How much is left?`, null, `₹${left}`, [[`₹${have - a}`, "m3-money-op"], [`₹${a + b}`, "m3-money-op"], [`₹${have - a + b}`, "m3-money-op"]]);
  },
});

// ---------------- Chapter 10: Data Handling ----------------
const DH = kit("dh3", "g3-data");
const PETS = ["Dog", "Cat", "Rabbit", "Fish"];
const tally = (n: number) => [..."||||| ".repeat(Math.floor(n / 5)).trim().split(" ").filter(Boolean).map(() => "卌"), "|".repeat(n % 5)].filter(Boolean).join(" ");
export const DATA_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const n = int(rng, 6, 18);
    return DH.shade("remember", "tally marks", rng, { n }, `Riya counts the pets: ${tally(n)} (卌 = 5). Shade one square for each pet.`, 2, 9, n, "1 square = 1 pet", [[Math.floor(n / 5) + (n % 5), "m3-tally"], [Math.floor(n / 5) * 4 + (n % 5), "m3-tally"]]);
  },
  "concrete|understand": (rng) => {
    const k = pick(rng, [2, 5]), n = int(rng, 2, 8);
    return DH.shade("understand", "pictograph with a key", rng, { k, n }, `In a pictograph, each 🍎 = ${k} apples. Riya has ${n * k} apples. Shade one square for each 🍎 she draws.`, 2, 9, n, "1 square = 1 🍎", [[Math.min(18, n * k), "m3-key"], [n + 1, "m3-key"]]);
  },
  "concrete|apply": (rng) => {
    const v = PETS.map(() => int(rng, 2, 12));
    if (new Set(v).size < 4) throw new Error("tie");
    const order = PETS.map((p, i) => [p, v[i]] as [string, number]).sort((a, b) => b[1] - a[1]).map(([p]) => p);
    return DH.order("apply", "ordering data", rng, { v: v.join("").length, a: v[0], b: v[1], c: v[2], d: v[3] }, `Pets in a shop: ${PETS.map((p, i) => `${p} ${v[i]}`).join(", ")}. Put them from most to fewest.`, order.join(" | "), [], [[[...order].reverse().join(" "), "m3-graph"]]);
  },
  "concrete|analyze": (rng) => {
    const v = PETS.map(() => int(rng, 2, 12));
    if (new Set(v).size < 4) throw new Error("tie");
    const max = PETS[v.indexOf(Math.max(...v))], min = PETS[v.indexOf(Math.min(...v))];
    return DH.tap("analyze", "reading a table", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `${PETS.map((p, i) => `${p}: ${v[i]}`).join("; ")}. Tap the pet there are fewest of.`, PETS.join("   "), min, [{ phrase: max, mistake: "m3-graph" }]);
  },
  "concrete|evaluate": (rng) => {
    const k = int(rng, 2, 5), n = int(rng, 3, 7);
    return DH.tap("evaluate", "using the key", rng, { k, n }, "One number in this working is wrong. Tap it.", `Each ⭐ = ${k} points. ${n} ⭐ = ${n + k} points`, String(n + k));
  },
  "pictorial|remember": (rng) => {
    const k = pick(rng, [2, 5, 10]), n = int(rng, 2, 6);
    return DH.mc("pictorial", "remember", "pictograph with a key", rng, { k, n }, "How many ice creams were sold on Monday?", { kind: "concrete", icon: "🍦", itemCount: n, groups: 1, groupLabel: "Monday", key: `Each 🍦 = ${k} ice creams` }, String(n * k), [[String(n), "m3-key"], [String(n + k), "m3-key"], [String((n + 1) * k), "m3-key"]]);
  },
  "pictorial|understand": (rng) => {
    const k = 2, v = [int(rng, 2, 6), int(rng, 2, 6), int(rng, 2, 6)];
    if (new Set(v).size < 3) throw new Error("tie");
    const names = ["Red", "Blue", "Green"];
    const most = names[v.indexOf(Math.max(...v))];
    return DH.mc("pictorial", "understand", "comparing in a pictograph", rng, { a: v[0], b: v[1], c: v[2] }, "How many more children like the most popular colour than the least popular?", { kind: "concrete", icon: "🙂", itemCount: v[0] + v[1] + v[2], groups: 3, groupLabel: "colour", segments: names.map((nm, i) => ({ icon: "🙂", count: v[i], label: nm })), key: `Each 🙂 = ${k} children` }, String((Math.max(...v) - Math.min(...v)) * k), [[String(Math.max(...v) - Math.min(...v)), "m3-key"], [String(Math.max(...v) * k), "m3-graph"], [String((Math.max(...v) + Math.min(...v)) * k), "m3-graph"]].concat(most ? [] : []) as [string, string][]);
  },
  "pictorial|apply": (rng) => {
    const v = [int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9)].map((x) => x * 10);
    const names = ["Mon", "Tue", "Wed"];
    return DH.mc("pictorial", "apply", "reading a bar graph", rng, { a: v[0], b: v[1], c: v[2] }, "How many books were read on the three days altogether?", card(names.map((n, i) => `${n}: ${"█".repeat(v[i] / 10)} ${v[i]}`), "Books read (each █ = 10)"), String(v[0] + v[1] + v[2]), [[String((v[0] + v[1] + v[2]) / 10), "m3-key"], [String(Math.max(...v)), "m3-graph"], [String(v[0] + v[1] + v[2] + 10), "m3-graph"]]);
  },
  "pictorial|analyze": (rng) => {
    const total = pick(rng, [40, 60, 80, 100]);
    const best = total <= 40 ? 5 : 10;
    return DH.mc("pictorial", "analyze", "choosing a scale", rng, { total }, "Which key is the best choice for this pictograph?", card([`The biggest number to show is ${total}.`, "The pictograph should have about 4 to 10 pictures in a row."]), `Each picture = ${best}`, [["Each picture = 1", "m3-key"], [`Each picture = ${total}`, "m3-key"], [`Each picture = ${best === 5 ? 3 : 7}`, "m3-key"]]);
  },
  "pictorial|evaluate": (rng) => {
    const k = pick(rng, [2, 5]), a = int(rng, 3, 6), b = int(rng, 3, 6);
    if (a === b) throw new Error("same");
    const right = rng() < 0.5;
    const said = right ? (a + b) * k : a + b;
    return DH.mc("pictorial", "evaluate", "judge a conclusion", rng, { k, a, b, r: right ? 1 : 0 }, `Riya says ${said} children were asked. Is she right?`, { kind: "concrete", icon: "🙂", itemCount: a + b, groups: 2, groupLabel: "answer", segments: [{ icon: "🙂", count: a, label: "Yes" }, { icon: "🙂", count: b, label: "No" }], key: `Each 🙂 = ${k} children` }, right ? "Yes: she used the key" : "No: she counted pictures, not children", [
      [right ? "No: she counted pictures, not children" : "Yes: she used the key", "m3-key"],
      ["No: only the Yes row counts", "m3-graph"],
      ["Yes: each picture is one child", "m3-key"],
    ]);
  },
  "abstract|remember": qmc(DH, "abstract", "remember", "data words", [
    ["Tally marks are drawn in groups of ___", "5", ["4", "10", "2"], "m3-tally"],
    ["In a pictograph, the key tells ___", "what each picture stands for", ["the title of the graph", "the biggest number", "who drew it"], "m3-key"],
    ["Information we collect, like how many pets each child has, is called ___", "data", ["a key", "a scale", "a tally"], "m3-graph"],
  ]),
  "abstract|understand": (rng) => {
    const n = int(rng, 6, 24);
    return DH.mc("abstract", "understand", "tally marks", rng, { n }, `How many is ${tally(n)} (卌 = 5)?`, null, String(n), [[String(Math.floor(n / 5) * 4 + (n % 5)), "m3-tally"], [String(Math.floor(n / 5) + (n % 5)), "m3-tally"], [String(n + 5), "m3-tally"]]);
  },
  "abstract|apply": (rng) => {
    const k = pick(rng, [2, 5, 10]), n = int(rng, 3, 9);
    return DH.mc("abstract", "apply", "drawing with a key", rng, { k, n }, `Each ★ = ${k}. How many ★ show ${n * k}?`, null, String(n), [[String(n * k), "m3-key"], [String(n + k), "m3-key"], [String(n + 1), "m3-key"]]);
  },
  "abstract|analyze": (rng) => {
    const v = PETS.map(() => int(rng, 3, 15));
    if (new Set(v).size < 4) throw new Error("tie");
    if (v[0] <= v[3]) throw new Error("order");
    return DH.mc("abstract", "analyze", "comparing data", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `${PETS.map((p, i) => `${p} ${v[i]}`).join(", ")}. How many more dogs than fish?`, null, String(v[0] - v[3]), [[String(v[0] + v[3]), "m3-graph"], [String(v[3] - v[0]), "m3-graph"], [String(Math.max(...v) - Math.min(...v)), "m3-graph"]].filter(([t]) => Number(t) !== 0) as [string, string][]);
  },
  "abstract|evaluate": (rng) => {
    const v = PETS.map(() => int(rng, 3, 15));
    if (new Set(v).size < 4) throw new Error("tie");
    const most = PETS[v.indexOf(Math.max(...v))];
    return DH.mc("abstract", "evaluate", "drawing a conclusion", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `${PETS.map((p, i) => `${p} ${v[i]}`).join(", ")}. The shop wants to order more of the most popular pet. Which?`, null, most, PETS.filter((p) => p !== most).map((p) => [p, "m3-graph"] as [string, string]));
  },
});

// ---------------- Chapter 11: Patterns and Symmetry ----------------
const PS = kit("ps3", "g3-patterns");
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const PATTERNS_G3: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const s = int(rng, 1, 10), k = int(rng, 2, 9);
    const seq = [0, 1, 2, 3].map((i) => s + i * k);
    const next = s + 4 * k;
    const line = [next, next + 1, s + 3 * k + 1, next + k].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return PS.tap("remember", "number patterns", rng, { s, k }, `${seq.join(", ")}, … Tap the next number.`, line.sort(() => rng() - 0.5).join("   "), String(next), [{ phrase: String(next + k), mistake: "m3-pattern" }]);
  },
  "concrete|understand": (rng) => {
    const s = int(rng, 0, 5), k = int(rng, 2, 3);
    const seq = [0, 1, 2, 3].map((i) => LETTERS[s + i * k]);
    const next = LETTERS[s + 4 * k];
    const line = [next, LETTERS[s + 4 * k + 1], LETTERS[s + 3 * k + 1], LETTERS[s + 4 * k - 1]].filter((x, i, a) => a.indexOf(x) === i);
    if (line.length < 4) throw new Error("dup");
    return PS.tap("understand", "letter patterns", rng, { s, k }, `${seq.join(", ")}, … Tap the next letter.`, line.sort(() => rng() - 0.5).join("   "), next, [{ phrase: LETTERS[s + 4 * k + 1], mistake: "m3-pattern" }]);
  },
  "concrete|apply": (rng) => {
    const s = int(rng, 2, 9), k = int(rng, 3, 10);
    const seq = [0, 1, 2, 3, 4].map((i) => s + i * k);
    return PS.order("apply", "extending a pattern", rng, { s, k }, `The rule is 'add ${k}', starting at ${s}. Build the pattern.`, seq.join(" | "), [String(s + 4 * k + 1)], [[[seq[0], seq[1], seq[2], seq[3], s + 4 * k + 1].join(" "), "m3-pattern"]]);
  },
  "concrete|analyze": (rng) => {
    const sym = ["A", "H", "M", "T", "O", "X", "U", "W"], not = ["F", "G", "J", "L", "N", "P", "R", "S", "Z"];
    const y = pick(rng, sym);
    const n = [...not].sort(() => rng() - 0.5).slice(0, 3);
    return PS.tap("analyze", "symmetric figures", rng, { y: sym.indexOf(y) }, "Tap the letter that has a line of symmetry.", [y, ...n].sort(() => rng() - 0.5).join("   "), y, [{ phrase: n[0], mistake: "m3-symmetry" }]);
  },
  "concrete|evaluate": (rng) => {
    const k = int(rng, 1, 3);
    return PS.tap("evaluate", "tiling", rng, { k }, "One word in this sentence is wrong. Tap it.", "Squares, triangles and circles all tile a floor with no gaps.", "circles");
  },
  "pictorial|remember": (rng) => {
    const s = int(rng, 3, 30), k = int(rng, 2, 10);
    const seq = [0, 1, 2, 3].map((i) => s + i * k);
    return PS.mc("pictorial", "remember", "the rule of a pattern", rng, { s, k }, "What is the rule?", card([seq.join(",  ") + ",  …"]), `Add ${k}`, [[`Add ${k + 1}`, "m3-pattern"], [`Add ${s}`, "m3-pattern"], [`Multiply by ${k}`, "m3-pattern"]]);
  },
  "pictorial|understand": (rng) => {
    const shapes = ["▲", "●", "■"];
    const len = int(rng, 2, 3), reps = 2;
    const unit = shapes.slice(0, len);
    const seq = Array.from({ length: len * reps + 1 }, (_, i) => unit[i % len]);
    const nextIdx = (len * reps + 1) % len;
    return PS.mc("pictorial", "understand", "shape patterns", rng, { len }, "What comes next?", card([seq.join("  ") + "  ?"]), unit[nextIdx], [...shapes.filter((x) => x !== unit[nextIdx]).map((x) => [x, "m3-pattern"] as [string, string]), ["◆", "m3-pattern"]]);
  },
  "pictorial|apply": (rng) => {
    const all: ["square" | "rectangle" | "triangle" | "circle", string, string[]][] = [["square", "4", ["2", "1", "8"]], ["rectangle", "2", ["4", "1", "0"]], ["circle", "Many (endless)", ["4", "1", "0"]]];
    const i = int(rng, 0, 2);
    return PS.mc("pictorial", "apply", "lines of symmetry", rng, { i }, "How many lines of symmetry does this shape have?", { kind: "shape", shape: all[i][0] }, all[i][1], all[i][2].map((t) => [t, "m3-symmetry"] as [string, string]));
  },
  "pictorial|analyze": (rng) => {
    const cols = 6, r = int(rng, 1, 3);
    const left = int(rng, 1, 2);
    const right = cols - left + 1;
    return PS.mc("pictorial", "analyze", "completing a symmetric figure", rng, { r, left }, `The fold line is down the middle. A square is coloured in column ${left}. Which column must be coloured to make it symmetric?`, { kind: "grid", rows: 3, cols, cells: [(r - 1) * cols + (left - 1)] }, `Column ${right}`, [[`Column ${left + 1}`, "m3-symmetry"], [`Column ${cols / 2 + left}`, "m3-symmetry"], [`Column ${cols / 2}`, "m3-symmetry"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return PS.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: Square tiles can cover a floor with no gaps." : "Riya: Round tiles can cover a floor with no gaps."]), right ? "Yes: squares fit together exactly" : "No: circles leave gaps between them", [
      [right ? "No: circles leave gaps between them" : "Yes: squares fit together exactly", "m3-symmetry"],
      ["No: no shape can tile", "m3-symmetry"],
      ["Yes: every shape tiles", "m3-symmetry"],
    ]);
  },
  "abstract|remember": qmc(PS, "abstract", "remember", "words", [
    ["A line that folds a shape into two matching halves is a line of ___", "symmetry", ["tiling", "pattern", "rule"], "m3-symmetry"],
    ["Covering a surface with shapes, with no gaps or overlaps, is called ___", "tiling", ["symmetry", "folding", "counting"], "m3-symmetry"],
    ["Every pattern has a ___", "rule", ["key", "tally", "scale"], "m3-pattern"],
  ]),
  "abstract|understand": (rng) => {
    const s = int(rng, 50, 99), k = int(rng, 2, 9);
    const seq = [0, 1, 2, 3].map((i) => s - i * k);
    return PS.mc("abstract", "understand", "decreasing patterns", rng, { s, k }, `${seq.join(", ")}, ___`, null, String(s - 4 * k), [[String(s - 3 * k + k), "m3-pattern"], [String(s - 4 * k + 1), "m3-pattern"], [String(s - 5 * k), "m3-pattern"]]);
  },
  "abstract|apply": (rng) => {
    const s = int(rng, 1, 5);
    const seq = [0, 1, 2, 3].map((i) => s * 2 ** i);
    return PS.mc("abstract", "apply", "doubling patterns", rng, { s }, `${seq.join(", ")}, ___`, null, String(s * 16), [[String(seq[3] + (seq[3] - seq[2])), "m3-pattern"], [String(seq[3] + 2), "m3-pattern"], [String(s * 32), "m3-pattern"]]);
  },
  "abstract|analyze": (rng) => {
    const s = int(rng, 1, 9), k = int(rng, 3, 9), n = int(rng, 6, 9);
    return PS.mc("abstract", "analyze", "a later term", rng, { s, k, n }, `A pattern starts at ${s} and adds ${k} each time. What is the ${n}th number?`, null, String(s + (n - 1) * k), [[String(s + n * k), "m3-pattern"], [String(n * k), "m3-pattern"], [String(s + (n - 2) * k), "m3-pattern"]]);
  },
  "abstract|evaluate": qmc(PS, "abstract", "evaluate", "symmetry", [
    ["Which letter has NO line of symmetry?", "F", ["A", "H", "T"], "m3-symmetry"],
    ["Which shape does NOT tile a floor?", "circle", ["square", "rectangle", "triangle"], "m3-symmetry"],
    ["How many lines of symmetry does the letter H have?", "2", ["1", "0", "4"], "m3-symmetry"],
  ]),
});
