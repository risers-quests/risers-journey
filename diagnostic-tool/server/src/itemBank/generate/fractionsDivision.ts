import { Rng, Template, build, buildActivity, frac, fracWithMixed, gcd, int, pick } from "./core.js";

/**
 * Fractions and Division, generated. Every cell tests the same idea the
 * hand-written bank did (a things shared equally among b people: each gets
 * a ÷ b = a/b), with fresh numbers and contexts each time and wrong options
 * built from named mistakes (MISCONCEPTIONS below).
 */

const TOPIC = "fractions-division";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "fd-flips": {
    label: "Flips the fraction",
    detail: "Writes b/a for a ÷ b (people on top, things below), so shares come out the wrong way round.",
    childTip: "The number of things goes on top. 7 rotis shared by 3 friends is 7/3 each.",
  },
  "fd-multiplies": {
    label: "Multiplies instead of sharing",
    detail: "Treats sharing as multiplying the two numbers.",
    childTip: "Sharing makes each share smaller, so it's dividing, not multiplying.",
  },
  "fd-subtracts": {
    label: "Subtracts instead of sharing",
    detail: "Takes one number away from the other instead of sharing equally.",
    childTip: "Sharing isn't taking away. Cut every one into equal slices and hand them out.",
  },
  "fd-adds": {
    label: "Adds the numbers",
    detail: "Combines the things and the people into one total.",
    childTip: "Don't add the things and the people. Share the things among the people.",
  },
  "fd-whole-part-only": {
    label: "Ignores the leftover",
    detail: "Gives only the whole-number part of a share (7 ÷ 3 = 2) and drops the remainder.",
    childTip: "Don't throw the leftovers away: cut them into equal slices too.",
  },
  "fd-unit-fraction-only": {
    label: "Forgets how many wholes",
    detail: "Answers 1/b, the size of one piece of one whole, instead of the full share a/b.",
    childTip: "Each person gets one slice from every one of the things, not just one slice.",
  },
  "fd-wrong-whole": {
    label: "Uses the wrong number as the whole",
    detail: "Counts pieces against the number of things instead of the number of equal parts.",
    childTip: "Count the equal parts of the whole to find the bottom number.",
  },
  "fd-names-divisor": {
    label: "Answers with the number of people",
    detail: "Gives the number of sharers instead of what each one gets.",
    childTip: "The question asks how much each person gets, not how many people there are.",
  },
  "fd-no-sharing": {
    label: "Doesn't share at all",
    detail: "Gives the whole amount to each person.",
    childTip: "Shared means split up: each person gets only part of the total.",
  },
  "fd-size-misjudged": {
    label: "Misjudges a fraction's size",
    detail: "Can't tell whether a/b is more or less than 1 (or than a whole number).",
    childTip: "If the top number is bigger, the fraction is more than 1 whole.",
  },
  "fd-not-simplified": {
    label: "Doesn't simplify",
    detail: "Leaves a fraction that can be simplified, e.g. 9/6 instead of 3/2.",
    childTip: "Look for a number that divides both top and bottom, and divide both.",
  },
  "fd-simplifies-one-part": {
    label: "Simplifies only one part",
    detail: "Divides the top (or the bottom) of a fraction but not both.",
    childTip: "Whatever you divide the top by, divide the bottom by the same.",
  },
  "fd-unequal-shares": {
    label: "Unsure what 'equal' means",
    detail: "Doesn't yet see that sharing equally means every share is the same size.",
    childTip: "Shared equally means everyone gets exactly the same amount.",
  },
  "fd-irrelevant-reason": {
    label: "Reasons from an irrelevant fact",
    detail: "Picks a reason that's true or tempting but doesn't decide the question.",
    childTip: "Check the reason really answers the question.",
  },
};

// Contexts: things that can be cut into equal pieces, and who shares them.
const FOODS = [
  { one: "roti", many: "rotis", icon: "🫓" },
  { one: "chapati", many: "chapatis", icon: "🫓" },
  { one: "dosa", many: "dosas", icon: "🥞" },
  { one: "idli", many: "idlis", icon: "🍚" },
  { one: "laddu", many: "laddus", icon: "🟠" },
  { one: "mango", many: "mangoes", icon: "🥭" },
  { one: "cake", many: "cakes", icon: "🍰" },
  { one: "pizza", many: "pizzas", icon: "🍕" },
  { one: "sandwich", many: "sandwiches", icon: "🥪" },
  { one: "paratha", many: "parathas", icon: "🫓" },
  { one: "watermelon", many: "watermelons", icon: "🍉" },
  { one: "chikki bar", many: "chikki bars", icon: "🍫" },
] as const;
const PEOPLE = ["children", "friends", "cousins", "classmates", "players", "neighbours"] as const;
const NAMES = ["Priya", "Arjun", "Meera", "Kabir", "Ananya", "Rohan", "Zara", "Ishaan", "Diya", "Vihaan", "Sara", "Aditya"] as const;

const ONE: Record<string, string> = { children: "child", friends: "friend", cousins: "cousin", classmates: "classmate", players: "player", neighbours: "neighbour" };

/** The cut-and-share activity: a things among b people (or, to build, the fraction a/b). */
function share(mode: "share" | "build", a: number, b: number, food: { one: string; many: string }, people: string) {
  return { kind: "share" as const, mode, wholes: a, people: b, itemOne: food.one, itemMany: food.many, personOne: ONE[people] ?? people, peopleLabel: people };
}

function ctx(rng: Rng) {
  return { food: pick(rng, FOODS), people: pick(rng, PEOPLE), name: pick(rng, NAMES) };
}
function id(cell: string, a: number, b: number, rng: Rng) {
  return `fd-g-${cell}-${a}-${b}-${Math.floor(rng() * 1e6).toString(36)}`;
}
function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, a: number, b: number, rng: Rng) {
  return { id: id(cell, a, b, rng), topicId: TOPIC, cpa, bloom, subskill };
}
/** a and b with a not a multiple of b (a real fraction), within ranges. */
function nonMultiple(rng: Rng, aLo: number, aHi: number, bLo: number, bHi: number) {
  for (;;) {
    const a = int(rng, aLo, aHi);
    const b = int(rng, bLo, bHi);
    if (a % b !== 0 && a !== b) return { a, b };
  }
}
function amountOf(n: number, d: number, food: { one: string; many: string }) {
  return n < d ? `${frac(n, d)} of a ${food.one}` : `${fracWithMixed(n, d)} ${food.many}`;
}

export const FRACTIONS_DIVISION_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: hands-on, cut and share ----------------
  // The child cuts the things and deals the pieces onto plates. At
  // remember/understand/evaluate what they do is the answer; at
  // apply/analyze they share first, then choose.
  "concrete|remember": (rng) => {
    const { food, people } = ctx(rng);
    const b = int(rng, 2, 8);
    const a = b * int(rng, 1, 4);
    return buildActivity(
      {
        ...base("c-remember", "concrete", "remember", "equal-sharing", a, b, rng),
        prompt: `Share the ${a} ${food.many} equally among the ${b} ${people}. Tap a plate to give it the next one.`,
        representation: null,
      },
      { a, b },
      share("share", a, b, food, people)
    );
  },

  "concrete|understand": (rng) => {
    const { food, people } = ctx(rng);
    const { a, b } = nonMultiple(rng, 2, 13, 2, 7);
    return buildActivity(
      {
        ...base("c-understand", "concrete", "understand", "equal-sharing", a, b, rng),
        prompt: `Share the ${a} ${food.many} equally among the ${b} ${people}, so nothing is left over. You can cut them into equal pieces first.`,
        representation: null,
      },
      { a, b },
      share("share", a, b, food, people)
    );
  },

  "concrete|apply": (rng) => {
    const { food, people } = ctx(rng);
    const { a, b } = nonMultiple(rng, 3, 15, 2, 7);
    return {
      ...build(
        {
          ...base("c-apply", "concrete", "apply", "fraction-notation", a, b, rng),
          prompt: `Share the ${a} ${food.many} equally among the ${b} ${people}. Then: which expression shows how much each gets?`,
          representation: null,
        },
        { a, b },
        `${a} ÷ ${b}`,
        [
          { text: `${b} ÷ ${a}`, mistake: "fd-flips" },
          { text: `${a} × ${b}`, mistake: "fd-multiplies" },
          { text: `${a} − ${b}`, mistake: "fd-subtracts" },
          { text: `${a} + ${b}`, mistake: "fd-adds" },
        ]
      ),
      activity: share("share", a, b, food, people),
    };
  },

  "concrete|analyze": (rng) => {
    const { food, people, name } = ctx(rng);
    const { a, b } = nonMultiple(rng, 5, 17, 2, 7);
    const n = Math.floor(a / b);
    if (n < 1) return FRACTIONS_DIVISION_TEMPLATES["concrete|analyze"](rng);
    return {
      ...build(
        {
          ...base("c-analyze", "concrete", "analyze", "unit-fraction-reasoning", a, b, rng),
          prompt: `Share the ${a} ${food.many} equally among the ${b} ${people}. ${name} says each gets less than ${n + 1} ${food.many}. Is ${name} right?`,
          representation: null,
        },
        { a, b },
        `Yes: each gets ${n} whole and some pieces, which is less than ${n + 1}`,
        [
          { text: `No: each gets more than ${n + 1}`, mistake: "fd-size-misjudged" },
          { text: `No: each gets exactly ${n}, and the rest are left over`, mistake: "fd-whole-part-only" },
          { text: `No: ${food.many} can't be shared equally like this`, mistake: "fd-irrelevant-reason" },
        ]
      ),
      activity: share("share", a, b, food, people),
    };
  },

  "concrete|evaluate": (rng) => {
    const { food, people } = ctx(rng);
    const b = int(rng, 3, 10);
    const a = int(rng, 2, b - 1);
    return buildActivity(
      {
        ...base("c-evaluate", "concrete", "evaluate", "word-problem-setup", a, b, rng),
        prompt: `Set up a sharing where each of the ${people} gets ${frac(a, b)} of a ${food.one}. Choose how many ${food.many} and how many ${people}, then share them out.`,
        representation: null,
      },
      { a, b },
      share("build", a, b, food, people)
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, given) => {
    const { food } = ctx(rng);
    const { a, b } = given ?? nonMultiple(rng, 2, 17, 3, 12);
    return build(
      {
        ...base("p-remember", "pictorial", "remember", "fraction-notation", a, b, rng),
        prompt: `The bar stands for ${a} ${food.many}, split into ${b} equal parts. What fraction of the whole bar is one part?`,
        representation: { kind: "bar-model", totalLabel: `${a} ${food.many}`, parts: b, highlightParts: 1, queryPartIndex: 0, segmentLabels: Array(b).fill("") },
      },
      { a, b },
      frac(1, b),
      [
        { text: frac(1, a), mistake: "fd-wrong-whole" },
        { text: frac(a, b), mistake: "fd-wrong-whole" },
        { text: frac(b, a), mistake: "fd-wrong-whole" },
        { text: frac(b - 1, b), mistake: null },
      ]
    );
  },

  "pictorial|understand": (rng, given) => {
    const { food, people } = ctx(rng);
    const { a, b } = given ?? nonMultiple(rng, 2, 17, 3, 12);
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "equal-sharing", a, b, rng),
        prompt: `${a} ${food.many} are shared equally among ${b} ${people}. Based on the bar, how much does each get?`,
        representation: { kind: "bar-model", totalLabel: `${a} ${food.many} / ${b} ${people}`, parts: b, highlightParts: 1, queryPartIndex: 0, segmentLabels: Array(b).fill("") },
      },
      { a, b },
      `Each gets ${amountOf(a, b, food)}`,
      [
        { text: `Each gets ${amountOf(b, a, food)}`, mistake: "fd-flips" },
        { text: `Each gets ${amountOf(1, b, food)}`, mistake: "fd-unit-fraction-only" },
        a > b
          ? { text: `Each gets ${Math.floor(a / b)} whole ${Math.floor(a / b) > 1 ? food.many : food.one}`, mistake: "fd-whole-part-only" }
          : { text: `Each gets a whole ${food.one}`, mistake: "fd-size-misjudged" },
        { text: `Each gets ${amountOf(1, a, food)}`, mistake: "fd-wrong-whole" },
      ]
    );
  },

  "pictorial|apply": (rng, given) => {
    const { food } = ctx(rng);
    const { a, b } = given && given.a > given.b && given.a % given.b ? given : nonMultiple(rng, 5, 19, 2, 8);
    if (a < b) return FRACTIONS_DIVISION_TEMPLATES["pictorial|apply"](rng);
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "word-problem-setup", a, b, rng),
        prompt: `The bar stands for ${a} ${food.many}, split into ${b} equal parts. How much does each part stand for?`,
        representation: { kind: "bar-model", totalLabel: `${a} ${food.many}`, parts: b, highlightParts: 1, queryPartIndex: 0, segmentLabels: Array(b).fill("") },
      },
      { a, b },
      `${fracWithMixed(a, b)} ${food.many}`,
      [
        { text: `${frac(b, a)} of a ${food.one}`, mistake: "fd-flips" },
        { text: `${frac(1, b)} of a ${food.one}`, mistake: "fd-unit-fraction-only" },
        { text: `${a} ${food.many} each`, mistake: "fd-no-sharing" },
        { text: `${Math.floor(a / b)} ${Math.floor(a / b) > 1 ? food.many : food.one}`, mistake: "fd-whole-part-only" },
      ]
    );
  },

  "pictorial|analyze": (rng, given) => {
    const { food } = ctx(rng);
    const { a, b } = given && given.a > given.b && given.a % given.b ? given : nonMultiple(rng, 7, 23, 2, 7);
    const n = Math.floor(a / b);
    if (n < 1) return FRACTIONS_DIVISION_TEMPLATES["pictorial|analyze"](rng);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "unit-fraction-reasoning", a, b, rng),
        prompt: `The bar stands for ${a} ${food.many}, split into ${b} equal parts. Which statement about one part is correct?`,
        representation: { kind: "bar-model", totalLabel: `${a} ${food.many}`, parts: b, highlightParts: 1, queryPartIndex: 0, segmentLabels: Array(b).fill("") },
      },
      { a, b },
      `Each part is ${frac(a, b)} ${food.many}, which is more than ${n} whole ${n > 1 ? food.many : food.one}`,
      [
        { text: `Each part is ${frac(b, a)} of a ${food.one}`, mistake: "fd-flips" },
        { text: `Each part is exactly ${n} ${n > 1 ? food.many : food.one}`, mistake: "fd-whole-part-only" },
        { text: `Each part is less than 1 ${food.one}`, mistake: "fd-size-misjudged" },
      ]
    );
  },

  "pictorial|evaluate": (rng, given) => {
    const { food, people } = ctx(rng);
    const { a, b } = given && given.a < given.b ? given : (() => { const b = int(rng, 3, 12); return { a: int(rng, 2, b - 1), b }; })();
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "word-problem-setup", a, b, rng),
        prompt: `${a} ${food.many} are shared equally among ${b} ${people}. Which description matches the bar model shown?`,
        representation: { kind: "bar-model", totalLabel: `${a} ${food.many} / ${b} ${people}`, parts: b, highlightParts: 1, queryPartIndex: 0, segmentLabels: Array(b).fill("") },
      },
      { a, b },
      `A bar of ${a} ${food.many} split into ${b} equal parts; each part is ${frac(a, b)}`,
      [
        { text: `A bar of ${b} ${food.many} split into ${a} equal parts; each part is ${frac(b, a)}`, mistake: "fd-flips" },
        { text: `A bar split into ${a} parts, one for each ${food.one}`, mistake: "fd-wrong-whole" },
        { text: `A bar split into ${a + b} equal parts`, mistake: "fd-adds" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, given) => {
    const { a, b } = given ?? nonMultiple(rng, 2, 19, 2, 12);
    return build(
      { ...base("a-remember", "abstract", "remember", "fraction-notation", a, b, rng), prompt: `${a} ÷ ${b} = ?`, representation: null },
      { a, b },
      frac(a, b),
      [
        { text: frac(b, a), mistake: "fd-flips" },
        { text: String(a * b), mistake: "fd-multiplies" },
        { text: String(Math.abs(a - b)), mistake: "fd-subtracts" },
        { text: String(a + b), mistake: "fd-adds" },
      ]
    );
  },

  "abstract|understand": (rng, given) => {
    const { a, b } = given ?? nonMultiple(rng, 2, 11, 2, 12);
    return build(
      { ...base("a-understand", "abstract", "understand", "fraction-notation", a, b, rng), prompt: `Which division does ${frac(a, b)} stand for?`, representation: null },
      { a, b },
      `${a} divided by ${b}`,
      [
        { text: `${b} divided by ${a}`, mistake: "fd-flips" },
        { text: `${a} multiplied by ${b}`, mistake: "fd-multiplies" },
        { text: `${Math.max(a, b)} minus ${Math.min(a, b)}`, mistake: "fd-subtracts" },
        { text: `${a} plus ${b}`, mistake: "fd-adds" },
      ]
    );
  },

  "abstract|apply": (rng, given) => {
    // a ÷ b in simplest form. Fresh questions always need simplifying.
    let a: number, b: number;
    if (given) ({ a, b } = given);
    else {
      const k = int(rng, 2, 4);
      const { a: p, b: q } = nonMultiple(rng, 2, 19, 2, 12);
      const g = gcd(p, q);
      a = (p / g) * k;
      b = (q / g) * k;
      if (b === k) return FRACTIONS_DIVISION_TEMPLATES["abstract|apply"](rng);
    }
    const g = gcd(a, b);
    const p = a / g;
    const q = b / g;
    return build(
      { ...base("a-apply", "abstract", "apply", "fraction-notation", a, b, rng), prompt: `${a} ÷ ${b} = ? (simplest form)`, representation: null },
      { a, b },
      frac(p, q),
      [
        { text: frac(q, p), mistake: "fd-flips" },
        { text: frac(a, b), mistake: g > 1 ? "fd-not-simplified" : "fd-flips" },
        { text: frac(p, b), mistake: "fd-simplifies-one-part" },
        { text: frac(a, q), mistake: "fd-simplifies-one-part" },
        { text: String(a * b), mistake: "fd-multiplies" },
        { text: frac(b, a), mistake: "fd-flips" },
      ]
    );
  },

  "abstract|analyze": (rng, given) => {
    const { a, b } = given ?? nonMultiple(rng, 2, 12, 2, 12);
    const g = gcd(a, b);
    const bigger = a > b;
    return build(
      { ...base("a-analyze", "abstract", "analyze", "unit-fraction-reasoning", a, b, rng), prompt: `If a ÷ b = ${frac(a / g, b / g)}, which must be true?`, representation: null },
      { a, b },
      bigger ? "a is greater than b" : "a is less than b",
      [
        { text: bigger ? "a is less than b" : "a is greater than b", mistake: "fd-size-misjudged" },
        { text: "a equals b", mistake: "fd-size-misjudged" },
        { text: "a must be an even number", mistake: "fd-irrelevant-reason" },
      ]
    );
  },

  "abstract|evaluate": (rng, given) => {
    const { a, b } = given && given.a > given.b ? given : nonMultiple(rng, 5, 25, 2, 9);
    if (a < b) return FRACTIONS_DIVISION_TEMPLATES["abstract|evaluate"](rng);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "word-problem-setup", a, b, rng), prompt: `${a} ÷ ${b} = ? Choose the answer with the right reason.`, representation: null },
      { a, b },
      `${frac(a, b)}, because sharing ${a} equally into ${b} groups gives ${frac(a, b)} each`,
      [
        { text: `${frac(b, a)}, because the smaller number goes on top`, mistake: "fd-flips" },
        { text: `${a * b}, because sharing means multiplying`, mistake: "fd-multiplies" },
        { text: `${a - b}, because sharing means taking away`, mistake: "fd-subtracts" },
      ]
    );
  },
};
