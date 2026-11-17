import { Rng, Template, build, buildActivity, fmt, int, pick } from "./core.js";
import { ShadeActivity } from "../../types.js";

/**
 * Profit, Loss and Discount, Grade 8 (book chapter 8), including overhead
 * expenses and tax (GST): profit and loss, profit and loss percent (on the
 * cost price), discount on the marked price, tax after discount, finding
 * the cost or marked price backwards, two discounts in a row.
 *   concrete  hands-on: shade the price paid after a discount, the profit,
 *             the price after discount and tax, the loss, the profit after
 *             overheads
 *   pictorial bar models: cost and selling price, marked price and discount,
 *             profit on top of cost, overheads, two shops' offers
 *   abstract  profit %, selling price after a loss, discount then tax,
 *             cost price from selling price, marked price from selling price
 */

const TOPIC = "g8-profit-loss";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "pl-shades-discount": {
    label: "Gives the discount, not the price",
    detail: "Works out the money taken off and stops there, instead of the price paid.",
    childTip: "Price paid = marked price − discount.",
  },
  "pl-subtracts-percent": {
    label: "Uses the percent as rupees",
    detail: "Takes ₹20 off for a 20% discount (or adds ₹10 for a 10% profit).",
    childTip: "20% of ₹500 is ₹100. Work out the percent of the price first.",
  },
  "pl-tax-on-marked": {
    label: "Charges tax on the marked price",
    detail: "Adds tax on the marked price instead of on the discounted price.",
    childTip: "Discount first, then tax on what's left.",
  },
  "pl-forgets-tax": {
    label: "Leaves out the tax",
    detail: "Stops at the discounted price and forgets to add tax.",
    childTip: "Check every step in the question: discount, then tax.",
  },
  "pl-percent-on-sp": {
    label: "Works out profit or loss % on the selling price",
    detail: "Divides by the selling price; profit and loss percent are on the cost price.",
    childTip: "Profit % = profit ÷ cost price × 100.",
  },
  "pl-profit-loss-swap": {
    label: "Mixes up profit and loss",
    detail: "Calls it a profit when the selling price is lower than the cost (or the other way round).",
    childTip: "Sold for more than it cost: profit. Sold for less: loss.",
  },
  "pl-amount-not-percent": {
    label: "Gives rupees, not a percent",
    detail: "Answers with the profit or loss in rupees when a percent was asked.",
    childTip: "Percent = amount ÷ cost price × 100.",
  },
  "pl-forgets-overhead": {
    label: "Leaves out overhead expenses",
    detail: "Doesn't add repairs, transport and so on to the cost price.",
    childTip: "Cost price = what you paid + overheads (repairs, transport…).",
  },
  "pl-adds-discounts": {
    label: "Adds two discounts together",
    detail: "Thinks 20% off and then 10% off is 30% off.",
    childTip: "The second discount comes off the already reduced price, so it's less than adding them.",
  },
  "pl-discount-on-sp": {
    label: "Works backwards with the wrong price",
    detail: "Adds the discount percent to the selling price to find the marked price.",
    childTip: "Selling price is (100 − d)% of the marked price. Divide by that.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `pl8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const shade = (rows: number, cols: number, target: number, wrong: { value: number; mistake: string }[], unit?: string): ShadeActivity => ({
  kind: "shade",
  rows,
  cols,
  target,
  unit,
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= rows * cols && wrong.findIndex((x) => x.value === w.value) === i),
});
const rs = (n: number) => `₹${fmt(Math.round(n * 100) / 100)}`;
const pc = (n: number) => `${+n.toFixed(1)}%`;
const DT = [[20, 5], [10, 10], [25, 4], [20, 10], [50, 10], [40, 5], [10, 20], [30, 10]] as const;

export const PROFIT_LOSS_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: shading money ----------------
  "concrete|remember": (rng) => {
    const u = pick(rng, [2, 5, 10, 20]);
    const d = 5 * int(rng, 1, 9);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "discount", rng), prompt: `A bag is marked ₹${fmt(100 * u)} and has ${d}% off. Each square is ₹${u}. Shade what you pay.`, representation: null },
      { u, d },
      shade(10, 10, 100 - d, [{ value: d, mistake: "pl-shades-discount" }, { value: 100 - d / u, mistake: "pl-subtracts-percent" }], `Each square = ₹${u}`)
    );
  },
  "concrete|understand": (rng) => {
    const v = pick(rng, [5, 10, 25, 50]);
    const p = 5 * int(rng, 1, 10);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "profit", rng), prompt: `A toy cost ₹${fmt(20 * v)} (the whole grid, ₹${v} a square). It is sold at a profit of ${p}%. Shade the profit.`, representation: null },
      { v, p },
      shade(4, 5, p / 5, [{ value: p, mistake: "pct-of-100-only" }], `Each square = ₹${v}`)
    );
  },
  "concrete|apply": (rng) => {
    const u = pick(rng, [5, 10, 20]);
    const [d, t] = pick(rng, DT.filter(([d, t]) => (100 - d) * (100 + t) <= 10000));
    const end = ((100 - d) * (100 + t)) / 100;
    return buildActivity(
      {
        ...base("c-apply", "concrete", "apply", "discount and tax", rng),
        prompt: `A watch is marked ₹${fmt(100 * u)}. It has ${d}% off, then ${t}% GST is added to the discounted price. Each square is ₹${u}. Shade the final price.`,
        representation: null,
      },
      { u, d, t },
      shade(10, 10, end, [{ value: 100 - d + t, mistake: "pl-tax-on-marked" }, { value: 100 - d, mistake: "pl-forgets-tax" }], `Each square = ₹${u}`)
    );
  },
  "concrete|analyze": (rng) => {
    const u = pick(rng, [5, 10, 20, 50]);
    const L = 5 * int(rng, 1, 8);
    const C = 100 * u, S = C - L * u;
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "loss percent", rng),
        prompt: `A phone cost ₹${fmt(C)} (the whole grid, ₹${u} a square) and was sold for ₹${fmt(S)}. Shade the loss. What is the loss percent?`,
        representation: null,
        activity: shade(10, 10, L, [], `Each square = ₹${u}`),
      },
      { u, L },
      `${L}% loss`,
      [
        { text: `${pc((L / (100 - L)) * 100)} loss`, mistake: "pl-percent-on-sp" },
        { text: `${L}% profit`, mistake: "pl-profit-loss-swap" },
        { text: `${fmt(L * u)}% loss`, mistake: "pl-amount-not-percent" },
        { text: `${100 - L}% loss`, mistake: null },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const C = 10 * int(rng, 20, 90);
    const O = 10 * int(rng, 2, 15);
    const k = int(rng, 2, 15);
    const S = C + O + 10 * k;
    return buildActivity(
      {
        ...base("c-evaluate", "concrete", "evaluate", "overheads", rng),
        prompt: `Arjun bought an old cycle for ₹${fmt(C)}, spent ₹${O} on repairs, and sold it for ₹${fmt(S)}. Each square is ₹10. Shade his profit.`,
        representation: null,
      },
      { C, O, k },
      shade(10, 10, k, [{ value: (S - C) / 10, mistake: "pl-forgets-overhead" }], "Each square = ₹10")
    );
  },

  // ---------------- PICTORIAL: bar models ----------------
  "pictorial|remember": (rng) => {
    const a = 10 * int(rng, 20, 80);
    let b = 10 * int(rng, 20, 80);
    if (b === a) b = a + 50;
    const profit = b > a;
    const word = profit ? "Profit" : "Loss", other = profit ? "Loss" : "Profit";
    const diff = Math.abs(b - a);
    return build(
      {
        ...base("p-remember", "pictorial", "remember", "profit and loss", rng),
        prompt: "Is there a profit or a loss, and how much?",
        representation: { kind: "bars", bars: [{ name: "Cost price", parts: [{ value: a, label: rs(a) }] }, { name: "Selling price", parts: [{ value: b, label: rs(b) }] }] },
      },
      { a, b },
      `${word} of ${rs(diff)}`,
      [
        { text: `${other} of ${rs(diff)}`, mistake: "pl-profit-loss-swap" },
        { text: `${word} of ${rs(a + b)}`, mistake: null },
        { text: `${word} of ${rs(diff + 10)}`, mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const M = 100 * int(rng, 3, 30);
    const d = 5 * int(rng, 1, 9);
    const D = (M * d) / 100;
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "discount", rng),
        prompt: `A jacket is marked ${rs(M)} with ${d}% off. What is the selling price?`,
        representation: { kind: "bars", bars: [{ name: "Marked price", parts: [{ value: M - D, label: "you pay" }, { value: D, label: `${d}% off`, ghost: true }] }], brace: { label: rs(M) } },
      },
      { M, d },
      rs(M - D),
      [
        { text: rs(D), mistake: "pl-shades-discount" },
        { text: rs(M - d), mistake: "pl-subtracts-percent" },
        { text: rs(M + D), mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const C = 100 * int(rng, 2, 40);
    const p = 5 * int(rng, 3, 10);
    const P = (C * p) / 100;
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "profit", rng),
        prompt: `A table cost ${rs(C)} and is sold at a profit of ${p}%. What is the selling price?`,
        representation: { kind: "bars", bars: [{ name: "Cost price", parts: [{ value: C, label: rs(C) }] }, { name: "Selling price", parts: [{ value: C, label: rs(C) }, { value: P, label: `${p}% profit`, ghost: true }] }] },
      },
      { C, p },
      rs(C + P),
      [
        { text: rs(P), mistake: null },
        { text: rs(C + p), mistake: "pl-subtracts-percent" },
        { text: rs(C - P), mistake: "pl-profit-loss-swap" },
        { text: rs(C + 2 * P), mistake: null },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const T = 100 * int(rng, 3, 20);
    const P = pick(rng, [10, 20, 25]);
    const O = 10 * int(rng, T / 100, T / 50);
    const C = T - O, S = T + (T * P) / 100;
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "overheads", rng),
        prompt: `A shopkeeper buys a fan for ${rs(C)}, pays ${rs(O)} to transport it, and sells it for ${rs(S)}. What is the profit percent?`,
        representation: {
          kind: "bars",
          bars: [
            { name: "Cost price", parts: [{ value: C, label: `bought ${rs(C)}` }, { value: O, label: `+${rs(O)}` }] },
            { name: "Selling price", parts: [{ value: S, label: rs(S) }] },
          ],
        },
      },
      { T, P, O },
      `${P}%`,
      [
        { text: pc(((S - C) / C) * 100), mistake: "pl-forgets-overhead" },
        { text: pc(((S - T) / S) * 100), mistake: "pl-percent-on-sp" },
        { text: `${fmt(S - T)}%`, mistake: "pl-amount-not-percent" },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const [d, d1, d2] = pick(rng, [[30, 20, 10], [25, 15, 10], [35, 20, 20], [45, 30, 20], [50, 30, 30], [40, 30, 20]] as const);
    const M = 1000;
    const a = M * (1 - d / 100), b = (M * (100 - d1) * (100 - d2)) / 10000;
    const cheaper = a < b ? "A" : "B";
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "successive discounts", rng),
        prompt: `Both shops mark the same shoes at ₹1,000. Shop A gives ${d}% off. Shop B gives ${d1}% off, then ${d2}% off the new price. Which is cheaper?`,
        representation: { kind: "bars", bars: [{ name: "Shop A", parts: [{ value: M, label: `₹1,000, ${d}% off` }] }, { name: "Shop B", parts: [{ value: M, label: `₹1,000, ${d1}% then ${d2}% off` }] }] },
      },
      { d, d1, d2 },
      `Shop ${cheaper}: ${rs(Math.min(a, b))} instead of ${rs(Math.max(a, b))}`,
      [
        { text: `Shop B: ${d1}% + ${d2}% = ${d1 + d2}% off`, mistake: "pl-adds-discounts" },
        { text: `They cost the same`, mistake: "pl-adds-discounts" },
        { text: `Shop ${cheaper === "A" ? "B" : "A"}: ${rs(Math.max(a, b))} instead of ${rs(Math.min(a, b))}`, mistake: null },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const C = 20 * int(rng, 5, 50);
    const p = 5 * int(rng, 1, 10);
    const P = (C * p) / 100;
    return build(
      { ...base("a-remember", "abstract", "remember", "profit percent", rng), prompt: `Bought for ${rs(C)}, sold for ${rs(C + P)}. What is the profit percent?`, representation: null },
      { C, p },
      `${p}%`,
      [
        { text: pc((P / (C + P)) * 100), mistake: "pl-percent-on-sp" },
        { text: `${fmt(P)}%`, mistake: "pl-amount-not-percent" },
        { text: `${p + 5}%`, mistake: null },
        { text: `${2 * p}%`, mistake: null },
        { text: `${p + 10}%`, mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const C = 100 * int(rng, 2, 60);
    const L = 5 * int(rng, 1, 8);
    return build(
      { ...base("a-understand", "abstract", "understand", "loss", rng), prompt: `A radio costs ${rs(C)} and is sold at a loss of ${L}%. What is the selling price?`, representation: null },
      { C, L },
      rs((C * (100 - L)) / 100),
      [
        { text: rs((C * (100 + L)) / 100), mistake: "pl-profit-loss-swap" },
        { text: rs(C - L), mistake: "pl-subtracts-percent" },
        { text: rs((C * L) / 100), mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const M = 100 * int(rng, 2, 50);
    const [d, t] = pick(rng, DT);
    return build(
      { ...base("a-apply", "abstract", "apply", "discount and tax", rng), prompt: `Marked price ${rs(M)}, discount ${d}%, then GST of ${t}% on the discounted price. What do you pay?`, representation: null },
      { M, d, t },
      rs((M * (100 - d) * (100 + t)) / 10000),
      [
        { text: rs((M * (100 - d + t)) / 100), mistake: "pl-tax-on-marked" },
        { text: rs((M * (100 - d)) / 100), mistake: "pl-forgets-tax" },
        { text: rs((M * (100 + t)) / 100), mistake: null },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const p = pick(rng, [10, 20, 25, 50]);
    const C = 20 * int(rng, 5, 60);
    const S = (C * (100 + p)) / 100;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "cost price", rng), prompt: `A lamp is sold for ${rs(S)} at a profit of ${p}%. What did it cost?`, representation: null },
      { p, C },
      rs(C),
      [
        { text: rs((S * (100 - p)) / 100), mistake: "pl-percent-on-sp" },
        { text: rs(S - p), mistake: "pl-subtracts-percent" },
        { text: rs((S * (100 + p)) / 100), mistake: null },
        { text: rs(C + 100), mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const d = pick(rng, [10, 20, 25, 40, 50]);
    const M = 100 * int(rng, 2, 40);
    const S = (M * (100 - d)) / 100;
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "marked price", rng), prompt: `After a ${d}% discount, a shirt sells for ${rs(S)}. What was the marked price?`, representation: null },
      { d, M },
      rs(M),
      [
        { text: rs((S * (100 + d)) / 100), mistake: "pl-discount-on-sp" },
        { text: rs(S + d), mistake: "pl-subtracts-percent" },
        { text: rs((S * d) / 100), mistake: null },
        { text: rs(M + 100), mistake: null },
      ]
    );
  },
};
