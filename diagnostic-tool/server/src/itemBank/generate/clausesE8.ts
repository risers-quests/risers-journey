import { Template, pick } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, entryIn, mark, shuffle, tapWords, tiles } from "./english.js";

/**
 * Dependent and Independent Clauses, Grade 8 English (English Rose Reader 8,
 * chapter 1 grammar): which clause can stand alone; noun, adjective
 * (relative) and adverb clauses; joining with who / which / whose / where.
 *   concrete  tap the independent clause; tap the dependent clause (in the
 *             middle or at the end, too); join with a relative pronoun from
 *             tiles; join with whose / where; tap the extra word in 'a woman
 *             who she …'
 *   pictorial can it stand alone?; noun, adjective or adverb clause?; join
 *             with who / which; which noun does the clause describe?; is
 *             Riya right?
 *   abstract  what each clause is; which kind; fill who / which / whose /
 *             where; which sentence has a noun clause; A or B?
 */

const TOPIC = "e8-clauses";
const base = baseFor("cla8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "cl-main-sub": {
    label: "Can't tell the independent clause from the dependent one",
    detail: "Marks the dependent clause as the one that can stand alone, or the other way round.",
    childTip: "Cover the clause and read it alone: if it makes a full sentence, it's independent. If it leaves you waiting (when the bell rang …), it's dependent.",
  },
  "cl-kind": {
    label: "Mixes up noun, adjective and adverb clauses",
    detail: "Calls 'Nobody knows where the tiger went' an adjective clause, or 'the rock where the bell hung' a noun clause.",
    childTip: "Adjective clause: describes a noun (the girl who sang). Noun clause: does a noun's job (I know that she sang). Adverb clause: tells when / why / if (when she sang).",
  },
  "cl-relative": {
    label: "Uses who for things or which for people",
    detail: "Writes the book who … or the woman which ….",
    childTip: "who: people. which: things and animals. that: either.",
  },
  "cl-whose": {
    label: "Misses 'whose' for belonging",
    detail: "Writes the boy who bicycle was stolen instead of the boy whose bicycle was stolen.",
    childTip: "whose shows belonging: the boy whose bicycle was stolen (his bicycle).",
  },
  "cl-where": {
    label: "Uses 'which' where 'where' is needed",
    detail: "Writes the village which he was born instead of the village where he was born.",
    childTip: "For a place, where = in which: the village where he was born.",
  },
  "cl-extra-pronoun": {
    label: "Repeats the subject after who / which",
    detail: "Writes a woman who she had climbed …, with she as well as who.",
    childTip: "who already stands for the person: a woman who had climbed (not who she had climbed).",
  },
  "cl-antecedent": {
    label: "Can't tell which noun the clause describes",
    detail: "Links an adjective clause to the wrong noun in the sentence.",
    childTip: "An adjective clause comes straight after the noun it describes: the oak [that stood in the forest].",
  },
  "cl-phrase": {
    label: "Mixes up phrases and clauses",
    detail: "Calls a group of words without its own verb a clause.",
    childTip: "A clause has its own subject and verb (when the bell rang). A phrase doesn't (after the bell).",
  },
};

type Kind = "noun" | "adjective" | "adverb";
/** Sentences with one dependent clause; ant = the noun an adjective clause describes. */
const CL: { s: string; dep: string; kind: Kind; ant?: string; others?: string[] }[] = [
  { s: "When the bell rang, the children ran out.", dep: "When the bell rang", kind: "adverb" },
  { s: "Della cried because she had no money.", dep: "because she had no money", kind: "adverb" },
  { s: "If you hurry, you will catch the bus.", dep: "If you hurry", kind: "adverb" },
  { s: "Although Pip was frightened, he helped the convict.", dep: "Although Pip was frightened", kind: "adverb" },
  { s: "The boy waited until the snow stopped.", dep: "until the snow stopped", kind: "adverb" },
  { s: "The oak that stood in the forest was very old.", dep: "that stood in the forest", kind: "adjective", ant: "oak", others: ["forest", "stood", "old"] },
  { s: "Jim bought the combs that Della wanted.", dep: "that Della wanted", kind: "adjective", ant: "combs", others: ["Jim", "Della", "bought"] },
  { s: "The girl who played the drums became famous.", dep: "who played the drums", kind: "adjective", ant: "girl", others: ["drums", "famous", "played"] },
  { s: "This is the rock where the bell once hung.", dep: "where the bell once hung", kind: "adjective", ant: "rock", others: ["bell", "This", "hung"] },
  { s: "The teacher, who lived in the village, loved her pupils.", dep: "who lived in the village", kind: "adjective", ant: "teacher", others: ["village", "pupils", "loved"] },
  { s: "The boy whose watch was stolen called the police.", dep: "whose watch was stolen", kind: "adjective", ant: "boy", others: ["watch", "police", "called"] },
  { s: "I know that Della loves Jim.", dep: "that Della loves Jim", kind: "noun" },
  { s: "What the convict wanted was food.", dep: "What the convict wanted", kind: "noun" },
  { s: "Nobody knows where the tiger went.", dep: "where the tiger went", kind: "noun" },
  { s: "She asked whether the shop was open.", dep: "whether the shop was open", kind: "noun" },
  { s: "The teacher said that the test was easy.", dep: "that the test was easy", kind: "noun" },
  { s: "I wonder how the ship sank.", dep: "how the ship sank", kind: "noun" },
];
const KIND_LABEL: Record<Kind, string> = {
  noun: "A noun clause: it does a noun's job",
  adjective: "An adjective clause: it describes a noun",
  adverb: "An adverb clause: it tells when, why, if …",
};
/** The independent clause = the sentence without its dependent clause (only where that reads as a sentence). */
const standsAlone = (x: (typeof CL)[number]) => x.kind !== "noun";

/** Two sentences joined with a relative pronoun. */
const REL: { a: string; b: string; tiles: string; rel: string; wrel: string; wmistake: string; dbl: string; dblWord: string }[] = [
  { a: "I met a woman.", b: "She had climbed Mount Everest.", tiles: "I met a woman | who | had climbed Mount Everest | .", rel: "who", wrel: "which", wmistake: "cl-relative", dbl: "I met a woman who she had climbed Mount Everest.", dblWord: "she" },
  { a: "Jim sold the watch.", b: "It had belonged to his father.", tiles: "Jim sold the watch | which | had belonged to his father | .", rel: "which", wrel: "who", wmistake: "cl-relative", dbl: "Jim sold the watch which it had belonged to his father.", dblWord: "it" },
  { a: "This is the boy.", b: "His bicycle was stolen.", tiles: "This is the boy | whose | bicycle was stolen | .", rel: "whose", wrel: "who", wmistake: "cl-whose", dbl: "This is the boy whose his bicycle was stolen.", dblWord: "his" },
  { a: "That is the village.", b: "My grandfather was born there.", tiles: "That is the village | where | my grandfather was born | .", rel: "where", wrel: "which", wmistake: "cl-where", dbl: "That is the village where my grandfather was born there.", dblWord: "there" },
  { a: "The girl plays the drums.", b: "She lives next door.", tiles: "The girl | who | lives next door | plays the drums | .", rel: "who", wrel: "which", wmistake: "cl-relative", dbl: "The girl who she lives next door plays the drums.", dblWord: "she" },
  { a: "The oak tree is very old.", b: "It stands near the school.", tiles: "The oak tree | which | stands near the school | is very old | .", rel: "which", wrel: "who", wmistake: "cl-relative", dbl: "The oak tree which it stands near the school is very old.", dblWord: "it" },
  { a: "I know a man.", b: "His dog can sing.", tiles: "I know a man | whose | dog can sing | .", rel: "whose", wrel: "who", wmistake: "cl-whose", dbl: "I know a man whose his dog can sing.", dblWord: "his" },
  { a: "Pip met a convict.", b: "The convict was hiding in the marshes.", tiles: "Pip met a convict | who | was hiding in the marshes | .", rel: "who", wrel: "which", wmistake: "cl-relative", dbl: "Pip met a convict who he was hiding in the marshes.", dblWord: "he" },
  { a: "We visited the forest.", b: "The tigers live there.", tiles: "We visited the forest | where | the tigers live | .", rel: "where", wrel: "which", wmistake: "cl-where", dbl: "We visited the forest where the tigers live there.", dblWord: "there" },
  { a: "Della bought a chain.", b: "It cost twenty-one dollars.", tiles: "Della bought a chain | which | cost twenty-one dollars | .", rel: "which", wrel: "who", wmistake: "cl-relative", dbl: "Della bought a chain which it cost twenty-one dollars.", dblWord: "it" },
  { a: "The teacher praised the boy.", b: "He had walked through the snow.", tiles: "The teacher praised the boy | who | had walked through the snow | .", rel: "who", wrel: "which", wmistake: "cl-relative", dbl: "The teacher praised the boy who he had walked through the snow.", dblWord: "he" },
  { a: "This is the shop.", b: "Della sold her hair there.", tiles: "This is the shop | where | Della sold her hair | .", rel: "where", wrel: "which", wmistake: "cl-where", dbl: "This is the shop where Della sold her hair there.", dblWord: "there" },
];
const parts = (x: (typeof REL)[number]) => x.tiles.split("|").map((t) => t.trim());
const joined = (x: (typeof REL)[number], rel = x.rel) => parts(x).map((t) => (t === x.rel ? rel : t)).join(" ").replace(/ \./, ".");
const RELS = ["who", "which", "whose", "where"];

const DEFS: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  { q: "An independent clause ___", a: "can stand alone as a sentence", w: [{ text: "always starts with when, because or if", mistake: "cl-main-sub" }, { text: "has no verb", mistake: "cl-phrase" }, { text: "can't stand alone", mistake: "cl-main-sub" }] },
  { q: "An adjective (relative) clause usually begins with ___", a: "who, which, that, whose or where", w: [{ text: "because, although or if", mistake: "cl-kind" }, { text: "and, but or so", mistake: "cl-kind" }, { text: "in, on or at", mistake: "cl-phrase" }] },
  { q: "'I know that she sang.' The clause 'that she sang' is ___", a: "a noun clause, the object of 'know'", w: [{ text: "an adjective clause describing 'I'", mistake: "cl-kind" }, { text: "an adverb clause of time", mistake: "cl-kind" }, { text: "an independent clause", mistake: "cl-main-sub" }] },
  { q: "We use 'whose' to show ___", a: "belonging (the boy whose bicycle …)", w: [{ text: "a place (the village whose …)", mistake: "cl-where" }, { text: "a thing (the book whose I read)", mistake: "cl-relative" }, { text: "a time (the day whose …)", mistake: "cl-whose" }] },
  { q: "Which group of words is a clause?", a: "because the shop was closed", w: [{ text: "because of the rain", mistake: "cl-phrase" }, { text: "near the old oak tree", mistake: "cl-phrase" }, { text: "after the long walk", mistake: "cl-phrase" }] },
];

const p = (i: number, extra: Record<string, number> = {}) => ({ i, ...extra });

export const CLAUSES_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, x] = entryIn(rng, CL, standsAlone, g);
    const dep = tapWords(x.s, x.dep);
    const main = dep.tokens.map((_, k) => k).filter((k) => !dep.target.includes(k));
    return doIt(
      base("c-remember", "concrete", "remember", "the independent clause", rng),
      "Tap every word of the independent clause (the part that could stand alone).",
      p(i),
      { kind: "words", tokens: dep.tokens, target: main, wrongSets: [{ cells: dep.target, mistake: "cl-main-sub" }] }
    );
  },
  "concrete|understand": (rng, g) => {
    const [i, x] = entry(rng, CL, g);
    const act = tapWords(x.s, x.dep);
    if (standsAlone(x)) act.wrongSets = [{ cells: act.tokens.map((_, k) => k).filter((k) => !act.target.includes(k)), mistake: "cl-main-sub" }];
    return doIt(base("c-understand", "concrete", "understand", "the dependent clause", rng), "Tap every word of the dependent clause.", p(i), act);
  },
  "concrete|apply": (rng, g) => {
    const [i, x] = entryIn(rng, REL, (r) => r.rel === "who" || r.rel === "which", g);
    return doIt(
      base("c-apply", "concrete", "apply", "join with who / which", rng),
      `Join into one sentence: '${x.a} ${x.b}' (Not every tile is needed.)`,
      p(i, { k: 1 }),
      tiles(rng, x.tiles, [x.wrel], [{ text: joined(x, x.wrel), mistake: x.wmistake }])
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, x] = entryIn(rng, REL, (r) => r.rel === "whose" || r.rel === "where", g);
    return doIt(
      base("c-analyze", "concrete", "analyze", "join with whose / where", rng),
      `Join into one sentence: '${x.a} ${x.b}' (Not every tile is needed.)`,
      p(i, { k: 1 }),
      tiles(rng, x.tiles, [x.wrel, x.dblWord], [{ text: joined(x, x.wrel), mistake: x.wmistake }])
    );
  },
  "concrete|evaluate": (rng, g) => {
    const [i, x] = entry(rng, REL, g);
    const act = tapWords(x.dbl, x.dblWord);
    // in "… whose his …", "there … there": the extra word is the one after the relative / at the end
    if (x.dblWord === "there") act.target = [act.tokens.length - 1];
    return doIt(base("c-evaluate", "concrete", "evaluate", "the extra pronoun", rng), "One word in this sentence isn't needed. Tap it.", p(i, { k: 1 }), act);
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, x] = entryIn(rng, CL, standsAlone, g);
    return choose(
      base("p-remember", "pictorial", "remember", "can it stand alone?", rng),
      "Can the highlighted part stand alone as a sentence?",
      card([mark(x.s, x.dep)]),
      p(i),
      "No: it is a dependent clause",
      [
        { text: "Yes: it is an independent clause", mistake: "cl-main-sub" },
        { text: "No: it is a phrase with no verb", mistake: "cl-phrase" },
        { text: "Yes: every clause can stand alone", mistake: "cl-main-sub" },
      ]
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, x] = entry(rng, CL, g);
    const right = KIND_LABEL[x.kind];
    return choose(
      base("p-understand", "pictorial", "understand", "noun, adjective or adverb clause", rng),
      "What kind of clause is highlighted?",
      card([mark(x.s, x.dep)]),
      p(i),
      right,
      [...Object.values(KIND_LABEL).filter((t) => t !== right).map((text) => ({ text, mistake: "cl-kind" })), { text: "A phrase: it has no verb", mistake: "cl-phrase" }]
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, x] = entry(rng, REL, g);
    const others = RELS.filter((r) => r !== x.rel && r !== x.wrel);
    return choose(
      base("p-apply", "pictorial", "apply", "join with a relative pronoun", rng),
      "Join these two sentences into one.",
      card([x.a, x.b]),
      p(i, { k: 1 }),
      joined(x),
      [
        { text: joined(x, x.wrel), mistake: x.wmistake },
        { text: x.dbl, mistake: "cl-extra-pronoun" },
        { text: joined(x, others[0]), mistake: x.rel === "whose" ? "cl-whose" : x.rel === "where" ? "cl-where" : "cl-relative" },
      ]
    );
  },
  "pictorial|analyze": (rng, g) => {
    const [i, x] = entryIn(rng, CL, (c) => c.kind === "adjective", g);
    return choose(
      base("p-analyze", "pictorial", "analyze", "which noun the clause describes", rng),
      "Which word does the highlighted clause describe?",
      card([mark(x.s, x.dep)]),
      p(i),
      x.ant!,
      x.others!.map((text) => ({ text, mistake: "cl-antecedent" }))
    );
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, x] = entry(rng, CL, g);
    const kinds: Kind[] = ["noun", "adjective", "adverb"];
    const said = g && Number.isInteger(g.s) ? kinds[g.s] : pick(rng, kinds);
    const right = said === x.kind ? "Yes, she is right" : `No, it is ${x.kind === "adjective" || x.kind === "adverb" ? "an" : "a"} ${x.kind} clause`;
    const opts = ["Yes, she is right", ...kinds.filter((k) => k !== said).map((k) => `No, it is ${k === "noun" ? "a" : "an"} ${k} clause`), "No, it is a phrase"];
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "judge the kind of clause", rng),
      `Riya says the highlighted part is ${said === "noun" ? "a" : "an"} ${said} clause. Is she right?`,
      card([mark(x.s, x.dep)]),
      p(i, { s: kinds.indexOf(said) }),
      right,
      opts.filter((o) => o !== right).map((text) => ({ text, mistake: text.includes("phrase") ? "cl-phrase" : "cl-kind" }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, d] = entry(rng, DEFS, g);
    return choose(base("a-remember", "abstract", "remember", "what clauses are", rng), d.q, null, p(i, { k: 2 }), d.a, d.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, x] = entry(rng, CL, g);
    const NAME: Record<Kind, string> = { noun: "Noun clause", adjective: "Adjective clause", adverb: "Adverb clause" };
    return choose(
      base("a-understand", "abstract", "understand", "which kind of clause", rng),
      `${x.s} What kind of clause is '${x.dep}'?`,
      null,
      p(i),
      NAME[x.kind],
      [...Object.values(NAME).filter((t) => t !== NAME[x.kind]).map((text) => ({ text, mistake: "cl-kind" })), { text: "Independent clause", mistake: "cl-main-sub" }]
    );
  },
  "abstract|apply": (rng, g) => {
    const [i, x] = entry(rng, REL, g);
    const gap = joined(x, "___");
    return choose(
      base("a-apply", "abstract", "apply", "who, which, whose or where", rng),
      `Fill the gap: ${gap}`,
      null,
      p(i, { k: 1 }),
      x.rel,
      RELS.filter((r) => r !== x.rel).map((text) => ({ text, mistake: x.rel === "whose" ? "cl-whose" : x.rel === "where" ? "cl-where" : "cl-relative" }))
    );
  },
  "abstract|analyze": (rng, g) => {
    const [i, x] = entryIn(rng, CL, (c) => c.kind === "noun", g);
    const adj = shuffle(rng, CL.filter((c) => c.kind === "adjective")).slice(0, 2);
    const adv = pick(rng, CL.filter((c) => c.kind === "adverb"));
    return choose(
      base("a-analyze", "abstract", "analyze", "spot the noun clause", rng),
      "Which sentence has a noun clause (a clause doing a noun's job)?",
      null,
      p(i, { j: CL.indexOf(adj[0]) }),
      x.s,
      [...adj.map((c) => ({ text: c.s, mistake: "cl-kind" })), { text: adv.s, mistake: "cl-kind" }]
    );
  },
  "abstract|evaluate": (rng, g) => {
    const [i, x] = entry(rng, REL, g);
    const bads = [{ text: joined(x, x.wrel), mistake: x.wmistake }, { text: x.dbl, mistake: "cl-extra-pronoun" }];
    const w = g && Number.isInteger(g.w) && bads[g.w] ? g.w : Math.floor(rng() * 2);
    const aRight = g && Number.isInteger(g.a) ? g.a === 1 : rng() < 0.5;
    return choose(
      base("a-evaluate", "abstract", "evaluate", "judge a joined sentence", rng),
      `A: ${aRight ? joined(x) : bads[w].text} B: ${aRight ? bads[w].text : joined(x)} Which is correct?`,
      null,
      p(i, { k: 1, w, a: aRight ? 1 : 0 }),
      aRight ? "Only A" : "Only B",
      [
        { text: aRight ? "Only B" : "Only A", mistake: bads[w].mistake },
        { text: "Both", mistake: bads[w].mistake },
        { text: "Neither", mistake: "cl-relative" },
      ]
    );
  },
};

/** For the stress test. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  if (cell === "abstract|apply" && right !== REL[it.params.i].rel) return "relative pronoun should be the bank's";
  if (cell === "pictorial|apply" && !right.includes(` ${REL[it.params.i].rel} `)) return "joined sentence should use the bank's relative pronoun";
  for (const x of CL) if (!x.s.includes(x.dep)) return `clause not in sentence: ${x.s}`;
  return null;
}
