import { Template, fmt, int, pick } from "../core.js";
import { Misconceptions, card, kit, noEcho, safe } from "../m7/kit.js";

/**
 * Grade 5 Maths (CPA Maths 5), generated: Volume and Nets of Solids, Time
 * and Temperature, Life Mathematics, Scales and Directions, Data Handling,
 * Patterns and Symmetry. Replaces the hand-written banks.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "m5-volume": { label: "Gets volume wrong", detail: "Adds the edges, or uses area (l × b) instead of l × b × h.", childTip: "Volume of a cuboid = length × breadth × height, in cubic units. A cube: side × side × side." },
  "m5-net": { label: "Misreads nets of solids", detail: "Can't tell which net folds into a cube, cone or cylinder.", childTip: "A cube's net has 6 squares. A cylinder's net: 2 circles and a rectangle. A cone's: a circle and a curved sector." },
  "m5-time-convert": { label: "Converts time units wrongly", detail: "Uses 100 minutes in an hour or 12 hours in a day.", childTip: "1 day = 24 hours, 1 hour = 60 minutes, 1 minute = 60 seconds." },
  "m5-temperature": { label: "Converts temperature wrongly", detail: "Forgets the 32, or multiplies by 5/9 instead of 9/5.", childTip: "°F = °C × 9/5 + 32. °C = (°F − 32) × 5/9. Water freezes at 0 °C = 32 °F and boils at 100 °C = 212 °F." },
  "m5-profit": { label: "Mixes up profit and loss", detail: "Calls it profit when the selling price is lower, or subtracts the wrong way.", childTip: "SP > CP: profit = SP − CP. SP < CP: loss = CP − SP." },
  "m5-unitary": { label: "Uses the unitary method wrongly", detail: "Multiplies when it should divide to find the value of one.", childTip: "First find the value of one (divide), then multiply for the number you need." },
  "m5-scale": { label: "Uses a scale wrongly", detail: "Divides when it should multiply, or mixes up reduced and real sizes.", childTip: "Scale 1 cm : 10 m means every 1 cm on the drawing is 10 m in real life. Real = drawing × scale." },
  "m5-direction": { label: "Mixes up directions or the angles between them", detail: "Confuses east and west, or thinks north to east is 180°.", childTip: "Clockwise: N, E, S, W. Each quarter turn is 90°; N to S is 180°." },
  "m5-line-graph": { label: "Misreads a line graph", detail: "Reads the wrong point, or misses whether the line goes up or down.", childTip: "Find the time on the bottom, go up to the line, then across to the scale." },
  "m5-turn": { label: "Mixes up turns", detail: "Thinks a half turn is 90°, or a quarter turn ends upside down.", childTip: "Quarter turn: 90°. Half turn: 180°. Three-quarter turn: 270°. Full turn: 360° (back to the start)." },
};

// ---------------- Chapter 9: Volume and Nets of Solids ----------------
const VN = kit("vn5", "volume-nets");
export const VOLUME_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const l = int(rng, 2, 6), b = int(rng, 2, 4), h = int(rng, 1, 2);
    if (l * b * h > 54) throw new Error("big");
    return VN.shade("remember", "volume with unit cubes", rng, { l, b, h }, `A cuboid is built from unit cubes: ${l} long, ${b} wide, ${h} high. Shade one square per cube.`, 6, 9, l * b * h, "1 square = 1 cube", [[l * b, "m5-volume"], [l + b + h, "m5-volume"]]);
  },
  "concrete|understand": (rng) => {
    const s = int(rng, 2, 3);
    return VN.shade("understand", "volume of a cube", rng, { s }, `A cube has side ${s} cm. Shade its volume in cubic cm (1 square = 1 cu cm).`, 3, 9, s ** 3, "1 square = 1 cu cm", [[s * s, "m5-volume"], [3 * s, "m5-volume"]]);
  },
  "concrete|apply": (rng) => {
    const l = int(rng, 3, 12), b = int(rng, 2, 9), h = int(rng, 2, 9);
    return VN.order("apply", "volume of a cuboid", rng, { l, b, h }, `Build the volume of a ${l} cm × ${b} cm × ${h} cm cuboid.`, `${l} × ${b} × ${h} | = | ${l * b * h} cu cm`, [`${l + b + h} cu cm`], [[`${l} × ${b} × ${h} = ${l + b + h} cu cm`, "m5-volume"]]);
  },
  "concrete|analyze": (rng) => {
    const solids: [string, string][] = [["cube", "6 squares"], ["cylinder", "2 circles and a rectangle"], ["cone", "a circle and a curved sector"], ["cuboid", "6 rectangles"]];
    const i = int(rng, 0, 3);
    return VN.tap("analyze", "nets", rng, { i }, `A net has ${solids[i][1]}. Tap the solid it folds into.`, "cube   cuboid   cylinder   cone", solids[i][0], [{ phrase: solids[(i + 1) % 4][0], mistake: "m5-net" }]);
  },
  "concrete|evaluate": (rng) => {
    const l = int(rng, 3, 9), b = int(rng, 2, 7), h = int(rng, 2, 6);
    return VN.tap("evaluate", "check a volume", rng, { l, b, h }, "One number in this working is wrong. Tap it.", `Volume = ${l} × ${b} × ${h} = ${l * b} cu cm`, String(l * b));
  },
  "pictorial|remember": (rng) => {
    const solids: ["cube" | "cuboid" | "cylinder", string][] = [["cube", "Cube"], ["cuboid", "Cuboid"], ["cylinder", "Cylinder"]];
    const i = int(rng, 0, 2);
    return VN.mc("pictorial", "remember", "solids", rng, { i }, "What is this solid?", { kind: "figure", figure: "solid", solid: solids[i][0] }, solids[i][1], ["Cube", "Cuboid", "Cylinder", "Cone"].filter((x) => x !== solids[i][1]).map((x) => [x, "m5-net"] as [string, string]));
  },
  "pictorial|understand": (rng) => {
    const l = int(rng, 3, 12), b = int(rng, 2, 9), h = int(rng, 2, 9);
    return VN.mc("pictorial", "understand", "volume of a cuboid", rng, { l, b, h }, "What is the volume of this box?", card([`Length ${l} cm`, `Breadth ${b} cm`, `Height ${h} cm`], "Box"), `${l * b * h} cu cm`, [[`${l * b} cu cm`, "m5-volume"], [`${l + b + h} cu cm`, "m5-volume"], [`${2 * (l * b + b * h + l * h)} cu cm`, "m5-volume"]]);
  },
  "pictorial|apply": (rng) => {
    const s = int(rng, 2, 12);
    return VN.mc("pictorial", "apply", "volume of a cube", rng, { s }, `Each edge of this cube is ${s} cm. What is its volume?`, { kind: "figure", figure: "solid", solid: "cube" }, `${s ** 3} cu cm`, [[`${s * s} cu cm`, "m5-volume"], [`${12 * s} cu cm`, "m5-volume"], [`${3 * s} cu cm`, "m5-volume"]]);
  },
  "pictorial|analyze": (rng) => {
    const L = 2 * int(rng, 2, 6), B = 2 * int(rng, 2, 4), H = 2 * int(rng, 1, 3);
    return VN.mc("pictorial", "analyze", "how many cubes fit", rng, { L, B, H }, "How many 2 cm cubes fit exactly inside the box?", card([`Box: ${L} cm × ${B} cm × ${H} cm`]), String((L / 2) * (B / 2) * (H / 2)), [[String(L * B * H), "m5-volume"], [String((L * B * H) / 2), "m5-volume"], [String((L / 2) * (B / 2)), "m5-volume"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return VN.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: The net of a cylinder has two circles and a rectangle." : "Riya: The net of a cube has 4 squares."]), right ? "Yes: the circles are the top and bottom" : "No: a cube has 6 faces, so its net has 6 squares", [
      [right ? "No: it has one circle and a triangle" : "Yes: a cube has 4 faces", "m5-net"],
      ["No: cylinders have no net", "m5-net"],
      ["Yes: every net has 4 shapes", "m5-net"],
    ]);
  },
  "abstract|remember": (rng) => {
    const i = int(rng, 0, 2);
    const q: [string, string, string[], string][] = [["Volume of a cuboid = ___", "length × breadth × height", ["length × breadth", "length + breadth + height", "2 × (length + breadth)"], "m5-volume"], ["Volume is measured in ___", "cubic units (cu cm)", ["square units", "cm", "degrees"], "m5-volume"], ["A cube has ___ faces.", "6", ["4", "8", "12"], "m5-net"]];
    return VN.mc("abstract", "remember", "facts", rng, { i }, q[i][0], null, q[i][1], q[i][2].map((t) => [t, q[i][3]] as [string, string]));
  },
  "abstract|understand": (rng) => {
    const l = int(rng, 4, 20), b = int(rng, 3, 15), h = int(rng, 2, 10);
    return VN.mc("abstract", "understand", "volume of a cuboid", rng, { l, b, h }, `A cuboid is ${l} cm × ${b} cm × ${h} cm. Its volume is ___`, null, `${fmt(l * b * h)} cu cm`, [[`${l * b} cu cm`, "m5-volume"], [`${l + b + h} cu cm`, "m5-volume"], [`${fmt(l * b * h)} sq cm`, "m3-units"]]);
  },
  "abstract|apply": (rng) => {
    const l = int(rng, 4, 15), b = int(rng, 3, 10), h = int(rng, 2, 10);
    return VN.mc("abstract", "apply", "missing height", rng, { l, b, h }, `A tank is ${l} m long and ${b} m wide. Its volume is ${l * b * h} cu m. How high is it?`, null, `${h} m`, [[`${l * b * h - l - b} m`, "m5-volume"], [`${l * b} m`, "m5-volume"], [`${h + 1} m`, "m5-volume"]].filter(([t]) => !t.startsWith("-")) as [string, string][]);
  },
  "abstract|analyze": (rng) => {
    const s = int(rng, 2, 10);
    return VN.mc("abstract", "analyze", "cube from volume", rng, { s }, `A cube has volume ${s ** 3} cu cm. Its edge is ___`, null, `${s} cm`, [[`${s ** 3 / 3} cm`.replace(/\.\d+/, ""), "m5-volume"], [`${s * s} cm`, "m5-volume"], [`${s + 1} cm`, "m5-volume"]].filter(([t]) => t !== `${s} cm`) as [string, string][]);
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 2, 6), b = int(rng, 2, 6), c = int(rng, 2, 6);
    const v1 = a * b * c, s = int(rng, 2, 5), v2 = s ** 3;
    if (v1 === v2) throw new Error("equal");
    return VN.mc("abstract", "evaluate", "comparing volumes", rng, { a, b, c, s }, `Box A is ${a} cm × ${b} cm × ${c} cm. Box B is a cube of side ${s} cm. Which holds more?`, null, v1 > v2 ? "Box A" : "Box B", [["Box A", "m5-volume"], ["Box B", "m5-volume"], ["They hold the same", "m5-volume"], ["You can't tell", "m5-volume"]]);
  },
}));

// ---------------- Chapter 10: Time and Temperature ----------------
const TT = kit("tt5", "time-temperature");
const C2F = (c: number) => (c * 9) / 5 + 32;
export const TIME_TEMP_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const h = int(rng, 1, 3), m = 10 * int(rng, 1, 5);
    return TT.shade("remember", "hours and minutes", rng, { h, m }, `Each square is 10 minutes. Shade ${h} h ${m} min.`, 3, 9, h * 6 + m / 10, "1 square = 10 min", [[h * 10 + m / 10 <= 27 ? h * 10 + m / 10 : -1, "m5-time-convert"], [h + m / 10, "m5-time-convert"]]);
  },
  "concrete|understand": (rng) => {
    const c = 10 * int(rng, 1, 4);
    const f = C2F(c);
    const line = [f, c + 32, (c * 5) / 9 + 32, c * 2].map((x) => `${Math.round(x)}°F`);
    if (new Set(line).size < 4) throw new Error("dup");
    return TT.tap("understand", "°C to °F", rng, { c }, `Tap ${c}°C in Fahrenheit.`, line.sort(() => rng() - 0.5).join("   "), `${f}°F`, [{ phrase: `${c + 32}°F`, mistake: "m5-temperature" }]);
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 1, 3);
    return TT.order("apply", "units of time", rng, { k }, "Put the units in order, shortest first.", "second | minute | hour | day | week", [], [["minute second hour day week", "m5-time-convert"]]);
  },
  "concrete|analyze": (rng) => {
    const d = int(rng, 2, 7), h = int(rng, 1, 23);
    const right = d * 24 + h;
    const line = [right, d * 12 + h, d * 60 + h, d + h].map(String);
    if (new Set(line).size < 4) throw new Error("dup");
    return TT.tap("analyze", "days to hours", rng, { d, h }, `Tap ${d} days ${h} hours in hours.`, line.sort(() => rng() - 0.5).join("   "), String(right), [{ phrase: String(d * 12 + h), mistake: "m5-time-convert" }]);
  },
  "concrete|evaluate": (rng) => {
    const m = int(rng, 2, 9), s = int(rng, 5, 55);
    return TT.tap("evaluate", "minutes to seconds", rng, { m, s }, "One number in this working is wrong. Tap it.", `${m} min ${s} s = ${m * 100 + s} s`, String(m * 100 + s));
  },
  "pictorial|remember": (rng) => {
    const c = pick(rng, [0, 100, 37]);
    const f = C2F(c);
    return TT.mc("pictorial", "remember", "key temperatures", rng, { c }, `This thermometer shows ${c}°C. What is it in °F?`, card([`${c}°C`], "Thermometer"), `${Math.round(f * 10) / 10}°F`, [[`${c + 32 === f ? c + 30 : c + 32}°F`, "m5-temperature"], [`${Math.round(((c * 5) / 9 + 32) * 10) / 10}°F`, "m5-temperature"], [`${Math.round(f * 10) / 10 + 10}°F`, "m5-temperature"]]);
  },
  "pictorial|understand": (rng) => {
    const f = pick(rng, [50, 59, 68, 77, 86, 95, 104, 113, 122]);
    const c = ((f - 32) * 5) / 9;
    return TT.mc("pictorial", "understand", "°F to °C", rng, { f }, `Convert ${f}°F to Celsius.`, card([`°C = (°F − 32) × 5/9`]), `${c}°C`, [[`${f - 32}°C`, "m5-temperature"], [`${Math.round(((f - 32) * 9) / 5)}°C`, "m5-temperature"], [`${Math.round((f * 5) / 9)}°C`, "m5-temperature"]]);
  },
  "pictorial|apply": (rng) => {
    const h1 = int(rng, 6, 11), m1 = 5 * int(rng, 1, 11), d = int(rng, 70, 230);
    const end = h1 * 60 + m1 + d;
    return TT.mc("pictorial", "apply", "time duration", rng, { h1, m1, d }, "How long was the journey?", card([`Left: ${h1}:${String(m1).padStart(2, "0")} a.m.`, `Arrived: ${Math.floor(end / 60) > 12 ? Math.floor(end / 60) - 12 : Math.floor(end / 60)}:${String(end % 60).padStart(2, "0")} ${Math.floor(end / 60) >= 12 ? "p.m." : "a.m."}`]), `${Math.floor(d / 60)} h ${d % 60} min`, [[`${Math.floor(d / 60) + 1} h ${d % 60} min`, "m4-duration"], [`${Math.floor(d / 100)} h ${d % 100} min`, "m5-time-convert"], [`${d} h`, "m5-time-convert"]].filter(([t]) => !/ 0 min/.test(t) || true) as [string, string][]);
  },
  "pictorial|analyze": (rng) => {
    const h = int(rng, 2, 5), m = int(rng, 5, 55);
    return TT.mc("pictorial", "analyze", "hours to minutes", rng, { h, m }, "How many minutes long is the film?", card([`Film: ${h} h ${m} min`]), `${h * 60 + m} min`, [[`${h * 100 + m} min`, "m5-time-convert"], [`${h + m} min`, "m5-time-convert"], [`${h * 60} min`, "m5-time-convert"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return TT.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: Water boils at 100°C, which is 212°F." : "Riya: Water freezes at 0°F."]), right ? "Yes: 100 × 9/5 + 32 = 212" : "No: water freezes at 0°C, which is 32°F", [
      [right ? "No: water boils at 100°F" : "Yes: 0 is freezing on both scales", "m5-temperature"],
      ["No: Celsius and Fahrenheit are the same", "m5-temperature"],
      ["Yes: just add 32 to everything", "m5-temperature"],
    ]);
  },
  "abstract|remember": (rng) => {
    const i = int(rng, 0, 3);
    const q: [string, string, string[]][] = [["1 day = ___ hours", "24", ["12", "60", "100"]], ["1 hour = ___ minutes", "60", ["100", "24", "30"]], ["1 minute = ___ seconds", "60", ["100", "24", "10"]], ["Temperature is measured with a ___", "thermometer", ["barometer", "protractor", "ruler"]]];
    return TT.mc("abstract", "remember", "facts", rng, { i }, q[i][0], null, q[i][1], q[i][2].map((t) => [t, "m5-time-convert"] as [string, string]));
  },
  "abstract|understand": (rng) => {
    const s = int(rng, 130, 590);
    if (s % 60 === 0) throw new Error("whole");
    return TT.mc("abstract", "understand", "seconds to minutes", rng, { s }, `${s} seconds = ___`, null, `${Math.floor(s / 60)} min ${s % 60} s`, [[`${Math.floor(s / 100)} min ${s % 100} s`, "m5-time-convert"], [`${s} min`, "m5-time-convert"], [`${Math.floor(s / 60) + 1} min ${s % 60} s`, "m5-time-convert"]]);
  },
  "abstract|apply": (rng) => {
    const h = int(rng, 30, 160);
    if (h % 24 === 0) throw new Error("whole");
    return TT.mc("abstract", "apply", "hours to days", rng, { h }, `${h} hours = ___`, null, `${Math.floor(h / 24)} days ${h % 24} h`, [[`${Math.floor(h / 12)} days ${h % 12} h`, "m5-time-convert"], [`${Math.floor(h / 60)} days ${h % 60} h`, "m5-time-convert"], [`${h} days`, "m5-time-convert"]]);
  },
  "abstract|analyze": (rng) => {
    const c = 5 * int(rng, 1, 12);
    return TT.mc("abstract", "analyze", "°C to °F", rng, { c }, `${c}°C = ___°F`, null, String(C2F(c)), [[String(c + 32), "m5-temperature"], [String(Math.round((c * 5) / 9 + 32)), "m5-temperature"], [String((c * 9) / 5), "m5-temperature"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = 5 * int(rng, 6, 9), b = pick(rng, [86, 95, 104, 113]);
    const bc = ((b - 32) * 5) / 9;
    if (bc === a) throw new Error("equal");
    return TT.mc("abstract", "evaluate", "comparing temperatures", rng, { a, b }, `Which is hotter: ${a}°C or ${b}°F?`, null, a > bc ? `${a}°C` : `${b}°F`, [[a > bc ? `${b}°F` : `${a}°C`, "m5-temperature"], ["They are the same", "m5-temperature"], ["You can't compare them", "m5-temperature"]]);
  },
}));

// ---------------- Chapter 11: Life Mathematics ----------------
const LM = kit("lm5", "life-mathematics");
export const LIFE_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const cp = 10 * int(rng, 5, 10), p = 10 * int(rng, 1, 8);
    return LM.shade("remember", "profit", rng, { cp, p }, `A toy costs ₹${cp} to make and sells for ₹${cp + p}. Each square is ₹10: shade the profit.`, 2, 9, p / 10, "1 square = ₹10", [[(cp + p) / 10 <= 18 ? (cp + p) / 10 : -1, "m5-profit"], [cp / 10 <= 18 ? cp / 10 : -1, "m5-profit"]]);
  },
  "concrete|understand": (rng) => {
    const n = int(rng, 3, 9), each = int(rng, 2, 9);
    return LM.shade("understand", "unitary method", rng, { n, each }, `${n} pens cost ₹${n * each}. Each square is ₹1: shade the cost of one pen.`, 2, 9, each, "1 square = ₹1", [[n, "m5-unitary"], [Math.min(18, each + n), "m5-unitary"]]);
  },
  "concrete|apply": (rng) => {
    const cp = int(rng, 200, 900), sp = cp + int(rng, 20, 200);
    return LM.order("apply", "finding profit", rng, { cp, sp }, `CP = ₹${cp}, SP = ₹${sp}. Build the profit.`, `₹${sp} − ₹${cp} | = | ₹${sp - cp} profit`, [`₹${sp - cp} loss`], [[`₹${sp} − ₹${cp} = ₹${sp - cp} loss`, "m5-profit"]]);
  },
  "concrete|analyze": (rng) => {
    const sp = int(rng, 200, 900), cp = sp + int(rng, 20, 200);
    return LM.tap("analyze", "profit or loss", rng, { cp, sp }, `Bought for ₹${cp}, sold for ₹${sp}. Tap the right word.`, "profit   loss   neither", "loss", [{ phrase: "profit", mistake: "m5-profit" }]);
  },
  "concrete|evaluate": (rng) => {
    const n = int(rng, 3, 8), each = int(rng, 12, 60), m = int(rng, 2, 9);
    if (m === n) throw new Error("same");
    return LM.tap("evaluate", "check the unitary method", rng, { n, each, m }, "One number in this working is wrong. Tap it.", `${n} books cost ₹${n * each}, so ${m} books cost ₹${n * each * m}`, `₹${n * each * m}`);
  },
  "pictorial|remember": (rng) => {
    const i = int(rng, 0, 2);
    const q: [string, string, string[]][] = [["What is the price a shopkeeper pays for an item called?", "Cost price (CP)", ["Selling price (SP)", "Profit", "Loss"]], ["What is the price a customer pays called?", "Selling price (SP)", ["Cost price (CP)", "Profit", "Discount"]], ["If SP is more than CP, the shopkeeper makes a ___", "Profit", ["Loss", "Cost price", "Neither"]]];
    return LM.mc("pictorial", "remember", "terms", rng, { i }, q[i][0], card(["A shopkeeper buys a bag and sells it."]), q[i][1], q[i][2].map((t) => [t, "m5-profit"] as [string, string]));
  },
  "pictorial|understand": (rng) => {
    const cp = int(rng, 300, 900), l = int(rng, 20, 150);
    return LM.mc("pictorial", "understand", "finding loss", rng, { cp, l }, "Profit or loss, and how much?", card([`Cost price: ₹${cp}`, `Selling price: ₹${cp - l}`]), `Loss of ₹${l}`, [[`Profit of ₹${l}`, "m5-profit"], [`Loss of ₹${2 * cp - l}`, "m3-op"], [`Profit of ₹${cp - l}`, "m5-profit"]]);
  },
  "pictorial|apply": (rng) => {
    const cp = int(rng, 200, 800), p = int(rng, 30, 200);
    return LM.mc("pictorial", "apply", "finding SP", rng, { cp, p }, "What was the selling price?", card([`Cost price: ₹${cp}`, `Profit: ₹${p}`]), `₹${cp + p}`, [[`₹${cp - p}`, "m5-profit"], [`₹${p}`, "m5-profit"], [`₹${cp}`, "m5-profit"]]);
  },
  "pictorial|analyze": (rng) => {
    const n = int(rng, 4, 9), each = int(rng, 15, 80), m = int(rng, 2, 12);
    if (m === n) throw new Error("same");
    return LM.mc("pictorial", "analyze", "unitary method", rng, { n, each, m }, `What do ${m} notebooks cost?`, card([`${n} notebooks cost ₹${n * each}`]), `₹${m * each}`, [[`₹${n * each * m}`, "m5-unitary"], [`₹${Math.round((n * each) / m)}`, "m5-unitary"], [`₹${n * each + m}`, "m3-op"]]);
  },
  "pictorial|evaluate": (rng) => {
    const cp = int(rng, 200, 900), sp = cp + int(rng, 20, 100);
    const right = rng() < 0.5;
    return LM.mc("pictorial", "evaluate", "judge a claim", rng, { cp, sp, r: right ? 1 : 0 }, "Is Riya right?", card([`CP ₹${cp}, SP ₹${sp}`, right ? `Riya: The profit is ₹${sp - cp}.` : `Riya: The loss is ₹${sp - cp}.`]), right ? "Yes: SP is more than CP, so it is a profit" : "No: SP is more than CP, so it is a profit", [
      [right ? "No: it is a loss" : "Yes: it is a loss", "m5-profit"],
      ["No: there is neither profit nor loss", "m5-profit"],
      ["Yes: profit and loss mean the same", "m5-profit"],
    ]);
  },
  "abstract|remember": (rng) => {
    const i = int(rng, 0, 1);
    return LM.mc("abstract", "remember", "formulas", rng, { i }, i ? "Loss = ___" : "Profit = ___", null, i ? "CP − SP" : "SP − CP", [[i ? "SP − CP" : "CP − SP", "m5-profit"], ["CP + SP", "m5-profit"], ["CP × SP", "m5-profit"]]);
  },
  "abstract|understand": (rng) => {
    const sp = int(rng, 300, 900), p = int(rng, 20, 150);
    return LM.mc("abstract", "understand", "finding CP", rng, { sp, p }, `SP = ₹${sp}, profit = ₹${p}. CP = ___`, null, `₹${sp - p}`, [[`₹${sp + p}`, "m5-profit"], [`₹${p}`, "m5-profit"], [`₹${sp - p - 10}`, "m3-op"]]);
  },
  "abstract|apply": (rng) => {
    const n = int(rng, 3, 9), each = int(rng, 12, 90), m = int(rng, 2, 15);
    if (m === n) throw new Error("same");
    return LM.mc("abstract", "apply", "unitary method", rng, { n, each, m }, `If ${n} kg of rice cost ₹${n * each}, what do ${m} kg cost?`, null, `₹${m * each}`, [[`₹${n * each * m}`, "m5-unitary"], [`₹${each}`, "m5-unitary"], [`₹${n * each + m}`, "m3-op"]]);
  },
  "abstract|analyze": (rng) => {
    const n = int(rng, 10, 30), cp = int(rng, 20, 60), sp = cp + int(rng, 3, 20);
    return LM.mc("abstract", "analyze", "total profit", rng, { n, cp, sp }, `A shop buys ${n} umbrellas at ₹${cp} each and sells them at ₹${sp} each. What is the total profit?`, null, `₹${n * (sp - cp)}`, [[`₹${sp - cp}`, "m5-unitary"], [`₹${n * sp}`, "m5-profit"], [`₹${n * cp}`, "m5-profit"]]);
  },
  "abstract|evaluate": (rng) => {
    const cp = int(rng, 300, 800), sp1 = cp + int(rng, 20, 80), sp2 = cp - int(rng, 20, 80);
    const net = sp1 + sp2 - 2 * cp;
    if (net === 0) throw new Error("zero");
    return LM.mc("abstract", "evaluate", "profit and loss together", rng, { cp, sp1, sp2 }, `Two bags each cost ₹${cp}. One sells for ₹${sp1}, the other for ₹${sp2}. Overall, the shop makes ___`, null, net > 0 ? `a profit of ₹${net}` : `a loss of ₹${-net}`, [[net > 0 ? `a loss of ₹${net}` : `a profit of ₹${-net}`, "m5-profit"], [`a profit of ₹${sp1 - cp}`, "m5-profit"], ["neither profit nor loss", "m5-profit"]]);
  },
}));

// ---------------- Chapter 12: Scales and Directions ----------------
const SD = kit("sd5", "scales-directions");
const DIRS = ["North", "East", "South", "West"];
export const SCALES_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const k = pick(rng, [10, 20, 50]), real = k * int(rng, 2, 9);
    return SD.shade("remember", "reduced drawings", rng, { k, real }, `Scale: 1 cm stands for ${k} cm. A cupboard is ${real} cm long. Each square is 1 cm: shade its length on the drawing.`, 2, 9, real / k, "1 square = 1 cm", [[Math.min(18, real / 10), "m5-scale"], [Math.min(18, real / k + 1), "m5-scale"]]);
  },
  "concrete|understand": (rng) => {
    const s = int(rng, 0, 3), q = int(rng, 1, 3);
    return SD.tap("understand", "turning between directions", rng, { s, q }, `Face ${DIRS[s]} and turn ${q * 90}° clockwise. Tap where you face.`, DIRS.join("   "), DIRS[(s + q) % 4], [{ phrase: DIRS[(s - q + 4) % 4] === DIRS[(s + q) % 4] ? DIRS[(s + 1) % 4] : DIRS[(s - q + 4) % 4], mistake: "m5-direction" }]);
  },
  "concrete|apply": (rng) => {
    const s = int(rng, 0, 3);
    const order = [0, 1, 2, 3].map((i) => DIRS[(s + i) % 4]);
    return SD.order("apply", "clockwise order", rng, { s }, `Starting at ${DIRS[s]}, put the directions in clockwise order.`, order.join(" | "), [], [[[order[0], order[3], order[2], order[1]].join(" "), "m5-direction"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 0, 3), b = (a + int(rng, 1, 3)) % 4;
    const ang = ((b - a + 4) % 4) * 90;
    const line = ["90°", "180°", "270°", "360°"].join("   ");
    return SD.tap("analyze", "angles between directions", rng, { a, b }, `Tap the clockwise angle from ${DIRS[a]} to ${DIRS[b]}.`, line, `${ang}°`, [{ phrase: `${360 - ang === ang ? 90 : 360 - ang}°`, mistake: "m5-direction" }]);
  },
  "concrete|evaluate": (rng) => {
    const k = int(rng, 2, 9);
    return SD.tap("evaluate", "check a scale", rng, { k }, "One number in this working is wrong. Tap it.", `Scale 1 cm : 100 cm. A ${k} cm line stands for ${k * 10} cm.`, `${k * 10}`);
  },
  "pictorial|remember": (rng) => {
    const s = int(rng, 0, 3);
    return SD.mc("pictorial", "remember", "directions", rng, { s }, `Riya faces ${DIRS[s]}. Which direction is on her right?`, card([`Riya faces ${DIRS[s]}`], "Compass"), DIRS[(s + 1) % 4], [[DIRS[(s + 3) % 4], "m5-direction"], [DIRS[(s + 2) % 4], "m5-direction"], [DIRS[s], "m5-direction"]]);
  },
  "pictorial|understand": (rng) => {
    const k = pick(rng, [5, 10, 20, 50]), d = int(rng, 2, 12);
    return SD.mc("pictorial", "understand", "reading a map scale", rng, { k, d }, "How far apart are the two towns really?", card([`Map scale: 1 cm = ${k} km`, `Distance on the map: ${d} cm`]), `${d * k} km`, [[`${d + k} km`, "m5-scale"], [`${d} km`, "m5-scale"], [`${Math.round((d / k) * 10) / 10} km`, "m5-scale"]]);
  },
  "pictorial|apply": (rng) => {
    const real = pick(rng, [180, 240, 300, 360, 450]), k = pick(rng, [10, 30, 60]);
    if (real % k) throw new Error("no");
    return SD.mc("pictorial", "apply", "drawing to scale", rng, { real, k }, "How long should the drawing be?", card([`Real length: ${real} cm`, `Scale: 1 cm stands for ${k} cm`]), `${real / k} cm`, [[`${real * k} cm`, "m5-scale"], [`${real - k} cm`, "m5-scale"], [`${real} cm`, "m5-scale"]]);
  },
  "pictorial|analyze": (rng) => {
    const r = int(rng, 1, 3), c1 = int(rng, 1, 2), c2 = c1 + int(rng, 2, 4);
    return SD.mc("pictorial", "analyze", "directions on a map", rng, { r, c1, c2 }, "North is at the top of the map. In which direction is the Library from the School?", { kind: "grid", rows: 3, cols: 7, markers: [{ row: r, col: c1, label: "School" }, { row: r, col: c2, label: "Library" }] }, "East", [["West", "m5-direction"], ["North", "m5-direction"], ["South", "m5-direction"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return SD.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: The angle from North to South is 180°." : "Riya: The angle from North to East is 180°."]), right ? "Yes: they are opposite each other" : "No: North to East is a quarter turn, 90°", [
      [right ? "No: it is 90°" : "Yes: every turn is 180°", "m5-direction"],
      ["No: it is 360°", "m5-direction"],
      ["Yes: all directions are 180° apart", "m5-direction"],
    ]);
  },
  "abstract|remember": (rng) => {
    const s = int(rng, 0, 3);
    return SD.mc("abstract", "remember", "opposite directions", rng, { s }, `The direction opposite ${DIRS[s]} is ___`, null, DIRS[(s + 2) % 4], [[DIRS[(s + 1) % 4], "m5-direction"], [DIRS[(s + 3) % 4], "m5-direction"], [DIRS[s] + "-east", "m5-direction"]].filter(([t]) => !t.includes("East-east")) as [string, string][]);
  },
  "abstract|understand": (rng) => {
    const k = pick(rng, [2, 3, 4, 5]), d = int(rng, 2, 9);
    return SD.mc("abstract", "understand", "magnified drawings", rng, { k, d }, `A ${d} mm insect is drawn ${k} times bigger. Its drawing is ___`, null, `${d * k} mm`, [[`${d + k} mm`, "m5-scale"], [`${Math.round((d / k) * 10) / 10} mm`, "m5-scale"], [`${d} mm`, "m5-scale"]]);
  },
  "abstract|apply": (rng) => {
    const s = int(rng, 0, 3), q = int(rng, 1, 3);
    return SD.mc("abstract", "apply", "turns", rng, { s, q }, `Facing ${DIRS[s]}, you turn ${q * 90}° anticlockwise. You now face ___`, null, DIRS[(s - q + 4) % 4], [[DIRS[(s + q) % 4], "m5-direction"], [DIRS[(s + 2) % 4], "m5-direction"], [DIRS[s], "m5-direction"], [DIRS[(s + 1) % 4], "m5-direction"]].filter(([t]) => t !== DIRS[(s - q + 4) % 4]) as [string, string][]);
  },
  "abstract|analyze": (rng) => {
    const k = pick(rng, [2, 5, 10]), d = int(rng, 3, 15);
    return SD.mc("abstract", "analyze", "scale word problem", rng, { k, d }, `On a plan, 1 cm = ${k} m. A garden is ${d} cm long on the plan. How long is it really?`, null, `${d * k} m`, [[`${d * k} cm`, "m5-scale"], [`${d + k} m`, "m5-scale"], [`${Math.round((d / k) * 10) / 10} m`, "m5-scale"]]);
  },
  "abstract|evaluate": (rng) => {
    const k = pick(rng, [10, 20, 50]), a = int(rng, 2, 9), b = int(rng, 2, 9);
    if (a === b) throw new Error("same");
    return SD.mc("abstract", "evaluate", "comparing on a map", rng, { k, a, b }, `On a map, 1 cm = ${k} km. Town A is ${a} cm away, Town B ${b} cm away. How much farther is the farther town?`, null, `${Math.abs(a - b) * k} km`, [[`${Math.abs(a - b)} km`, "m5-scale"], [`${(a + b) * k} km`, "m3-op"], [`${Math.max(a, b) * k} km`, "m5-scale"]]);
  },
}));

// ---------------- Chapter 13: Data Handling ----------------
const DH = kit("dh5", "data-handling");
const tally = (n: number) => [..."卌 ".repeat(Math.floor(n / 5)).trim().split(" ").filter(Boolean), "|".repeat(n % 5)].filter(Boolean).join(" ");
const CLASSES = ["5A", "5B", "5C", "5D"];
export const DATA_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const n = int(rng, 7, 18);
    return DH.shade("remember", "tally marks", rng, { n }, `The tally shows ${tally(n)} (卌 = 5). Shade one square per mark.`, 2, 9, n, "1 square = 1", [[Math.floor(n / 5) + (n % 5), "m3-tally"], [Math.floor(n / 5) * 4 + (n % 5), "m3-tally"]]);
  },
  "concrete|understand": (rng) => {
    const total = 4 * int(rng, 2, 4);
    return DH.shade("understand", "pie chart", rng, { total }, `${total} children were asked. The pie chart shows a quarter chose swimming. Shade one square per child who chose swimming.`, 2, 9, total / 4, "1 square = 1 child", [[total / 2, "m4-pie"], [Math.min(18, total), "m4-pie"]]);
  },
  "concrete|apply": (rng) => {
    const v = CLASSES.map(() => 100 * int(rng, 4, 10));
    if (new Set(v).size < 4) throw new Error("tie");
    const order = CLASSES.map((c, i) => [c, v[i]] as [string, number]).sort((a, b) => b[1] - a[1]).map(([c]) => c);
    return DH.order("apply", "reading a bar graph", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `Money raised: ${CLASSES.map((c, i) => `${c} ₹${v[i]}`).join(", ")}. Put the classes from most to least.`, order.join(" | "), [], [[[...order].reverse().join(" "), "m3-graph"]]);
  },
  "concrete|analyze": (rng) => {
    const t = [int(rng, 20, 26), int(rng, 27, 31), int(rng, 32, 36), int(rng, 28, 33)];
    const hrs = ["9 am", "11 am", "1 pm", "3 pm"];
    return DH.tap("analyze", "reading a line graph", rng, { a: t[0], b: t[1], c: t[2], d: t[3] }, `A line graph of temperature passes ${hrs.map((h, i) => `${h}: ${t[i]}°C`).join(", ")}. Tap the time it was hottest.`, "9am   11am   1pm   3pm", "1pm", [{ phrase: "9am", mistake: "m5-line-graph" }]);
  },
  "concrete|evaluate": (rng) => {
    const n = int(rng, 11, 24);
    return DH.tap("evaluate", "check a tally", rng, { n }, "One number in this working is wrong. Tap it.", `${tally(n)} = ${Math.floor(n / 5) * 4 + (n % 5)}`, String(Math.floor(n / 5) * 4 + (n % 5)));
  },
  "pictorial|remember": (rng) => {
    const v = CLASSES.map(() => 100 * int(rng, 4, 10));
    const i = int(rng, 0, 3);
    return DH.mc("pictorial", "remember", "reading a bar graph", rng, { a: v[0], b: v[1], c: v[2], d: v[3], i }, `How much did ${CLASSES[i]} raise?`, card(CLASSES.map((c, k) => `${c}: ${"█".repeat(v[k] / 100)}`), "Money raised (each █ = ₹100)"), `₹${v[i]}`, [[`₹${v[i] / 100}`, "m3-key"], [`₹${v[i] + 100}`, "m3-key"], [`₹${v.reduce((x, y) => x + y, 0)}`, "m3-graph"]]);
  },
  "pictorial|understand": (rng) => {
    const total = 4 * int(rng, 10, 50);
    return DH.mc("pictorial", "understand", "interpreting a pie chart", rng, { total }, `${total} people chose a fruit. How many chose apple?`, { kind: "figure", figure: "pie", slices: [{ value: 2, label: "Apple" }, { value: 1, label: "Mango" }, { value: 1, label: "Grapes" }] }, String(total / 2), [[String(total / 4), "m4-pie"], [String(total / 3 % 1 ? total / 2 + 4 : total / 3), "m4-pie"], [String(total), "m4-pie"]]);
  },
  "pictorial|apply": (rng) => {
    const t = [int(rng, 18, 24), int(rng, 25, 30), int(rng, 31, 36), int(rng, 26, 30)];
    const hrs = ["8 am", "10 am", "12 pm", "2 pm"];
    return DH.mc("pictorial", "apply", "line graph: change", rng, { a: t[0], b: t[1], c: t[2], d: t[3] }, "By how many degrees did it warm up from 8 am to 12 pm?", card(hrs.map((h, i) => `${h}: ${t[i]}°C`), "Line graph points"), `${t[2] - t[0]}°C`, [[`${t[2] + t[0]}°C`, "m3-op"], [`${t[2]}°C`, "m5-line-graph"], [`${t[1] - t[0]}°C`, "m5-line-graph"]]);
  },
  "pictorial|analyze": (rng) => {
    const v = CLASSES.map(() => 100 * int(rng, 4, 10));
    if (new Set(v).size < 4) throw new Error("tie");
    const mx = Math.max(...v), mn = Math.min(...v);
    return DH.mc("pictorial", "analyze", "comparing bars", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, "How much more did the top class raise than the bottom class?", card(CLASSES.map((c, k) => `${c}: ${"█".repeat(v[k] / 100)}`), "Money raised (each █ = ₹100)"), `₹${mx - mn}`, [[`₹${(mx - mn) / 100}`, "m3-key"], [`₹${mx + mn}`, "m3-graph"], [`₹${mx}`, "m3-graph"]]);
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return DH.mc("pictorial", "evaluate", "judge a conclusion", rng, { r: right ? 1 : 0 }, `Riya says ${right ? "half" : "a third"} of the students walk to school. Is she right?`, { kind: "figure", figure: "pie", slices: [{ value: 2, label: "Walk" }, { value: 1, label: "Bus" }, { value: 1, label: "Car" }] }, right ? "Yes: the Walk slice is half the circle" : "No: the Walk slice is half the circle", [
      [right ? "No: it is a quarter" : "Yes: there are three slices", "m4-pie"],
      ["No: you can't tell from a pie chart", "m4-pie"],
      ["Yes: every slice is a third", "m4-pie"],
    ]);
  },
  "abstract|remember": (rng) => {
    const i = int(rng, 0, 2);
    const q: [string, string, string[], string][] = [["A graph that shows change over time with points joined by lines is a ___", "line graph", ["pie chart", "bar graph", "pictograph"], "m5-line-graph"], ["In a pie chart, the whole circle stands for ___", "the total", ["one item", "the biggest group", "zero"], "m4-pie"], ["Tally marks are grouped in ___", "fives", ["fours", "tens", "twos"], "m3-tally"]];
    return DH.mc("abstract", "remember", "data words", rng, { i }, q[i][0], null, q[i][1], q[i][2].map((t) => [t, q[i][3]] as [string, string]));
  },
  "abstract|understand": (rng) => {
    const n = int(rng, 11, 29);
    return DH.mc("abstract", "understand", "tally marks", rng, { n }, `How many is ${tally(n)} (卌 = 5)?`, null, String(n), [[String(Math.floor(n / 5) * 4 + (n % 5)), "m3-tally"], [String(Math.floor(n / 5) + (n % 5)), "m3-tally"], [String(n + 5), "m3-tally"]]);
  },
  "abstract|apply": (rng) => {
    const total = 4 * int(rng, 10, 60);
    return DH.mc("abstract", "apply", "pie chart quarters", rng, { total }, `A pie chart of ${total} votes has a quarter for 'No'. How many voted No?`, null, String(total / 4), [[String(total / 2), "m4-pie"], [String(total - total / 4), "m4-pie"], [String(4), "m4-pie"]]);
  },
  "abstract|analyze": (rng) => {
    const v = CLASSES.map(() => 100 * int(rng, 4, 10));
    if (new Set(v).size < 4) throw new Error("tie");
    return DH.mc("abstract", "analyze", "totals", rng, { a: v[0], b: v[1], c: v[2], d: v[3] }, `Money raised: ${CLASSES.map((c, i) => `${c} ₹${v[i]}`).join(", ")}. What was raised in all?`, null, `₹${fmt(v.reduce((x, y) => x + y, 0))}`, [[`₹${Math.max(...v)}`, "m3-graph"], [`₹${fmt(v.reduce((x, y) => x + y, 0) - 100)}`, "m3-graph"], [`₹${v.length}`, "m3-graph"]]);
  },
  "abstract|evaluate": (rng) => {
    const t = [int(rng, 20, 24), int(rng, 25, 28), int(rng, 29, 32), int(rng, 22, 26)];
    return DH.mc("abstract", "evaluate", "trend in a line graph", rng, { a: t[0], b: t[1], c: t[2], d: t[3] }, `Temperatures at 8, 10, 12 and 2 o'clock were ${t.join(", ")}°C. What does the line graph show?`, null, "It rose until 12, then fell", [["It rose all day", "m5-line-graph"], ["It fell all day", "m5-line-graph"], ["It stayed the same", "m5-line-graph"]]);
  },
}));

// ---------------- Chapter 14: Patterns and Symmetry ----------------
const PS = kit("ps5", "patterns-symmetry");
export const PATTERNS_G5: Record<string, Template> = noEcho(safe({
  "concrete|remember": (rng) => {
    const k = int(rng, 11, 25), s = int(rng, 1, 3);
    const seq = [0, 1, 2, 3].map((i) => k * (s + i));
    const next = k * (s + 4);
    const line = [next, next + 1, next + k, next - 1].map(String);
    return PS.tap("remember", "number patterns", rng, { k, s }, `${seq.join(", ")}, … Tap the next number.`, line.sort(() => rng() - 0.5).join("   "), String(next), [{ phrase: String(next + k), mistake: "m3-pattern" }]);
  },
  "concrete|understand": (rng) => {
    const n = int(rng, 3, 4);
    return PS.shade("understand", "square number patterns", rng, { n }, `The pattern 1, 4, 9, 16, … uses square arrays. Shade step ${n}.`, 4, 9, n * n, "1 square", [[n * (n - 1), "m3-pattern"], [2 * n, "m3-pattern"]]);
  },
  "concrete|apply": (rng) => {
    const k = int(rng, 1, 3);
    return PS.order("apply", "turns", rng, { k }, "Put the turns in order, smallest first.", "quarter turn | half turn | three-quarter turn | full turn", [], [["half turn quarter turn three-quarter turn full turn", "m5-turn"]]);
  },
  "concrete|analyze": (rng) => {
    const sym = ["A", "H", "M", "T", "U", "V", "W", "X", "Y", "O"], not = ["F", "G", "J", "L", "N", "P", "Q", "R", "S", "Z"];
    const y = pick(rng, sym);
    const n = [...not].sort(() => rng() - 0.5).slice(0, 3);
    return PS.tap("analyze", "symmetric letters", rng, { y: sym.indexOf(y) }, "Tap the letter that has a line of symmetry.", [y, ...n].sort(() => rng() - 0.5).join("   "), y, [{ phrase: n[0], mistake: "m3-symmetry" }]);
  },
  "concrete|evaluate": (rng) => {
    const k = int(rng, 1, 3);
    return PS.tap("evaluate", "turns", rng, { k }, "One number in this sentence is wrong. Tap it.", "A half turn is 90° and a full turn is 360°.", "90°");
  },
  "pictorial|remember": (rng) => {
    const s = int(rng, 2, 9), m = pick(rng, [2, 3]);
    const seq = [0, 1, 2, 3].map((i) => s * m ** i);
    return PS.mc("pictorial", "remember", "the rule", rng, { s, m }, "What is the rule?", card([seq.join(",  ") + ",  …"]), `Multiply by ${m}`, [[`Add ${seq[1] - seq[0]}`, "m3-pattern"], [`Add ${m}`, "m3-pattern"], [`Multiply by ${m + 1}`, "m3-pattern"]]);
  },
  "pictorial|understand": (rng) => {
    const all: ["square" | "rectangle" | "circle", string, string[]][] = [["square", "4", ["2", "1", "8"]], ["rectangle", "2", ["4", "1", "0"]], ["circle", "Countless (endless)", ["4", "1", "2"]]];
    const i = int(rng, 0, 2);
    return PS.mc("pictorial", "understand", "lines of symmetry", rng, { i }, "How many lines of symmetry does this shape have?", { kind: "shape", shape: all[i][0] }, all[i][1], all[i][2].map((t) => [t, "m3-symmetry"] as [string, string]));
  },
  "pictorial|apply": (rng) => {
    const cols = 8, r = int(rng, 1, 3), left = int(rng, 1, 3);
    return PS.mc("pictorial", "apply", "completing a symmetric figure", rng, { r, left }, `The line of symmetry runs down the middle. Column ${left} is coloured. Which column completes the figure?`, { kind: "grid", rows: 3, cols, cells: [(r - 1) * cols + (left - 1)] }, `Column ${cols - left + 1}`, [[`Column ${left + 4}`, "m4-mirror"], [`Column ${left + 1}`, "m4-mirror"], [`Column ${cols / 2}`, "m4-mirror"]]);
  },
  "pictorial|analyze": (rng) => {
    const turns: [string, string][] = [["a quarter turn clockwise", "→ (pointing right)"], ["a half turn", "↓ (pointing down)"], ["a three-quarter turn clockwise", "← (pointing left)"], ["a full turn", "↑ (pointing up)"]];
    const i = int(rng, 0, 3);
    return PS.mc("pictorial", "analyze", "turning a figure", rng, { i }, `The arrow points up. After ${turns[i][0]}, where does it point?`, card(["↑"]), turns[i][1], turns.filter((_, k) => k !== i).map(([, t]) => [t, "m5-turn"] as [string, string]));
  },
  "pictorial|evaluate": (rng) => {
    const right = rng() < 0.5;
    return PS.mc("pictorial", "evaluate", "judge a claim", rng, { r: right ? 1 : 0 }, "Is Riya right?", card([right ? "Riya: After a full turn, a shape looks exactly as it started." : "Riya: After a half turn, a shape looks exactly as it started."]), right ? "Yes: a full turn is 360°" : "No: a half turn (180°) turns it upside down", [
      [right ? "No: it ends upside down" : "Yes: half turns don't change anything", "m5-turn"],
      ["No: shapes can't turn", "m5-turn"],
      ["Yes: every turn brings it back", "m5-turn"],
    ]);
  },
  "abstract|remember": (rng) => {
    const i = int(rng, 0, 2);
    const q: [string, string, string[]][] = [["A quarter turn is ___", "90°", ["45°", "180°", "25°"]], ["A three-quarter turn is ___", "270°", ["75°", "180°", "300°"]], ["A half turn is ___", "180°", ["90°", "50°", "360°"]]];
    return PS.mc("abstract", "remember", "turns", rng, { i }, q[i][0], null, q[i][1], q[i][2].map((t) => [t, "m5-turn"] as [string, string]));
  },
  "abstract|understand": (rng) => {
    const s = int(rng, 100, 300), k = int(rng, 7, 25);
    const seq = [0, 1, 2, 3].map((i) => s - i * k);
    return PS.mc("abstract", "understand", "decreasing patterns", rng, { s, k }, `${seq.join(", ")}, ___`, null, String(s - 4 * k), [[String(s - 4 * k + 1), "m3-pattern"], [String(s - 5 * k), "m3-pattern"], [String(s - 3 * k + k * 2), "m3-pattern"]]);
  },
  "abstract|apply": (rng) => {
    const n = int(rng, 5, 12);
    return PS.mc("abstract", "apply", "square numbers", rng, { n }, `1, 4, 9, 16, … What is the ${n}th number?`, null, String(n * n), [[String(2 * n), "m3-pattern"], [String((n - 1) * (n - 1)), "m3-pattern"], [String(n * (n + 1)), "m3-pattern"]]);
  },
  "abstract|analyze": (rng) => {
    const s = int(rng, 1, 20), k = int(rng, 4, 15), n = int(rng, 10, 20);
    return PS.mc("abstract", "analyze", "a later term", rng, { s, k, n }, `A pattern starts at ${s} and adds ${k} each time. What is the ${n}th number?`, null, String(s + (n - 1) * k), [[String(s + n * k), "m3-pattern"], [String(n * k), "m3-pattern"], [String(s + (n - 2) * k), "m3-pattern"]]);
  },
  "abstract|evaluate": (rng) => {
    const i = int(rng, 0, 2);
    const q: [string, string, string[]][] = [["How many lines of symmetry does a regular hexagon have?", "6", ["3", "2", "12"]], ["Which letter has two lines of symmetry?", "H", ["A", "T", "F"]], ["How many quarter turns make a full turn?", "4", ["2", "3", "8"]]];
    return PS.mc("abstract", "evaluate", "symmetry and turns", rng, { i }, q[i][0], null, q[i][1], q[i][2].map((t) => [t, i === 2 ? "m5-turn" : "m3-symmetry"] as [string, string]));
  },
}));
