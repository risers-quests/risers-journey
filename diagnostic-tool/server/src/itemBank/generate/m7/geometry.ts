import { Template, int, pick } from "../core.js";
import { Misconceptions, card, kit, safe } from "./kit.js";

/** Grade 7 Maths, Chapters 10, 11, 14, 15, 16: lines and angles; triangles; congruence and constructions; perimeter and area. */
export const MISCONCEPTIONS: Misconceptions = {
  "ang-comp-supp": { label: "Mixes up complementary and supplementary", detail: "Uses 180° for complementary or 90° for supplementary.", childTip: "Complementary: add to 90°. Supplementary: add to 180° (a straight line)." },
  "ang-vertical": { label: "Misses vertically opposite angles", detail: "Thinks vertically opposite angles add to 180°.", childTip: "Vertically opposite angles are equal; it's the angles side by side (a linear pair) that add to 180°." },
  "ang-parallel": { label: "Mixes up angles at parallel lines", detail: "Thinks co-interior angles are equal, or alternate angles add to 180°.", childTip: "Corresponding and alternate angles are equal. Co-interior angles (same side, between the lines) add to 180°." },
  "ang-kind": { label: "Names the kind of angle wrongly", detail: "Mixes up acute, obtuse, reflex and right angles.", childTip: "Acute < 90°, right = 90°, obtuse between 90° and 180°, straight = 180°, reflex > 180°." },
  "tri-sum": { label: "Gets the angle sum of a triangle wrong", detail: "Uses 360° or forgets one angle.", childTip: "The three angles of a triangle add up to 180°." },
  "tri-exterior": { label: "Gets the exterior angle wrong", detail: "Subtracts from 180° instead of adding the two opposite interior angles.", childTip: "An exterior angle equals the sum of the two interior opposite angles." },
  "tri-sides": { label: "Misjudges whether three lengths make a triangle", detail: "Forgets that any two sides must add to more than the third.", childTip: "Check the two shortest sides: they must add to more than the longest." },
  "tri-pythagoras": { label: "Uses Pythagoras' theorem wrongly", detail: "Adds the sides instead of their squares, or finds a leg as if it were the hypotenuse.", childTip: "Hypotenuse² = leg² + leg². For a leg: leg² = hypotenuse² − other leg²." },
  "tri-kind": { label: "Names the kind of triangle wrongly", detail: "Mixes up scalene, isosceles and equilateral, or acute, right and obtuse.", childTip: "By sides: all different (scalene), two equal (isosceles), all equal (equilateral). By angles: look at the largest angle." },
  "cong-criterion": { label: "Picks the wrong congruence rule", detail: "Uses AAA or SSA, which don't prove congruence, or names the wrong rule.", childTip: "SSS, SAS (the angle between the two sides), ASA and RHS prove two triangles congruent. AAA only proves the same shape." },
  "cong-parts": { label: "Matches the wrong corresponding parts", detail: "Pairs a side or angle with the wrong partner in the other triangle.", childTip: "Follow the order of the letters: in △ABC ≅ △PQR, A matches P, B matches Q, AB matches PQ." },
  "pa-formula": { label: "Uses the wrong area or perimeter formula", detail: "Mixes up area and perimeter, or forgets ½ for a triangle.", childTip: "Rectangle: area l × b, perimeter 2(l + b). Triangle: ½ × base × height. Parallelogram: base × height." },
  "pa-circle": { label: "Mixes up circumference and area of a circle", detail: "Uses πr² for circumference or 2πr for area, or uses the diameter as the radius.", childTip: "Circumference = 2πr. Area = πr². The radius is half the diameter." },
  "pa-units": { label: "Uses the wrong units", detail: "Gives an area in cm, or a perimeter in cm².", childTip: "Lengths and perimeters: cm. Areas: cm² (square units)." },
};

const deg = (n: number) => `${n}°`;

// ---------------- Lines and Angles ----------------
const LA = kit("lan7", "g7-angles");
export const ANGLES_G7: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const x = 10 * int(rng, 1, 8);
    return LA.shade("remember", "complement", rng, { x }, `Each square is 10°. Shade the complement of ${deg(x)}.`, 1, 9, (90 - x) / 10, "1 square = 10°", [[(180 - x) / 10 <= 9 ? (180 - x) / 10 : -1, "ang-comp-supp"], [x / 10, "ang-comp-supp"]]);
  },
  "concrete|understand": (rng) => {
    const x = 10 * int(rng, 2, 16);
    return LA.shade("understand", "supplement", rng, { x }, `Each square is 10°. Shade the supplement of ${deg(x)}.`, 2, 9, (180 - x) / 10, "1 square = 10°", [[(90 - x) / 10, "ang-comp-supp"], [x / 10, "ang-comp-supp"]]);
  },
  "concrete|apply": (rng) => {
    const x = 10 * int(rng, 2, 16);
    return LA.shade("apply", "vertically opposite", rng, { x }, `Two lines cross. One angle is ${deg(x)}. Each square is 10°: shade the angle vertically opposite it.`, 2, 9, x / 10, "1 square = 10°", [[(180 - x) / 10, "ang-vertical"]]);
  },
  "concrete|analyze": (rng) => {
    const a = 10 * int(rng, 3, 12), b = 10 * int(rng, 3, 12);
    if (a + b >= 340) throw new Error("too big");
    return LA.shade("analyze", "angles at a point", rng, { a, b }, `Three angles make a full turn. Two are ${deg(a)} and ${deg(b)}. Each square is 10°: shade the third.`, 4, 9, (360 - a - b) / 10, "1 square = 10°", [[(180 - a - b) / 10, "ang-comp-supp"]]);
  },
  "concrete|evaluate": (rng) => {
    const x = 5 * int(rng, 3, 15);
    return LA.tap("evaluate", "checking a pair", rng, { x }, "One number in this working is wrong. Tap it.", `${x}° and ${180 - x}° are complementary`, "complementary");
  },
  "pictorial|remember": (rng) => {
    const x = 5 * int(rng, 2, 70);
    const kind = x < 90 ? "Acute" : x === 90 ? "Right" : x < 180 ? "Obtuse" : x === 180 ? "Straight" : "Reflex";
    return LA.mc("pictorial", "remember", "kinds of angle", rng, { x }, "What kind of angle is marked?", { kind: "figure", figure: "pie", slices: [{ value: x, label: deg(x) }, { value: 360 - x, label: "" }] }, kind, ["Acute", "Right", "Obtuse", "Reflex", "Straight"].filter((k) => k !== kind).slice(0, 3).map((t) => [t, "ang-kind"] as [string, string]));
  },
  "pictorial|understand": (rng) => {
    const x = 5 * int(rng, 4, 32);
    return LA.mc("pictorial", "understand", "linear pair", rng, { x }, "These two angles form a straight line. What is angle b?", { kind: "figure", figure: "pie", slices: [{ value: x, label: deg(x) }, { value: 180 - x, label: "b" }, { value: 180, label: "" }] }, deg(180 - x), [[deg(90 - x > 0 ? 90 - x : 360 - x), "ang-comp-supp"], [deg(x), "ang-vertical"], [deg(360 - x), "ang-comp-supp"]]);
  },
  "pictorial|apply": (rng) => {
    const a = 10 * int(rng, 4, 14), b = 10 * int(rng, 4, 14);
    if (a + b >= 330 || 360 - a - b === a || 360 - a - b === b) throw new Error("too big");
    return LA.mc("pictorial", "apply", "angles at a point", rng, { a, b }, "What is angle x?", { kind: "figure", figure: "pie", slices: [{ value: a, label: deg(a) }, { value: b, label: deg(b) }, { value: 360 - a - b, label: "x" }] }, deg(360 - a - b), [[deg(Math.abs(180 - a - b) || 5), "ang-comp-supp"], [deg(a + b), "ang-vertical"], [deg(360 - a), "ang-comp-supp"]]);
  },
  "pictorial|analyze": (rng) => {
    const x = 5 * int(rng, 9, 30);
    const which = pick(rng, ["alternate", "corresponding", "co-interior"] as const);
    const w = ["alternate", "corresponding", "co-interior"].indexOf(which);
    if (which === "co-interior") return LA.mc("pictorial", "analyze", "parallel lines", rng, { x, w }, `Two parallel lines are cut by a transversal. What is the co-interior angle?`, card([`Angle: ${deg(x)}`, `Its co-interior angle: ?`], "Parallel lines cut by a transversal"), deg(180 - x), [[deg(x), "ang-parallel"], [deg(90 - (x % 90) || 45), "ang-comp-supp"], [deg(360 - x), "ang-parallel"]]);
    return LA.mc("pictorial", "analyze", "parallel lines", rng, { x, w }, `Two parallel lines are cut by a transversal. How does the ${which} angle compare with this one?`, card([`Angle: ${deg(x)}`, `Its ${which} angle: ?`], "Parallel lines cut by a transversal"), "It is equal to it", [["It adds with it to 180°", "ang-parallel"], ["It adds with it to 90°", "ang-comp-supp"], ["It is double it", "ang-parallel"]]);
  },
  "pictorial|evaluate": (rng) => {
    const x = 10 * int(rng, 3, 15);
    const right = rng() < 0.5;
    return LA.mc("pictorial", "evaluate", "judge a claim", rng, { x, r: right ? 1 : 0 }, "Is Riya right?", card([`Riya: Vertically opposite angles of ${deg(x)} and ${deg(right ? x : 180 - x)} are formed when two lines cross.`]), right ? "Yes: vertically opposite angles are equal" : "No: vertically opposite angles are equal, not supplementary", [
      [right ? "No: vertically opposite angles are equal, not supplementary" : "Yes: vertically opposite angles are equal", "ang-vertical"],
      ["No: vertically opposite angles add to 90°", "ang-comp-supp"],
      ["Yes: any two angles can be vertically opposite", "ang-vertical"],
    ]);
  },
  "abstract|remember": (rng) => {
    const x = 5 * int(rng, 2, 17);
    return LA.mc("abstract", "remember", "complement", rng, { x }, `The complement of ${deg(x)} is ___`, null, deg(90 - x), [[deg(180 - x), "ang-comp-supp"], [deg(360 - x), "ang-comp-supp"], [deg(x), "ang-vertical"]]);
  },
  "abstract|understand": (rng) => {
    const x = 5 * int(rng, 2, 34);
    return LA.mc("abstract", "understand", "supplement", rng, { x }, `The supplement of ${deg(x)} is ___`, null, deg(180 - x), [[deg(Math.abs(90 - x) || 45), "ang-comp-supp"], [deg(360 - x), "ang-comp-supp"], [deg(x), "ang-vertical"]]);
  },
  "abstract|apply": (rng) => {
    const k = int(rng, 2, 5);
    const small = 180 / (k + 1);
    if (!Number.isInteger(small)) throw new Error("not whole");
    return LA.mc("abstract", "apply", "ratio of a linear pair", rng, { k }, `Two angles of a linear pair are in the ratio 1 : ${k}. The smaller angle is ___`, null, deg(small), [[deg(90 / (k + 1)), "ang-comp-supp"], [deg(small * k), "ang-kind"], [deg(180 / k), "ang-comp-supp"]]);
  },
  "abstract|analyze": (rng) => {
    const x = 5 * int(rng, 9, 30);
    return LA.mc("abstract", "analyze", "co-interior angles", rng, { x }, `Two co-interior angles between parallel lines: one is ${deg(x)}. The other is ___`, null, deg(180 - x), [[deg(x), "ang-parallel"], [deg(360 - x), "ang-parallel"], [deg(Math.abs(90 - x) || 45), "ang-comp-supp"]]);
  },
  "abstract|evaluate": (rng) => {
    const pairs: [string, string, string][] = [["35° and 55°", "Complementary", "Supplementary"], ["110° and 70°", "Supplementary", "Complementary"], ["45° and 45°", "Complementary", "Supplementary"], ["125° and 55°", "Supplementary", "Complementary"], ["60° and 30°", "Complementary", "Supplementary"]];
    const i = int(rng, 0, pairs.length - 1);
    const [p, a, w] = pairs[i];
    return LA.mc("abstract", "evaluate", "which pair", rng, { i }, `The angles ${p} are ___`, null, a, [[w, "ang-comp-supp"], ["Vertically opposite", "ang-vertical"], ["Neither", "ang-comp-supp"]]);
  },
});

// ---------------- Properties of Triangles (+ constructions) ----------------
const TR = kit("tri7", "g7-triangles");
const TRIPLES: [number, number, number][] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]];
export const TRIANGLES_G7: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const a = 10 * int(rng, 3, 8), b = 10 * int(rng, 3, 8);
    if (a + b >= 170) throw new Error("too big");
    return TR.shade("remember", "angle sum", rng, { a, b }, `A triangle has angles ${deg(a)} and ${deg(b)}. Each square is 10°: shade the third angle.`, 2, 9, (180 - a - b) / 10, "1 square = 10°", [[(360 - a - b) / 10 <= 18 ? (360 - a - b) / 10 : -1, "tri-sum"], [(a + b) / 10, "tri-exterior"]]);
  },
  "concrete|understand": (rng) => {
    const a = 10 * int(rng, 3, 8), b = 10 * int(rng, 3, 8);
    if (a + b >= 170) throw new Error("too big");
    return TR.shade("understand", "exterior angle", rng, { a, b }, `Two interior angles of a triangle are ${deg(a)} and ${deg(b)}. Each square is 10°: shade the exterior angle opposite them.`, 2, 9, (a + b) / 10, "1 square = 10°", [[(180 - a - b) / 10, "tri-exterior"]]);
  },
  "concrete|apply": (rng) => {
    const [a, b, c] = pick(rng, TRIPLES);
    return TR.order("apply", "Pythagoras", rng, { a, b }, `Build Pythagoras' theorem for a right triangle with legs ${a} and ${b}.`, `${a}² | + | ${b}² | = | ${c}²`, [`${a + b}²`], [[`${a}² + ${b}² = ${a + b}²`, "tri-pythagoras"]]);
  },
  "concrete|analyze": (rng) => {
    const a = int(rng, 2, 9), b = int(rng, 2, 9);
    const ok = int(rng, Math.abs(a - b) + 1, a + b - 1), bad = a + b + int(rng, 0, 3);
    const line = [a, b, ok, bad].map(String);
    if (new Set(line).size < 4) throw new Error("repeat");
    return TR.tap("analyze", "constructing a triangle", rng, { a, b, ok, bad }, `Sides ${a} cm and ${b} cm are drawn. Tap the third length that CAN make a triangle.`, `${ok} cm   ${bad} cm`, String(ok), [{ phrase: String(bad), mistake: "tri-sides" }]);
  },
  "concrete|evaluate": (rng) => {
    const a = 10 * int(rng, 3, 7), b = 10 * int(rng, 3, 7);
    const wrong = 360 - a - b;
    return TR.tap("evaluate", "checking the sum", rng, { a, b }, "One number in this working is wrong. Tap it.", `Third angle = 360° − ${a}° − ${b}° = ${wrong}°`, "360°");
  },
  "pictorial|remember": (rng) => {
    const kinds: [string, string[]][] = [["Equilateral", ["5 cm", "5 cm", "5 cm"]], ["Isosceles", ["6 cm", "6 cm", "4 cm"]], ["Scalene", ["4 cm", "6 cm", "7 cm"]]];
    const i = int(rng, 0, 2);
    return TR.mc("pictorial", "remember", "kinds by sides", rng, { i }, "What kind of triangle is this?", { kind: "shape", shape: "triangle", sideLabels: kinds[i][1] }, kinds[i][0], [...kinds.filter((_, k) => k !== i).map(([n]) => [n, "tri-kind"] as [string, string]), ["Right-angled", "tri-kind"]]);
  },
  "pictorial|understand": (rng) => {
    const a = 5 * int(rng, 6, 16), b = 5 * int(rng, 6, 16);
    if (a + b >= 170 || 180 - a - b === a || 180 - a - b === b) throw new Error("too big");
    return TR.mc("pictorial", "understand", "angle sum", rng, { a, b }, "What is angle x?", { kind: "shape", shape: "triangle", angleLabels: [deg(a), deg(b), "x"] }, deg(180 - a - b), [[deg(360 - a - b), "tri-sum"], [deg(a + b), "tri-exterior"], [deg(Math.abs(90 - a - b) || 15), "tri-sum"]]);
  },
  "pictorial|apply": (rng) => {
    const [a, b, c] = pick(rng, TRIPLES);
    return TR.mc("pictorial", "apply", "the hypotenuse", rng, { a, b }, "How long is the hypotenuse?", { kind: "shape", shape: "right-triangle", sideLabels: [`${a} cm`, `${b} cm`, "?"] }, `${c} cm`, [[`${a + b} cm`, "tri-pythagoras"], [`${a * a + b * b} cm`, "tri-pythagoras"], [`${Math.abs(b - a) || 1} cm`, "tri-pythagoras"]]);
  },
  "pictorial|analyze": (rng) => {
    const [a, b, c] = pick(rng, TRIPLES);
    return TR.mc("pictorial", "analyze", "finding a leg", rng, { a, c }, "How long is the missing side?", { kind: "shape", shape: "right-triangle", sideLabels: [`${a} cm`, "?", `${c} cm`] }, `${b} cm`, [[`${Math.round(Math.sqrt(a * a + c * c) * 10) / 10} cm`, "tri-pythagoras"], [`${c - a} cm`, "tri-pythagoras"], [`${a + c} cm`, "tri-pythagoras"]]);
  },
  "pictorial|evaluate": (rng) => {
    const a = 10 * int(rng, 3, 6), b = 10 * int(rng, 3, 6);
    const right = rng() < 0.5;
    const said = right ? a + b : 180 - a - b;
    return TR.mc("pictorial", "evaluate", "judge the exterior angle", rng, { a, b, r: right ? 1 : 0 }, "Riya says the exterior angle is this. Is she right?", card([`Interior opposite angles: ${deg(a)} and ${deg(b)}`, `Riya: exterior angle = ${deg(said)}`]), right ? "Yes: it equals the sum of the two opposite interior angles" : "No: it should be the sum of the two opposite interior angles", [
      [right ? "No: it should be the sum of the two opposite interior angles" : "Yes: it equals the sum of the two opposite interior angles", "tri-exterior"],
      ["No: exterior angles are always 90°", "tri-exterior"],
      ["Yes: it is 180° minus both angles", "tri-sum"],
    ]);
  },
  "abstract|remember": (rng) => {
    const qs: [string, string, string[], string][] = [
      ["The angles of a triangle add up to ___", "180°", ["360°", "90°", "270°"], "tri-sum"],
      ["In an equilateral triangle, each angle is ___", "60°", ["90°", "45°", "180°"], "tri-kind"],
      ["The longest side of a right triangle is called the ___", "hypotenuse", ["base", "altitude", "median"], "tri-pythagoras"],
      ["A triangle can be drawn only if the sum of any two sides is ___ the third side", "greater than", ["less than", "equal to", "half of"], "tri-sides"],
    ];
    const i = int(rng, 0, qs.length - 1);
    const [q, a, w, m] = qs[i];
    return TR.mc("abstract", "remember", "facts about triangles", rng, { i }, q, null, a, w.map((t) => [t, m] as [string, string]));
  },
  "abstract|understand": (rng) => {
    const x = 5 * int(rng, 6, 30);
    return TR.mc("abstract", "understand", "isosceles", rng, { x }, `An isosceles triangle has a top angle of ${deg(x)}. Each base angle is ___`, null, deg((180 - x) / 2), [[deg(180 - x), "tri-sum"], [deg(x), "tri-kind"], [deg((360 - x) / 2), "tri-sum"]]);
  },
  "abstract|apply": (rng) => {
    const sets: [number, number, number][] = [];
    const a = int(rng, 2, 8), b = int(rng, 2, 8), c = a + b + int(rng, 0, 4), ok = int(rng, Math.abs(a - b) + 1, a + b - 1);
    sets.push([a, b, ok], [a, b, c]);
    const bad2 = [a, a + b + 1, b] as [number, number, number];
    const bad3 = [b, a, a + b] as [number, number, number];
    const t = (s: number[]) => s.join(" cm, ") + " cm";
    return TR.mc("abstract", "apply", "can it be a triangle?", rng, { a, b, ok }, "Which three lengths can form a triangle?", null, t([a, b, ok]), [[t([a, b, c]), "tri-sides"], [t(bad2), "tri-sides"], [t(bad3), "tri-sides"]]);
  },
  "abstract|analyze": (rng) => {
    const [a, b, c] = pick(rng, TRIPLES);
    const m = int(rng, 1, 2);
    return TR.mc("abstract", "analyze", "is it right-angled?", rng, { a, b, m }, `Do the sides ${a * m}, ${b * m}, ${c * m} make a right triangle?`, null, `Yes: ${a * m}² + ${b * m}² = ${c * m}²`, [[`No: ${a * m} + ${b * m} ≠ ${c * m}`, "tri-pythagoras"], [`No: right triangles must have sides 3, 4, 5`, "tri-pythagoras"], [`Yes: ${a * m} + ${b * m} > ${c * m}`, "tri-sides"]]);
  },
  "abstract|evaluate": (rng) => {
    const a = 10 * int(rng, 2, 8), b = 10 * int(rng, 2, 8);
    if (a + b >= 170) throw new Error("too big");
    const c = 180 - a - b;
    const big = Math.max(a, b, c);
    const kind = big > 90 ? "Obtuse-angled" : big === 90 ? "Right-angled" : "Acute-angled";
    return TR.mc("abstract", "evaluate", "kinds by angles", rng, { a, b }, `A triangle has angles ${deg(a)} and ${deg(b)}. It is ___`, null, kind, ["Acute-angled", "Right-angled", "Obtuse-angled", "Equiangular"].filter((k) => k !== kind).map((t) => [t, "tri-kind"] as [string, string]));
  },
});

// ---------------- Congruence of Triangles ----------------
const CG = kit("cng7", "g7-congruence");
const CRIT: [string, string][] = [
  ["AB = PQ, BC = QR, CA = RP", "SSS"],
  ["AB = PQ, ∠B = ∠Q, BC = QR", "SAS"],
  ["∠A = ∠P, AB = PQ, ∠B = ∠Q", "ASA"],
  ["∠B = ∠Q = 90°, hypotenuse AC = PR, AB = PQ", "RHS"],
];
const LETTERS = ["A", "B", "C"], PL = ["P", "Q", "R"];
export const CONGRUENCE_G7: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const i = int(rng, 0, 3);
    return CG.tap("remember", "the rule", rng, { i }, "Which rule do these facts prove congruence by? Tap it.", "SSS SAS ASA RHS AAA", CRIT[i][1], [{ phrase: "AAA", mistake: "cong-criterion" }]);
  },
  "concrete|understand": (rng) => {
    const i = int(rng, 0, 2), j = int(rng, 0, 2);
    if (i === j) throw new Error("same");
    const side = LETTERS[i] + LETTERS[j], match = PL[i] + PL[j];
    const others = ["PQ", "QR", "RP", "QP", "RQ", "PR"].filter((s) => s !== match && s !== match.split("").reverse().join(""));
    return CG.tap("understand", "corresponding parts", rng, { i, j }, `△ABC ≅ △PQR. Tap the side that matches ${side}.`, [match, ...others.slice(0, 3)].sort(() => rng() - 0.5).join("  "), match, [{ phrase: others[0], mistake: "cong-parts" }]);
  },
  "concrete|apply": (rng) => {
    const i = int(rng, 0, 3);
    return CG.order("apply", "naming the rule", rng, { i }, `Facts: ${CRIT[i][0]}. Build the statement.`, `△ABC | ≅ | △PQR | by | ${CRIT[i][1]}`, ["AAA"], [[`△ABC ≅ △PQR by AAA`, "cong-criterion"]]);
  },
  "concrete|analyze": (rng) => {
    const order = ["P", "Q", "R"];
    return CG.order("analyze", "matching vertices", rng, { k: int(rng, 1, 3) }, "A matches Q, B matches R, C matches P. Build the congruence statement.", "△ABC | ≅ | △QRP", ["△PQR"], [["△ABC ≅ △PQR", "cong-parts"]]);
  },
  "concrete|evaluate": (rng) => {
    const k = int(rng, 1, 3);
    return CG.tap("evaluate", "a wrong rule", rng, { k }, "One word in this claim is wrong. Tap it.", "If all three angles are equal, the triangles are congruent by AAA.", "AAA.");
  },
  "pictorial|remember": (rng) => {
    const i = int(rng, 0, 3);
    return CG.mc("pictorial", "remember", "which rule", rng, { i }, "Which rule shows these two triangles are congruent?", card([`△ABC and △PQR: ${CRIT[i][0]}`], "Given"), CRIT[i][1], [...CRIT.filter((_, k) => k !== i).slice(0, 2).map(([, r]) => [r, "cong-criterion"] as [string, string]), ["AAA", "cong-criterion"]]);
  },
  "pictorial|understand": (rng) => {
    const a = int(rng, 3, 9), b = int(rng, 3, 9), x = 10 * int(rng, 3, 10);
    return CG.mc("pictorial", "understand", "the included angle", rng, { a, b, x }, `For SAS, the angle must be between the two sides. AB = ${a} cm and BC = ${b} cm. Which angle is needed?`, { kind: "shape", shape: "triangle", sideLabels: [`AB = ${a} cm`, `BC = ${b} cm`, ""] }, "∠B", [["∠A", "cong-criterion"], ["∠C", "cong-criterion"], ["Any angle", "cong-criterion"]]);
  },
  "pictorial|apply": (rng) => {
    const a = int(rng, 4, 9), b = int(rng, 4, 9), c = int(rng, Math.abs(a - b) + 1, a + b - 1);
    if (new Set([a, b, c]).size < 3) throw new Error("repeat");
    return CG.mc("pictorial", "apply", "using congruence", rng, { a, b, c }, "△ABC ≅ △PQR. What is the perimeter of △PQR?", card([`△ABC ≅ △PQR`, `AB = ${a} cm, BC = ${b} cm, CA = ${c} cm`]), `${a + b + c} cm`, [[`${2 * (a + b + c)} cm`, "cong-parts"], [`${a + b} cm`, "cong-parts"], ["It can't be found", "cong-parts"]]);
  },
  "pictorial|analyze": (rng) => {
    const x = 10 * int(rng, 3, 10);
    return CG.mc("pictorial", "analyze", "corresponding angles", rng, { x }, `△DEF ≅ △XYZ and ∠E = ${deg(x)}. Which angle is also ${deg(x)}?`, card([`△DEF ≅ △XYZ`, `∠E = ${deg(x)}`]), "∠Y", [["∠X", "cong-parts"], ["∠Z", "cong-parts"], ["∠D", "cong-parts"]]);
  },
  "pictorial|evaluate": (rng) => {
    const k = int(rng, 1, 3);
    return CG.mc("pictorial", "evaluate", "judge a claim", rng, { k }, "Is Riya right?", card(["Riya: Two triangles with all three angles equal must be congruent."]), "No: they have the same shape but may be different sizes", [["Yes: AAA proves congruence", "cong-criterion"], ["Yes: equal angles mean equal sides", "cong-criterion"], ["No: congruent triangles never have equal angles", "cong-criterion"]]);
  },
  "abstract|remember": (rng) => {
    const k = int(rng, 1, 3);
    return CG.mc("abstract", "remember", "meaning", rng, { k }, "Congruent figures have ___", null, "the same shape and the same size", [["the same shape but any size", "cong-criterion"], ["the same area only", "cong-parts"], ["the same perimeter only", "cong-parts"]]);
  },
  "abstract|understand": (rng) => {
    const i = int(rng, 0, 3);
    return CG.mc("abstract", "understand", "which rule", rng, { i }, `${CRIT[i][0]}. By which rule is △ABC ≅ △PQR?`, null, CRIT[i][1], [...CRIT.filter((_, k) => k !== i).slice(0, 2).map(([, r]) => [r, "cong-criterion"] as [string, string]), ["AAA", "cong-criterion"]]);
  },
  "abstract|apply": (rng) => {
    const k = int(rng, 1, 3);
    return CG.mc("abstract", "apply", "RHS", rng, { k }, "RHS stands for ___", null, "Right angle, Hypotenuse, Side", [["Radius, Height, Side", "cong-criterion"], ["Right, Half, Same", "cong-criterion"], ["Ray, Hypotenuse, Square", "cong-criterion"]]);
  },
  "abstract|analyze": (rng) => {
    const k = int(rng, 1, 3);
    return CG.mc("abstract", "analyze", "what is missing", rng, { k }, "AB = PQ and BC = QR. What else proves △ABC ≅ △PQR by SAS?", null, "∠B = ∠Q", [["∠A = ∠P", "cong-criterion"], ["∠C = ∠R", "cong-criterion"], ["Nothing else is needed", "cong-criterion"]]);
  },
  "abstract|evaluate": (rng) => {
    const k = int(rng, 1, 3);
    return CG.mc("abstract", "evaluate", "which does not prove it", rng, { k }, "Which set of facts does NOT prove two triangles congruent?", null, "AAA", [["SSS", "cong-criterion"], ["ASA", "cong-criterion"], ["RHS", "cong-criterion"]]);
  },
});

// ---------------- Perimeter and Area ----------------
const PA = kit("par7", "g7-area");
const PI7 = 22 / 7;
export const AREA_G7: Record<string, Template> = safe({
  "concrete|remember": (rng) => {
    const l = int(rng, 3, 9), b = int(rng, 2, 6);
    return PA.shade("remember", "area of a rectangle", rng, { l, b }, `Shade the area of a ${l} cm × ${b} cm rectangle (1 square = 1 cm²).`, 6, 9, l * b, "1 square = 1 cm²", [[2 * (l + b), "pa-formula"], [l + b, "pa-formula"]]);
  },
  "concrete|understand": (rng) => {
    const base = 2 * int(rng, 2, 6), h = int(rng, 2, 6);
    return PA.shade("understand", "area of a triangle", rng, { base, h }, `Shade the area of a triangle with base ${base} cm and height ${h} cm (1 square = 1 cm²).`, 6, 9, (base * h) / 2, "1 square = 1 cm²", [[base * h, "pa-formula"], [base + h, "pa-formula"]]);
  },
  "concrete|apply": (rng) => {
    const b = int(rng, 3, 9), h = int(rng, 2, 6);
    return PA.shade("apply", "area of a parallelogram", rng, { b, h }, `Shade the area of a parallelogram with base ${b} cm and height ${h} cm (1 square = 1 cm²).`, 6, 9, b * h, "1 square = 1 cm²", [[(b * h) / 2, "pa-formula"], [2 * (b + h), "pa-formula"]]);
  },
  "concrete|analyze": (rng) => {
    const l = int(rng, 3, 9), b = int(rng, 2, 6);
    return PA.order("analyze", "perimeter", rng, { l, b }, `Build the perimeter of a ${l} cm × ${b} cm rectangle.`, `2 × (${l} + ${b}) | = | ${2 * (l + b)} cm`, [`${l * b} cm`], [[`2 × (${l} + ${b}) = ${l * b} cm`, "pa-formula"]]);
  },
  "concrete|evaluate": (rng) => {
    const r = 7 * int(rng, 1, 3);
    return PA.tap("evaluate", "checking units", rng, { r }, "One part of this working is wrong. Tap it.", `Area of the circle = 22/7 × ${r} × ${r} = ${(22 * r * r) / 7} cm`, `cm`, []);
  },
  "pictorial|remember": (rng) => {
    const l = int(rng, 4, 15), b = int(rng, 2, 9);
    if (l === b) throw new Error("square");
    return PA.mc("pictorial", "remember", "perimeter of a rectangle", rng, { l, b }, "What is the perimeter?", { kind: "shape", shape: "rectangle", sideLabels: [`${l} cm`, `${b} cm`] }, `${2 * (l + b)} cm`, [[`${l * b} cm`, "pa-formula"], [`${l + b} cm`, "pa-formula"], [`${2 * (l + b)} cm²`, "pa-units"]]);
  },
  "pictorial|understand": (rng) => {
    const base = int(rng, 4, 14), h = 2 * int(rng, 2, 7);
    return PA.mc("pictorial", "understand", "area of a triangle", rng, { base, h }, "What is the area?", { kind: "shape", shape: "right-triangle", sideLabels: [`${h} cm`, `${base} cm`, ""] }, `${(base * h) / 2} cm²`, [[`${base * h} cm²`, "pa-formula"], [`${base + h} cm²`, "pa-formula"], [`${(base * h) / 2} cm`, "pa-units"]]);
  },
  "pictorial|apply": (rng) => {
    const r = 7 * int(rng, 1, 4);
    return PA.mc("pictorial", "apply", "circumference", rng, { r }, "What is the circumference? (π = 22/7)", { kind: "shape", shape: "circle", sideLabels: [`r = ${r} cm`] }, `${Math.round(2 * PI7 * r)} cm`, [[`${Math.round(PI7 * r * r)} cm`, "pa-circle"], [`${Math.round(PI7 * r)} cm`, "pa-circle"], [`${Math.round(4 * PI7 * r)} cm`, "pa-circle"]]);
  },
  "pictorial|analyze": (rng) => {
    const d = 14 * int(rng, 1, 2);
    const r = d / 2;
    return PA.mc("pictorial", "analyze", "area from the diameter", rng, { d }, "What is the area? (π = 22/7)", { kind: "shape", shape: "circle", sideLabels: [`diameter = ${d} cm`] }, `${Math.round(PI7 * r * r)} cm²`, [[`${Math.round(PI7 * d * d)} cm²`, "pa-circle"], [`${Math.round(PI7 * d)} cm²`, "pa-circle"], [`${Math.round(PI7 * r * r)} cm`, "pa-units"]]);
  },
  "pictorial|evaluate": (rng) => {
    const l = int(rng, 4, 9), b = int(rng, 2, 4);
    const right = rng() < 0.5;
    const said = right ? `${l * b} cm²` : `${2 * (l + b)} cm²`;
    return PA.mc("pictorial", "evaluate", "judge an answer", rng, { l, b, r: right ? 1 : 0 }, `Riya says the area is ${said}. Is she right?`, { kind: "shape", shape: "rectangle", sideLabels: [`${l} cm`, `${b} cm`] }, right ? "Yes: area = length × breadth" : "No: that is the perimeter; area = length × breadth", [
      [right ? "No: that is the perimeter; area = length × breadth" : "Yes: area = length × breadth", "pa-formula"],
      ["No: area = length + breadth", "pa-formula"],
      ["Yes: area and perimeter are the same", "pa-formula"],
    ]);
  },
  "abstract|remember": (rng) => {
    const qs: [string, string, string[], string][] = [
      ["Area of a parallelogram = ___", "base × height", ["½ × base × height", "2 × (base + height)", "base + height"], "pa-formula"],
      ["Circumference of a circle = ___", "2πr", ["πr²", "πr", "2πr²"], "pa-circle"],
      ["Area of a triangle = ___", "½ × base × height", ["base × height", "3 × side", "base + height"], "pa-formula"],
      ["Area is measured in ___", "square units (cm², m²)", ["units (cm, m)", "cubic units (cm³)", "degrees"], "pa-units"],
    ];
    const i = int(rng, 0, qs.length - 1);
    const [q, a, w, m] = qs[i];
    return PA.mc("abstract", "remember", "formulas", rng, { i }, q, null, a, w.map((t) => [t, m] as [string, string]));
  },
  "abstract|understand": (rng) => {
    const s = int(rng, 3, 15);
    return PA.mc("abstract", "understand", "square", rng, { s }, `A square has side ${s} cm. Its area is ___`, null, `${s * s} cm²`, [[`${4 * s} cm²`, "pa-formula"], [`${2 * s} cm²`, "pa-formula"], [`${s * s} cm`, "pa-units"]]);
  },
  "abstract|apply": (rng) => {
    const A = int(rng, 4, 12) * int(rng, 3, 9), l = int(rng, 3, 9);
    if (A % l) throw new Error("not whole");
    const b = A / l;
    if (b === l || String(A).includes(String(b))) throw new Error("coincidence");
    return PA.mc("abstract", "apply", "missing side", rng, { A, l }, `A rectangle has area ${A} cm² and length ${l} cm. Its breadth is ___`, null, `${b} cm`, [[`${A - l} cm`, "pa-formula"], [`${A * l} cm`, "pa-formula"], [`${A / 2 - l} cm`, "pa-formula"]]);
  },
  "abstract|analyze": (rng) => {
    const r = 7 * int(rng, 1, 3);
    return PA.mc("abstract", "analyze", "area of a circle", rng, { r }, `A circle has radius ${r} cm. Its area is ___ (π = 22/7)`, null, `${Math.round(PI7 * r * r)} cm²`, [[`${Math.round(2 * PI7 * r)} cm²`, "pa-circle"], [`${Math.round(PI7 * 4 * r * r)} cm²`, "pa-circle"], [`${Math.round(PI7 * r * r)} cm`, "pa-units"]]);
  },
  "abstract|evaluate": (rng) => {
    const l = int(rng, 10, 20), b = int(rng, 6, 9), w = int(rng, 1, 2);
    const inner = (l - 2 * w) * (b - 2 * w);
    return PA.mc("abstract", "evaluate", "path inside a rectangle", rng, { l, b, w }, `A ${l} m × ${b} m garden has a path ${w} m wide inside it, along the edges. The area of the path is ___`, null, `${l * b - inner} m²`, [[`${inner} m²`, "pa-formula"], [`${2 * (l + b) * w} m²`, "pa-formula"], [`${l * b - (l - w) * (b - w)} m²`, "pa-formula"]]);
  },
});
