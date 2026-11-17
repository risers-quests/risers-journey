import { Rng, Template, build, buildActivity, gcd, int, pick } from "./core.js";
import { GroupActivity } from "../../types.js";

/**
 * Direct and Inverse Variations, Grade 8 (book chapter 10), including time
 * and work: more of one means proportionally more (direct) or less
 * (inverse) of the other; telling which from a table; work done together.
 *   concrete  hands-on: pack pencils into boxes (direct), share sweets
 *             between children (inverse); then predict for new numbers
 *   pictorial unit cost, workers and days, speed and time, two people
 *             working together, a table of values
 *   abstract  unit method, workers and days, a day's work together, one
 *             worker's time from the pair's, y = k ÷ x
 */

const TOPIC = "g8-variation";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "var-inverse-as-direct": {
    label: "Treats an inverse relation as direct",
    detail: "Thinks more workers means more days, or more children means more sweets each.",
    childTip: "Ask: if one goes up, does the other go up or down? More workers finish sooner.",
  },
  "var-direct-as-inverse": {
    label: "Treats a direct relation as inverse",
    detail: "Thinks buying more pens means paying less.",
    childTip: "Twice as many pens cost twice as much: both go up together.",
  },
  "var-adds": {
    label: "Adds or subtracts instead of scaling",
    detail: "Changes one amount by the same number as the other (2 more workers → 2 fewer days).",
    childTip: "Variation is about multiplying: find the value for 1 first (the unit method).",
  },
  "var-work-adds-times": {
    label: "Adds the times when people work together",
    detail: "Says two people taking 4 and 12 days will together take 16 days.",
    childTip: "Working together is faster. Add what each does in one day, not the days.",
  },
  "var-work-average": {
    label: "Averages the times",
    detail: "Takes the middle of the two times for working together.",
    childTip: "Together they finish sooner than either alone. Add their one-day work.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `var8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const pencils = (extra: Partial<GroupActivity> & Pick<GroupActivity, "mode" | "items">): GroupActivity => ({ kind: "group", icon: "✏️", itemMany: "pencils", basketOne: "box", basketIcon: "📦", ...extra });
const sweets = (extra: Partial<GroupActivity> & Pick<GroupActivity, "mode" | "items">): GroupActivity => ({ kind: "group", icon: "🍬", itemMany: "sweets", basketOne: "child", basketMany: "children", basketIcon: "🧒", ...extra });
const n1 = (x: number) => String(+x.toFixed(1));
const rat = (n: number, d: number) => {
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
};
const WORK = [[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [6, 3], [12, 4], [15, 10]] as const;

export const VARIATION_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: packing and sharing ----------------
  "concrete|remember": (rng) => {
    const k = int(rng, 3, 5);
    const m = int(rng, 2, 4);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "direct", rng), prompt: `${k} pencils fit in each box. Pack all ${k * m} pencils.`, representation: null },
      { k, m },
      pencils({ mode: "size", items: k * m, size: k, maxBaskets: m + 2 })
    );
  },
  "concrete|understand": (rng) => {
    const a = int(rng, 2, 5);
    const each = int(rng, 2, 5);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "inverse", rng), prompt: `Share the ${a * each} sweets equally between the ${a} children.`, representation: null },
      { a, each },
      sweets({ mode: "equal", items: a * each, baskets: a })
    );
  },
  "concrete|apply": (rng) => {
    const [N, a, b] = pick(rng, [[24, 4, 6], [24, 3, 4], [36, 4, 6], [30, 3, 5], [36, 6, 4], [24, 6, 4], [20, 4, 5], [30, 5, 3]] as const);
    const wrong = [
      { text: String(N / a + (b - a)), mistake: "var-adds" },
      { text: String(N / a), mistake: null },
      { text: String(N / a - (b - a)), mistake: "var-adds" },
      ...(Number.isInteger(((N / a) * b) / a) ? [{ text: String(((N / a) * b) / a), mistake: "var-inverse-as-direct" }] : []),
      { text: String(N / b + 1), mistake: null },
      { text: String(N / b + 2), mistake: null },
      { text: String(N / b + 3), mistake: null },
      { text: String(2 * (N / b)), mistake: null },
    ].filter((w) => Number(w.text) > 0);
    return build(
      {
        ...base("c-apply", "concrete", "apply", "inverse", rng),
        prompt: `Share the ${N} sweets between the ${a} children. If ${b} children shared the same ${N} sweets instead, how many would each get?`,
        representation: null,
        activity: sweets({ mode: "equal", items: N, baskets: a }),
      },
      { N, a, b },
      String(N / b),
      wrong
    );
  },
  "concrete|analyze": (rng) => {
    const k = int(rng, 3, 5);
    const m = int(rng, 2, 4);
    const N = k * m;
    let M = k * int(rng, 5, 12);
    if (M === N) M += k;
    const wrong = [
      { text: String(m + (M - N)), mistake: "var-adds" },
      { text: String(M), mistake: null },
      ...(Number.isInteger((m * N) / M) && (m * N) / M > 0 ? [{ text: String((m * N) / M), mistake: "var-direct-as-inverse" }] : []),
      { text: String(M / k + 1), mistake: null },
      { text: String(M / k - 1), mistake: null },
    ];
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "direct", rng),
        prompt: `${k} pencils fit in each box. Pack the ${N} pencils. How many boxes would ${M} pencils need?`,
        representation: null,
        activity: pencils({ mode: "size", items: N, size: k, maxBaskets: m + 2 }),
      },
      { k, m, M },
      String(M / k),
      wrong
    );
  },
  "concrete|evaluate": (rng) => {
    const a = int(rng, 2, 4);
    const each = 2 * int(rng, 2, 4);
    const name = pick(rng, ["Riya", "Arjun", "Meera", "Kabir", "Diya", "Rohan"]);
    return build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "inverse", rng),
        prompt: `Share the ${a * each} sweets between the ${a} children. ${name} says: "With twice as many children, each would get twice as many sweets." Is ${name} right?`,
        representation: null,
        activity: sweets({ mode: "equal", items: a * each, baskets: a }),
      },
      { a, each },
      `No: with ${2 * a} children, each gets half as many (${each / 2})`,
      [
        { text: `Yes: each would get ${2 * each}`, mistake: "var-inverse-as-direct" },
        { text: `No: each gets ${each - a} (${a} fewer)`, mistake: "var-adds" },
        { text: `No: each still gets ${each}`, mistake: null },
      ]
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng) => {
    const k = int(rng, 2, 6);
    const u = 5 * int(rng, 2, 12);
    let m = int(rng, 3, 15);
    if (m === k) m += 1;
    const c = k * u;
    return build(
      {
        ...base("p-remember", "pictorial", "remember", "unit method", rng),
        prompt: `${k} notebooks cost ₹${c}. How much do ${m} notebooks cost?`,
        representation: { kind: "concrete", icon: "📓", itemCount: k, groups: 1, groupLabel: `₹${c}` },
      },
      { k, u, m },
      `₹${m * u}`,
      [
        { text: `₹${c + (m - k)}`, mistake: "var-adds" },
        ...(Number.isInteger((c * k) / m) ? [{ text: `₹${(c * k) / m}`, mistake: "var-direct-as-inverse" }] : []),
        { text: `₹${u}`, mistake: null },
        { text: `₹${m * u + u}`, mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const [W, D, W2] = pick(rng, [[4, 6, 8], [6, 10, 12], [3, 8, 6], [5, 12, 10], [8, 9, 12], [6, 8, 4], [10, 6, 15], [12, 5, 6]] as const);
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "inverse", rng),
        prompt: `${W} workers build a wall in ${D} days. How many days would ${W2} workers take, working at the same pace?`,
        representation: { kind: "concrete", icon: "👷", itemCount: W, groups: 1, groupLabel: `${D} days` },
      },
      { W, D, W2 },
      String((W * D) / W2),
      [
        { text: n1((D * W2) / W), mistake: "var-inverse-as-direct" },
        { text: String(D - (W2 - W)), mistake: "var-adds" },
        { text: String(D), mistake: null },
        { text: String((W * D) / W2 + 1), mistake: null },
      ].filter((w) => Number(w.text) > 0)
    );
  },
  "pictorial|apply": (rng) => {
    const [s, t, s2] = pick(rng, [[40, 3, 60], [60, 2, 40], [30, 4, 40], [50, 6, 60], [45, 4, 60], [80, 3, 60], [36, 5, 45]] as const);
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "speed and time", rng),
        prompt: `At ${s} km/h a trip takes ${t} hours. How long does the same trip take at ${s2} km/h?`,
        representation: { kind: "bars", bars: [{ name: `${s} km/h`, parts: [{ value: t, label: `${t} hours` }] }, { name: `${s2} km/h`, parts: [{ value: t, label: "? hours", ghost: true }] }] },
      },
      { s, t, s2 },
      `${n1((s * t) / s2)} hours`,
      [
        { text: `${n1((t * s2) / s)} hours`, mistake: "var-inverse-as-direct" },
        { text: `${t} hours`, mistake: null },
        { text: `${n1((s * t) / s2 + 1)} hours`, mistake: null },
        { text: `${n1((s * t) / s2 + 2)} hours`, mistake: null },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const [a, b] = pick(rng, WORK);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "time and work", rng),
        prompt: `Asha can paint a fence in ${a} days; Ben takes ${b} days. How many days if they work together?`,
        representation: { kind: "bars", bars: [{ name: "Asha", parts: [{ value: 1, label: `whole fence: ${a} days` }] }, { name: "Ben", parts: [{ value: 1, label: `whole fence: ${b} days` }] }] },
      },
      { a, b },
      `${n1((a * b) / (a + b))} days`,
      [
        { text: `${a + b} days`, mistake: "var-work-adds-times" },
        { text: `${n1((a + b) / 2)} days`, mistake: "var-work-average" },
        { text: `${Math.abs(a - b)} days`, mistake: null },
        { text: `${Math.min(a, b)} days`, mistake: null },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const type = pick(rng, ["inverse", "direct", "neither"] as const);
    let xs: number[], ys: number[];
    if (type === "inverse") {
      const k = pick(rng, [12, 24, 36, 60]);
      const ds = [1, 2, 3, 4, 5, 6, 10, 12].filter((d) => k % d === 0 && d < k);
      const i = int(rng, 0, ds.length - 3);
      xs = ds.slice(i, i + 3);
      ys = xs.map((x) => k / x);
    } else if (type === "direct") {
      const m = int(rng, 2, 5);
      const x0 = int(rng, 1, 3);
      xs = [x0, x0 + 1, x0 + 2];
      ys = xs.map((x) => m * x);
    } else {
      const c = int(rng, 10, 16);
      const x0 = int(rng, 2, 4);
      xs = [x0, x0 + 2, x0 + 4];
      ys = xs.map((x) => c - x);
    }
    const right = type === "inverse" ? `Inversely: x × y is always ${xs[0] * ys[0]}` : type === "direct" ? `Directly: y ÷ x is always ${ys[0] / xs[0]}` : "Neither: y goes down by the same amount, not in proportion";
    const options = [
      { text: `Directly: when x goes up, y goes ${type === "direct" ? "up" : "down"}`, mistake: type === "inverse" ? "var-inverse-as-direct" : null },
      { text: "Inversely: when x goes up, y goes down", mistake: type === "neither" ? "var-adds" : type === "direct" ? "var-direct-as-inverse" : null },
      { text: "Neither: they don't change together", mistake: null },
      { text: `Directly: y ÷ x is always ${n1(ys[0] / xs[0])}`, mistake: type === "inverse" ? "var-inverse-as-direct" : null },
    ];
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "which variation", rng),
        prompt: `Do x and y vary directly, inversely, or neither?`,
        representation: { kind: "bars", bars: xs.map((x, i) => ({ name: `x = ${x}`, parts: [{ value: ys[i], label: `y = ${ys[i]}` }] })) },
      },
      { t: ["inverse", "direct", "neither"].indexOf(type), x: xs[0], y: ys[0] },
      right,
      options.filter((o) => o.text !== right)
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const n = int(rng, 2, 8);
    const u = int(rng, 4, 25);
    let m = int(rng, 3, 15);
    if (m === n) m += 1;
    return build(
      { ...base("a-remember", "abstract", "remember", "unit method", rng), prompt: `${n} pens cost ₹${n * u}. How much do ${m} pens cost?`, representation: null },
      { n, u, m },
      `₹${m * u}`,
      [
        { text: `₹${n * u + (m - n)}`, mistake: "var-adds" },
        ...(Number.isInteger((n * u * n) / m) ? [{ text: `₹${(n * u * n) / m}`, mistake: "var-direct-as-inverse" }] : []),
        { text: `₹${m * u + u}`, mistake: null },
        { text: `₹${(m - 1) * u}`, mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const [W, D, W2] = pick(rng, [[12, 10, 15], [8, 15, 12], [6, 20, 8], [15, 8, 12], [9, 12, 6], [20, 6, 24], [16, 9, 12]] as const);
    return build(
      { ...base("a-understand", "abstract", "understand", "inverse", rng), prompt: `${W} workers can finish a job in ${D} days. How many days will ${W2} workers take?`, representation: null },
      { W, D, W2 },
      String((W * D) / W2),
      [
        { text: n1((D * W2) / W), mistake: "var-inverse-as-direct" },
        { text: String(D - (W2 - W)), mistake: "var-adds" },
        { text: String((W * D) / W2 + 2), mistake: null },
      ].filter((w) => Number(w.text) > 0)
    );
  },
  "abstract|apply": (rng) => {
    const [a, b] = pick(rng, WORK);
    return build(
      { ...base("a-apply", "abstract", "apply", "time and work", rng), prompt: `A can do a job in ${a} days and B in ${b} days. What part of the job do they do together in one day?`, representation: null },
      { a, b },
      rat(a + b, a * b),
      [
        { text: rat(1, a + b), mistake: "var-work-adds-times" },
        { text: rat(2, a + b), mistake: "var-work-average" },
        { text: rat(1, a * b), mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const [a, T, b] = pick(rng, [[3, 2, 6], [4, 3, 12], [6, 4, 12], [12, 8, 24], [10, 6, 15], [15, 10, 30], [20, 12, 30], [6, 3, 6]] as const);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "time and work", rng), prompt: `A and B together finish a job in ${T} days. A alone takes ${a} days. How long would B take alone?`, representation: null },
      { a, T },
      `${b} days`,
      [
        { text: `${a - T} days`, mistake: "var-work-adds-times" },
        { text: `${a + T} days`, mistake: null },
        { text: `${2 * T - a > 0 ? 2 * T - a : 2 * T} days`, mistake: "var-work-average" },
        { text: `${b + 2} days`, mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const [a, b, c] = pick(rng, [[4, 15, 6], [3, 20, 5], [6, 10, 4], [5, 12, 10], [8, 9, 6], [10, 6, 4], [12, 5, 15]] as const);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "inverse", rng), prompt: `y varies inversely as x. When x = ${a}, y = ${b}. Find y when x = ${c}.`, representation: null },
      { a, b, c },
      n1((a * b) / c),
      [
        { text: n1((b * c) / a), mistake: "var-inverse-as-direct" },
        { text: String(b - (c - a)), mistake: "var-adds" },
        { text: String(a * b), mistake: null },
      ]
    );
  },
};
