import { Template } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, entryIn, markWord, shuffle, tapWords, tiles } from "./english.js";

/**
 * Forms of 'have'; the Infinitive and the Bare Infinitive, Grade 8 English
 * (English Rose Reader 8, chapter 7 grammar).
 *   concrete  tap the infinitive (a 'to' + noun is there to tempt); tap the
 *             bare infinitive; build "made us rewrite" (to rewrite tempts);
 *             build "decided to learn"; tap the wrong 'to'
 *   pictorial what 'have' means here; to + verb, or the verb alone?; the
 *             right form of have; who did it in "had her hair cut"?; is
 *             Riya right?
 *   abstract  the rules; fill the gap; the form of have; which 'to' starts
 *             an infinitive; A or B?
 */

const TOPIC = "e8-infinitives";
const base = baseFor("inf8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "inf-bare-needed": {
    label: "Puts 'to' where the bare infinitive is needed",
    detail: "Writes made him to apologise / must to finish / let us to stay.",
    childTip: "No 'to' after can, must, should, will, make, let, had better, would rather, and see / hear someone do: She made him apologise.",
  },
  "inf-to-needed": {
    label: "Leaves out 'to' where it's needed",
    detail: "Writes decided learn / want go instead of decided to learn / want to go.",
    childTip: "want, decide, hope, need, plan, too … to, easy to: She decided to learn the drums.",
  },
  "inf-ing": {
    label: "Uses -ing where an infinitive is needed",
    detail: "Writes decided learning / let us staying.",
    childTip: "After decide, want, hope (to + verb) and after make, let, must (verb alone), the -ing form doesn't fit.",
  },
  "inf-form": {
    label: "Uses the wrong form of the verb",
    detail: "Uses the past tense after to or after a helping verb (to went, must finished).",
    childTip: "An infinitive is always the base form: to go, must go (never to went).",
  },
  "inf-prep-to": {
    label: "Mixes up 'to' + verb with 'to' as a preposition",
    detail: "Takes the 'to' in went to the market for an infinitive, or misses to buy.",
    childTip: "to + a verb is an infinitive (to buy). to + a noun is a preposition (to the market).",
  },
  "have-use": {
    label: "Misreads what 'have' means in the sentence",
    detail: "Takes have to (must) or have something done for 'own', or a helping verb for a main verb.",
    childTip: "have = own; has / have / had + past participle = perfect tense; have to = must; have something done = someone else does it; have lunch = eat.",
  },
  "have-form": {
    label: "Uses the wrong form of 'have'",
    detail: "Writes she have / they has, or the present for a past time.",
    childTip: "I / you / we / they have; he / she / it has; for the past, had.",
  },
  "have-causative": {
    label: "Thinks the subject did it themself in 'had it done'",
    detail: "Reads Della had her hair cut as Della cut her own hair.",
    childTip: "had her hair cut: someone else cut it for her. She cut her hair: she did it herself.",
  },
};

/** Sentences with a to-infinitive; `prepTo` is a 'to' + noun in the same sentence (a trap), if any. */
const TO_INF: { s: string; inf: string; prepTo?: string }[] = [
  { s: "She went to the market to buy vegetables.", inf: "to buy", prepTo: "to the" },
  { s: "Della hurried to the shop to sell her hair.", inf: "to sell", prepTo: "to the" },
  { s: "The rangers went to the forest to count the tigers.", inf: "to count", prepTo: "to the" },
  { s: "Jim wanted to give Della a present.", inf: "to give" },
  { s: "We came to school early to practise for the play.", inf: "to practise", prepTo: "to school" },
  { s: "Pip ran to the marshes to help the convict.", inf: "to help", prepTo: "to the" },
  { s: "The Abbot decided to place a bell on the rock.", inf: "to place" },
  { s: "Anu wrote to her cousin to thank him for the gift.", inf: "to thank", prepTo: "to her" },
  { s: "It is easy to forget a new word.", inf: "to forget" },
  { s: "Rohan was too tired to walk to the station.", inf: "to walk", prepTo: "to the" },
  { s: "The girl longed to play the drums.", inf: "to play" },
  { s: "They travelled to Ladakh to see the snow leopards.", inf: "to see", prepTo: "to Ladakh" },
];

/** Bare infinitives in sentences. */
const BARE_IN: { s: string; bare: string; trigger: string }[] = [
  { s: "Mother let us stay up late on Saturday.", bare: "stay", trigger: "let" },
  { s: "The teacher made us rewrite the essay.", bare: "rewrite", trigger: "made" },
  { s: "I heard her sing in the next room.", bare: "sing", trigger: "heard" },
  { s: "You must finish your homework first.", bare: "finish", trigger: "must" },
  { s: "We should save water every day.", bare: "save", trigger: "should" },
  { s: "You had better hurry, or you'll miss the bus.", bare: "hurry", trigger: "better" },
  { s: "I would rather walk than wait for the bus.", bare: "walk", trigger: "rather" },
  { s: "The sad film made Della cry.", bare: "cry", trigger: "made" },
  { s: "Sir Ralph saw the bell sink into the sea.", bare: "sink", trigger: "saw" },
  { s: "Can you lend me your pencil?", bare: "lend", trigger: "Can" },
];

/** Gap sentences: the verb in brackets, and whether it takes 'to'. */
const GAP: { before: string; v: string; after: string; to: boolean; ing: string; past: string }[] = [
  { before: "Mother let us", v: "stay", after: "up late.", to: false, ing: "staying", past: "stayed" },
  { before: "The teacher made us", v: "rewrite", after: "the essay.", to: false, ing: "rewriting", past: "rewrote" },
  { before: "I heard her", v: "sing", after: "in the next room.", to: false, ing: "singing", past: "sang" },
  { before: "You had better", v: "hurry", after: "now.", to: false, ing: "hurrying", past: "hurried" },
  { before: "I would rather", v: "walk", after: "to school.", to: false, ing: "walking", past: "walked" },
  { before: "You must", v: "finish", after: "your work.", to: false, ing: "finishing", past: "finished" },
  { before: "The convict made Pip", v: "bring", after: "him food.", to: false, ing: "bringing", past: "brought" },
  { before: "She decided", v: "learn", after: "the drums.", to: true, ing: "learning", past: "learnt" },
  { before: "I hope", v: "see", after: "you soon.", to: true, ing: "seeing", past: "saw" },
  { before: "We need", v: "leave", after: "now.", to: true, ing: "leaving", past: "left" },
  { before: "Jim wanted", v: "give", after: "Della a present.", to: true, ing: "giving", past: "gave" },
  { before: "He was too tired", v: "walk", after: "any further.", to: true, ing: "walking", past: "walked" },
  { before: "The rangers plan", v: "count", after: "the tigers in May.", to: true, ing: "counting", past: "counted" },
  { before: "It is not easy", v: "forget", after: "an old friend.", to: true, ing: "forgetting", past: "forgot" },
];
const gapRight = (x: (typeof GAP)[number]) => (x.to ? `to ${x.v}` : x.v);
const gapWrongs = (x: (typeof GAP)[number]) => [
  { text: x.to ? x.v : `to ${x.v}`, mistake: x.to ? "inf-to-needed" : "inf-bare-needed" },
  { text: x.ing, mistake: "inf-ing" },
  { text: x.to ? `to ${x.past}` : x.past, mistake: "inf-form" },
];
const filled = (x: (typeof GAP)[number], form: string) => `${x.before} ${form} ${x.after}`;

/** What 'have' does in a sentence. */
type Use = "own" | "aux" | "must" | "causative" | "action";
const USE_LABEL: Record<Use, string> = {
  own: "Owns or holds something",
  aux: "A helping verb in a perfect tense (has sold)",
  must: "Must / needs to (have to)",
  causative: "Gets someone else to do it (had it done)",
  action: "Eats, takes or enjoys something (have lunch)",
};
const HAVE: { s: string; w: string; use: Use }[] = [
  { s: "Della has beautiful long hair.", w: "has", use: "own" },
  { s: "Jim has sold his gold watch.", w: "has", use: "aux" },
  { s: "We have to submit our notebooks by Tuesday.", w: "have", use: "must" },
  { s: "Della had her hair cut short.", w: "had", use: "causative" },
  { s: "We had lunch under the old oak tree.", w: "had", use: "action" },
  { s: "The rangers have counted forty tigers this year.", w: "have", use: "aux" },
  { s: "Pip had to hide the food from his sister.", w: "had", use: "must" },
  { s: "My grandfather has a small farm in the village.", w: "has", use: "own" },
  { s: "Anu had her bicycle repaired last week.", w: "had", use: "causative" },
  { s: "The children had a bath before dinner.", w: "had", use: "action" },
  { s: "The Abbot had placed a bell on the rock.", w: "had", use: "aux" },
  { s: "You have to wear a helmet on a bicycle.", w: "have", use: "must" },
  { s: "We had our house painted for Diwali.", w: "had", use: "causative" },
  { s: "Sir Ralph had a fine ship and a brave crew.", w: "had", use: "own" },
  { s: "Let's have a picnic by the river.", w: "have", use: "action" },
];

/** Fill the form of have. */
const HAVEFILL: { s: string; right: string; wrong: [string, string][] }[] = [
  { s: "She ___ two brothers and a sister.", right: "has", wrong: [["have", "have-form"], ["having", "have-form"], ["is having", "have-use"]] },
  { s: "Yesterday I ___ to wake up at five.", right: "had", wrong: [["have", "have-form"], ["has", "have-form"], ["having", "have-form"]] },
  { s: "Jim ___ already sold his watch.", right: "has", wrong: [["have", "have-form"], ["is", "have-use"], ["having", "have-form"]] },
  { s: "The tigers ___ been counted.", right: "have", wrong: [["has", "have-form"], ["having", "have-form"], ["is", "have-use"]] },
  { s: "Della ___ her hair cut yesterday.", right: "had", wrong: [["has", "have-form"], ["have", "have-form"], ["having", "have-form"]] },
  { s: "Every pupil ___ to wear the school badge.", right: "has", wrong: [["have", "have-form"], ["having", "have-form"], ["is", "have-use"]] },
  { s: "They ___ a lot of fun at the fair last Sunday.", right: "had", wrong: [["have", "have-form"], ["has", "have-form"], ["having", "have-form"]] },
  { s: "We ___ just finished our project.", right: "have", wrong: [["has", "have-form"], ["having", "have-form"], ["are", "have-use"]] },
  { s: "My cousin ___ his car washed every week.", right: "has", wrong: [["have", "have-form"], ["having", "have-form"], ["is", "have-use"]] },
  { s: "I ___ never seen a tiger in the wild.", right: "have", wrong: [["has", "have-form"], ["having", "have-form"], ["am", "have-use"]] },
];

/** "X had it done" next to "X did it". */
const CAUSE: { plain: string; caus: string; who: string; self: string }[] = [
  { plain: "Della cut her hair.", caus: "Della had her hair cut.", who: "Someone else cut it for Della", self: "Della cut it herself" },
  { plain: "Anu repaired her bicycle.", caus: "Anu had her bicycle repaired.", who: "Someone else repaired it for Anu", self: "Anu repaired it herself" },
  { plain: "We painted our house.", caus: "We had our house painted.", who: "Someone else painted it for us", self: "We painted it ourselves" },
  { plain: "My cousin washes his car.", caus: "My cousin has his car washed.", who: "Someone else washes it for him", self: "He washes it himself" },
  { plain: "Grandfather built the new gate.", caus: "Grandfather had the new gate built.", who: "Someone else built it for him", self: "Grandfather built it himself" },
  { plain: "Jim mended his watch.", caus: "Jim had his watch mended.", who: "Someone else mended it for Jim", self: "Jim mended it himself" },
  { plain: "The principal printed the notices.", caus: "The principal had the notices printed.", who: "Someone else printed them for the principal", self: "The principal printed them herself" },
  { plain: "Meera tested her eyes.", caus: "Meera had her eyes tested.", who: "Someone else tested them", self: "Meera tested them herself" },
];

/** 'to' as a preposition (not an infinitive). */
const PREP_TO = ["We walked to the station.", "Give the book to Anu.", "She is used to hard work.", "I am looking forward to the holidays.", "Pip was kind to the convict.", "The road leads to the old temple."];

const RULES: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  { q: "After can, must, should and will, we use ___", a: "the verb without 'to' (the bare infinitive)", w: [{ text: "'to' + the verb", mistake: "inf-bare-needed" }, { text: "the -ing form", mistake: "inf-ing" }, { text: "the past tense", mistake: "inf-form" }] },
  { q: "After make and let (She made him …), we use ___", a: "the verb without 'to' (made him apologise)", w: [{ text: "'to' + the verb (made him to apologise)", mistake: "inf-bare-needed" }, { text: "the -ing form (made him apologising)", mistake: "inf-ing" }, { text: "the past tense (made him apologised)", mistake: "inf-form" }] },
  { q: "'had better' and 'would rather' are followed by ___", a: "the verb without 'to'", w: [{ text: "'to' + the verb", mistake: "inf-bare-needed" }, { text: "the -ing form", mistake: "inf-ing" }, { text: "a noun only", mistake: "inf-form" }] },
  { q: "After want, decide, hope and need, we use ___", a: "'to' + the verb (decided to learn)", w: [{ text: "the verb without 'to' (decided learn)", mistake: "inf-to-needed" }, { text: "the -ing form (decided learning)", mistake: "inf-ing" }, { text: "the past tense (decided learnt)", mistake: "inf-form" }] },
  { q: "'You have to go' means ___", a: "you must go", w: [{ text: "you own a go", mistake: "have-use" }, { text: "you have already gone", mistake: "have-use" }, { text: "someone else will go for you", mistake: "have-causative" }] },
  { q: "In 'She has finished', 'has' is ___", a: "a helping verb making the present perfect", w: [{ text: "a main verb meaning 'owns'", mistake: "have-use" }, { text: "a verb meaning 'must'", mistake: "have-use" }, { text: "an infinitive", mistake: "inf-prep-to" }] },
];

const p = (i: number, extra: Record<string, number> = {}) => ({ i, ...extra });

export const INFINITIVES_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, x] = entry(rng, TO_INF, g);
    const act = tapWords(x.s, x.inf, x.prepTo ? [{ phrase: x.prepTo, mistake: "inf-prep-to" }] : []);
    // tapping only the preposition's 'to' is the same mistake
    if (x.prepTo) act.wrongSets!.push({ cells: [act.wrongSets![0].cells[0]], mistake: "inf-prep-to" });
    return doIt(base("c-remember", "concrete", "remember", "find the infinitive", rng), "Tap the infinitive: 'to' + a verb.", p(i, { k: 1 }), act);
  },
  "concrete|understand": (rng, g) => {
    const [i, x] = entry(rng, BARE_IN, g);
    return doIt(
      base("c-understand", "concrete", "understand", "find the bare infinitive", rng),
      "Tap the bare infinitive: the verb used without 'to'.",
      p(i, { k: 2 }),
      tapWords(x.s, x.bare, [{ phrase: x.trigger, mistake: "inf-bare-needed" }])
    );
  },
  "concrete|apply": (rng, g) => {
    const [i, x] = entryIn(rng, GAP, (y) => !y.to, g);
    return doIt(
      base("c-apply", "concrete", "apply", "build with a bare infinitive", rng),
      `Build the sentence with the right form of '${x.v}'. (Not every tile is needed.)`,
      p(i),
      tiles(rng, `${x.before} | ${x.v} | ${x.after.replace(/\.$/, "")} | .`, [`to ${x.v}`, x.ing], [
        { text: filled(x, `to ${x.v}`), mistake: "inf-bare-needed" },
        { text: filled(x, x.ing), mistake: "inf-ing" },
      ])
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, x] = entryIn(rng, GAP, (y) => y.to, g);
    return doIt(
      base("c-analyze", "concrete", "analyze", "build with a to-infinitive", rng),
      `Build the sentence with the right form of '${x.v}'. (Not every tile is needed.)`,
      p(i),
      tiles(rng, `${x.before} | to | ${x.v} | ${x.after.replace(/\.$/, "")} | .`, [x.ing], [
        { text: filled(x, x.v), mistake: "inf-to-needed" },
        { text: filled(x, x.ing), mistake: "inf-ing" },
      ])
    );
  },
  "concrete|evaluate": (rng, g) => {
    const [i, x] = entryIn(rng, GAP, (y) => !y.to, g);
    return doIt(
      base("c-evaluate", "concrete", "evaluate", "the extra 'to'", rng),
      "One word in this sentence shouldn't be there. Tap it.",
      p(i),
      tapWords(filled(x, `to ${x.v}`), `to ${x.v}`.split(" ")[0], [{ phrase: x.v, mistake: "inf-bare-needed" }])
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, x] = entry(rng, HAVE, g);
    const right = USE_LABEL[x.use];
    const others = shuffle(rng, (Object.entries(USE_LABEL) as [Use, string][]).filter(([u]) => u !== x.use)).slice(0, 3);
    return choose(
      base("p-remember", "pictorial", "remember", "what 'have' means", rng),
      "What does the highlighted word do in this sentence?",
      card([markWord(x.s, x.w)]),
      p(i, { k: 3 }),
      right,
      others.map(([u, text]) => ({ text, mistake: u === "causative" || x.use === "causative" ? "have-causative" : "have-use" }))
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, x] = entry(rng, GAP, g);
    return choose(
      base("p-understand", "pictorial", "understand", "to + verb, or the verb alone", rng),
      `Which form fills the gap? (verb: ${x.v})`,
      card([`${x.before} ___ ${x.after}`]),
      p(i),
      gapRight(x),
      gapWrongs(x)
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, x] = entry(rng, HAVEFILL, g);
    return choose(
      base("p-apply", "pictorial", "apply", "the right form of have", rng),
      "Which form fills the gap? (verb: have)",
      card([x.s]),
      p(i, { k: 4 }),
      x.right,
      x.wrong.map(([text, mistake]) => ({ text, mistake }))
    );
  },
  "pictorial|analyze": (rng, g) => {
    const [i, x] = entry(rng, CAUSE, g);
    return choose(
      base("p-analyze", "pictorial", "analyze", "had something done", rng),
      "Who did the work in the second sentence?",
      card([x.plain, x.caus]),
      p(i, { k: 5 }),
      x.who,
      [
        { text: x.self, mistake: "have-causative" },
        { text: "Nobody: 'had' means it is owned", mistake: "have-use" },
        { text: "It hasn't happened yet", mistake: "have-use" },
      ]
    );
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, x] = entry(rng, GAP, g);
    const forms = [gapRight(x), ...gapWrongs(x).map((w) => w.text)];
    const at = g && Number.isInteger(g.v) ? g.v : Math.floor(rng() * 3);
    const hers = forms[at];
    const LAB = { ok: "Yes, it is right", to: "No: it needs 'to' + the verb", bare: "No: it needs the verb without 'to'", ing: "No: it needs the -ing form" };
    const right = at === 0 ? LAB.ok : x.to ? LAB.to : LAB.bare;
    const mistakeOf = at === 0 ? null : gapWrongs(x)[at - 1].mistake;
    const opts = Object.values(LAB).filter((o) => o !== right);
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "judge the infinitive", rng),
      "Riya filled the gap like this. Is she right?",
      card([`Riya: ${filled(x, hers)}`]),
      p(i, { v: at }),
      right,
      opts.map((text) => ({ text, mistake: mistakeOf ?? (text === LAB.to ? "inf-to-needed" : text === LAB.bare ? "inf-bare-needed" : "inf-ing") }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, r] = entry(rng, RULES, g);
    return choose(base("a-remember", "abstract", "remember", "the rules", rng), r.q, null, p(i, { k: 6 }), r.a, r.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, x] = entry(rng, GAP, g);
    return choose(base("a-understand", "abstract", "understand", "to + verb, or the verb alone", rng), `Fill the gap (verb: ${x.v}): ${x.before} ___ ${x.after}`, null, p(i), gapRight(x), gapWrongs(x));
  },
  "abstract|apply": (rng, g) => {
    const [i, x] = entry(rng, HAVEFILL, g);
    return choose(base("a-apply", "abstract", "apply", "the right form of have", rng), `Fill the gap (verb: have): ${x.s}`, null, p(i, { k: 4 }), x.right, x.wrong.map(([text, mistake]) => ({ text, mistake })));
  },
  "abstract|analyze": (rng, g) => {
    const [i, x] = entry(rng, TO_INF, g);
    const preps = shuffle(rng, PREP_TO).slice(0, 3);
    return choose(
      base("a-analyze", "abstract", "analyze", "which 'to' starts an infinitive", rng),
      "In which sentence is 'to' part of an infinitive (to + verb)?",
      null,
      p(i, { k: 1, j: PREP_TO.indexOf(preps[0]) }),
      x.s,
      preps.map((text) => ({ text, mistake: "inf-prep-to" }))
    );
  },
  "abstract|evaluate": (rng, g) => {
    const [i, x] = entry(rng, GAP, g);
    const ws = gapWrongs(x);
    const w = g && Number.isInteger(g.w) && ws[g.w] ? g.w : Math.floor(rng() * ws.length);
    const aRight = g && Number.isInteger(g.a) ? g.a === 1 : rng() < 0.5;
    const good = filled(x, gapRight(x));
    const bad = filled(x, ws[w].text);
    return choose(
      base("a-evaluate", "abstract", "evaluate", "judge the infinitive", rng),
      `A: ${aRight ? good : bad} B: ${aRight ? bad : good} Which is correct?`,
      null,
      p(i, { w, a: aRight ? 1 : 0 }),
      aRight ? "Only A" : "Only B",
      [
        { text: aRight ? "Only B" : "Only A", mistake: ws[w].mistake },
        { text: "Both", mistake: ws[w].mistake },
        { text: "Neither", mistake: "inf-form" },
      ]
    );
  },
};

/** For the stress test. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  if (cell === "pictorial|understand" || cell === "abstract|understand") {
    const x = GAP[it.params.i];
    if (right !== (x.to ? `to ${x.v}` : x.v)) return `gap should be ${x.to ? "to " : ""}${x.v}`;
  }
  if (cell === "abstract|analyze" && !TO_INF.some((x) => x.s === right)) return "the infinitive sentence should come from the bank";
  return null;
}
