import { Rng, Template, build, buildActivity, fmt, int, pick, sup } from "./core.js";
import { GroupActivity } from "../../types.js";

/**
 * Cubes and Cube Roots, Grade 8 (book chapter 4): cube numbers, cube roots
 * by prime factors (numbers up to 3 digits), negative cubes and roots, the
 * smallest multiplier for a perfect cube.
 *   concrete  hands-on: pack small cubes into equal layers to build a cube;
 *             test a number that won't make one; check a claim
 *   pictorial one layer of a solid cube, doubling the edge, cubes needed to
 *             finish, ∛ of a negative number on the number line
 *   abstract  n³, ∛(n³), ∛(−n³), the smallest multiplier, ∛(a³ × b³)
 */

const TOPIC = "g8-cubes";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "cube-triples": {
    label: "Triples instead of cubing",
    detail: "Works out 4³ as 12.",
    childTip: "Cubing is a number times itself three times: 4³ = 4 × 4 × 4.",
  },
  "cube-squares": {
    label: "Squares instead of cubing",
    detail: "Works out n³ as n × n, forgetting the third factor (one layer, not the whole cube).",
    childTip: "A cube has layers: n × n in each layer, and n layers.",
  },
  "cube-thirds": {
    label: "Divides by 3 for a cube root",
    detail: "Says ∛27 = 9.",
    childTip: "∛27 asks: which number times itself three times is 27? Check by cubing your answer.",
  },
  "cube-sign": {
    label: "Loses the minus sign in a cube root",
    detail: "Says ∛(−27) = 3. A negative number has a negative cube root.",
    childTip: "(−3) × (−3) × (−3) = −27, so ∛(−27) = −3.",
  },
  "cube-not-perfect": {
    label: "Calls a number a cube when it isn't",
    detail: "Thinks any pile of small cubes can be built into a solid cube.",
    childTip: "A cube number is n × n × n. Find the cubes either side to check.",
  },
  "cube-scale": {
    label: "Doubles the volume when the edge doubles",
    detail: "Thinks a cube with twice the edge has twice as many small cubes. It has 8 times as many.",
    childTip: "Double the edge: 2 × 2 × 2 = 8 times the cubes.",
  },
  "cube-triple-groups": {
    label: "Groups the prime factors wrongly",
    detail: "Makes pairs instead of groups of three, or misses how many are needed to finish a group.",
    childTip: "For cubes, ring the prime factors in threes. Each group must be complete.",
  },
  "cube-adds-roots": {
    label: "Adds where it should multiply",
    detail: "Thinks ∛(8 × 27) = 2 + 3.",
    childTip: "∛(8 × 27) = ∛8 × ∛27 = 2 × 3. Roots of a product multiply.",
  },
};

const NAMES = ["Ishaan", "Meera", "Arjun", "Diya", "Kabir", "Sara", "Rohan", "Anaya"] as const;

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `cube8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const cubes = (extra: Partial<GroupActivity> & Pick<GroupActivity, "mode" | "items">): GroupActivity => ({
  kind: "group",
  icon: "🧊",
  itemMany: "cubes",
  basketOne: "layer",
  basketIcon: "",
  ...extra,
});
const layer = (n: number, groups: number) => ({ kind: "concrete" as const, icon: "🧊", itemCount: n * n, groups, groupLabel: groups === 1 ? "layer" : "row" });
const neg = (n: number) => fmt(n).replace("-", "−");
const third = (n: number) => fmt(+(n / 3).toFixed(2));

export const CUBES_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: cubes into layers ----------------
  "concrete|remember": (rng) => {
    const n = pick(rng, [2, 3]);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "cube numbers", rng), prompt: `Share the ${n ** 3} cubes equally between the ${n} layers.`, representation: null },
      { n },
      cubes({ mode: "equal", items: n ** 3, baskets: n })
    );
  },
  "concrete|understand": (rng) => {
    const n = pick(rng, [2, 3]);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "cube numbers", rng), prompt: `Pack the ${n ** 3} cubes in layers of ${n * n}. Use as many layers as you need.`, representation: null },
      { n },
      cubes({ mode: "size", items: n ** 3, size: n * n, maxBaskets: n + 2 })
    );
  },
  "concrete|apply": (rng) => {
    const n = pick(rng, [2, 3]);
    const N = n ** 3;
    return build(
      { ...base("c-apply", "concrete", "apply", "cube roots", rng), prompt: `Share the ${N} cubes equally between the layers to build a solid cube. What is ∛${N}?`, representation: null, activity: cubes({ mode: "equal", items: N, baskets: n }) },
      { n },
      String(n),
      [
        { text: third(N), mistake: "cube-thirds" },
        { text: String(n * n), mistake: "cube-squares" },
        { text: String(n + 1), mistake: null },
        { text: String(n + 2), mistake: null },
      ]
    );
  },
  "concrete|analyze": (rng) => {
    const n = pick(rng, [2, 3]);
    const r = int(rng, 1, n * n);
    const N = n ** 3 + r;
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "perfect cubes", rng),
        prompt: `Pack the ${N} cubes in layers of ${n * n}. Can all ${N} cubes make one solid cube, with none left over?`,
        representation: null,
        activity: cubes({ mode: "size", items: N, size: n * n, maxBaskets: Math.ceil(N / (n * n)) + 1 }),
      },
      { n, r },
      `No: ${N} is not a cube number`,
      [
        { text: `Yes: ${N} cubes make a solid cube`, mistake: "cube-not-perfect" },
        { text: `Yes, with ${n * n} in each layer`, mistake: "cube-not-perfect" },
        { text: "No: a cube needs an even number of small cubes", mistake: null },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const n = pick(rng, [2, 3]);
    const N = n ** 3;
    const name = pick(rng, NAMES);
    return build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "cube roots", rng),
        prompt: `Pack the ${N} cubes in layers of ${n * n}. ${name} says the big cube is ${n * n} small cubes long on each edge. Is that right?`,
        representation: null,
        activity: cubes({ mode: "size", items: N, size: n * n, maxBaskets: n + 2 }),
      },
      { n },
      `No: each edge is ${n}, because ${n} × ${n} × ${n} = ${N}`,
      [
        { text: `Yes: each layer is ${n} × ${n} = ${n * n}`, mistake: "cube-squares" },
        { text: `No: each edge is ${third(N)}, because ${N} ÷ 3 = ${third(N)}`, mistake: "cube-thirds" },
        { text: "Yes: any number of cubes can make a big cube", mistake: "cube-not-perfect" },
      ]
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const n = int(rng, 3, 6);
    return build(
      { ...base("p-remember", "pictorial", "remember", "cube numbers", rng), prompt: `This is one layer of a solid cube. The cube has ${n} layers like this. How many small cubes are there in all?`, representation: layer(n, n) },
      { n },
      String(n ** 3),
      [
        { text: String(3 * n), mistake: "cube-triples" },
        { text: String(n * n), mistake: "cube-squares" },
        { text: String((n + 1) ** 3), mistake: null },
        { text: String(n * n + n), mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const n = int(rng, 3, 6);
    const V = n ** 3;
    return build(
      { ...base("p-understand", "pictorial", "understand", "cube roots", rng), prompt: `This is one layer of a solid cube made of ${V} small cubes. How many small cubes long is each edge?`, representation: layer(n, 1) },
      { n },
      String(n),
      [
        { text: third(V), mistake: "cube-thirds" },
        { text: String(n * n), mistake: "cube-squares" },
        { text: String(n + 1), mistake: null },
        { text: String(n - 1), mistake: null },
        { text: String(n + 2), mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const n = int(rng, 2, 5);
    return build(
      { ...base("p-apply", "pictorial", "apply", "scaling", rng), prompt: `This is one layer of a solid cube with edges ${n} cubes long. If every edge is doubled, how many small cubes will the new cube need?`, representation: layer(n, n) },
      { n },
      String(8 * n ** 3),
      [
        { text: String(2 * n ** 3), mistake: "cube-scale" },
        { text: String(4 * n ** 3), mistake: "cube-squares" },
        { text: String((n + 2) ** 3), mistake: null },
        { text: String(6 * n ** 3), mistake: null },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const n = int(rng, 2, 4);
    const V = n ** 3 + int(rng, 1, 3 * n * n);
    const name = pick(rng, NAMES);
    const next = (n + 1) ** 3;
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "perfect cubes", rng),
        prompt: `${name} has ${V} small cubes and wants a solid cube with none left over. One layer of the next cube up is shown. What is the fewest number of cubes ${name} needs to add?`,
        representation: layer(n + 1, n + 1),
      },
      { n, V },
      String(next - V),
      [
        { text: String(V - n ** 3), mistake: null },
        { text: String(next), mistake: null },
        { text: String((n + 1) ** 2), mistake: "cube-squares" },
        { text: String(next - V + 1), mistake: null },
        { text: String(V), mistake: null },
        { text: String(next - V + 2), mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const n = pick(rng, [2, 3]);
    const N = n ** 3;
    const values = [
      { v: -n, right: true, mistake: null as string | null },
      { v: n, right: false, mistake: "cube-sign" },
      { v: -(n * n), right: false, mistake: "cube-squares" },
      { v: n * n, right: false, mistake: "cube-sign" },
    ];
    const labels = ["A", "B", "C", "D"].sort(() => rng() - 0.5);
    const marked = values.map((x, i) => ({ ...x, label: labels[i] }));
    const right = marked.find((x) => x.right)!;
    const span = n * n + 1;
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "negative cubes", rng),
        prompt: `Which point is at ∛(−${N})?`,
        representation: { kind: "number-line", min: -span, max: span, step: 1, labelEvery: span > 6 ? 2 : 1, markers: marked.map((x) => ({ value: x.v, label: x.label })) },
      },
      { n, l: labels.indexOf("A") },
      `Point ${right.label}`,
      marked.filter((x) => !x.right).map((x) => ({ text: `Point ${x.label}`, mistake: x.mistake }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const n = int(rng, 2, 12);
    return build(
      { ...base("a-remember", "abstract", "remember", "cube numbers", rng), prompt: `${n}${sup(3)} = ?`, representation: null },
      { n },
      fmt(n ** 3),
      [
        { text: String(3 * n), mistake: "cube-triples" },
        { text: String(n * n), mistake: "cube-squares" },
        { text: fmt(n ** 3 + n), mistake: null },
        { text: fmt((n + 1) ** 3), mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const n = int(rng, 4, 9);
    const N = n ** 3;
    return build(
      { ...base("a-understand", "abstract", "understand", "cube roots", rng), prompt: `∛${fmt(N)} = ?`, representation: null },
      { n },
      String(n),
      [
        { text: third(N), mistake: "cube-thirds" },
        { text: String(n + 1), mistake: null },
        { text: String(n - 1), mistake: null },
        { text: String(n * n), mistake: "cube-squares" },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const n = int(rng, 2, 9);
    const N = n ** 3;
    return build(
      { ...base("a-apply", "abstract", "apply", "negative cubes", rng), prompt: `∛(−${fmt(N)}) = ?`, representation: null },
      { n },
      `−${n}`,
      [
        { text: String(n), mistake: "cube-sign" },
        { text: neg(-+(N / 3).toFixed(2)), mistake: "cube-thirds" },
        { text: `−${n + 1}`, mistake: null },
        { text: `−${n * n}`, mistake: "cube-squares" },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const s = int(rng, 1, 3);
    const p = pick(rng, [2, 3, 5]);
    const twice = rng() < 0.5; // n = s³ × p² needs p; n = s³ × p needs p²
    const n = s ** 3 * (twice ? p * p : p);
    const answer = twice ? p : p * p;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "smallest multiplier", rng), prompt: `What is the smallest number ${n} must be multiplied by to make a perfect cube?`, representation: null },
      { s, p, t: twice ? 1 : 0 },
      String(answer),
      [
        { text: String(twice ? p * p : p), mistake: "cube-triple-groups" },
        { text: String(p ** 3), mistake: "cube-triple-groups" },
        { text: String(3 * p), mistake: null },
        { text: String(2 * answer), mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const a = int(rng, 2, 5);
    let b = int(rng, 2, 5);
    if (b === a) b = a === 5 ? 2 : a + 1;
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "roots of products", rng), prompt: `∛(${a ** 3} × ${b ** 3}) = ?`, representation: null },
      { a, b },
      String(a * b),
      [
        { text: String(a + b), mistake: "cube-adds-roots" },
        { text: String(a * a * b * b), mistake: "cube-squares" },
        { text: fmt(+((a ** 3 * b ** 3) / 3).toFixed(2)), mistake: "cube-thirds" },
      ]
    );
  },
};
