import { Rng, Template, pick } from "./core.js";
import { tidySentence } from "./activities.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, entryIn, mark, markWord, shuffle, tapWords, tiles } from "./english.js";

/**
 * Direct and Indirect Speech, Grade 8 English (English Rose Reader 8,
 * chapter 15 grammar; Model Test Paper 2, question G).
 *   concrete  tap the exact words spoken; tap the verb that moved back;
 *             build the reported sentence from tiles (statements, commands;
 *             questions in statement order); tap the one wrong word
 *   pictorial what kind of sentence was spoken; which reporting pattern;
 *             choose the indirect speech; why did these words change; what
 *             did Arjun get wrong
 *   abstract  the change rules (will → would, tomorrow → the next day);
 *             indirect of …; direct of …; which reported question is right;
 *             A or B?
 */

const TOPIC = "e8-speech";
const base = baseFor("sp8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "speech-tense": {
    label: "Doesn't move the tense back",
    detail: "Keeps the speaker's tense after a past reporting verb (said that he will …, asked if I know …).",
    childTip: "After said / asked, move the tense back one step: will → would, is → was, can → could, did → had done, has → had.",
  },
  "speech-pronoun": {
    label: "Doesn't change the pronouns",
    detail: "Keeps I / you / my / we from the speaker's own words in the reported sentence.",
    childTip: "Change the pronouns to fit who is telling it: 'I will go,' said Rahul → Rahul said that HE would go.",
  },
  "speech-time": {
    label: "Keeps time and place words unchanged",
    detail: "Leaves now, today, tomorrow, yesterday, here, this in the reported sentence.",
    childTip: "now → then, today → that day, tomorrow → the next day, yesterday → the day before, here → there, this → that.",
  },
  "speech-question-order": {
    label: "Keeps the question word order",
    detail: "Writes asked where was the station / asked did I … instead of statement order.",
    childTip: "A reported question is in statement order, with no question mark: asked where the station was; asked if I had finished.",
  },
  "speech-command": {
    label: "Reports a command with 'that'",
    detail: "Writes told us that please submit … instead of told / asked / requested + to.",
    childTip: "Commands and requests: told / asked / requested + someone + to + verb. 'Don't …' becomes not to.",
  },
  "speech-punctuation": {
    label: "Gets the speech punctuation wrong",
    detail: "Keeps a question mark or quotation marks in indirect speech, or leaves them out of direct speech.",
    childTip: "Direct: a comma, then quotation marks round the exact words. Indirect: no quotation marks and no question mark.",
  },
  "speech-not-converted": {
    label: "Changes only part of the sentence",
    detail: "Changes the punctuation but not the words, or the other way round.",
    childTip: "Change everything that depends on the speaker: tense, pronouns, time words, and the quotation marks.",
  },
  "speech-reporting-verb": {
    label: "Picks the wrong reporting pattern",
    detail: "Uses said that for a question, asked if for a statement, or that for a command.",
    childTip: "Statements: said that. Yes/no questions: asked if. Wh-questions: asked what / where / why. Commands: told … to.",
  },
  "speech-type": {
    label: "Can't tell what kind of sentence was spoken",
    detail: "Mixes up statements, questions and commands inside the quotation marks.",
    childTip: "Look at the spoken words: does it tell (statement), ask (question) or tell someone to do something (command or request)?",
  },
};

type Kind = "statement" | "yn" | "wh" | "command";
interface Entry {
  /** direct: the reporting part (with its comma) and the exact words */
  rep: string;
  quote: string;
  kind: Kind;
  /** indirect: the reporting part, then the rest split into tiles at | */
  indRep: string;
  clause: string;
  /** the verb (or 'to …') that changed in the reported sentence */
  sh: string;
  /** tile swaps that make a named mistake: [right tile, wrong tile, mistake] */
  subs: [string, string, string][];
  /** whole wrong reported sentences: [text, mistake] */
  xw?: [string, string][];
  /** one wrong direct sentence (for indirect → direct) and its mistake */
  dw: [string, string];
}

const BANK: Entry[] = [
  { rep: "Rahul said,", quote: "I will finish the assignment by tonight.", kind: "statement", indRep: "Rahul said that", clause: "he | would finish | the assignment | by that night | .", sh: "would finish",
    subs: [["would finish", "will finish", "speech-tense"], ["he", "I", "speech-pronoun"], ["by that night", "by tonight", "speech-time"]], dw: ["Rahul said, ‘He will finish the assignment by tonight.’", "speech-pronoun"] },
  { rep: "Meera said,", quote: "I enjoyed the school trip.", kind: "statement", indRep: "Meera said that", clause: "she | had enjoyed | the school trip | .", sh: "had enjoyed",
    subs: [["had enjoyed", "has enjoyed", "speech-tense"], ["she", "I", "speech-pronoun"]], xw: [["Meera said that she enjoys the school trip.", "speech-tense"]], dw: ["Meera said, ‘She enjoyed the school trip.’", "speech-pronoun"] },
  { rep: "She asked,", quote: "Did you complete the homework on time?", kind: "yn", indRep: "She asked me if", clause: "I | had completed | the homework | on time | .", sh: "had completed",
    subs: [["had completed", "complete", "speech-tense"], ["I", "you", "speech-pronoun"]], xw: [["She asked me did I complete the homework on time.", "speech-question-order"], ["She asked me if I had completed the homework on time?", "speech-punctuation"]], dw: ["She asked, ‘Did I complete the homework on time?’", "speech-pronoun"] },
  { rep: "The teacher said,", quote: "Please submit your notebooks by Tuesday.", kind: "command", indRep: "The teacher requested us", clause: "to submit | our notebooks | by Tuesday | .", sh: "to submit",
    subs: [["our notebooks", "your notebooks", "speech-pronoun"], ["to submit", "submit", "speech-command"]], xw: [["The teacher said that please submit your notebooks by Tuesday.", "speech-command"]], dw: ["The teacher said, ‘Please submit our notebooks by Tuesday.’", "speech-pronoun"] },
  { rep: "He asked,", quote: "Do you know the way to the library?", kind: "yn", indRep: "He asked me if", clause: "I | knew | the way to the library | .", sh: "knew",
    subs: [["knew", "know", "speech-tense"], ["I", "you", "speech-pronoun"]], xw: [["He asked me do I know the way to the library.", "speech-question-order"], ["He asked me if I knew the way to the library?", "speech-punctuation"]], dw: ["He asked, ‘Do I know the way to the library?’", "speech-pronoun"] },
  { rep: "Della said to Jim,", quote: "My hair grows awfully fast.", kind: "statement", indRep: "Della told Jim that", clause: "her hair | grew | awfully fast | .", sh: "grew",
    subs: [["grew", "grows", "speech-tense"], ["her hair", "my hair", "speech-pronoun"]], dw: ["Della said to Jim, ‘Her hair grows awfully fast.’", "speech-pronoun"] },
  { rep: "Jim asked Della,", quote: "Why have you cut your hair?", kind: "wh", indRep: "Jim asked Della why", clause: "she | had cut | her hair | .", sh: "had cut",
    subs: [["had cut", "has cut", "speech-tense"], ["her hair", "your hair", "speech-pronoun"]], xw: [["Jim asked Della why had she cut her hair.", "speech-question-order"], ["Jim asked Della why she had cut her hair?", "speech-punctuation"]], dw: ["Jim asked Della, ‘Why has she cut her hair?’", "speech-pronoun"] },
  { rep: "The convict said to Pip,", quote: "You must bring me a file and some food.", kind: "statement", indRep: "The convict told Pip that", clause: "he | had to bring | him | a file and some food | .", sh: "had to bring",
    subs: [["had to bring", "must bring", "speech-tense"], ["him", "me", "speech-pronoun"], ["he", "you", "speech-pronoun"]], dw: ["The convict said to Pip, ‘He must bring him a file and some food.’", "speech-pronoun"] },
  { rep: "Mother said to me,", quote: "Switch off the fan when you leave the room.", kind: "command", indRep: "Mother told me", clause: "to switch off | the fan | when I left | the room | .", sh: "to switch off",
    subs: [["when I left", "when you leave", "speech-pronoun"], ["to switch off", "switch off", "speech-command"]], xw: [["Mother told me that switch off the fan when I left the room.", "speech-command"]], dw: ["Mother said to me, ‘Switch off the fan when I left the room.’", "speech-not-converted"] },
  { rep: "The coach said to us,", quote: "Don't run on the wet floor.", kind: "command", indRep: "The coach told us", clause: "not to run | on the wet floor | .", sh: "not to run",
    subs: [["not to run", "to run", "speech-command"]], xw: [["The coach told us that don't run on the wet floor.", "speech-command"], ["The coach told us not to run on the wet floor?", "speech-punctuation"]], dw: ["The coach said to us, ‘Not to run on the wet floor.’", "speech-not-converted"] },
  { rep: "Anu said,", quote: "I am reading Great Expectations.", kind: "statement", indRep: "Anu said that", clause: "she | was reading | Great Expectations | .", sh: "was reading",
    subs: [["was reading", "is reading", "speech-tense"], ["she", "I", "speech-pronoun"]], dw: ["Anu said, ‘She is reading Great Expectations.’", "speech-pronoun"] },
  { rep: "The guide said,", quote: "The tiger was seen here yesterday.", kind: "statement", indRep: "The guide said that", clause: "the tiger | had been seen | there | the day before | .", sh: "had been seen",
    subs: [["had been seen", "is seen", "speech-tense"], ["there", "here", "speech-time"], ["the day before", "yesterday", "speech-time"]], dw: ["The guide said, ‘The tiger is seen here yesterday.’", "speech-tense"] },
  { rep: "Arun said,", quote: "I can swim across the river.", kind: "statement", indRep: "Arun said that", clause: "he | could swim | across the river | .", sh: "could swim",
    subs: [["could swim", "can swim", "speech-tense"], ["he", "I", "speech-pronoun"]], dw: ["Arun said, ‘He can swim across the river.’", "speech-pronoun"] },
  { rep: "The shopkeeper asked me,", quote: "What do you want to buy?", kind: "wh", indRep: "The shopkeeper asked me what", clause: "I | wanted | to buy | .", sh: "wanted",
    subs: [["wanted", "want", "speech-tense"], ["I", "you", "speech-pronoun"]], xw: [["The shopkeeper asked me what did I want to buy.", "speech-question-order"], ["The shopkeeper asked me what I wanted to buy?", "speech-punctuation"]], dw: ["The shopkeeper asked me, ‘What do I want to buy?’", "speech-pronoun"] },
  { rep: "Kavya said,", quote: "My grandfather has gone to the market.", kind: "statement", indRep: "Kavya said that", clause: "her grandfather | had gone | to the market | .", sh: "had gone",
    subs: [["had gone", "has gone", "speech-tense"], ["her grandfather", "my grandfather", "speech-pronoun"]], dw: ["Kavya said, ‘Her grandfather has gone to the market.’", "speech-pronoun"] },
  { rep: "Rohan said,", quote: "We are playing a match tomorrow.", kind: "statement", indRep: "Rohan said that", clause: "they | were playing | a match | the next day | .", sh: "were playing",
    subs: [["were playing", "are playing", "speech-tense"], ["they", "we", "speech-pronoun"], ["the next day", "tomorrow", "speech-time"]], dw: ["Rohan said, ‘They are playing a match tomorrow.’", "speech-pronoun"] },
  { rep: "The doctor said to Ravi,", quote: "Take this medicine twice a day.", kind: "command", indRep: "The doctor advised Ravi", clause: "to take | that medicine | twice a day | .", sh: "to take",
    subs: [["that medicine", "this medicine", "speech-time"], ["to take", "take", "speech-command"]], xw: [["The doctor advised Ravi that take this medicine twice a day.", "speech-command"]], dw: ["The doctor said to Ravi, ‘To take this medicine twice a day.’", "speech-not-converted"] },
  { rep: "Priya asked,", quote: "Where is the nearest post office?", kind: "wh", indRep: "Priya asked where", clause: "the nearest post office | was | .", sh: "was",
    subs: [["was", "is", "speech-tense"]], xw: [["Priya asked where was the nearest post office.", "speech-question-order"], ["Priya asked where the nearest post office was?", "speech-punctuation"]], dw: ["Priya asked, ‘Where was the nearest post office?’", "speech-tense"] },
  { rep: "Grandfather said,", quote: "I planted this tree forty years ago.", kind: "statement", indRep: "Grandfather said that", clause: "he | had planted | that tree | forty years before | .", sh: "had planted",
    subs: [["had planted", "plants", "speech-tense"], ["he", "I", "speech-pronoun"], ["that tree", "this tree", "speech-time"], ["forty years before", "forty years ago", "speech-time"]], dw: ["Grandfather said, ‘He planted this tree forty years ago.’", "speech-pronoun"] },
  { rep: "The principal said,", quote: "The school will remain closed today.", kind: "statement", indRep: "The principal said that", clause: "the school | would remain | closed | that day | .", sh: "would remain",
    subs: [["would remain", "will remain", "speech-tense"], ["that day", "today", "speech-time"]], dw: ["The principal said, ‘The school would remain closed that day.’", "speech-not-converted"] },
  { rep: "Sam asked me,", quote: "Have you seen my cricket bat?", kind: "yn", indRep: "Sam asked me if", clause: "I | had seen | his cricket bat | .", sh: "had seen",
    subs: [["had seen", "have seen", "speech-tense"], ["his cricket bat", "my cricket bat", "speech-pronoun"]], xw: [["Sam asked me had I seen his cricket bat.", "speech-question-order"], ["Sam asked me if I had seen his cricket bat?", "speech-punctuation"]], dw: ["Sam asked me, ‘Have you seen his cricket bat?’", "speech-pronoun"] },
  { rep: "The old man said,", quote: "I am very tired now.", kind: "statement", indRep: "The old man said that", clause: "he | was | very tired | then | .", sh: "was",
    subs: [["was", "is", "speech-tense"], ["he", "I", "speech-pronoun"], ["then", "now", "speech-time"]], dw: ["The old man said, ‘He is very tired now.’", "speech-pronoun"] },
  { rep: "Nisha said,", quote: "I have lost my pencil box.", kind: "statement", indRep: "Nisha said that", clause: "she | had lost | her pencil box | .", sh: "had lost",
    subs: [["had lost", "has lost", "speech-tense"], ["she", "I", "speech-pronoun"], ["her pencil box", "my pencil box", "speech-pronoun"]], dw: ["Nisha said, ‘She has lost her pencil box.’", "speech-pronoun"] },
  { rep: "The traveller asked me,", quote: "Can you show me the way to the station?", kind: "yn", indRep: "The traveller asked me if", clause: "I | could show | him | the way to the station | .", sh: "could show",
    subs: [["could show", "can show", "speech-tense"], ["him", "me", "speech-pronoun"]], xw: [["The traveller asked me could I show him the way to the station.", "speech-question-order"], ["The traveller asked me if I could show him the way to the station?", "speech-punctuation"]], dw: ["The traveller asked me, ‘Can I show him the way to the station?’", "speech-pronoun"] },
  { rep: "The ranger said to the visitors,", quote: "Keep your voices low near the tigers.", kind: "command", indRep: "The ranger told the visitors", clause: "to keep | their voices | low | near the tigers | .", sh: "to keep",
    subs: [["their voices", "your voices", "speech-pronoun"], ["to keep", "keep", "speech-command"]], xw: [["The ranger told the visitors that keep your voices low near the tigers.", "speech-command"]], dw: ["The ranger said to the visitors, ‘Keep their voices low near the tigers.’", "speech-pronoun"] },
  { rep: "The teacher asked Rohan,", quote: "Why are you late again?", kind: "wh", indRep: "The teacher asked Rohan why", clause: "he | was | late again | .", sh: "was",
    subs: [["was", "is", "speech-tense"], ["he", "you", "speech-pronoun"]], xw: [["The teacher asked Rohan why was he late again.", "speech-question-order"], ["The teacher asked Rohan why he was late again?", "speech-punctuation"]], dw: ["The teacher asked Rohan, ‘Why is he late again?’", "speech-pronoun"] },
  { rep: "Grandmother asked me,", quote: "Will you visit us next summer?", kind: "yn", indRep: "Grandmother asked me if", clause: "I | would visit | them | the next summer | .", sh: "would visit",
    subs: [["would visit", "will visit", "speech-tense"], ["them", "us", "speech-pronoun"], ["the next summer", "next summer", "speech-time"]], xw: [["Grandmother asked me would I visit them the next summer.", "speech-question-order"], ["Grandmother asked me if I would visit them the next summer?", "speech-punctuation"]], dw: ["Grandmother asked me, ‘Will I visit them next summer?’", "speech-pronoun"] },
  { rep: "Pip asked the convict,", quote: "Who are you?", kind: "wh", indRep: "Pip asked the convict who", clause: "he | was | .", sh: "was",
    subs: [["was", "is", "speech-tense"], ["he", "you", "speech-pronoun"]], xw: [["Pip asked the convict who was he.", "speech-question-order"], ["Pip asked the convict who he was?", "speech-punctuation"]], dw: ["Pip asked the convict, ‘Who is he?’", "speech-pronoun"] },
  { rep: "The librarian asked us,", quote: "Have you returned your books?", kind: "yn", indRep: "The librarian asked us if", clause: "we | had returned | our books | .", sh: "had returned",
    subs: [["had returned", "have returned", "speech-tense"], ["our books", "your books", "speech-pronoun"]], xw: [["The librarian asked us had we returned our books.", "speech-question-order"], ["The librarian asked us if we had returned our books?", "speech-punctuation"]], dw: ["The librarian asked us, ‘Have we returned our books?’", "speech-pronoun"] },
  { rep: "Mother asked,", quote: "What are you cooking in the kitchen?", kind: "wh", indRep: "Mother asked me what", clause: "I | was cooking | in the kitchen | .", sh: "was cooking",
    subs: [["was cooking", "am cooking", "speech-tense"], ["I", "you", "speech-pronoun"]], xw: [["Mother asked me what was I cooking in the kitchen.", "speech-question-order"], ["Mother asked me what I was cooking in the kitchen?", "speech-punctuation"]], dw: ["Mother asked, ‘What am I cooking in the kitchen?’", "speech-pronoun"] },
  { rep: "The conductor asked the boy,", quote: "Where do you want to get off?", kind: "wh", indRep: "The conductor asked the boy where", clause: "he | wanted | to get off | .", sh: "wanted",
    subs: [["wanted", "want", "speech-tense"], ["he", "you", "speech-pronoun"]], xw: [["The conductor asked the boy where did he want to get off.", "speech-question-order"], ["The conductor asked the boy where he wanted to get off?", "speech-punctuation"]], dw: ["The conductor asked the boy, ‘Where does he want to get off?’", "speech-pronoun"] },
];

const tileList = (e: Entry) => e.clause.split("|").map((x) => x.trim()).filter(Boolean);
const direct = (e: Entry) => `${e.rep} ‘${e.quote}’`;
const indirect = (e: Entry, t = tileList(e)) => tidySentence(`${e.indRep} ${t.join(" ")}`);
/** The reported sentence with one tile swapped (a named mistake). */
const swapped = (e: Entry, [from, to]: [string, string, string]) => {
  const t = tileList(e);
  const k = t.indexOf(from);
  if (k < 0) throw new Error(`tile "${from}" not in ${e.clause}`);
  t[k] = to;
  return indirect(e, t);
};
function indirectWrongs(e: Entry) {
  return [...e.subs.map((s) => ({ text: swapped(e, s), mistake: s[2] })), ...(e.xw ?? []).map(([text, mistake]) => ({ text, mistake })), { text: `${e.indRep.replace(/ (that|if|why|what|where)$/, "")}, ‘${e.quote}’`, mistake: "speech-not-converted" }];
}
function directWrongs(e: Entry) {
  const clauseText = indirect(e).slice(e.indRep.length + 1);
  return [
    { text: e.dw[0], mistake: e.dw[1] },
    { text: `${e.rep} ‘${clauseText.charAt(0).toUpperCase()}${clauseText.slice(1)}’`, mistake: "speech-not-converted" },
    { text: `${e.indRep} ‘${e.quote}’`, mistake: "speech-punctuation" },
    { text: `${e.rep} ${e.quote}`, mistake: "speech-punctuation" },
  ];
}

const KIND_LABEL: Record<Kind, string> = { statement: "A statement", yn: "A yes/no question", wh: "A question with a question word (what, why, where …)", command: "A command or request" };
const PATTERN: Record<Kind, string> = {
  statement: "said / told someone + that …",
  yn: "asked + if …",
  wh: "asked + the question word (what, why, where …)",
  command: "told / asked / requested someone + to …",
};

const RULES: [string, string, "tense" | "time"][] = [
  ["will", "would", "tense"],
  ["can", "could", "tense"],
  ["is", "was", "tense"],
  ["has", "had", "tense"],
  ["may", "might", "tense"],
  ["must", "had to", "tense"],
  ["shall", "should", "tense"],
  ["today", "that day", "time"],
  ["tomorrow", "the next day", "time"],
  ["yesterday", "the day before", "time"],
  ["now", "then", "time"],
  ["here", "there", "time"],
  ["this", "that", "time"],
  ["ago", "before", "time"],
];

const LABEL: Record<string, string> = {
  "speech-tense": "He didn't move the tense back",
  "speech-pronoun": "He didn't change the pronouns",
  "speech-time": "He didn't change a time or place word",
  "speech-question-order": "He kept the question word order",
  "speech-command": "He reported a command with 'that'",
  "speech-punctuation": "He got the punctuation wrong",
  "speech-not-converted": "He only changed part of it",
};

const p = (i: number, extra: Record<string, number> = {}) => ({ i, ...extra });

export const SPEECH_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return doIt(base("c-remember", "concrete", "remember", "the exact words spoken", rng), "Tap all the words the speaker actually said.", p(i), tapWords(direct(e), e.quote, [{ phrase: e.rep.replace(/,$/, ""), mistake: "speech-punctuation" }]));
  },
  "concrete|understand": (rng, g) => {
    const [i, e] = entryIn(rng, BANK, (e) => e.kind !== "command", g);
    const pron = e.subs.find((s) => s[2] === "speech-pronoun" && !s[0].includes(" "));
    return doIt(
      base("c-understand", "concrete", "understand", "the tense moves back", rng),
      `‘${e.quote}’ was reported like this. Tap the verb that moved back in time.`,
      p(i),
      tapWords(indirect(e), e.sh, pron ? [{ phrase: pron[0], mistake: "speech-tense" }] : [])
    );
  },
  "concrete|apply": (rng, g) => {
    const [i, e] = entryIn(rng, BANK, (e) => e.kind === "statement" || e.kind === "command", g);
    const s = pick(rng, e.subs);
    return doIt(
      base("c-apply", "concrete", "apply", "build the reported sentence", rng),
      `Report this in indirect speech: ${direct(e)} (Not every tile is needed.)`,
      p(i),
      tiles(rng, `${e.indRep} | ${e.clause}`, [s[1]], [{ text: swapped(e, s), mistake: s[2] }])
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, e] = entryIn(rng, BANK, (e) => e.kind === "yn" || e.kind === "wh", g);
    return doIt(
      base("c-analyze", "concrete", "analyze", "build a reported question", rng),
      `Report this question: ${direct(e)} (Not every tile is needed.)`,
      p(i),
      tiles(rng, `${e.indRep} | ${e.clause}`, ["?"], [{ text: indirect(e).replace(/\.$/, "?"), mistake: "speech-punctuation" }])
    );
  },
  "concrete|evaluate": (rng, g) => {
    // one tile swapped for a one-word mistake that appears only once
    const options = BANK.flatMap((e, i) => e.subs.filter((s) => !s[1].includes(" ")).map((s) => ({ e, i, s })))
      .filter(({ e, s }) => swapped(e, s).split(/\s+/).filter((w) => w.replace(/[.,?]/g, "") === s[1]).length === 1);
    const pickK = g && Number.isInteger(g.j) && options[g.j] ? g.j : Math.floor(rng() * options.length);
    const { e, s } = options[pickK];
    return doIt(
      base("c-evaluate", "concrete", "evaluate", "correct reported speech", rng),
      `${direct(e)} One word in this reported version is wrong. Tap it.`,
      p(BANK.indexOf(e), { j: pickK }),
      tapWords(swapped(e, s), s[1], [{ phrase: e.indRep.split(" ").slice(-1)[0], mistake: s[2] }])
    );
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const right = KIND_LABEL[e.kind];
    return choose(
      base("p-remember", "pictorial", "remember", "kind of sentence spoken", rng),
      "What kind of sentence is inside the quotation marks?",
      card([mark(direct(e), `‘${e.quote}’`)]),
      p(i),
      right,
      shuffle(rng, Object.values(KIND_LABEL).filter((x) => x !== right)).map((text) => ({ text, mistake: "speech-type" }))
    );
  },
  "pictorial|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const right = PATTERN[e.kind];
    return choose(
      base("p-understand", "pictorial", "understand", "which reporting pattern", rng),
      "To report this in indirect speech, which pattern do you need?",
      card([direct(e)]),
      p(i),
      right,
      shuffle(rng, Object.values(PATTERN).filter((x) => x !== right)).map((text) => ({ text, mistake: "speech-reporting-verb" }))
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(base("p-apply", "pictorial", "apply", "direct to indirect", rng), "Choose the indirect speech.", card([direct(e)]), p(i), indirect(e), shuffle(rng, indirectWrongs(e)));
  },
  "pictorial|analyze": (rng, g) => {
    const [i, e] = entryIn(rng, BANK, (e) => e.kind !== "command", g);
    return choose(
      base("p-analyze", "pictorial", "analyze", "why the tense moved back", rng),
      "Why is the highlighted verb different from what was said?",
      card([direct(e), markWord(indirect(e), e.sh)], "What was said, and how it was reported"),
      p(i),
      "The reporting verb is in the past, so the tense moves back",
      [
        { text: "It is a mistake: it should stay as it was said", mistake: "speech-tense" },
        { text: "Because the speaker is a different person now", mistake: "speech-pronoun" },
        { text: "Because indirect speech always uses the future", mistake: "speech-tense" },
      ]
    );
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const wrongs = indirectWrongs(e).filter((w) => LABEL[w.mistake]);
    const at = g && Number.isInteger(g.v) ? g.v : Math.floor(rng() * (wrongs.length + 1));
    const his = at < wrongs.length ? wrongs[at] : { text: indirect(e), mistake: "" };
    const right = his.mistake ? LABEL[his.mistake] : "Nothing: it is right";
    const others = shuffle(rng, [...Object.entries(LABEL), ["", "Nothing: it is right"] as [string, string]].filter(([k]) => k !== his.mistake));
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "check reported speech", rng),
      "Arjun reported the first sentence. What, if anything, did he get wrong?",
      card([direct(e), `Arjun: ${his.text}`], "What was said, then Arjun's version"),
      p(i, { v: at }),
      right,
      others.map(([k, text]) => ({ text, mistake: his.mistake || k || "speech-not-converted" }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, r] = entry(rng, RULES, g);
    const kind = r[2];
    const others = shuffle(rng, RULES.filter((x) => x[2] === kind && x !== r)).slice(0, 2);
    return choose(
      base("a-remember", "abstract", "remember", "the change rules", rng),
      `Reported after 'said': ‘${r[0]}’ becomes ___`,
      null,
      p(i, { k: 5, o: RULES.indexOf(others[0]) }),
      r[1],
      [{ text: r[0], mistake: kind === "tense" ? "speech-tense" : "speech-time" }, ...others.map((o) => ({ text: o[1], mistake: kind === "tense" ? "speech-tense" : "speech-time" })), { text: "it stays the same", mistake: "speech-tense" }]
    );
  },
  "abstract|understand": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(base("a-understand", "abstract", "understand", "direct to indirect", rng), `Indirect speech: ${direct(e)}`, null, p(i), indirect(e), indirectWrongs(e));
  },
  "abstract|apply": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    return choose(base("a-apply", "abstract", "apply", "indirect to direct", rng), `Direct speech: ${indirect(e)}`, null, p(i), direct(e), directWrongs(e));
  },
  "abstract|analyze": (rng, g) => {
    const [i, e] = entryIn(rng, BANK, (e) => e.kind === "yn" || e.kind === "wh", g);
    const w = indirectWrongs(e).filter((x) => x.mistake !== "speech-pronoun");
    return choose(base("a-analyze", "abstract", "analyze", "reported questions", rng), `Report the question: ${direct(e)}`, null, p(i), indirect(e), w);
  },
  "abstract|evaluate": (rng, g) => {
    const [i, e] = entry(rng, BANK, g);
    const wrong = pick(rng, indirectWrongs(e));
    const aRight = g && Number.isInteger(g.v) ? g.v === 1 : rng() < 0.5;
    const A = aRight ? indirect(e) : wrong.text;
    const B = aRight ? wrong.text : indirect(e);
    return choose(
      base("a-evaluate", "abstract", "evaluate", "judge reported speech", rng),
      `${direct(e)} Two pupils reported it. A: ${A} B: ${B} Who is right?`,
      null,
      p(i, { v: aRight ? 1 : 0, w: indirectWrongs(e).indexOf(wrong) }),
      aRight ? "Only A" : "Only B",
      [
        { text: aRight ? "Only B" : "Only A", mistake: wrong.mistake },
        { text: "Both are right", mistake: wrong.mistake },
        { text: "Neither is right", mistake: "speech-not-converted" },
      ]
    );
  },
};

/** For the stress test: the right indirect / direct is rebuilt from the bank. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  if (cell === "pictorial|apply" || cell === "abstract|understand") {
    const e = BANK[it.params.i];
    if (right !== indirect(e)) return `indirect should be "${indirect(e)}"`;
    if (/[?‘’]/.test(right)) return `indirect speech with a question mark or quotes: ${right}`;
  }
  if (cell === "abstract|apply" && !/‘.*’$/.test(right)) return `direct speech without quotes: ${right}`;
  return null;
}
