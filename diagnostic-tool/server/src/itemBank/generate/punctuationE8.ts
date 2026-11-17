import { Template } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, shuffle, tapWords, tiles, words } from "./english.js";

/**
 * Punctuation, Grade 8 English (English Rose Reader 8, Scope and Sequence:
 * capital letter, full stop, comma, question and exclamation marks;
 * apostrophe and inverted commas; colon; hyphen; error correction).
 *   concrete  tap the words that need capitals; tap the word missing an
 *             apostrophe; tap where the commas go; build a line of direct
 *             speech with its marks; tap the wrong apostrophe
 *   pictorial which end mark; how many owners (girl's / girls'); colon or
 *             not; where the hyphen goes; is Riya's sentence right?
 *   abstract  the rules; contractions; which sentence is punctuated right;
 *             the possessive; which colon is right
 */

const TOPIC = "e8-punctuation";
const base = baseFor("pun8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "punct-capital": {
    label: "Misses capital letters",
    detail: "Leaves names, places, days, months, languages, titles or the first word in small letters.",
    childTip: "Capitals for: the first word, I, names of people and places, days and months, languages, titles of books.",
  },
  "punct-end": {
    label: "Uses the wrong end mark",
    detail: "Puts a question mark after an indirect question, or a full stop after an exclamation.",
    childTip: "? only for a real question (Where is it?). 'She asked where it was.' ends with a full stop. ! for strong feeling (What a surprise!).",
  },
  "punct-comma": {
    label: "Leaves out or misplaces commas",
    detail: "No commas in a list, after 'Yes' or a name being spoken to, or a comma where none is needed.",
    childTip: "Commas between items in a list (apples, oranges and grapes), after Yes / No / However, and round the name of the person spoken to (Rahul, please …).",
  },
  "punct-apostrophe": {
    label: "Leaves out the apostrophe",
    detail: "Writes Dellas hair / cant / dont.",
    childTip: "Apostrophe for belonging (Della's hair) and for missing letters (can't = cannot).",
  },
  "punct-plural-apostrophe": {
    label: "Puts an apostrophe in a plain plural",
    detail: "Writes mango's for sale / the boy's are playing.",
    childTip: "A plain plural has no apostrophe: mangoes, the boys are playing. The apostrophe is only for belonging or a short form.",
  },
  "punct-possessive": {
    label: "Puts the possessive apostrophe in the wrong place",
    detail: "Writes the girl's bags for many girls, or childrens' toys.",
    childTip: "One owner: girl's. Plural ending in s: girls'. Plural not ending in s: children's, men's.",
  },
  "punct-its": {
    label: "Mixes up its and it's",
    detail: "Writes the tiger licked it's paw.",
    childTip: "it's = it is / it has. its = belonging to it (its paw). Test: can you say 'it is'?",
  },
  "punct-quote": {
    label: "Gets the speech marks wrong",
    detail: "Leaves out inverted commas, puts the question mark outside them, or adds speech marks to reported speech.",
    childTip: "‘Where is it?’ asked Pip. The ? or , goes inside the inverted commas. Reported speech (She said that …) has none.",
  },
  "punct-colon": {
    label: "Misuses the colon",
    detail: "Leaves out the colon before a list or in a time, or puts it in the wrong place.",
    childTip: "Colon before a list (three things: a pen, a ruler …), in time (7:45) and ratio (3:1).",
  },
  "punct-hyphen": {
    label: "Puts the hyphen in the wrong place",
    detail: "Writes a well known-writer or twenty one-dollars.",
    childTip: "A hyphen joins words that work as one before a noun (a well-known writer, a ten-year-old girl) and numbers 21–99 (twenty-one).",
  },
  "punct-contraction": {
    label: "Writes a short form wrongly",
    detail: "Puts the apostrophe in the wrong place (do'nt, wo'nt) or confuses they're / there / their.",
    childTip: "The apostrophe goes where letters are missing: do not → don't, they are → they're, will not → won't.",
  },
};

/** Capitals needed (sentence given in small letters); `caps` are the words that need one. */
const CAPS: { s: string; caps: string[] }[] = [
  { s: "last monday pip and joe walked to london.", caps: ["last", "monday", "pip", "joe", "london."] },
  { s: "della and jim lived in new york.", caps: ["della", "jim", "new", "york."] },
  { s: "my cousin ashima speaks bengali and english.", caps: ["my", "ashima", "bengali", "english."] },
  { s: "on diwali we visited our grandmother in jaipur.", caps: ["on", "diwali", "jaipur."] },
  { s: "in july the rangers counted tigers in ranthambore.", caps: ["in", "july", "ranthambore."] },
  { s: "sir ralph sailed across the north sea.", caps: ["sir", "ralph", "north", "sea."] },
  { s: "we read great expectations by charles dickens.", caps: ["we", "great", "expectations", "charles", "dickens."] },
  { s: "every friday meera plays the drums in pune.", caps: ["every", "friday", "meera", "pune."] },
  { s: "i think ravi and i will go to goa in may.", caps: ["i", "ravi", "i", "goa", "may."] },
  { s: "the abbot of aberbrothok lived near the sea.", caps: ["the", "abbot", "aberbrothok"] },
];
function capsTarget(x: (typeof CAPS)[number]): number[] {
  const t = words(x.s);
  const out: number[] = [];
  let from = 0;
  for (const c of x.caps) {
    const k = t.findIndex((w, j) => j >= from && w === c);
    if (k < 0) throw new Error(`"${c}" not in "${x.s}"`);
    out.push(k);
    from = k + 1;
  }
  return out;
}

/** A word missing its apostrophe. */
const APOS: { s: string; w: string; fix: string }[] = [
  { s: "Dellas hair was long and beautiful.", w: "Dellas", fix: "Della's" },
  { s: "Jims watch was made of gold.", w: "Jims", fix: "Jim's" },
  { s: "Pips sister was very strict.", w: "Pips", fix: "Pip's" },
  { s: "The childrens playground is closed today.", w: "childrens", fix: "children's" },
  { s: "Grandfathers walking stick is by the door.", w: "Grandfathers", fix: "Grandfather's" },
  { s: "I cant find my pencil box anywhere.", w: "cant", fix: "can't" },
  { s: "We dont have school tomorrow.", w: "dont", fix: "don't" },
  { s: "Shes going to the market with her mother.", w: "Shes", fix: "She's" },
  { s: "The mens hats were blown away by the wind.", w: "mens", fix: "men's" },
  { s: "Ashimas son was named Gogol.", w: "Ashimas", fix: "Ashima's" },
];

/** Where commas go: after these words (list items, Yes, a name spoken to, However). `also` = an allowed extra comma. */
const COMMA: { s: string; after: string[]; also?: string }[] = [
  { s: "We bought apples oranges bananas and grapes.", after: ["apples", "oranges"], also: "bananas" },
  { s: "Bring a pen a ruler an eraser and a notebook.", after: ["pen", "ruler"], also: "eraser" },
  { s: "The rangers counted tigers leopards deer and bears.", after: ["tigers", "leopards"], also: "deer" },
  { s: "Gogol Ashima and Ashoke went to Calcutta.", after: ["Gogol"], also: "Ashima" },
  { s: "The flag is saffron white and green.", after: ["saffron"], also: "white" },
  { s: "Rahul please close the door.", after: ["Rahul"] },
  { s: "Yes I will come to the fair.", after: ["Yes"] },
  { s: "However the match was not cancelled.", after: ["However"] },
  { s: "No we have not finished yet.", after: ["No"] },
  { s: "Meera can you hear the drums?", after: ["Meera"] },
];

/** Direct speech to build with its marks. */
const SPEECH: { tiles: string; spares: string[]; wrong: [string, string][] }[] = [
  { tiles: "‘Where is the station | ?’ | asked the traveller | .", spares: [".’", ",’"], wrong: [["‘Where is the station.’ asked the traveller.", "punct-end"], ["‘Where is the station,’ asked the traveller.", "punct-end"]] },
  { tiles: "‘I will finish it tonight | ,’ | said Rahul | .", spares: [".’", "?’"], wrong: [["‘I will finish it tonight.’ said Rahul.", "punct-quote"], ["‘I will finish it tonight?’ said Rahul.", "punct-end"]] },
  { tiles: "‘What a beautiful gift | !’ | cried Della | .", spares: [".’", "?’"], wrong: [["‘What a beautiful gift.’ cried Della.", "punct-end"], ["‘What a beautiful gift?’ cried Della.", "punct-end"]] },
  { tiles: "‘Please close the door | ,’ | said the teacher | .", spares: [".’", "?’"], wrong: [["‘Please close the door.’ said the teacher.", "punct-quote"], ["‘Please close the door?’ said the teacher.", "punct-end"]] },
  { tiles: "‘Who are you | ?’ | asked Pip | .", spares: [".’", ",’"], wrong: [["‘Who are you.’ asked Pip.", "punct-end"], ["‘Who are you,’ asked Pip.", "punct-end"]] },
  { tiles: "‘Keep your voices low | ,’ | said the ranger | .", spares: [".’", "!’"], wrong: [["‘Keep your voices low.’ said the ranger.", "punct-quote"]] },
];

/** Wrong apostrophes. */
const BADAPOS: { s: string; w: string; mistake: string }[] = [
  { s: "The tiger licked it's paw.", w: "it's", mistake: "punct-its" },
  { s: "Fresh mango's for sale!", w: "mango's", mistake: "punct-plural-apostrophe" },
  { s: "The boy's are playing cricket.", w: "boy's", mistake: "punct-plural-apostrophe" },
  { s: "All the student's passed the test.", w: "student's", mistake: "punct-plural-apostrophe" },
  { s: "The dog wagged it's tail happily.", w: "it's", mistake: "punct-its" },
  { s: "Della counted her dollar's again.", w: "dollar's", mistake: "punct-plural-apostrophe" },
  { s: "The shop sells pen's and pencils.", w: "pen's", mistake: "punct-plural-apostrophe" },
  { s: "The ship lost it's bell in the storm.", w: "it's", mistake: "punct-its" },
];

const END: { s: string; right: "full stop" | "question mark" | "exclamation mark"; trap?: boolean }[] = [
  { s: "Where are you going ___", right: "question mark" },
  { s: "What a lovely surprise ___", right: "exclamation mark" },
  { s: "Della counted her money three times ___", right: "full stop" },
  { s: "Did you hear the bell ___", right: "question mark" },
  { s: "How beautiful the snow looks ___", right: "exclamation mark" },
  { s: "Please shut the window ___", right: "full stop" },
  { s: "Why did Jim sell his watch ___", right: "question mark" },
  { s: "Hurray, we won the match ___", right: "exclamation mark" },
  { s: "Grandmother asked where the station was ___", right: "full stop", trap: true },
  { s: "I wonder whether it will rain ___", right: "full stop", trap: true },
  { s: "Pip asked the convict who he was ___", right: "full stop", trap: true },
];
const END_NAME = { "full stop": "A full stop (.)", "question mark": "A question mark (?)", "exclamation mark": "An exclamation mark (!)" } as const;

const POSS: { phrase: string; many: boolean }[] = [
  { phrase: "the girl's bags", many: false },
  { phrase: "the girls' bags", many: true },
  { phrase: "the boy's bicycle", many: false },
  { phrase: "the boys' bicycles", many: true },
  { phrase: "the children's toys", many: true },
  { phrase: "the teacher's desk", many: false },
  { phrase: "the teachers' room", many: true },
  { phrase: "the tiger's cubs", many: false },
  { phrase: "the tigers' forest", many: true },
  { phrase: "the man's hat", many: false },
  { phrase: "the men's hats", many: true },
];

const COLON: { s: string }[] = [
  { s: "We need three things ___ a pen, a ruler and an eraser." },
  { s: "The train leaves at 7 ___ 45 in the morning." },
  { s: "The shop sells three kinds of fruit ___ mangoes, apples and grapes." },
  { s: "The match starts at 4 ___ 30 in the afternoon." },
  { s: "Mix sand and cement in the ratio 3 ___ 1." },
  { s: "Pack these for the trip ___ a torch, a map and a water bottle." },
];
const colonFilled = (s: string, m: string) => s.replace(/ ___ /, /\d ___ \d/.test(s) ? m : `${m} `);

const HYPHEN: { right: string; wrong: [string, string, string] }[] = [
  { right: "a well-known writer", wrong: ["a well known-writer", "a-well known writer", "a wellknown-writer"] },
  { right: "twenty-one dollars", wrong: ["twenty one-dollars", "twenty-one-dollars", "twentyone-dollars"] },
  { right: "a ten-year-old girl", wrong: ["a ten year-old girl", "a ten-year old girl", "a ten year old-girl"] },
  { right: "a snow-covered hill", wrong: ["a snow covered-hill", "a-snow covered hill", "a snowcovered-hill"] },
  { right: "a long-lasting friendship", wrong: ["a long lasting-friendship", "a-long lasting friendship", "a longlasting-friendship"] },
  { right: "a well-behaved dog", wrong: ["a well behaved-dog", "a-well behaved dog", "a wellbehaved-dog"] },
  { right: "forty-five pupils", wrong: ["forty five-pupils", "forty-five-pupils", "fortyfive-pupils"] },
];

const CONTRACT: { full: string; right: string; wrong: [string, string, string] }[] = [
  { full: "they are", right: "they're", wrong: ["there", "their", "theyr'e"] },
  { full: "it is", right: "it's", wrong: ["its", "its'", "i'ts"] },
  { full: "do not", right: "don't", wrong: ["do'nt", "dont'", "dont"] },
  { full: "will not", right: "won't", wrong: ["willn't", "wo'nt", "wont"] },
  { full: "she has", right: "she's", wrong: ["shes", "she'has", "s'hes"] },
  { full: "we have", right: "we've", wrong: ["weve", "we'have", "w'eve"] },
  { full: "cannot", right: "can't", wrong: ["cann't", "ca'nt", "cant"] },
  { full: "you are", right: "you're", wrong: ["your", "youre", "you'r"] },
];

const POSSFORM: { of: string; right: string; wrong: [string, string, string] }[] = [
  { of: "the toys of the children", right: "the children's toys", wrong: ["the childrens' toys", "the childrens toys", "the children's' toys"] },
  { of: "the bags of the girls", right: "the girls' bags", wrong: ["the girl's bags", "the girls's bags", "the girls bags"] },
  { of: "the watch of Jim", right: "Jim's watch", wrong: ["Jims' watch", "Jims watch", "Jim' watch"] },
  { of: "the room of the teachers", right: "the teachers' room", wrong: ["the teacher's room", "the teachers's room", "the teachers room"] },
  { of: "the hats of the men", right: "the men's hats", wrong: ["the mens' hats", "the mens hats", "the men' hats"] },
  { of: "the cubs of the tiger", right: "the tiger's cubs", wrong: ["the tigers' cubs", "the tigers cubs", "the tiger' cubs"] },
  { of: "the nest of the birds", right: "the birds' nest", wrong: ["the bird's nest", "the birds's nest", "the birds nest"] },
  { of: "the games of the boys", right: "the boys' games", wrong: ["the boy's games", "the boys's games", "the boys games"] },
];

const CORRECT: { right: string; wrong: [string, string][] }[] = [
  { right: "‘Are you coming?’ asked Meera.", wrong: [["‘Are you coming.’ asked Meera.", "punct-end"], ["‘Are you coming’? asked Meera.", "punct-quote"], ["Are you coming? asked Meera.", "punct-quote"]] },
  { right: "Jim's watch was in its case.", wrong: [["Jims watch was in its case.", "punct-apostrophe"], ["Jim's watch was in it's case.", "punct-its"], ["Jim's watch was in its' case.", "punct-its"]] },
  { right: "We visited Delhi, Agra and Jaipur in May.", wrong: [["We visited delhi, agra and jaipur in May.", "punct-capital"], ["We visited, Delhi, Agra and Jaipur in May.", "punct-comma"], ["We visited Delhi Agra and Jaipur in may.", "punct-comma"]] },
  { right: "The children's books are on the shelf.", wrong: [["The childrens' books are on the shelf.", "punct-possessive"], ["The childrens books are on the shelf.", "punct-apostrophe"], ["The children's book's are on the shelf.", "punct-plural-apostrophe"]] },
  { right: "She said that she was tired.", wrong: [["She said that ‘she was tired.’", "punct-quote"], ["She said, that she was tired.", "punct-comma"], ["She said that she was tired?", "punct-end"]] },
  { right: "What a wonderful surprise!", wrong: [["What a wonderful surprise?", "punct-end"], ["what a wonderful surprise!", "punct-capital"], ["What a wonderful, surprise!", "punct-comma"]] },
  { right: "Rahul, please close the door.", wrong: [["Rahul please close the door.", "punct-comma"], ["Rahul, please close the door?", "punct-end"], ["rahul, please close the door.", "punct-capital"]] },
  { right: "Della said, ‘My hair grows fast.’", wrong: [["Della said ‘my hair grows fast.’", "punct-capital"], ["Della said, My hair grows fast.", "punct-quote"], ["Della, said ‘My hair grows fast.’", "punct-comma"]] },
];

const RULES: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  { q: "We use a colon ___", a: "before a list, and in times (7:45) and ratios (3:1)", w: [{ text: "at the end of every sentence", mistake: "punct-colon" }, { text: "instead of an apostrophe", mistake: "punct-colon" }, { text: "between a name and the verb", mistake: "punct-colon" }] },
  { q: "An apostrophe shows ___", a: "belonging (Della's) or missing letters (can't)", w: [{ text: "that a word is plural (mango's)", mistake: "punct-plural-apostrophe" }, { text: "a pause in a sentence", mistake: "punct-comma" }, { text: "the exact words someone said", mistake: "punct-quote" }] },
  { q: "A hyphen is used to ___", a: "join words that work as one (well-known, twenty-one)", w: [{ text: "show belonging", mistake: "punct-apostrophe" }, { text: "end a question", mistake: "punct-end" }, { text: "separate items in a list", mistake: "punct-comma" }] },
  { q: "Inverted commas (‘ ’) go round ___", a: "the exact words someone said", w: [{ text: "reported speech (She said that …)", mistake: "punct-quote" }, { text: "the name of the speaker", mistake: "punct-quote" }, { text: "every important word", mistake: "punct-quote" }] },
  { q: "'its' (no apostrophe) means ___", a: "belonging to it (its tail)", w: [{ text: "it is", mistake: "punct-its" }, { text: "it has", mistake: "punct-its" }, { text: "more than one 'it'", mistake: "punct-its" }] },
];

const p = (i: number, k: number, extra: Record<string, number> = {}) => ({ i, k, ...extra });

export const PUNCTUATION_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, x] = entry(rng, CAPS, g);
    const tokens = words(x.s);
    const target = capsTarget(x);
    return doIt(base("c-remember", "concrete", "remember", "capital letters", rng), "Tap every word that should start with a capital letter.", p(i, 1), {
      kind: "words",
      tokens,
      target,
      wrongSets: [{ cells: [target[0]], mistake: "punct-capital" }, { cells: target.slice(1), mistake: "punct-capital" }],
    });
  },
  "concrete|understand": (rng, g) => {
    const [i, x] = entry(rng, APOS, g);
    return doIt(base("c-understand", "concrete", "understand", "missing apostrophe", rng), "One word is missing an apostrophe. Tap it.", p(i, 2), tapWords(x.s, x.w));
  },
  "concrete|apply": (rng, g) => {
    const [i, x] = entry(rng, COMMA, g);
    const act = tapWords(x.s, x.after);
    if (x.also) act.alsoRight = [[...act.target, words(x.s).findIndex((w) => w === x.also)].sort((a, b) => a - b)];
    return doIt(base("c-apply", "concrete", "apply", "where commas go", rng), "Commas are missing. Tap each word that should have a comma after it.", p(i, 3), act);
  },
  "concrete|analyze": (rng, g) => {
    const [i, x] = entry(rng, SPEECH, g);
    return doIt(
      base("c-analyze", "concrete", "analyze", "punctuate direct speech", rng),
      "Build the sentence with the right marks. (Not every tile is needed.)",
      p(i, 4),
      tiles(rng, x.tiles, x.spares, x.wrong.map(([text, mistake]) => ({ text, mistake })))
    );
  },
  "concrete|evaluate": (rng, g) => {
    const [i, x] = entry(rng, BADAPOS, g);
    return doIt(base("c-evaluate", "concrete", "evaluate", "wrong apostrophe", rng), "One apostrophe here is wrong. Tap the word.", p(i, 5), tapWords(x.s, x.w));
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, x] = entry(rng, END, g);
    const right = END_NAME[x.right];
    return choose(
      base("p-remember", "pictorial", "remember", "end marks", rng),
      "Which mark ends this sentence?",
      card([x.s]),
      p(i, 6),
      right,
      [...Object.values(END_NAME).filter((t) => t !== right).map((text) => ({ text, mistake: "punct-end" })), { text: "A comma (,)", mistake: "punct-comma" }]
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, x] = entry(rng, POSS, g);
    return choose(
      base("p-understand", "pictorial", "understand", "one owner or more", rng),
      "How many owners does this talk about?",
      card([x.phrase]),
      p(i, 7),
      x.many ? "More than one" : "One",
      [
        { text: x.many ? "One" : "More than one", mistake: "punct-possessive" },
        { text: "None: the apostrophe is a short form (is)", mistake: "punct-contraction" },
        { text: "We can't tell from the apostrophe", mistake: "punct-possessive" },
      ]
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, x] = entry(rng, COLON, g);
    return choose(
      base("p-apply", "pictorial", "apply", "the colon", rng),
      "Which mark goes in the gap?",
      card([x.s]),
      p(i, 8),
      "A colon (:)",
      [
        { text: "A semicolon (;)", mistake: "punct-colon" },
        { text: "A comma (,)", mistake: "punct-colon" },
        { text: "An apostrophe (')", mistake: "punct-colon" },
      ]
    );
  },
  "pictorial|analyze": (rng, g) => {
    const [i, x] = entry(rng, HYPHEN, g);
    return choose(
      base("p-analyze", "pictorial", "analyze", "the hyphen", rng),
      "Which is written correctly?",
      card([x.right.replace(/-/g, " ")], "Add a hyphen"),
      p(i, 9),
      x.right,
      x.wrong.map((text) => ({ text, mistake: "punct-hyphen" }))
    );
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, x] = entry(rng, CORRECT, g);
    const at = g && Number.isInteger(g.v) ? g.v : Math.floor(rng() * (x.wrong.length + 1));
    const hers = at < x.wrong.length ? x.wrong[at] : [x.right, ""];
    const LAB: Record<string, string> = {
      "": "Nothing: it is right",
      "punct-capital": "A capital letter is missing",
      "punct-comma": "A comma is missing or in the wrong place",
      "punct-end": "The end mark is wrong",
      "punct-quote": "The inverted commas are wrong",
      "punct-apostrophe": "An apostrophe is missing",
      "punct-its": "'its' / 'it's' is wrong",
      "punct-possessive": "The apostrophe is in the wrong place",
      "punct-plural-apostrophe": "A plain plural has an apostrophe",
    };
    const right = LAB[hers[1]];
    const others = shuffle(rng, Object.entries(LAB).filter(([k]) => k !== hers[1])).slice(0, 3);
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "check the punctuation", rng),
      "Riya punctuated this sentence. What, if anything, is wrong?",
      card([`Riya: ${hers[0]}`]),
      p(i, 10, { v: at }),
      right,
      others.map(([k, text]) => ({ text, mistake: hers[1] || k || "punct-comma" }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, r] = entry(rng, RULES, g);
    return choose(base("a-remember", "abstract", "remember", "the rules", rng), r.q, null, p(i, 11), r.a, r.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, x] = entry(rng, CONTRACT, g);
    return choose(
      base("a-understand", "abstract", "understand", "short forms", rng),
      `The short form of '${x.full}' is ___`,
      null,
      p(i, 12),
      x.right,
      x.wrong.map((text) => ({ text, mistake: x.full === "it is" ? "punct-its" : "punct-contraction" }))
    );
  },
  "abstract|apply": (rng, g) => {
    const [i, x] = entry(rng, CORRECT, g);
    return choose(base("a-apply", "abstract", "apply", "which is punctuated right", rng), "Which sentence is punctuated correctly?", null, p(i, 10), x.right, x.wrong.map(([text, mistake]) => ({ text, mistake })));
  },
  "abstract|analyze": (rng, g) => {
    const [i, x] = entry(rng, POSSFORM, g);
    return choose(base("a-analyze", "abstract", "analyze", "the possessive", rng), `Write with an apostrophe: ${x.of}`, null, p(i, 13), x.right, x.wrong.map((text) => ({ text, mistake: text.includes("'") ? "punct-possessive" : "punct-apostrophe" })));
  },
  "abstract|evaluate": (rng, g) => {
    const [i, x] = entry(rng, COLON, g);
    const right = colonFilled(x.s, ":");
    const ws = words(x.s.replace(" ___", ""));
    // the colon put after a different word
    const moved = [1, 2, 3, 4, 5].map((k) => [...ws.slice(0, k), ws[k] + ":", ...ws.slice(k + 1)].join(" ")).filter((t) => t !== right && !/[.,]:/.test(t));
    moved.splice(2, 0, x.s.replace(" ___ ", " "));
    return choose(
      base("a-evaluate", "abstract", "evaluate", "which colon is right", rng),
      "Which sentence uses the colon correctly?",
      null,
      p(i, 8),
      right,
      moved.slice(0, 3).map((text) => ({ text, mistake: "punct-colon" }))
    );
  },
};

/** For the stress test. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  if (cell === "abstract|apply" && right !== CORRECT[it.params.i].right) return "should be the bank's right sentence";
  if (cell === "abstract|evaluate" && !right.includes(":")) return "right answer has no colon";
  for (const x of APOS) if (!x.s.includes(x.w)) return `${x.w} not in ${x.s}`;
  return null;
}
