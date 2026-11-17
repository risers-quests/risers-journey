import { Template, pick } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, mark, shuffle, tapWords, tiles } from "./english.js";

/**
 * Conditionals (first, second and third), Grade 8 English (English Rose
 * Reader 8, chapter 17 grammar; Model Test Paper 2, question H: "make
 * sentences in the first conditional using these prompts").
 *   concrete  tap the condition (if-clause); tap the result verb; build a
 *             first conditional from the prompt; build a third conditional;
 *             tap the wrong word (If you will …)
 *   pictorial which conditional; what does it tell us; make a first
 *             conditional from a prompt; change to the second; what did
 *             Riya get wrong
 *   abstract  the patterns; fill the if-verb; fill the result verb; which
 *             sentence is about a past that didn't happen; A or B?
 */

const TOPIC = "e8-conditionals";
const base = baseFor("cnd8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "cond-will-in-if": {
    label: "Puts will in the if-clause",
    detail: "Writes If you will study … instead of If you study ….",
    childTip: "No will after if: If you study regularly, you will score well.",
  },
  "cond-would-in-if": {
    label: "Puts would in the if-clause",
    detail: "Writes If I would be … / If you would have studied … instead of If I were … / If you had studied ….",
    childTip: "would goes in the result, not after if: If I were taller, I would reach it. If you had studied, you would have passed.",
  },
  "cond-mixed": {
    label: "Mixes the parts of two conditionals",
    detail: "Joins a second-conditional if-clause to a first-conditional result (If you studied, you will …), or the other way round.",
    childTip: "Match the pairs: 1st present + will; 2nd past + would; 3rd had + past participle + would have.",
  },
  "cond-tense": {
    label: "Uses the wrong tense after if",
    detail: "Uses the simple past where the third conditional needs had + past participle (If you studied, you would have …).",
    childTip: "Third conditional: If + had + past participle (had studied), would have + past participle (would have scored).",
  },
  "cond-type": {
    label: "Mixes up first, second and third conditionals",
    detail: "Names the wrong conditional, or writes one when another was asked for.",
    childTip: "1st: If it rains, we will … 2nd: If it rained, we would … 3rd: If it had rained, we would have …",
  },
  "cond-meaning": {
    label: "Misreads what a conditional means",
    detail: "Thinks a third conditional happened, or that a second conditional is a real plan.",
    childTip: "1st: a real chance in the future. 2nd: imagined or unlikely. 3rd: an imagined past that did NOT happen.",
  },
  "cond-clauses": {
    label: "Can't find the condition and the result",
    detail: "Takes the result clause for the if-clause, or the other way round.",
    childTip: "The condition starts with if; the result says what happens (will / would / would have).",
  },
};

interface Entry {
  /** if-clause subject; verb in 1st / 2nd / 3rd; its base form and past participle; words after it */
  S: string;
  v: [string, string, string];
  base: string;
  pp: string;
  r1: string;
  /** result subject; verb in 1st / 2nd / 3rd; words after it */
  R: string;
  m: [string, string, string];
  r2: string;
}

const BANK: Entry[] = [
  { S: "you", v: ["study", "studied", "had studied"], base: "study", pp: "studied", r1: "regularly", R: "you", m: ["will score", "would score", "would have scored"], r2: "well in exams" },
  { S: "you", v: ["wake", "woke", "had woken"], base: "wake", pp: "woken", r1: "up early", R: "you", m: ["will catch", "would catch", "would have caught"], r2: "the school bus" },
  { S: "you", v: ["help", "helped", "had helped"], base: "help", pp: "helped", r1: "your friends", R: "they", m: ["will support", "would support", "would have supported"], r2: "you too" },
  { S: "we", v: ["use", "used", "had used"], base: "use", pp: "used", r1: "reusable bottles", R: "we", m: ["will reduce", "would reduce", "would have reduced"], r2: "plastic waste" },
  { S: "it", v: ["rains", "rained", "had rained"], base: "rain", pp: "rained", r1: "heavily", R: "the match", m: ["will be cancelled", "would be cancelled", "would have been cancelled"], r2: "" },
  { S: "Della", v: ["has", "had", "had had"], base: "have", pp: "had", r1: "more money", R: "she", m: ["will buy", "would buy", "would have bought"], r2: "Jim a better present" },
  { S: "the farmers", v: ["get", "got", "had got"], base: "get", pp: "got", r1: "enough rain", R: "they", m: ["will grow", "would grow", "would have grown"], r2: "more rice" },
  { S: "I", v: ["am", "were", "had been"], base: "be", pp: "been", r1: "taller", R: "I", m: ["will reach", "would reach", "would have reached"], r2: "the top shelf" },
  { S: "Sir Ralph", v: ["leaves", "left", "had left"], base: "leave", pp: "left", r1: "the bell alone", R: "his ship", m: ["will be", "would be", "would have been"], r2: "safe" },
  { S: "you", v: ["water", "watered", "had watered"], base: "water", pp: "watered", r1: "the plants", R: "they", m: ["will grow", "would grow", "would have grown"], r2: "well" },
  { S: "she", v: ["practises", "practised", "had practised"], base: "practise", pp: "practised", r1: "every day", R: "she", m: ["will win", "would win", "would have won"], r2: "the competition" },
  { S: "we", v: ["leave", "left", "had left"], base: "leave", pp: "left", r1: "early", R: "we", m: ["will reach", "would reach", "would have reached"], r2: "on time" },
  { S: "Pip", v: ["tells", "told", "had told"], base: "tell", pp: "told", r1: "his sister", R: "she", m: ["will punish", "would punish", "would have punished"], r2: "him" },
  { S: "the rangers", v: ["protect", "protected", "had protected"], base: "protect", pp: "protected", r1: "the forest", R: "the tigers", m: ["will survive", "would survive", "would have survived"], r2: "" },
  { S: "he", v: ["saves", "saved", "had saved"], base: "save", pp: "saved", r1: "his pocket money", R: "he", m: ["will buy", "would buy", "would have bought"], r2: "a new bicycle" },
  { S: "they", v: ["plant", "planted", "had planted"], base: "plant", pp: "planted", r1: "more trees", R: "the city", m: ["will be", "would be", "would have been"], r2: "cooler" },
  { S: "I", v: ["finish", "finished", "had finished"], base: "finish", pp: "finished", r1: "my homework", R: "I", m: ["will watch", "would watch", "would have watched"], r2: "the match" },
  { S: "you", v: ["ask", "asked", "had asked"], base: "ask", pp: "asked", r1: "politely", R: "the librarian", m: ["will help", "would help", "would have helped"], r2: "you" },
  { S: "the bell", v: ["rings", "rang", "had rung"], base: "ring", pp: "rung", r1: "loudly", R: "the sailors", m: ["will hear", "would hear", "would have heard"], r2: "it" },
  { S: "Jim", v: ["keeps", "kept", "had kept"], base: "keep", pp: "kept", r1: "his watch", R: "he", m: ["will not buy", "would not buy", "would not have bought"], r2: "the combs" },
  { S: "we", v: ["switch", "switched", "had switched"], base: "switch", pp: "switched", r1: "off the lights", R: "we", m: ["will save", "would save", "would have saved"], r2: "electricity" },
  { S: "the tiger", v: ["sees", "saw", "had seen"], base: "see", pp: "seen", r1: "us", R: "it", m: ["will run", "would run", "would have run"], r2: "away" },
];

const sp = (s: string) => (s ? ` ${s}` : "");
const ifPart = (e: Entry, verb: string) => `If ${e.S} ${verb}${sp(e.r1)}`;
const resPart = (e: Entry, verb: string) => `${e.R} ${verb}${sp(e.r2)}`;
const cond = (e: Entry, ifVerb: string, resVerb: string) => `${ifPart(e, ifVerb)}, ${resPart(e, resVerb)}.`;
const typeN = (e: Entry, n: number) => cond(e, e.v[n], e.m[n]);
/** "will score" → "had scored": the result verb's past perfect (for a wrong option). */
const hadPP = (e: Entry) => e.m[2].replace(/^would (not )?have /, "had $1");
const promptOf = (e: Entry) => `${e.base}${sp(e.r1)} … ${e.m[0].replace(/^will (not )?/, "$1")}${sp(e.r2)}`;

function wrongs(e: Entry, n: number) {
  if (n === 0)
    return [
      { text: cond(e, `will ${e.base}`, e.m[0]), mistake: "cond-will-in-if" },
      { text: cond(e, e.v[1], e.m[0]), mistake: "cond-mixed" },
      { text: cond(e, e.v[0], e.m[1]), mistake: "cond-mixed" },
      { text: typeN(e, 1), mistake: "cond-type" },
    ];
  if (n === 1)
    return [
      { text: cond(e, `would ${e.base}`, e.m[1]), mistake: "cond-would-in-if" },
      { text: cond(e, e.v[1], e.m[0]), mistake: "cond-mixed" },
      { text: cond(e, e.v[0], e.m[1]), mistake: "cond-mixed" },
      { text: typeN(e, 2), mistake: "cond-type" },
    ];
  return [
    { text: cond(e, `would have ${e.pp}`, e.m[2]), mistake: "cond-would-in-if" },
    { text: cond(e, e.v[1], e.m[2]), mistake: "cond-tense" },
    { text: cond(e, e.v[2], e.m[0]), mistake: "cond-mixed" },
    { text: typeN(e, 1), mistake: "cond-type" },
  ];
}

const NAMES = ["First conditional", "Second conditional", "Third conditional"];
const MEANING = ["A real chance: it may well happen", "Imagined or unlikely, now or in the future", "An imagined past: it did not happen", "A fact that is always true"];

const RULES: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  {
    q: "First conditional: If + ___, will + base verb",
    a: "simple present (If it rains)",
    w: [
      { text: "will + base verb (If it will rain)", mistake: "cond-will-in-if" },
      { text: "simple past (If it rained)", mistake: "cond-mixed" },
      { text: "had + past participle (If it had rained)", mistake: "cond-type" },
    ],
  },
  {
    q: "Second conditional: If + simple past, ___ + base verb",
    a: "would",
    w: [
      { text: "will", mistake: "cond-mixed" },
      { text: "would have", mistake: "cond-type" },
      { text: "had", mistake: "cond-tense" },
    ],
  },
  {
    q: "Third conditional: If + ___, would have + past participle",
    a: "had + past participle (If you had left)",
    w: [
      { text: "simple past (If you left)", mistake: "cond-tense" },
      { text: "would have + past participle (If you would have left)", mistake: "cond-would-in-if" },
      { text: "simple present (If you leave)", mistake: "cond-mixed" },
    ],
  },
  {
    q: "In a second conditional about yourself, the book's form is: If I ___ you, I would apologise.",
    a: "were",
    w: [
      { text: "will be", mistake: "cond-will-in-if" },
      { text: "would be", mistake: "cond-would-in-if" },
      { text: "am", mistake: "cond-mixed" },
    ],
  },
  {
    q: "Which conditional is used to talk about a past that cannot be changed?",
    a: "The third conditional",
    w: [
      { text: "The first conditional", mistake: "cond-meaning" },
      { text: "The second conditional", mistake: "cond-meaning" },
      { text: "Any of them", mistake: "cond-meaning" },
    ],
  },
];

const LABEL: Record<string, string> = {
  "cond-would-in-if": "She put would after if",
  "cond-mixed": "She mixed two kinds of conditional",
  "cond-tense": "She used the simple past after if",
  "cond-type": "She made a different conditional",
  "": "Nothing: it is right",
};

const p = (i: number, extra: Record<string, number> = {}) => ({ i, ...extra });
const nOf = (g: Record<string, number> | undefined, rng: () => number, max = 3) => (g && Number.isInteger(g.n) ? g.n : Math.floor(rng() * max));

export const CONDITIONALS_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const n = nOf(g, rng);
    const act = tapWords(typeN(e, n), ifPart(e, e.v[n]));
    act.wrongSets = [{ cells: act.tokens.map((_, k) => k).filter((k) => !act.target.includes(k)), mistake: "cond-clauses" }];
    return doIt(base("c-remember", "concrete", "remember", "the condition", rng), "Tap every word of the condition (the if-clause).", p(i, { n }), act);
  },
  "concrete|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const n = nOf(g, rng);
    return doIt(
      base("c-understand", "concrete", "understand", "the result verb", rng),
      "Tap the verb in the result (what will or would happen). It can be more than one word.",
      p(i, { n }),
      tapWords(typeN(e, n), e.m[n], [{ phrase: e.v[n], mistake: "cond-clauses" }])
    );
  },
  "concrete|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return doIt(
      base("c-apply", "concrete", "apply", "make a first conditional", rng),
      `Make a first conditional sentence: ${promptOf(e)} (Not every tile is needed.)`,
      p(i),
      tiles(rng, `If ${e.S} | ${e.v[0]}${sp(e.r1)} | , | ${e.R} | ${e.m[0]}${sp(e.r2)} | .`, [`will ${e.base}${sp(e.r1)}`, e.m[1] + sp(e.r2)], [
        { text: cond(e, `will ${e.base}`, e.m[0]), mistake: "cond-will-in-if" },
        { text: cond(e, e.v[0], e.m[1]), mistake: "cond-mixed" },
      ])
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return doIt(
      base("c-analyze", "concrete", "analyze", "make a third conditional", rng),
      `It didn't happen. Make a third conditional sentence: ${promptOf(e)} (Not every tile is needed.)`,
      p(i),
      tiles(rng, `If ${e.S} | ${e.v[2]}${sp(e.r1)} | , | ${e.R} | ${e.m[2]}${sp(e.r2)} | .`, [`would have ${e.pp}${sp(e.r1)}`, `${e.v[1]}${sp(e.r1)}`], [
        { text: cond(e, `would have ${e.pp}`, e.m[2]), mistake: "cond-would-in-if" },
        { text: cond(e, e.v[1], e.m[2]), mistake: "cond-tense" },
      ])
    );
  },
  "concrete|evaluate": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const s = cond(e, `will ${e.base}`, e.m[0]);
    const act = tapWords(s, "will");
    const second = act.tokens.findIndex((t, k) => k > act.target[0] && t === "will");
    act.wrongSets = second >= 0 ? [{ cells: [second], mistake: "cond-will-in-if" }] : [];
    return doIt(base("c-evaluate", "concrete", "evaluate", "correct a conditional", rng), "One word in this sentence shouldn't be there. Tap it.", p(i), act);
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const n = nOf(g, rng);
    return choose(
      base("p-remember", "pictorial", "remember", "which conditional", rng),
      "Which conditional is this?",
      card([mark(typeN(e, n), e.m[n])]),
      p(i, { n }),
      NAMES[n],
      [...NAMES.filter((_, k) => k !== n).map((text) => ({ text, mistake: "cond-type" })), { text: "It isn't a conditional", mistake: "cond-type" }]
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const n = nOf(g, rng);
    return choose(
      base("p-understand", "pictorial", "understand", "what a conditional means", rng),
      "What does this sentence tell us?",
      card([typeN(e, n)]),
      p(i, { n }),
      MEANING[n],
      MEANING.filter((_, k) => k !== n).map((text) => ({ text, mistake: "cond-meaning" }))
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(base("p-apply", "pictorial", "apply", "make a first conditional", rng), "Make a first conditional sentence from this prompt.", card([promptOf(e)], "Prompt"), p(i), typeN(e, 0), wrongs(e, 0));
  },
  "pictorial|analyze": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(base("p-analyze", "pictorial", "analyze", "first to second conditional", rng), "Change this into the second conditional (less likely, imagined).", card([typeN(e, 0)]), p(i), typeN(e, 1), wrongs(e, 1));
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const ws = wrongs(e, 2);
    const at = g && Number.isInteger(g.v) ? g.v : Math.floor(rng() * (ws.length + 1));
    const hers = at < ws.length ? ws[at] : { text: typeN(e, 2), mistake: "" };
    const right = LABEL[hers.mistake];
    const opts = Object.entries(LABEL).filter(([k]) => k !== hers.mistake);
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "check a third conditional", rng),
      "Riya was asked for a third conditional from the prompt. What, if anything, did she get wrong?",
      card([promptOf(e), `Riya: ${hers.text}`], "Prompt, then Riya's sentence"),
      p(i, { v: at }),
      right,
      // Missing her mistake is that mistake; calling a right sentence wrong shows the rule they doubt.
      shuffle(rng, opts).map(([k, text]) => ({ text, mistake: hers.mistake || k || "cond-type" }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, r] = entry(rng, RULES, g);
    return choose(base("a-remember", "abstract", "remember", "the patterns", rng), r.q, null, p(i, { k: 1 }), r.a, r.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const n = nOf(g, rng);
    const gap = `If ${e.S} ___${sp(e.r1)}, ${resPart(e, e.m[n])}.`;
    const others = [0, 1, 2].filter((k) => k !== n).map((k) => ({ text: e.v[k], mistake: "cond-mixed" }));
    return choose(
      base("a-understand", "abstract", "understand", "the verb after if", rng),
      `Fill the gap: ${gap}`,
      null,
      p(i, { n }),
      e.v[n],
      [{ text: n === 0 ? `will ${e.base}` : n === 1 ? `would ${e.base}` : `would have ${e.pp}`, mistake: n === 0 ? "cond-will-in-if" : "cond-would-in-if" }, ...others]
    );
  },
  "abstract|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const gap = `${ifPart(e, e.v[2])}, ${e.R} ___${sp(e.r2)}.`;
    return choose(
      base("a-apply", "abstract", "apply", "the third-conditional result", rng),
      `Fill the gap: ${gap}`,
      null,
      p(i),
      e.m[2],
      [
        { text: e.m[0], mistake: "cond-mixed" },
        { text: e.m[1], mistake: "cond-mixed" },
        { text: hadPP(e), mistake: "cond-tense" },
      ]
    );
  },
  "abstract|analyze": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const other = pick(rng, BANK.filter((x) => x !== e));
    return choose(
      base("a-analyze", "abstract", "analyze", "which talks about the past", rng),
      "Which sentence is about something that did NOT happen in the past?",
      null,
      p(i, { j: BANK.indexOf(other) }),
      typeN(e, 2),
      [
        { text: typeN(e, 1), mistake: "cond-meaning" },
        { text: typeN(e, 0), mistake: "cond-meaning" },
        { text: typeN(other, 1), mistake: "cond-meaning" },
      ]
    );
  },
  "abstract|evaluate": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const n = nOf(g, rng);
    const ws = wrongs(e, n).filter((w) => w.mistake !== "cond-type");
    const w = g && Number.isInteger(g.w) && ws[g.w] ? g.w : Math.floor(rng() * ws.length);
    const aRight = g && Number.isInteger(g.a) ? g.a === 1 : rng() < 0.5;
    const A = aRight ? typeN(e, n) : ws[w].text;
    const B = aRight ? ws[w].text : typeN(e, n);
    return choose(
      base("a-evaluate", "abstract", "evaluate", "judge a conditional", rng),
      `Which is a correct ${NAMES[n].toLowerCase()}? A: ${A} B: ${B}`,
      null,
      p(i, { n, w, a: aRight ? 1 : 0 }),
      aRight ? "Only A" : "Only B",
      [
        { text: aRight ? "Only B" : "Only A", mistake: ws[w].mistake },
        { text: "Both", mistake: ws[w].mistake },
        { text: "Neither", mistake: "cond-type" },
      ]
    );
  },
};

/** For the stress test: the right sentence is rebuilt from the bank's parts and uses the right pair of verbs. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  const e = BANK[it.params.i];
  const want: Record<string, string> = { "pictorial|apply": typeN(e, 0), "pictorial|analyze": typeN(e, 1), "abstract|analyze": typeN(e, 2) };
  if (want[cell] && right !== want[cell]) return `should be "${want[cell]}"`;
  for (const c of it.choices) if (/^If \S+ (will|would)\b/.test(c.text) && c.id === it.correctChoiceId) return "will/would after if in the right answer";
  return null;
}
