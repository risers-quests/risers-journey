import { Template } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, shuffle, tapWords, tiles, words } from "./english.js";

/**
 * Spelling and Pronunciation, Grade 8 English (English Rose Reader 8, Scope
 * and Sequence: -ie/ei, sc/ss/cc, double consonants, -tion/-sion,
 * -ence/-ance, dis-, British and American spellings; stressed syllables,
 * syllabification and word stress, past tense endings, the schwa).
 *   concrete  tap the misspelt word; tap the stressed syllable; build a word
 *             that doubles its consonant; tap the -ed words that add a
 *             syllable; tap the American spelling
 *   pictorial ie or ei; -tion / -sion; -ance / -ence; how many syllables;
 *             which of Riya's words is wrong
 *   abstract  the rules; the British spelling; which is spelt right; how
 *             -ed sounds; dis- + the word
 */

const TOPIC = "e8-spelling";
const base = baseFor("spl8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "spell-ie-ei": {
    label: "Mixes up ie and ei",
    detail: "Writes recieve, beleive, cieling.",
    childTip: "i before e (believe, field) except after c (receive, ceiling), and when it sounds like 'ay' (neighbour, weigh).",
  },
  "spell-double": {
    label: "Doesn't double (or wrongly doubles) the last consonant",
    detail: "Writes runing, begining, stoped, or hopping for hoping.",
    childTip: "One short vowel + one consonant, stressed: double it before -ing / -ed / -er (run → running, begin → beginning, stop → stopped).",
  },
  "spell-ending": {
    label: "Picks the wrong ending",
    detail: "Mixes up -tion / -sion / -ssion, or -ance / -ence.",
    childTip: "Learn the families: celebrate → celebration; explode → explosion; permit → permission; differ → difference; appear → appearance.",
  },
  "spell-american": {
    label: "Uses the American spelling",
    detail: "Writes color, favorite, center, practice (verb) where the book uses British spelling.",
    childTip: "Our books use British spelling: colour, favourite, centre, travelled, practise (verb).",
  },
  "spell-stress": {
    label: "Puts the stress on the wrong syllable",
    detail: "Stresses the wrong part of a word (cel-E-bration instead of cele-BRA-tion).",
    childTip: "Say the word slowly and clap: the stressed syllable is the loudest, longest one (MAS-ter-piece, cel-e-BRA-tion).",
  },
  "spell-syllables": {
    label: "Miscounts syllables",
    detail: "Counts letters or vowels instead of beats.",
    childTip: "One beat = one syllable. Clap it: cel-e-bra-tion = 4.",
  },
  "spell-ed-sound": {
    label: "Says the -ed ending the wrong way",
    detail: "Adds an extra 'id' to walked, or doesn't to wanted.",
    childTip: "-ed sounds 'id' (an extra syllable) only after t or d: wanted, needed. After p, k, s, sh, ch, f it sounds 't' (walked). Otherwise 'd' (played).",
  },
  "spell-prefix": {
    label: "Changes the word when adding a prefix",
    detail: "Writes dissappear (adds an s) or disatisfied (drops one).",
    childTip: "A prefix doesn't change the word: dis + appear = disappear; dis + satisfied = dissatisfied.",
  },
  "spell-letters": {
    label: "Misspells a tricky word",
    detail: "Misses double letters or silent letters (neccessary, seperate, sissors).",
    childTip: "Learn tricky words in parts: ne-c-e-ss-ary, sep-a-rate, sc-issors, a-cc-o-mm-odation.",
  },
};

/** One word spelt wrong in a sentence. */
const MISSPELT: { s: string; w: string; right: string; mistake: string }[] = [
  { s: "Della recieved a letter from her sister.", w: "recieved", right: "received", mistake: "spell-ie-ei" },
  { s: "The children were runing to the gate.", w: "runing", right: "running", mistake: "spell-double" },
  { s: "It is neccessary to carry water on a trek.", w: "neccessary", right: "necessary", mistake: "spell-letters" },
  { s: "Please keep the two piles seperate.", w: "seperate", right: "separate", mistake: "spell-letters" },
  { s: "Jim could not beleive his eyes.", w: "beleive", right: "believe", mistake: "spell-ie-ei" },
  { s: "The bus stoped at the old temple.", w: "stoped", right: "stopped", mistake: "spell-double" },
  { s: "The rangers will dissappear into the forest.", w: "dissappear", right: "disappear", mistake: "spell-prefix" },
  { s: "Cut the paper with these sissors.", w: "sissors", right: "scissors", mistake: "spell-letters" },
  { s: "The cieling of the hall was painted blue.", w: "cieling", right: "ceiling", mistake: "spell-ie-ei" },
  { s: "This is only the begining of the story.", w: "begining", right: "beginning", mistake: "spell-double" },
  { s: "My freind lives near the river.", w: "freind", right: "friend", mistake: "spell-ie-ei" },
  { s: "We will meet again tommorow.", w: "tommorow", right: "tomorrow", mistake: "spell-letters" },
];

/** Syllables of a word, and which one is stressed (as in the book's word-stress lists). */
const STRESS: { syl: string[]; at: number }[] = [
  { syl: ["for", "ger", "y"], at: 0 },
  { syl: ["mas", "ter", "piece"], at: 0 },
  { syl: ["type", "wri", "ter"], at: 0 },
  { syl: ["cel", "e", "bra", "tion"], at: 2 },
  { syl: ["crim", "son"], at: 0 },
  { syl: ["vi", "o", "let"], at: 0 },
  { syl: ["pos", "tal"], at: 0 },
  { syl: ["il", "lus", "tra", "tion"], at: 2 },
  { syl: ["pho", "to", "graph"], at: 0 },
  { syl: ["pho", "tog", "ra", "pher"], at: 1 },
  { syl: ["ex", "pec", "ta", "tions"], at: 2 },
  { syl: ["in", "di", "an"], at: 0 },
  { syl: ["com", "pu", "ter"], at: 1 },
  { syl: ["ba", "na", "na"], at: 1 },
  { syl: ["ho", "tel"], at: 1 },
  { syl: ["un", "der", "stand"], at: 2 },
];
const stressed = (x: (typeof STRESS)[number]) => x.syl.map((s, k) => (k === x.at ? s.toUpperCase() : s)).join("-");

/** Doubling the consonant: syllable tiles, and the spare that makes the common mistake. */
const DOUBLE: { word: string; parts: string[]; spare: string; wrong: string }[] = [
  { word: "running", parts: ["run", "ning"], spare: "ing", wrong: "runing" },
  { word: "swimming", parts: ["swim", "ming"], spare: "ing", wrong: "swiming" },
  { word: "stopped", parts: ["stop", "ped"], spare: "ed", wrong: "stoped" },
  { word: "planning", parts: ["plan", "ning"], spare: "ing", wrong: "planing" },
  { word: "bigger", parts: ["big", "ger"], spare: "er", wrong: "biger" },
  { word: "admitted", parts: ["ad", "mit", "ted"], spare: "ed", wrong: "admited" },
  { word: "forgotten", parts: ["for", "got", "ten"], spare: "en", wrong: "forgoten" },
  { word: "beginning", parts: ["be", "gin", "ning"], spare: "ing", wrong: "begining" },
  { word: "travelled", parts: ["trav", "el", "led"], spare: "ed", wrong: "traveled" },
  { word: "shopping", parts: ["shop", "ping"], spare: "ing", wrong: "shoping" },
];
const MEANING: Record<string, string> = {
  running: "run + ing",
  swimming: "swim + ing",
  stopped: "stop + ed",
  planning: "plan + ing",
  bigger: "big + er",
  admitted: "admit + ed",
  forgotten: "forget, the past participle",
  beginning: "begin + ing",
  travelled: "travel + ed (British spelling)",
  shopping: "shop + ing",
};

/** -ed words in a sentence; `id` are the ones where -ed is an extra syllable. */
const ED: { s: string; id: string[]; t: string[]; d: string[] }[] = [
  { s: "She wanted to go, so she waited and walked to the gate.", id: ["wanted", "waited"], t: ["walked"], d: [] },
  { s: "Jim needed money, so he sold the watch he loved.", id: ["needed"], t: [], d: ["loved"] },
  { s: "The children played, laughed and shouted in the snow.", id: ["shouted"], t: ["laughed"], d: ["played"] },
  { s: "Pip jumped, landed and hurried home.", id: ["landed"], t: ["jumped"], d: ["hurried"] },
  { s: "The rangers counted the tigers and recorded the numbers.", id: ["counted", "recorded"], t: [], d: [] },
  { s: "Della brushed her hair and painted her lips.", id: ["painted"], t: ["brushed"], d: [] },
  { s: "We visited the fort and climbed the tower.", id: ["visited"], t: [], d: ["climbed"] },
  { s: "The bell rang and the sailors started rowing.", id: ["started"], t: [], d: [] },
];

/** British and American spellings in a sentence. */
const AM: { s: string; w: string; uk: string; alt: [string, string] }[] = [
  { s: "My favorite colour is green.", w: "favorite", uk: "favourite", alt: ["favourit", "favorrite"] },
  { s: "Meet me at the center of the town square.", w: "center", uk: "centre", alt: ["centr", "sentre"] },
  { s: "The rangers traveled through the forest.", w: "traveled", uk: "travelled", alt: ["travvelled", "travelld"] },
  { s: "Gogol's neighbor gave him a gift.", w: "neighbor", uk: "neighbour", alt: ["nieghbour", "neighbur"] },
  { s: "The soldiers fought for the honor of their country.", w: "honor", uk: "honour", alt: ["honur", "onour"] },
  { s: "We went to the theater to see the play.", w: "theater", uk: "theatre", alt: ["theatr", "theetre"] },
  { s: "The color of the sky was grey.", w: "color", uk: "colour", alt: ["coloure", "collour"] },
  { s: "Please organize the books on the shelf.", w: "organize", uk: "organise", alt: ["orgnise", "organice"] },
];

const IE: { gap: string; right: "ie" | "ei"; word: string }[] = [
  { gap: "rec__ve", right: "ei", word: "receive" },
  { gap: "bel__ve", right: "ie", word: "believe" },
  { gap: "c__ling", right: "ei", word: "ceiling" },
  { gap: "f__ld", right: "ie", word: "field" },
  { gap: "dec__ve", right: "ei", word: "deceive" },
  { gap: "p__ce", right: "ie", word: "piece" },
  { gap: "n__ghbour", right: "ei", word: "neighbour" },
  { gap: "fr__nd", right: "ie", word: "friend" },
  { gap: "w__gh", right: "ei", word: "weigh" },
  { gap: "ch__f", right: "ie", word: "chief" },
  { gap: "rec__pt", right: "ei", word: "receipt" },
  { gap: "sh__ld", right: "ie", word: "shield" },
];

const ENDING: { gap: string; right: string; options: string[] }[] = [
  { gap: "televi___", right: "sion", options: ["tion", "ssion", "cian"] },
  { gap: "informa___", right: "tion", options: ["sion", "ssion", "cian"] },
  { gap: "explo___", right: "sion", options: ["tion", "ssion", "cian"] },
  { gap: "celebra___", right: "tion", options: ["sion", "ssion", "cian"] },
  { gap: "permi___", right: "ssion", options: ["tion", "sion", "cian"] },
  { gap: "musi___", right: "cian", options: ["tion", "sion", "ssion"] },
  { gap: "import___", right: "ance", options: ["ence", "ense", "ants"] },
  { gap: "differ___", right: "ence", options: ["ance", "ense", "ents"] },
  { gap: "independ___", right: "ence", options: ["ance", "ense", "ants"] },
  { gap: "appear___", right: "ance", options: ["ence", "ense", "ants"] },
  { gap: "experi___", right: "ence", options: ["ance", "ense", "ents"] },
  { gap: "dist___", right: "ance", options: ["ence", "ense", "ants"] },
];

/** Riya's three words; `bad` = the misspelt one, or -1 when all are right. */
const LISTS: { words: string[]; bad: number }[] = [
  { words: ["necessary", "embarass", "tomorrow"], bad: 1 },
  { words: ["scissors", "discipline", "descend"], bad: -1 },
  { words: ["accommodation", "occasion", "succes"], bad: 2 },
  { words: ["definately", "government", "separate"], bad: 0 },
  { words: ["disappear", "dissatisfied", "recieve"], bad: 2 },
  { words: ["conscience", "neighbour", "beginning"], bad: -1 },
  { words: ["occurrence", "wierd", "believe"], bad: 1 },
  { words: ["travelled", "colour", "favorite"], bad: 2 },
];

const TRICKY: { right: string; wrong: [string, string, string] }[] = [
  { right: "necessary", wrong: ["neccessary", "necesary", "neccesary"] },
  { right: "separate", wrong: ["seperate", "separete", "seprate"] },
  { right: "embarrass", wrong: ["embarass", "embaras", "emberrass"] },
  { right: "accommodation", wrong: ["accomodation", "acommodation", "accommadation"] },
  { right: "definitely", wrong: ["definately", "definitly", "defenitely"] },
  { right: "government", wrong: ["goverment", "govermant", "governmint"] },
  { right: "disappoint", wrong: ["dissapoint", "disapoint", "dissappoint"] },
  { right: "scissors", wrong: ["sissors", "scisors", "sciccors"] },
  { right: "success", wrong: ["succes", "sucess", "succsess"] },
  { right: "discipline", wrong: ["disipline", "discipilne", "dicipline"] },
];

const EDSOUND: { w: string; right: "t" | "d" | "id" }[] = [
  { w: "laughed", right: "t" },
  { w: "walked", right: "t" },
  { w: "washed", right: "t" },
  { w: "jumped", right: "t" },
  { w: "played", right: "d" },
  { w: "loved", right: "d" },
  { w: "climbed", right: "d" },
  { w: "wanted", right: "id" },
  { w: "needed", right: "id" },
  { w: "counted", right: "id" },
  { w: "painted", right: "id" },
  { w: "cleaned", right: "d" },
];
const ED_NAME = { t: "/t/, as in 'walked'", d: "/d/, as in 'played'", id: "/ɪd/, an extra syllable, as in 'wanted'" } as const;

const DIS: { right: string; wrong: [string, string, string] }[] = [
  { right: "disappear", wrong: ["dissappear", "disapear", "dissapear"] },
  { right: "dissatisfied", wrong: ["disatisfied", "dissatisfyed", "disssatisfied"] },
  { right: "disagree", wrong: ["dissagree", "disaggree", "dissagre"] },
  { right: "dissimilar", wrong: ["disimilar", "dissimiler", "disimiler"] },
  { right: "disobey", wrong: ["dissobey", "disobay", "dissobay"] },
  { right: "disservice", wrong: ["diservice", "dissirvice", "disirvice"] },
  { right: "dishonest", wrong: ["disshonest", "dishonnest", "dishonist"] },
];

const RULES: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  { q: "'i before e, except after ___'", a: "c (receive, ceiling)", w: [{ text: "s (seize)", mistake: "spell-ie-ei" }, { text: "f (friend)", mistake: "spell-ie-ei" }, { text: "any consonant", mistake: "spell-ie-ei" }] },
  { q: "We double the last consonant before -ing when the word ___", a: "ends in one short vowel + one consonant, stressed at the end (run, begin)", w: [{ text: "ends in two consonants (jump)", mistake: "spell-double" }, { text: "ends in a silent e (hope)", mistake: "spell-double" }, { text: "has more than three letters", mistake: "spell-double" }] },
  { q: "The schwa is ___", a: "the weak 'uh' sound in an unstressed syllable (the a in 'about')", w: [{ text: "a silent letter", mistake: "spell-letters" }, { text: "the stressed syllable", mistake: "spell-stress" }, { text: "a long 'ee' sound", mistake: "spell-stress" }] },
  { q: "A syllable is ___", a: "one beat of a word, with one vowel sound", w: [{ text: "one letter", mistake: "spell-syllables" }, { text: "one vowel letter", mistake: "spell-syllables" }, { text: "a word with a prefix", mistake: "spell-syllables" }] },
  { q: "Our English books use ___ spelling", a: "British (colour, centre, travelled)", w: [{ text: "American (color, center, traveled)", mistake: "spell-american" }, { text: "any spelling, as long as it sounds right", mistake: "spell-american" }, { text: "the shortest spelling", mistake: "spell-american" }] },
];

const p = (i: number, k: number, extra: Record<string, number> = {}) => ({ i, k, ...extra });

export const SPELLING_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, x] = entry(rng, MISSPELT, g);
    return doIt(base("c-remember", "concrete", "remember", "spot the misspelt word", rng), "One word is spelt wrong. Tap it.", p(i, 1), tapWords(x.s, x.w));
  },
  "concrete|understand": (rng, g) => {
    const [i, x] = entry(rng, STRESS, g);
    return doIt(
      base("c-understand", "concrete", "understand", "the stressed syllable", rng),
      `Say '${x.syl.join("")}' aloud. Tap the syllable you say loudest (the stressed one).`,
      p(i, 2),
      { kind: "words", tokens: x.syl, target: [x.at], wrongSets: x.syl.map((_, k) => k).filter((k) => k !== x.at).map((k) => ({ cells: [k], mistake: "spell-stress" })) }
    );
  },
  "concrete|apply": (rng, g) => {
    const [i, x] = entry(rng, DOUBLE, g);
    const t = tiles(rng, x.parts.join(" | "), [x.spare], [{ text: x.parts.slice(0, -1).join(" ") + " " + x.spare, mistake: "spell-double" }]);
    return doIt(base("c-apply", "concrete", "apply", "doubling the consonant", rng), `Build the word: ${MEANING[x.word]}. (Not every tile is needed.)`, p(i, 3), { ...t, glue: true });
  },
  "concrete|analyze": (rng, g) => {
    const [i, x] = entry(rng, ED, g);
    return doIt(
      base("c-analyze", "concrete", "analyze", "-ed as an extra syllable", rng),
      "Say the -ed words aloud. Tap the ones where -ed adds a whole extra syllable ('id', as in 'wanted').",
      p(i, 4),
      tapWords(x.s, x.id, [...x.t, ...x.d].map((w) => ({ phrase: [...x.id, w], mistake: "spell-ed-sound" })))
    );
  },
  "concrete|evaluate": (rng, g) => {
    const [i, x] = entry(rng, AM, g);
    return doIt(base("c-evaluate", "concrete", "evaluate", "British spelling", rng), "Our books use British spelling. Tap the word spelt the American way.", p(i, 5), tapWords(x.s, x.w));
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, x] = entry(rng, IE, g);
    return choose(
      base("p-remember", "pictorial", "remember", "ie or ei", rng),
      "Which letters fill the gap?",
      card([x.gap]),
      p(i, 6),
      x.right,
      [
        { text: x.right === "ie" ? "ei" : "ie", mistake: "spell-ie-ei" },
        { text: "ee", mistake: "spell-ie-ei" },
        { text: "ea", mistake: "spell-ie-ei" },
      ]
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, x] = entry(rng, ENDING, g);
    return choose(base("p-understand", "pictorial", "understand", "word endings", rng), "Which ending completes the word?", card([x.gap]), p(i, 7), x.right, x.options.map((text) => ({ text, mistake: "spell-ending" })));
  },
  "pictorial|apply": (rng, g) => {
    const [i, x] = entry(rng, STRESS, g);
    const n = x.syl.length;
    return choose(
      base("p-apply", "pictorial", "apply", "count the syllables", rng),
      "How many syllables (beats) does this word have?",
      card([x.syl.join("")]),
      p(i, 2),
      String(n),
      [n - 1, n + 1, n + 2].map((v) => ({ text: String(v), mistake: "spell-syllables" }))
    );
  },
  "pictorial|analyze": (rng, g) => {
    const [i, x] = entry(rng, STRESS, g);
    const right = stressed(x);
    const others = x.syl.map((_, k) => k).filter((k) => k !== x.at).map((k) => x.syl.map((s, j) => (j === k ? s.toUpperCase() : s)).join("-"));
    while (others.length < 3) others.push(x.syl.map((s) => s.toUpperCase()).join("-"));
    return choose(
      base("p-analyze", "pictorial", "analyze", "word stress", rng),
      "Which shows the stressed syllable in capitals correctly?",
      card([x.syl.join("")]),
      p(i, 2),
      right,
      [...new Set(others)].slice(0, 3).map((text) => ({ text, mistake: "spell-stress" })).concat([{ text: x.syl.join("-"), mistake: "spell-stress" }])
    );
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, x] = entry(rng, LISTS, g);
    const right = x.bad < 0 ? "None: all three are right" : x.words[x.bad];
    const opts = [...x.words.filter((_, k) => k !== x.bad), ...(x.bad < 0 ? [] : ["None: all three are right"])];
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "check Riya's spellings", rng),
      "Riya wrote these three words. Which one, if any, is spelt wrong?",
      card([x.words.join("   ·   ")], "Riya's words"),
      p(i, 8),
      right,
      opts.map((text) => ({ text, mistake: "spell-letters" }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, r] = entry(rng, RULES, g);
    return choose(base("a-remember", "abstract", "remember", "the rules", rng), r.q, null, p(i, 9), r.a, r.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, x] = entry(rng, AM, g);
    return choose(
      base("a-understand", "abstract", "understand", "British spelling", rng),
      `The British spelling of '${x.w}' is ___`,
      null,
      p(i, 5),
      x.uk,
      [{ text: x.w, mistake: "spell-american" }, ...x.alt.map((text) => ({ text, mistake: "spell-letters" }))]
    );
  },
  "abstract|apply": (rng, g) => {
    const [i, x] = entry(rng, TRICKY, g);
    return choose(base("a-apply", "abstract", "apply", "tricky words", rng), "Which is spelt correctly?", null, p(i, 10), x.right, x.wrong.map((text) => ({ text, mistake: "spell-letters" })));
  },
  "abstract|analyze": (rng, g) => {
    const [i, x] = entry(rng, EDSOUND, g);
    return choose(
      base("a-analyze", "abstract", "analyze", "how -ed sounds", rng),
      `How does the -ed in '${x.w}' sound?`,
      null,
      p(i, 11),
      ED_NAME[x.right],
      [...(Object.keys(ED_NAME) as ("t" | "d" | "id")[]).filter((k) => k !== x.right).map((k) => ({ text: ED_NAME[k], mistake: "spell-ed-sound" })), { text: "It is silent", mistake: "spell-ed-sound" }]
    );
  },
  "abstract|evaluate": (rng, g) => {
    const [i, x] = entry(rng, DIS, g);
    return choose(base("a-evaluate", "abstract", "evaluate", "dis- + the word", rng), "Which is spelt correctly?", null, p(i, 12), x.right, x.wrong.map((text) => ({ text, mistake: "spell-prefix" })));
  },
};

/** For the stress test. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  if (cell === "pictorial|remember" && !IE[it.params.i].word.includes(right)) return "ie/ei answer doesn't spell the word";
  if (cell === "pictorial|understand" && !ENDING[it.params.i].gap.includes("___")) return "no gap";
  if (cell === "abstract|understand" && right !== AM[it.params.i].uk) return "British spelling should be the bank's";
  for (const x of ED) for (const w of [...x.id, ...x.t, ...x.d]) if (!words(x.s).some((t) => t.replace(/[,.]/g, "") === w)) return `${w} not in ${x.s}`;
  return null;
}
