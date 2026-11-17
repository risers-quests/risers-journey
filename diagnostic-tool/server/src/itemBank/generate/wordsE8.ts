import { Template, pick } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, markWord, shuffle, tapWords, tiles } from "./english.js";

/**
 * Word Study (vocabulary), Grade 8 English (English Rose Reader 8, the
 * Vocabulary column of the Scope and Sequence): homophones, homonyms,
 * synonyms and antonyms, prefixes and suffixes, commonly confused words,
 * loanwords.
 *   concrete  tap the homophone spelt wrong for its meaning; tap the prefix
 *             or suffix; build a word from prefix + root + suffix; tap the two
 *             opposites; tap the commonly confused word used wrongly
 *   pictorial the synonym; a homonym's meaning here; the right homophone;
 *             what a prefix means; is Riya right about the pair?
 *   abstract  the terms; the antonym; the negative prefix; where a loanword
 *             comes from; which sentence is correct?
 */

const TOPIC = "e8-words";
const base = baseFor("wrd8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "vocab-homophone": {
    label: "Mixes up homophones",
    detail: "Writes here for hear, sale for sail, their for there.",
    childTip: "Same sound, different spelling and meaning: hear (with your ears) / here (this place); sail (a ship's) / sale (in a shop).",
  },
  "vocab-homonym": {
    label: "Takes the wrong meaning of a word with two meanings",
    detail: "Reads bark as a tree's bark in 'the dog's bark', or bank as a money bank on a river.",
    childTip: "Read the words around it: a dog's bark is a sound; a tree's bark is its skin.",
  },
  "vocab-synonym": {
    label: "Mixes up synonyms and antonyms",
    detail: "Chooses the opposite when asked for a word that means the same, or the other way round.",
    childTip: "Synonym: same meaning (huge, enormous). Antonym: opposite meaning (huge, tiny).",
  },
  "vocab-affix": {
    label: "Mixes up prefixes, roots and suffixes",
    detail: "Takes the root for the prefix, or doesn't know what a prefix or suffix adds.",
    childTip: "Prefix: at the front, changes the meaning (un-, dis-, re-, mis-). Suffix: at the end, changes the job (-ness, -ful, -less, -er).",
  },
  "vocab-wrong-prefix": {
    label: "Uses the wrong negative prefix",
    detail: "Writes unhonest, inpossible, unlegal.",
    childTip: "Learn them as whole words: dishonest, impossible, illegal, irregular, impatient, unkind.",
  },
  "vocab-confused": {
    label: "Mixes up commonly confused words",
    detail: "advice / advise, lose / loose, affect / effect, quite / quiet, accept / except.",
    childTip: "advice (noun) / advise (verb); lose (miss) / loose (not tight); affect (verb) / effect (noun); quite (very) / quiet (silent).",
  },
  "vocab-loanword": {
    label: "Doesn't know where a borrowed word comes from",
    detail: "Unsure which language English borrowed a common word from.",
    childTip: "English borrows: jungle, bungalow, shampoo (Hindi); ballet, café (French); piano, pizza (Italian); tsunami (Japanese).",
  },
  "vocab-terms": {
    label: "Mixes up the word-study terms",
    detail: "Calls homophones homonyms, or synonyms antonyms.",
    childTip: "Homophones sound the same (sail / sale). Homonyms are spelt the same (bark / bark). Synonyms mean the same. Antonyms mean the opposite.",
  },
};

/** Fill with the right homophone; w = wrong words (the homophone first). */
const HOMO: { s: string; right: string; w: [string, string, string] }[] = [
  { s: "The sailors could not ___ the bell.", right: "hear", w: ["here", "hair", "heir"] },
  { s: "Della sold her ___ to buy a present.", right: "hair", w: ["hare", "here", "heir"] },
  { s: "Sir Ralph set ___ on a calm day.", right: "sail", w: ["sale", "sell", "sole"] },
  { s: "The shop had a big ___ on winter coats.", right: "sale", w: ["sail", "sell", "seal"] },
  { s: "Grandmother told us a ___ about a clever fox.", right: "tale", w: ["tail", "tall", "tell"] },
  { s: "The tiger's ___ swished in the grass.", right: "tail", w: ["tale", "tall", "tile"] },
  { s: "I don't know ___ it will rain tomorrow.", right: "whether", w: ["weather", "wither", "rather"] },
  { s: "The ___ was cold and windy.", right: "weather", w: ["whether", "wither", "feather"] },
  { s: "The children ___ the answer at once.", right: "knew", w: ["new", "know", "now"] },
  { s: "Please don't ___ the glass.", right: "break", w: ["brake", "brick", "brook"] },
  { s: "We need ___ and quiet to study.", right: "peace", w: ["piece", "place", "pierce"] },
  { s: "Can I have a ___ of cake?", right: "piece", w: ["peace", "place", "pierce"] },
  { s: "The ___ gave away the prizes on Sports Day.", right: "principal", w: ["principle", "princess", "prince"] },
  { s: "We bought pens and paper at the ___ shop.", right: "stationery", w: ["stationary", "station", "stationed"] },
  { s: "They left ___ bags at the gate.", right: "their", w: ["there", "they're", "them"] },
  { s: "The dog wagged ___ tail.", right: "its", w: ["it's", "is", "it"] },
  { s: "The rangers counted ___ new cubs.", right: "two", w: ["too", "to", "tow"] },
  { s: "Pip was ___ frightened to speak.", right: "too", w: ["to", "two", "toe"] },
];
const fill = (s: string, w: string) => s.replace("___", w);

/** A word with two meanings, in a sentence that decides which. */
const HOMONYM: { s: string; w: string; right: string; wrong: [string, string, string] }[] = [
  { s: "The dog's bark woke the baby.", w: "bark", right: "the sound a dog makes", wrong: ["the outer covering of a tree", "a kind of sailing ship", "a loud order"] },
  { s: "The bark of the old oak was rough.", w: "bark", right: "the outer covering of a tree", wrong: ["the sound a dog makes", "a kind of sailing ship", "a branch"] },
  { s: "A bat flew out of the dark cave.", w: "bat", right: "a small flying animal", wrong: ["a wooden stick for cricket", "a quick hit", "a blink of the eyes"] },
  { s: "Rohan broke his new cricket bat.", w: "bat", right: "a wooden stick for hitting a ball", wrong: ["a small flying animal", "a quick hit", "a blink of the eyes"] },
  { s: "The bank of the river was muddy.", w: "bank", right: "the land along the side of a river", wrong: ["a place that keeps money", "a pile of clouds", "to trust someone"] },
  { s: "Mother put her money in the bank.", w: "bank", right: "a place that keeps money", wrong: ["the land along the side of a river", "a pile of clouds", "to turn a plane"] },
  { s: "Your answer is right.", w: "right", right: "correct", wrong: ["the opposite of left", "something you are allowed to do", "straight away"] },
  { s: "Turn right at the old temple.", w: "right", right: "the opposite of left", wrong: ["correct", "something you are allowed to do", "fair"] },
  { s: "This bag is light enough to carry.", w: "light", right: "not heavy", wrong: ["brightness from the sun or a lamp", "pale in colour", "to set fire to"] },
  { s: "The sailors row the boat to the shore.", w: "row", right: "to move a boat with oars", wrong: ["a line of seats", "a noisy quarrel", "to grow"] },
  { s: "We sat in the front row.", w: "row", right: "a line of seats", wrong: ["to move a boat with oars", "a noisy quarrel", "a path"] },
  { s: "The convict was wearing a heavy iron on his leg.", w: "iron", right: "a metal chain or ring", wrong: ["a tool for pressing clothes", "a mineral in food", "very strong"] },
  { s: "Della could not find a fine watch chain for Jim.", w: "fine", right: "of good quality", wrong: ["money paid as a punishment", "very thin", "well and healthy"] },
  { s: "The teacher made Rohan pay a fine for the late book.", w: "fine", right: "money paid as a punishment", wrong: ["of good quality", "very thin", "sunny"] },
];

/** Synonym and antonym of a word. */
const SA: { w: string; syn: string; ant: string }[] = [
  { w: "ancient", syn: "old", ant: "modern" },
  { w: "brave", syn: "courageous", ant: "cowardly" },
  { w: "generous", syn: "giving", ant: "mean" },
  { w: "calm", syn: "peaceful", ant: "stormy" },
  { w: "huge", syn: "enormous", ant: "tiny" },
  { w: "frightened", syn: "afraid", ant: "fearless" },
  { w: "joyful", syn: "happy", ant: "miserable" },
  { w: "difficult", syn: "hard", ant: "easy" },
  { w: "wealthy", syn: "rich", ant: "poor" },
  { w: "rapid", syn: "quick", ant: "slow" },
  { w: "begin", syn: "start", ant: "finish" },
  { w: "honest", syn: "truthful", ant: "dishonest" },
  { w: "famous", syn: "well-known", ant: "unknown" },
  { w: "humble", syn: "modest", ant: "proud" },
  { w: "shabby", syn: "worn-out", ant: "smart" },
];

/** A word in parts; which part is the prefix or suffix, and what it means. */
const AFFIX: { parts: string[]; at: number; kind: "prefix" | "suffix"; means: string; wrong: [string, string, string] }[] = [
  { parts: ["un", "happy"], at: 0, kind: "prefix", means: "not", wrong: ["again", "before", "full of"] },
  { parts: ["dis", "agree"], at: 0, kind: "prefix", means: "not, the opposite of", wrong: ["again", "together", "too much"] },
  { parts: ["re", "write"], at: 0, kind: "prefix", means: "again", wrong: ["not", "before", "wrongly"] },
  { parts: ["pre", "view"], at: 0, kind: "prefix", means: "before", wrong: ["after", "again", "not"] },
  { parts: ["mis", "understand"], at: 0, kind: "prefix", means: "wrongly", wrong: ["again", "before", "under"] },
  { parts: ["over", "cook"], at: 0, kind: "prefix", means: "too much", wrong: ["above", "again", "not enough"] },
  { parts: ["sub", "marine"], at: 0, kind: "prefix", means: "under", wrong: ["over", "between", "again"] },
  { parts: ["inter", "national"], at: 0, kind: "prefix", means: "between", wrong: ["inside", "not", "against"] },
  { parts: ["co", "operate"], at: 0, kind: "prefix", means: "together", wrong: ["against", "again", "before"] },
  { parts: ["kind", "ness"], at: 1, kind: "suffix", means: "the state of being", wrong: ["without", "full of", "a person who"] },
  { parts: ["hope", "ful"], at: 1, kind: "suffix", means: "full of", wrong: ["without", "the state of being", "able to be"] },
  { parts: ["care", "less"], at: 1, kind: "suffix", means: "without", wrong: ["full of", "more", "a person who"] },
  { parts: ["teach", "er"], at: 1, kind: "suffix", means: "a person who", wrong: ["more", "the act of", "without"] },
  { parts: ["read", "able"], at: 1, kind: "suffix", means: "can be", wrong: ["cannot be", "full of", "a person who"] },
  { parts: ["un", "kind", "ness"], at: 0, kind: "prefix", means: "not", wrong: ["again", "the state of being", "before"] },
  { parts: ["un", "kind", "ness"], at: 2, kind: "suffix", means: "the state of being", wrong: ["not", "without", "full of"] },
];

/** Build a word from tiles. */
const BUILD: { meaning: string; parts: string[]; spares: string[]; wrong: { text: string; mistake: string }[] }[] = [
  { meaning: "the state of not being kind", parts: ["un", "kind", "ness"], spares: ["dis", "ful"], wrong: [{ text: "dis kind ness", mistake: "vocab-wrong-prefix" }] },
  { meaning: "without care", parts: ["care", "less"], spares: ["ful", "un"], wrong: [{ text: "care ful", mistake: "vocab-affix" }] },
  { meaning: "to write again", parts: ["re", "write"], spares: ["un", "pre"], wrong: [{ text: "pre write", mistake: "vocab-affix" }] },
  { meaning: "full of hope", parts: ["hope", "ful"], spares: ["less", "ness"], wrong: [{ text: "hope less", mistake: "vocab-affix" }] },
  { meaning: "a person who teaches", parts: ["teach", "er"], spares: ["ness", "ment"], wrong: [{ text: "teach ment", mistake: "vocab-affix" }] },
  { meaning: "not honest", parts: ["dis", "honest"], spares: ["un", "in"], wrong: [{ text: "un honest", mistake: "vocab-wrong-prefix" }, { text: "in honest", mistake: "vocab-wrong-prefix" }] },
  { meaning: "in a careless way", parts: ["care", "less", "ly"], spares: ["ful", "ness"], wrong: [{ text: "care ful ly", mistake: "vocab-affix" }] },
  { meaning: "the act of agreeing", parts: ["agree", "ment"], spares: ["ness", "dis"], wrong: [{ text: "agree ness", mistake: "vocab-affix" }] },
  { meaning: "not possible", parts: ["im", "possible"], spares: ["un", "in"], wrong: [{ text: "un possible", mistake: "vocab-wrong-prefix" }, { text: "in possible", mistake: "vocab-wrong-prefix" }] },
  { meaning: "to understand wrongly", parts: ["mis", "understand"], spares: ["dis", "un"], wrong: [{ text: "dis understand", mistake: "vocab-wrong-prefix" }] },
];

/** Opposites made with a prefix. */
const NEG: { w: string; right: string; wrong: [string, string, string] }[] = [
  { w: "honest", right: "dishonest", wrong: ["unhonest", "inhonest", "mishonest"] },
  { w: "possible", right: "impossible", wrong: ["unpossible", "inpossible", "dispossible"] },
  { w: "legal", right: "illegal", wrong: ["unlegal", "inlegal", "dislegal"] },
  { w: "regular", right: "irregular", wrong: ["unregular", "inregular", "disregular"] },
  { w: "patient", right: "impatient", wrong: ["unpatient", "dispatient", "inpatient"] },
  { w: "agree", right: "disagree", wrong: ["unagree", "misagree", "inagree"] },
  { w: "kind", right: "unkind", wrong: ["diskind", "inkind", "imkind"] },
  { w: "obey", right: "disobey", wrong: ["unobey", "misobey", "inobey"] },
  { w: "visible", right: "invisible", wrong: ["unvisible", "disvisible", "imvisible"] },
  { w: "responsible", right: "irresponsible", wrong: ["unresponsible", "disresponsible", "inresponsible"] },
  { w: "polite", right: "impolite", wrong: ["unpolite", "dispolite", "inpolite"] },
  { w: "fair", right: "unfair", wrong: ["disfair", "infair", "imfair"] },
];

/** Two opposites in one sentence. */
const OPP: { s: string; a: string; b: string }[] = [
  { s: "The old oak stood among the young trees.", a: "old", b: "young" },
  { s: "Della was poor in money but rich in love.", a: "poor", b: "rich" },
  { s: "The tiger is fierce in the wild but gentle with its cubs.", a: "fierce", b: "gentle" },
  { s: "Some questions were easy, and some were difficult.", a: "easy", b: "difficult" },
  { s: "The ship sailed from a calm sea into a stormy one.", a: "calm", b: "stormy" },
  { s: "The story began dull but became exciting.", a: "dull", b: "exciting" },
  { s: "Gogol felt proud of his name, then ashamed of it.", a: "proud", b: "ashamed" },
  { s: "The narrow path led to a wide road.", a: "narrow", b: "wide" },
  { s: "Ice is hard, but fresh snow is soft.", a: "hard", b: "soft" },
  { s: "The cub was timid, but its mother was bold.", a: "timid", b: "bold" },
];

/** Commonly confused words used wrongly. */
const CONF: { wrong: string; bad: string; good: string }[] = [
  { wrong: "The teacher's advise was very helpful.", bad: "advise", good: "advice" },
  { wrong: "Don't loose your train ticket.", bad: "loose", good: "lose" },
  { wrong: "The heavy rain will effect the match.", bad: "effect", good: "affect" },
  { wrong: "I am quiet sure the bell will ring.", bad: "quiet", good: "quite" },
  { wrong: "Everyone came to the party accept Rohan.", bad: "accept", good: "except" },
  { wrong: "Meera must practice the drums every day.", bad: "practice", good: "practise" },
  { wrong: "The ranger lead us through the forest yesterday.", bad: "lead", good: "led" },
  { wrong: "The bus was to crowded to get in.", bad: "to", good: "too" },
  { wrong: "I could of finished the work earlier.", bad: "of", good: "have" },
  { wrong: "Sit down and breath slowly.", bad: "breath", good: "breathe" },
  { wrong: "The children were all ready asleep when we arrived.", bad: "all ready", good: "already" },
  { wrong: "The convict was shivering, and his cloths were wet.", bad: "cloths", good: "clothes" },
];
const corrected = (c: (typeof CONF)[number]) => c.wrong.replace(c.bad, c.good);

const LOAN: { w: string; from: string }[] = [
  { w: "jungle", from: "Hindi" },
  { w: "bungalow", from: "Hindi" },
  { w: "shampoo", from: "Hindi" },
  { w: "ballet", from: "French" },
  { w: "café", from: "French" },
  { w: "restaurant", from: "French" },
  { w: "piano", from: "Italian" },
  { w: "pizza", from: "Italian" },
  { w: "tsunami", from: "Japanese" },
  { w: "karate", from: "Japanese" },
  { w: "kindergarten", from: "German" },
  { w: "mosquito", from: "Spanish" },
  { w: "safari", from: "Swahili" },
];
const LANGS = [...new Set(LOAN.map((l) => l.from))];

const DEFS: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  { q: "Homophones are words that ___", a: "sound the same but are spelt differently and mean different things", w: [{ text: "are spelt the same but mean different things", mistake: "vocab-terms" }, { text: "mean the same thing", mistake: "vocab-terms" }, { text: "mean the opposite of each other", mistake: "vocab-terms" }] },
  { q: "Homonyms are words that ___", a: "are spelt and said the same but have different meanings", w: [{ text: "sound the same but are spelt differently", mistake: "vocab-terms" }, { text: "mean the same thing", mistake: "vocab-terms" }, { text: "are made of two words joined", mistake: "vocab-terms" }] },
  { q: "An antonym is ___", a: "a word with the opposite meaning", w: [{ text: "a word with the same meaning", mistake: "vocab-synonym" }, { text: "a word that sounds the same", mistake: "vocab-terms" }, { text: "a word borrowed from another language", mistake: "vocab-terms" }] },
  { q: "A prefix is ___", a: "a part added to the front of a word to change its meaning", w: [{ text: "a part added to the end of a word", mistake: "vocab-affix" }, { text: "the main part of a word", mistake: "vocab-affix" }, { text: "two words joined together", mistake: "vocab-affix" }] },
  { q: "A loanword is ___", a: "a word English has borrowed from another language", w: [{ text: "a word about money", mistake: "vocab-loanword" }, { text: "a word with two meanings", mistake: "vocab-terms" }, { text: "a very old English word", mistake: "vocab-loanword" }] },
  { q: "'lighthouse', 'sunflower' and 'snowfall' are ___", a: "compound words", w: [{ text: "homophones", mistake: "vocab-terms" }, { text: "loanwords", mistake: "vocab-terms" }, { text: "antonyms", mistake: "vocab-terms" }] },
];

const p = (i: number, k: number, extra: Record<string, number> = {}) => ({ i, k, ...extra });

export const WORDS_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, x] = entry(rng, HOMO, g);
    return doIt(
      base("c-remember", "concrete", "remember", "spot the wrong homophone", rng),
      "One word sounds right but is spelt wrong for its meaning. Tap it.",
      p(i, 1),
      tapWords(fill(x.s, x.w[0]), x.w[0])
    );
  },
  "concrete|understand": (rng, g) => {
    const [i, x] = entry(rng, AFFIX, g);
    return doIt(
      base("c-understand", "concrete", "understand", "find the prefix or suffix", rng),
      `The word '${x.parts.join("")}' is split into parts. Tap the ${x.kind}.`,
      p(i, 2),
      { kind: "words", tokens: x.parts, target: [x.at], wrongSets: x.parts.map((_, k) => k).filter((k) => k !== x.at).map((k) => ({ cells: [k], mistake: "vocab-affix" })) }
    );
  },
  "concrete|apply": (rng, g) => {
    const [i, x] = entry(rng, BUILD, g);
    return doIt(
      base("c-apply", "concrete", "apply", "build a word", rng),
      `Build one word that means '${x.meaning}'. (Not every tile is needed.)`,
      p(i, 3),
      { ...tiles(rng, x.parts.join(" | "), x.spares, x.wrong), glue: true }
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, x] = entry(rng, OPP, g);
    return doIt(base("c-analyze", "concrete", "analyze", "find the antonyms", rng), "Two words in this sentence are opposites (antonyms). Tap both.", p(i, 4), tapWords(x.s, [x.a, x.b]));
  },
  "concrete|evaluate": (rng, g) => {
    const [i, x] = entry(rng, CONF, g);
    return doIt(base("c-evaluate", "concrete", "evaluate", "commonly confused words", rng), "One word (or pair of words) is the wrong one of a commonly confused pair. Tap it.", p(i, 5), tapWords(x.wrong, x.bad));
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, x] = entry(rng, SA, g);
    const others = shuffle(rng, SA.filter((y) => y !== x)).slice(0, 2);
    return choose(
      base("p-remember", "pictorial", "remember", "synonym", rng),
      "Which word means the same (a synonym)?",
      card([x.w]),
      p(i, 6, { j: SA.indexOf(others[0]) }),
      x.syn,
      [{ text: x.ant, mistake: "vocab-synonym" }, ...others.map((o) => ({ text: o.syn, mistake: "vocab-synonym" }))]
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, x] = entry(rng, HOMONYM, g);
    return choose(
      base("p-understand", "pictorial", "understand", "a homonym in context", rng),
      `What does '${x.w}' mean in this sentence?`,
      card([markWord(x.s, x.w)]),
      p(i, 7),
      x.right,
      x.wrong.map((text) => ({ text, mistake: "vocab-homonym" }))
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, x] = entry(rng, HOMO, g);
    return choose(base("p-apply", "pictorial", "apply", "the right homophone", rng), "Which word fills the gap?", card([x.s]), p(i, 1), x.right, x.w.map((text) => ({ text, mistake: "vocab-homophone" })));
  },
  "pictorial|analyze": (rng, g) => {
    const [i, x] = entry(rng, AFFIX, g);
    const word = x.parts.map((pt, k) => (k === x.at ? `[[${pt}]]` : pt)).join("");
    return choose(
      base("p-analyze", "pictorial", "analyze", "what a prefix or suffix means", rng),
      `What does the highlighted ${x.kind} mean?`,
      card([word]),
      p(i, 2),
      x.means,
      x.wrong.map((text) => ({ text, mistake: "vocab-affix" }))
    );
  },
  "pictorial|evaluate": (rng, g) => {
    // Riya names a pair: synonyms, antonyms or homophones (and she may be wrong)
    const kinds = ["synonyms", "antonyms", "homophones"] as const;
    const truth = g && Number.isInteger(g.t) ? kinds[g.t] : pick(rng, kinds);
    let pair: [string, string];
    let i: number;
    if (truth === "homophones") {
      [i] = entry(rng, HOMO, g);
      pair = [HOMO[i].right, HOMO[i].w[0]];
    } else {
      [i] = entry(rng, SA, g);
      pair = [SA[i].w, truth === "synonyms" ? SA[i].syn : SA[i].ant];
    }
    const said = g && Number.isInteger(g.s) ? kinds[g.s] : pick(rng, kinds);
    const right = said === truth ? "Yes, she is right" : `No, they are ${truth}`;
    const opts = ["Yes, she is right", ...kinds.filter((k) => k !== said).map((k) => `No, they are ${k}`), "No, they are homonyms"];
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "name the pair", rng),
      `Riya says these two words are ${said}. Is she right?`,
      card([`${pair[0]}  ·  ${pair[1]}`]),
      { i, k: 8, t: kinds.indexOf(truth), s: kinds.indexOf(said) },
      right,
      opts.filter((o) => o !== right).map((text) => ({ text, mistake: truth === "homophones" || text.includes("homo") ? "vocab-terms" : "vocab-synonym" }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, d] = entry(rng, DEFS, g);
    return choose(base("a-remember", "abstract", "remember", "word-study terms", rng), d.q, null, p(i, 9), d.a, d.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, x] = entry(rng, SA, g);
    const other = pick(rng, SA.filter((y) => y !== x));
    return choose(
      base("a-understand", "abstract", "understand", "antonym", rng),
      `The opposite (antonym) of '${x.w}' is ___`,
      null,
      p(i, 6, { j: SA.indexOf(other) }),
      x.ant,
      [{ text: x.syn, mistake: "vocab-synonym" }, { text: other.ant, mistake: "vocab-synonym" }, { text: other.syn, mistake: "vocab-synonym" }]
    );
  },
  "abstract|apply": (rng, g) => {
    const [i, x] = entry(rng, NEG, g);
    return choose(base("a-apply", "abstract", "apply", "the negative prefix", rng), `Add a prefix to make the opposite of '${x.w}'.`, null, p(i, 10), x.right, x.wrong.map((text) => ({ text, mistake: "vocab-wrong-prefix" })));
  },
  "abstract|analyze": (rng, g) => {
    const [i, x] = entry(rng, LOAN, g);
    const others = shuffle(rng, LANGS.filter((l) => l !== x.from)).slice(0, 3);
    return choose(
      base("a-analyze", "abstract", "analyze", "loanwords", rng),
      `English borrowed the word '${x.w}' from which language?`,
      null,
      p(i, 11),
      x.from,
      others.map((text) => ({ text, mistake: "vocab-loanword" }))
    );
  },
  "abstract|evaluate": (rng, g) => {
    const [i, x] = entry(rng, CONF, g);
    const others = shuffle(rng, CONF.filter((y) => y !== x)).slice(0, 3);
    return choose(
      base("a-evaluate", "abstract", "evaluate", "which sentence is correct", rng),
      "Which sentence is correct?",
      null,
      p(i, 5, { j: CONF.indexOf(others[0]) }),
      corrected(x),
      others.map((o) => ({ text: o.wrong, mistake: "vocab-confused" }))
    );
  },
};

/** For the stress test. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  if (cell === "pictorial|apply" && right !== HOMO[it.params.i].right) return "homophone should be the bank's";
  if (cell === "abstract|apply" && right !== NEG[it.params.i].right) return "negative should be the bank's";
  if (cell === "abstract|evaluate" && CONF.some((c) => c.wrong === right)) return "a wrong sentence marked right";
  for (const c of CONF) if (!c.wrong.includes(c.bad)) return `"${c.bad}" not in "${c.wrong}"`;
  return null;
}
