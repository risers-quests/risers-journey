import { Template } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, markWord, tapWords, tiles, words } from "./english.js";

/**
 * Words used as Nouns and Verbs; Adverb Clauses of Purpose, Grade 8
 * English (English Rose Reader 8, chapter 3 grammar).
 *   concrete  tap the word used as a verb (it's in the sentence as a noun
 *             too); tap the clause of purpose; join with 'so that' from
 *             tiles; join with 'lest'; tap the 'not' that lest doesn't need
 *   pictorial noun or verb?; in which sentence is it a verb?; join with
 *             'so that'; purpose, result, reason or time?; what did Riya
 *             get wrong?
 *   abstract  the rules (lest = so that … not); noun or verb?; join with
 *             so that; purpose or result?; join with lest
 */

const TOPIC = "e8-purpose";
const base = baseFor("pur8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "nv-mixup": {
    label: "Mixes up a word used as a noun and as a verb",
    detail: "Calls watch in 'his gold watch' a verb, or in 'we watch the birds' a noun.",
    childTip: "Same spelling, different job. Look at the words around it: a / the / his + word → noun (a thing); I / we / to / please + word → verb (an action).",
  },
  "purp-clause": {
    label: "Can't find the clause of purpose",
    detail: "Marks the main clause instead of the part that says what someone wanted.",
    childTip: "The clause of purpose starts with so that, in order that or lest, and answers 'Why? What for?'",
  },
  "purp-modal": {
    label: "Uses the wrong helping verb after 'so that' or 'lest'",
    detail: "Writes ran so that he can catch (past main verb, present helper), or lest you will fall.",
    childTip: "Present: so that … can / may / will. Past: so that … could / might / would. After lest: should.",
  },
  "purp-reason": {
    label: "Uses 'because' for a purpose",
    detail: "Writes He ran fast because he could catch the bus, which turns the aim into a cause.",
    childTip: "because gives a reason (what caused it). so that gives a purpose (what someone wanted to happen).",
  },
  "purp-lest": {
    label: "Adds 'not' after 'lest'",
    detail: "Writes lest you should not fall, which says the opposite.",
    childTip: "lest already means 'so that … not': Walk carefully lest you should fall.",
  },
  "purp-meaning": {
    label: "Changes the meaning when joining",
    detail: "Joins with words that say the opposite of what was meant (so that you fall for lest you fall).",
    childTip: "Read your joined sentence back: does it still say what the two sentences said?",
  },
  "purp-result": {
    label: "Mixes up purpose and result",
    detail: "Reads so … that (result) as so that (purpose), or the other way round.",
    childTip: "so that = purpose, an aim: He ran so that he could catch the bus. so … that = result: He ran so fast that he caught it.",
  },
};

/** One word, used as a noun or a verb. */
const NV: { s: string; w: string; pos: "noun" | "verb" }[] = [
  { s: "Jim sold his gold watch.", w: "watch", pos: "noun" },
  { s: "We watch the birds every morning.", w: "watch", pos: "verb" },
  { s: "The water in the lake was frozen.", w: "water", pos: "noun" },
  { s: "Please water the roses today.", w: "water", pos: "verb" },
  { s: "Pip read a book about ships.", w: "book", pos: "noun" },
  { s: "Let's book our train tickets early.", w: "book", pos: "verb" },
  { s: "Della bought Jim a present.", w: "present", pos: "noun" },
  { s: "The principal will present the prizes.", w: "present", pos: "verb" },
  { s: "The plant needs more sunlight.", w: "plant", pos: "noun" },
  { s: "We plant trees every monsoon.", w: "plant", pos: "verb" },
  { s: "She lost her silver ring.", w: "ring", pos: "noun" },
  { s: "The sailors waited for the bell to ring.", w: "ring", pos: "verb" },
  { s: "The girl played a big drum.", w: "drum", pos: "noun" },
  { s: "The girls drum on the tables.", w: "drum", pos: "verb" },
  { s: "Raise your hand if you know the answer.", w: "hand", pos: "noun" },
  { s: "Please hand me the scissors.", w: "hand", pos: "verb" },
  { s: "The rangers finished the count in May.", w: "count", pos: "noun" },
  { s: "The rangers count the tigers every year.", w: "count", pos: "verb" },
  { s: "She had a strange dream last night.", w: "dream", pos: "noun" },
  { s: "Many children dream of flying.", w: "dream", pos: "verb" },
  { s: "Ashima chose a name for her son.", w: "name", pos: "noun" },
  { s: "They decided to name the baby Gogol.", w: "name", pos: "verb" },
  { s: "The light from the lighthouse was bright.", w: "light", pos: "noun" },
  { s: "Light the lamp before it gets dark.", w: "Light", pos: "verb" },
  { s: "The ship struck the rock.", w: "rock", pos: "noun" },
  { s: "Mother will rock the baby to sleep.", w: "rock", pos: "verb" },
];

/** The same word as a verb and as a noun in one sentence; verbAt says which time is the verb. */
const BOTH: { s: string; w: string; verbAt: 0 | 1 }[] = [
  { s: "We plant a new plant every spring.", w: "plant", verbAt: 0 },
  { s: "Please hand me the book in your hand.", w: "hand", verbAt: 0 },
  { s: "I water the garden with rain water.", w: "water", verbAt: 0 },
  { s: "Light the lamp, for we need more light.", w: "light", verbAt: 0 },
  { s: "The girls drum on the big drum.", w: "drum", verbAt: 0 },
  { s: "We heard the ring when they began to ring the bell.", w: "ring", verbAt: 1 },
  { s: "We watch the match on Grandfather's watch.", w: "watch", verbAt: 0 },
  { s: "The rangers count the tigers, and the count takes a month.", w: "count", verbAt: 0 },
  { s: "Place the vase back in its place.", w: "place", verbAt: 0 },
  { s: "After the play, the children play outside.", w: "play", verbAt: 1 },
  { s: "Many children dream of flying, and some remember the dream.", w: "dream", verbAt: 0 },
  { s: "Please book a seat and bring a book to read.", w: "book", verbAt: 0 },
];
const bare = (t: string) => t.replace(/[^A-Za-z']/g, "").toLowerCase();
const occurrences = (s: string, w: string) => words(s).map((t, k) => (bare(t) === w.toLowerCase() ? k : -1)).filter((k) => k >= 0);

/** Two sentences joined with 'so that'. */
const SO: { a: string; b: string; so: string; wmod: string; because: string }[] = [
  { a: "He ran fast.", b: "He wanted to catch the bus.", so: "He ran fast so that he could catch the bus.", wmod: "He ran fast so that he can catch the bus.", because: "He ran fast because he could catch the bus." },
  { a: "Della sold her hair.", b: "She wanted to buy Jim a present.", so: "Della sold her hair so that she could buy Jim a present.", wmod: "Della sold her hair so that she can buy Jim a present.", because: "Della sold her hair because she could buy Jim a present." },
  { a: "The Abbot placed a bell on the rock.", b: "He wanted to warn the sailors.", so: "The Abbot placed a bell on the rock so that he could warn the sailors.", wmod: "The Abbot placed a bell on the rock so that he can warn the sailors.", because: "The Abbot placed a bell on the rock because he could warn the sailors." },
  { a: "We speak softly.", b: "We do not want to wake the baby.", so: "We speak softly so that we do not wake the baby.", wmod: "We speak softly so that we did not wake the baby.", because: "We speak softly because we do not wake the baby." },
  { a: "Meera saves her pocket money.", b: "She wants to buy a drum.", so: "Meera saves her pocket money so that she can buy a drum.", wmod: "Meera saves her pocket money so that she could have bought a drum.", because: "Meera saves her pocket money because she can buy a drum." },
  { a: "Pip hid the food.", b: "He did not want his sister to find it.", so: "Pip hid the food so that his sister would not find it.", wmod: "Pip hid the food so that his sister will not find it.", because: "Pip hid the food because his sister would not find it." },
  { a: "The rangers stay quiet.", b: "They do not want to frighten the tigers.", so: "The rangers stay quiet so that they do not frighten the tigers.", wmod: "The rangers stay quiet so that they did not frighten the tigers.", because: "The rangers stay quiet because they do not frighten the tigers." },
  { a: "Jim worked hard.", b: "He wanted to give Della a good life.", so: "Jim worked hard so that he could give Della a good life.", wmod: "Jim worked hard so that he can give Della a good life.", because: "Jim worked hard because he could give Della a good life." },
  { a: "I wrote it down.", b: "I did not want to forget it.", so: "I wrote it down so that I would not forget it.", wmod: "I wrote it down so that I will not forget it.", because: "I wrote it down because I would not forget it." },
  { a: "The farmers dug a well.", b: "They wanted water in summer.", so: "The farmers dug a well so that they could have water in summer.", wmod: "The farmers dug a well so that they can have water in summer.", because: "The farmers dug a well because they could have water in summer." },
];
const soParts = (x: (typeof SO)[number]) => {
  const [main, clause] = x.so.split(" so that ");
  return { main, clause: clause.replace(/\.$/, "") };
};

/** Purpose with 'lest'. */
const LEST: { s: string; plain: string }[] = [
  { s: "Walk carefully lest you should fall.", plain: "Walk carefully. You may fall." },
  { s: "Hold the rail lest you should slip.", plain: "Hold the rail. You may slip." },
  { s: "Speak softly lest you should wake the baby.", plain: "Speak softly. You may wake the baby." },
  { s: "Read the question twice lest you should make a mistake.", plain: "Read the question twice. You may make a mistake." },
  { s: "Pip hid the file lest his sister should find it.", plain: "Pip hid the file. His sister might find it." },
  { s: "Carry an umbrella lest you should get wet.", plain: "Carry an umbrella. You may get wet." },
  { s: "The sailors kept watch lest the ship should strike the rock.", plain: "The sailors kept watch. The ship might strike the rock." },
  { s: "Write it down lest you should forget it.", plain: "Write it down. You may forget it." },
];
const lestParts = (x: (typeof LEST)[number]) => {
  const [main, rest] = x.s.replace(/\.$/, "").split(" lest ");
  const [subj, after] = rest.split(" should ");
  return { main, subj, after };
};
const lestWrongs = (x: (typeof LEST)[number]) => {
  const { main, subj, after } = lestParts(x);
  return [
    { text: `${main} lest ${subj} should not ${after}.`, mistake: "purp-lest" },
    { text: `${main} so that ${subj} should ${after}.`, mistake: "purp-meaning" },
    { text: `${main} lest ${subj} will ${after}.`, mistake: "purp-modal" },
  ];
};

/** What a clause tells us. */
type Kind = "purpose" | "result" | "reason" | "time";
const KIND: { s: string; clause: string; kind: Kind }[] = [
  { s: "He ran fast so that he could catch the bus.", clause: "so that he could catch the bus", kind: "purpose" },
  { s: "He ran so fast that he caught the bus.", clause: "that he caught the bus", kind: "result" },
  { s: "The Abbot placed a bell on the rock so that he could warn the sailors.", clause: "so that he could warn the sailors", kind: "purpose" },
  { s: "The bell was so loud that the sailors heard it.", clause: "that the sailors heard it", kind: "result" },
  { s: "Della sold her hair so that she could buy Jim a present.", clause: "so that she could buy Jim a present", kind: "purpose" },
  { s: "Della was so poor that she sold her hair.", clause: "that she sold her hair", kind: "result" },
  { s: "It rained so heavily that the match was cancelled.", clause: "that the match was cancelled", kind: "result" },
  { s: "Pip hid the food so that his sister would not find it.", clause: "so that his sister would not find it", kind: "purpose" },
  { s: "Pip was so frightened that he could not speak.", clause: "that he could not speak", kind: "result" },
  { s: "He stayed at home because he was ill.", clause: "because he was ill", kind: "reason" },
  { s: "We went home since the shop was closed.", clause: "since the shop was closed", kind: "reason" },
  { s: "We left the hall when the bell rang.", clause: "when the bell rang", kind: "time" },
  { s: "The farmers dug a well so that they could have water in summer.", clause: "so that they could have water in summer", kind: "purpose" },
  { s: "The tiger was so hungry that it came out of the forest.", clause: "that it came out of the forest", kind: "result" },
];
const KIND_LABEL: Record<Kind, string> = {
  purpose: "Purpose: what someone wanted (the aim)",
  result: "Result: what happened because of it",
  reason: "Reason: what caused it",
  time: "Time: when it happened",
};

const RULES: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  { q: "'lest' means ___", a: "so that … not", w: [{ text: "so that", mistake: "purp-lest" }, { text: "because", mistake: "purp-reason" }, { text: "until", mistake: "purp-meaning" }] },
  { q: "After 'lest', we use ___", a: "should + the verb (lest you should fall)", w: [{ text: "should not + the verb", mistake: "purp-lest" }, { text: "will + the verb", mistake: "purp-modal" }, { text: "could not + the verb", mistake: "purp-lest" }] },
  { q: "A clause of purpose answers the question ___", a: "Why? What for?", w: [{ text: "When?", mistake: "purp-clause" }, { text: "What happened as a result?", mistake: "purp-result" }, { text: "Where?", mistake: "purp-clause" }] },
  { q: "'He worked hard so that he ___ pass.' (past) The helping verb is ___", a: "could", w: [{ text: "can", mistake: "purp-modal" }, { text: "will", mistake: "purp-modal" }, { text: "should not", mistake: "purp-lest" }] },
  { q: "Which joins a clause of purpose?", a: "in order that", w: [{ text: "because", mistake: "purp-reason" }, { text: "so … that (so fast that)", mistake: "purp-result" }, { text: "although", mistake: "purp-meaning" }] },
];

const p = (i: number, extra: Record<string, number> = {}) => ({ i, ...extra });

export const PURPOSE_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, x] = entry(rng, BOTH, g);
    const occ = occurrences(x.s, x.w);
    if (occ.length !== 2) throw new Error(`"${x.w}" should be in "${x.s}" twice`);
    const tokens = words(x.s);
    return doIt(
      base("c-remember", "concrete", "remember", "the word used as a verb", rng),
      `'${x.w}' is in this sentence twice. Tap the one used as a verb.`,
      p(i, { k: 1 }),
      { kind: "words", tokens, target: [occ[x.verbAt]], wrongSets: [{ cells: [occ[1 - x.verbAt]], mistake: "nv-mixup" }] }
    );
  },
  "concrete|understand": (rng, g) => {
    const [i, x] = entry(rng, SO, g);
    const { main } = soParts(x);
    const act = tapWords(x.so, `so that ${soParts(x).clause}`, [{ phrase: main, mistake: "purp-clause" }]);
    return doIt(base("c-understand", "concrete", "understand", "the clause of purpose", rng), "Tap every word of the clause of purpose (it says what someone wanted).", p(i, { k: 2 }), act);
  },
  "concrete|apply": (rng, g) => {
    const [i, x] = entry(rng, SO, g);
    const { main, clause } = soParts(x);
    const helper = words(clause).find((w) => /^(could|can|would|will|do|did|may|might)$/.test(w))!;
    const wrongHelper = words(x.wmod.split(" so that ")[1]).find((w) => /^(could|can|would|will|do|did|may|might)$/.test(w))!;
    const [before, after] = clause.split(` ${helper} `);
    return doIt(
      base("c-apply", "concrete", "apply", "join with so that", rng),
      `Join with 'so that': '${x.a} ${x.b}' (Not every tile is needed.)`,
      p(i, { k: 2 }),
      tiles(rng, `${main} | so that | ${before} | ${helper} | ${after} | .`, [wrongHelper, "because"], [
        { text: `${main} so that ${before} ${wrongHelper} ${after}.`, mistake: "purp-modal" },
        { text: `${main} because ${before} ${helper} ${after}.`, mistake: "purp-reason" },
      ])
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, x] = entry(rng, LEST, g);
    const { main, subj, after } = lestParts(x);
    return doIt(
      base("c-analyze", "concrete", "analyze", "join with lest", rng),
      `Join with 'lest': '${x.plain}' (Not every tile is needed.)`,
      p(i, { k: 3 }),
      tiles(rng, `${main} | lest | ${subj} | should | ${after} | .`, ["not", "will"], [
        { text: `${main} lest ${subj} should not ${after}.`, mistake: "purp-lest" },
        { text: `${main} lest ${subj} will ${after}.`, mistake: "purp-modal" },
      ])
    );
  },
  "concrete|evaluate": (rng, g) => {
    const [i, x] = entry(rng, LEST, g);
    const { main, subj, after } = lestParts(x);
    return doIt(
      base("c-evaluate", "concrete", "evaluate", "the extra not after lest", rng),
      "One word in this sentence turns its meaning upside down. Tap it.",
      p(i, { k: 3 }),
      tapWords(`${main} lest ${subj} should not ${after}.`, "not", [{ phrase: "lest", mistake: "purp-lest" }])
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, x] = entry(rng, NV, g);
    const right = x.pos === "noun" ? "A noun: it names a thing" : "A verb: it shows an action";
    return choose(
      base("p-remember", "pictorial", "remember", "noun or verb", rng),
      "What is the highlighted word in this sentence?",
      card([markWord(x.s, x.w)]),
      p(i),
      right,
      [
        { text: x.pos === "noun" ? "A verb: it shows an action" : "A noun: it names a thing", mistake: "nv-mixup" },
        { text: "An adjective: it describes a noun", mistake: "nv-mixup" },
        { text: "An adverb: it describes a verb", mistake: "nv-mixup" },
      ]
    );
  },
  "pictorial|understand": (rng, g) => {
    // the noun and verb sentences of one word, in either order
    const pairs = [...new Set(NV.map((x) => x.w.toLowerCase()))];
    const k = g && Number.isInteger(g.w) ? g.w : Math.floor(rng() * pairs.length);
    const two = NV.filter((x) => x.w.toLowerCase() === pairs[k]);
    const verbFirst = g && Number.isInteger(g.f) ? g.f === 1 : rng() < 0.5;
    const [first, second] = verbFirst ? [two.find((x) => x.pos === "verb")!, two.find((x) => x.pos === "noun")!] : [two.find((x) => x.pos === "noun")!, two.find((x) => x.pos === "verb")!];
    return choose(
      base("p-understand", "pictorial", "understand", "noun or verb, side by side", rng),
      `In which sentence is '${pairs[k]}' used as a verb?`,
      card([`1. ${markWord(first.s, first.w)}`, `2. ${markWord(second.s, second.w)}`]),
      { w: k, f: verbFirst ? 1 : 0, i: NV.indexOf(verbFirst ? first : second) },
      verbFirst ? "Sentence 1" : "Sentence 2",
      [
        { text: verbFirst ? "Sentence 2" : "Sentence 1", mistake: "nv-mixup" },
        { text: "Both", mistake: "nv-mixup" },
        { text: "Neither", mistake: "nv-mixup" },
      ]
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, x] = entry(rng, SO, g);
    return choose(
      base("p-apply", "pictorial", "apply", "join with so that", rng),
      "Join these two sentences using 'so that'.",
      card([x.a, x.b]),
      p(i, { k: 2 }),
      x.so,
      [
        { text: x.wmod, mistake: "purp-modal" },
        { text: x.because, mistake: "purp-reason" },
        { text: `${x.a.replace(/\.$/, "")} so that ${x.b.charAt(0).toLowerCase()}${x.b.slice(1)}`, mistake: "purp-meaning" },
      ]
    );
  },
  "pictorial|analyze": (rng, g) => {
    const [i, x] = entry(rng, KIND, g);
    const right = KIND_LABEL[x.kind];
    return choose(
      base("p-analyze", "pictorial", "analyze", "purpose, result, reason or time", rng),
      "What does the highlighted clause tell us?",
      card([x.s.replace(x.clause, `[[${x.clause}]]`)]),
      p(i, { k: 4 }),
      right,
      (Object.entries(KIND_LABEL) as [Kind, string][]).filter(([k]) => k !== x.kind).map(([k, text]) => ({ text, mistake: (k === "result" && x.kind === "purpose") || (k === "purpose" && x.kind === "result") ? "purp-result" : k === "reason" || x.kind === "reason" ? "purp-reason" : "purp-clause" }))
    );
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, x] = entry(rng, SO, g);
    const versions: [string, string][] = [[x.wmod, "purp-modal"], [x.because, "purp-reason"], [x.so, ""]];
    const at = g && Number.isInteger(g.v) ? g.v : Math.floor(rng() * versions.length);
    const [hers, mk] = versions[at];
    const LAB: Record<string, string> = {
      "purp-modal": "The helping verb doesn't match the tense",
      "purp-reason": "She gave a reason, not a purpose",
      "purp-lest": "She added 'not' where it isn't needed",
      "": "Nothing: it is right",
    };
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "check a joined sentence", rng),
      "Riya joined the two sentences with a clause of purpose. What, if anything, is wrong?",
      card([`${x.a} ${x.b}`, `Riya: ${hers}`], "The two sentences, then Riya's"),
      p(i, { k: 2, v: at }),
      LAB[mk],
      Object.entries(LAB).filter(([k]) => k !== mk).map(([k, text]) => ({ text, mistake: mk || k || "purp-meaning" }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, r] = entry(rng, RULES, g);
    return choose(base("a-remember", "abstract", "remember", "the rules", rng), r.q, null, p(i, { k: 5 }), r.a, r.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, x] = entry(rng, NV, g);
    return choose(
      base("a-understand", "abstract", "understand", "noun or verb", rng),
      `${x.s} Is '${x.w}' a noun or a verb here?`,
      null,
      p(i),
      x.pos === "noun" ? "Noun" : "Verb",
      [
        { text: x.pos === "noun" ? "Verb" : "Noun", mistake: "nv-mixup" },
        { text: "Adjective", mistake: "nv-mixup" },
        { text: "It can't be either", mistake: "nv-mixup" },
      ]
    );
  },
  "abstract|apply": (rng, g) => {
    const [i, x] = entry(rng, SO, g);
    return choose(
      base("a-apply", "abstract", "apply", "join with so that", rng),
      `Join using 'so that': ${x.a} ${x.b}`,
      null,
      p(i, { k: 2 }),
      x.so,
      [
        { text: x.wmod, mistake: "purp-modal" },
        { text: x.because, mistake: "purp-reason" },
        { text: `${x.a.replace(/\.$/, "")} so that ${x.b.charAt(0).toLowerCase()}${x.b.slice(1)}`, mistake: "purp-meaning" },
      ]
    );
  },
  "abstract|analyze": (rng, g) => {
    const [i, x] = entry(rng, KIND, g);
    const NAME: Record<Kind, string> = { purpose: "Purpose", result: "Result", reason: "Reason", time: "Time" };
    return choose(
      base("a-analyze", "abstract", "analyze", "purpose or result", rng),
      `${x.s} What does '${x.clause}' tell us?`,
      null,
      p(i, { k: 4 }),
      NAME[x.kind],
      (Object.entries(NAME) as [Kind, string][]).filter(([k]) => k !== x.kind).map(([k, text]) => ({ text, mistake: (k === "result" && x.kind === "purpose") || (k === "purpose" && x.kind === "result") ? "purp-result" : "purp-clause" }))
    );
  },
  "abstract|evaluate": (rng, g) => {
    const [i, x] = entry(rng, LEST, g);
    return choose(base("a-evaluate", "abstract", "evaluate", "join with lest", rng), `Join using 'lest', keeping the meaning: ${x.plain}`, null, p(i, { k: 3 }), x.s, lestWrongs(x));
  },
};

/** For the stress test. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  if (cell === "abstract|evaluate" && /lest \w+ should not/.test(right)) return "lest … not in the right answer";
  if ((cell === "pictorial|apply" || cell === "abstract|apply") && !/ so that /.test(right)) return "so that answer without so that";
  if (cell === "abstract|understand") {
    const x = NV[it.params.i];
    if (right !== (x.pos === "noun" ? "Noun" : "Verb")) return "noun/verb answer doesn't match the bank";
  }
  return null;
}
