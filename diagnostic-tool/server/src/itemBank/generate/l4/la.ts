import { Misconceptions, SkillTopic } from "../skillTopic.js";

/**
 * Grade 4 Language Arts (Spectrum Language Arts Grade 4), Chapters 1–3,
 * as seven topics. Chapter 4 (Writer's Guide: the writing process) is
 * covered by Grade 4 Writing. Sentences are our own, in the book's style.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "l4-noun": { label: "Mixes up common and proper nouns", detail: "Calls a name a common noun, or a general word a proper noun.", childTip: "A proper noun names one special person, place or thing and starts with a capital (Priya, Delhi). A common noun is general (girl, city)." },
  "l4-pronoun": { label: "Uses the wrong pronoun", detail: "Writes 'Me and him went' or 'between she and I'.", childTip: "Subject pronouns do the action (I, he, she, we, they). Object pronouns receive it (me, him, her, us, them). Try the sentence with just the pronoun." },
  "l4-verb-kind": { label: "Mixes up action, helping and linking verbs", detail: "Calls 'is' an action verb, or misses the helping verb.", childTip: "Action verbs show doing (run). Helping verbs help the main verb (is running, has eaten). Linking verbs join the subject to a describing word (She is happy)." },
  "l4-modifier": { label: "Mixes up adjectives and adverbs", detail: "Uses 'quick' where 'quickly' is needed, or calls an adverb an adjective.", childTip: "Adjectives describe nouns (a quick fox). Adverbs describe verbs: how, when, where (ran quickly)." },
  "l4-article": { label: "Uses the wrong article", detail: "Writes 'a apple' or 'an banana'.", childTip: "Use 'an' before a vowel sound (an apple, an hour) and 'a' before a consonant sound (a banana)." },
  "l4-prep-conj": { label: "Mixes up prepositions and conjunctions", detail: "Calls 'under' a conjunction, or 'and' a preposition.", childTip: "Prepositions show where or when (under, after, on). Conjunctions join words or sentences (and, but, or, so)." },
  "l4-sentence-type": { label: "Mixes up the four kinds of sentence", detail: "Confuses a command with a statement, or a strong feeling with a question.", childTip: "Statement (.) tells. Command (.) tells someone to do something. Question (?) asks. Exclamation (!) shows strong feeling." },
  "l4-sentence-parts": { label: "Can't find the subject, predicate or object", detail: "Picks the verb as the subject, or the subject as the object.", childTip: "Subject: who or what the sentence is about. Predicate: what the subject does or is. Direct object: who or what receives the action." },
  "l4-fragment": { label: "Misses fragments and run-ons", detail: "Thinks a group of words without a subject or verb is a sentence, or joins two sentences with no punctuation.", childTip: "A sentence needs a subject and a verb and a complete thought. Two sentences need a full stop, or a comma and a joining word." },
  "l4-combine": { label: "Combines sentences wrongly", detail: "Repeats words, or joins with the wrong word.", childTip: "When two sentences share words, say them once: Raj sings. Mia sings. → Raj and Mia sing." },
  "l4-caps": { label: "Misses capital letters", detail: "Misses capitals in names, titles, places, days, months, holidays or book titles.", childTip: "Capitalise names and titles (Dr. Rao), places (Mumbai), days, months and holidays (Diwali), and the important words in titles." },
  "l4-end-mark": { label: "Uses the wrong end mark or abbreviation", detail: "Puts a full stop after a question, or forgets the full stop in Mr. or Jan.", childTip: "Statements and commands end with a full stop, questions with ?, strong feelings with !. Abbreviations usually end with a full stop." },
  "l4-comma": { label: "Misses or misplaces commas", detail: "Leaves out commas in dates, places, lists, after introductory words, in direct address, or before 'and' in a compound sentence.", childTip: "Commas go: June 5, 2024; Pune, Maharashtra; red, blue, and green; Yes, …; Riya, come here; I ran, and she walked." },
  "l4-dialogue": { label: "Punctuates dialogue or titles wrongly", detail: "Puts the end mark outside the quotation marks, or underlines a song title.", childTip: "Spoken words and their punctuation go inside quotation marks. Book and movie titles are in italics or underlined; song and poem titles go in quotation marks." },
  "l4-colon": { label: "Misuses a colon", detail: "Leaves out the colon in a time (3 30) or before a list.", childTip: "Use a colon in times (3:30), after a letter's business greeting (Dear Sir:), and before a list." },
  "l4-agreement": { label: "Misses subject-verb agreement", detail: "Writes 'She watch' or 'The dogs barks'.", childTip: "One subject: add s or es to the verb (she watches). More than one: no s (they watch)." },
  "l4-past": { label: "Gets the past tense wrong", detail: "Writes 'catched', 'breaked' or 'drawed'.", childTip: "Regular verbs add -ed (jumped). Irregular verbs change: fall–fell, dig–dug, take–took, speak–spoke, catch–caught." },
  "l4-future": { label: "Forms the future tense wrongly", detail: "Writes 'will went' or 'will goes'.", childTip: "Future tense: will + the plain verb (will go, will eat)." },
  "l4-tricky": { label: "Mixes up tricky verb pairs", detail: "Confuses sit/set, lie/lay, rise/raise, teach/learn, can/may.", childTip: "Sit (yourself) / set (something down). Teach (give knowledge) / learn (get it). May asks permission; can is about being able." },
  "l4-contraction": { label: "Writes contractions or negatives wrongly", detail: "Puts the apostrophe in the wrong place, or uses two negatives (don't have no).", childTip: "The apostrophe takes the place of missing letters: do not → don't. Use only one negative word in a sentence." },
  "l4-plural": { label: "Forms plurals wrongly", detail: "Writes 'childs', 'boxs' or 'babys'.", childTip: "Add s or es (boxes). y after a consonant → ies (babies). Some change: child–children, mouse–mice, foot–feet." },
  "l4-possessive": { label: "Writes possessives wrongly", detail: "Confuses dog's, dogs' and dogs.", childTip: "One owner: 's (the dog's bone). More than one owner ending in s: s' (the dogs' bones). Irregular plurals: 's (the children's toys)." },
  "l4-compare": { label: "Forms comparisons wrongly", detail: "Writes 'more taller' or 'most fastest'.", childTip: "Two things: -er or more (taller, more careful). Three or more: -est or most (tallest, most careful). Never both." },
  "l4-synonym": { label: "Mixes up synonyms, antonyms and homophones", detail: "Calls an opposite a synonym, or uses the wrong sound-alike word.", childTip: "Synonyms mean the same; antonyms mean the opposite; homophones sound the same but are spelt differently (their/there)." },
  "l4-meaning": { label: "Misreads a multiple-meaning word", detail: "Picks the wrong meaning of a word like 'bat' or 'bark' for its sentence.", childTip: "Read the whole sentence to see which meaning fits." },
  "l4-figurative": { label: "Mixes up similes, metaphors, personification and idioms", detail: "Calls a metaphor a simile, or takes an idiom literally.", childTip: "Simile: like or as. Metaphor: says one thing is another. Personification: a thing acts like a person. Idiom: a saying that doesn't mean its exact words." },
};

// ---------------- Parts of speech: nouns, pronouns and verbs (1.1–1.5) ----------------
export const NOUNS_VERBS: SkillTopic = {
  topic: "l4-nouns-verbs",
  prefix: "lnv4",
  c1: [
    { s: "Priya visited Jaipur with her cousin.", prompt: "Tap the two proper nouns.", target: ["Priya", "Jaipur"], wrong: [{ phrase: "cousin.", mistake: "l4-noun" }] },
    { s: "The farmer fed the cows in the morning.", prompt: "Tap the three common nouns.", target: ["farmer", "cows", "morning."], wrong: [{ phrase: "fed", mistake: "l4-noun" }] },
    { s: "Arjun lost his kite, so he looked for it.", prompt: "Tap the pronouns.", target: ["his", "he", "it."], wrong: [{ phrase: "Arjun", mistake: "l4-pronoun" }] },
    { s: "The monkey jumped from branch to branch.", prompt: "Tap the action verb.", target: "jumped", wrong: [{ phrase: "monkey", mistake: "l4-verb-kind" }] },
  ],
  c2: [
    { s: "We are planting trees in the park.", prompt: "Tap the helping verb.", target: "are", wrong: [{ phrase: "planting", mistake: "l4-verb-kind" }] },
    { s: "The soup tastes salty.", prompt: "Tap the linking verb.", target: "tastes", wrong: [{ phrase: "salty.", mistake: "l4-verb-kind" }] },
    { s: "Grandma has baked a cake for us.", prompt: "Tap the helping verb and the main verb.", target: ["has", "baked"], wrong: [{ phrase: "cake", mistake: "l4-verb-kind" }] },
    { s: "My brother is a doctor in Chennai.", prompt: "Tap the linking verb.", target: "is", wrong: [{ phrase: "doctor", mistake: "l4-verb-kind" }] },
  ],
  c3: [
    { prompt: "Build the sentence with a pronoun in place of 'Meera'.", answer: "She | likes | to paint.", spares: ["Her"], wrong: [["Her likes to paint.", "l4-pronoun"]] },
    { prompt: "Build the sentence with a helping verb.", answer: "The children | were | singing loudly.", spares: ["was"], wrong: [["The children was singing loudly.", "l4-verb-kind"]] },
    { prompt: "Build the sentence with a linking verb.", answer: "The puppy | seems | sleepy.", spares: ["runs"], wrong: [["The puppy runs sleepy.", "l4-verb-kind"]] },
  ],
  c5: [
    { s: "We went to the market in delhi on Saturday.", bad: "delhi", mistake: "l4-noun", prompt: "One proper noun needs a capital letter. Tap it." },
    { s: "Him and his sister walked to school.", bad: "Him", mistake: "l4-pronoun", prompt: "One pronoun is wrong. Tap it." },
    { s: "The birds is singing in the tree.", bad: "is", mistake: "l4-verb-kind", prompt: "One helping verb is wrong. Tap it." },
  ],
  p1: [
    { line: "We visited the [[Taj Mahal]] last winter.", q: "What kind of noun is highlighted?", a: "A proper noun", w: ["A common noun", "A pronoun", "A verb"], m: "l4-noun" },
    { line: "The [[river]] flows past our village.", q: "What kind of noun is highlighted?", a: "A common noun", w: ["A proper noun", "A pronoun", "An adjective"], m: "l4-noun" },
    { line: "Ravi called his friend and invited [[her]] to the party.", q: "Who does the highlighted pronoun stand for?", a: "Ravi's friend", w: ["Ravi", "The party", "Everyone"], m: "l4-pronoun" },
    { line: "The baby [[is]] hungry.", q: "What kind of verb is highlighted?", a: "A linking verb", w: ["An action verb", "A helping verb", "A noun"], m: "l4-verb-kind" },
  ],
  p2: [
    { line: "They [[will]] travel by train.", q: "What kind of verb is highlighted?", a: "A helping verb", w: ["A linking verb", "An action verb", "A pronoun"], m: "l4-verb-kind" },
    { line: "Asha [[climbed]] the hill.", q: "What kind of verb is highlighted?", a: "An action verb", w: ["A linking verb", "A helping verb", "An adverb"], m: "l4-verb-kind" },
    { line: "The flowers [[smell]] sweet.", q: "What kind of verb is highlighted?", a: "A linking verb", w: ["An action verb", "A helping verb", "A noun"], m: "l4-verb-kind" },
  ],
  p5: [
    { q: "\"'Monday' is a common noun.\"", a: "No: it names a particular day, so it is a proper noun", w: ["Yes: all days are common nouns", "Yes: it has no capital letter", "No: it is a verb"], m: "l4-noun" },
    { q: "\"In 'She is tired', the word 'is' is an action verb.\"", a: "No: it is a linking verb joining she to tired", w: ["Yes: 'is' shows an action", "Yes: every verb is an action verb", "No: it is a helping verb"], m: "l4-verb-kind" },
  ],
  a1: [
    { q: "A proper noun ___", a: "names a particular person, place or thing", w: ["names any person, place or thing", "shows an action", "describes a noun"], m: "l4-noun" },
    { q: "A pronoun ___", a: "takes the place of a noun", w: ["shows an action", "describes a verb", "joins two sentences"], m: "l4-pronoun" },
    { q: "Which is a helping verb?", a: "has", w: ["jump", "happy", "quickly"], m: "l4-verb-kind" },
  ],
  a2: [
    { q: "Fill the gap: Sam and Leela are friends. ___ play together.", a: "They", w: ["Them", "Their", "Us"], m: "l4-pronoun" },
    { q: "Fill the gap: The players ___ practising every day.", a: "are", w: ["is", "was", "has"], m: "l4-verb-kind" },
    { q: "Which word is a proper noun?", a: "Himalayas", w: ["mountain", "snow", "valley"], m: "l4-noun" },
  ],
  a4: [
    { q: "Which sentence has a linking verb?", a: "The milk was cold.", w: ["The dog chased the ball.", "We swam in the lake.", "Ali kicked the stone."], m: "l4-verb-kind" },
    { q: "Which sentence uses pronouns correctly?", a: "She and I made a card.", w: ["Her and me made a card.", "Me and her made a card.", "Her and I made a card."], m: "l4-pronoun" },
    { q: "Which sentence has a helping verb?", a: "Riya has finished her homework.", w: ["Riya finished her homework.", "Riya is clever.", "Riya likes homework."], m: "l4-verb-kind" },
  ],
};

// ---------------- Parts of speech: adjectives, adverbs, articles, prepositions, conjunctions (1.6–1.10) ----------------
export const MODIFIERS: SkillTopic = {
  topic: "l4-modifiers",
  prefix: "lmd4",
  c1: [
    { s: "A tiny brown mouse hid in the barn.", prompt: "Tap the two adjectives.", target: ["tiny", "brown"], wrong: [{ phrase: "hid", mistake: "l4-modifier" }] },
    { s: "The turtle moved slowly across the sand.", prompt: "Tap the adverb.", target: "slowly", wrong: [{ phrase: "turtle", mistake: "l4-modifier" }] },
    { s: "The cat slept under the table.", prompt: "Tap the preposition.", target: "under", wrong: [{ phrase: "slept", mistake: "l4-prep-conj" }] },
    { s: "I wanted to swim, but the pool was closed.", prompt: "Tap the conjunction.", target: "but", wrong: [{ phrase: "to", mistake: "l4-prep-conj" }] },
  ],
  c2: [
    { s: "We saw an owl and a eagle at the zoo.", prompt: "Tap the article that is wrong.", target: "a", wrong: [{ phrase: "an", mistake: "l4-article" }] },
    { s: "Tomorrow we will visit the museum.", prompt: "Tap the adverb that tells when.", target: "Tomorrow", wrong: [{ phrase: "museum.", mistake: "l4-modifier" }] },
    { s: "The kite flew above the trees and over the river.", prompt: "Tap the two prepositions.", target: ["above", "over"], wrong: [{ phrase: "and", mistake: "l4-prep-conj" }] },
  ],
  c3: [
    { prompt: "Build the sentence with an adverb.", answer: "The baby | slept | peacefully.", spares: ["peaceful."], wrong: [["The baby slept peaceful.", "l4-modifier"]] },
    { prompt: "Build the sentence with the right article.", answer: "I ate | an | orange.", spares: ["a"], wrong: [["I ate a orange.", "l4-article"]] },
    { prompt: "Join the two ideas with a conjunction.", answer: "Do you want tea | or | juice?", spares: ["under"], wrong: [["Do you want tea under juice?", "l4-prep-conj"]] },
  ],
  c5: [
    { s: "She sings beautiful in the choir.", bad: "beautiful", mistake: "l4-modifier", prompt: "One word should be an adverb. Tap it." },
    { s: "He waited for a hour at the station.", bad: "a", mistake: "l4-article", prompt: "One article is wrong. Tap it." },
    { s: "The ball rolled and the sofa.", bad: "and", mistake: "l4-prep-conj", prompt: "One word should be a preposition such as 'under'. Tap it." },
  ],
  p1: [
    { line: "The [[shiny]] coin fell on the floor.", q: "What kind of word is highlighted?", a: "An adjective", w: ["An adverb", "A verb", "A preposition"], m: "l4-modifier" },
    { line: "The children played [[happily]] in the rain.", q: "What does the highlighted word tell?", a: "How the children played", w: ["Where they played", "Who played", "What they played with"], m: "l4-modifier" },
    { line: "The keys are [[inside]] the drawer.", q: "What kind of word is highlighted?", a: "A preposition", w: ["A conjunction", "An adjective", "An article"], m: "l4-prep-conj" },
    { line: "I was tired, [[so]] I went to bed early.", q: "What kind of word is highlighted?", a: "A conjunction", w: ["A preposition", "An adverb", "An article"], m: "l4-prep-conj" },
  ],
  p5: [
    { q: "\"We say 'a umbrella' because umbrella is a noun.\"", a: "No: 'umbrella' starts with a vowel sound, so it is 'an umbrella'", w: ["Yes: all nouns take 'a'", "Yes: 'an' is only for animals", "No: it should be 'the umbrella' always"], m: "l4-article" },
    { q: "\"In 'She runs fast', the word 'fast' is an adverb.\"", a: "Yes: it tells how she runs", w: ["No: it is an adjective", "No: it is a noun", "Yes, because it ends in -ly"], m: "l4-modifier" },
  ],
  a1: [
    { q: "An adjective describes a ___", a: "noun", w: ["verb", "conjunction", "preposition"], m: "l4-modifier" },
    { q: "Which word is a conjunction?", a: "because", w: ["beneath", "between", "beside"], m: "l4-prep-conj" },
    { q: "Which word is an article?", a: "the", w: ["this", "is", "on"], m: "l4-article" },
  ],
  a2: [
    { q: "Fill the gap: Please speak ___ in the library.", a: "quietly", w: ["quiet", "quieter", "quietness"], m: "l4-modifier" },
    { q: "Fill the gap: She found ___ old coin in the garden.", a: "an", w: ["a", "two", "these"], m: "l4-article" },
    { q: "Fill the gap: The bus stopped ___ the school gate.", a: "near", w: ["and", "but", "or"], m: "l4-prep-conj" },
  ],
  a4: [
    { q: "Which sentence uses articles correctly?", a: "An elephant and a tiger live in the forest.", w: ["A elephant and an tiger live in the forest.", "An elephant and an tiger live in the forest.", "A elephant and a tiger live in the forest."], m: "l4-article" },
    { q: "Which sentence uses an adverb correctly?", a: "The team played well.", w: ["The team played good.", "The team played goodly.", "The team played nice."], m: "l4-modifier" },
  ],
};

// ---------------- Sentences (1.11–1.21) ----------------
export const SENTENCES: SkillTopic = {
  topic: "l4-sentences",
  prefix: "lsn4",
  c1: [
    { s: "The tall giraffe ate leaves from the tree.", prompt: "Tap every word of the complete subject.", target: "The tall giraffe", wrong: [{ phrase: "ate leaves", mistake: "l4-sentence-parts" }] },
    { s: "My little sister draws pictures of cats.", prompt: "Tap the simple predicate (the verb).", target: "draws", wrong: [{ phrase: "sister", mistake: "l4-sentence-parts" }] },
    { s: "Rohan kicked the ball over the fence.", prompt: "Tap the direct object.", target: "ball", wrong: [{ phrase: "Rohan", mistake: "l4-sentence-parts" }] },
    { s: "Close the window before it rains.", prompt: "This is a command. Tap the verb that gives the command.", target: "Close", wrong: [{ phrase: "rains.", mistake: "l4-sentence-type" }] },
  ],
  c2: [
    { s: "We went to the beach. Built a sandcastle. The waves were huge.", prompt: "Tap every word of the fragment.", target: "Built a sandcastle.", wrong: [{ phrase: "We went to the beach.", mistake: "l4-fragment" }] },
    { s: "I like mangoes, but my brother likes grapes.", prompt: "Tap the word that joins the two sentences.", target: "but", wrong: [{ phrase: "like", mistake: "l4-combine" }] },
  ],
  c3: [
    { prompt: "Combine: Tara plays chess. Neil plays chess.", answer: "Tara and Neil | play | chess.", spares: ["plays"], wrong: [["Tara and Neil plays chess.", "l4-combine"]] },
    { prompt: "Combine: The kitten is soft. The kitten is grey.", answer: "The kitten | is | soft and grey.", spares: ["are"], wrong: [["The kitten are soft and grey.", "l4-combine"]] },
    { prompt: "Fix the run-on: It was late we went home.", answer: "It was late, | so | we went home.", spares: ["but"], wrong: [["It was late, but we went home.", "l4-fragment"]] },
  ],
  c4: [
    { prompt: "Combine: We sang. We danced.", answer: "We | sang and danced.", spares: ["We danced."], wrong: [["We We danced.", "l4-combine"]] },
    { prompt: "Build a question.", answer: "Where | did you | put my book?", spares: ["You put"], wrong: [] },
  ],
  c5: [
    { s: "What a beautiful sunset that is.", bad: "is.", mistake: "l4-sentence-type", prompt: "This sentence shows strong feeling, but the end mark is wrong. Tap the last word." },
    { s: "The rain stopped we went outside to play.", bad: "stopped", mistake: "l4-fragment", prompt: "This is a run-on. Tap the word right before the place it should be split." },
    { s: "Do you know where the station is.", bad: "is.", mistake: "l4-sentence-type", prompt: "This question has the wrong end mark. Tap the last word." },
  ],
  p1: [
    { line: "Please pass the salt.", q: "What kind of sentence is this?", a: "Imperative (a command or request)", w: ["Interrogative (a question)", "Exclamatory (strong feeling)", "Declarative (a statement)"], m: "l4-sentence-type" },
    { line: "Wow, we won the match!", q: "What kind of sentence is this?", a: "Exclamatory (strong feeling)", w: ["Declarative (a statement)", "Imperative (a command or request)", "Interrogative (a question)"], m: "l4-sentence-type" },
    { line: "The library opens at nine.", q: "What kind of sentence is this?", a: "Declarative (a statement)", w: ["Interrogative (a question)", "Exclamatory (strong feeling)", "Imperative (a command or request)"], m: "l4-sentence-type" },
    { line: "Running down the road.", q: "What is this?", a: "A fragment: it has no subject", w: ["A complete sentence", "A compound sentence", "A run-on sentence"], m: "l4-fragment" },
  ],
  p2: [
    { line: "Mom baked [[bread]].", q: "What is the highlighted word?", a: "The direct object", w: ["The subject", "The predicate", "A linking verb"], m: "l4-sentence-parts" },
    { line: "[[The old fisherman]] mended his net.", q: "What is the highlighted part?", a: "The complete subject", w: ["The complete predicate", "The direct object", "A fragment"], m: "l4-sentence-parts" },
    { line: "I wanted to go out, but it was raining.", q: "What kind of sentence is this?", a: "A compound sentence", w: ["A fragment", "A run-on sentence", "A simple command"], m: "l4-fragment" },
  ],
  p5: [
    { q: "\"'Under the big tree' is a complete sentence.\"", a: "No: it has no subject or verb, so it is a fragment", w: ["Yes: it starts with a capital", "Yes: it is long enough", "No: it is a run-on"], m: "l4-fragment" },
    { q: "\"A compound sentence joins two sentences with a comma and a word like 'and' or 'but'.\"", a: "Yes: that is how a compound sentence is built", w: ["No: it never uses a comma", "No: it is just one long sentence", "Yes, but only with 'because'"], m: "l4-combine" },
  ],
  a1: [
    { q: "The subject of a sentence tells ___", a: "who or what the sentence is about", w: ["what the subject does", "where it happens", "how it ends"], m: "l4-sentence-parts" },
    { q: "An interrogative sentence ends with ___", a: "a question mark", w: ["a full stop", "an exclamation mark", "a comma"], m: "l4-sentence-type" },
    { q: "A run-on sentence ___", a: "joins two sentences without the right punctuation", w: ["is missing a subject", "is a question", "has only one word"], m: "l4-fragment" },
  ],
  a2: [
    { q: "In 'Leena painted a picture', the direct object is ___", a: "picture", w: ["Leena", "painted", "a"], m: "l4-sentence-parts" },
    { q: "In 'The bright stars twinkled', the simple subject is ___", a: "stars", w: ["bright", "twinkled", "The"], m: "l4-sentence-parts" },
  ],
  a4: [
    { q: "Which is a complete sentence?", a: "The bus arrived late.", w: ["Arrived late.", "The late bus.", "Because the bus."], m: "l4-fragment" },
    { q: "Which is the best way to combine 'Ali has a bike. Ali has a skateboard.'?", a: "Ali has a bike and a skateboard.", w: ["Ali has a bike Ali has a skateboard.", "Ali has a bike, Ali and has a skateboard.", "Ali and Ali have a bike and skateboard."], m: "l4-combine" },
    { q: "Which sentence is a command?", a: "Wash your hands before lunch.", w: ["Did you wash your hands?", "I washed my hands.", "What clean hands!"], m: "l4-sentence-type" },
  ],
};

// ---------------- Capitalization (2.1–2.4) ----------------
export const CAPITALS: SkillTopic = {
  topic: "l4-capitals",
  prefix: "lcp4",
  c1: [
    { s: "dr. mehta lives in kolkata.", prompt: "Tap the three words that need capital letters.", target: ["dr.", "mehta", "kolkata."], wrong: [{ phrase: "lives", mistake: "l4-caps" }] },
    { s: "We celebrate diwali in october or november.", prompt: "Tap the three words that need capital letters.", target: ["diwali", "october", "november."], wrong: [{ phrase: "celebrate", mistake: "l4-caps" }] },
    { s: "My favourite book is charlotte's web.", prompt: "Tap the two words of the title that need capitals.", target: ["charlotte's", "web."], wrong: [{ phrase: "book", mistake: "l4-caps" }] },
  ],
  c3: [
    { prompt: "Build the sentence with capitals in the right places.", answer: "On Monday, | Aunt Rita | visited Goa.", spares: ["aunt Rita"], wrong: [["On Monday, aunt Rita visited Goa.", "l4-caps"]] },
    { prompt: "Build the movie title correctly.", answer: "We watched | The Lion King.", spares: ["the lion king."], wrong: [["We watched the lion king.", "l4-caps"]] },
  ],
  c5: [
    { s: "Our class went to the River on Friday.", bad: "River", mistake: "l4-caps", prompt: "One word should NOT have a capital letter. Tap it." },
    { s: "I was born on a sunday in March.", bad: "sunday", mistake: "l4-caps", prompt: "One word needs a capital letter. Tap it." },
    { s: "My Uncle took us to Mysore Palace.", bad: "Uncle", mistake: "l4-caps", prompt: "One word should NOT have a capital letter here. Tap it." },
  ],
  p1: [
    { line: "We drove to [[mount abu]] for the holidays.", q: "What is wrong with the highlighted words?", a: "A place name needs capitals", w: ["Nothing is wrong", "They should be in quotation marks", "Only 'abu' needs a capital"], m: "l4-caps" },
    { line: "Have you read [[Harry potter]]?", q: "What is wrong with the highlighted title?", a: "'Potter' needs a capital", w: ["'Harry' should be lowercase", "Nothing is wrong", "The whole title should be lowercase"], m: "l4-caps" },
    { line: "[[Mr.]] Das teaches us science.", q: "Why does the highlighted word have a capital?", a: "It is a title before a name", w: ["It is a verb", "It is a common noun", "It ends the sentence"], m: "l4-caps" },
  ],
  p5: [
    { q: "\"Seasons like summer and winter need capital letters.\"", a: "No: seasons are not capitalised", w: ["Yes: all times of year need capitals", "Yes: like months and days", "No: only winter does"], m: "l4-caps" },
    { q: "\"In a book title, small words like 'of' and 'the' in the middle usually stay lowercase.\"", a: "Yes: only the first word and important words are capitalised", w: ["No: every word needs a capital", "No: only the first word needs a capital", "Yes, and so do the nouns"], m: "l4-caps" },
  ],
  a1: [
    { q: "Which word always needs a capital letter?", a: "Tuesday", w: ["spring", "teacher", "river"], m: "l4-caps" },
    { q: "Which is written correctly?", a: "Republic Day", w: ["republic day", "Republic day", "republic Day"], m: "l4-caps" },
  ],
  a2: [
    { q: "Which is a correctly written place name?", a: "Indian Ocean", w: ["indian ocean", "Indian ocean", "indian Ocean"], m: "l4-caps" },
    { q: "Which is a correctly written name with a title?", a: "Captain Singh", w: ["captain Singh", "Captain singh", "captain singh"], m: "l4-caps" },
  ],
  a4: [
    { q: "Which sentence is capitalised correctly?", a: "In May, Grandpa flew to London.", w: ["In may, grandpa flew to London.", "In May, grandpa flew to london.", "in May, Grandpa flew to London."], m: "l4-caps" },
    { q: "Which song title is capitalised correctly?", a: "\"Twinkle, Twinkle, Little Star\"", w: ["\"twinkle, twinkle, little star\"", "\"Twinkle, twinkle, little star\"", "\"twinkle, Twinkle, Little star\""], m: "l4-caps" },
  ],
};

// ---------------- Punctuation (2.5–2.12) ----------------
export const PUNCTUATION: SkillTopic = {
  topic: "l4-punctuation",
  prefix: "lpn4",
  c1: [
    { s: "We bought apples bananas and grapes.", prompt: "A comma is missing after one word. Tap it.", target: "apples", wrong: [{ phrase: "grapes.", mistake: "l4-comma" }], also: [] },
    { s: "Yes I would like some juice.", prompt: "A comma is missing after one word. Tap it.", target: "Yes", wrong: [{ phrase: "like", mistake: "l4-comma" }] },
    { s: "Ravi please shut the door.", prompt: "A comma is missing after one word (direct address). Tap it.", target: "Ravi", wrong: [{ phrase: "door.", mistake: "l4-comma" }] },
    { s: "The train leaves at 4 15 in the afternoon.", prompt: "A colon is missing in the time. Tap the number before the gap.", target: "4", wrong: [{ phrase: "afternoon.", mistake: "l4-colon" }] },
  ],
  c3: [
    { prompt: "Build the dialogue with the right punctuation.", answer: "“I love this song,” | said Meena.", spares: ["“I love this song”,"], wrong: [["“I love this song”, said Meena.", "l4-dialogue"]] },
    { prompt: "Build the date and place correctly.", answer: "On March 3, 2024, | we moved to | Pune, Maharashtra.", spares: ["Pune Maharashtra."], wrong: [["On March 3, 2024, we moved to Pune Maharashtra.", "l4-comma"]] },
    { prompt: "Build the compound sentence.", answer: "I called her, | but | she was out.", spares: ["but,"], wrong: [["I called her, but, she was out.", "l4-comma"]] },
  ],
  c5: [
    { s: "What time does the show start.", bad: "start.", mistake: "l4-end-mark", prompt: "The end mark is wrong. Tap the last word." },
    { s: "Mr Kapoor is our new neighbour.", bad: "Mr", mistake: "l4-end-mark", prompt: "One abbreviation is missing its full stop. Tap it." },
    { s: "“Where are you going”? asked Dad.", bad: "going”?", mistake: "l4-dialogue", prompt: "The question mark is in the wrong place. Tap the word it is stuck to." },
  ],
  p1: [
    { line: "We need eggs[[:]] flour, sugar, and milk.", q: "Why is the highlighted colon there?", a: "It comes before a list", w: ["It shows a time", "It ends a question", "It shows someone is speaking"], m: "l4-colon" },
    { line: "My favourite song is [[“Happy Birthday.”]]", q: "Why is this title in quotation marks?", a: "Song titles go in quotation marks", w: ["Someone is speaking", "It is a book title", "It is a question"], m: "l4-dialogue" },
    { line: "[[Mira,]] can you help me?", q: "Why is there a comma after the highlighted name?", a: "Mira is being spoken to (direct address)", w: ["It is a list", "It is a date", "It ends the sentence"], m: "l4-comma" },
  ],
  p5: [
    { q: "\"A book title like Matilda should go in quotation marks.\"", a: "No: book titles are in italics or underlined", w: ["Yes: all titles go in quotation marks", "Yes: only book titles do", "No: book titles need no marks at all"], m: "l4-dialogue" },
    { q: "\"In a compound sentence, put a comma before 'and' or 'but'.\"", a: "Yes: the comma comes before the joining word", w: ["No: put it after the joining word", "No: compound sentences never have commas", "Yes, and another one after it"], m: "l4-comma" },
  ],
  a1: [
    { q: "An exclamation sentence ends with ___", a: "an exclamation point", w: ["a full stop", "a question mark", "a comma"], m: "l4-end-mark" },
    { q: "Which abbreviation is written correctly?", a: "Dr.", w: ["dr", "DR", "Dr,"], m: "l4-end-mark" },
    { q: "Which time is written correctly?", a: "7:45", w: ["7,45", "7;45", "745:"], m: "l4-colon" },
  ],
  a2: [
    { q: "Which date is written correctly?", a: "August 15, 1947", w: ["August, 15 1947", "August 15 1947", "August 15; 1947"], m: "l4-comma" },
    { q: "Which place is written correctly?", a: "Shimla, Himachal Pradesh", w: ["Shimla Himachal Pradesh", "Shimla; Himachal Pradesh", "Shimla. Himachal Pradesh"], m: "l4-comma" },
  ],
  a4: [
    { q: "Which sentence is punctuated correctly?", a: "“Come here,” called Mom.", w: ["“Come here” called Mom.", "“Come here”, called Mom.", "Come here, called Mom."], m: "l4-dialogue" },
    { q: "Which sentence uses commas correctly?", a: "First, mix the flour, sugar, and butter.", w: ["First mix the flour sugar and butter.", "First, mix, the flour sugar and butter.", "First mix the flour, sugar and, butter."], m: "l4-comma" },
  ],
};

// ---------------- Usage: verbs (3.1–3.8) ----------------
export const VERB_USAGE: SkillTopic = {
  topic: "l4-verbs",
  prefix: "lvb4",
  c1: [
    { s: "Yesterday the leaves falled from the tree.", prompt: "Tap the verb in the wrong past tense.", target: "falled", wrong: [{ phrase: "Yesterday", mistake: "l4-past" }] },
    { s: "She watch cartoons every evening.", prompt: "Tap the verb that doesn't agree with its subject.", target: "watch", wrong: [{ phrase: "She", mistake: "l4-agreement" }] },
    { s: "I don't have no homework today.", prompt: "Tap the word that makes a double negative.", target: "no", wrong: [{ phrase: "today.", mistake: "l4-contraction" }] },
    { s: "Tomorrow we will went to the fair.", prompt: "Tap the verb that is wrong for the future tense.", target: "went", wrong: [{ phrase: "will", mistake: "l4-future" }] },
  ],
  c2: [
    { s: "The dog catched the ball in its mouth.", prompt: "Tap the wrong past-tense verb.", target: "catched", wrong: [{ phrase: "ball", mistake: "l4-past" }] },
    { s: "Please set down on the bench.", prompt: "Tap the verb that should be 'sit'.", target: "set", wrong: [{ phrase: "bench.", mistake: "l4-tricky" }] },
  ],
  c3: [
    { prompt: "Build the sentence in the past tense.", answer: "Raj | broke | the vase by mistake.", spares: ["breaked"], wrong: [["Raj breaked the vase by mistake.", "l4-past"]] },
    { prompt: "Build the sentence in the future tense.", answer: "We | will plant | a tree tomorrow.", spares: ["will planted"], wrong: [["We will planted a tree tomorrow.", "l4-future"]] },
    { prompt: "Build the sentence with the right verb.", answer: "The bus | reaches | school at eight.", spares: ["reach"], wrong: [["The bus reach school at eight.", "l4-agreement"]] },
  ],
  c4: [
    { prompt: "Build the sentence with the contraction for 'they are'.", answer: "They're | going | home.", spares: ["Theyr'e"], wrong: [["Theyr'e going home.", "l4-contraction"]] },
    { prompt: "Build the sentence with only one negative.", answer: "I | don't have | any money.", spares: ["no"], wrong: [["I don't have no money.", "l4-contraction"]] },
  ],
  c5: [
    { s: "Mr. Iyer learned us about volcanoes.", bad: "learned", mistake: "l4-tricky", prompt: "One verb should be 'taught'. Tap it." },
    { s: "The children sanged a song at the assembly.", bad: "sanged", mistake: "l4-past", prompt: "One verb is in the wrong past tense. Tap it." },
    { s: "Its raining, so we can't play outside.", bad: "Its", mistake: "l4-contraction", prompt: "One contraction is missing its apostrophe. Tap it." },
  ],
  p1: [
    { line: "She [[drawed]] a picture of her cat.", q: "What should the highlighted verb be?", a: "drew", w: ["drawn", "draws", "drawing"], m: "l4-past" },
    { line: "My brother [[fix]] bikes on weekends.", q: "What should the highlighted verb be?", a: "fixes", w: ["fixs", "fixing", "fixed up"], m: "l4-agreement" },
    { line: "[[Can]] I go to the bathroom, please?", q: "Which word is better for asking permission?", a: "May", w: ["Will", "Must", "Did"], m: "l4-tricky" },
  ],
  p5: [
    { q: "\"'Won't' is the contraction of 'will not'.\"", a: "Yes: won't is a special contraction for will not", w: ["No: it means 'would not'", "No: it means 'want not'", "Yes, and so is willn't"], m: "l4-contraction" },
    { q: "\"'I haven't never seen snow' is correct.\"", a: "No: it has two negatives; say 'I have never seen snow'", w: ["Yes: two negatives make it stronger", "Yes: it is a normal sentence", "No: it should be 'I hasn't never'"], m: "l4-contraction" },
  ],
  a1: [
    { q: "The past tense of 'dig' is ___", a: "dug", w: ["digged", "dig", "digging"], m: "l4-past" },
    { q: "The past tense of 'take' is ___", a: "took", w: ["taked", "taken", "tooked"], m: "l4-past" },
    { q: "The past tense of 'speak' is ___", a: "spoke", w: ["speaked", "spoken", "spoked"], m: "l4-past" },
  ],
  a2: [
    { q: "Fill the gap: The baby ___ (cry) all night.", a: "cried", w: ["cryed", "cries", "crying"], m: "l4-past" },
    { q: "Fill the gap: My sister ___ (wash) the dishes every day.", a: "washes", w: ["wash", "washs", "washing"], m: "l4-agreement" },
    { q: "Fill the gap: Next year, I ___ in Class 5.", a: "will be", w: ["will was", "was", "will is"], m: "l4-future" },
  ],
  a4: [
    { q: "Which sentence is correct?", a: "Please lie down and rest.", w: ["Please lay down and rest.", "Please laid down and rest.", "Please lying down and rest."], m: "l4-tricky" },
    { q: "Which contraction is written correctly?", a: "doesn't", w: ["does'nt", "doesnt'", "doe'snt"], m: "l4-contraction" },
    { q: "Which sentence has no double negative?", a: "Nobody saw anything.", w: ["Nobody saw nothing.", "Nobody didn't see anything.", "Nobody never saw nothing."], m: "l4-contraction" },
  ],
};

// ---------------- Usage: nouns, pronouns and comparisons (3.9–3.14) ----------------
export const NOUN_USAGE: SkillTopic = {
  topic: "l4-nouns-usage",
  prefix: "lnu4",
  c1: [
    { s: "The childs played with the mouses in the barn.", prompt: "Tap the two wrong plurals.", target: ["childs", "mouses"], wrong: [{ phrase: "barn.", mistake: "l4-plural" }] },
    { s: "The girls bags were left on the bus.", prompt: "Tap the word that needs an apostrophe to show ownership.", target: "girls", wrong: [{ phrase: "bags", mistake: "l4-possessive" }] },
    { s: "Mom gave the books to Raj and I.", prompt: "Tap the pronoun that should be 'me'.", target: "I.", wrong: [{ phrase: "Mom", mistake: "l4-pronoun" }] },
    { s: "This puzzle is more harder than that one.", prompt: "Tap the extra word.", target: "more", wrong: [{ phrase: "harder", mistake: "l4-compare" }] },
  ],
  c3: [
    { prompt: "Build the plural.", answer: "two | boxes", spares: ["boxs"], wrong: [["two boxs", "l4-plural"]] },
    { prompt: "Build the plural.", answer: "three | babies", spares: ["babys"], wrong: [["three babys", "l4-plural"]] },
    { prompt: "Build the sentence comparing three things.", answer: "Everest is | the highest | mountain in the world.", spares: ["the most highest"], wrong: [["Everest is the most highest mountain in the world.", "l4-compare"]] },
  ],
  c4: [
    { prompt: "Build: the toys that belong to the children.", answer: "the | children's | toys", spares: ["childrens'"], wrong: [["the childrens' toys", "l4-possessive"]] },
    { prompt: "Build: the tail of one dog.", answer: "the | dog's | tail", spares: ["dogs'"], wrong: [["the dogs' tail", "l4-possessive"]] },
  ],
  c5: [
    { s: "Her and I went to the library.", bad: "Her", mistake: "l4-pronoun", prompt: "One pronoun is wrong. Tap it." },
    { s: "A cheetah runs more fast than a lion.", bad: "more", mistake: "l4-compare", prompt: "One word makes the comparison wrong. Tap it." },
    { s: "We saw three deers and two gooses.", bad: "gooses.", mistake: "l4-plural", prompt: "One plural is wrong (the other is fine: deer stays deer). Tap the wrong one." },
  ],
  p1: [
    { line: "The [[teachers']] room is upstairs.", q: "What does the highlighted word show?", a: "A room that belongs to more than one teacher", w: ["A room that belongs to one teacher", "More than one teacher, with no owner", "A contraction of 'teacher is'"], m: "l4-possessive" },
    { line: "Leela sings [[more sweetly]] than her sister.", q: "What kind of word is highlighted?", a: "A comparative adverb", w: ["A superlative adjective", "A plural noun", "A pronoun"], m: "l4-compare" },
    { line: "The coach thanked [[us]].", q: "What kind of pronoun is highlighted?", a: "An object pronoun", w: ["A subject pronoun", "A possessive noun", "A linking verb"], m: "l4-pronoun" },
  ],
  p5: [
    { q: "\"The plural of 'foot' is 'foots'.\"", a: "No: it is an irregular plural, 'feet'", w: ["Yes: just add s", "No: it is 'footes'", "Yes, like 'boots'"], m: "l4-plural" },
    { q: "\"Use 'tallest' when comparing just two people.\"", a: "No: use 'taller' for two, 'tallest' for three or more", w: ["Yes: tallest is always correct", "No: use 'most tall'", "Yes, for people only"], m: "l4-compare" },
  ],
  a1: [
    { q: "The plural of 'leaf' is ___", a: "leaves", w: ["leafs", "leafes", "leaf"], m: "l4-plural" },
    { q: "The plural of 'tooth' is ___", a: "teeth", w: ["tooths", "toothes", "teeths"], m: "l4-plural" },
    { q: "Which is a subject pronoun?", a: "we", w: ["us", "them", "me"], m: "l4-pronoun" },
  ],
  a2: [
    { q: "Fill the gap: This is the ___ day of the year.", a: "hottest", w: ["hotter", "most hot", "hotest"], m: "l4-compare" },
    { q: "Fill the gap: Grandpa told ___ a story.", a: "them", w: ["they", "their", "theirs"], m: "l4-pronoun" },
    { q: "Fill the gap: The two ___ nests are high in the tree.", a: "birds'", w: ["bird's", "birds", "birds's"], m: "l4-possessive" },
  ],
  a4: [
    { q: "Three friends own the bikes. Which sentence is correct?", a: "My friends' bikes are new.", w: ["My friend's bikes are new.", "My friends bikes are new.", "My friends's bikes are new."], m: "l4-possessive" },
    { q: "Which sentence is correct?", a: "She drives more carefully than her brother.", w: ["She drives carefuller than her brother.", "She drives more careful than her brother.", "She drives most carefully than her brother."], m: "l4-compare" },
  ],
};

// ---------------- Word study and figurative language (3.15–3.22) ----------------
export const WORDS: SkillTopic = {
  topic: "l4-words",
  prefix: "lwd4",
  c1: [
    { s: "The tiny ant carried a huge crumb.", prompt: "Tap the two antonyms.", target: ["tiny", "huge"], wrong: [{ phrase: "carried", mistake: "l4-synonym" }] },
    { s: "The happy children were joyful at the fair.", prompt: "Tap the two synonyms.", target: ["happy", "joyful"], wrong: [{ phrase: "fair.", mistake: "l4-synonym" }] },
    { s: "Their dog is over there by the gate.", prompt: "Tap the two homophones.", target: ["Their", "there"], wrong: [{ phrase: "dog", mistake: "l4-synonym" }] },
    { s: "The wind whispered through the trees.", prompt: "Tap the word that gives the wind a human action.", target: "whispered", wrong: [{ phrase: "trees.", mistake: "l4-figurative" }] },
  ],
  c2: [
    { s: "Her smile was as bright as the sun.", prompt: "Tap the words that make the simile.", target: "as bright as the sun.", wrong: [{ phrase: "Her smile", mistake: "l4-figurative" }] },
    { s: "The classroom was a zoo after lunch.", prompt: "Tap the words that make the metaphor.", target: "was a zoo", wrong: [{ phrase: "after lunch.", mistake: "l4-figurative" }] },
  ],
  c3: [
    { prompt: "Build a simile.", answer: "The baby's skin | was as soft | as silk.", spares: ["was silk."], wrong: [["The baby's skin was silk.", "l4-figurative"]] },
    { prompt: "Build a sentence with the right homophone.", answer: "I | ate | eight grapes.", spares: ["eight"], wrong: [["I eight eight grapes.", "l4-synonym"]] },
  ],
  c5: [
    { s: "I want to go to the park two.", bad: "two.", mistake: "l4-synonym", prompt: "One homophone is wrong. Tap it." },
    { s: "The opposite of ancient is old.", bad: "old.", mistake: "l4-synonym", prompt: "One word is a synonym, not an antonym. Tap it." },
    { s: "My little brother is as tall as a giraffe, because he is the shortest in class.", bad: "tall", mistake: "l4-figurative", prompt: "One word makes the simile not fit the meaning. Tap it." },
  ],
  p1: [
    { line: "The baseball player swung the [[bat]].", q: "What does 'bat' mean here?", a: "A stick for hitting a ball", w: ["A flying animal", "To blink", "A turn in a game"], m: "l4-meaning" },
    { line: "The dog's [[bark]] woke the baby.", q: "What does 'bark' mean here?", a: "The sound a dog makes", w: ["The outside of a tree", "A kind of boat", "To shout orders"], m: "l4-meaning" },
    { line: "The old car [[groaned]] up the hill.", q: "What is this an example of?", a: "Personification", w: ["A simile", "An antonym", "A proverb"], m: "l4-figurative" },
    { line: "Grandpa's hands are as rough as sandpaper.", q: "What is this an example of?", a: "A simile", w: ["A metaphor", "Personification", "An idiom"], m: "l4-figurative" },
  ],
  p2: [
    { line: "That test was a piece of cake.", q: "What does the idiom mean?", a: "The test was very easy", w: ["The test was about baking", "There was cake after the test", "The test was very hard"], m: "l4-figurative" },
    { line: "It's raining cats and dogs!", q: "What does the idiom mean?", a: "It is raining very heavily", w: ["Animals are falling from the sky", "It is a little drizzle", "Pets are playing in the rain"], m: "l4-figurative" },
    { line: "Don't count your chickens before they hatch.", q: "What does this proverb mean?", a: "Don't be sure of something before it happens", w: ["Count your chickens every day", "Chickens hatch slowly", "Eggs are hard to count"], m: "l4-figurative" },
  ],
  p5: [
    { q: "\"'The moon is a silver plate' is a simile.\"", a: "No: it doesn't use 'like' or 'as', so it is a metaphor", w: ["Yes: it compares two things", "Yes: all comparisons are similes", "No: it is personification"], m: "l4-figurative" },
    { q: "\"'Brave' and 'fearless' are antonyms.\"", a: "No: they mean nearly the same, so they are synonyms", w: ["Yes: they are opposites", "No: they are homophones", "Yes, because they are spelt differently"], m: "l4-synonym" },
  ],
  a1: [
    { q: "An antonym of 'generous' is ___", a: "selfish", w: ["kind", "giving", "helpful"], m: "l4-synonym" },
    { q: "A synonym of 'begin' is ___", a: "start", w: ["finish", "stop", "end"], m: "l4-synonym" },
    { q: "A simile compares two things using ___", a: "'like' or 'as'", w: ["'and' or 'but'", "a question mark", "only nouns"], m: "l4-figurative" },
  ],
  a2: [
    { q: "Fill the gap: I can ___ the music from my room.", a: "hear", w: ["here", "hair", "heard"], m: "l4-synonym" },
    { q: "Fill the gap: The wind ___ the papers off my desk.", a: "blew", w: ["blue", "blow", "bloo"], m: "l4-synonym" },
    { q: "Fill the gap: We walked ___ the river to the temple.", a: "past", w: ["passed", "passt", "pass"], m: "l4-synonym" },
  ],
  a4: [
    { q: "Which sentence has a metaphor?", a: "My brother is a couch potato.", w: ["My brother eats like a horse.", "My brother sleeps a lot.", "My brother is as lazy as a cat."], m: "l4-figurative" },
    { q: "Which sentence uses the most descriptive language?", a: "The crisp, golden leaves crunched under my boots.", w: ["The leaves were on the ground.", "There were some leaves.", "I walked on leaves."], m: "l4-figurative" },
    { q: "'Break a leg!' means ___", a: "Good luck!", w: ["Be careful not to fall!", "Go to the doctor!", "Run fast!"], m: "l4-figurative" },
  ],
};
