import { Rng, Template, pick } from "./core.js";
import { Misconceptions, baseFor, cap, card, choose, doIt, entry, entryIn, mark, shuffle, tapWords, tiles } from "./english.js";

/**
 * Active and Passive Voice, Grade 8 English (English Rose Reader 8,
 * chapter 14 grammar; Model Test Paper 2, question F).
 *   concrete  tap the verb; tap the doer in a passive sentence; build the
 *             passive (or active) from tiles, with a wrong-tense and a
 *             past-tense tile to tempt; tap the wrong word in a passive
 *   pictorial active or passive?; who does the action?; choose the passive;
 *             choose the active; what did Riya get wrong?
 *   abstract  how the passive is made; passive of …; active of …; which one
 *             is passive (was + -ing is not); which tense is this passive?
 */

const TOPIC = "e8-voice";
const base = baseFor("voi8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "voice-tense": {
    label: "Changes the tense",
    detail: "Uses 'be' in a different tense from the active verb (is cleaned for cleaned, was for has been).",
    childTip: "Keep the tense: cleaned → was cleaned; cleans → is cleaned; will clean → will be cleaned; has cleaned → has been cleaned.",
  },
  "voice-agreement": {
    label: "'Be' doesn't agree with the new subject",
    detail: "Writes was for a plural subject or were for a singular one after turning the sentence round.",
    childTip: "The new subject decides: one thing → was / is / has; more than one → were / are / have.",
  },
  "voice-swap": {
    label: "Swaps the doer and the receiver",
    detail: "Puts the doer at the front and the receiver after 'by', which changes the meaning.",
    childTip: "In the passive, the receiver (the active sentence's object) comes first; the doer goes after 'by'.",
  },
  "voice-participle": {
    label: "Uses the past tense, not the past participle",
    detail: "Writes was wrote / were took instead of was written / were taken.",
    childTip: "Passive = be + past participle: was written, were taken, was stolen.",
  },
  "voice-not-changed": {
    label: "Doesn't change the voice",
    detail: "Leaves the sentence in the voice it started in, only changing a word or two.",
    childTip: "Active: the doer comes first. Passive: the receiver comes first and the verb is be + past participle.",
  },
  "voice-identify": {
    label: "Mixes up active and passive",
    detail: "Calls an active sentence passive, or a passive one active.",
    childTip: "Ask: does the subject DO the action (active) or RECEIVE it (passive)?",
  },
  "voice-be-means-passive": {
    label: "Thinks any 'was/were' makes a sentence passive",
    detail: "Takes was playing (be + -ing) or was happy (be + adjective) as passive.",
    childTip: "Passive needs be + past participle (was played). 'was playing' is still active.",
  },
  "voice-doer": {
    label: "Can't find the doer in a passive sentence",
    detail: "Takes the subject of a passive sentence as the one doing the action.",
    childTip: "In a passive sentence, the doer comes after 'by'. The subject only receives the action.",
  },
  "voice-rule": {
    label: "Doesn't know how the passive is made or used",
    detail: "Unsure of the rule: be + past participle, the object becoming the subject, when the passive is useful.",
    childTip: "Passive = receiver + be + past participle (+ by + doer). Use it when the action matters more than who did it.",
  },
};

interface Entry {
  /** active subject, verb (and a wrong-tense verb), object, as in the active sentence */
  S: string;
  V: string;
  Vw: string;
  O: string;
  /** passive: form of be, past participle, simple past (only if it differs from the participle) */
  aux: string;
  pp: string;
  past?: string;
  /** the doer as written after 'by' */
  agent: string;
  rest?: string;
}

const BANK: Entry[] = [
  { S: "The students", V: "completed", Vw: "complete", O: "the science project", aux: "was", pp: "completed", agent: "the students", rest: "before the deadline" },
  { S: "She", V: "painted", Vw: "paints", O: "a beautiful sunset", aux: "was", pp: "painted", agent: "her", rest: "on the canvas" },
  { S: "Ramesh", V: "solved", Vw: "solves", O: "the maths problems", aux: "were", pp: "solved", agent: "Ramesh", rest: "with ease" },
  { S: "The volunteers", V: "cleaned", Vw: "clean", O: "the park", aux: "was", pp: "cleaned", agent: "the volunteers", rest: "after the event" },
  { S: "The chef", V: "prepared", Vw: "prepares", O: "a delicious meal", aux: "was", pp: "prepared", agent: "the chef", rest: "for the guests" },
  { S: "The teacher", V: "checks", Vw: "checked", O: "our notebooks", aux: "are", pp: "checked", agent: "the teacher", rest: "every Friday" },
  { S: "Grandmother", V: "tells", Vw: "told", O: "the best stories", aux: "are", pp: "told", agent: "Grandmother", rest: "at bedtime" },
  { S: "The gardener", V: "waters", Vw: "watered", O: "the roses", aux: "are", pp: "watered", agent: "the gardener", rest: "every morning" },
  { S: "Della", V: "sold", Vw: "sells", O: "her beautiful hair", aux: "was", pp: "sold", agent: "Della", rest: "for twenty dollars" },
  { S: "Jim", V: "bought", Vw: "buys", O: "the combs", aux: "were", pp: "bought", agent: "Jim", rest: "for Della" },
  { S: "The woodcutters", V: "will cut", Vw: "are cutting", O: "the old oak tree", aux: "will be", pp: "cut", agent: "the woodcutters", rest: "tomorrow" },
  { S: "The workers", V: "have built", Vw: "built", O: "a new bridge", aux: "has been", pp: "built", agent: "the workers", rest: "over the river" },
  { S: "The children", V: "are planting", Vw: "planted", O: "trees", aux: "are being", pp: "planted", agent: "the children", rest: "in the schoolyard" },
  { S: "Anu", V: "is writing", Vw: "wrote", O: "a letter", aux: "is being", pp: "written", past: "wrote", agent: "Anu", rest: "to her cousin" },
  { S: "The keeper", V: "feeds", Vw: "fed", O: "the tigers", aux: "are", pp: "fed", agent: "the keeper", rest: "twice a day" },
  { S: "Pip", V: "stole", Vw: "steals", O: "a pie", aux: "was", pp: "stolen", past: "stole", agent: "Pip", rest: "for the convict" },
  { S: "The Abbot", V: "placed", Vw: "places", O: "a bell", aux: "was", pp: "placed", agent: "the Abbot", rest: "on the Inchcape Rock" },
  { S: "The rangers", V: "will count", Vw: "counted", O: "the tigers", aux: "will be", pp: "counted", agent: "the rangers", rest: "next month" },
  { S: "The class", V: "can solve", Vw: "solved", O: "this puzzle", aux: "can be", pp: "solved", agent: "the class", rest: "easily" },
  { S: "My brother", V: "broke", Vw: "breaks", O: "the window", aux: "was", pp: "broken", past: "broke", agent: "my brother", rest: "with his cricket ball" },
  { S: "Shakespeare", V: "wrote", Vw: "writes", O: "Julius Caesar", aux: "was", pp: "written", past: "wrote", agent: "Shakespeare" },
  { S: "The guards", V: "have opened", Vw: "opened", O: "the gates", aux: "have been", pp: "opened", agent: "the guards", rest: "for the visitors" },
  { S: "The principal", V: "gave", Vw: "gives", O: "the prizes", aux: "were", pp: "given", past: "gave", agent: "the principal", rest: "on Sports Day" },
  { S: "They", V: "will announce", Vw: "announced", O: "the results", aux: "will be", pp: "announced", agent: "them", rest: "on Monday" },
  { S: "He", V: "took", Vw: "takes", O: "these photographs", aux: "were", pp: "taken", past: "took", agent: "him", rest: "in Ladakh" },
  { S: "The postman", V: "delivers", Vw: "delivered", O: "the letters", aux: "are", pp: "delivered", agent: "the postman", rest: "every afternoon" },
  { S: "Sudha Murty", V: "has written", Vw: "wrote", O: "many books", aux: "have been", pp: "written", past: "wrote", agent: "Sudha Murty", rest: "for children" },
  { S: "The villagers", V: "rang", Vw: "ring", O: "the temple bell", aux: "was", pp: "rung", past: "rang", agent: "the villagers", rest: "at dawn" },
];

/** A wrong tense of 'be' for each form. */
const TENSE_SWAP: Record<string, string[]> = {
  was: ["is", "has been"],
  were: ["are", "have been"],
  is: ["was", "will be"],
  are: ["were", "will be"],
  "will be": ["would be", "is"],
  "has been": ["was", "had been"],
  "have been": ["were", "had been"],
  "is being": ["was being", "is"],
  "are being": ["were being", "are"],
  "can be": ["could be", "was"],
};
const AGREE: Record<string, string> = { was: "were", were: "was", is: "are", are: "is", "has been": "have been", "have been": "has been", "is being": "are being", "are being": "is being" };
const TENSE_NAME: Record<string, string> = {
  was: "Simple past",
  were: "Simple past",
  is: "Simple present",
  are: "Simple present",
  "will be": "Simple future (will)",
  "has been": "Present perfect",
  "have been": "Present perfect",
  "is being": "Present continuous",
  "are being": "Present continuous",
  "can be": "With a modal (can)",
};

const tail = (e: Entry) => (e.rest ? ` ${e.rest}` : "");
const active = (e: Entry, verb = e.V) => `${e.S} ${verb} ${e.O}${tail(e)}.`;
const passive = (e: Entry, aux = e.aux, pp = e.pp) => `${cap(e.O)} ${aux} ${pp} by ${e.agent}${tail(e)}.`;
const swapped = (e: Entry) => `${e.S} ${e.aux} ${e.pp} by ${e.O}${tail(e)}.`;

function passiveWrongs(e: Entry) {
  const w: { text: string; mistake: string }[] = [];
  if (AGREE[e.aux]) w.push({ text: passive(e, AGREE[e.aux]), mistake: "voice-agreement" });
  if (e.past) w.push({ text: passive(e, e.aux, e.past), mistake: "voice-participle" });
  w.push({ text: swapped(e), mistake: "voice-swap" });
  for (const t of TENSE_SWAP[e.aux]) w.push({ text: passive(e, t), mistake: "voice-tense" });
  return w;
}
function activeWrongs(e: Entry) {
  return [
    { text: active(e, e.Vw), mistake: "voice-tense" },
    { text: `${cap(e.O)} ${e.V} ${e.S.replace(/^(She|He|They)$/, (m) => ({ She: "her", He: "him", They: "them" })[m]!)}${tail(e)}.`.replace(/ The /g, " the "), mistake: "voice-swap" },
    { text: passive(e, TENSE_SWAP[e.aux][0]), mistake: "voice-not-changed" },
    { text: passive(e), mistake: "voice-not-changed" },
  ];
}
/** Lower-case "The" after the first word (for sentences built from parts). */
const p = (i: number, k = 0) => ({ k, i });

// Look-alikes: 'be' but active (be + -ing, be + adjective).
const LOOKALIKES = [
  "The children were playing in the park.",
  "The dog was barking at the postman.",
  "They were singing in the school hall.",
  "He is reading a comic book.",
  "The guests were happy with the food.",
  "Anu was waiting for the school bus.",
  "The tigers are sleeping in the shade.",
  "She was tired after the long match.",
];
const ACTIVES_ONLY = (e: Entry) => active(e);

const RULES: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  {
    q: "Which sentence wrongly uses the passive with a verb that shows a state, not an action?",
    a: "Common sense is lacked by your sister.",
    w: [
      { text: "Dinner is being prepared now.", mistake: "voice-rule" },
      { text: "Has she been informed?", mistake: "voice-rule" },
      { text: "I was invited to the party.", mistake: "voice-rule" },
    ],
  },
  {
    q: "For an instrument that causes the action, the passive uses ___",
    a: "with (He was injured with a gun)",
    w: [
      { text: "by (He was injured by a gun)", mistake: "voice-doer" },
      { text: "from (He was injured from a gun)", mistake: "voice-doer" },
      { text: "to (He was injured to a gun)", mistake: "voice-doer" },
    ],
  },
  {
    q: "Passive voice = a form of 'be' + ___",
    a: "the past participle (written, taken)",
    w: [
      { text: "the -ing form (writing, taking)", mistake: "voice-be-means-passive" },
      { text: "the simple past (wrote, took)", mistake: "voice-participle" },
      { text: "the base form (write, take)", mistake: "voice-rule" },
    ],
  },
  {
    q: "In a passive sentence, the doer of the action comes after the word ___",
    a: "by",
    w: [
      { text: "to", mistake: "voice-doer" },
      { text: "from", mistake: "voice-doer" },
      { text: "was", mistake: "voice-doer" },
    ],
  },
  {
    q: "Active to passive: the object of the active sentence becomes the ___ of the passive one.",
    a: "subject",
    w: [
      { text: "object", mistake: "voice-not-changed" },
      { text: "doer, after 'by'", mistake: "voice-swap" },
      { text: "verb", mistake: "voice-rule" },
    ],
  },
  {
    q: "The passive voice is most useful when ___",
    a: "the action matters more than who did it, or the doer isn't known",
    w: [
      { text: "the doer is the most important part of the sentence", mistake: "voice-rule" },
      { text: "the sentence is in the past tense", mistake: "voice-be-means-passive" },
      { text: "the sentence has no verb", mistake: "voice-rule" },
    ],
  },
  {
    q: "'My briefcase was stolen.' The 'by …' part is left out because ___",
    a: "we don't know who stole it",
    w: [
      { text: "the passive never has a 'by …' part", mistake: "voice-rule" },
      { text: "the briefcase is the doer", mistake: "voice-doer" },
      { text: "the sentence is active", mistake: "voice-identify" },
    ],
  },
];

const AP = ["Active: the subject does the action", "Passive: the subject receives the action", "Active: the subject receives the action", "Passive: the subject does the action"];

export const VOICE_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE: tap and build ----------------
  "concrete|remember": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return doIt(
      base("c-remember", "concrete", "remember", "find the verb", rng),
      "Tap the verb. (It can be more than one word, like 'will cut'.)",
      p(i),
      tapWords(active(e), e.V, [{ phrase: e.O.split(" ").slice(-1)[0], mistake: "voice-identify" }])
    );
  },
  "concrete|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return doIt(
      base("c-understand", "concrete", "understand", "doer in a passive sentence", rng),
      "Who or what does the action? Tap their words.",
      p(i),
      tapWords(passive(e), e.agent, [{ phrase: e.O, mistake: "voice-doer" }], [`by ${e.agent}`])
    );
  },
  "concrete|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const spares = [TENSE_SWAP[e.aux][0], ...(e.past ? [e.past] : [])];
    return doIt(
      base("c-apply", "concrete", "apply", "active to passive", rng),
      `Build the passive of: '${active(e)}' (Not every tile is needed.)`,
      p(i),
      tiles(rng, `${cap(e.O)} | ${e.aux} | ${e.pp} | by ${e.agent}${tail(e)} | .`, spares, [
        { text: passive(e, TENSE_SWAP[e.aux][0]), mistake: "voice-tense" },
        ...(e.past ? [{ text: passive(e, e.aux, e.past), mistake: "voice-participle" }] : []),
      ])
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return doIt(
      base("c-analyze", "concrete", "analyze", "passive to active", rng),
      `Build the active voice of: '${passive(e)}' (Not every tile is needed.)`,
      p(i),
      tiles(rng, `${e.S} | ${e.V} | ${e.O}${tail(e)} | .`, [e.Vw], [{ text: active(e, e.Vw), mistake: "voice-tense" }])
    );
  },
  "concrete|evaluate": (rng, g) => {
    // a passive with one wrong word: tap it
    const [i, e] = entryIn(rng, BANK, (e) => !!AGREE[e.aux] && !e.aux.includes(" "), g);
    const wrongAux = AGREE[e.aux];
    return doIt(
      base("c-evaluate", "concrete", "evaluate", "correct a passive", rng),
      "One word in this sentence is wrong. Tap it.",
      p(i),
      tapWords(passive(e, wrongAux), wrongAux, [{ phrase: e.pp, mistake: "voice-agreement" }, { phrase: e.agent, mistake: "voice-agreement" }])
    );
  },

  // ---------------- PICTORIAL: a text card ----------------
  "pictorial|remember": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const isPassive = rng() < 0.5;
    const s = isPassive ? passive(e) : active(e);
    const right = isPassive ? AP[1] : AP[0];
    return choose(
      base("p-remember", "pictorial", "remember", "identify the voice", rng),
      "Active or passive? Look at the highlighted subject.",
      card([mark(s, isPassive ? cap(e.O) : e.S)]),
      { ...p(i), v: isPassive ? 1 : 0 },
      right,
      [
        { text: isPassive ? AP[0] : AP[1], mistake: "voice-identify" },
        { text: isPassive ? AP[3] : AP[2], mistake: "voice-doer" },
        { text: isPassive ? AP[2] : AP[3], mistake: "voice-identify" },
      ]
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(
      base("p-understand", "pictorial", "understand", "doer in a passive sentence", rng),
      "Who did the highlighted action?",
      card([mark(passive(e), `${e.aux} ${e.pp}`)]),
      p(i),
      cap(e.agent),
      [
        { text: cap(e.O), mistake: "voice-doer" },
        { text: "Nobody: a passive sentence has no doer", mistake: "voice-rule" },
        { text: "We can't tell from the sentence", mistake: "voice-doer" },
      ]
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(
      base("p-apply", "pictorial", "apply", "active to passive", rng),
      "Choose the passive voice of this sentence.",
      card([mark(active(e), e.V)]),
      p(i),
      passive(e),
      passiveWrongs(e)
    );
  },
  "pictorial|analyze": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(
      base("p-analyze", "pictorial", "analyze", "passive to active", rng),
      "Choose the active voice of this sentence.",
      card([mark(passive(e), `by ${e.agent}`)]),
      p(i),
      active(e),
      activeWrongs(e)
    );
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const options = passiveWrongs(e);
    const herIdx = Math.floor(rng() * (options.length + 1));
    const hers = herIdx < options.length ? options[herIdx] : { text: passive(e), mistake: "" };
    const LABEL: Record<string, string> = {
      "voice-agreement": "'Be' doesn't agree with the new subject",
      "voice-participle": "She used the past tense, not the past participle",
      "voice-swap": "She swapped the doer and the receiver",
      "voice-tense": "She changed the tense",
      "": "Nothing: it is right",
    };
    const right = LABEL[hers.mistake];
    const others = Object.entries(LABEL).filter(([k]) => k !== hers.mistake);
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "check a passive", rng),
      "Riya changed the first sentence into the passive. What, if anything, did she get wrong?",
      card([active(e), `Riya: ${hers.text}`], "Active, then Riya's passive"),
      { ...p(i), v: herIdx },
      right,
      // Missing her mistake is that mistake; calling a right passive wrong shows the rule they doubt.
      shuffle(rng, others).map(([k, t]) => ({ text: t, mistake: hers.mistake || k }))
    );
  },

  // ---------------- ABSTRACT: bare rules and sentences ----------------
  "abstract|remember": (rng, g) => {
    const [i, r] = entry(rng, RULES, g);
    return choose(base("a-remember", "abstract", "remember", "the passive rule", rng), r.q, null, p(i, 2), r.a, r.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(base("a-understand", "abstract", "understand", "active to passive", rng), `Passive voice: ${active(e)}`, null, p(i), passive(e), passiveWrongs(e));
  },
  "abstract|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(base("a-apply", "abstract", "apply", "passive to active", rng), `Active voice: ${passive(e)}`, null, p(i), active(e), activeWrongs(e));
  },
  "abstract|analyze": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const look = shuffle(rng, LOOKALIKES).slice(0, 2);
    const other = pick(rng, BANK.filter((x) => x !== e));
    return choose(
      base("a-analyze", "abstract", "analyze", "spot the passive", rng),
      "Which sentence is in the passive voice?",
      null,
      { ...p(i), j: BANK.indexOf(other), l: LOOKALIKES.indexOf(look[0]) },
      passive(e),
      [
        { text: look[0], mistake: "voice-be-means-passive" },
        { text: look[1], mistake: "voice-be-means-passive" },
        { text: ACTIVES_ONLY(other), mistake: "voice-identify" },
      ]
    );
  },
  "abstract|evaluate": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const right = TENSE_NAME[e.aux];
    const others = [...new Set(Object.values(TENSE_NAME))].filter((t) => t !== right);
    return choose(
      base("a-evaluate", "abstract", "evaluate", "tense of a passive", rng),
      `Which tense is this passive in? ${passive(e)}`,
      null,
      p(i),
      right,
      shuffle(rng, others).map((t) => ({ text: t, mistake: "voice-tense" }))
    );
  },
};

/** Independent check for the stress test: the right passive/active is the bank's. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  if (it.params.k) return null;
  const e = BANK[it.params.i];
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  const cell = `${it.cpa}|${it.bloom}`;
  if ((cell === "pictorial|apply" || cell === "abstract|understand") && right !== `${cap(e.O)} ${e.aux} ${e.pp} by ${e.agent}${e.rest ? " " + e.rest : ""}.`) return `passive should be the bank's, got ${right}`;
  if ((cell === "pictorial|analyze" || cell === "abstract|apply") && right !== `${e.S} ${e.V} ${e.O}${e.rest ? " " + e.rest : ""}.`) return `active should be the bank's, got ${right}`;
  return null;
}
