import { Template, pick } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, markWord, shuffle, tapWords, tiles } from "./english.js";

/**
 * Idioms, Proverbs and Compound Words, Grade 8 English (English Rose
 * Reader 8, Scope and Sequence: ship and sailing idioms (The Inchcape
 * Rock), Shakespearean proverbs and idioms (Julius Caesar), compound words).
 *   concrete  tap the idiom; tap the compound words; build the idiom from
 *             tiles (its fixed words); tap the words that mean …; tap the
 *             wrong word in an idiom
 *   pictorial what the idiom means; what it means here; which idiom fits;
 *             what the proverb means; does Riya's idiom fit?
 *   abstract  the terms and sources; the meaning; fill the idiom; which is
 *             a compound word; which sentence uses the idiom well
 */

const TOPIC = "e8-idioms";
const base = baseFor("idm8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "idiom-literal": {
    label: "Takes an idiom literally",
    detail: "Reads 'in the same boat' as being in a real boat.",
    childTip: "An idiom means more than its words: 'in the same boat' = in the same difficult situation.",
  },
  "idiom-meaning": {
    label: "Picks the wrong meaning for an idiom",
    detail: "Mixes up what different idioms mean.",
    childTip: "Learn each idiom with a sentence: The test was plain sailing (easy).",
  },
  "idiom-wording": {
    label: "Changes the fixed words of an idiom",
    detail: "Writes 'rock the ship' or 'It's Latin to me'.",
    childTip: "Idioms have fixed words: rock the boat, it's Greek to me, all that glitters is not gold.",
  },
  "idiom-fit": {
    label: "Uses an idiom where it doesn't fit",
    detail: "Writes 'The test was plain sailing, so I failed'.",
    childTip: "Check the idiom's meaning fits the sentence: plain sailing (easy) goes with passing, not failing.",
  },
  "idiom-proverb": {
    label: "Misreads a proverb",
    detail: "Takes a proverb's words literally, or misses its lesson.",
    childTip: "A proverb gives a piece of advice or truth: All that glitters is not gold = things that look good may not be.",
  },
  "idiom-compound": {
    label: "Can't spot compound words",
    detail: "Misses words made of two words (lighthouse) or counts a word with a prefix as one.",
    childTip: "A compound word is two words joined: light + house, sun + set, snow + fall.",
  },
  "idiom-terms": {
    label: "Mixes up idiom, proverb and their sources",
    detail: "Unsure what an idiom or a proverb is, or where a famous one comes from.",
    childTip: "Idiom: a phrase with a special meaning (break the ice). Proverb: a short saying with advice (Brevity is the soul of wit).",
  },
};

interface Idiom {
  idiom: string;
  means: string;
  literal: string;
  /** a sentence using it well; a situation it fits; a sentence where it doesn't fit */
  sent: string;
  sit: string;
  misuse: string;
  /** the word to fill, and wrong words for it */
  key: string;
  keyWrong: [string, string, string];
}
const ID: Idiom[] = [
  { idiom: "all hands on deck", means: "everyone must help now", literal: "put your hands on the floor of a ship", sent: "The shop opens in ten minutes, so it's all hands on deck!", sit: "The guests arrive soon and nothing is ready, so everyone must help.", misuse: "It was all hands on deck, so we sat and rested.", key: "hands", keyWrong: ["feet", "men", "arms"] },
  { idiom: "in the same boat", means: "in the same difficult situation", literal: "sitting in one boat together", sent: "Nobody had finished the project; we were all in the same boat.", sit: "Every pupil in the class lost marks for the same hard question.", misuse: "Rohan won and I lost, so we were in the same boat.", key: "boat", keyWrong: ["ship", "car", "bus"] },
  { idiom: "rock the boat", means: "cause trouble when things are calm", literal: "shake a small boat from side to side", sent: "Everyone has agreed, so please don't rock the boat now.", sit: "The team has finally agreed on a plan, and someone wants to start a new argument.", misuse: "Grandmother rocked the boat by making us all tea.", key: "rock", keyWrong: ["shake", "sink", "row"] },
  { idiom: "plain sailing", means: "easy, with no problems", literal: "sailing on a flat sea", sent: "After the first chapter, the book was plain sailing.", sit: "The exam was so easy that Meera finished it in half the time.", misuse: "The test was plain sailing, so I couldn't answer anything.", key: "sailing", keyWrong: ["boating", "rowing", "swimming"] },
  { idiom: "learn the ropes", means: "learn how to do a new job", literal: "learn to tie knots in ropes", sent: "The new ranger spent a month learning the ropes.", sit: "Anu has just joined the school band and is learning how everything works.", misuse: "Pip learnt the ropes and forgot everything at once.", key: "ropes", keyWrong: ["knots", "strings", "rules"] },
  { idiom: "miss the boat", means: "miss a chance by being too slow", literal: "arrive after the boat has left", sent: "The tickets sold out in an hour; we missed the boat.", sit: "Rohan waited too long to sign up, and the trip was already full.", misuse: "Meera missed the boat and got the first prize.", key: "boat", keyWrong: ["bus", "ship", "train"] },
  { idiom: "on an even keel", means: "steady and calm", literal: "with the bottom of the ship level", sent: "After the storm of exams, life is back on an even keel.", sit: "After a busy, upsetting month, things at home are calm and steady again.", misuse: "The family was on an even keel, shouting all day.", key: "keel", keyWrong: ["deck", "sail", "floor"] },
  { idiom: "it's Greek to me", means: "I can't understand it at all", literal: "it is written in the Greek language", sent: "This old map is Greek to me.", sit: "Pip looked at the strange letters and had no idea what they said.", misuse: "It was Greek to me, so I explained it to everyone.", key: "Greek", keyWrong: ["Latin", "French", "Chinese"] },
  { idiom: "a dish fit for the gods", means: "something excellent", literal: "food served to gods", sent: "Grandmother's biryani was a dish fit for the gods.", sit: "The meal was so delicious that everyone asked for more.", misuse: "The burnt rice was a dish fit for the gods, so we threw it away.", key: "gods", keyWrong: ["kings", "guests", "giants"] },
  { idiom: "the green-eyed monster", means: "jealousy", literal: "an animal with green eyes", sent: "When his friend won, the green-eyed monster got hold of him.", sit: "Ravi felt bitter when his best friend got the prize he wanted.", misuse: "The green-eyed monster made him happy for his friend.", key: "green-eyed", keyWrong: ["red-eyed", "blue-eyed", "big-eyed"] },
  { idiom: "break the ice", means: "say or do something to make strangers relax and talk", literal: "crack ice with a hammer", sent: "The new teacher told a joke to break the ice.", sit: "On the first day of camp nobody was talking, so the leader started a funny game.", misuse: "He broke the ice by shouting at the new pupils.", key: "ice", keyWrong: ["glass", "silence", "snow"] },
  { idiom: "a wild-goose chase", means: "a hopeless search for something you won't find", literal: "running after wild geese", sent: "Looking for the lost ring on the beach was a wild-goose chase.", sit: "We searched every shop in town for a toy that wasn't made any more.", misuse: "It was a wild-goose chase: we found it in a minute.", key: "wild-goose", keyWrong: ["wild-duck", "wild-horse", "wild-cat"] },
  { idiom: "in a pickle", means: "in trouble or a difficult situation", literal: "inside a jar of pickle", sent: "I forgot my homework and the bag at school; now I'm in a pickle.", sit: "Della had only one dollar and eighty-seven cents the day before Christmas.", misuse: "I was in a pickle, so everything was going perfectly.", key: "pickle", keyWrong: ["jam", "pot", "jar"] },
  { idiom: "vanish into thin air", means: "disappear completely", literal: "turn into thin air", sent: "My pencil seems to have vanished into thin air.", sit: "The cat was on the wall a second ago, and now it is nowhere to be seen.", misuse: "The cake vanished into thin air, and it's still on the plate.", key: "thin", keyWrong: ["fresh", "cold", "open"] },
];

const PROVERB: { p: string; means: string; wrong: [string, string, string]; from?: string }[] = [
  { p: "All that glitters is not gold.", means: "Things that look good are not always good.", wrong: ["Only gold shines brightly.", "Gold is the best metal.", "Everything shiny is valuable."], from: "The Merchant of Venice" },
  { p: "Brevity is the soul of wit.", means: "Clever speech is short and to the point.", wrong: ["Long speeches are the cleverest.", "Funny people talk a lot.", "Short people are clever."], from: "Hamlet" },
  { p: "Neither a borrower nor a lender be.", means: "It is wise not to borrow or lend money.", wrong: ["Always lend to your friends.", "Borrowing is better than lending.", "Banks should not lend."], from: "Hamlet" },
  { p: "The course of true love never did run smooth.", means: "Real love always meets some troubles.", wrong: ["Love is like a smooth river.", "True love is always easy.", "Rivers are never smooth."], from: "A Midsummer Night's Dream" },
  { p: "A rolling stone gathers no moss.", means: "Someone who keeps moving on doesn't settle or build anything.", wrong: ["Stones roll down hills.", "Moss grows only on stones.", "Moving fast keeps you clean."] },
  { p: "Still waters run deep.", means: "Quiet people often think and feel deeply.", wrong: ["Calm water is dangerous.", "Rivers are deeper than lakes.", "Quiet people have no ideas."] },
];

const SOURCES: { q: string; a: string; w: [string, string, string] }[] = [
  { q: "'It's Greek to me' comes from which Shakespeare play in your reader?", a: "Julius Caesar", w: ["Hamlet", "Macbeth", "The Tempest"] },
  { q: "An idiom is ___", a: "a group of words whose meaning is different from the meanings of the separate words", w: ["a short saying that gives advice", "a word borrowed from another language", "a comparison using like or as"] },
  { q: "A proverb is ___", a: "a short, well-known saying that gives advice or a truth", w: ["a word with two meanings", "a group of words with a special meaning, like 'break the ice'", "a word made of two words"] },
  { q: "'Learn the ropes' and 'plain sailing' come from the world of ___", a: "ships and sailing", w: ["farming", "cooking", "sport"] },
];

/** Compound words in a sentence. */
const COMP: { s: string; words: string[] }[] = [
  { s: "The lighthouse keeper saw a sailboat at sunset.", words: ["lighthouse", "sailboat", "sunset."] },
  { s: "Grandmother sat by the fireplace with her notebook.", words: ["Grandmother", "fireplace", "notebook."] },
  { s: "A heavy snowfall covered the playground.", words: ["snowfall", "playground."] },
  { s: "The sunflower grew taller than the doorway.", words: ["sunflower", "doorway."] },
  { s: "My classmate found a seashell on the beach.", words: ["classmate", "seashell"] },
  { s: "The postman left a parcel by the gateway.", words: ["postman", "gateway."] },
  { s: "Pip ran through the farmyard at daybreak.", words: ["farmyard", "daybreak."] },
  { s: "We carried our toothbrushes in a backpack.", words: ["toothbrushes", "backpack."] },
];
const COMP_PICK: { right: string; wrong: [string, string, string] }[] = [
  { right: "lighthouse", wrong: ["unhappy", "quickly", "beautiful"] },
  { right: "rainbow", wrong: ["rewrite", "careless", "kindness"] },
  { right: "footprint", wrong: ["disagree", "teacher", "hopeful"] },
  { right: "waterfall", wrong: ["impossible", "running", "agreement"] },
  { right: "sunshine", wrong: ["sunny", "shining", "unkind"] },
  { right: "bedroom", wrong: ["bedding", "roomy", "misread"] },
];

const p = (i: number, k: number, extra: Record<string, number> = {}) => ({ i, k, ...extra });
const idiomInSentence = (x: Idiom) => {
  // the idiom as it appears in the sentence (allowing "learning" for "learn", "missed" for "miss", "It's"/"is" forms)
  const forms: Record<string, string> = {
    "learn the ropes": "learning the ropes",
    "miss the boat": "missed the boat",
    "it's Greek to me": "Greek to me",
    "vanish into thin air": "vanished into thin air",
    "rock the boat": "rock the boat",
  };
  return forms[x.idiom] ?? x.idiom;
};

export const IDIOMS_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    return doIt(base("c-remember", "concrete", "remember", "find the idiom", rng), "Tap every word of the idiom in this sentence.", p(i, 1), tapWords(x.sent, idiomInSentence(x)));
  },
  "concrete|understand": (rng, g) => {
    const [i, x] = entry(rng, COMP, g);
    return doIt(base("c-understand", "concrete", "understand", "compound words", rng), "Tap every compound word (a word made of two words).", p(i, 2), tapWords(x.s, x.words));
  },
  "concrete|apply": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    const parts = x.idiom.split(" ");
    const k = parts.findIndex((w) => w === x.key);
    const wrongIdiom = parts.map((w, j) => (j === k ? x.keyWrong[0] : w)).join(" ");
    return doIt(
      base("c-apply", "concrete", "apply", "build the idiom", rng),
      `Build the idiom that means '${x.means}'. (Not every tile is needed.)`,
      p(i, 1),
      tiles(rng, parts.join(" | "), [x.keyWrong[0]], [{ text: wrongIdiom, mistake: "idiom-wording" }])
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    return doIt(base("c-analyze", "concrete", "analyze", "words that mean …", rng), `Tap the words in this sentence that mean '${x.means}'.`, p(i, 1), tapWords(x.sent, idiomInSentence(x)));
  },
  "concrete|evaluate": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    const s = x.sent.replace(new RegExp(`\\b${x.key}\\b`), x.keyWrong[0]);
    return doIt(base("c-evaluate", "concrete", "evaluate", "the wrong word in an idiom", rng), "One word of the idiom in this sentence is wrong. Tap it.", p(i, 1), tapWords(s, x.keyWrong[0]));
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    const others = shuffle(rng, ID.filter((y) => y !== x)).slice(0, 2);
    return choose(
      base("p-remember", "pictorial", "remember", "what the idiom means", rng),
      "What does this idiom mean?",
      card([x.idiom]),
      p(i, 1, { j: ID.indexOf(others[0]) }),
      x.means,
      [{ text: x.literal, mistake: "idiom-literal" }, ...others.map((o) => ({ text: o.means, mistake: "idiom-meaning" }))]
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    const other = pick(rng, ID.filter((y) => y !== x));
    return choose(
      base("p-understand", "pictorial", "understand", "the idiom in a sentence", rng),
      "What does the highlighted idiom mean here?",
      card([markWord(x.sent, idiomInSentence(x))]),
      p(i, 1, { j: ID.indexOf(other) }),
      x.means,
      [
        { text: x.literal, mistake: "idiom-literal" },
        { text: other.means, mistake: "idiom-meaning" },
        { text: "Nothing special: read the words as they are", mistake: "idiom-literal" },
      ]
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    const others = shuffle(rng, ID.filter((y) => y !== x)).slice(0, 3);
    return choose(
      base("p-apply", "pictorial", "apply", "the idiom that fits", rng),
      "Which idiom fits this situation?",
      card([x.sit]),
      p(i, 1, { j: ID.indexOf(others[0]) }),
      x.idiom,
      others.map((o) => ({ text: o.idiom, mistake: "idiom-fit" }))
    );
  },
  "pictorial|analyze": (rng, g) => {
    const [i, x] = entry(rng, PROVERB, g);
    return choose(base("p-analyze", "pictorial", "analyze", "what the proverb means", rng), "What does this proverb mean?", card([x.p]), p(i, 3), x.means, x.wrong.map((text) => ({ text, mistake: "idiom-proverb" })));
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    const fits = g && Number.isInteger(g.v) ? g.v === 1 : rng() < 0.5;
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "does the idiom fit?", rng),
      "Riya used an idiom in this sentence. Does it fit?",
      card([`Riya: ${fits ? x.sent : x.misuse}`]),
      p(i, 1, { v: fits ? 1 : 0 }),
      fits ? "Yes: the meaning fits the sentence" : `No: '${x.idiom}' means ${x.means}`,
      [
        { text: fits ? `No: '${x.idiom}' means ${x.literal}` : "Yes: the meaning fits the sentence", mistake: fits ? "idiom-literal" : "idiom-fit" },
        { text: "No: idioms can't be used in sentences", mistake: "idiom-terms" },
        { text: fits ? "No: the words of the idiom are wrong" : `No: '${x.idiom}' means ${x.literal}`, mistake: fits ? "idiom-wording" : "idiom-literal" },
      ]
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, x] = entry(rng, SOURCES, g);
    return choose(base("a-remember", "abstract", "remember", "idioms and proverbs", rng), x.q, null, p(i, 4), x.a, x.w.map((text) => ({ text, mistake: "idiom-terms" })));
  },
  "abstract|understand": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    const others = shuffle(rng, ID.filter((y) => y !== x)).slice(0, 2);
    return choose(
      base("a-understand", "abstract", "understand", "what the idiom means", rng),
      `'${x.idiom}' means ___`,
      null,
      p(i, 1, { j: ID.indexOf(others[0]) }),
      x.means,
      [{ text: x.literal, mistake: "idiom-literal" }, ...others.map((o) => ({ text: o.means, mistake: "idiom-meaning" }))]
    );
  },
  "abstract|apply": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    const gap = x.sent.replace(new RegExp(`\\b${x.key}\\b`), "___");
    return choose(base("a-apply", "abstract", "apply", "complete the idiom", rng), `Complete the idiom: ${gap}`, null, p(i, 1), x.key, x.keyWrong.map((text) => ({ text, mistake: "idiom-wording" })));
  },
  "abstract|analyze": (rng, g) => {
    const [i, x] = entry(rng, COMP_PICK, g);
    return choose(base("a-analyze", "abstract", "analyze", "which is a compound word", rng), "Which is a compound word (two words joined)?", null, p(i, 5), x.right, x.wrong.map((text) => ({ text, mistake: "idiom-compound" })));
  },
  "abstract|evaluate": (rng, g) => {
    const [i, x] = entry(rng, ID, g);
    const others = shuffle(rng, ID.filter((y) => y !== x)).slice(0, 3);
    return choose(
      base("a-evaluate", "abstract", "evaluate", "which uses the idiom well", rng),
      "Which sentence uses its idiom correctly?",
      null,
      p(i, 1, { j: ID.indexOf(others[0]) }),
      x.sent,
      others.map((o) => ({ text: o.misuse, mistake: "idiom-fit" }))
    );
  },
};

/** For the stress test. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  if (cell === "abstract|apply" && right !== ID[it.params.i].key) return "key word should be the bank's";
  for (const x of ID) if (!new RegExp(`\\b${x.key}\\b`).test(x.sent)) return `key "${x.key}" not in "${x.sent}"`;
  return null;
}
