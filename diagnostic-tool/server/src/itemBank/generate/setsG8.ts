import { Rng, Template, build, buildActivity, int, pick } from "./core.js";
import { FigureSpec, ShadeActivity } from "../../types.js";

/**
 * Sets, Grade 8 (book chapter 6): union, intersection, disjoint sets and
 * the complement of a set, with Venn diagrams and n(A ∪ B).
 *   concrete  hands-on: number cards 1–12 are the universal set; shade
 *             A ∪ B, A ∩ B, A′, (A ∪ B)′, and test whether two sets are
 *             disjoint
 *   pictorial Venn diagrams with their elements: list ∩ and ∪, count
 *             n(A ∪ B), name a shaded region, n(A ∪ B) from the counts
 *   abstract  ∩, ∪, complement, n(A ∪ B) = n(A) + n(B) − n(A ∩ B), which
 *             sets are disjoint
 */

const TOPIC = "g8-sets";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "set-union-intersection": {
    label: "Mixes up union and intersection",
    detail: "Gives the elements in both sets for ∪, or in either set for ∩.",
    childTip: "∪ (union, 'or'): in A or B or both. ∩ (intersection, 'and'): in both A and B.",
  },
  "set-complement": {
    label: "Gets the complement wrong",
    detail: "Gives A itself, or the elements outside A but inside B, instead of everything in U that isn't in A.",
    childTip: "A′ is everything in the universal set U that is NOT in A.",
  },
  "set-repeats": {
    label: "Lists a shared element twice",
    detail: "Writes an element that is in both sets twice in A ∪ B.",
    childTip: "In a set, each element is written once, even if it's in both A and B.",
  },
  "set-double-count": {
    label: "Counts the overlap twice",
    detail: "Uses n(A ∪ B) = n(A) + n(B), counting the elements in both twice.",
    childTip: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B): take the overlap off once.",
  },
  "set-disjoint": {
    label: "Misjudges disjoint sets",
    detail: "Calls sets disjoint when they share an element, or not disjoint when they share none.",
    childTip: "Disjoint means nothing in common: A ∩ B = ∅.",
  },
  "set-forgets-complement": {
    label: "Forgets the ′ (complement)",
    detail: "Gives A ∪ B when (A ∪ B)′ was asked for.",
    childTip: "′ means 'not': everything in U outside the set in brackets.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `set8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
type Rule = { name: string; test: (k: number) => boolean };
const isPrime = (k: number) => k > 1 && Array.from({ length: k - 2 }, (_, i) => i + 2).every((d) => k % d !== 0);
const RULES: Rule[] = [
  { name: "even numbers", test: (k) => k % 2 === 0 },
  { name: "odd numbers", test: (k) => k % 2 === 1 },
  { name: "multiples of 3", test: (k) => k % 3 === 0 },
  { name: "multiples of 4", test: (k) => k % 4 === 0 },
  { name: "prime numbers", test: isPrime },
  { name: "factors of 12", test: (k) => 12 % k === 0 },
  { name: "numbers greater than 7", test: (k) => k > 7 },
  { name: "numbers less than 5", test: (k) => k < 5 },
];
const U = Array.from({ length: 12 }, (_, i) => i + 1);
const elems = (t: (k: number) => boolean) => U.filter(t);
const set = (xs: number[]) => (xs.length ? `{${xs.join(", ")}}` : "∅");
/** Two different rules whose sets overlap (or, if `disjoint`, don't) and differ. */
function pair(rng: Rng, disjoint?: boolean): [Rule, Rule] {
  for (;;) {
    const a = pick(rng, RULES), b = pick(rng, RULES);
    if (a === b) continue;
    const A = elems(a.test), B = elems(b.test), both = A.filter(b.test);
    const ok = disjoint === undefined ? both.length > 0 && both.length < Math.min(A.length, B.length) : disjoint ? both.length === 0 : both.length > 0;
    if (ok) return [a, b];
  }
}
const parts = (a: Rule, b: Rule) => ({
  A: elems(a.test),
  B: elems(b.test),
  both: elems((k) => a.test(k) && b.test(k)),
  either: elems((k) => a.test(k) || b.test(k)),
  notA: elems((k) => !a.test(k)),
  neither: elems((k) => !a.test(k) && !b.test(k)),
  onlyA: elems((k) => a.test(k) && !b.test(k)),
  onlyB: elems((k) => b.test(k) && !a.test(k)),
});
function cards(target: number[], wrong: { cells: number[]; mistake: string }[]): ShadeActivity {
  const key = (c: number[]) => c.join(",");
  const cell = (xs: number[]) => xs.map((k) => k - 1);
  return {
    kind: "shade",
    mode: "free",
    rows: 2,
    cols: 6,
    numbered: true,
    target: target.length,
    targetCells: cell(target),
    wrongSets: wrong
      .map((w) => ({ cells: cell(w.cells), mistake: w.mistake }))
      .filter((w, i, arr) => w.cells.length && key(w.cells) !== key(cell(target)) && arr.findIndex((x) => key(x.cells) === key(w.cells)) === i),
  };
}
const venn = (p: ReturnType<typeof parts>, shade?: NonNullable<FigureSpec["venn"]>["shade"]): FigureSpec => ({
  kind: "figure",
  figure: "venn",
  venn: { onlyA: p.onlyA.map(String), both: p.both.map(String), onlyB: p.onlyB.map(String), outside: p.neither.map(String), shade },
});
const def = (a: Rule, b: Rule) => `U = {1, 2, …, 12}, A = the ${a.name}, B = the ${b.name}.`;

export const SETS_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: cards 1–12 ----------------
  "concrete|remember": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "union", rng), prompt: `${def(a, b)} Shade A ∪ B.`, representation: null },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      cards(p.either, [{ cells: p.both, mistake: "set-union-intersection" }])
    );
  },
  "concrete|understand": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "intersection", rng), prompt: `${def(a, b)} Shade A ∩ B.`, representation: null },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      cards(p.both, [{ cells: p.either, mistake: "set-union-intersection" }])
    );
  },
  "concrete|apply": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    return buildActivity(
      { ...base("c-apply", "concrete", "apply", "complement", rng), prompt: `${def(a, b)} Shade A′ (the complement of A).`, representation: null },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      cards(p.notA, [{ cells: p.A, mistake: "set-complement" }, { cells: p.onlyB, mistake: "set-complement" }])
    );
  },
  "concrete|analyze": (rng) => {
    const disjoint = rng() < 0.5;
    const [a, b] = pair(rng, disjoint), p = parts(a, b);
    return build(
      { ...base("c-analyze", "concrete", "analyze", "disjoint sets", rng), prompt: `${def(a, b)} Shade the numbers in A. Then check B's numbers: are A and B disjoint?`, representation: null, activity: cards(p.A, []) },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      disjoint ? "Yes: A ∩ B = ∅, they have nothing in common" : `No: they share ${set(p.both)}`,
      disjoint
        ? [
            { text: "No: they are both sets of numbers from U", mistake: "set-disjoint" },
            { text: `No: they share ${set(p.either.slice(0, 2))}`, mistake: "set-union-intersection" },
            { text: "You can't tell without a Venn diagram", mistake: null },
          ]
        : [
            { text: "Yes: they are different sets", mistake: "set-disjoint" },
            { text: `Yes: A ∪ B = ${set(p.either)}`, mistake: "set-union-intersection" },
            { text: "You can't tell without a Venn diagram", mistake: null },
          ]
    );
  },
  "concrete|evaluate": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    if (!p.neither.length) return SETS_G8_TEMPLATES["concrete|evaluate"](rng);
    return buildActivity(
      { ...base("c-evaluate", "concrete", "evaluate", "complement", rng), prompt: `${def(a, b)} Shade (A ∪ B)′.`, representation: null },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      cards(p.neither, [{ cells: p.either, mistake: "set-forgets-complement" }, { cells: p.notA, mistake: "set-complement" }, { cells: elems((k) => !(a.test(k) && b.test(k))), mistake: "set-union-intersection" }])
    );
  },

  // ---------------- PICTORIAL: Venn diagrams ----------------
  "pictorial|remember": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    return build(
      { ...base("p-remember", "pictorial", "remember", "intersection", rng), prompt: "From the Venn diagram, what is A ∩ B?", representation: venn(p) },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      set(p.both),
      [
        { text: set(p.either), mistake: "set-union-intersection" },
        { text: set(p.onlyA), mistake: null },
        { text: set(p.onlyB), mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    const withRepeats = [...p.A, ...p.B].sort((x, y) => x - y);
    return build(
      { ...base("p-understand", "pictorial", "understand", "union", rng), prompt: "From the Venn diagram, what is A ∪ B?", representation: venn(p) },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      set(p.either),
      [
        { text: set(withRepeats), mistake: "set-repeats" },
        { text: set(p.both), mistake: "set-union-intersection" },
        { text: set(p.neither), mistake: "set-complement" },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    return build(
      { ...base("p-apply", "pictorial", "apply", "counting", rng), prompt: "From the Venn diagram, what is n(A ∪ B), the number of elements in A ∪ B?", representation: venn(p) },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      String(p.either.length),
      [
        { text: String(p.A.length + p.B.length), mistake: "set-double-count" },
        { text: String(p.both.length), mistake: "set-union-intersection" },
        { text: String(12 - p.either.length), mistake: "set-complement" },
        { text: "12", mistake: null },
        { text: String(p.either.length + 1), mistake: null },
        { text: String(p.A.length), mistake: null },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    const NAMES = { both: "A ∩ B", either: "A ∪ B", notA: "A′", neither: "(A ∪ B)′" } as const;
    const k = pick(rng, Object.keys(NAMES) as (keyof typeof NAMES)[]);
    const wrong: Record<keyof typeof NAMES, { text: string; mistake: string | null }[]> = {
      both: [{ text: "A ∪ B", mistake: "set-union-intersection" }, { text: "A′", mistake: null }, { text: "B", mistake: null }],
      either: [{ text: "A ∩ B", mistake: "set-union-intersection" }, { text: "(A ∪ B)′", mistake: "set-forgets-complement" }, { text: "A", mistake: null }],
      notA: [{ text: "A", mistake: "set-complement" }, { text: "B", mistake: "set-complement" }, { text: "(A ∪ B)′", mistake: "set-complement" }],
      neither: [{ text: "A ∪ B", mistake: "set-forgets-complement" }, { text: "A′", mistake: "set-complement" }, { text: "A ∩ B", mistake: null }],
    };
    return build(
      { ...base("p-analyze", "pictorial", "analyze", "regions", rng), prompt: "Which set does the shaded part show?", representation: venn(p, k) },
      { a: RULES.indexOf(a), b: RULES.indexOf(b), k: Object.keys(NAMES).indexOf(k) },
      NAMES[k],
      wrong[k]
    );
  },
  "pictorial|evaluate": (rng) => {
    const onlyA = int(rng, 2, 15), both = int(rng, 1, 10), onlyB = int(rng, 2, 15);
    const nA = onlyA + both, nB = onlyB + both;
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "counting", rng),
        prompt: `In a class, ${nA} children play cricket (A), ${nB} play football (B), and ${both} play both. How many play at least one?`,
        representation: { kind: "figure", figure: "venn", venn: { onlyA: ["?"], both: [String(both)], onlyB: ["?"], outside: [] } },
      },
      { onlyA, both, onlyB },
      String(nA + nB - both),
      [
        { text: String(nA + nB), mistake: "set-double-count" },
        { text: String(nA + nB - 2 * both), mistake: "set-double-count" },
        { text: String(nA + nB + both), mistake: null },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    return build(
      { ...base("a-remember", "abstract", "remember", "intersection", rng), prompt: `A = ${set(p.A)} and B = ${set(p.B)}. What is A ∩ B?`, representation: null },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      set(p.both),
      [
        { text: set(p.either), mistake: "set-union-intersection" },
        { text: set(p.onlyA), mistake: null },
        { text: "∅", mistake: "set-disjoint" },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    const withRepeats = [...p.A, ...p.B].sort((x, y) => x - y);
    return build(
      { ...base("a-understand", "abstract", "understand", "union", rng), prompt: `A = ${set(p.A)} and B = ${set(p.B)}. What is A ∪ B?`, representation: null },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      set(p.either),
      [
        { text: set(withRepeats), mistake: "set-repeats" },
        { text: set(p.both), mistake: "set-union-intersection" },
        { text: set(p.onlyA.concat(p.onlyB).sort((x, y) => x - y)), mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const [a, b] = pair(rng), p = parts(a, b);
    return build(
      { ...base("a-apply", "abstract", "apply", "complement", rng), prompt: `U = {1, 2, …, 12} and A = ${set(p.A)}. What is A′?`, representation: null },
      { a: RULES.indexOf(a), b: RULES.indexOf(b) },
      set(p.notA),
      [
        { text: set(p.A), mistake: "set-complement" },
        { text: set(p.notA.filter((x) => x !== 12)), mistake: "set-complement" },
        { text: "∅", mistake: "set-complement" },
        { text: set(p.onlyB), mistake: "set-complement" },
        { text: set(p.B), mistake: "set-complement" },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const both = int(rng, 1, 12), nA = both + int(rng, 1, 20), nB = both + int(rng, 1, 20);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "counting", rng), prompt: `n(A) = ${nA}, n(B) = ${nB} and n(A ∩ B) = ${both}. Find n(A ∪ B).`, representation: null },
      { nA, nB, both },
      String(nA + nB - both),
      [
        { text: String(nA + nB), mistake: "set-double-count" },
        { text: String(nA + nB + both), mistake: null },
        { text: String(nA + nB - 2 * both), mistake: "set-double-count" },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const [a, b] = pair(rng, true);
    const pa = parts(a, b);
    const others: [Rule, Rule][] = Array.from({ length: 6 }, () => pair(rng, false));
    const opt = (x: Rule, y: Rule) => `${set(elems(x.test))} and ${set(elems(y.test))}`;
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "disjoint sets", rng), prompt: "Which two sets are disjoint?", representation: null },
      { a: RULES.indexOf(a), b: RULES.indexOf(b), n: pa.A.length },
      opt(a, b),
      [...others.map(([x, y]) => ({ text: opt(x, y), mistake: "set-disjoint" })), { text: `${set(pa.A)} and ${set(pa.A)}`, mistake: "set-disjoint" }]
    );
  },
};
