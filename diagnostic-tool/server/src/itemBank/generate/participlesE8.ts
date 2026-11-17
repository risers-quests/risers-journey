import { Template, pick } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, entryIn, markWord, shuffle, tapWords, tiles } from "./english.js";

/**
 * Participles and Gerunds, Grade 8 English (English Rose Reader 8, chapter 5
 * grammar).
 *   concrete  tap the gerund (a participle is in the sentence too); tap the
 *             participle; build "fond of swimming" from tiles (to swim is
 *             there to tempt); join two sentences with a participle; tap the
 *             wrong words in "She enjoys to dance"
 *   pictorial gerund, participle or part of the verb?; what job does the
 *             gerund do?; choose the form after a preposition; join with a
 *             participle (not leaving it dangling); is Riya right?
 *   abstract  what they are; gerund or participle?; the form after a
 *             preposition; -ing or -ed adjective; which sentence has a gerund?
 */

const TOPIC = "e8-participles";
const base = baseFor("par8", TOPIC);

export const MISCONCEPTIONS: Misconceptions = {
  "pg-mixup": {
    label: "Mixes up gerunds and participles",
    detail: "Calls an -ing word used as a noun a participle, or one used as an adjective a gerund.",
    childTip: "Gerund: an -ing word doing a noun's job (Swimming is fun). Participle: an -ing or -ed word describing a noun (the barking dog, a broken window).",
  },
  "pg-function": {
    label: "Can't say what job the gerund does",
    detail: "Unsure whether the gerund is the subject, the object, after a preposition or after is / was.",
    childTip: "Subject: Swimming is fun. Object: I enjoy swimming. After a preposition: fond of swimming. After is: My hobby is swimming.",
  },
  "pg-continuous": {
    label: "Takes the -ing in a continuous verb for a gerund or participle",
    detail: "Calls the -ing in is playing / was reading a gerund or an adjective.",
    childTip: "is / am / are / was / were + -ing is just the verb in a continuous tense (She is dancing).",
  },
  "pg-infinitive-after-prep": {
    label: "Uses 'to + verb' after a preposition",
    detail: "Writes fond of to swim / looking forward to meet instead of the -ing form.",
    childTip: "After of, in, at, for, about, without, before, after (and look forward to, be used to) use -ing: fond of swimming.",
  },
  "pg-verb-pattern": {
    label: "Uses 'to + verb' after a verb that takes -ing",
    detail: "Writes enjoy to dance / avoid to eat / finish to write.",
    childTip: "enjoy, avoid, finish, mind, keep, practise, suggest, miss are followed by -ing: I enjoy dancing.",
  },
  "pg-form": {
    label: "Uses the wrong form of the verb",
    detail: "Uses the base form or the simple past where the -ing form or past participle is needed.",
    childTip: "Present participle: -ing (opening). Past participle: -ed / -en (opened, broken). Perfect participle: having + past participle (having finished).",
  },
  "pg-dangling": {
    label: "Leaves the participle without its doer",
    detail: "Writes Opening the door, a tiger was seen, so the tiger seems to open the door.",
    childTip: "The person right after the comma must be the one doing the -ing: Opening the door, HE saw a tiger.",
  },
  "pg-not-joined": {
    label: "Doesn't use a participle to join",
    detail: "Puts the two sentences side by side with a comma instead of turning one verb into a participle.",
    childTip: "Turn the first verb into a participle: He opened the door. He saw a tiger. → Opening the door, he saw a tiger.",
  },
  "pg-ing-ed": {
    label: "Mixes up -ing and -ed adjectives",
    detail: "Writes I was boring for I was bored, or a bored film for a boring film.",
    childTip: "-ing: the thing that causes the feeling (a boring film). -ed: how someone feels (I was bored).",
  },
};

/** Sentences with one -ing word and the job it does. */
type Role = "gerund" | "participle" | "verb";
type Job = "subject" | "object" | "preposition" | "complement";
const ING: { s: string; w: string; role: Role; job?: Job }[] = [
  { s: "Swimming is good exercise.", w: "Swimming", role: "gerund", job: "subject" },
  { s: "Reading before bed helps me relax.", w: "Reading", role: "gerund", job: "subject" },
  { s: "She enjoys dancing in the rain.", w: "dancing", role: "gerund", job: "object" },
  { s: "Pip was afraid of meeting the convict again.", w: "meeting", role: "gerund", job: "preposition" },
  { s: "My grandfather's hobby is gardening.", w: "gardening", role: "gerund", job: "complement" },
  { s: "Counting tigers is the rangers' main job.", w: "Counting", role: "gerund", job: "subject" },
  { s: "Della thought of selling her hair.", w: "selling", role: "gerund", job: "preposition" },
  { s: "We were tired of waiting for the bus.", w: "waiting", role: "gerund", job: "preposition" },
  { s: "Her greatest talent is drumming.", w: "drumming", role: "gerund", job: "complement" },
  { s: "The boys love playing cricket after school.", w: "playing", role: "gerund", job: "object" },
  { s: "Thank you for helping me with my homework.", w: "helping", role: "gerund", job: "preposition" },
  { s: "Ringing the bell warned the sailors of the rock.", w: "Ringing", role: "gerund", job: "subject" },
  { s: "The barking dog woke the whole street.", w: "barking", role: "participle" },
  { s: "We heard the birds singing in the oak tree.", w: "singing", role: "participle" },
  { s: "Walking through the snowy forest, the boy saw an old oak.", w: "Walking", role: "participle" },
  { s: "The running water was ice-cold.", w: "running", role: "participle" },
  { s: "The girl reading a book under the tree is my sister.", w: "reading", role: "participle" },
  { s: "Sir Ralph watched the bell sinking into the sea.", w: "sinking", role: "participle" },
  { s: "The crying baby fell asleep at last.", w: "crying", role: "participle" },
  { s: "Smiling happily, Della showed Jim her present.", w: "Smiling", role: "participle" },
  { s: "The children are playing in the park.", w: "playing", role: "verb" },
  { s: "Anu was reading when the lights went out.", w: "reading", role: "verb" },
  { s: "The rangers were counting the pugmarks.", w: "counting", role: "verb" },
  { s: "She is drumming on the table.", w: "drumming", role: "verb" },
];
const ROLE_LABEL: Record<Role, string> = {
  gerund: "A gerund: it does a noun's job",
  participle: "A participle: it describes a noun",
  verb: "Part of the verb (is / was + -ing)",
};
const JOB_LABEL: Record<Job, string> = {
  subject: "It is the subject of the sentence",
  object: "It is the object of the verb",
  preposition: "It comes after a preposition",
  complement: "It comes after is / was and names the thing",
};

/** One sentence with a gerund and a participle. */
const MIXED: { s: string; g: string; p: string }[] = [
  { s: "The smiling teacher praised our singing.", g: "singing", p: "smiling" },
  { s: "Walking in the rain, she remembered dancing as a child.", g: "dancing", p: "Walking" },
  { s: "The laughing children enjoyed playing in the snow.", g: "playing", p: "laughing" },
  { s: "Hearing the bell, the sailors stopped rowing.", g: "rowing", p: "Hearing" },
  { s: "The sleeping tiger did not notice our coming.", g: "coming", p: "sleeping" },
  { s: "Running late, Rohan skipped eating breakfast.", g: "eating", p: "Running" },
  { s: "The shining stars made counting them impossible.", g: "counting", p: "shining" },
  { s: "Smiling, Della talked about selling her hair.", g: "selling", p: "Smiling" },
  { s: "The falling leaves made sweeping the yard a daily job.", g: "sweeping", p: "falling" },
  { s: "Waiting at the gate, the boy dreamt of becoming a pilot.", g: "becoming", p: "Waiting" },
];

/** A preposition (or "look forward to", "used to") then a gerund. */
const PREP: { before: string; v: string; ing: string; past: string; after: string }[] = [
  { before: "Meera is fond of", v: "swim", ing: "swimming", past: "swam", after: "in the sea" },
  { before: "Arun is interested in", v: "collect", ing: "collecting", past: "collected", after: "old coins" },
  { before: "We were tired of", v: "wait", ing: "waiting", past: "waited", after: "for the bus" },
  { before: "Thank you for", v: "help", ing: "helping", past: "helped", after: "me" },
  { before: "I am looking forward to", v: "meet", ing: "meeting", past: "met", after: "my cousins" },
  { before: "She left without", v: "say", ing: "saying", past: "said", after: "goodbye" },
  { before: "Wash your hands before", v: "eat", ing: "eating", past: "ate", after: "your lunch" },
  { before: "Della dreamed of", v: "buy", ing: "buying", past: "bought", after: "Jim a fine chain" },
  { before: "He insisted on", v: "pay", ing: "paying", past: "paid", after: "for the meal" },
  { before: "The rangers are used to", v: "work", ing: "working", past: "worked", after: "in the forest" },
  { before: "Read a book instead of", v: "watch", ing: "watching", past: "watched", after: "TV" },
  { before: "Ravi is good at", v: "sing", ing: "singing", past: "sang", after: "old songs" },
  { before: "The convict was afraid of", v: "go", ing: "going", past: "went", after: "back to the ship" },
  { before: "Anu apologised for", v: "break", ing: "breaking", past: "broke", after: "the vase" },
];
const prepRight = (x: (typeof PREP)[number]) => `${x.before} ${x.ing} ${x.after}.`;

/** A verb that takes -ing, written wrongly with to + verb. */
const PATTERN: { wrong: string; bad: string; right: string }[] = [
  { wrong: "She enjoys to dance in the rain.", bad: "to dance", right: "dancing" },
  { wrong: "He avoids to eat junk food.", bad: "to eat", right: "eating" },
  { wrong: "Have you finished to write your essay?", bad: "to write", right: "writing" },
  { wrong: "Do you mind to wait a minute?", bad: "to wait", right: "waiting" },
  { wrong: "The children kept to talk during the film.", bad: "to talk", right: "talking" },
  { wrong: "Meera practises to play the drums every day.", bad: "to play", right: "playing" },
  { wrong: "Ravi suggested to go to the museum.", bad: "to go", right: "going" },
  { wrong: "I miss to play with my cousins.", bad: "to play", right: "playing" },
  { wrong: "Jim gave up to smoke years ago.", bad: "to smoke", right: "smoking" },
  { wrong: "Pip could not imagine to escape from the marshes.", bad: "to escape", right: "escaping" },
];

/** Two sentences joined with a participle; a wrong form; a dangling version. */
const JOIN: { a: string; b: string; right: string; form: string; dangling: string; tiles: string; spare: string }[] = [
  { a: "He opened the door.", b: "He saw a tiger.", right: "Opening the door, he saw a tiger.", form: "Opened the door, he saw a tiger.", dangling: "Opening the door, a tiger was seen.", tiles: "Opening | the door | , | he saw | a tiger | .", spare: "Opened" },
  { a: "Arun walked through the museum.", b: "He admired the sculptures.", right: "Walking through the museum, Arun admired the sculptures.", form: "Walked through the museum, Arun admired the sculptures.", dangling: "Walking through the museum, the sculptures were admired by Arun.", tiles: "Walking | through the museum | , | Arun admired | the sculptures | .", spare: "Walked" },
  { a: "Rohan completed his homework.", b: "He went out to play.", right: "Having completed his homework, Rohan went out to play.", form: "Having complete his homework, Rohan went out to play.", dangling: "Having completed his homework, the football was waiting for Rohan.", tiles: "Having completed | his homework | , | Rohan went | out to play | .", spare: "Having complete" },
  { a: "The tiger was hungry.", b: "It came out of the forest.", right: "Being hungry, the tiger came out of the forest.", form: "Been hungry, the tiger came out of the forest.", dangling: "Being hungry, the forest was left by the tiger.", tiles: "Being | hungry | , | the tiger came | out of the forest | .", spare: "Been" },
  { a: "We found the shop closed.", b: "We went home.", right: "Finding the shop closed, we went home.", form: "Found the shop closed, we went home.", dangling: "Finding the shop closed, home was the only place to go.", tiles: "Finding | the shop closed | , | we went | home | .", spare: "Found" },
  { a: "Della looked in the mirror.", b: "She saw her short hair.", right: "Looking in the mirror, Della saw her short hair.", form: "Looked in the mirror, Della saw her short hair.", dangling: "Looking in the mirror, her short hair surprised Della.", tiles: "Looking | in the mirror | , | Della saw | her short hair | .", spare: "Looked" },
  { a: "Pip heard a noise.", b: "He turned round.", right: "Hearing a noise, Pip turned round.", form: "Heard a noise, Pip turned round.", dangling: "Hearing a noise, Pip's head turned round.", tiles: "Hearing | a noise | , | Pip turned | round | .", spare: "Heard" },
  { a: "Sir Ralph cut the bell.", b: "He laughed loudly.", right: "Having cut the bell, Sir Ralph laughed loudly.", form: "Having cutted the bell, Sir Ralph laughed loudly.", dangling: "Having cut the bell, a loud laugh came from Sir Ralph.", tiles: "Having cut | the bell | , | Sir Ralph laughed | loudly | .", spare: "Having cutted" },
  { a: "The children saw the snow.", b: "They shouted with joy.", right: "Seeing the snow, the children shouted with joy.", form: "Saw the snow, the children shouted with joy.", dangling: "Seeing the snow, joy filled the air.", tiles: "Seeing | the snow | , | the children shouted | with joy | .", spare: "Saw" },
  { a: "Anu finished her essay.", b: "She went to bed.", right: "Having finished her essay, Anu went to bed.", form: "Having finish her essay, Anu went to bed.", dangling: "Having finished her essay, the bed looked inviting to Anu.", tiles: "Having finished | her essay | , | Anu went | to bed | .", spare: "Having finish" },
];

/** -ing or -ed adjective. */
const FEEL: { s: string; ing: string; ed: string; base: string; noun: string; want: "ing" | "ed" }[] = [
  { s: "The film was so ___ that I fell asleep.", ing: "boring", ed: "bored", base: "bore", noun: "boredom", want: "ing" },
  { s: "I was ___ by the long film.", ing: "boring", ed: "bored", base: "bore", noun: "boredom", want: "ed" },
  { s: "The tiger's roar was ___.", ing: "frightening", ed: "frightened", base: "frighten", noun: "fright", want: "ing" },
  { s: "The ___ villagers ran indoors.", ing: "frightening", ed: "frightened", base: "frighten", noun: "fright", want: "ed" },
  { s: "We were ___ by the news.", ing: "surprising", ed: "surprised", base: "surprise", noun: "surprises", want: "ed" },
  { s: "The result of the match was ___.", ing: "surprising", ed: "surprised", base: "surprise", noun: "surprises", want: "ing" },
  { s: "I am ___ about the school trip.", ing: "exciting", ed: "excited", base: "excite", noun: "excitement", want: "ed" },
  { s: "The last over of the match was really ___.", ing: "exciting", ed: "excited", base: "excite", noun: "excitement", want: "ing" },
  { s: "These grammar rules are ___ at first.", ing: "confusing", ed: "confused", base: "confuse", noun: "confusion", want: "ing" },
  { s: "Della was ___ when she saw the combs.", ing: "amazing", ed: "amazed", base: "amaze", noun: "amazement", want: "ed" },
  { s: "After the long walk, Pip felt ___.", ing: "tiring", ed: "tired", base: "tire", noun: "tiredness", want: "ed" },
  { s: "Climbing the hill was ___.", ing: "tiring", ed: "tired", base: "tire", noun: "tiredness", want: "ing" },
];

const DEFS: { q: string; a: string; w: { text: string; mistake: string }[] }[] = [
  {
    q: "A gerund is ___",
    a: "an -ing form of a verb used as a noun",
    w: [
      { text: "an -ing form of a verb used as an adjective", mistake: "pg-mixup" },
      { text: "any word that ends in -ing", mistake: "pg-mixup" },
      { text: "the verb in a continuous tense (is going)", mistake: "pg-continuous" },
    ],
  },
  {
    q: "A participle is ___",
    a: "a verb form (-ing, -ed, -en) used like an adjective",
    w: [
      { text: "a verb form used as a noun", mistake: "pg-mixup" },
      { text: "a small part of a sentence with no verb", mistake: "pg-mixup" },
      { text: "the base form of a verb with 'to'", mistake: "pg-form" },
    ],
  },
  {
    q: "In 'a broken window', 'broken' is ___",
    a: "a past participle used as an adjective",
    w: [
      { text: "a gerund", mistake: "pg-mixup" },
      { text: "a present participle", mistake: "pg-form" },
      { text: "the simple past of break", mistake: "pg-form" },
    ],
  },
  {
    q: "'Having finished the work, she left.' 'Having finished' is ___",
    a: "a perfect participle: one action finished before the other",
    w: [
      { text: "a gerund that is the subject", mistake: "pg-mixup" },
      { text: "a present continuous verb", mistake: "pg-continuous" },
      { text: "a mistake: it should be 'Had finished'", mistake: "pg-form" },
    ],
  },
];

const p = (i: number, extra: Record<string, number> = {}) => ({ i, ...extra });

export const PARTICIPLES_E8_TEMPLATES: Record<string, Template> = {
  // ---------------- CONCRETE ----------------
  "concrete|remember": (rng, g) => {
    const [i, m] = entry(rng, MIXED, g);
    return doIt(base("c-remember", "concrete", "remember", "find the gerund", rng), "Tap the gerund: the -ing word doing a noun's job.", p(i, { k: 1 }), tapWords(m.s, m.g, [{ phrase: m.p, mistake: "pg-mixup" }]));
  },
  "concrete|understand": (rng, g) => {
    const [i, m] = entry(rng, MIXED, g);
    return doIt(base("c-understand", "concrete", "understand", "find the participle", rng), "Tap the participle: the -ing word describing someone or something.", p(i, { k: 1 }), tapWords(m.s, m.p, [{ phrase: m.g, mistake: "pg-mixup" }]));
  },
  "concrete|apply": (rng, g) => {
    const [i, x] = entry(rng, PREP, g);
    return doIt(
      base("c-apply", "concrete", "apply", "-ing after a preposition", rng),
      `Build the sentence with the right form of '${x.v}'. (Not every tile is needed.)`,
      p(i, { k: 2 }),
      tiles(rng, `${x.before} | ${x.ing} | ${x.after} | .`, [`to ${x.v}`, x.v], [
        { text: `${x.before} to ${x.v} ${x.after}.`, mistake: "pg-infinitive-after-prep" },
        { text: `${x.before} ${x.v} ${x.after}.`, mistake: "pg-form" },
      ])
    );
  },
  "concrete|analyze": (rng, g) => {
    const [i, j] = entry(rng, JOIN, g);
    return doIt(
      base("c-analyze", "concrete", "analyze", "join with a participle", rng),
      `Join with a participle: '${j.a} ${j.b}' (Not every tile is needed.)`,
      p(i, { k: 3 }),
      tiles(rng, j.tiles, [j.spare], [{ text: j.form, mistake: "pg-form" }])
    );
  },
  "concrete|evaluate": (rng, g) => {
    const [i, x] = entry(rng, PATTERN, g);
    return doIt(base("c-evaluate", "concrete", "evaluate", "verbs followed by -ing", rng), "Tap the words that are wrong in this sentence.", p(i, { k: 4 }), tapWords(x.wrong, x.bad));
  },

  // ---------------- PICTORIAL ----------------
  "pictorial|remember": (rng, g) => {
    const [i, x] = entry(rng, ING, g);
    const right = ROLE_LABEL[x.role];
    return choose(
      base("p-remember", "pictorial", "remember", "gerund, participle or verb", rng),
      "What is the highlighted word?",
      card([markWord(x.s, x.w)]),
      p(i),
      right,
      [
        ...(Object.entries(ROLE_LABEL) as [Role, string][]).filter(([r]) => r !== x.role).map(([r, text]) => ({ text, mistake: r === "verb" || x.role === "verb" ? "pg-continuous" : "pg-mixup" })),
        { text: "A noun that isn't made from a verb", mistake: "pg-mixup" },
      ]
    );
  },
  "pictorial|understand": (rng, g) => {
    const [k, x] = entryIn(rng, ING, (y) => y.role === "gerund", g);
    const right = JOB_LABEL[x.job!];
    return choose(
      base("p-understand", "pictorial", "understand", "the gerund's job", rng),
      "What job does the highlighted gerund do?",
      card([markWord(x.s, x.w)]),
      p(k),
      right,
      Object.values(JOB_LABEL).filter((t) => t !== right).map((text) => ({ text, mistake: "pg-function" }))
    );
  },
  "pictorial|apply": (rng, g) => {
    const [i, x] = entry(rng, PREP, g);
    return choose(
      base("p-apply", "pictorial", "apply", "-ing after a preposition", rng),
      `Which form of '${x.v}' fills the gap?`,
      card([`${x.before} ___ ${x.after}.`]),
      p(i, { k: 2 }),
      x.ing,
      [
        { text: `to ${x.v}`, mistake: "pg-infinitive-after-prep" },
        { text: x.v, mistake: "pg-form" },
        { text: x.past, mistake: "pg-form" },
      ]
    );
  },
  "pictorial|analyze": (rng, g) => {
    const [i, j] = entry(rng, JOIN, g);
    return choose(
      base("p-analyze", "pictorial", "analyze", "join with a participle", rng),
      "Join these two sentences using a participle.",
      card([j.a, j.b]),
      p(i, { k: 3 }),
      j.right,
      [
        { text: j.dangling, mistake: "pg-dangling" },
        { text: j.form, mistake: "pg-form" },
        { text: `${j.a.replace(/\.$/, "")}, ${j.b.charAt(0).toLowerCase()}${j.b.slice(1)}`, mistake: "pg-not-joined" },
      ]
    );
  },
  "pictorial|evaluate": (rng, g) => {
    const [i, x] = entry(rng, ING, g);
    const said: Role = g && Number.isInteger(g.s) ? (["gerund", "participle", "verb"] as Role[])[g.s] : pick(rng, ["gerund", "participle", "verb"] as Role[]);
    const NAME: Record<Role, string> = { gerund: "a gerund", participle: "a participle", verb: "part of the verb" };
    const right = said === x.role ? "Yes, she is right" : `No, it is ${NAME[x.role]}`;
    const opts = ["Yes, she is right", ...(Object.keys(NAME) as Role[]).filter((r) => r !== said).map((r) => `No, it is ${NAME[r]}`), "No, it is an ordinary noun"];
    return choose(
      base("p-evaluate", "pictorial", "evaluate", "judge gerund or participle", rng),
      `Riya says the highlighted word is ${NAME[said]}. Is she right?`,
      card([markWord(x.s, x.w)]),
      p(i, { s: ["gerund", "participle", "verb"].indexOf(said) }),
      right,
      opts.filter((o) => o !== right).map((text) => ({ text, mistake: x.role === "verb" || text.includes("verb") ? "pg-continuous" : "pg-mixup" }))
    );
  },

  // ---------------- ABSTRACT ----------------
  "abstract|remember": (rng, g) => {
    const [i, d] = entry(rng, DEFS, g);
    return choose(base("a-remember", "abstract", "remember", "what they are", rng), d.q, null, p(i, { k: 5 }), d.a, d.w);
  },
  "abstract|understand": (rng, g) => {
    const [i, x] = entry(rng, ING, g);
    const NAME: Record<Role, string> = { gerund: "Gerund", participle: "Participle", verb: "Part of a continuous verb" };
    return choose(
      base("a-understand", "abstract", "understand", "gerund or participle", rng),
      `${x.s} What is '${x.w}' here?`,
      null,
      p(i),
      NAME[x.role],
      [...(Object.entries(NAME) as [Role, string][]).filter(([r]) => r !== x.role).map(([r, text]) => ({ text, mistake: r === "verb" || x.role === "verb" ? "pg-continuous" : "pg-mixup" })), { text: "Infinitive", mistake: "pg-form" }]
    );
  },
  "abstract|apply": (rng, g) => {
    const [i, x] = entry(rng, PATTERN, g);
    const v = x.bad.replace(/^to /, "");
    return choose(
      base("a-apply", "abstract", "apply", "verbs followed by -ing", rng),
      `Correct the sentence: ${x.wrong}`,
      null,
      p(i, { k: 4 }),
      x.wrong.replace(x.bad, x.right),
      [
        { text: x.wrong, mistake: "pg-verb-pattern" },
        { text: x.wrong.replace(x.bad, v), mistake: "pg-form" },
        { text: x.wrong.replace(x.bad, `to ${x.right}`), mistake: "pg-verb-pattern" },
      ]
    );
  },
  "abstract|analyze": (rng, g) => {
    const [i, f] = entry(rng, FEEL, g);
    return choose(
      base("a-analyze", "abstract", "analyze", "-ing or -ed adjective", rng),
      `Fill the gap: ${f.s}`,
      null,
      p(i, { k: 6 }),
      f.want === "ing" ? f.ing : f.ed,
      [
        { text: f.want === "ing" ? f.ed : f.ing, mistake: "pg-ing-ed" },
        { text: f.base, mistake: "pg-form" },
        { text: f.noun, mistake: "pg-form" },
      ]
    );
  },
  "abstract|evaluate": (rng, g) => {
    const [i, x] = entryIn(rng, ING, (y) => y.role === "gerund", g);
    const parts = shuffle(rng, ING.filter((y) => y.role === "participle")).slice(0, 2);
    const verb = pick(rng, ING.filter((y) => y.role === "verb"));
    return choose(
      base("a-evaluate", "abstract", "evaluate", "spot the gerund", rng),
      "Which sentence has a gerund (an -ing word doing a noun's job)?",
      null,
      p(i, { j: ING.indexOf(parts[0]) }),
      x.s,
      [
        { text: parts[0].s, mistake: "pg-mixup" },
        { text: parts[1].s, mistake: "pg-mixup" },
        { text: verb.s, mistake: "pg-continuous" },
      ]
    );
  },
};

/** For the stress test: the right forms come from the banks. */
export function verify(it: { cpa: string; bloom: string; params: Record<string, number>; choices: { id: string; text: string }[]; correctChoiceId: string }): string | null {
  const cell = `${it.cpa}|${it.bloom}`;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  if (cell === "pictorial|apply" && !/ing$/.test(right)) return `after a preposition the answer should end in -ing: ${right}`;
  if (cell === "abstract|apply" && /\bto \w+ing\b|enjoys to|avoids to/.test(right)) return `still wrong: ${right}`;
  if (cell === "abstract|evaluate" && !ING.some((x) => x.s === right && x.role === "gerund")) return "right answer should be a gerund sentence";
  return null;
}
