import { Misconceptions, SkillTopic } from "../skillTopic.js";

/** Spectrum Language Arts Grade 7, Lessons 1.10–1.17: verbs, agreement, verbals, tenses. */
export const MISCONCEPTIONS: Misconceptions = {
  "la-sv-agree": { label: "Subject and verb don't agree", detail: "Writes The list of names are long / The boys runs.", childTip: "Find the real subject (not the words after 'of'): The list ... is long. Singular subject, singular verb." },
  "la-verb-kind": { label: "Mixes up kinds of verbs", detail: "Confuses action, linking and helping verbs, or transitive and intransitive.", childTip: "Linking verbs join the subject to a description (is, seems, became). Helping verbs come before a main verb (has eaten). A transitive verb has an object (kicked the ball)." },
  "la-verbal": { label: "Mixes up gerunds, participles and infinitives", detail: "Can't tell an -ing noun from an -ing describer, or misses 'to + verb'.", childTip: "Gerund: -ing as a noun (Swimming is fun). Participle: describes (the running water). Infinitive: to + verb (to swim)." },
  "la-tense": { label: "Uses the wrong tense", detail: "Mixes up simple, progressive and perfect tenses, or switches tense in a sentence.", childTip: "Progressive: be + -ing (is running). Perfect: has/have/had + past participle (has run). Keep one time frame in a sentence." },
  "la-irregular": { label: "Uses a wrong irregular form", detail: "Writes has went, had wrote, swimmed.", childTip: "Learn the three forms: go–went–gone, write–wrote–written, swim–swam–swum." },
};

export const VERBS: SkillTopic = {
  topic: "l7-verbs",
  prefix: "lvb7",
  c1: [
    { s: "The eagle swooped down and grabbed a fish.", prompt: "Tap the two action verbs.", target: ["swooped", "grabbed"] },
    { s: "The soup smells delicious tonight.", prompt: "Tap the linking verb.", target: "smells", wrong: [{ phrase: "delicious", mistake: "la-verb-kind" }] },
    { s: "We have been waiting for the bus since noon.", prompt: "Tap the two helping verbs.", target: ["have", "been"], wrong: [{ phrase: "waiting", mistake: "la-verb-kind" }] },
    { s: "Arjun kicked the ball over the fence.", prompt: "Tap the direct object of the transitive verb 'kicked'.", target: "the ball", wrong: [{ phrase: "the fence.", mistake: "la-verb-kind" }] },
    { s: "My grandmother seems tired after the long trip.", prompt: "Tap the linking verb.", target: "seems", wrong: [{ phrase: "tired", mistake: "la-verb-kind" }] },
  ],
  c2: [
    { s: "Swimming is my favourite sport.", prompt: "Tap the gerund (an -ing word used as a noun).", target: "Swimming" },
    { s: "The barking dog woke the baby.", prompt: "Tap the participle (a verb form used as an adjective).", target: "barking" },
    { s: "Leela wants to learn the guitar.", prompt: "Tap the infinitive.", target: "to learn", wrong: [{ phrase: "wants", mistake: "la-verbal" }] },
    { s: "The broken window was fixed quickly.", prompt: "Tap the participle.", target: "broken", wrong: [{ phrase: "fixed", mistake: "la-verbal" }] },
    { s: "We enjoyed hiking in the hills.", prompt: "Tap the gerund.", target: "hiking", wrong: [{ phrase: "enjoyed", mistake: "la-verbal" }] },
  ],
  c3: [
    { prompt: "Build the sentence so the verb agrees with its subject.", answer: "The basket of apples | is | on the table | .", spares: ["are"], wrong: [["The basket of apples are on the table.", "la-sv-agree"]] },
    { prompt: "Build the sentence so the verb agrees.", answer: "Neither the cat nor the dogs | are | hungry | .", spares: ["is"], wrong: [["Neither the cat nor the dogs is hungry.", "la-sv-agree"]] },
    { prompt: "Build the sentence so the verb agrees.", answer: "The team | wins | most of its matches | .", spares: ["win"], wrong: [["The team win most of its matches.", "la-sv-agree"]] },
    { prompt: "Build the sentence so the verb agrees.", answer: "Each of the players | has | a jersey | .", spares: ["have"], wrong: [["Each of the players have a jersey.", "la-sv-agree"]] },
  ],
  c4: [
    { prompt: "Build the sentence in the present perfect tense.", answer: "She | has written | three stories | this year | .", spares: ["has wrote", "is writing"], wrong: [["She has wrote three stories this year.", "la-irregular"], ["She is writing three stories this year.", "la-tense"]] },
    { prompt: "Build the sentence in the past progressive tense.", answer: "We | were watching | a film | when the lights went out | .", spares: ["watched", "have watched"], wrong: [["We watched a film when the lights went out.", "la-tense"], ["We have watched a film when the lights went out.", "la-tense"]] },
    { prompt: "Build the sentence in the past perfect tense.", answer: "The train | had left | before we reached the station | .", spares: ["has left", "had leaved"], wrong: [["The train has left before we reached the station.", "la-tense"], ["The train had leaved before we reached the station.", "la-irregular"]] },
    { prompt: "Build the sentence in the future progressive tense.", answer: "Tomorrow at noon, | I | will be flying | to Delhi | .", spares: ["will fly", "am flying"], wrong: [["Tomorrow at noon, I will fly to Delhi.", "la-tense"]] },
  ],
  c5: [
    { s: "The flowers in the vase needs water.", bad: "needs", mistake: "la-sv-agree" },
    { s: "He has went to the library already.", bad: "went", mistake: "la-irregular" },
    { s: "Yesterday she swimmed across the lake.", bad: "swimmed", mistake: "la-irregular" },
    { s: "The box of crayons are missing.", bad: "are", mistake: "la-sv-agree" },
    { s: "By next week, I had finished the project.", bad: "had", mistake: "la-tense" },
  ],
  p1: [
    { line: "The baby [[slept]] peacefully.", q: "Is the highlighted verb transitive or intransitive?", a: "Intransitive: it has no object", w: ["Transitive: it has an object", "It is a linking verb", "It is a helping verb"], m: "la-verb-kind" },
    { line: "Priya [[painted]] a mural on the wall.", q: "Is the highlighted verb transitive or intransitive?", a: "Transitive: 'a mural' is its object", w: ["Intransitive: it has no object", "It is a linking verb", "It is a gerund"], m: "la-verb-kind" },
    { line: "The milk [[turned]] sour overnight.", q: "What kind of verb is highlighted?", a: "A linking verb: it joins 'milk' to 'sour'", w: ["An action verb with an object", "A helping verb", "An infinitive"], m: "la-verb-kind" },
    { line: "They [[will]] arrive soon.", q: "What kind of verb is highlighted?", a: "A helping verb", w: ["A linking verb", "A main action verb", "A participle"], m: "la-verb-kind" },
  ],
  p2: [
    { line: "[[Reading]] before bed helps me relax.", q: "What is the highlighted word?", a: "A gerund: an -ing word used as a noun", w: ["A participle", "An infinitive", "A helping verb"], m: "la-verbal" },
    { line: "The [[smiling]] child waved at us.", q: "What is the highlighted word?", a: "A participle: it describes the child", w: ["A gerund", "An infinitive", "A linking verb"], m: "la-verbal" },
    { line: "My goal is [[to finish]] the marathon.", q: "What is highlighted?", a: "An infinitive", w: ["A gerund", "A participle", "A helping verb"], m: "la-verbal" },
    { line: "The [[frozen]] lake sparkled.", q: "What is the highlighted word?", a: "A past participle used as an adjective", w: ["A gerund", "An infinitive", "The main verb"], m: "la-verbal" },
  ],
  p3: [
    { line: "Right now the children [[are building]] a sandcastle.", q: "Which tense is highlighted?", a: "Present progressive", w: ["Present perfect", "Simple present", "Past progressive"], m: "la-tense" },
    { line: "We [[have lived]] here for six years.", q: "Which tense is highlighted?", a: "Present perfect", w: ["Simple past", "Past perfect", "Present progressive"], m: "la-tense" },
    { line: "By the time we arrived, the film [[had started]].", q: "Which tense is highlighted?", a: "Past perfect", w: ["Present perfect", "Simple past", "Future perfect"], m: "la-tense" },
    { line: "Next June, they [[will have finished]] school.", q: "Which tense is highlighted?", a: "Future perfect", w: ["Simple future", "Present perfect", "Future progressive"], m: "la-tense" },
  ],
  p4: [
    { line: "The pile of books [[are]] heavy.", q: "Is the highlighted verb right?", a: "No: the subject is 'pile', so it should be 'is'", w: ["Yes: 'books' is plural", "No: it should be 'were'", "Yes: 'are' always follows 'of'"], m: "la-sv-agree" },
    { line: "Mathematics [[is]] my strongest subject.", q: "Is the highlighted verb right?", a: "Yes: 'mathematics' is singular", w: ["No: it should be 'are'", "No: it should be 'were'", "No: 'mathematics' is plural"], m: "la-sv-agree" },
    { line: "She [[has wrote]] a letter to the editor.", q: "Is the highlighted verb right?", a: "No: it should be 'has written'", w: ["Yes: it is present perfect", "No: it should be 'have wrote'", "No: it should be 'has write'"], m: "la-irregular" },
  ],
  p5: [
    { q: "\"In 'The cake looks delicious', 'looks' is an action verb.\"", a: "No: it is a linking verb joining 'cake' to 'delicious'", w: ["Yes: the cake is looking", "Yes: all verbs show action", "No: it is a helping verb"], m: "la-verb-kind" },
    { q: "\"'Running' in 'Running is fun' is a gerund.\"", a: "Yes: it is an -ing word used as a noun", w: ["No: it is a participle", "No: it is an infinitive", "No: it is the main verb"], m: "la-verbal" },
    { q: "\"'They have been working' is the present perfect progressive.\"", a: "Yes: have been + -ing", w: ["No: it is simple past", "No: it is past perfect", "No: it is future"], m: "la-tense" },
  ],
  a1: [
    { q: "A transitive verb ___", a: "has a direct object that receives the action", w: ["never has an object", "links the subject to a description", "always comes before another verb"], m: "la-verb-kind" },
    { q: "The perfect tenses are formed with ___", a: "has, have or had + the past participle", w: ["is, am or are + -ing", "will + the base verb", "did + the base verb"], m: "la-tense" },
    { q: "An infinitive is ___", a: "to + the base form of a verb (to run)", w: ["a verb ending in -ing", "a verb with no subject", "a verb in the past tense"], m: "la-verbal" },
    { q: "In 'The list of chores is long', the subject is ___", a: "list", w: ["chores", "long", "is"], m: "la-sv-agree" },
  ],
  a2: [
    { q: "Fill the gap: The players on the team ___ excited.", a: "are", w: ["is", "was", "be"], m: "la-sv-agree" },
    { q: "Fill the gap: By tomorrow, I ___ the whole book.", a: "will have read", w: ["had read", "have read", "was reading"], m: "la-tense" },
    { q: "Fill the gap: The bell ___ (ring) before we sat down.", a: "had rung", w: ["had rang", "has ringed", "had ringed"], m: "la-irregular" },
    { q: "Fill the gap: Either Ravi or his sisters ___ coming.", a: "are", w: ["is", "was", "has"], m: "la-sv-agree" },
    { q: "Fill the gap: While I ___ dinner, the phone rang.", a: "was cooking", w: ["am cooking", "have cooked", "will cook"], m: "la-tense" },
  ],
  a4: [
    { q: "Which sentence is correct?", a: "The news is good today.", w: ["The news are good today.", "The news were good today.", "The news have good today."], m: "la-sv-agree" },
    { q: "Which sentence is correct?", a: "We had already eaten when they arrived.", w: ["We had already ate when they arrived.", "We have already eaten when they arrived.", "We had already eat when they arrived."], m: "la-irregular" },
    { q: "Which sentence uses a verb tense consistently?", a: "She opened the door and walked in.", w: ["She opens the door and walked in.", "She opened the door and walks in.", "She will open the door and walked in."], m: "la-tense" },
    { q: "Which sentence has an intransitive verb?", a: "The guests laughed loudly.", w: ["The guests ate the cake.", "The guests bought a gift.", "The guests carried chairs."], m: "la-verb-kind" },
  ],
};
