import { Rng, Template, build, buildActivity, fmt, int, pick } from "./core.js";
import { ShadeActivity } from "../../types.js";

/**
 * Interest, Grade 8 (book chapter 9): simple interest, amount, compound
 * interest compounded yearly (up to 3 years) and half-yearly (up to 3
 * steps), and how compound differs from simple.
 *   concrete  hands-on: the whole grid is the money borrowed; shade the
 *             interest (several years, half a year, compound year 2, two
 *             compound years)
 *   pictorial bar models: amount, three years' simple interest, compound
 *             year 2, half-yearly, compound minus simple
 *   abstract  simple interest, amount, compound interest for 2 years, amount
 *             after 3 years, half-yearly for 1½ years
 */

const TOPIC = "g8-interest";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "int-one-year-only": {
    label: "Works out one year only",
    detail: "Uses the yearly interest as if it were for the whole time.",
    childTip: "Simple interest = principal × rate × time ÷ 100. Don't forget the time.",
  },
  "int-amount-vs-interest": {
    label: "Mixes up the interest and the amount",
    detail: "Gives the amount (principal + interest) when the interest was asked for, or the other way round.",
    childTip: "Interest is the extra money. Amount = principal + interest.",
  },
  "int-si-for-ci": {
    label: "Uses simple interest for compound",
    detail: "Gives every year the same interest, as if the interest never earned interest.",
    childTip: "Compound: each year's interest is on the new, bigger amount.",
  },
  "int-rate-not-halved": {
    label: "Uses the full yearly rate every half-year",
    detail: "For half-yearly interest, uses R% each half-year instead of R/2 %.",
    childTip: "Half-yearly: half the rate, twice as many steps.",
  },
  "int-time-not-doubled": {
    label: "Counts years, not half-years",
    detail: "For half-yearly interest, compounds once a year instead of twice.",
    childTip: "In 1 year there are 2 half-years: compound twice.",
  },
};

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, rng: Rng) {
  return { id: `int8-${cell}-${Math.floor(rng() * 1e9).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}
const shade = (target: number, wrong: { value: number; mistake: string }[], unit: string): ShadeActivity => ({
  kind: "shade",
  rows: 10,
  cols: 10,
  target,
  unit,
  wrong: wrong.filter((w, i) => Number.isInteger(w.value) && w.value !== target && w.value >= 0 && w.value <= 100 && wrong.findIndex((x) => x.value === w.value) === i),
});
const rs = (n: number) => `₹${fmt(Math.round(n * 100) / 100)}`;
const P_UNITS = [10, 20, 50, 100] as const;

export const INTEREST_G8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: shade the interest ----------------
  "concrete|remember": (rng) => {
    const u = pick(rng, P_UNITS);
    const R = int(rng, 5, 15);
    const T = int(rng, 2, 3);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "simple interest", rng), prompt: `₹${fmt(100 * u)} is borrowed at ${R}% a year simple interest for ${T} years. The grid is the ₹${fmt(100 * u)}. Shade the interest.`, representation: null },
      { u, R, T },
      shade(R * T, [{ value: R, mistake: "int-one-year-only" }, { value: 100 + R * T, mistake: "int-amount-vs-interest" }], `Each square = ₹${u}`)
    );
  },
  "concrete|understand": (rng) => {
    const u = pick(rng, P_UNITS);
    const R = 2 * int(rng, 3, 10);
    return buildActivity(
      { ...base("c-understand", "concrete", "understand", "part of a year", rng), prompt: `₹${fmt(100 * u)} is borrowed at ${R}% a year simple interest for 6 months. The grid is the ₹${fmt(100 * u)}. Shade the interest.`, representation: null },
      { u, R },
      shade(R / 2, [{ value: R, mistake: "int-rate-not-halved" }], `Each square = ₹${u}`)
    );
  },
  "concrete|apply": (rng) => {
    const u = pick(rng, P_UNITS);
    const R = pick(rng, [10, 20, 30]);
    return buildActivity(
      {
        ...base("c-apply", "concrete", "apply", "compound interest", rng),
        prompt: `₹${fmt(100 * u)} earns ${R}% a year, compound interest. The grid is the ₹${fmt(100 * u)}; year 1's interest is ${R} squares. Shade the interest for year 2 only.`,
        representation: null,
      },
      { u, R },
      shade(R + (R * R) / 100, [{ value: R, mistake: "int-si-for-ci" }], `Each square = ₹${u}`)
    );
  },
  "concrete|analyze": (rng) => {
    const u = pick(rng, P_UNITS);
    const R = int(rng, 5, 15);
    return build(
      {
        ...base("c-analyze", "concrete", "analyze", "simple vs compound", rng),
        prompt: `₹${fmt(100 * u)} at ${R}% a year for 2 years. Shade the simple interest. Would compound interest be more, less or the same?`,
        representation: null,
        activity: shade(2 * R, [], `Each square = ₹${u}`),
      },
      { u, R },
      "More: in year 2 the interest also earns interest",
      [
        { text: "The same: it's the same rate and time", mistake: "int-si-for-ci" },
        { text: "Less: compound interest is taken off", mistake: null },
        { text: "You can't tell without the bank", mistake: null },
      ]
    );
  },
  "concrete|evaluate": (rng) => {
    const u = pick(rng, P_UNITS);
    const R = pick(rng, [10, 20, 30]);
    return buildActivity(
      { ...base("c-evaluate", "concrete", "evaluate", "compound interest", rng), prompt: `₹${fmt(100 * u)} earns ${R}% a year, compound interest, for 2 years. The grid is the ₹${fmt(100 * u)}. Shade all the interest.`, representation: null },
      { u, R },
      shade(2 * R + (R * R) / 100, [{ value: 2 * R, mistake: "int-si-for-ci" }], `Each square = ₹${u}`)
    );
  },

  // ---------------- PICTORIAL: bar models ----------------
  "pictorial|remember": (rng) => {
    const P = 100 * int(rng, 5, 80);
    const I = 10 * int(rng, Math.ceil(P / 60), Math.floor(P / 20));
    return build(
      {
        ...base("p-remember", "pictorial", "remember", "amount", rng),
        prompt: "The bar shows the principal and the interest earned. What is the amount at the end?",
        representation: { kind: "bars", bars: [{ name: "Money", parts: [{ value: P, label: `principal ${rs(P)}` }, { value: I, label: `+${rs(I)}` }] }] },
      },
      { P, I },
      rs(P + I),
      [
        { text: rs(I), mistake: "int-amount-vs-interest" },
        { text: rs(P - I), mistake: null },
        { text: rs(P + 2 * I), mistake: null },
        { text: rs(P + I + 100), mistake: null },
      ]
    );
  },
  "pictorial|understand": (rng) => {
    const P = 1000 * int(rng, 1, 20);
    const R = int(rng, 4, 12);
    const I = (P * R) / 100;
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "simple interest", rng),
        prompt: `${rs(P)} at ${R}% a year simple interest for 3 years. What is the total interest?`,
        representation: { kind: "bars", bars: [{ name: "Interest", parts: [1, 2, 3].map((y) => ({ value: I, label: `year ${y}` })) }] },
      },
      { P, R },
      rs(3 * I),
      [
        { text: rs(I), mistake: "int-one-year-only" },
        { text: rs(P + 3 * I), mistake: "int-amount-vs-interest" },
        { text: rs(2 * I), mistake: null },
      ]
    );
  },
  "pictorial|apply": (rng) => {
    const R = pick(rng, [5, 10, 20]);
    const P = 400 * int(rng, 1, 25);
    const I1 = (P * R) / 100, I2 = ((P + I1) * R) / 100;
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "compound interest", rng),
        prompt: `${rs(P)} at ${R}% a year, compound interest. What is the interest in year 2?`,
        representation: {
          kind: "bars",
          bars: [
            { name: "Year 1", parts: [{ value: P, label: rs(P) }, { value: I1, label: `+${rs(I1)}` }] },
            { name: "Year 2", parts: [{ value: P + I1, label: rs(P + I1) }, { value: I2, label: "+ ?", ghost: true }] },
          ],
        },
      },
      { R, P },
      rs(I2),
      [
        { text: rs(I1), mistake: "int-si-for-ci" },
        { text: rs(P + I1 + I2), mistake: "int-amount-vs-interest" },
        { text: rs(2 * I1), mistake: null },
      ]
    );
  },
  "pictorial|analyze": (rng) => {
    const R = pick(rng, [10, 20]);
    const P = 400 * int(rng, 1, 25);
    const h = R / 200;
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "half-yearly", rng),
        prompt: `${rs(P)} at ${R}% a year, compounded half-yearly, for 1 year. What is the interest?`,
        representation: { kind: "bars", bars: [{ name: "1 year", parts: [{ value: 1, label: "first half-year" }, { value: 1, label: "second half-year" }] }] },
      },
      { R, P },
      rs(P * ((1 + h) ** 2 - 1)),
      [
        { text: rs((P * R) / 100), mistake: "int-time-not-doubled" },
        { text: rs(P * ((1 + R / 100) ** 2 - 1)), mistake: "int-rate-not-halved" },
        { text: rs(P * (1 + h) ** 2), mistake: "int-amount-vs-interest" },
      ]
    );
  },
  "pictorial|evaluate": (rng) => {
    const R = pick(rng, [5, 10, 20]);
    const P = 400 * int(rng, 1, 25);
    const si = (2 * P * R) / 100, ci = P * ((1 + R / 100) ** 2 - 1);
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "simple vs compound", rng),
        prompt: `${rs(P)} for 2 years at ${R}% a year. How much more is compound interest than simple interest?`,
        representation: {
          kind: "bars",
          bars: [
            { name: "Simple", parts: [{ value: si / 2, label: "year 1" }, { value: si / 2, label: "year 2" }] },
            { name: "Compound", parts: [{ value: si / 2, label: "year 1" }, { value: ci - si / 2, label: "year 2" }] },
          ],
        },
      },
      { R, P },
      rs(ci - si),
      [
        { text: "Nothing: they are the same", mistake: "int-si-for-ci" },
        { text: rs((P * R) / 100), mistake: null },
        { text: rs(2 * (ci - si)), mistake: null },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const P = 100 * int(rng, 5, 200);
    const R = int(rng, 2, 15);
    const T = int(rng, 2, 5);
    const SI = (P * R * T) / 100;
    return build(
      { ...base("a-remember", "abstract", "remember", "simple interest", rng), prompt: `Find the simple interest on ${rs(P)} at ${R}% a year for ${T} years.`, representation: null },
      { P, R, T },
      rs(SI),
      [
        { text: rs((P * R) / 100), mistake: "int-one-year-only" },
        { text: rs(P + SI), mistake: "int-amount-vs-interest" },
        { text: rs(P * R * T), mistake: null },
      ]
    );
  },
  "abstract|understand": (rng) => {
    const P = 100 * int(rng, 5, 200);
    const R = int(rng, 2, 15);
    const T = int(rng, 2, 5);
    return build(
      { ...base("a-understand", "abstract", "understand", "amount", rng), prompt: `${rs(P)} is borrowed at ${R}% a year simple interest. How much is owed after ${T} years?`, representation: null },
      { P, R, T },
      rs(P + (P * R * T) / 100),
      [
        { text: rs((P * R * T) / 100), mistake: "int-amount-vs-interest" },
        { text: rs(P + (P * R) / 100), mistake: "int-one-year-only" },
        { text: rs(P + R * T), mistake: null },
        { text: rs(P + (P * R * T) / 100 + 100), mistake: null },
      ]
    );
  },
  "abstract|apply": (rng) => {
    const R = pick(rng, [5, 10, 15, 20]);
    const P = 400 * int(rng, 1, 50);
    return build(
      { ...base("a-apply", "abstract", "apply", "compound interest", rng), prompt: `Find the compound interest on ${rs(P)} at ${R}% a year for 2 years.`, representation: null },
      { R, P },
      rs(P * ((1 + R / 100) ** 2 - 1)),
      [
        { text: rs((2 * P * R) / 100), mistake: "int-si-for-ci" },
        { text: rs(P * (1 + R / 100) ** 2), mistake: "int-amount-vs-interest" },
        { text: rs((P * R) / 100), mistake: "int-one-year-only" },
      ]
    );
  },
  "abstract|analyze": (rng) => {
    const R = pick(rng, [5, 10, 20]);
    const P = (R === 5 ? 8000 : 1000) * int(rng, 1, 10);
    const A = P * (1 + R / 100) ** 3;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "compound amount", rng), prompt: `${rs(P)} is invested at ${R}% a year, compounded yearly. What is the amount after 3 years?`, representation: null },
      { R, P },
      rs(A),
      [
        { text: rs(P * (1 + (3 * R) / 100)), mistake: "int-si-for-ci" },
        { text: rs(A - P), mistake: "int-amount-vs-interest" },
        { text: rs(P * (1 + R / 100) ** 2), mistake: null },
      ]
    );
  },
  "abstract|evaluate": (rng) => {
    const R = pick(rng, [10, 20]);
    const P = (R === 10 ? 8000 : 1000) * int(rng, 1, 10);
    const A = P * (1 + R / 200) ** 3;
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "half-yearly", rng), prompt: `${rs(P)} at ${R}% a year, compounded half-yearly. What is the amount after 1½ years?`, representation: null },
      { R, P },
      rs(A),
      [
        { text: rs(P * (1 + R / 100) ** 3), mistake: "int-rate-not-halved" },
        { text: rs(P * (1 + (3 * R) / 200)), mistake: "int-si-for-ci" },
        { text: rs(A - P), mistake: "int-amount-vs-interest" },
        { text: rs(P * (1 + R / 100) * (1 + R / 200)), mistake: "int-time-not-doubled" },
      ]
    );
  },
};
