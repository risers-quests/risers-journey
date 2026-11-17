import { Rng, Template, build, buildActivity, gcd, int, pick } from "./core.js";

/**
 * Fractions, Grade 4 (book chapter 6): equivalent fractions, simplest form,
 * comparing unit and like fractions, adding and subtracting like
 * fractions, mixed ↔ improper fractions, and a fraction of a number.
 * Grade 4 only; contexts follow the book (Jisha and Leena's pizza, Hina's
 * cup of sugar, "2/3 of 18").
 *   concrete  colour slices of a pizza (cut it yourself), share apples
 *   pictorial pizzas and bars with slices coloured
 *   abstract  fractions in symbols
 */

const TOPIC = "four-operations-fractions";

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  "fr4-colours-rest": {
    label: "Counts the wrong part",
    detail: "Gives the part not coloured (or not used) instead of the part asked about.",
    childTip: "Read the question again: is it asking about the coloured part or the rest?",
  },
  "fr4-numerator-only": {
    label: "Keeps the top number when the slices change",
    detail: "Uses the same number of slices after the pizza is cut into more (3/4 coloured as 3 of 8 slices).",
    childTip: "If each slice is cut in two, the coloured slices double too: 3/4 = 6/8.",
  },
  "fr4-adds-same": {
    label: "Adds instead of multiplying for equivalent fractions",
    detail: "Adds the same number to top and bottom (2/3 → 4/5), which changes the fraction.",
    childTip: "Multiply (or divide) the top and the bottom by the same number.",
  },
  "fr4-flips": {
    label: "Turns the fraction upside down",
    detail: "Writes the number of parts in all on top (4/3 for 3 out of 4).",
    childTip: "The bottom number is how many equal parts in all; the top is how many we're talking about.",
  },
  "fr4-part-to-part": {
    label: "Compares coloured with uncoloured",
    detail: "Writes coloured ÷ uncoloured (3/1) instead of coloured ÷ all the parts (3/4).",
    childTip: "The bottom number counts all the equal parts, coloured or not.",
  },
  "fr4-bigger-denominator": {
    label: "Thinks a bigger bottom number means a bigger fraction",
    detail: "Says 1/8 is more than 1/5 because 8 is more than 5.",
    childTip: "Cutting into more slices makes each slice smaller: 1/8 of a pizza is less than 1/5.",
  },
  "fr4-adds-denominators": {
    label: "Adds the bottom numbers too",
    detail: "Adds like fractions as 2/6 + 1/6 = 3/12, adding the denominators as well.",
    childTip: "Sixths plus sixths are still sixths: add only the top numbers.",
  },
  "fr4-wrong-operation": {
    label: "Adds instead of subtracting (or the other way round)",
    detail: "Uses the wrong operation for the question.",
    childTip: "Ask: are we putting parts together, or taking some away?",
  },
  "fr4-not-simplest": {
    label: "Stops simplifying too soon",
    detail: "Divides once (8/12 → 4/6) but the fraction can still be made simpler.",
    childTip: "Keep dividing top and bottom by the same number until nothing more goes into both.",
  },
  "fr4-one-part-only": {
    label: "Finds one part, not all the parts",
    detail: "For 2/3 of 18, gives 1/3 of 18 (6) and stops.",
    childTip: "Divide by the bottom number to find one part, then multiply by the top number.",
  },
  "fr4-divides-by-numerator": {
    label: "Divides by the top number",
    detail: "For 2/3 of 18, works out 18 ÷ 2.",
    childTip: "The bottom number tells you how many equal parts to make.",
  },
  "fr4-mixed-swapped": {
    label: "Mixes up the whole number and the leftover",
    detail: "Writes 17/5 as 2 3/5 instead of 3 2/5 (swaps the quotient and the remainder).",
    childTip: "Divide: how many wholes (the quotient), and how many parts left over (the remainder).",
  },
  "fr4-adds-whole": {
    label: "Adds the whole number to the top",
    detail: "Turns 2 1/4 into 3/4 (2 + 1 on top) instead of 9/4.",
    childTip: "Each whole is 4 quarters: 2 wholes are 8 quarters, plus 1 more is 9/4.",
  },
};

const NAMES = ["Priya", "Arjun", "Meera", "Kabir", "Ananya", "Rohan", "Zara", "Ishaan", "Diya", "Vihaan", "Sara", "Aditya"] as const;
const f = (n: number, d: number) => `${n}/${d}`;
const mixed = (n: number, d: number) => (n % d === 0 ? String(n / d) : n < d ? f(n, d) : `${Math.floor(n / d)} ${f(n % d, d)}`);

function base(cell: string, cpa: "concrete" | "pictorial" | "abstract", bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate", subskill: string, n: number, rng: Rng) {
  return { id: `fr4-${cell}-${n}-${Math.floor(rng() * 1e6).toString(36)}`, topicId: TOPIC, cpa, bloom, subskill };
}

/**
 * The mistakes a pizza activity can name: drops any that colour the same
 * amount as the right answer or as an earlier mistake (it couldn't tell
 * them apart).
 */
function distinct(target: { n: number; d: number }, wrong: { n: number; d: number; mistake: string }[]) {
  const seen = [target];
  return wrong.filter((w) => {
    if (w.n <= 0 || seen.some((x) => x.n * w.d === w.n * x.d)) return false;
    seen.push(w);
    return true;
  });
}

const PROPER: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 8], [5, 8], [7, 8]];

export const FRACTIONS_G4_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: colour a pizza, share apples ----------------
  "concrete|remember": (rng) => {
    const [n, d] = pick(rng, PROPER);
    return buildActivity(
      { ...base("c-remember", "concrete", "remember", "naming-fractions", n * 100 + d, rng), prompt: `Cut the pizza into equal slices and colour ${f(n, d)} of it.`, representation: null },
      { n, d },
      { kind: "pizza", pies: 1, slices: null, target: { n, d }, wrong: distinct({ n, d }, [{ n: d - n, d, mistake: "fr4-colours-rest" }]) }
    );
  },

  "concrete|understand": (rng) => {
    // Equivalent fractions: the pizza is already cut into more slices.
    const [n, d] = pick(rng, PROPER.filter(([, dd]) => dd <= 4));
    const k = pick(rng, [2, 3]);
    return buildActivity(
      {
        ...base("c-understand", "concrete", "understand", "equivalent-fractions", n * 100 + d * 10 + k, rng),
        prompt: `This pizza is cut into ${d * k} equal slices. Colour ${f(n, d)} of the pizza.`,
        representation: null,
      },
      { n, d, k },
      {
        kind: "pizza",
        pies: 1,
        slices: d * k,
        target: { n, d },
        // When two mistakes would colour the same amount, only the first is named.
        wrong: distinct({ n, d }, [
          { n, d: d * k, mistake: "fr4-numerator-only" },
          { n: d - n, d, mistake: "fr4-colours-rest" },
        ]),
      }
    );
  },

  "concrete|apply": (rng) => {
    // Adding like fractions (Jisha and Leena's pizza).
    const d = pick(rng, [5, 6, 8, 10]);
    const a = int(rng, 1, d - 3);
    const b = int(rng, 1, d - 1 - a);
    return buildActivity(
      {
        ...base("c-apply", "concrete", "apply", "add-like-fractions", a * 100 + b * 10 + d, rng),
        prompt: `Jisha takes ${f(a, d)} of a pizza. Leena takes ${f(b, d)} of the same pizza. Colour the part they take altogether.`,
        representation: null,
      },
      { a, b, d },
      {
        kind: "pizza",
        pies: 1,
        slices: d,
        target: { n: a + b, d },
        wrong: distinct({ n: a + b, d }, [
          { n: Math.abs(a - b), d, mistake: "fr4-wrong-operation" },
          { n: d - a - b, d, mistake: "fr4-colours-rest" },
        ]),
      }
    );
  },

  "concrete|analyze": (rng) => {
    // A fraction of a number, with apples in baskets to help.
    const d = pick(rng, [3, 4, 5, 6]);
    const unit = int(rng, 2, 5);
    const total = d * unit;
    const k = int(rng, 2, d - 1);
    const right = k * unit;
    const item = build(
      {
        ...base("c-analyze", "concrete", "analyze", "fraction-of-number", total * 10 + k, rng),
        prompt: `What is ${f(k, d)} of ${total} apples? Share the apples into ${d} baskets to help, then choose.`,
        representation: null,
      },
      { total, k, d },
      `${right} apples`,
      [
        { text: `${unit} apples`, mistake: "fr4-one-part-only" },
        ...(total % k === 0 && total / k !== right ? [{ text: `${total / k} apples`, mistake: "fr4-divides-by-numerator" }] : []),
        { text: `${total - right} apples`, mistake: "fr4-colours-rest" },
        { text: `${right + unit} apples`, mistake: null },
        { text: `${right - unit} apples`, mistake: null },
        { text: `${right + 1} apples`, mistake: null },
      ]
    );
    return { ...item, activity: { kind: "group", mode: "equal", items: total, baskets: d, icon: "🍎", itemMany: "apples", basketOne: "basket" } };
  },

  "concrete|evaluate": (rng) => {
    // Improper fraction as a mixed fraction, checked on pizzas.
    const d = pick(rng, [3, 4]);
    const q = 1;
    const r = int(rng, 2, d - 1); // never equal to q, so a swapped claim is always wrong
    const n = q * d + r;
    const name = pick(rng, NAMES);
    const truthful = rng() < 0.5;
    const claim = truthful ? mixed(n, d) : `${r === q ? q + 1 : r} ${f(q, d)}`;
    const item = build(
      {
        ...base("c-evaluate", "concrete", "evaluate", "mixed-improper", n * 10 + d, rng),
        prompt: `${name} says ${f(n, d)} of a pizza is the same as ${claim} pizzas. Colour ${f(n, d)} on the pizzas to check. Is ${name} right?`,
        representation: null,
      },
      { n, d, t: truthful ? 1 : 0 },
      truthful ? `Yes — ${d} slices make 1 whole pizza, with ${r} more` : `No — it is ${mixed(n, d)}: 1 whole pizza and ${f(r, d)}`,
      truthful
        ? [
            { text: `No — it is ${r} ${f(q, d)}`, mistake: "fr4-mixed-swapped" },
            { text: `No — ${f(n, d)} is less than 1 pizza`, mistake: "fr4-flips" },
            { text: `No — it is ${q + 1} ${f(r, d)}`, mistake: null },
          ]
        : [
            { text: `Yes — the numbers are the same`, mistake: "fr4-mixed-swapped" },
            { text: `No — ${f(n, d)} is less than 1 pizza`, mistake: "fr4-flips" },
            { text: `No — it is ${q + 1} ${f(r, d)}`, mistake: null },
          ]
    );
    return { ...item, activity: { kind: "pizza", pies: 2, slices: d, target: { n, d } } };
  },

  // ---------------- PICTORIAL: pizzas and bars ----------------
  "pictorial|remember": (rng) => {
    const [n, d] = pick(rng, PROPER.filter(([nn, dd]) => dd - nn !== nn));
    return build(
      {
        ...base("p-remember", "pictorial", "remember", "naming-fractions", n * 100 + d, rng),
        prompt: "What fraction of the pizza is coloured?",
        representation: { kind: "pie", pies: [{ slices: d, shaded: n }] },
      },
      { n, d },
      f(n, d),
      [
        { text: f(d - n, d), mistake: "fr4-colours-rest" },
        { text: f(n, d - n), mistake: "fr4-part-to-part" },
        { text: f(d, n), mistake: "fr4-flips" },
      ]
    );
  },

  "pictorial|understand": (rng) => {
    // Equivalent fractions on two pizzas of the same size.
    const [n, d] = pick(rng, PROPER.filter(([, dd]) => dd <= 4));
    const k = pick(rng, [2, 3]);
    return build(
      {
        ...base("p-understand", "pictorial", "understand", "equivalent-fractions", n * 100 + d * 10 + k, rng),
        prompt: `The pizzas are the same size. Pizza A shows ${f(n, d)} coloured. How many of pizza B's ${d * k} slices must be coloured to show the same amount?`,
        representation: { kind: "pie", pies: [{ slices: d, shaded: n, label: "A" }, { slices: d * k, shaded: 0, label: "B" }] },
      },
      { n, d, k },
      String(n * k),
      [
        { text: String(n), mistake: "fr4-numerator-only" },
        { text: String(n + k), mistake: "fr4-adds-same" },
        { text: String(d * k - n * k), mistake: "fr4-colours-rest" },
        { text: String(n * k + 1), mistake: null },
        { text: String(n * k - 1), mistake: null },
        { text: String(d * k), mistake: null },
      ]
    );
  },

  "pictorial|apply": (rng) => {
    // Comparing unit fractions.
    const a = int(rng, 2, 6);
    const b = int(rng, a + 2, 10);
    const smallFirst = rng() < 0.5;
    const [x, y] = smallFirst ? [b, a] : [a, b];
    return build(
      {
        ...base("p-apply", "pictorial", "apply", "compare-fractions", a * 100 + b, rng),
        prompt: `Pizza A shows ${f(1, x)} and pizza B shows ${f(1, y)}. Which is more pizza?`,
        representation: { kind: "pie", pies: [{ slices: x, shaded: 1, label: `A: ${f(1, x)}` }, { slices: y, shaded: 1, label: `B: ${f(1, y)}` }] },
      },
      { a, b, s: smallFirst ? 1 : 0 },
      `${f(1, a)} (pizza ${smallFirst ? "B" : "A"})`,
      [
        { text: `${f(1, b)} (pizza ${smallFirst ? "A" : "B"})`, mistake: "fr4-bigger-denominator" },
        { text: "They are the same: one slice each", mistake: null },
        { text: "You can't tell from the pictures", mistake: null },
      ]
    );
  },

  "pictorial|analyze": (rng) => {
    // Subtracting from 1 whole (Hina's cup of sugar).
    const d = pick(rng, [5, 6, 8, 10]);
    const used = int(rng, 1, d - 1);
    if (d - used === used) return FRACTIONS_G4_TEMPLATES["pictorial|analyze"](rng);
    return build(
      {
        ...base("p-analyze", "pictorial", "analyze", "subtract-like-fractions", used * 100 + d, rng),
        prompt: `Hina had 1 cup of sugar. She used ${f(used, d)} cup to bake a cake (the coloured part). How much sugar is left?`,
        representation: { kind: "bar-model", totalLabel: "1 cup", parts: d, highlightParts: used },
      },
      { used, d },
      `${f(d - used, d)} cup`,
      [
        { text: `${f(used, d)} cup`, mistake: "fr4-colours-rest" },
        { text: `${f(d - used, 2 * d)} cup`, mistake: "fr4-adds-denominators" },
        { text: `${f(d + used, d)} cup`, mistake: "fr4-wrong-operation" },
        { text: `${f(d - used + 1, d)} cup`, mistake: null },
      ]
    );
  },

  "pictorial|evaluate": (rng) => {
    // Whole pizzas and a part: mixed and improper.
    const d = pick(rng, [3, 4, 6]);
    const q = int(rng, 1, 2);
    const r = int(rng, 1, d - 1);
    const n = q * d + r;
    const name = pick(rng, NAMES);
    const truthful = rng() < 0.5;
    const claim = truthful ? f(n, d) : f(q + r, d);
    const pies = [...Array.from({ length: q }, () => ({ slices: d, shaded: d })), { slices: d, shaded: r }];
    return build(
      {
        ...base("p-evaluate", "pictorial", "evaluate", "mixed-improper", n * 10 + d, rng),
        prompt: `${name} says the coloured slices show ${claim} of a pizza. Is ${name} right?`,
        representation: { kind: "pie", pies },
      },
      { n, d, t: truthful ? 1 : 0 },
      truthful ? `Yes — ${mixed(n, d)} pizzas is ${f(n, d)}` : `No — it is ${mixed(n, d)} pizzas, which is ${f(n, d)}`,
      truthful
        ? [
            { text: `No — it is ${f(q + r, d)}`, mistake: "fr4-adds-whole" },
            { text: `No — it is ${f(r, d)}`, mistake: "fr4-colours-rest" },
            { text: `No — it is ${f(n, d * (q + 1))}`, mistake: "fr4-part-to-part" },
          ]
        : [
            { text: `Yes — ${q} whole and ${r} slices make ${f(q + r, d)}`, mistake: "fr4-adds-whole" },
            { text: `No — it is ${f(r, d)}`, mistake: "fr4-colours-rest" },
            { text: `No — it is ${f(n, d * (q + 1))}`, mistake: "fr4-part-to-part" },
          ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng) => {
    const [n, d] = pick(rng, PROPER.filter(([, dd]) => dd <= 6));
    const k = int(rng, 2, 5);
    return build(
      { ...base("a-remember", "abstract", "remember", "equivalent-fractions", n * 100 + d * 10 + k, rng), prompt: `Which fraction is equal to ${f(n, d)}?`, representation: null },
      { n, d, k },
      f(n * k, d * k),
      [
        { text: f(n + k, d + k), mistake: "fr4-adds-same" },
        { text: f(n * k, d), mistake: "fr4-numerator-only" },
        { text: f(d, n), mistake: "fr4-flips" },
        { text: f(n * k + 1, d * k), mistake: null },
      ]
    );
  },

  "abstract|understand": (rng) => {
    // Simplest form, where one division isn't enough.
    const [a, b] = pick(rng, [[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [2, 5]] as const);
    const g = pick(rng, [4, 6, 8]);
    const n = a * g;
    const d = b * g;
    return build(
      { ...base("a-understand", "abstract", "understand", "simplest-form", n * 100 + d, rng), prompt: `Write ${f(n, d)} in its simplest form.`, representation: null },
      { n, d },
      f(a, b),
      [
        { text: f(n / 2, d / 2), mistake: "fr4-not-simplest" },
        { text: f(b, a), mistake: "fr4-flips" },
        { text: f(a + 1, b + 1), mistake: "fr4-adds-same" },
        { text: f(a, b + 1), mistake: null },
      ]
    );
  },

  "abstract|apply": (rng) => {
    // Add or subtract like fractions.
    const d = pick(rng, [7, 9, 11, 12, 13, 15]);
    const add = rng() < 0.5;
    const a = int(rng, 2, d - 3);
    const b = add ? int(rng, 1, d - 1 - a) : int(rng, 1, a - 1);
    if (b < 1) return FRACTIONS_G4_TEMPLATES["abstract|apply"](rng);
    const right = add ? a + b : a - b;
    if (right === b) return FRACTIONS_G4_TEMPLATES["abstract|apply"](rng); // the answer would already be in the question
    return build(
      { ...base("a-apply", "abstract", "apply", add ? "add-like-fractions" : "subtract-like-fractions", a * 100 + b * 10 + d, rng), prompt: `${f(a, d)} ${add ? "+" : "−"} ${f(b, d)} = ?`, representation: null },
      { a, b, d, add: add ? 1 : 0 },
      f(right, d),
      add
        ? [
            { text: f(right, 2 * d), mistake: "fr4-adds-denominators" },
            { text: f(a - b > 0 ? a - b : b - a, d), mistake: "fr4-wrong-operation" },
            { text: f(right + 1, d), mistake: null },
          ]
        : [
            { text: f(a + b, d), mistake: "fr4-wrong-operation" },
            { text: f(right, 2 * d), mistake: "fr4-adds-denominators" },
            { text: f(right + 1, d), mistake: null },
          ]
    );
  },

  "abstract|analyze": (rng) => {
    // Order unit fractions (smaller bottom number = bigger fraction).
    const ds = new Set<number>();
    while (ds.size < 4) ds.add(int(rng, 2, 12));
    const list = [...ds];
    const asc = [...list].sort((x, y) => y - x); // biggest denominator = smallest fraction
    const show = (arr: number[]) => arr.map((x) => f(1, x)).join(", ");
    let shuffled = [...list].sort(() => rng() - 0.5);
    // never shown already in order (either way), or the question gives the answer away
    while (show(shuffled) === show(asc) || show(shuffled) === show([...asc].reverse())) shuffled = [...list].sort(() => rng() - 0.5);
    return build(
      { ...base("a-analyze", "abstract", "analyze", "compare-fractions", list.join("").length * 1000 + asc[0], rng), prompt: `Put these from smallest to greatest: ${show(shuffled)}`, representation: null },
      { a: list[0], b: list[1], c: list[2], e: list[3] },
      show(asc),
      [
        { text: show([...asc].reverse()), mistake: "fr4-bigger-denominator" },
        { text: show([asc[1], asc[0], asc[2], asc[3]]), mistake: null },
        { text: show([asc[0], asc[2], asc[1], asc[3]]), mistake: null },
      ]
    );
  },

  "abstract|evaluate": (rng) => {
    // Improper → mixed: is the claim right?
    const d = pick(rng, [3, 4, 5, 6, 7]);
    const q = int(rng, 2, 5);
    const r = int(rng, 1, d - 1);
    if (r === q) return FRACTIONS_G4_TEMPLATES["abstract|evaluate"](rng);
    const n = q * d + r;
    const name = pick(rng, NAMES);
    const truthful = rng() < 0.5;
    const claim = truthful ? `${q} ${f(r, d)}` : `${r} ${f(q, d)}`;
    const swappedOk = q < d; // "r q/d" is only a sensible-looking claim if q < d
    if (!truthful && !swappedOk) return FRACTIONS_G4_TEMPLATES["abstract|evaluate"](rng);
    return build(
      { ...base("a-evaluate", "abstract", "evaluate", "mixed-improper", n * 10 + d, rng), prompt: `${name} writes ${f(n, d)} as ${claim}. Is ${name} right?`, representation: null },
      { n, d, t: truthful ? 1 : 0 },
      truthful ? `Yes — ${n} ÷ ${d} = ${q} remainder ${r}` : `No — ${n} ÷ ${d} = ${q} remainder ${r}, so it is ${q} ${f(r, d)}`,
      truthful
        ? [
            { text: `No — it should be ${r} ${f(q, d)}`, mistake: "fr4-mixed-swapped" },
            { text: `No — it should be ${q} ${f(r, n)}`, mistake: null },
            { text: `No — ${f(n, d)} is less than 1`, mistake: "fr4-flips" },
          ]
        : [
            { text: `Yes — ${n} ÷ ${d} gives ${r} and ${q}`, mistake: "fr4-mixed-swapped" },
            { text: `No — it should be ${q} ${f(r, n)}`, mistake: null },
            { text: `No — ${f(n, d)} is less than 1`, mistake: "fr4-flips" },
          ]
    );
  },
};

/** Independent answer check for the stress test. */
export function verify(item: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const right = item.choices.find((c) => c.id === item.correctChoiceId)?.text ?? "";
  const p = item.params;
  const others = item.choices.filter((c) => c.id !== item.correctChoiceId).map((c) => c.text);
  const val = (t: string) => {
    const m = t.match(/^(\d+)\/(\d+)/);
    return m ? Number(m[1]) / Number(m[2]) : NaN;
  };
  switch (`${item.cpa}|${item.bloom}`) {
    case "concrete|analyze":
      return Number(right.split(" ")[0]) === (p.total / p.d) * p.k ? null : `fraction of number wrong: ${right}`;
    case "pictorial|remember":
      return right === `${p.n}/${p.d}` ? null : `naming wrong: ${right}`;
    case "pictorial|understand":
      return Number(right) === p.n * p.k ? null : `equivalent slices wrong: ${right}`;
    case "pictorial|apply":
      return right.startsWith(`1/${p.a} `) ? null : `bigger unit fraction wrong: ${right}`;
    case "pictorial|analyze":
      return right.startsWith(`${p.d - p.used}/${p.d}`) ? null : `sugar left wrong: ${right}`;
    case "abstract|remember":
    case "abstract|understand": {
      const want = item.bloom === "remember" ? p.n / p.d : p.n / p.d;
      if (Math.abs(val(right) - want) > 1e-9) return `not equivalent: ${right}`;
      return others.some((o) => Math.abs(val(o) - want) < 1e-9) && item.bloom === "remember" ? `another option is equivalent too` : null;
    }
    case "abstract|apply": {
      const want = p.add ? p.a + p.b : p.a - p.b;
      return right === `${want}/${p.d}` && !others.some((o) => Math.abs(val(o) - want / p.d) < 1e-9) ? null : `sum/difference wrong or duplicated: ${right}`;
    }
    case "abstract|analyze": {
      const vals = right.split(", ").map(val);
      return vals.every((v, i) => i === 0 || v > vals[i - 1]) ? null : `not smallest to greatest: ${right}`;
    }
    case "concrete|evaluate":
    case "pictorial|evaluate":
    case "abstract|evaluate":
      return right.startsWith(p.t ? "Yes" : "No") ? null : `claim marked wrongly: ${right}`;
  }
  return null;
}
