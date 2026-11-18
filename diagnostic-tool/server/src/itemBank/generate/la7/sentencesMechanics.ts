import { Misconceptions, SkillTopic } from "../skillTopic.js";

/** Spectrum Language Arts Grade 7, Chapters 2–3: sentences; capitalization. */
export const MISCONCEPTIONS: Misconceptions = {
  "la-sentence-type": { label: "Mixes up sentence types", detail: "Confuses declarative, interrogative, imperative and exclamatory sentences, or simple/compound/complex.", childTip: "Declarative tells, interrogative asks, imperative commands, exclamatory shows strong feeling. Simple: one clause; compound: two joined by and/but/or; complex: a main clause + a dependent clause." },
  "la-clause": { label: "Can't find the adjective or adverb clause", detail: "Marks the main clause, or misjudges what the clause describes.", childTip: "Adjective clauses start with who, which, that and describe a noun. Adverb clauses start with when, because, if and tell when, why or how." },
  "la-run-on": { label: "Writes run-ons or fragments", detail: "Joins two sentences with just a comma, or leaves half a sentence.", childTip: "Two complete thoughts need a full stop, a semicolon, or a comma + and/but/so. A fragment is missing a subject or a verb." },
  "la-capital": { label: "Misses or adds capital letters", detail: "Leaves names, titles, places, days, languages in small letters, or capitalises common nouns and seasons.", childTip: "Capitalise names of particular people, places, days, months, holidays, languages and titles (but not seasons or common nouns like 'my aunt')." },
  "la-capital-quote": { label: "Mis-capitalises quotations or letter parts", detail: "Writes a small letter at the start of a quotation, or capitalises every word of a letter closing.", childTip: "A full quotation starts with a capital. In a letter, capitalise the greeting (Dear Sir) and only the first word of the closing (Yours sincerely)." },
};

export const SENTENCES: SkillTopic = {
  topic: "l7-sentences",
  prefix: "lsn7",
  c1: [
    { s: "The boy who lives next door plays the violin.", prompt: "Tap every word of the adjective clause.", target: "who lives next door", wrong: [{ phrase: "plays the violin.", mistake: "la-clause" }] },
    { s: "We left early because the roads were busy.", prompt: "Tap every word of the adverb clause.", target: "because the roads were busy.", wrong: [{ phrase: "We left early", mistake: "la-clause" }] },
    { s: "When the rain stopped, the children ran outside.", prompt: "Tap every word of the adverb clause.", target: "When the rain stopped,", wrong: [{ phrase: "the children ran outside.", mistake: "la-clause" }] },
    { s: "The book that I borrowed is overdue.", prompt: "Tap every word of the adjective clause.", target: "that I borrowed", wrong: [{ phrase: "is overdue.", mistake: "la-clause" }] },
  ],
  c3: [
    { prompt: "Join into one compound sentence.", answer: "The bell rang | , | and | the students | left | .", spares: ["because"], wrong: [["The bell rang, because the students left.", "la-sentence-type"]] },
    { prompt: "Join into one complex sentence.", answer: "Although | it was cold | , | we | went swimming | .", spares: ["and", "but"], wrong: [["Although it was cold, but we went swimming.", "la-run-on"]] },
    { prompt: "Fix the run-on: build one correct sentence.", answer: "I love mangoes | ; | my sister | prefers grapes | .", spares: [","], wrong: [["I love mangoes, my sister prefers grapes.", "la-run-on"]] },
    { prompt: "Join into one complex sentence.", answer: "The dog | that barked all night | is | our neighbour's | .", spares: ["and"], wrong: [] },
  ],
  c5: [
    { s: "Because the shop was closed.", bad: "Because", mistake: "la-run-on", prompt: "This is a fragment, not a sentence. Tap the word that makes it depend on another clause." },
    { s: "It was late, we went home.", bad: "late,", mistake: "la-run-on", prompt: "This is a run-on. Tap the word where the comma joins two sentences wrongly." },
    { s: "Wow, what a beautiful sunset?", bad: "sunset?", mistake: "la-sentence-type", prompt: "The end mark is wrong for this kind of sentence. Tap it." },
  ],
  p1: [
    { line: "Please close the window.", q: "What type of sentence is this?", a: "Imperative", w: ["Declarative", "Interrogative", "Exclamatory"], m: "la-sentence-type" },
    { line: "What an exciting match that was!", q: "What type of sentence is this?", a: "Exclamatory", w: ["Imperative", "Declarative", "Interrogative"], m: "la-sentence-type" },
    { line: "Have you finished your project?", q: "What type of sentence is this?", a: "Interrogative", w: ["Declarative", "Imperative", "Exclamatory"], m: "la-sentence-type" },
    { line: "The library opens at nine.", q: "What type of sentence is this?", a: "Declarative", w: ["Imperative", "Interrogative", "Exclamatory"], m: "la-sentence-type" },
  ],
  p2: [
    { line: "I wanted to play, but it was raining.", q: "What kind of sentence is this?", a: "Compound", w: ["Simple", "Complex", "A fragment"], m: "la-sentence-type" },
    { line: "When the bell rings, line up at the door.", q: "What kind of sentence is this?", a: "Complex", w: ["Simple", "Compound", "A run-on"], m: "la-sentence-type" },
    { line: "My cousin and I built a kite.", q: "What kind of sentence is this?", a: "Simple", w: ["Compound", "Complex", "A run-on"], m: "la-sentence-type" },
    { line: "The girl who sang first won the prize.", q: "What kind of sentence is this?", a: "Complex", w: ["Simple", "Compound", "A fragment"], m: "la-sentence-type" },
  ],
  p3: [
    { line: "The house [[where I grew up]] is now a shop.", q: "What does the highlighted clause do?", a: "It is an adjective clause describing 'house'", w: ["It is an adverb clause telling when", "It is the main clause", "It is a prepositional phrase"], m: "la-clause" },
    { line: "She smiled [[as soon as she saw the gift]].", q: "What does the highlighted clause do?", a: "It is an adverb clause telling when", w: ["It is an adjective clause describing 'she'", "It is the main clause", "It is an appositive"], m: "la-clause" },
    { line: "The film was long, everyone fell asleep.", q: "What is wrong with this sentence?", a: "It is a run-on: two sentences joined by only a comma", w: ["Nothing: it is correct", "It is a fragment", "It has no verb"], m: "la-run-on" },
  ],
  p5: [
    { q: "\"'Running through the park on a sunny day.' is a complete sentence.\"", a: "No: it is a fragment with no subject or main verb", w: ["Yes: it has a verb", "Yes: it ends with a full stop", "No: it is a run-on"], m: "la-run-on" },
    { q: "\"A compound sentence has a main clause and a dependent clause.\"", a: "No: that is a complex sentence; compound has two main clauses", w: ["Yes: that is correct", "No: a compound sentence has one clause", "No: a compound sentence has no verb"], m: "la-sentence-type" },
  ],
  a1: [
    { q: "An imperative sentence ___", a: "gives a command or makes a request", w: ["asks a question", "shows strong feeling", "states a fact"], m: "la-sentence-type" },
    { q: "A complex sentence has ___", a: "one main clause and at least one dependent clause", w: ["two main clauses", "only one clause", "no verb"], m: "la-sentence-type" },
    { q: "An adjective clause usually begins with ___", a: "who, whom, whose, which or that", w: ["because, when or if", "and, but or or", "in, on or at"], m: "la-clause" },
  ],
  a2: [
    { q: "Fix the run-on 'I was tired I went to bed.' Which is correct?", a: "I was tired, so I went to bed.", w: ["I was tired, I went to bed.", "I was tired so, I went to bed.", "I was tired I, went to bed."], m: "la-run-on" },
    { q: "Which is a complete sentence?", a: "The parade began at noon.", w: ["Because the parade began at noon.", "The parade at noon.", "Beginning at noon with music."], m: "la-run-on" },
    { q: "Fill the gap to make a complex sentence: ___ it rained, the match went on.", a: "Although", w: ["And", "But", "So"], m: "la-sentence-type" },
  ],
  a4: [
    { q: "Which sentence is compound?", a: "The sun set, and the stars came out.", w: ["The sun set behind the hills.", "After the sun set, the stars came out.", "The stars that came out were bright."], m: "la-sentence-type" },
    { q: "Which sentence has an adverb clause?", a: "We cheered when the team scored.", w: ["The team that scored is ours.", "The team scored and we cheered.", "Our team scored twice."], m: "la-clause" },
    { q: "Which sentence is punctuated correctly?", a: "The bus was late; we walked to school.", w: ["The bus was late, we walked to school.", "The bus was late we walked to school.", "The bus was late; and, we walked to school."], m: "la-run-on" },
  ],
};

export const CAPITALS: SkillTopic = {
  topic: "l7-capitals",
  prefix: "lcp7",
  c1: [
    { s: "last summer my aunt took us to paris to see the eiffel tower.", prompt: "Tap every word that needs a capital letter.", target: ["last", "paris", "eiffel", "tower."], wrong: [{ phrase: ["last", "summer", "paris", "eiffel", "tower."], mistake: "la-capital" }, { phrase: ["last", "aunt", "paris", "eiffel", "tower."], mistake: "la-capital" }] },
    { s: "on monday we will celebrate diwali with our friends from kerala.", prompt: "Tap every word that needs a capital letter.", target: ["on", "monday", "diwali", "kerala."] },
    { s: "we read a chapter of the jungle book in english class.", prompt: "Tap every word that needs a capital letter.", target: ["we", "jungle", "book", "english"], wrong: [{ phrase: ["we", "jungle", "book", "english", "class."], mistake: "la-capital" }] },
    { s: "dr mehta works at the city hospital on gandhi road.", prompt: "Tap every word that needs a capital letter.", target: ["dr", "mehta", "city", "hospital", "gandhi", "road."] },
  ],
  c3: [
    { prompt: "Build the sentence with correct capitals.", answer: "Ravi said, | 'The match | starts at four.' ", spares: ["'the match"], wrong: [["Ravi said, 'the match starts at four.'", "la-capital-quote"]] },
    { prompt: "Build the letter closing correctly.", answer: "Yours | sincerely, ", spares: ["Sincerely,"], wrong: [["Yours Sincerely,", "la-capital-quote"]] },
    { prompt: "Build the sentence with correct capitals.", answer: "In | spring, | we visit | Grandma | in | Shimla | .", spares: ["Spring,", "grandma"], wrong: [["In Spring, we visit Grandma in Shimla.", "la-capital"]] },
  ],
  c5: [
    { s: "We go to the beach every Summer.", bad: "Summer.", mistake: "la-capital" },
    { s: "My Uncle lives in Chennai.", bad: "Uncle", mistake: "la-capital" },
    { s: "She whispered, \"we must hurry.\"", bad: "\"we", mistake: "la-capital-quote" },
    { s: "The river ganges flows past Varanasi.", bad: "ganges", mistake: "la-capital" },
  ],
  p1: [
    { line: "We met [[Mom]] at the station.", q: "Is the capital in the highlighted word right?", a: "Yes: 'Mom' is used as a name here", w: ["No: it should be 'mom'", "No: family words are never capitalised", "No: only the first word is capitalised"], m: "la-capital" },
    { line: "I asked my [[Mother]] for help.", q: "Is the capital in the highlighted word right?", a: "No: after 'my' it is a common noun, 'mother'", w: ["Yes: always capitalise Mother", "Yes: it is a title", "No: it should be 'MOTHER'"], m: "la-capital" },
    { line: "We study [[French]] and [[science]].", q: "Are the highlighted words right?", a: "Yes: languages take capitals; school subjects don't", w: ["No: both need capitals", "No: neither needs a capital", "No: 'science' needs a capital"], m: "la-capital" },
    { line: "[[Dear]] Ms Sen,", q: "Is the capital in the greeting right?", a: "Yes: the first word of a letter greeting is capitalised", w: ["No: it should be 'dear'", "No: only names are capitalised", "No: 'Ms' should be lower case"], m: "la-capital-quote" },
  ],
  p5: [
    { q: "\"Seasons like winter and summer need capital letters.\"", a: "No: seasons are common nouns", w: ["Yes: they are names", "Yes: like months", "Only winter does"], m: "la-capital" },
    { q: "\"In a title, small words like 'of' and 'the' are usually not capitalised unless they come first.\"", a: "Yes: The Lord of the Rings", w: ["No: every word is capitalised", "No: no word is capitalised", "Only 'of' is capitalised"], m: "la-capital" },
  ],
  a1: [
    { q: "Which of these always needs a capital letter?", a: "The names of days and months", w: ["The names of seasons", "School subjects like maths", "Words like 'aunt' after 'my'"], m: "la-capital" },
    { q: "In a letter closing such as 'Yours sincerely', ___", a: "only the first word is capitalised", w: ["every word is capitalised", "no word is capitalised", "only the last word is capitalised"], m: "la-capital-quote" },
  ],
  a2: [
    { q: "Which is correct?", a: "We visited the Taj Mahal in Agra.", w: ["We visited the taj mahal in Agra.", "We visited the Taj mahal in agra.", "We Visited The Taj Mahal In Agra."], m: "la-capital" },
    { q: "Which is correct?", a: "Mrs Gupta said, \"Open your books.\"", w: ["Mrs Gupta said, \"open your books.\"", "mrs Gupta said, \"Open your books.\"", "Mrs gupta said, \"open your books.\""], m: "la-capital-quote" },
  ],
  a4: [
    { q: "Which title is capitalised correctly?", a: "The Wind in the Willows", w: ["The Wind In The Willows", "the wind in the willows", "The wind in the willows"], m: "la-capital" },
    { q: "Which sentence is correct?", a: "Last Tuesday, Grandpa told us about World War II.", w: ["Last tuesday, Grandpa told us about World war II.", "last Tuesday, grandpa told us about world war II.", "Last Tuesday, Grandpa Told Us About World War II."], m: "la-capital" },
  ],
};
