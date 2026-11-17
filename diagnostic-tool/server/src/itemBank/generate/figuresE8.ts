import { Template, pick } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, entryIn, shuffle, tapWords, tiles } from "./english.js";

/**
 * Figures of Speech ("Appreciating the poem"), Grade 8 English (English Rose
 * Reader 8, Scope and Sequence: alliteration, irony, imagery, simile and
 * metaphor, synecdoche, repetition, symbolism).
 * Quoted lines are public domain only (Southey, Shelley, Coleridge,
 * O. Henry); the rest are our own examples.
 *   concrete  tap the word that makes it a simile; tap the alliterating
 *             words; build a simile (as … as, not as … like); tap the human
 *             action given to a thing; tap the exaggeration
 *   pictorial which figure of speech; what two things are compared; what a
 *             metaphor really means; why it's ironic; is Riya right?
 *   abstract  the terms; simile or metaphor; turn a simile into a metaphor;
 *             what a synecdoche stands for; which line has personification
 */

const TOPIC = "e8-figures";
const base = baseFor("fig8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "fig-simile-metaphor": {
    label: "Mixes up simile and metaphor",
    detail: "Calls 'eyes like hot coals' a metaphor, or 'the classroom was a zoo' a simile.",
    childTip: "Simile: compares using like or as (eyes like coals). Metaphor: says one thing IS another (the classroom was a zoo).",
  },
  "fig-kind": {
    label: "Can't name the figure of speech",
    detail: "Mixes up personification, alliteration, onomatopoeia, hyperbole and the rest.",
    childTip: "Personification: a thing acts like a person. Alliteration: words start with the same sound. Onomatopoeia: the word is the sound. Hyperbole: a huge exaggeration.",
  },
  "fig-literal": {
    label: "Takes a figure of speech literally",
    detail: "Reads 'the classroom was a zoo' as a real zoo, or 'a million times' as an exact count.",
    childTip: "Ask what the writer really means: a noisy, wild classroom; very many times.",
  },
  "fig-compared": {
    label: "Can't find what is being compared",
    detail: "Picks the wrong two things in a simile or metaphor.",
    childTip: "Find the real thing and what it is said to be like: her eyes (real) ↔ hot coals (the picture).",
  },
  "fig-as-like": {
    label: "Mixes 'as … as' with 'like'",
    detail: "Writes as bright like the sun.",
    childTip: "Either as bright as the sun, or bright like the sun. Never as … like.",
  },
  "fig-irony": {
    label: "Misses the irony",
    detail: "Doesn't see that what happens is the opposite of what was expected or meant.",
    childTip: "Irony: the opposite of what you'd expect. Della sells her hair for a watch chain; Jim sells his watch for her combs.",
  },
  "fig-synecdoche": {
    label: "Misreads a part standing for the whole",
    detail: "Takes 'all hands on deck' to mean only hands.",
    childTip: "Synecdoche: a part stands for the whole. Hands = sailors; wheels = a car; heads of cattle = cows.",
  },
  "fig-terms": {
    label: "Mixes up the terms",
    detail: "Unsure what simile, metaphor, personification and the rest mean.",
    childTip: "Learn one example for each: like hot coals (simile), a zoo (metaphor), the wind whispered (personification), Sir Ralph the Rover (alliteration).",
  },
};

type Kind = "simile" | "metaphor" | "personification" | "alliteration" | "onomatopoeia" | "hyperbole" | "repetition" | "synecdoche";
const KIND_NAME: Record<Kind, string> = {
  simile: "Simile",
  metaphor: "Metaphor",
  personification: "Personification",
  alliteration: "Alliteration",
  onomatopoeia: "Onomatopoeia",
  hyperbole: "Hyperbole",
  repetition: "Repetition",
  synecdoche: "Synecdoche",
};
/** Lines; key = the word(s) that make the figure; a / b = the two things compared; means = what it really says. */
const FIG: { s: string; kind: Kind; key: string[]; a?: string; b?: string; means?: string; literal?: string; who?: string }[] = [
  { s: "The convict's eyes glowed like hot coals.", kind: "simile", key: ["like"], a: "the convict's eyes", b: "hot coals" },
  { s: "Della's hair fell about her, rippling and shining like a cascade of brown waters.", kind: "simile", key: ["like"], a: "Della's hair", b: "a waterfall of brown water" },
  { s: "The fresh snow was as white as milk.", kind: "simile", key: ["as", "as"], a: "the snow", b: "milk" },
  { s: "The old tiger moved as silently as a shadow.", kind: "simile", key: ["as", "as"], a: "the tiger's movement", b: "a shadow" },
  { s: "The ship lay as idle as a painted ship upon a painted ocean.", kind: "simile", key: ["as", "as"], a: "the ship", b: "a ship in a painting" },
  { s: "The classroom was a zoo when the teacher left.", kind: "metaphor", key: ["was", "a", "zoo"], a: "the classroom", b: "a zoo", means: "the classroom was wild and noisy", literal: "the classroom was full of animals" },
  { s: "Grandmother's words were music to my ears.", kind: "metaphor", key: ["were", "music"], a: "Grandmother's words", b: "music", means: "her words were very pleasing to hear", literal: "Grandmother was singing a song" },
  { s: "Time is a thief that steals our days.", kind: "metaphor", key: ["is", "a", "thief"], a: "time", b: "a thief", means: "time passes and takes our days away without our noticing", literal: "a thief stole a calendar" },
  { s: "The old oak was the forest's grandfather.", kind: "metaphor", key: ["was", "the", "forest's", "grandfather"], a: "the old oak", b: "a grandfather", means: "the oak was the oldest, wisest tree in the forest", literal: "the oak had grandchildren" },
  { s: "Della's heart was a heavy stone that night.", kind: "metaphor", key: ["was", "a", "heavy", "stone"], a: "Della's heart", b: "a heavy stone", means: "Della felt very sad", literal: "Della's heart had turned to stone" },
  { s: "The wind whispered through the bare trees.", kind: "personification", key: ["whispered"], who: "wind" },
  { s: "The old oak stood guard over the sleeping forest.", kind: "personification", key: ["stood", "guard"], who: "oak" },
  { s: "The sun smiled down on the wet village.", kind: "personification", key: ["smiled"], who: "sun" },
  { s: "The waves danced around the Inchcape Rock.", kind: "personification", key: ["danced"], who: "waves" },
  { s: "The Abbot of Aberbrothok placed a bell on the rock.", kind: "alliteration", key: ["Abbot", "Aberbrothok"] },
  { s: "Sir Ralph the Rover tore his hair.", kind: "alliteration", key: ["Ralph", "Rover"] },
  { s: "The lone and level sands stretch far away.", kind: "alliteration", key: ["lone", "level"] },
  { s: "Five fat frogs fell into the pond.", kind: "alliteration", key: ["Five", "fat", "frogs", "fell"] },
  { s: "The bees buzzed among the roses.", kind: "onomatopoeia", key: ["buzzed"] },
  { s: "The fire crackled and hissed in the grate.", kind: "onomatopoeia", key: ["crackled", "hissed"] },
  { s: "The rain went pitter-patter on the roof.", kind: "onomatopoeia", key: ["pitter-patter"] },
  { s: "I have told you a million times to shut the door!", kind: "hyperbole", key: ["million"], means: "I have told you very many times", literal: "I have counted a million reminders" },
  { s: "My school bag weighs a ton.", kind: "hyperbole", key: ["ton"], means: "my bag is very heavy", literal: "my bag weighs 1,000 kilograms" },
  { s: "Della waited for Jim for a hundred years that evening.", kind: "hyperbole", key: ["hundred", "years"], means: "the wait felt very long", literal: "Della waited a whole century" },
  { s: "Water, water, every where, nor any drop to drink.", kind: "repetition", key: ["Water,", "water,"] },
  { s: "All hands on deck!", kind: "synecdoche", key: ["hands"], means: "all sailors, come up on deck", literal: "put your hands on the deck" },
  { s: "The farmer owns fifty head of cattle.", kind: "synecdoche", key: ["head"], means: "fifty cows", literal: "fifty cows' heads" },
];

/** Irony in the reader's texts. */
const IRONY: { s: string; right: string; wrong: [string, string, string] }[] = [
  {
    s: "Della sold her hair to buy a chain for Jim's watch. Jim sold his watch to buy combs for Della's hair.",
    right: "Each gave up the very thing the other's gift was for",
    wrong: ["They both went shopping on the same day", "Della did not like Jim's gift", "Jim forgot it was Christmas"],
  },
  {
    s: "The king's statue says 'Look on my Works, ye Mighty, and despair!' Nothing beside remains but sand.",
    right: "He boasted his works would last, but nothing of them is left",
    wrong: ["The statue is very large", "The traveller was lost in the desert", "The king was kind to his people"],
  },
  {
    s: "Sir Ralph cut the bell from the rock to annoy the Abbot. Later his own ship struck that rock.",
    right: "The trick he played to harm others ended up destroying him",
    wrong: ["The Abbot rang the bell too loudly", "The sea was calm all the time", "Sir Ralph was a good sailor"],
  },
  {
    s: "The fire station burned down last night.",
    right: "The place meant to stop fires was destroyed by one",
    wrong: ["Fire stations are often old", "There was no one inside", "The fire was very big"],
  },
];

const DEFS: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  { q: "A simile compares two things using ___", a: "'like' or 'as'", w: [{ text: "no linking word: it says one thing IS another", mistake: "fig-simile-metaphor" }, { text: "words that start with the same sound", mistake: "fig-terms" }, { text: "a sound word", mistake: "fig-terms" }] },
  { q: "Personification is ___", a: "giving human actions or feelings to a thing or an animal", w: [{ text: "a huge exaggeration", mistake: "fig-kind" }, { text: "comparing using like or as", mistake: "fig-simile-metaphor" }, { text: "a word that sounds like its meaning", mistake: "fig-kind" }] },
  { q: "Alliteration is ___", a: "words close together starting with the same sound", w: [{ text: "words ending with the same sound", mistake: "fig-kind" }, { text: "a word that imitates a sound", mistake: "fig-kind" }, { text: "repeating a whole line", mistake: "fig-kind" }] },
  { q: "Hyperbole is ___", a: "exaggeration for effect, not meant literally", w: [{ text: "a comparison using like", mistake: "fig-simile-metaphor" }, { text: "a word with two meanings", mistake: "fig-terms" }, { text: "an exact fact", mistake: "fig-literal" }] },
  { q: "Onomatopoeia is ___", a: "a word that sounds like what it describes (buzz, crackle)", w: [{ text: "a word with the opposite meaning", mistake: "fig-terms" }, { text: "a part standing for the whole", mistake: "fig-synecdoche" }, { text: "giving a thing human feelings", mistake: "fig-kind" }] },
  { q: "Synecdoche is ___", a: "a part used to stand for the whole (hands for sailors)", w: [{ text: "saying the opposite of what is meant", mistake: "fig-irony" }, { text: "comparing using as … as", mistake: "fig-simile-metaphor" }, { text: "repeating a sound", mistake: "fig-kind" }] },
];

/** Similes to build: as … as. */
const AS: { tiles: string; spare: string; wrong: string }[] = [
  { tiles: "Her smile was | as bright | as | the sun | .", spare: "like", wrong: "Her smile was as bright like the sun." },
  { tiles: "The snow was | as white | as | milk | .", spare: "like", wrong: "The snow was as white like milk." },
  { tiles: "The tiger moved | as silently | as | a shadow | .", spare: "like", wrong: "The tiger moved as silently like a shadow." },
  { tiles: "The old man was | as wise | as | an owl | .", spare: "like", wrong: "The old man was as wise like an owl." },
  { tiles: "The ice was | as cold | as | stone | .", spare: "like", wrong: "The ice was as cold like stone." },
  { tiles: "Pip was | as quiet | as | a mouse | .", spare: "like", wrong: "Pip was as quiet like a mouse." },
];

/** A simile and the matching metaphor. */
const TO_METAPHOR: { simile: string; metaphor: string; still: string; adj: string }[] = [
  { simile: "Her voice was like music.", metaphor: "Her voice was music.", still: "Her voice sounded like music.", adj: "Her voice was musical." },
  { simile: "The classroom was like a zoo.", metaphor: "The classroom was a zoo.", still: "The classroom was as noisy as a zoo.", adj: "The classroom was noisy." },
  { simile: "The road was like a ribbon over the hills.", metaphor: "The road was a ribbon over the hills.", still: "The road ran like a ribbon over the hills.", adj: "The road was long and thin." },
  { simile: "Jim's watch was like a treasure to him.", metaphor: "Jim's watch was his treasure.", still: "Jim treasured his watch like gold.", adj: "Jim's watch was precious." },
  { simile: "The stars were like diamonds in the sky.", metaphor: "The stars were diamonds in the sky.", still: "The stars shone like diamonds in the sky.", adj: "The stars were bright." },
  { simile: "Grandfather was like a rock for the family.", metaphor: "Grandfather was the family's rock.", still: "Grandfather stood like a rock for the family.", adj: "Grandfather was strong." },
];

const p = (i: number, extra: Record<string, number> = {}) => ({ i, ...extra });

export const FIGURES_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, x] = entryIn(rng, FIG, (f) => f.kind === "simile", g);
    const act = tapWords(x.s, x.key[0]);
    if (x.key.length === 2) {
      // as … as: both words
      const at = act.tokens.map((t, k) => (t.toLowerCase() === "as" ? k : -1)).filter((k) => k >= 0);
      act.target = at;
    }
    return doIt(base("c-remember", "concrete", "remember", "the simile word", rng), "Tap the word(s) that make this a simile.", p(i), act);
  },
  "concrete|understand": (rng, g) => {
    const [i, x] = entryIn(rng, FIG, (f) => f.kind === "alliteration", g);
    return doIt(base("c-understand", "concrete", "understand", "alliteration", rng), "Tap all the words that start with the same sound (alliteration).", p(i), tapWords(x.s, x.key));
  },
  "concrete|apply": (rng, g) => {
    const [i, x] = entry(rng, AS, g);
    return doIt(
      base("c-apply", "concrete", "apply", "build a simile", rng),
      "Build a simile with 'as … as'. (Not every tile is needed.)",
      p(i, { k: 1 }),
      tiles(rng, x.tiles, [x.spare], [{ text: x.wrong, mistake: "fig-as-like" }])
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, x] = entryIn(rng, FIG, (f) => f.kind === "personification", g);
    return doIt(
      base("c-analyze", "concrete", "analyze", "personification", rng),
      "Something here acts like a person. Tap the human action it is given.",
      p(i),
      tapWords(x.s, x.key, [{ phrase: x.who!, mistake: "fig-kind" }])
    );
  },
  "concrete|evaluate": (rng, g) => {
    const [i, x] = entryIn(rng, FIG, (f) => f.kind === "hyperbole", g);
    return doIt(base("c-evaluate", "concrete", "evaluate", "hyperbole", rng), "Tap the word(s) that exaggerate: they can't be literally true.", p(i), tapWords(x.s, x.key));
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, x] = entry(rng, FIG, g);
    const others = shuffle(rng, (Object.keys(KIND_NAME) as Kind[]).filter((k) => k !== x.kind)).slice(0, 3);
    return choose(
      base("p-remember", "pictorial", "remember", "name the figure of speech", rng),
      "Which figure of speech is this?",
      card([x.s]),
      p(i, { o: (Object.keys(KIND_NAME) as Kind[]).indexOf(others[0]) }),
      KIND_NAME[x.kind],
      others.map((k) => ({ text: KIND_NAME[k], mistake: (k === "simile" || k === "metaphor") && (x.kind === "simile" || x.kind === "metaphor") ? "fig-simile-metaphor" : "fig-kind" }))
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, x] = entryIn(rng, FIG, (f) => !!f.a, g);
    const other = pick(rng, FIG.filter((f) => f.a && f !== x));
    return choose(
      base("p-understand", "pictorial", "understand", "what is compared", rng),
      "Which two things are being compared?",
      card([x.s]),
      p(i, { j: FIG.indexOf(other) }),
      `${x.a} and ${x.b}`,
      [
        { text: `${x.a} and ${other.b}`, mistake: "fig-compared" },
        { text: `${other.a} and ${x.b}`, mistake: "fig-compared" },
        { text: "Nothing: it is a plain description", mistake: "fig-literal" },
      ]
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, x] = entryIn(rng, FIG, (f) => !!f.means, g);
    const other = pick(rng, FIG.filter((f) => f.means && f !== x));
    return choose(
      base("p-apply", "pictorial", "apply", "what it really means", rng),
      "What does this really mean?",
      card([x.s]),
      p(i, { j: FIG.indexOf(other) }),
      x.means!,
      [
        { text: x.literal!, mistake: "fig-literal" },
        { text: other.means!, mistake: "fig-compared" },
        { text: "Exactly what the words say, nothing more", mistake: "fig-literal" },
      ]
    );
  },
  "pictorial|analyze": (rng, g) => {
    const [i, x] = entry(rng, IRONY, g);
    return choose(base("p-analyze", "pictorial", "analyze", "irony", rng), "What makes this ironic?", card([x.s]), p(i, { k: 2 }), x.right, x.wrong.map((text) => ({ text, mistake: "fig-irony" })));
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, x] = entry(rng, FIG, g);
    const kinds = Object.keys(KIND_NAME) as Kind[];
    const said = g && Number.isInteger(g.s) ? kinds[g.s] : rng() < 0.4 ? x.kind : pick(rng, kinds.filter((k) => k !== x.kind));
    const no = (k: Kind) => `No, it is ${KIND_NAME[k].toLowerCase()}`;
    const close = (a: Kind, b: Kind) => (a === "simile" || a === "metaphor") && (b === "simile" || b === "metaphor");
    const right = said === x.kind ? "Yes, she is right" : no(x.kind);
    const pool = shuffle(rng, kinds.filter((k) => k !== said && k !== x.kind));
    const wrongs =
      said === x.kind
        ? pool.slice(0, 3).map((k) => ({ text: no(k), mistake: close(k, x.kind) ? "fig-simile-metaphor" : "fig-kind" }))
        : [{ text: "Yes, she is right", mistake: close(said, x.kind) ? "fig-simile-metaphor" : "fig-kind" }, ...pool.slice(0, 2).map((k) => ({ text: no(k), mistake: "fig-kind" }))];
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "judge the figure of speech", rng),
      `Riya says this line uses ${KIND_NAME[said].toLowerCase()}. Is she right?`,
      card([x.s]),
      p(i, { s: kinds.indexOf(said) }),
      right,
      wrongs
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, d] = entry(rng, DEFS, g);
    return choose(base("a-remember", "abstract", "remember", "the terms", rng), d.q, null, p(i, { k: 3 }), d.a, d.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, x] = entryIn(rng, FIG, (f) => f.kind === "simile" || f.kind === "metaphor", g);
    return choose(
      base("a-understand", "abstract", "understand", "simile or metaphor", rng),
      `Which figure of speech is used here? ${x.s}`,
      null,
      p(i),
      KIND_NAME[x.kind],
      [
        { text: x.kind === "simile" ? "Metaphor" : "Simile", mistake: "fig-simile-metaphor" },
        { text: "Personification", mistake: "fig-kind" },
        { text: "Neither: it is meant literally", mistake: "fig-literal" },
      ]
    );
  },
  "abstract|apply": (rng, g) => {
    const [i, x] = entry(rng, TO_METAPHOR, g);
    return choose(
      base("a-apply", "abstract", "apply", "simile to metaphor", rng),
      `Turn this simile into a metaphor: ${x.simile}`,
      null,
      p(i, { k: 4 }),
      x.metaphor,
      [
        { text: x.still, mistake: "fig-simile-metaphor" },
        { text: x.adj, mistake: "fig-literal" },
        { text: x.simile, mistake: "fig-simile-metaphor" },
      ]
    );
  },
  "abstract|analyze": (rng, g) => {
    const [i, x] = entryIn(rng, FIG, (f) => f.kind === "synecdoche" || f.kind === "hyperbole", g);
    return choose(
      base("a-analyze", "abstract", "analyze", "part for whole, exaggeration", rng),
      `${x.s} What does it mean?`,
      null,
      p(i),
      x.means!,
      [
        { text: x.literal!, mistake: x.kind === "synecdoche" ? "fig-synecdoche" : "fig-literal" },
        { text: "It is a mistake in the sentence", mistake: "fig-literal" },
        { text: "It compares two things using like", mistake: "fig-simile-metaphor" },
      ]
    );
  },
  "abstract|evaluate": (rng, g) => {
    const [i, x] = entryIn(rng, FIG, (f) => f.kind === "personification", g);
    const others = shuffle(rng, FIG.filter((f) => f.kind !== "personification")).slice(0, 3);
    return choose(
      base("a-evaluate", "abstract", "evaluate", "spot personification", rng),
      "Which line uses personification?",
      null,
      p(i, { j: FIG.indexOf(others[0]) }),
      x.s,
      others.map((o) => ({ text: o.s, mistake: "fig-kind" }))
    );
  },
};

/** For the stress test. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  if (cell === "pictorial|remember" && right !== KIND_NAME[FIG[it.params.i].kind]) return "figure should be the bank's";
  if (cell === "abstract|evaluate" && FIG.find((f) => f.s === right)?.kind !== "personification") return "right line isn't personification";
  return null;
}
