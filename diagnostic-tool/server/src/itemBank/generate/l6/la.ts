import { Misconceptions, SkillTopic } from "../skillTopic.js";

/**
 * Grade 6 Language Arts (Spectrum Language Arts Grade 6), Chapters 1–6, as
 * nine topics: Chapter 1 in three (nouns and pronouns; verbs; modifiers
 * and joiners), Chapter 4 in two (end marks and commas; other marks).
 * Sentences are our own, in the book's style.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "l6-noun": { label: "Mixes up kinds of nouns or plurals", detail: "Confuses common and proper nouns, or writes 'sheeps', 'foxs', 'babys'.", childTip: "Proper nouns name one particular thing and take a capital. Plurals: add s or es (foxes); y after a consonant → ies (babies); some don't change (sheep) or change inside (mice)." },
  "l6-pronoun-kind": { label: "Mixes up kinds of pronouns", detail: "Confuses intensive, demonstrative, relative and indefinite pronouns.", childTip: "Intensive: -self/-selves for emphasis. Demonstrative: this, that, these, those. Relative: who, whom, whose, which, that. Indefinite: anyone, everybody, several, all." },
  "l6-pronoun-shift": { label: "Shifts pronouns", detail: "Starts with 'I' or 'he' and switches to 'you' for the same person.", childTip: "Keep the same person all the way through: if you start with I, don't switch to you." },
  "l6-demonstrative": { label: "Uses the wrong demonstrative", detail: "Uses 'this' for many things, or 'these' for something far away.", childTip: "Near: this (one), these (many). Far: that (one), those (many)." },
  "l6-relative": { label: "Uses the wrong relative pronoun", detail: "Uses 'which' for people, or 'who' for ownership.", childTip: "Who: people. Which: things. That: people or things. Whose: belonging to." },
  "l6-tense": { label: "Gets present or past tense wrong", detail: "Writes 'catched', 'bited' or 'guessed' wrongly spelt.", childTip: "Regular verbs add -ed. Irregular verbs change: bite–bit, catch–caught, break–broke, fall–fell." },
  "l6-agreement": { label: "Misses subject-verb agreement", detail: "Writes 'Liv and her sister goes' or 'Four blocks is'.", childTip: "Two subjects joined by 'and' take a plural verb. Amounts treated as one (four blocks as a distance) can take a singular verb." },
  "l6-verb-kind": { label: "Mixes up action, helping, linking and transitive verbs", detail: "Calls 'is' an action verb, or misses a verb's direct object.", childTip: "Action: shows doing. Helping: helps the main verb (had been working). Linking: joins subject to a description (seems, is). Transitive: has a direct object (baked a cake)." },
  "l6-verbal": { label: "Mixes up gerunds, participles and infinitives", detail: "Calls a gerund a participle, or misses 'to' in an infinitive.", childTip: "Gerund: -ing word used as a noun (Fixing bikes is fun). Participle: verb form used as an adjective (the crying baby). Infinitive: to + verb (to go)." },
  "l6-modifier": { label: "Mixes up adjectives and adverbs", detail: "Writes 'sings loud', 'did good', or calls an adverb an adjective.", childTip: "Adjectives describe nouns (a loud song). Adverbs describe verbs, adjectives or other adverbs (sang loudly, did well)." },
  "l6-joiner": { label: "Mixes up conjunctions, prepositions, interjections and articles", detail: "Calls 'under' a conjunction, or 'wow' an adverb.", childTip: "Conjunctions join (and, but, because). Prepositions begin phrases showing place or time (in the air). Interjections show emotion (Wow!). Articles: a, an, the." },
  "l6-sentence-type": { label: "Mixes up the four kinds of sentence", detail: "Confuses an imperative with a declarative, or an exclamatory with an interrogative.", childTip: "Declarative tells (.). Interrogative asks (?). Exclamatory shows strong feeling (!). Imperative gives a command or request (. or !)." },
  "l6-structure": { label: "Mixes up simple, compound and complex sentences", detail: "Calls a sentence with 'because' compound, or two joined sentences simple.", childTip: "Simple: one independent clause. Compound: two independent clauses joined (, and / , but / ;). Complex: an independent clause plus a dependent one (because, when, although…)." },
  "l6-fragment": { label: "Misses fragments", detail: "Treats 'Because it was raining.' as a sentence.", childTip: "A fragment is missing a subject or a verb, or doesn't finish its thought. Ask: who did what?" },
  "l6-combine": { label: "Combines sentences wrongly", detail: "Repeats the shared part, or breaks agreement when combining.", childTip: "Say the shared subject, verb, object or adjective once: The cake tasted amazing. The ice cream tasted amazing. → The cake and the ice cream tasted amazing." },
  "l6-caps": { label: "Misses capitals in proper nouns", detail: "Misses capitals in historical events, languages, teams, organisations, government departments, regions, titles or places — or capitalises seasons and directions.", childTip: "Capitalise particular names: the Civil Rights Act, Spanish, the Falcon Strikers, the United Way, the South (a region). Not seasons (summer) or plain directions (travel west)." },
  "l6-end-mark": { label: "Uses the wrong end mark or abbreviation", detail: "Ends a question with a full stop, or writes 'Mrs' and 'BA' without full stops where the book uses them.", childTip: "Questions end with ?, strong feelings with !, statements and commands with a full stop. Abbreviations and initials take full stops (Dr., J.A. Burton)." },
  "l6-comma": { label: "Misses or misplaces commas", detail: "Leaves out commas in a series, between adjectives, in direct address, after a letter's greeting, between clauses, or in set-off dialogue.", childTip: "Commas go: red, blue, and green; a large, green box; Uma, please…; Dear Grandma,; I ran, and she walked; “If you go,” she said, “take a coat.”" },
  "l6-quote": { label: "Punctuates quotations and titles wrongly", detail: "Puts end punctuation outside quotation marks, or puts a movie title in quotation marks.", childTip: "Punctuation of spoken words goes inside the quotation marks. Song, poem and story titles go in quotation marks; book and movie titles are italic or underlined." },
  "l6-apostrophe": { label: "Uses apostrophes wrongly", detail: "Writes 'youl'l', 'can'not', or 'Mrs Flores's' wrongly.", childTip: "The apostrophe replaces missing letters (you will → you'll, cannot → can't) or shows belonging (the dog's bone, the girls' room)." },
  "l6-colon-semi": { label: "Mixes up colons and semicolons", detail: "Uses a colon to join two sentences, or a semicolon before a list.", childTip: "Colon: before a list, an explanation or emphasis, in times (11:35) and after a business greeting (Dear Dr. Wong:). Semicolon: joins two closely related sentences with no conjunction." },
  "l6-hyphen-dash": { label: "Mixes up hyphens, dashes and parentheses", detail: "Uses a hyphen where a dash is needed, or breaks a word at the wrong place.", childTip: "Hyphen: joins words (seven-year-old) or splits a word between syllables at the end of a line (si-lent). Dash: a strong pause. Parentheses: extra information (my grandma's dad)." },
  "l6-pronoun-case": { label: "Uses the wrong pronoun case", detail: "Writes 'Him and me went' or 'between you and I'.", childTip: "Subjective pronouns do the action (I, he, she, we, they). Objective pronouns receive it (me, him, her, us, them)." },
  "l6-tricky": { label: "Mixes up tricky verbs", detail: "Confuses lie/lay, bring/take, sit/set, rise/raise.", childTip: "Lie: rest (no object). Lay: put something down. Bring: towards the speaker. Take: away from the speaker." },
  "l6-negative": { label: "Uses double negatives", detail: "Writes 'doesn't never' or 'don't want nobody'.", childTip: "Use only one negative word: doesn't ever, don't want anybody." },
  "l6-synonym": { label: "Mixes up synonyms, antonyms, homophones and homographs", detail: "Calls opposites synonyms, or uses the wrong sound-alike word.", childTip: "Synonyms: same meaning. Antonyms: opposite. Homophones: sound the same, spelt differently (road/rode). Homographs: spelt the same, different meanings (fair, bow)." },
  "l6-analogy": { label: "Misreads analogies", detail: "Matches the wrong relationship (part–whole vs kind–group).", childTip: "Say how the first pair is related, then find a pair related the same way: German shepherd is a kind of dog, as motorcycle is a kind of vehicle." },
  "l6-connotation": { label: "Misses connotation", detail: "Treats words with the same meaning as if they felt the same (cheap vs inexpensive).", childTip: "Denotation is the dictionary meaning. Connotation is the feeling a word carries: 'inexpensive' sounds better than 'cheap'." },
  "l6-figurative": { label: "Mixes up similes, metaphors and personification", detail: "Calls a metaphor a simile, or misses personification.", childTip: "Simile: like or as. Metaphor: says one thing is another. Personification: gives human actions to a thing (the light danced)." },
  "l6-affix": { label: "Mixes up roots and affixes", detail: "Calls the root the affix, or misreads what a prefix or suffix adds.", childTip: "The root is the main word (flavor). Prefixes go before (semi-), suffixes after (-less), and change the meaning." },
};

// ---------------- 1.1–1.7: Nouns and pronouns ----------------
export const NOUNS_PRONOUNS: SkillTopic = {
  topic: "l6-nouns-pronouns",
  prefix: "lnp6",
  c1: [
    { s: "Axel took his book to his grandparents' house in Shimla.", prompt: "Tap the two proper nouns.", target: ["Axel", "Shimla."], wrong: [{ phrase: "book", mistake: "l6-noun" }] },
    { s: "Callista herself set up the party for her brother.", prompt: "Tap the intensive pronoun.", target: "herself", wrong: [{ phrase: "her", mistake: "l6-pronoun-kind" }] },
    { s: "If someone grabs several bags, there will be enough for everyone.", prompt: "Tap the three indefinite pronouns.", target: ["someone", "several", "everyone."], wrong: [{ phrase: "bags,", mistake: "l6-pronoun-kind" }] },
    { s: "The student who reads the most wins the prize.", prompt: "Tap the relative pronoun.", target: "who", wrong: [{ phrase: "student", mistake: "l6-pronoun-kind" }] },
  ],
  c2: [
    { s: "Those cookies across the room smell delicious.", prompt: "Tap the demonstrative pronoun.", target: "Those", wrong: [{ phrase: "the", mistake: "l6-demonstrative" }] },
    { s: "I thought about it and decided you should always tell the truth.", prompt: "The pronoun shifts. Tap the pronoun that breaks it.", target: "you", wrong: [{ phrase: "I", mistake: "l6-pronoun-shift" }] },
    { s: "The baker whose cakes are the best wins the prize.", prompt: "Tap the relative pronoun that shows belonging.", target: "whose", wrong: [{ phrase: "baker", mistake: "l6-relative" }] },
  ],
  c3: [
    { prompt: "Build the plural.", answer: "three | foxes", spares: ["foxs"], wrong: [["three foxs", "l6-noun"]] },
    { prompt: "Build the sentence with an intensive pronoun.", answer: "The students | themselves | arranged the game.", spares: ["theirselves"], wrong: [["The students theirselves arranged the game.", "l6-pronoun-kind"]] },
    { prompt: "Build the sentence with the right demonstrative.", answer: "Hand me | these | paper clips on the table.", spares: ["this"], wrong: [["Hand me this paper clips on the table.", "l6-demonstrative"]] },
  ],
  c4: [
    { prompt: "Build the sentence with the right relative pronoun.", answer: "The cake | that | wasn't decorated lost.", spares: ["who"], wrong: [["The cake who wasn't decorated lost.", "l6-relative"]] },
    { prompt: "Build the plural.", answer: "two | babies", spares: ["babys"], wrong: [["two babys", "l6-noun"]] },
  ],
  c5: [
    { s: "We saw five sheeps on the hill.", bad: "sheeps", mistake: "l6-noun", prompt: "One plural is wrong. Tap it." },
    { s: "Deja was nervous to join chess club, but you knew he wanted to try.", bad: "you", mistake: "l6-pronoun-shift", prompt: "One pronoun shifts. Tap it." },
    { s: "The singer which won the contest is my cousin.", bad: "which", mistake: "l6-relative", prompt: "One relative pronoun is wrong for a person. Tap it." },
  ],
  p1: [
    { line: "[[Everybody]] wants to watch a movie.", q: "What kind of pronoun is highlighted?", a: "Indefinite", w: ["Intensive", "Demonstrative", "Relative"], m: "l6-pronoun-kind" },
    { line: "I baked the bread [[myself]].", q: "What kind of pronoun is highlighted?", a: "Intensive", w: ["Indefinite", "Relative", "Demonstrative"], m: "l6-pronoun-kind" },
    { line: "[[That]] ball on the far field is mine.", q: "What kind of pronoun is highlighted?", a: "Demonstrative", w: ["Relative", "Indefinite", "Intensive"], m: "l6-pronoun-kind" },
    { line: "The shelves, [[which]] were the closest, held the books.", q: "What kind of pronoun is highlighted?", a: "Relative", w: ["Demonstrative", "Intensive", "Indefinite"], m: "l6-pronoun-kind" },
  ],
  p5: [
    { q: "\"'Mice' is the regular plural of 'mouse'.\"", a: "No: 'mice' is an irregular plural", w: ["Yes: just add s", "Yes: all plurals are regular", "No: the plural is 'mouses'"], m: "l6-noun" },
    { q: "\"Use 'this' for one thing that is far away.\"", a: "No: use 'that' for one thing far away; 'this' is for near", w: ["Yes: 'this' is for far things", "Yes: they mean the same", "No: use 'these'"], m: "l6-demonstrative" },
  ],
  a1: [
    { q: "An intensive pronoun ends in ___", a: "-self or -selves", w: ["-ing", "-ly", "-ed"], m: "l6-pronoun-kind" },
    { q: "The plural of 'goose' is ___", a: "geese", w: ["gooses", "geeses", "goose"], m: "l6-noun" },
    { q: "Which relative pronoun shows belonging?", a: "whose", w: ["which", "that", "who"], m: "l6-relative" },
  ],
  a2: [
    { q: "Fill the gap: ___ bracelet on my wrist was a gift.", a: "This", w: ["These", "Those", "Them"], m: "l6-demonstrative" },
    { q: "Fill the gap: The man ___ fixed our roof was kind.", a: "who", w: ["which", "whose", "what"], m: "l6-relative" },
  ],
  a4: [
    { q: "Which sentence has no pronoun shift?", a: "When I study, I remember more.", w: ["When I study, you remember more.", "When we study, you remember more.", "When I study, they remember more of my notes."], m: "l6-pronoun-shift" },
    { q: "Which word is an indefinite pronoun?", a: "anybody", w: ["himself", "which", "these"], m: "l6-pronoun-kind" },
  ],
};

// ---------------- 1.8–1.15: Verbs ----------------
export const VERBS: SkillTopic = {
  topic: "l6-verbs",
  prefix: "lvb6",
  c1: [
    { s: "Mom baked a cake for Isla.", prompt: "Tap the transitive verb and its direct object.", target: ["baked", "cake"], wrong: [{ phrase: "Isla.", mistake: "l6-verb-kind" }] },
    { s: "Ellis had been working on his homework.", prompt: "Tap the helping verbs.", target: ["had", "been"], wrong: [{ phrase: "working", mistake: "l6-verb-kind" }] },
    { s: "The soup seems too salty tonight.", prompt: "Tap the linking verb.", target: "seems", wrong: [{ phrase: "salty", mistake: "l6-verb-kind" }] },
    { s: "My neighbour enjoys fixing bikes.", prompt: "Tap the gerund.", target: "fixing", wrong: [{ phrase: "enjoys", mistake: "l6-verbal" }] },
  ],
  c2: [
    { s: "The crying baby needed a nap.", prompt: "Tap the participle.", target: "crying", wrong: [{ phrase: "needed", mistake: "l6-verbal" }] },
    { s: "The scared kid needed to find his mom.", prompt: "Tap the two words of the infinitive.", target: ["to", "find"], wrong: [{ phrase: "needed", mistake: "l6-verbal" }] },
    { s: "Liv and her sister goes to the temple every weekend.", prompt: "Tap the verb that doesn't agree.", target: "goes", wrong: [{ phrase: "sister", mistake: "l6-agreement" }] },
  ],
  c3: [
    { prompt: "Build the sentence in the past tense.", answer: "Yesterday, I | caught | the bus.", spares: ["catched"], wrong: [["Yesterday, I catched the bus.", "l6-tense"]] },
    { prompt: "Build the sentence in the past tense.", answer: "I | bit | the apple.", spares: ["bited"], wrong: [["I bited the apple.", "l6-tense"]] },
    { prompt: "Build the sentence so the verb agrees.", answer: "Monique | likes | to sing.", spares: ["like"], wrong: [["Monique like to sing.", "l6-agreement"]] },
  ],
  c4: [
    { prompt: "Build a sentence with a gerund as the subject.", answer: "Swimming | keeps | me fit.", spares: ["Swim"], wrong: [["Swim keeps me fit.", "l6-verbal"]] },
    { prompt: "Build the sentence with a helping verb phrase.", answer: "Hayley and her friends | are cheering | on Sunday.", spares: ["is cheering"], wrong: [["Hayley and her friends is cheering on Sunday.", "l6-agreement"]] },
  ],
  c5: [
    { s: "Even though I falled on the ice, I enjoyed sledding.", bad: "falled", mistake: "l6-tense", prompt: "One past-tense verb is wrong. Tap it." },
    { s: "Four blocks are a long way to walk to school.", bad: "are", mistake: "l6-agreement", prompt: "The distance is one amount. Tap the verb that should be 'is'." },
    { s: "I accidentally breaked my mom's vase.", bad: "breaked", mistake: "l6-tense", prompt: "One past-tense verb is wrong. Tap it." },
  ],
  p1: [
    { line: "Kennan loves [[making]] videos.", q: "What is the highlighted word?", a: "A gerund", w: ["A participle", "An infinitive", "A linking verb"], m: "l6-verbal" },
    { line: "The [[broken]] window let in the cold.", q: "What is the highlighted word?", a: "A participle", w: ["A gerund", "An infinitive", "A helping verb"], m: "l6-verbal" },
    { line: "She [[is]] happy with the puzzle.", q: "What kind of verb is highlighted?", a: "A linking verb", w: ["An action verb", "A transitive verb", "A gerund"], m: "l6-verb-kind" },
    { line: "Judd [[hugged]] Mom tightly.", q: "What kind of verb is highlighted?", a: "A transitive verb", w: ["A linking verb", "A helping verb", "A participle"], m: "l6-verb-kind" },
  ],
  p5: [
    { q: "\"In 'We had to cancel our trip', 'trip' is the direct object of 'cancel'.\"", a: "Yes: 'trip' receives the action of 'cancel'", w: ["No: 'we' is the object", "No: 'cancel' has no object", "Yes, and 'had' is a linking verb"], m: "l6-verb-kind" },
    { q: "\"'To go' is a gerund.\"", a: "No: to + verb is an infinitive", w: ["Yes: it is a verb used as a noun", "Yes: it ends in -o", "No: it is a participle"], m: "l6-verbal" },
  ],
  a1: [
    { q: "The past tense of 'guess' is ___", a: "guessed", w: ["guest", "gussed", "guessd"], m: "l6-tense" },
    { q: "A gerund is ___", a: "an -ing verb used as a noun", w: ["to + a verb", "a verb used as an adjective", "a helping verb"], m: "l6-verbal" },
    { q: "Which is a linking verb?", a: "became", w: ["threw", "ran", "wrote"], m: "l6-verb-kind" },
  ],
  a2: [
    { q: "Fill the gap: Neither the coach nor the players ___ ready.", a: "were", w: ["was", "is", "be"], m: "l6-agreement" },
    { q: "Fill the gap: Yesterday, the dog ___ the mail carrier.", a: "bit", w: ["bited", "bitten", "bite"], m: "l6-tense" },
  ],
  a4: [
    { q: "Which sentence has a transitive verb?", a: "Riya wrote a letter.", w: ["Riya smiled.", "Riya is tall.", "Riya slept late."], m: "l6-verb-kind" },
    { q: "Which sentence has an infinitive?", a: "Gavin wanted to play football.", w: ["Gavin played football.", "Playing football is fun.", "The playing field was wet."], m: "l6-verbal" },
  ],
};

// ---------------- 1.16–1.22: Adjectives, adverbs, conjunctions, interjections, prepositions, articles ----------------
export const MODIFIERS: SkillTopic = {
  topic: "l6-modifiers",
  prefix: "lmd6",
  c1: [
    { s: "Wow! That dragonfly is amazing.", prompt: "Tap the interjection.", target: "Wow!", wrong: [{ phrase: "amazing.", mistake: "l6-joiner" }] },
    { s: "The tiny insect caught its prey in the air.", prompt: "Tap the prepositional phrase.", target: "in the air.", wrong: [{ phrase: "The tiny insect", mistake: "l6-joiner" }] },
    { s: "They are neither huge nor mighty.", prompt: "Tap the two words of the conjunction pair.", target: ["neither", "nor"], wrong: [{ phrase: "huge", mistake: "l6-joiner" }] },
    { s: "The dragonfly flies swiftly and silently.", prompt: "Tap the two adverbs.", target: ["swiftly", "silently."], wrong: [{ phrase: "flies", mistake: "l6-modifier" }] },
  ],
  c3: [
    { prompt: "Build the sentence with an adverb.", answer: "He sings | so loudly | that we can't hear the singer.", spares: ["so loud"], wrong: [["He sings so loud that we can't hear the singer.", "l6-modifier"]] },
    { prompt: "Build the sentence with the right modifier.", answer: "I want to do | well | at the recital.", spares: ["good"], wrong: [["I want to do good at the recital.", "l6-modifier"]] },
    { prompt: "Build the sentence with the right article.", answer: "She ate | an | apple and a banana.", spares: ["a"], wrong: [["She ate a apple and a banana.", "l6-joiner"]] },
  ],
  c5: [
    { s: "It was a very badly day: the bus was late.", bad: "badly", mistake: "l6-modifier", prompt: "One word should be an adjective. Tap it." },
    { s: "We waited for a hour at the station.", bad: "a", mistake: "l6-joiner", prompt: "One article is wrong. Tap it." },
  ],
  p1: [
    { line: "The [[measly]] insect is only five centimetres long.", q: "What kind of word is highlighted?", a: "An adjective", w: ["An adverb", "A preposition", "An interjection"], m: "l6-modifier" },
    { line: "You would be [[absolutely]] correct!", q: "What kind of word is highlighted?", a: "An adverb", w: ["An adjective", "A conjunction", "An article"], m: "l6-modifier" },
    { line: "They have three small eyes [[on]] top of their heads.", q: "What kind of word is highlighted?", a: "A preposition", w: ["A conjunction", "An adverb", "An interjection"], m: "l6-joiner" },
    { line: "I was tired, [[but]] I finished my work.", q: "What kind of word is highlighted?", a: "A conjunction", w: ["A preposition", "An article", "An adjective"], m: "l6-joiner" },
  ],
  p5: [
    { q: "\"In 'She runs quickly', 'quickly' describes the noun 'she'.\"", a: "No: it is an adverb describing the verb 'runs'", w: ["Yes: it is an adjective", "Yes: adverbs describe nouns", "No: it is a preposition"], m: "l6-modifier" },
    { q: "\"'Oops!' is an interjection.\"", a: "Yes: it shows sudden feeling", w: ["No: it is a conjunction", "No: it is an article", "Yes, but only in questions"], m: "l6-joiner" },
  ],
  a1: [
    { q: "The articles are ___", a: "a, an and the", w: ["and, but and or", "in, on and at", "wow, oh and hey"], m: "l6-joiner" },
    { q: "A prepositional phrase begins with ___", a: "a preposition", w: ["a verb", "an interjection", "a full stop"], m: "l6-joiner" },
  ],
  a2: [
    { q: "Fill the gap: Please speak ___ in the library.", a: "softly", w: ["soft", "softer", "softness"], m: "l6-modifier" },
    { q: "Fill the gap: I like tea, ___ my brother likes coffee.", a: "but", w: ["under", "wow", "the"], m: "l6-joiner" },
  ],
  a4: [
    { q: "Which sentence uses modifiers correctly?", a: "She did well on the test and felt good.", w: ["She did good on the test and felt well about it good.", "She did goodly on the test.", "She did good on the test and felt badly."], m: "l6-modifier" },
    { q: "Which word is an interjection?", a: "Hooray", w: ["Although", "Beneath", "Quickly"], m: "l6-joiner" },
  ],
};

// ---------------- Chapter 2: Sentences ----------------
export const SENTENCES: SkillTopic = {
  topic: "l6-sentences",
  prefix: "lsn6",
  c1: [
    { s: "Rose wasn't feeling well, so her dad took her to the doctor.", prompt: "This is compound. Tap the word that joins the two clauses.", target: "so", wrong: [{ phrase: "took", mistake: "l6-structure" }] },
    { s: "Whenever it snows, I wear my boots.", prompt: "This is complex. Tap every word of the dependent clause.", target: "Whenever it snows,", wrong: [{ phrase: "I wear my boots.", mistake: "l6-structure" }] },
    { s: "I plan to make Nadia a bracelet. After school tomorrow.", prompt: "Tap every word of the fragment.", target: "After school tomorrow.", wrong: [{ phrase: "I plan to make Nadia a bracelet.", mistake: "l6-fragment" }] },
  ],
  c3: [
    { prompt: "Combine the sentences.", answer: "The cake and the ice cream | tasted | amazing.", spares: ["tastes"], wrong: [["The cake and the ice cream tastes amazing.", "l6-combine"]] },
    { prompt: "Make a compound sentence.", answer: "Quinn loves soccer, | and | Reyna loves the clarinet.", spares: ["because"], wrong: [["Quinn loves soccer, because Reyna loves the clarinet.", "l6-structure"]] },
    { prompt: "Fix the fragment.", answer: "Because it was raining, | we | stayed inside.", spares: ["and"], wrong: [] },
  ],
  c5: [
    { s: "Is that a guinea pig.", bad: "pig.", mistake: "l6-sentence-type", prompt: "The end mark is wrong. Tap the last word." },
    { s: "Look out for that car?", bad: "car?", mistake: "l6-sentence-type", prompt: "The end mark is wrong. Tap the last word." },
  ],
  p1: [
    { line: "Call me after school.", q: "What kind of sentence is this?", a: "Imperative", w: ["Declarative", "Interrogative", "Exclamatory"], m: "l6-sentence-type" },
    { line: "I can't wait to go to the water park!", q: "What kind of sentence is this?", a: "Exclamatory", w: ["Imperative", "Declarative", "Interrogative"], m: "l6-sentence-type" },
    { line: "Sasha took her dog to the park.", q: "What kind of sentence is this?", a: "Declarative", w: ["Imperative", "Exclamatory", "Interrogative"], m: "l6-sentence-type" },
    { line: "Although he was tired, Silas wanted to play dominoes.", q: "What structure is this sentence?", a: "Complex", w: ["Simple", "Compound", "A fragment"], m: "l6-structure" },
  ],
  p2: [
    { line: "My neighbour asked me to mow her lawn, but I promised to help my mom.", q: "What structure is this sentence?", a: "Compound", w: ["Simple", "Complex", "A fragment"], m: "l6-structure" },
    { line: "The old bridge creaked in the wind.", q: "What structure is this sentence?", a: "Simple", w: ["Compound", "Complex", "A fragment"], m: "l6-structure" },
    { line: "After doing the dishes.", q: "What is this?", a: "A fragment", w: ["A simple sentence", "A compound sentence", "A complex sentence"], m: "l6-fragment" },
  ],
  p5: [
    { q: "\"'Before you leave, please help me load the car' is a compound sentence.\"", a: "No: it has a dependent clause, so it is complex", w: ["Yes: it has a comma", "Yes: it has two verbs", "No: it is a fragment"], m: "l6-structure" },
    { q: "\"An imperative sentence can end with a full stop.\"", a: "Yes: most commands and requests end with a full stop", w: ["No: commands always need a question mark", "No: they need no end mark", "Yes, but only questions"], m: "l6-sentence-type" },
  ],
  a1: [
    { q: "A complex sentence has ___", a: "an independent clause and a dependent clause", w: ["two independent clauses only", "no verb", "only one word"], m: "l6-structure" },
    { q: "An interrogative sentence ___", a: "asks a question", w: ["gives a command", "shows strong feeling", "states a fact"], m: "l6-sentence-type" },
  ],
  a2: [
    { q: "Which word begins a dependent clause?", a: "because", w: ["and", "but", "so"], m: "l6-structure" },
    { q: "Fill the gap: I studied hard, ___ I passed the test.", a: "so", w: ["although", "because of", "nor"], m: "l6-structure" },
  ],
  a4: [
    { q: "Which is a complete sentence?", a: "The team won the match.", w: ["Won the match.", "Because the team won.", "The winning team."], m: "l6-fragment" },
    { q: "Which best combines 'Ali paints. Ali sings.'?", a: "Ali paints and sings.", w: ["Ali paints Ali sings.", "Ali and Ali paint and sing.", "Ali paints, Ali, and sings."], m: "l6-combine" },
  ],
};

// ---------------- Chapter 3: Capitalization ----------------
export const CAPITALS: SkillTopic = {
  topic: "l6-capitals",
  prefix: "lcp6",
  c1: [
    { s: "Taj wants to learn spanish before her trip in may.", prompt: "Tap the two words that need capitals.", target: ["spanish", "may."], wrong: [{ phrase: "trip", mistake: "l6-caps" }] },
    { s: "The civil rights act was signed into law in 1964.", prompt: "Tap the three words that need capitals.", target: ["civil", "rights", "act"], wrong: [{ phrase: "law", mistake: "l6-caps" }] },
    { s: "Our team plays the falcon strikers on Sunday.", prompt: "Tap the two words of the team name that need capitals.", target: ["falcon", "strikers"], wrong: [{ phrase: "team", mistake: "l6-caps" }] },
  ],
  c3: [
    { prompt: "Build the sentence with capitals in the right places.", answer: "I would rather swim in the | summer | than in the winter.", spares: ["Summer"], wrong: [["I would rather swim in the Summer than in the winter.", "l6-caps"]] },
    { prompt: "Build the sentence with capitals in the right places.", answer: "The | Vice President | works in Washington, D.C.", spares: ["vice president"], wrong: [] },
  ],
  c5: [
    { s: "Sho always wanted to travel out West to see the desert.", bad: "West", mistake: "l6-caps", prompt: "Here it is just a direction. Tap the word that should be lowercase." },
    { s: "Have you ever been to times Square in New York?", bad: "times", mistake: "l6-caps", prompt: "One word of a place name needs a capital. Tap it." },
    { s: "The united Way helps many people each year.", bad: "united", mistake: "l6-caps", prompt: "One word of an organisation's name needs a capital. Tap it." },
  ],
  p1: [
    { line: "We studied the [[french revolution]] in history class.", q: "What is wrong with the highlighted words?", a: "A historical event needs capitals", w: ["Nothing is wrong", "Only 'revolution' needs a capital", "They need quotation marks"], m: "l6-caps" },
    { line: "My cousin works for the [[Department of Education]].", q: "Why are these words capitalised?", a: "It is the name of a government department", w: ["They start a sentence", "Every noun needs a capital", "It is a season"], m: "l6-caps" },
    { line: "One of my favourite movies is [[Fantastic mr. Fox]].", q: "What is wrong with the highlighted title?", a: "'Mr.' needs a capital", w: ["'Fox' should be lowercase", "'Fantastic' should be lowercase", "Nothing is wrong"], m: "l6-caps" },
  ],
  p5: [
    { q: "\"Names of languages and nationalities, like Hindi and Japanese, need capitals.\"", a: "Yes: they are proper nouns", w: ["No: they are common nouns", "No: only nationalities do", "Yes, but only at the start of a sentence"], m: "l6-caps" },
    { q: "\"'Monday' and 'winter' both need capitals.\"", a: "No: days do, but seasons don't", w: ["Yes: all times need capitals", "No: neither does", "Yes, because they are nouns"], m: "l6-caps" },
  ],
  a1: [
    { q: "Which needs a capital letter?", a: "the Mississippi River", w: ["the river bank", "a wide river", "the river's edge"], m: "l6-caps" },
    { q: "Which is written correctly?", a: "the Midwest", w: ["the midwest", "The midWest", "the mid west"], m: "l6-caps" },
  ],
  a2: [
    { q: "Which is a correctly written team name?", a: "the Mumbai Indians", w: ["the mumbai indians", "the Mumbai indians", "The mumbai Indians"], m: "l6-caps" },
    { q: "Which is a correctly written organisation?", a: "the Red Cross", w: ["the red cross", "the Red cross", "The red Cross"], m: "l6-caps" },
  ],
  a4: [
    { q: "Which sentence is capitalised correctly?", a: "In spring, we visited the Grand Canyon.", w: ["In Spring, we visited the Grand Canyon.", "In spring, we visited the grand canyon.", "In Spring, we visited the grand Canyon."], m: "l6-caps" },
    { q: "Which title is capitalised correctly?", a: "The Lord of the Rings", w: ["The Lord Of The Rings", "the lord of the rings", "The lord of the Rings"], m: "l6-caps" },
  ],
};

// ---------------- 4.1–4.8: End marks, abbreviations and commas ----------------
export const PUNCT_COMMAS: SkillTopic = {
  topic: "l6-punctuation",
  prefix: "lpn6",
  c1: [
    { s: "Uma please ask your brother to help.", prompt: "A comma is missing after one word (direct address). Tap it.", target: "Uma", wrong: [{ phrase: "brother", mistake: "l6-comma" }] },
    { s: "Before we leave I have to pack my suitcase.", prompt: "A comma is missing after one word (introductory clause). Tap it.", target: "leave", wrong: [{ phrase: "suitcase.", mistake: "l6-comma" }] },
    { s: "Carry that large green toy box.", prompt: "A comma is missing between two adjectives. Tap the first one.", target: "large", wrong: [{ phrase: "box.", mistake: "l6-comma" }] },
    { s: "Mrs Flores has a BA in engineering.", prompt: "Tap the abbreviation that is missing its full stop.", target: "Mrs", wrong: [{ phrase: "engineering.", mistake: "l6-end-mark" }] },
  ],
  c3: [
    { prompt: "Build the set-off dialogue.", answer: "“If you go,” | Mom said, | “take a coat.”", spares: ["“Take a coat.”"], wrong: [["“If you go,” Mom said, “Take a coat.”", "l6-comma"]] },
    { prompt: "Build the compound sentence with a comma.", answer: "I called her, | but | she was out.", spares: ["but,"], wrong: [["I called her, but, she was out.", "l6-comma"]] },
    { prompt: "Build the series with commas.", answer: "I packed my suitcase, | took out the trash, | and grabbed my sweater.", spares: [], wrong: [] },
  ],
  c5: [
    { s: "Would you like to babysit this weekend.", bad: "weekend.", mistake: "l6-end-mark", prompt: "The end mark is wrong. Tap the last word." },
    { s: "Dear Grandma I miss you so much.", bad: "Grandma", mistake: "l6-comma", prompt: "A comma is missing after the greeting. Tap the word it belongs after." },
  ],
  p1: [
    { line: "Asher[[,]] did you have fun?", q: "Why is the comma there?", a: "Direct address: Asher is being spoken to", w: ["It separates a series", "It joins two clauses", "It ends a question"], m: "l6-comma" },
    { line: "J.A. Burton wrote the book.", q: "Why are there full stops in 'J.A.'?", a: "They are initials", w: ["The sentence ends there", "They separate a list", "It is a question"], m: "l6-end-mark" },
    { line: "“I'd like that cookie,” Ari said, “the one with sprinkles.”", q: "What is this called?", a: "Set-off dialogue", w: ["A run-on sentence", "A series", "A fragment"], m: "l6-comma" },
  ],
  p5: [
    { q: "\"An imperative like 'Make your bed before school' ends with a question mark.\"", a: "No: it ends with a full stop", w: ["Yes: commands are questions", "Yes: all sentences with 'your' do", "No: it needs a comma"], m: "l6-end-mark" },
    { q: "\"Put a comma between 'big' and 'red' in 'a big red ball' only if 'and' would fit between them.\"", a: "Yes: that is the test for adjectives in a row", w: ["No: always use a comma", "No: never use a comma", "Yes, and also after 'ball'"], m: "l6-comma" },
  ],
  a1: [
    { q: "Which abbreviation is written correctly?", a: "Aug.", w: ["Aug", "aug,", "AUG;"], m: "l6-end-mark" },
    { q: "A comma goes after the greeting of a ___", a: "friendly letter", w: ["business letter", "question", "title"], m: "l6-comma" },
  ],
  a2: [
    { q: "Which is punctuated correctly?", a: "Yes, I'd love to come.", w: ["Yes I'd love, to come.", "Yes I'd love to come,", "Yes; I'd love to come"], m: "l6-comma" },
    { q: "Which is punctuated correctly?", a: "Be careful, Vance!", w: ["Be careful Vance!", "Be, careful Vance!", "Be careful Vance?"], m: "l6-comma" },
  ],
  a4: [
    { q: "Which is punctuated correctly?", a: "“Would you like to watch a movie,” Catalina asked, “or listen to music?”", w: ["“Would you like to watch a movie” Catalina asked “or listen to music?”", "“Would you like to watch a movie,” Catalina asked, “Or listen to music?”", "Would you like to watch a movie, Catalina asked, or listen to music?"], m: "l6-comma" },
  ],
};

// ---------------- 4.9–4.15: Quotation marks, apostrophes, colons, semicolons, hyphens, dashes, parentheses ----------------
export const PUNCT_MARKS: SkillTopic = {
  topic: "l6-marks",
  prefix: "lmk6",
  c1: [
    { s: "Whitney said she can'not come over.", prompt: "Tap the word with the apostrophe in the wrong place.", target: "can'not", wrong: [{ phrase: "Whitney", mistake: "l6-apostrophe" }] },
    { s: "You should get your bike fixed the chain is coming off.", prompt: "A semicolon is missing. Tap the word just before it.", target: "fixed", wrong: [{ phrase: "chain", mistake: "l6-colon-semi" }] },
    { s: "I would like to leave home by 11 35 a.m.", prompt: "A colon is missing in the time. Tap the number before it.", target: "11", wrong: [{ phrase: "a.m.", mistake: "l6-colon-semi" }] },
  ],
  c3: [
    { prompt: "Build the sentence with a colon before the list.", answer: "Bring three things: | a sleeping bag, | pyjamas, and a game.", spares: ["Bring three things;"], wrong: [["Bring three things; a sleeping bag, pyjamas, and a game.", "l6-colon-semi"]] },
    { prompt: "Build the sentence with parentheses.", answer: "I am visiting my great-grandpa | (my grandma's dad).", spares: ["my grandma's dad."], wrong: [] },
    { prompt: "Split the word with a hyphen as at the end of a line.", answer: "foot- | prints", spares: ["fo-", "otprints"], wrong: [["fo- otprints", "l6-hyphen-dash"]] },
  ],
  c5: [
    { s: "I bet youl'l never guess where I went.", bad: "youl'l", mistake: "l6-apostrophe", prompt: "One contraction is wrong. Tap it." },
    { s: "Every fall my dad has to; rake the leaves, wash the car, and clean the gutters.", bad: "to;", mistake: "l6-colon-semi", prompt: "One mark is wrong before the list. Tap the word it is stuck to." },
  ],
  p1: [
    { line: "She had one thing she cared about more than anything[[:]] her baby brother!", q: "Why is the colon used here?", a: "For emphasis", w: ["For a time", "For a letter greeting", "To join two sentences"], m: "l6-colon-semi" },
    { line: "Dear Dr. Wong[[:]]", q: "Why is the colon used here?", a: "After the greeting of a business letter", w: ["For emphasis", "For a time", "Before a list"], m: "l6-colon-semi" },
    { line: "Mohammed is upstairs reading[[;]] Kiara is downstairs practising.", q: "Why is the semicolon used here?", a: "It joins two related sentences without a conjunction", w: ["It comes before a list", "It shows a time", "It shows belonging"], m: "l6-colon-semi" },
    { line: "My favourite song is [[“Here Comes the Sun.”]]", q: "Why is this title in quotation marks?", a: "Song titles go in quotation marks", w: ["Someone is speaking", "It is a movie title", "It is a question"], m: "l6-quote" },
  ],
  p2: [
    { line: "The seven[[-]]year[[-]]old girl built a sandcastle.", q: "What are the highlighted marks?", a: "Hyphens joining words", w: ["Dashes showing a pause", "Minus signs", "Parentheses"], m: "l6-hyphen-dash" },
    { line: "I do all the chores[[—]]my little brother has all the fun.", q: "What is the highlighted mark?", a: "A dash showing a strong pause", w: ["A hyphen joining a word", "A colon", "A semicolon"], m: "l6-hyphen-dash" },
    { line: "The [[girls']] team won the trophy.", q: "What does the apostrophe show?", a: "The team belongs to more than one girl", w: ["The team belongs to one girl", "Letters are missing", "It is a plural with no owner"], m: "l6-apostrophe" },
  ],
  p5: [
    { q: "\"'si-lent' is the right way to split 'silent' at the end of a line.\"", a: "Yes: split between syllables", w: ["No: it should be 'sil-ent'", "No: never split a word", "Yes, or 'silen-t'"], m: "l6-hyphen-dash" },
    { q: "\"A movie title goes in quotation marks.\"", a: "No: movie titles are italic or underlined", w: ["Yes: all titles do", "Yes: like songs", "No: they need parentheses"], m: "l6-quote" },
  ],
  a1: [
    { q: "The contraction of 'cannot' is ___", a: "can't", w: ["can'not", "cann't", "ca'nt"], m: "l6-apostrophe" },
    { q: "Parentheses are used for ___", a: "extra information", w: ["a list", "a strong feeling", "the end of a question"], m: "l6-hyphen-dash" },
  ],
  a2: [
    { q: "Which uses a semicolon correctly?", a: "The lion is fearsome; it is hard to defeat.", w: ["The lion is; fearsome it is hard to defeat.", "The lion; is fearsome, it is hard to defeat.", "The lion is fearsome it; is hard to defeat."], m: "l6-colon-semi" },
    { q: "Which uses an apostrophe correctly?", a: "the children's books", w: ["the childrens' books", "the childrens books'", "the children books's"], m: "l6-apostrophe" },
  ],
  a4: [
    { q: "Which uses a dash correctly?", a: "Nobody knew who—or what—to blame.", w: ["Nobody—knew who or what to blame.", "Nobody knew—who or what to—blame.", "Nobody knew who or what to blame—."], m: "l6-hyphen-dash" },
    { q: "Which is a hyphenated compound?", a: "great-grandparent", w: ["grand-parent's", "gr-eat", "grandparent-s"], m: "l6-hyphen-dash" },
  ],
};

// ---------------- Chapter 5: Usage ----------------
export const USAGE: SkillTopic = {
  topic: "l6-usage",
  prefix: "lus6",
  c1: [
    { s: "Terrance doesn't never eat lima beans.", prompt: "Tap the word that makes a double negative.", target: "never", wrong: [{ phrase: "beans.", mistake: "l6-negative" }] },
    { s: "Him and me went to the market.", prompt: "Tap the two pronouns in the wrong case.", target: ["Him", "me"], wrong: [{ phrase: "market.", mistake: "l6-pronoun-case" }] },
    { s: "All I want to do is lay down on the couch.", prompt: "Tap the verb that should be 'lie'.", target: "lay", wrong: [{ phrase: "couch.", mistake: "l6-tricky" }] },
  ],
  c3: [
    { prompt: "Build the sentence with the right verb.", answer: "I | brought | fresh cherries to my friend's house.", spares: ["brung"], wrong: [["I brung fresh cherries to my friend's house.", "l6-tricky"]] },
    { prompt: "Build the sentence with only one negative.", answer: "I don't want | anybody | to help me.", spares: ["nobody"], wrong: [["I don't want nobody to help me.", "l6-negative"]] },
    { prompt: "Build the sentence with the right pronouns.", answer: "She and I | made | the poster.", spares: ["Her and me"], wrong: [["Her and me made the poster.", "l6-pronoun-case"]] },
  ],
  c5: [
    { s: "I can't go nowhere tonight because I need to babysit.", bad: "nowhere", mistake: "l6-negative", prompt: "One word makes a double negative. Tap it." },
    { s: "My mom wanted me to lie my blanket at the foot of the bed.", bad: "lie", mistake: "l6-tricky", prompt: "One verb should be 'lay'. Tap it." },
    { s: "Coach gave the medals to Riya and I.", bad: "I.", mistake: "l6-pronoun-case", prompt: "One pronoun should be objective. Tap it." },
  ],
  p1: [
    { line: "The teacher thanked [[us]].", q: "What kind of pronoun is highlighted?", a: "Objective", w: ["Subjective", "Intensive", "Demonstrative"], m: "l6-pronoun-case" },
    { line: "[[They]] won the match.", q: "What kind of pronoun is highlighted?", a: "Subjective", w: ["Objective", "Indefinite", "Relative"], m: "l6-pronoun-case" },
    { line: "He sings [[loudly]].", q: "What kind of word is highlighted?", a: "An adverb", w: ["An adjective", "A pronoun", "A negative"], m: "l6-modifier" },
  ],
  p5: [
    { q: "\"'I don't have no money' means I have no money.\"", a: "No: two negatives cancel out; say 'I don't have any money'", w: ["Yes: two negatives make it stronger", "Yes: it is correct", "No: it means I have lots of money, which is correct to say"], m: "l6-negative" },
    { q: "\"'Take' is used for things carried towards the speaker.\"", a: "No: that is 'bring'; 'take' is away from the speaker", w: ["Yes: they mean the same", "Yes: always use 'take'", "No: use 'took'"], m: "l6-tricky" },
  ],
  a1: [
    { q: "Which is an objective pronoun?", a: "them", w: ["they", "we", "she"], m: "l6-pronoun-case" },
    { q: "Which is a negative word?", a: "never", w: ["ever", "always", "anybody"], m: "l6-negative" },
  ],
  a2: [
    { q: "Fill the gap: Xander ___ his ball with him to practice.", a: "took", w: ["taken", "brung", "taked"], m: "l6-tricky" },
    { q: "Fill the gap: If I hadn't ___ time to study, I might have failed.", a: "taken", w: ["took", "take", "taked"], m: "l6-tricky" },
    { q: "Fill the gap: I want to do ___ at the recital.", a: "well", w: ["good", "goodly", "better than good"], m: "l6-modifier" },
  ],
  a4: [
    { q: "Which sentence is correct?", a: "Nobody saw anything.", w: ["Nobody saw nothing.", "Nobody didn't see anything.", "Nobody never saw nothing."], m: "l6-negative" },
    { q: "Which sentence is correct?", a: "Between you and me, it was easy.", w: ["Between you and I, it was easy.", "Between yourself and I, it was easy.", "Between you and myself, it was easy."], m: "l6-pronoun-case" },
  ],
};

// ---------------- Chapter 6: Word Study ----------------
export const WORDS: SkillTopic = {
  topic: "l6-words",
  prefix: "lwd6",
  c1: [
    { s: "The kitten had dirty paws and a filthy coat.", prompt: "Tap the two synonyms.", target: ["dirty", "filthy"], wrong: [{ phrase: "paws", mistake: "l6-synonym" }] },
    { s: "The bush is hearty, but my delicate roses are blooming.", prompt: "Tap the two antonyms.", target: ["hearty,", "delicate"], wrong: [{ phrase: "roses", mistake: "l6-synonym" }] },
    { s: "Although the bracelets were cheap, Sasha bought the inexpensive necklace.", prompt: "Tap the two words with a similar denotation but different connotations.", target: ["cheap,", "inexpensive"], wrong: [{ phrase: "bracelets", mistake: "l6-connotation" }] },
    { s: "The light danced on the surface of the lake.", prompt: "Tap the word that makes this personification.", target: "danced", wrong: [{ phrase: "lake.", mistake: "l6-figurative" }] },
  ],
  c3: [
    { prompt: "Build the word: root 'flavor' + suffix meaning 'without'.", answer: "flavor | less", spares: ["semi"], wrong: [["semi flavor", "l6-affix"]] },
    { prompt: "Build the word: prefix meaning 'half' + root 'circle'.", answer: "semi | circle", spares: ["less"], wrong: [["circle less", "l6-affix"]] },
    { prompt: "Complete the analogy.", answer: "Hand is to arm | as foot | is to leg.", spares: ["is to shoe."], wrong: [["Hand is to arm as foot is to shoe.", "l6-analogy"]] },
  ],
  c5: [
    { s: "Yvonne road her bike on the road.", bad: "road", mistake: "l6-synonym", prompt: "The first homophone is wrong. Tap it." },
    { s: "I was feeling very week after practising in the sun.", bad: "week", mistake: "l6-synonym", prompt: "One homophone is wrong. Tap it." },
    { s: "Mrs. Pascal is the principle of our school.", bad: "principle", mistake: "l6-synonym", prompt: "One word is the wrong homophone. Tap it." },
  ],
  p1: [
    { line: "Oliver was as brave as a lion on the stage.", q: "What is this?", a: "A simile", w: ["A metaphor", "Personification", "An analogy"], m: "l6-figurative" },
    { line: "The stars are diamonds shining in the night sky.", q: "What is this?", a: "A metaphor", w: ["A simile", "Personification", "A homograph"], m: "l6-figurative" },
    { line: "The wind was howling so loudly I could barely sleep.", q: "What is this?", a: "Personification", w: ["A simile", "A metaphor", "An antonym"], m: "l6-figurative" },
    { line: "We each got ten rupees to spend at the [[fair]].", q: "What does 'fair' mean here?", a: "An outdoor event with rides and stalls", w: ["Equal and just", "Light in colour", "Fairly good"], m: "l6-synonym" },
  ],
  p2: [
    { line: "German shepherd is to dog as motorcycle is to vehicle.", q: "How are the pairs related?", a: "Each is a kind of the second thing", w: ["Each is a part of the second thing", "They are opposites", "They sound the same"], m: "l6-analogy" },
    { line: "The [[bow]] on the gift was red, so she took a [[bow]] on stage.", q: "What are the two highlighted words?", a: "Homographs", w: ["Homophones spelt differently", "Antonyms", "Synonyms"], m: "l6-synonym" },
  ],
  p5: [
    { q: "\"'Henry sure is an early bird' is a simile.\"", a: "No: it doesn't use 'like' or 'as'; it is a metaphor", w: ["Yes: it compares Henry to a bird", "Yes: all comparisons are similes", "No: it is personification"], m: "l6-figurative" },
    { q: "\"'Sick' always has a bad connotation.\"", a: "No: in 'That trick was sick!' it can mean impressive", w: ["Yes: it always means ill", "Yes: words have only one feeling", "No: it means nothing"], m: "l6-connotation" },
  ],
  a1: [
    { q: "Denotation means ___", a: "a word's dictionary meaning", w: ["the feeling a word carries", "a word that sounds the same", "a word's opposite"], m: "l6-connotation" },
    { q: "Homophones are words that ___", a: "sound the same but are spelt differently", w: ["are spelt the same but mean different things", "mean the opposite", "mean the same"], m: "l6-synonym" },
  ],
  a2: [
    { q: "Fill the gap: I can't believe ___ going to the musical!", a: "you're", w: ["your", "youre", "you'r"], m: "l6-synonym" },
    { q: "An antonym of 'ancient' is ___", a: "modern", w: ["old", "antique", "aged"], m: "l6-synonym" },
  ],
  a4: [
    { q: "Leaves are to tree as petals are to ___", a: "flower", w: ["leaf", "garden", "colour"], m: "l6-analogy" },
    { q: "Which word has a more positive connotation?", a: "slender", w: ["skinny", "scrawny", "bony"], m: "l6-connotation" },
    { q: "In 'unhappiness', the root is ___", a: "happy", w: ["un", "ness", "unhap"], m: "l6-affix" },
  ],
};
