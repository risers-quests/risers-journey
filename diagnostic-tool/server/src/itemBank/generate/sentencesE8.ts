import { Template, pick } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entryIn, entry, mark, tapWords, tiles } from "./english.js";

/**
 * Simple, Compound and Complex Sentences, and Transformation of Sentences,
 * Grade 8 English (English Rose Reader 8, chapters 11–12 grammar; Model
 * Test Paper 2, questions D and E).
 *   concrete  tap the joining word; tap the dependent clause; join two
 *             sentences (compound, then complex) from tiles; remove the
 *             extra joining word (although … but)
 *   pictorial simple, compound or complex?; what is the highlighted part?;
 *             join into a compound sentence; change into a complex one; is
 *             Riya right about the kind of sentence?
 *   abstract  what each kind is; identify; change to complex; change to
 *             simple; A or B?
 */

const TOPIC = "e8-sentences";
const base = baseFor("sen8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "st-type": {
    label: "Mixes up simple, compound and complex sentences",
    detail: "Calls a sentence with a dependent clause compound, or a long simple sentence complex.",
    childTip: "Count the clauses (subject + verb). One: simple. Two equal ones joined by and / but / or / so: compound. A main clause + a dependent one (because, although, when, who, that …): complex.",
  },
  "st-main-sub": {
    label: "Can't tell the main clause from the dependent clause",
    detail: "Marks the main clause as the dependent one, or the other way round.",
    childTip: "The dependent clause starts with a word like because, although, when, if, who, that, and can't stand alone as a sentence.",
  },
  "st-wrong-link": {
    label: "Uses a joining word that changes the meaning",
    detail: "Joins with so where the ideas contrast, or but where one causes the other.",
    childTip: "and adds, but contrasts, so gives a result, or gives a choice. Although contrasts, because gives a reason, when / after give time, if gives a condition.",
  },
  "st-double-link": {
    label: "Uses two joining words for one join",
    detail: "Writes Although … but … or Because … so …, joining the same two clauses twice.",
    childTip: "One join needs one joining word: 'Although she was nervous, she spoke well' or 'She was nervous, but she spoke well'.",
  },
  "st-comma-splice": {
    label: "Joins two sentences with only a comma",
    detail: "Writes She was nervous, she spoke well (a comma splice).",
    childTip: "A comma can't join two sentences on its own: add and / but / so, or start one with although / because.",
  },
  "st-not-changed": {
    label: "Doesn't change the sentence as directed",
    detail: "Gives back the sentence (or the same kind of sentence) instead of changing it.",
    childTip: "Read the direction: simple means one clause; compound, two joined by and / but / or / so; complex, a main and a dependent clause.",
  },
  "st-fragment": {
    label: "Gives half a sentence",
    detail: "Gives a dependent clause or a phrase on its own, as if it were a sentence.",
    childTip: "A sentence needs a main clause that can stand alone. 'Although she was nervous.' leaves us waiting.",
  },
  "st-phrase-clause": {
    label: "Mixes up phrases and clauses",
    detail: "Calls a phrase (no verb of its own) a clause, or a clause a phrase.",
    childTip: "A clause has its own subject and verb (when the bell rang). A phrase doesn't (after the bell, walking home).",
  },
};

interface Entry {
  /** two simple sentences */
  a: string;
  b: string;
  /** the coordinator that joins them, and one that would change the meaning */
  link: string;
  wlink: string;
  /** the complex sentence, its dependent clause (as written in it) and that clause's joining word(s) */
  cx: string;
  dep: string;
  sub: string;
  /** the same idea as one simple sentence (where it reads naturally) */
  simple?: string;
}

const BANK: Entry[] = [
  { a: "She was nervous.", b: "She delivered a confident speech.", link: "but", wlink: "so", cx: "Although she was nervous, she delivered a confident speech.", dep: "Although she was nervous", sub: "Although", simple: "In spite of being nervous, she delivered a confident speech." },
  { a: "He studied all night.", b: "He finally understood the concept.", link: "and", wlink: "or", cx: "After he had studied all night, he finally understood the concept.", dep: "After he had studied all night", sub: "After", simple: "After studying all night, he finally understood the concept." },
  { a: "Suresh cooked dinner.", b: "His sister set the table.", link: "and", wlink: "or", cx: "While Suresh cooked dinner, his sister set the table.", dep: "While Suresh cooked dinner", sub: "While" },
  { a: "The road was slippery.", b: "She drove without hesitation.", link: "but", wlink: "so", cx: "Even though the road was slippery, she drove without hesitation.", dep: "Even though the road was slippery", sub: "Even though", simple: "Despite the slippery road, she drove without hesitation." },
  { a: "Rohan completed his homework.", b: "He went out to play.", link: "and", wlink: "or", cx: "After Rohan had completed his homework, he went out to play.", dep: "After Rohan had completed his homework", sub: "After", simple: "Having completed his homework, Rohan went out to play." },
  { a: "It started raining.", b: "The match was stopped.", link: "so", wlink: "but", cx: "Because it started raining, the match was stopped.", dep: "Because it started raining", sub: "Because", simple: "Because of the rain, the match was stopped." },
  { a: "Della had only one dollar and eighty-seven cents.", b: "She could not buy Jim a good present.", link: "so", wlink: "but", cx: "As Della had only one dollar and eighty-seven cents, she could not buy Jim a good present.", dep: "As Della had only one dollar and eighty-seven cents", sub: "As", simple: "With only one dollar and eighty-seven cents, Della could not buy Jim a good present." },
  { a: "The tiger was hungry.", b: "It came out of the forest.", link: "so", wlink: "but", cx: "Since the tiger was hungry, it came out of the forest.", dep: "Since the tiger was hungry", sub: "Since", simple: "Being hungry, the tiger came out of the forest." },
  { a: "You must hurry.", b: "You will miss the school bus.", link: "or", wlink: "and", cx: "If you do not hurry, you will miss the school bus.", dep: "If you do not hurry", sub: "If", simple: "Without hurrying, you will miss the school bus." },
  { a: "The boy was tired.", b: "He kept walking.", link: "but", wlink: "so", cx: "Though the boy was tired, he kept walking.", dep: "Though the boy was tired", sub: "Though", simple: "Despite his tiredness, the boy kept walking." },
  { a: "Grandmother was telling us a story.", b: "We fell asleep.", link: "and", wlink: "or", cx: "While Grandmother was telling us a story, we fell asleep.", dep: "While Grandmother was telling us a story", sub: "While", simple: "During Grandmother's story, we fell asleep." },
  { a: "The bell rang.", b: "The students rushed out.", link: "and", wlink: "or", cx: "As soon as the bell rang, the students rushed out.", dep: "As soon as the bell rang", sub: "As soon as", simple: "On hearing the bell, the students rushed out." },
  { a: "The shop was closed.", b: "We went home.", link: "so", wlink: "but", cx: "Since the shop was closed, we went home.", dep: "Since the shop was closed", sub: "Since", simple: "Finding the shop closed, we went home." },
  { a: "Arun walked through the museum.", b: "He admired the ancient sculptures.", link: "and", wlink: "or", cx: "While he walked through the museum, Arun admired the ancient sculptures.", dep: "While he walked through the museum", sub: "While", simple: "Walking through the museum, Arun admired the ancient sculptures." },
  { a: "The ship struck the rock.", b: "It sank.", link: "and", wlink: "but", cx: "After the ship struck the rock, it sank.", dep: "After the ship struck the rock", sub: "After", simple: "After striking the rock, the ship sank." },
  { a: "He is poor.", b: "He is honest.", link: "but", wlink: "so", cx: "Although he is poor, he is honest.", dep: "Although he is poor", sub: "Although", simple: "In spite of his poverty, he is honest." },
  { a: "Pip was frightened.", b: "He helped the convict.", link: "but", wlink: "so", cx: "Although Pip was frightened, he helped the convict.", dep: "Although Pip was frightened", sub: "Although", simple: "Despite his fear, Pip helped the convict." },
  { a: "The monsoon arrived.", b: "The farmers began sowing.", link: "and", wlink: "or", cx: "When the monsoon arrived, the farmers began sowing.", dep: "When the monsoon arrived", sub: "When", simple: "On the arrival of the monsoon, the farmers began sowing." },
  { a: "Meera was ill.", b: "She could not go on the school trip.", link: "so", wlink: "but", cx: "Because Meera was ill, she could not go on the school trip.", dep: "Because Meera was ill", sub: "Because", simple: "Because of her illness, Meera could not go on the school trip." },
  { a: "Take an umbrella.", b: "You will get wet.", link: "or", wlink: "and", cx: "If you do not take an umbrella, you will get wet.", dep: "If you do not take an umbrella", sub: "If", simple: "Without an umbrella, you will get wet." },
  { a: "The bicycle is red.", b: "It belongs to my cousin.", link: "and", wlink: "but", cx: "The bicycle that is red belongs to my cousin.", dep: "that is red", sub: "that", simple: "The red bicycle belongs to my cousin." },
  { a: "I met a woman.", b: "She had climbed Mount Everest.", link: "and", wlink: "but", cx: "I met a woman who had climbed Mount Everest.", dep: "who had climbed Mount Everest", sub: "who" },
  { a: "The Abbot placed a bell on the rock.", b: "Sailors were warned of the danger.", link: "so", wlink: "but", cx: "The Abbot placed a bell on the rock so that sailors were warned of the danger.", dep: "so that sailors were warned of the danger", sub: "so that" },
  { a: "Jim sold his watch.", b: "He bought the combs for Della.", link: "and", wlink: "or", cx: "After Jim had sold his watch, he bought the combs for Della.", dep: "After Jim had sold his watch", sub: "After", simple: "Selling his watch, Jim bought the combs for Della." },
];

const PRONOUN_START = /^(She|He|It|His|Her|You|We|They|The|Sailors)\b/;
const lowerStart = (s: string) => (PRONOUN_START.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const stop = (s: string) => s.replace(/[.]$/, "");
const compound = (e: Entry, link = e.link) => `${stop(e.a)}, ${link} ${lowerStart(e.b)}`;
const splice = (e: Entry) => `${stop(e.a)}, ${lowerStart(e.b)}`;
const depFirst = (e: Entry) => e.cx.startsWith(e.dep);
/** The main clause of a dependent-first complex sentence, as it follows the comma. */
const mainOf = (e: Entry) => e.cx.slice(e.dep.length + 2);
const doubled = (e: Entry) => `${e.dep}, ${e.link} ${mainOf(e)}`;
const fragment = (e: Entry) => `${e.dep.charAt(0).toUpperCase()}${e.dep.slice(1)}.`;
const WSUB: Record<string, string> = { Although: "Because", "Even though": "Because", Though: "Because", Because: "Although", Since: "Although", As: "Although", After: "Unless", While: "Unless", When: "Unless", "As soon as": "Unless", If: "Although" };
const wrongSub = (e: Entry) => (depFirst(e) && WSUB[e.sub] ? WSUB[e.sub] + e.cx.slice(e.sub.length) : null);

type Form = "simple" | "compound" | "complex";
/** The sentence of a given form for an entry (v: 0 simple, 1 compound, 2 complex; simple falls back to sentence a). */
const FORMS: Form[] = ["simple", "compound", "complex"];
const formOf = (e: Entry, v: number) => (v === 0 ? e.simple ?? e.a : v === 1 ? compound(e) : e.cx);
const TYPE_LABEL: Record<Form, string> = { simple: "Simple", compound: "Compound", complex: "Complex" };

const DEFS: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  {
    q: "A complex sentence has ___",
    a: "one main clause and at least one dependent clause",
    w: [
      { text: "two main clauses joined by and, but, or or so", mistake: "st-type" },
      { text: "only one clause, however long it is", mistake: "st-type" },
      { text: "difficult words in it", mistake: "st-type" },
    ],
  },
  {
    q: "A compound sentence has ___",
    a: "two or more main clauses joined by and, but, or, so",
    w: [
      { text: "a main clause and a dependent clause", mistake: "st-type" },
      { text: "only one subject and one verb", mistake: "st-type" },
      { text: "a compound word in it", mistake: "st-type" },
    ],
  },
  {
    q: "A simple sentence has ___",
    a: "only one clause (one subject and its verb)",
    w: [
      { text: "fewer than ten words", mistake: "st-type" },
      { text: "no joining word and no phrases", mistake: "st-phrase-clause" },
      { text: "one main clause and one dependent clause", mistake: "st-type" },
    ],
  },
  {
    q: "A dependent (subordinate) clause ___",
    a: "has a subject and a verb but can't stand alone as a sentence",
    w: [
      { text: "has no verb", mistake: "st-phrase-clause" },
      { text: "can stand alone as a sentence", mistake: "st-main-sub" },
      { text: "always comes at the end of a sentence", mistake: "st-main-sub" },
    ],
  },
  {
    q: "Which is a clause, not a phrase?",
    a: "when the bell rang",
    w: [
      { text: "after the bell", mistake: "st-phrase-clause" },
      { text: "walking home slowly", mistake: "st-phrase-clause" },
      { text: "in the morning", mistake: "st-phrase-clause" },
    ],
  },
];

const p = (i: number, extra: Record<string, number> = {}) => ({ i, ...extra });

export const SENTENCES_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const v = g && Number.isInteger(g.v) ? g.v : rng() < 0.5 ? 1 : 2;
    const s = formOf(e, v);
    return doIt(
      base("c-remember", "concrete", "remember", "the joining word", rng),
      "Tap the joining word (conjunction). It can be more than one word, like 'even though'.",
      p(i, { v }),
      tapWords(s, v === 1 ? e.link : e.sub)
    );
  },
  "concrete|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const act = tapWords(e.cx, e.dep);
    const main = act.tokens.map((_, k) => k).filter((k) => !act.target.includes(k));
    act.wrongSets = [{ cells: main, mistake: "st-main-sub" }];
    return doIt(base("c-understand", "concrete", "understand", "the dependent clause", rng), "Tap every word of the dependent clause (the part that can't stand alone).", p(i), act);
  },
  "concrete|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return doIt(
      base("c-apply", "concrete", "apply", "join into a compound sentence", rng),
      `Join into one compound sentence: '${e.a} ${e.b}' (Not every tile is needed.)`,
      p(i),
      tiles(rng, `${stop(e.a)} | , | ${e.link} | ${lowerStart(e.b).replace(/\.$/, "")} | .`, [e.wlink], [
        { text: compound(e, e.wlink), mistake: "st-wrong-link" },
        { text: splice(e), mistake: "st-comma-splice" },
      ])
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, e] = entryIn(rng, BANK, depFirst, g);
    const depRest = e.dep.slice(e.sub.length + 1);
    return doIt(
      base("c-analyze", "concrete", "analyze", "join into a complex sentence", rng),
      `Join into one complex sentence: '${e.a} ${e.b}' (Not every tile is needed.)`,
      p(i),
      tiles(rng, `${e.sub} | ${depRest} | , | ${mainOf(e).replace(/\.$/, "")} | .`, [e.link], [{ text: doubled(e), mistake: "st-double-link" }])
    );
  },
  "concrete|evaluate": (rng, g) => {
    const [i, e] = entryIn(rng, BANK, depFirst, g);
    // Either joining word can go: the coordinator after the comma, or the one that starts the sentence.
    const act = tapWords(doubled(e), e.sub, [], []);
    const at = act.tokens.findIndex((t, k) => k > 0 && act.tokens[k - 1].endsWith(",") && t === e.link);
    act.alsoRight = [act.target];
    act.target = [at];
    return doIt(base("c-evaluate", "concrete", "evaluate", "one joining word too many", rng), "This sentence has one joining word too many. Tap a word to take out.", p(i), act);
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const v = g && Number.isInteger(g.v) ? g.v : Math.floor(rng() * 3);
    const right = TYPE_LABEL[FORMS[v]];
    return choose(
      base("p-remember", "pictorial", "remember", "identify the kind of sentence", rng),
      "Is this sentence simple, compound or complex?",
      card([formOf(e, v)]),
      p(i, { v }),
      right,
      [...Object.values(TYPE_LABEL).filter((x) => x !== right).map((text) => ({ text, mistake: "st-type" })), { text: "It isn't a complete sentence", mistake: "st-fragment" }]
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(
      base("p-understand", "pictorial", "understand", "dependent clause", rng),
      "What is the highlighted part?",
      card([mark(e.cx, e.dep)]),
      p(i),
      "A dependent clause: it has a verb but can't stand alone",
      [
        { text: "A main clause: it can stand alone as a sentence", mistake: "st-main-sub" },
        { text: "A phrase: it has no verb of its own", mistake: "st-phrase-clause" },
        { text: "A complete simple sentence", mistake: "st-fragment" },
      ]
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(
      base("p-apply", "pictorial", "apply", "join into a compound sentence", rng),
      "Join these into one compound sentence.",
      card([e.a, e.b]),
      p(i),
      compound(e),
      [
        { text: compound(e, e.wlink), mistake: "st-wrong-link" },
        { text: splice(e), mistake: "st-comma-splice" },
        ...(depFirst(e) ? [{ text: doubled(e), mistake: "st-double-link" }] : []),
        { text: e.cx, mistake: "st-type" },
      ]
    );
  },
  "pictorial|analyze": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const ws = wrongSub(e);
    return choose(
      base("p-analyze", "pictorial", "analyze", "compound to complex", rng),
      "Change this into a complex sentence, keeping the meaning.",
      card([compound(e)]),
      p(i),
      e.cx,
      [
        ...(depFirst(e) ? [{ text: doubled(e), mistake: "st-double-link" }] : []),
        ...(ws ? [{ text: ws, mistake: "st-wrong-link" }] : []),
        { text: fragment(e), mistake: "st-fragment" },
        { text: compound(e, e.wlink), mistake: "st-not-changed" },
        { text: splice(e), mistake: "st-comma-splice" },
      ]
    );
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const v = g && Number.isInteger(g.v) ? g.v : Math.floor(rng() * 3);
    const said = g && Number.isInteger(g.s) ? g.s : Math.floor(rng() * 3);
    const truth = FORMS[v];
    const claim = FORMS[said];
    const right = said === v ? "Yes, she is right" : `No, it is ${truth}`;
    const opts = ["Yes, she is right", ...FORMS.filter((f) => f !== claim).map((f) => `No, it is ${f}`), "No, it isn't a complete sentence"];
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "judge the kind of sentence", rng),
      `Riya says this is a ${claim} sentence. Is she right?`,
      card([formOf(e, v)], `Riya: "${claim}"`),
      p(i, { v, s: said }),
      right,
      opts.filter((o) => o !== right).map((text) => ({ text, mistake: text.includes("complete") ? "st-fragment" : "st-type" }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, d] = entry(rng, DEFS, g);
    return choose(base("a-remember", "abstract", "remember", "kinds of sentences", rng), d.q, null, p(i, { k: 1 }), d.a, d.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const v = g && Number.isInteger(g.v) ? g.v : Math.floor(rng() * 3);
    const right = TYPE_LABEL[FORMS[v]];
    return choose(
      base("a-understand", "abstract", "understand", "identify the kind of sentence", rng),
      `Which kind of sentence is this? ${formOf(e, v)}`,
      null,
      p(i, { v }),
      right,
      [...Object.values(TYPE_LABEL).filter((x) => x !== right).map((text) => ({ text, mistake: "st-type" })), { text: "Not a complete sentence", mistake: "st-fragment" }]
    );
  },
  "abstract|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const ws = wrongSub(e);
    return choose(
      base("a-apply", "abstract", "apply", "compound to complex", rng),
      `Change to a complex sentence: ${compound(e)}`,
      null,
      p(i),
      e.cx,
      [
        ...(depFirst(e) ? [{ text: doubled(e), mistake: "st-double-link" }] : []),
        ...(ws ? [{ text: ws, mistake: "st-wrong-link" }] : []),
        { text: fragment(e), mistake: "st-fragment" },
        { text: splice(e), mistake: "st-comma-splice" },
        { text: compound(e, e.wlink), mistake: "st-not-changed" },
      ]
    );
  },
  "abstract|analyze": (rng, g) => {
    const [i, e] = entryIn(rng, BANK, (x) => !!x.simple, g);
    return choose(
      base("a-analyze", "abstract", "analyze", "complex to simple", rng),
      `Change to a simple sentence: ${e.cx}`,
      null,
      p(i),
      e.simple!,
      [
        { text: compound(e), mistake: "st-type" },
        { text: fragment(e), mistake: "st-fragment" },
        { text: splice(e), mistake: "st-comma-splice" },
        { text: e.cx, mistake: "st-not-changed" },
      ]
    );
  },
  "abstract|evaluate": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const wrongs = [
      { text: compound(e, e.wlink), mistake: "st-wrong-link" },
      { text: splice(e), mistake: "st-comma-splice" },
      ...(depFirst(e) ? [{ text: doubled(e), mistake: "st-double-link" }] : []),
    ];
    const w = g && Number.isInteger(g.w) && wrongs[g.w] ? g.w : Math.floor(rng() * wrongs.length);
    const aRight = g && Number.isInteger(g.v) ? g.v === 1 : rng() < 0.5;
    const good = pick(rng, [compound(e), e.cx]);
    const A = aRight ? good : wrongs[w].text;
    const B = aRight ? wrongs[w].text : good;
    return choose(
      base("a-evaluate", "abstract", "evaluate", "judge a joined sentence", rng),
      `Join: '${e.a} ${e.b}' A: ${A} B: ${B} Which is correct and keeps the meaning?`,
      null,
      p(i, { v: aRight ? 1 : 0, w, c: good === e.cx ? 1 : 0 }),
      aRight ? "Only A" : "Only B",
      [
        { text: aRight ? "Only B" : "Only A", mistake: wrongs[w].mistake },
        { text: "Both", mistake: wrongs[w].mistake },
        { text: "Neither", mistake: "st-not-changed" },
      ]
    );
  },
};

/** For the stress test: answers rebuilt from the bank; joined sentences end with one full stop. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  const e = BANK[it.params.i];
  if (cell === "pictorial|apply" && right !== compound(e)) return "compound should be built from the bank";
  if ((cell === "pictorial|analyze" || cell === "abstract|apply") && right !== e.cx) return "complex should be the bank's";
  if (cell === "abstract|analyze" && right !== e.simple) return "simple should be the bank's";
  for (const c of it.choices) if (/[.]{2}|,,|\s[,.]/.test(c.text)) return `bad punctuation: ${c.text}`;
  if (e && !e.cx.includes(e.dep)) return `dependent clause not in ${e.cx}`;
  return null;
}
