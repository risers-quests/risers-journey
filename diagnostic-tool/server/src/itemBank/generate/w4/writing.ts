import { Misconceptions, SkillTopic } from "../skillTopic.js";

/**
 * Grade 4 Writing (Spectrum Writing Grade 4). Its four chapters, with
 * Chapter 1 (Foundations of Writing) split in two: word choice and
 * sentences (lessons 1.1–1.12), and proofreading (1.13–1.17). Writing
 * itself needs a reader, so these topics test the parts of writing that
 * have a right answer. Sentences are our own, in the book's style.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "w4-word-choice": { label: "Picks vague words over precise ones", detail: "Chooses 'dog' over 'beagle', 'went' over 'raced', 'nice' over 'sparkling'.", childTip: "Precise nouns, strong verbs and descriptive adjectives and adverbs help the reader picture exactly what you mean." },
  "w4-part-of-speech": { label: "Mixes up nouns, verbs, adjectives and adverbs", detail: "Calls a describing word a verb, or an adverb an adjective.", childTip: "Noun: a person, place or thing. Verb: an action. Adjective: describes a noun. Adverb: tells how, when or where (often ends in -ly)." },
  "w4-shades": { label: "Misses shades of meaning", detail: "Treats similar words (warm, hot, boiling) as if they meant exactly the same.", childTip: "Line similar words up from weakest to strongest: warm, hot, boiling." },
  "w4-conjunction": { label: "Uses the wrong joining word", detail: "Uses 'and' where 'but' or 'because' fits, or mixes coordinating and subordinating conjunctions.", childTip: "FANBOYS (for, and, nor, but, or, yet, so) join equal parts. Because, when, although, if, since start a part that can't stand alone." },
  "w4-general-specific": { label: "Can't order from general to specific", detail: "Starts with a small detail instead of the big idea.", childTip: "General is the big group (animals); specific is one kind (a golden retriever). Start big, then narrow down." },
  "w4-caps": { label: "Misses capital letters", detail: "Doesn't capitalise names, places, the first word of a sentence or I, or capitalises common nouns.", childTip: "Capitals for: the first word of a sentence, I, names of people, places, days and months. Not for ordinary nouns like fox or city." },
  "w4-comma": { label: "Misses or misplaces commas", detail: "Leaves out commas in a list, a date, after an opening word, or before a quotation ends.", childTip: "Commas go between items in a list, between the day and the year, after words like Yes or First, and before 'and' or 'but' joining two sentences." },
  "w4-dialogue": { label: "Punctuates dialogue wrongly", detail: "Puts end marks outside the quotation marks, or forgets the comma before 'said'.", childTip: "The spoken words and their punctuation go inside the quotation marks: “Look out!” she shouted. “I'm here,” he said." },
  "w4-spelling": { label: "Misses spelling mistakes", detail: "Doesn't spot misspelt words or wrong homophones (read/red, their/there).", childTip: "Read each word slowly. Check sound-alike words: their/there/they're, to/too/two, red/read." },
  "w4-agreement": { label: "Misses subject-verb agreement", detail: "Writes 'Foxes is' or 'She walk'.", childTip: "One subject takes a verb with -s (The dog runs). More than one takes no -s (The dogs run)." },
  "w4-sequence": { label: "Puts events or steps out of order", detail: "Can't follow time-order words or the order of steps.", childTip: "Look for time-order words: first, next, then, after that, finally." },
  "w4-transition": { label: "Uses the wrong transition", detail: "Uses 'finally' to start, or 'also' to show a contrast.", childTip: "Order: first, next, finally. Add: also, in addition. Contrast: however, but. Result: so, as a result." },
  "w4-story": { label: "Mixes up story elements", detail: "Confuses character, setting, problem and plot.", childTip: "Characters: who. Setting: where and when. Plot: what happens, with a beginning, a middle and an end." },
  "w4-senses": { label: "Mixes up sensory details", detail: "Can't tell which sense a word appeals to.", childTip: "Ask: would I see, hear, smell, taste or feel (touch) this?" },
  "w4-pov": { label: "Mixes up point of view", detail: "Confuses first person (I, we) with third person (he, she, they).", childTip: "First person: the narrator is in the story and says I. Third person: the narrator tells about others: he, she, they." },
  "w4-traits": { label: "Misreads a character's traits or feelings", detail: "Takes only what is said, and misses what actions show.", childTip: "What a character does and says shows what they are like: shaking hands might show they are nervous." },
  "w4-main-idea": { label: "Can't find the main idea or topic sentence", detail: "Picks a detail as the main idea, or keeps a sentence that doesn't belong.", childTip: "The topic sentence tells what the whole paragraph is about. Every detail should support it." },
  "w4-structure": { label: "Mixes up ways of organising information", detail: "Confuses compare, cause and effect, categories and order in space.", childTip: "Compare: alike and different. Cause and effect: why something happened, and what happened. Space: left to right, top to bottom, near to far." },
  "w4-letter": { label: "Mixes up the parts of a letter", detail: "Confuses the greeting, body, closing and signature, or friendly and business letters.", childTip: "Date, greeting (Dear …,), body, closing (Love, / Sincerely,), signature. A business letter is formal and has a clear purpose." },
  "w4-fact-opinion": { label: "Mixes up fact and opinion", detail: "Calls a belief a fact, or something checkable an opinion.", childTip: "A fact can be checked (Squirrels bury nuts). An opinion is what someone thinks or feels (Hockey is the best sport). Watch for best, worst, should, fun." },
  "w4-persuade": { label: "Misses how writers persuade", detail: "Can't tell a reason from an emotional appeal, or doesn't notice bias.", childTip: "Strong opinions give reasons and facts. Emotional appeals work on feelings. Biased writing shows only one side." },
};

// ---------------- Chapter 1 (lessons 1.1–1.12): words and sentences ----------------
export const WORDS_SENTENCES: SkillTopic = {
  topic: "w4-words",
  prefix: "wws4",
  c1: [
    { s: "The beagle sniffed the muddy garden.", prompt: "Tap the precise noun that names the kind of dog.", target: "beagle", wrong: [{ phrase: "garden.", mistake: "w4-part-of-speech" }] },
    { s: "Mia sprinted across the field to catch the bus.", prompt: "Tap the strong verb.", target: "sprinted", wrong: [{ phrase: "field", mistake: "w4-part-of-speech" }] },
    { s: "A fluffy kitten slept on the warm blanket.", prompt: "Tap the two adjectives.", target: ["fluffy", "warm"], wrong: [{ phrase: "slept", mistake: "w4-part-of-speech" }] },
    { s: "The old turtle crawled slowly towards the pond.", prompt: "Tap the adverb that tells how the turtle crawled.", target: "slowly", wrong: [{ phrase: "old", mistake: "w4-part-of-speech" }] },
    { s: "First, we packed our bags. Then, we drove to the beach.", prompt: "Tap the two time-order words.", target: ["First,", "Then,"] },
  ],
  c2: [
    { s: "I wanted to play outside, but it was raining.", prompt: "Tap the coordinating conjunction.", target: "but", wrong: [{ phrase: "to", mistake: "w4-conjunction" }] },
    { s: "We stayed inside because the wind was too strong.", prompt: "Tap the subordinating conjunction.", target: "because", wrong: [{ phrase: "inside", mistake: "w4-conjunction" }] },
    { s: "Raj finished his homework. Afterwards, he played chess.", prompt: "Tap the transition word.", target: "Afterwards,", wrong: [{ phrase: "finished", mistake: "w4-transition" }] },
    { s: "The soup was boiling, so Dad turned down the heat.", prompt: "Tap the word that shows how hot the soup was.", target: "boiling,", wrong: [{ phrase: "heat.", mistake: "w4-shades" }] },
  ],
  c3: [
    { prompt: "Join the two sentences with a coordinating conjunction.", answer: "Sam likes apples, | but | his sister likes mangoes.", spares: ["because"], wrong: [["Sam likes apples, because his sister likes mangoes.", "w4-conjunction"]] },
    { prompt: "Join the sentences with a subordinating conjunction.", answer: "We went home | when | the sun set.", spares: ["but"], wrong: [["We went home but the sun set.", "w4-conjunction"]] },
    { prompt: "Build a sentence with a strong verb.", answer: "The puppy | dashed | across the yard.", spares: ["went"], wrong: [["The puppy went across the yard.", "w4-word-choice"]] },
    { prompt: "Put the sentences in time order.", answer: "First, I washed my hands. | Next, I spread the jam. | Finally, I ate my sandwich.", spares: [], wrong: [["Next, I spread the jam. First, I washed my hands. Finally, I ate my sandwich.", "w4-sequence"]] },
  ],
  c4: [
    { prompt: "Order these from general to specific.", answer: "animals | birds | parrots", spares: [], wrong: [["parrots birds animals", "w4-general-specific"]] },
    { prompt: "Order these from general to specific.", answer: "food | fruit | mangoes", spares: [], wrong: [["mangoes fruit food", "w4-general-specific"]] },
    { prompt: "Order these words from weakest to strongest.", answer: "warm | hot | boiling", spares: [], wrong: [["hot warm boiling", "w4-shades"]] },
    { prompt: "Order these words from weakest to strongest.", answer: "glad | happy | thrilled", spares: [], wrong: [["happy glad thrilled", "w4-shades"]] },
  ],
  c5: [
    { s: "Finally, I woke up and brushed my teeth.", bad: "Finally,", mistake: "w4-sequence", prompt: "One time-order word is in the wrong place. Tap it." },
    { s: "I was hungry, but I ate a big lunch.", bad: "but", mistake: "w4-conjunction", prompt: "One joining word doesn't fit the meaning. Tap it." },
    { s: "The cheetah ran quick across the plain.", bad: "quick", mistake: "w4-part-of-speech", prompt: "One word should be an adverb. Tap it." },
    { s: "My brother made a nice thing for my birthday.", bad: "thing", mistake: "w4-word-choice", prompt: "Tap the vague noun that should be more precise." },
  ],
  p1: [
    { line: "The eagle [[soared]] over the mountains.", q: "What kind of word is highlighted?", a: "A strong verb", w: ["A noun", "An adjective", "A conjunction"], m: "w4-part-of-speech" },
    { line: "Grandma hummed [[softly]] as she cooked.", q: "What does the highlighted word tell?", a: "How she hummed", w: ["Where she hummed", "Who hummed", "What she cooked"], m: "w4-part-of-speech" },
    { line: "The [[gigantic]] whale rose out of the sea.", q: "What kind of word is highlighted?", a: "An adjective", w: ["An adverb", "A verb", "A time-order word"], m: "w4-part-of-speech" },
    { line: "It started to rain, [[so]] we opened our umbrellas.", q: "What does the highlighted word show?", a: "A result", w: ["A contrast", "A time order", "A choice"], m: "w4-conjunction" },
  ],
  p2: [
    { line: "The baby [[giggled]] at the puppy.", q: "Which word is weaker than the highlighted one?", a: "smiled", w: ["roared with laughter", "howled", "cackled loudly"], m: "w4-shades" },
    { line: "Ali was [[furious]] when his kite broke.", q: "Which word means a milder feeling?", a: "annoyed", w: ["enraged", "livid", "boiling with anger"], m: "w4-shades" },
    { line: "We ate lunch. [[Later]], we went to the museum.", q: "What does the highlighted word show?", a: "Time order", w: ["A contrast", "A reason", "An example"], m: "w4-transition" },
  ],
  p5: [
    { q: "\"'The car went down the road' is clearer than 'The red sports car zoomed down the road'.\"", a: "No: precise nouns, verbs and adjectives paint a clearer picture", w: ["Yes: shorter is always better", "Yes: 'went' is a strong verb", "They say exactly the same thing"], m: "w4-word-choice" },
    { q: "\"Using sentences of different lengths makes writing more interesting.\"", a: "Yes: varied sentences keep the reader interested", w: ["No: every sentence should be the same length", "No: only short sentences are correct", "Yes, but only in poems"], m: "w4-word-choice" },
    { q: "\"'Because' is a coordinating conjunction, like 'and' and 'but'.\"", a: "No: 'because' is a subordinating conjunction", w: ["Yes: all joining words are the same", "Yes: it joins two equal sentences", "No: 'because' is an adverb"], m: "w4-conjunction" },
  ],
  a1: [
    { q: "An adverb tells ___", a: "how, when or where something happens", w: ["the name of a person or place", "what a noun looks like", "who is doing the action"], m: "w4-part-of-speech" },
    { q: "Which is a coordinating conjunction?", a: "and", w: ["because", "although", "when"], m: "w4-conjunction" },
    { q: "Time-order words ___", a: "show when events happen", w: ["describe a noun", "name a place", "show how strongly someone feels"], m: "w4-transition" },
  ],
  a2: [
    { q: "Which is the most precise noun?", a: "sunflower", w: ["plant", "thing", "flower"], m: "w4-word-choice" },
    { q: "Which is the strongest verb?", a: "devoured", w: ["ate", "had", "got"], m: "w4-word-choice" },
    { q: "Fill the gap: I was tired, ___ I went to bed early.", a: "so", w: ["but", "or", "although"], m: "w4-conjunction" },
  ],
  a3: [
    { q: "Fill the gap: ___ it was cold, we went swimming.", a: "Although", w: ["Because", "So", "And"], m: "w4-conjunction" },
    { q: "Which word is the strongest?", a: "freezing", w: ["cool", "chilly", "cold"], m: "w4-shades" },
    { q: "Which list goes from general to specific?", a: "sports, ball games, cricket", w: ["cricket, ball games, sports", "ball games, cricket, sports", "sports, cricket, ball games"], m: "w4-general-specific" },
  ],
  a4: [
    { q: "Which sentence uses the most precise words?", a: "The tabby cat pounced on the squeaky toy.", w: ["The cat got the toy.", "The animal went to the thing.", "The cat did something."], m: "w4-word-choice" },
    { q: "Which is a complex sentence?", a: "When the bell rang, we ran outside.", w: ["We ran outside.", "The bell rang, and we ran outside.", "Run outside!"], m: "w4-conjunction" },
    { q: "Which transition best starts the last step?", a: "Finally", w: ["First", "Next", "To begin"], m: "w4-transition" },
  ],
};

// ---------------- Chapter 1 (lessons 1.13–1.17): proofreading ----------------
export const PROOFREADING: SkillTopic = {
  topic: "w4-proofreading",
  prefix: "wpr4",
  c1: [
    { s: "my friend and i went to the zoo.", prompt: "Tap the two words that need a capital letter.", target: ["my", "i"], wrong: [{ phrase: "zoo.", mistake: "w4-caps" }] },
    { s: "We visited Boston in july last year.", prompt: "Tap the word that needs a capital letter.", target: "july", wrong: [{ phrase: "year.", mistake: "w4-caps" }] },
    { s: "I just saw a Fox run through the yard.", prompt: "Tap the word that should NOT have a capital letter.", target: "Fox", wrong: [{ phrase: "I", mistake: "w4-caps" }] },
    { s: "The foxes is clever animals.", prompt: "Tap the verb that doesn't agree with its subject.", target: "is", wrong: [{ phrase: "foxes", mistake: "w4-agreement" }] },
    { s: "Foxes can be read, gray, or white.", prompt: "Tap the misspelt word.", target: "read,", wrong: [{ phrase: "gray,", mistake: "w4-spelling" }] },
  ],
  c2: [
    { s: "I've never seen seen a fox before.", prompt: "One word appears twice. Tap the extra one.", target: "seen", wrong: [{ phrase: "fox", mistake: "w4-spelling" }] },
    { s: "My sister walk to school every day.", prompt: "Tap the verb that doesn't agree with its subject.", target: "walk", wrong: [{ phrase: "sister", mistake: "w4-agreement" }] },
    { s: "Their going to the park after lunch.", prompt: "Tap the wrong sound-alike word.", target: "Their", wrong: [{ phrase: "park", mistake: "w4-spelling" }] },
    { s: "We had a wonderfull time at the fair.", prompt: "Tap the misspelt word.", target: "wonderfull", wrong: [{ phrase: "fair.", mistake: "w4-spelling" }] },
  ],
  c3: [
    { prompt: "Build the dialogue with the right punctuation.", answer: "“I'm glad it was,” | said Marty.", spares: ["“I'm glad it was”,"], wrong: [["“I'm glad it was”, said Marty.", "w4-dialogue"]] },
    { prompt: "Build the question in dialogue.", answer: "“Did it look like a small dog?” | he asked.", spares: ["“Did it look like a small dog”?"], wrong: [["“Did it look like a small dog”? he asked.", "w4-dialogue"]] },
    { prompt: "Build the sentence with commas in the list.", answer: "They eat mice, | rabbits, | and berries.", spares: ["rabbits"], wrong: [["They eat mice, rabbits and berries.", "w4-comma"]] },
    { prompt: "Build the date correctly.", answer: "June 5, | 2024", spares: ["June 5"], wrong: [["June 5 2024", "w4-comma"]] },
  ],
  c4: [
    { prompt: "Build the sentence so the verb agrees with the subject.", answer: "The dogs | bark | at night.", spares: ["barks"], wrong: [["The dogs barks at night.", "w4-agreement"]] },
    { prompt: "Build the sentence so the verb agrees with the subject.", answer: "My cat | sleeps | all day.", spares: ["sleep"], wrong: [["My cat sleep all day.", "w4-agreement"]] },
    { prompt: "Build the sentence with the right sound-alike words.", answer: "The two girls | went | to the store too.", spares: ["The to girls"], wrong: [["The to girls went to the store too.", "w4-spelling"]] },
    { prompt: "Build the exclamation in dialogue.", answer: "“Watch out!” | shouted Priya.", spares: ["“Watch out”!"], wrong: [["“Watch out”! shouted Priya.", "w4-dialogue"]] },
  ],
  c5: [
    { s: "They live in forests, fields, and cities like boston.", bad: "boston.", mistake: "w4-caps", prompt: "One word needs a capital letter. Tap it." },
    { s: "The children plays football after school.", bad: "plays", mistake: "w4-agreement", prompt: "One verb doesn't agree with its subject. Tap it." },
    { s: "I put my books over their on the table.", bad: "their", mistake: "w4-spelling", prompt: "One sound-alike word is wrong. Tap it." },
    { s: "Yesterday we went to the libary to borrow books.", bad: "libary", mistake: "w4-spelling", prompt: "One word is misspelt. Tap it." },
  ],
  p1: [
    { line: "“Foxes are clever animals[[”]] said Grandpa.", q: "What is missing before the highlighted quotation mark?", a: "A comma", w: ["A full stop", "A question mark", "Nothing"], m: "w4-dialogue" },
    { line: "We bought apples [[bananas]] and grapes.", q: "What is missing after 'apples'?", a: "A comma", w: ["A full stop", "A capital letter", "Quotation marks"], m: "w4-comma" },
    { line: "On [[monday]], we have a spelling test.", q: "What is wrong with the highlighted word?", a: "It needs a capital letter", w: ["It is misspelt", "It needs quotation marks", "It should be plural"], m: "w4-caps" },
    { line: "Each of the boys [[have]] a bicycle.", q: "What should the highlighted word be?", a: "has", w: ["having", "haves", "had have"], m: "w4-agreement" },
  ],
  p2: [
    { line: "The wind [[blew]] the leaves away.", q: "Is the highlighted word spelt right for its meaning?", a: "Yes: 'blew' is the past of blow", w: ["No: it should be 'blue'", "No: it should be 'blewed'", "No: it should be 'bloo'"], m: "w4-spelling" },
    { line: "Yes[[,]] I would love to come to your party.", q: "Why is the highlighted comma there?", a: "It comes after an opening word like Yes", w: ["It separates items in a list", "It ends the sentence", "It shows a question"], m: "w4-comma" },
    { line: "“Can I help you?” [[A]]sked the shopkeeper.", q: "What is wrong with the highlighted letter?", a: "It should be lowercase", w: ["It should be bold", "It is spelt wrong", "Nothing is wrong"], m: "w4-dialogue" },
  ],
  p5: [
    { q: "\"In dialogue, the comma goes outside the quotation marks: “Hello”, she said.\"", a: "No: the comma goes inside: “Hello,” she said.", w: ["Yes: punctuation always goes outside", "Yes: no comma is needed", "No: use a full stop instead"], m: "w4-dialogue" },
    { q: "\"'Fox' needs a capital letter because it is an animal.\"", a: "No: common nouns like fox don't need capitals", w: ["Yes: all animals need capitals", "Yes: all nouns need capitals", "No: only verbs need capitals"], m: "w4-caps" },
    { q: "\"'The cats sleeps' is correct.\"", a: "No: more than one cat needs 'sleep'", w: ["Yes: verbs always end in -s", "Yes: cats is singular", "No: it should be 'The cats sleepies'"], m: "w4-agreement" },
  ],
  a1: [
    { q: "Which word always needs a capital letter?", a: "I", w: ["me", "dog", "city"], m: "w4-caps" },
    { q: "Where does a comma go in a date?", a: "Between the day and the year (May 4, 2024)", w: ["Between the month and the day", "After the year only", "Dates never have commas"], m: "w4-comma" },
    { q: "When proofreading, you check for ___", a: "capitals, punctuation, spelling and grammar", w: ["only the title", "only the length", "only the handwriting"], m: "w4-spelling" },
  ],
  a2: [
    { q: "Fill the gap: The birds ___ south in winter.", a: "fly", w: ["flies", "flys", "flying"], m: "w4-agreement" },
    { q: "Fill the gap: My dad ___ the dishes every night.", a: "washes", w: ["wash", "washs", "washing"], m: "w4-agreement" },
    { q: "Fill the gap: ___ coats are on the bench.", a: "Their", w: ["There", "They're", "Thier"], m: "w4-spelling" },
  ],
  a4: [
    { q: "Which sentence is punctuated correctly?", a: "“Let's go,” said Mom.", w: ["“Let's go” said Mom.", "“Let's go”, said Mom.", "Let's go, said Mom."], m: "w4-dialogue" },
    { q: "Which sentence is capitalised correctly?", a: "Ravi and I visited Delhi in May.", w: ["ravi and i visited delhi in may.", "Ravi and i visited Delhi in may.", "Ravi And I Visited delhi In May."], m: "w4-caps" },
    { q: "Which sentence is correct?", a: "My friends were too tired to walk two miles.", w: ["My friends was to tired to walk two miles.", "My friends were to tired to walk too miles.", "My friends was too tired to walk to miles."], m: "w4-agreement" },
  ],
};

// ---------------- Chapter 2: Writing a Narrative ----------------
export const NARRATIVE: SkillTopic = {
  topic: "w4-narrative",
  prefix: "wnr4",
  c1: [
    { s: "The popcorn crackled and filled the room with a buttery smell.", prompt: "Tap the word that appeals to hearing.", target: "crackled", wrong: [{ phrase: "buttery", mistake: "w4-senses" }] },
    { s: "The sand felt hot and gritty under my feet.", prompt: "Tap the two words that appeal to touch.", target: ["hot", "gritty"], wrong: [{ phrase: "feet.", mistake: "w4-senses" }] },
    { s: "Maxwell grabbed his backpack and bounded out the door.", prompt: "Tap the name of the main character.", target: "Maxwell", wrong: [{ phrase: "backpack", mistake: "w4-story" }] },
    { s: "I hid behind the curtain and held my breath.", prompt: "Tap the word that shows first-person point of view.", target: "I", wrong: [{ phrase: "curtain", mistake: "w4-pov" }], also: [["I", "my"], "my"] },
  ],
  c2: [
    { s: "On a stormy night in an old castle, a mouse found a key.", prompt: "Tap every word of the setting.", target: "On a stormy night in an old castle,", wrong: [{ phrase: "a mouse found a key.", mistake: "w4-story" }] },
    { s: "Zara's hands shook as she walked onto the stage.", prompt: "Tap the words that show Zara is nervous.", target: "Zara's hands shook", wrong: [{ phrase: "onto the stage.", mistake: "w4-traits" }] },
    { s: "The lemonade was sour and icy cold.", prompt: "Tap the word that appeals to taste.", target: "sour", wrong: [{ phrase: "cold.", mistake: "w4-senses" }] },
  ],
  c3: [
    { prompt: "Put the story in order: beginning, middle, end.", answer: "Leo lost his kite in a tree. | He asked his sister to help. | Together they got it down.", spares: [], wrong: [["He asked his sister to help. Leo lost his kite in a tree. Together they got it down.", "w4-sequence"]] },
    { prompt: "Build the line of dialogue.", answer: "“Where are you going?” | asked Mom.", spares: ["“Where are you going”?"], wrong: [["“Where are you going”? asked Mom.", "w4-dialogue"]] },
    { prompt: "Build a sentence with imagery (a simile).", answer: "The snow | was as soft | as a pillow.", spares: ["was soft."], wrong: [["The snow was soft.", "w4-word-choice"]] },
  ],
  c4: [
    { prompt: "Put the story in order.", answer: "Ana found a lost puppy. | She put up posters around town. | The owner called that evening. | The puppy went home happily.", spares: [], wrong: [["Ana found a lost puppy. The owner called that evening. She put up posters around town. The puppy went home happily.", "w4-sequence"]] },
    { prompt: "Build a sentence that shows (not tells) that Ben was happy.", answer: "Ben | grinned and | jumped up and down.", spares: ["was happy."], wrong: [["Ben was happy.", "w4-traits"]] },
  ],
  c5: [
    { s: "I opened the box, and she found a puppy inside.", bad: "she", mistake: "w4-pov", prompt: "The point of view changes. Tap the word that breaks it." },
    { s: "The thunder smelled loud as it rumbled over the hills.", bad: "smelled", mistake: "w4-senses", prompt: "One word uses the wrong sense. Tap it." },
    { s: "At the end of the story, Leo wakes up and gets ready for school.", bad: "end", mistake: "w4-story", prompt: "Waking up and getting ready is how this story starts. Tap the wrong word." },
  ],
  p1: [
    { line: "Max didn't believe in ghosts... so why did he have a pit in his stomach?", q: "How is Max feeling?", a: "Nervous", w: ["Bored", "Sleepy", "Angry"], m: "w4-traits" },
    { line: "It was the first day of summer vacation, and Maxwell was ready for adventure.", q: "What does this line tell us?", a: "When the story happens (the setting)", w: ["How the story ends", "The story's problem is solved", "Who the narrator's teacher is"], m: "w4-story" },
    { line: "She tiptoed down the stairs. She wondered who was at the door.", q: "What point of view is this?", a: "Third person", w: ["First person", "Second person", "No point of view"], m: "w4-pov" },
    { line: "The waves [[crashed]] against the rocks.", q: "Which sense does the highlighted word appeal to?", a: "Hearing", w: ["Taste", "Smell", "Touch"], m: "w4-senses" },
  ],
  p2: [
    { line: "The kitchen smelled of fresh bread and cinnamon.", q: "Which sense does this detail appeal to?", a: "Smell", w: ["Hearing", "Taste", "Sight"], m: "w4-senses" },
    { line: "Riya shared her lunch with the new girl and showed her around the school.", q: "What does this show about Riya?", a: "She is kind", w: ["She is shy", "She is lazy", "She is rude"], m: "w4-traits" },
    { line: "The stars were like diamonds scattered across the sky.", q: "What kind of imagery is this?", a: "A simile", w: ["A fact", "A time-order word", "Dialogue"], m: "w4-word-choice" },
  ],
  p5: [
    { q: "\"A personal narrative is usually told in the first person.\"", a: "Yes: it tells the writer's own story, using I", w: ["No: always in the third person", "No: it has no narrator", "Yes, but only in poems"], m: "w4-pov" },
    { q: "\"The setting is who the story is about.\"", a: "No: the setting is where and when the story happens", w: ["Yes: the setting is the main character", "Yes: the setting is the ending", "No: the setting is the problem"], m: "w4-story" },
    { q: "\"A summary should include every small detail of the story.\"", a: "No: a summary tells only the most important events", w: ["Yes: the more detail the better", "Yes: it copies the story word for word", "No: it should only tell the ending"], m: "w4-story" },
  ],
  a1: [
    { q: "Every story has ___", a: "characters, a setting and a plot", w: ["a list of facts", "a heading and a map", "a greeting and a closing"], m: "w4-story" },
    { q: "Sensory words appeal to ___", a: "sight, hearing, smell, taste and touch", w: ["only sight", "the order of events", "the reader's opinion"], m: "w4-senses" },
    { q: "Which pronoun shows first-person point of view?", a: "we", w: ["she", "they", "he"], m: "w4-pov" },
  ],
  a2: [
    { q: "A plot has ___", a: "a beginning, a middle and an end", w: ["only a beginning", "a greeting and a signature", "a fact and an opinion"], m: "w4-story" },
    { q: "Which is the best opening line for a story?", a: "The ground began to shake just as I bit into my sandwich.", w: ["This story is about an earthquake.", "I am going to tell you a story.", "Once there was a thing."], m: "w4-story" },
  ],
  a4: [
    { q: "Which sentence shows, rather than tells, that Arjun was scared?", a: "Arjun's knees trembled and his voice cracked.", w: ["Arjun was scared.", "Arjun felt very scared.", "Arjun was a scared boy."], m: "w4-traits" },
    { q: "In which step of the writing process do you first write your story out?", a: "Drafting", w: ["Prewriting", "Editing", "Publishing"], m: "w4-sequence" },
    { q: "The five steps of the writing process, in order, are ___", a: "prewrite, draft, revise, proofread, publish", w: ["draft, publish, prewrite, revise, proofread", "publish, revise, draft, proofread, prewrite", "proofread, draft, prewrite, publish, revise"], m: "w4-sequence" },
  ],
};

// ---------------- Chapter 3: Writing to Inform ----------------
export const INFORM: SkillTopic = {
  topic: "w4-inform",
  prefix: "wif4",
  c1: [
    { s: "Bees are important insects. They help plants grow. They make honey. My cousin likes football.", prompt: "One sentence doesn't belong. Tap every word of it.", target: "My cousin likes football.", wrong: [{ phrase: "Bees are important insects.", mistake: "w4-main-idea" }] },
    { s: "Recycling helps the Earth. It saves energy. It cuts down on rubbish.", prompt: "Tap every word of the topic sentence.", target: "Recycling helps the Earth.", wrong: [{ phrase: "It saves energy.", mistake: "w4-main-idea" }] },
    { s: "Because it rained all night, the river flooded.", prompt: "Tap every word of the cause.", target: "Because it rained all night,", wrong: [{ phrase: "the river flooded.", mistake: "w4-structure" }] },
    { s: "Both cats and tigers have whiskers, but only tigers have stripes.", prompt: "Tap the two words that show comparing and contrasting.", target: ["Both", "but"] },
  ],
  c2: [
    { s: "Walk two blocks, then turn left at the bakery.", prompt: "Tap the word that tells which way to turn.", target: "left", wrong: [{ phrase: "two", mistake: "w4-sequence" }] },
    { s: "The elephant is bigger than the horse.", prompt: "Tap the comparative adjective.", target: "bigger", wrong: [{ phrase: "elephant", mistake: "w4-part-of-speech" }] },
    { s: "On the left of the room is a bed, and beside it is a desk.", prompt: "Tap the words that show where things are.", target: ["On the left", "beside"], wrong: [{ phrase: "bed,", mistake: "w4-structure" }] },
  ],
  c3: [
    { prompt: "Put the instructions in order.", answer: "First, put two slices of bread on a plate. | Next, spread peanut butter on one slice. | Then, spread jelly on the other. | Finally, press the slices together.", spares: [], wrong: [["First, put two slices of bread on a plate. Finally, press the slices together. Next, spread peanut butter on one slice. Then, spread jelly on the other.", "w4-sequence"]] },
    { prompt: "Build a cause-and-effect sentence.", answer: "The road was icy, | so | the bus was late.", spares: ["but"], wrong: [["The road was icy, but the bus was late.", "w4-structure"]] },
    { prompt: "Build the sentence comparing three things.", answer: "The cheetah is | the fastest | land animal.", spares: ["the faster"], wrong: [["The cheetah is the faster land animal.", "w4-structure"]] },
  ],
  c4: [
    { prompt: "Put a friendly letter's parts in order, top to bottom.", answer: "date | greeting | body | closing | signature", spares: [], wrong: [["greeting date body closing signature", "w4-letter"]] },
    { prompt: "Put the events of the timeline in order.", answer: "was born in 1920 | started school in 1926 | became a doctor in 1945 | won an award in 1960", spares: [], wrong: [["was born in 1920 became a doctor in 1945 started school in 1926 won an award in 1960", "w4-sequence"]] },
  ],
  c5: [
    { s: "Dear Jesse, Hello from Sioux Falls! Love, Grandma and Grandpa Sincerely,", bad: "Sincerely,", mistake: "w4-letter", prompt: "This friendly letter already has a closing. Tap the extra one." },
    { s: "A dog is more big than a cat.", bad: "more", mistake: "w4-structure", prompt: "One word makes the comparison wrong. Tap it." },
    { s: "Finally, turn left at the park. First, walk past the school.", bad: "Finally,", mistake: "w4-sequence", prompt: "The directions are out of order. Tap the word that should come last." },
  ],
  p1: [
    { line: "Penguins are birds that cannot fly. They swim fast. They live in cold places. They eat fish.", q: "What is the main idea?", a: "Penguins are birds that cannot fly", w: ["They eat fish", "They swim fast", "They live in cold places"], m: "w4-main-idea" },
    { line: "[[Love,]]", q: "Which part of a friendly letter is this?", a: "The closing", w: ["The greeting", "The body", "The date"], m: "w4-letter" },
    { line: "Fruits: apple, mango. Vegetables: carrot, pea.", q: "How is this information organised?", a: "Into categories", w: ["By cause and effect", "In time order", "As a story"], m: "w4-structure" },
    { line: "The river flooded, so the farmers lost their crops.", q: "What is the effect?", a: "The farmers lost their crops", w: ["The river flooded", "It rained", "The farmers planted seeds"], m: "w4-structure" },
  ],
  p2: [
    { line: "[[Dear Jesse,]]", q: "Which part of a friendly letter is this?", a: "The greeting", w: ["The closing", "The signature", "The body"], m: "w4-letter" },
    { line: "Science Fair! Friday, 3 p.m., in the school hall. Bring your projects!", q: "What kind of writing is this?", a: "An announcement", w: ["A story", "A friendly letter", "A poem"], m: "w4-structure" },
    { line: "Mount Everest is taller than K2. K2 is taller than Kangchenjunga.", q: "Which is the tallest?", a: "Mount Everest", w: ["K2", "Kangchenjunga", "They are all the same"], m: "w4-structure" },
  ],
  p5: [
    { q: "\"Every sentence in a paragraph should support the topic sentence.\"", a: "Yes: that keeps the paragraph on topic", w: ["No: paragraphs can talk about anything", "No: only the last sentence matters", "Yes, but only in stories"], m: "w4-main-idea" },
    { q: "\"A biography is a story someone writes about their own life.\"", a: "No: a biography is about another person's life", w: ["Yes: it is always about the writer", "Yes: it is a made-up story", "No: it is a set of instructions"], m: "w4-structure" },
    { q: "\"Instructions don't need time-order words.\"", a: "No: time-order words help readers follow the steps", w: ["Yes: steps can go in any order", "Yes: readers can guess the order", "No: they need sensory words instead"], m: "w4-sequence" },
  ],
  a1: [
    { q: "The purpose of informational writing is to ___", a: "inform or explain", w: ["tell a made-up story", "share a feeling in verse", "make the reader laugh"], m: "w4-structure" },
    { q: "A topic sentence ___", a: "tells what the whole paragraph is about", w: ["gives one small detail", "always asks a question", "ends with 'The End'"], m: "w4-main-idea" },
    { q: "Which words signal cause and effect?", a: "because, so, as a result", w: ["first, next, finally", "both, alike, different", "Dear, Love, Sincerely"], m: "w4-structure" },
  ],
  a2: [
    { q: "Fill the gap: A whale is ___ than a dolphin.", a: "bigger", w: ["biggest", "more big", "big"], m: "w4-structure" },
    { q: "Fill the gap: That was the ___ day of the year.", a: "hottest", w: ["hotter", "most hot", "hot"], m: "w4-structure" },
    { q: "A friendly letter's greeting looks like ___", a: "Dear Sam,", w: ["Love, Sam", "June 3, 2024", "Your friend,"], m: "w4-letter" },
  ],
  a4: [
    { q: "Which is the best topic sentence for a paragraph about saving water?", a: "There are many easy ways to save water at home.", w: ["Turn off the tap while brushing.", "My bathroom is blue.", "Water is wet."], m: "w4-main-idea" },
    { q: "Which detail does NOT belong in a report about the Moon?", a: "My favourite food is pizza.", w: ["The Moon travels around the Earth.", "The Moon has craters.", "People walked on the Moon in 1969."], m: "w4-main-idea" },
    { q: "Describing a room from left to right is organising by ___", a: "space", w: ["time", "cause and effect", "opinion"], m: "w4-structure" },
  ],
};

// ---------------- Chapter 4: Writing an Opinion ----------------
export const OPINION: SkillTopic = {
  topic: "w4-opinion",
  prefix: "wop4",
  c1: [
    { s: "Hockey is the best sport to play.", prompt: "Tap the word that shows this is an opinion.", target: "best", wrong: [{ phrase: "sport", mistake: "w4-fact-opinion" }] },
    { s: "Our school should have a garden because it would teach us about plants.", prompt: "Tap every word of the reason.", target: "because it would teach us about plants.", wrong: [{ phrase: "Our school should have a garden", mistake: "w4-persuade" }] },
    { s: "Please adopt a lonely puppy who is waiting for a loving home.", prompt: "Tap the two words that appeal to feelings.", target: ["lonely", "loving"], wrong: [{ phrase: "adopt", mistake: "w4-persuade" }] },
    { s: "Recess is fun, and it lasts twenty minutes.", prompt: "Tap the word that gives an opinion.", target: "fun,", wrong: [{ phrase: "twenty", mistake: "w4-fact-opinion" }] },
  ],
  c2: [
    { s: "Dear Mr. Shah, I am writing to ask for a new bench in the park. Sincerely, Anya", prompt: "Tap the words that tell why this business letter was written.", target: "to ask for a new bench in the park.", wrong: [{ phrase: "Dear Mr. Shah,", mistake: "w4-letter" }] },
    { s: "Only a silly person would ever eat broccoli.", prompt: "Tap the word that shows bias.", target: "silly", wrong: [{ phrase: "broccoli.", mistake: "w4-persuade" }] },
    { s: "Squirrels bury nuts and seeds in the grass.", prompt: "This is a fact. Tap the action you could check.", target: "bury", wrong: [{ phrase: "grass.", mistake: "w4-fact-opinion" }] },
  ],
  c3: [
    { prompt: "Build an opinion with a reason.", answer: "Dogs are the best pets | because | they are loyal.", spares: ["but"], wrong: [["Dogs are the best pets but they are loyal.", "w4-persuade"]] },
    { prompt: "Build a slogan for a fruit stall.", answer: "Fresh, | juicy, | and sweet!", spares: ["old"], wrong: [["Fresh, old, and sweet!", "w4-persuade"]] },
    { prompt: "Put the reasons in order of importance, most important last.", answer: "Bikes are fun. | Bikes save money. | Bikes keep the air clean.", spares: [], wrong: [["Bikes keep the air clean. Bikes save money. Bikes are fun.", "w4-sequence"]] },
  ],
  c4: [
    { prompt: "Put the parts of a business letter in order.", answer: "heading | inside address | greeting | body | closing | signature", spares: [], wrong: [["greeting heading inside address body closing signature", "w4-letter"]] },
    { prompt: "Build a closing for a business letter.", answer: "Sincerely, | Anya Rao", spares: ["Love,"], wrong: [["Love, Anya Rao", "w4-letter"]] },
  ],
  c5: [
    { s: "Iowa grows more corn than any other state, which is an opinion.", bad: "opinion.", mistake: "w4-fact-opinion", prompt: "One word in this judgement is wrong. Tap it." },
    { s: "Dear Sir, Hey buddy, our park needs more bins. Sincerely, Leo", bad: "buddy,", mistake: "w4-letter", prompt: "One word is too casual for a business letter. Tap it." },
    { s: "My aunt works for the government, and that is just her opinion.", bad: "opinion.", mistake: "w4-fact-opinion", prompt: "One word in this judgement is wrong. Tap it." },
  ],
  p1: [
    { line: "Iowa grows more corn than any other state.", q: "Is this a fact or an opinion?", a: "Fact", w: ["Opinion", "Neither", "Both"], m: "w4-fact-opinion" },
    { line: "Summer is the most wonderful season.", q: "Is this a fact or an opinion?", a: "Opinion", w: ["Fact", "Neither", "Both"], m: "w4-fact-opinion" },
    { line: "Without your help, these hungry kittens will have nowhere to go tonight.", q: "What is the writer using?", a: "An emotional appeal", w: ["A fact only", "Time-order words", "A greeting"], m: "w4-persuade" },
    { line: "My aunt works for the government.", q: "Is this a fact or an opinion?", a: "Fact", w: ["Opinion", "Neither", "Both"], m: "w4-fact-opinion" },
  ],
  p2: [
    { line: "Snacks from Crunchy Co. are tasty, but other brands are disgusting and nobody likes them.", q: "What does this writing show?", a: "Bias: only one side is shown", w: ["Facts only", "A fair comparison", "A friendly letter"], m: "w4-persuade" },
    { line: "Just do it with Zoom Shoes!", q: "What is this?", a: "A slogan", w: ["A fact", "A biography", "A greeting"], m: "w4-persuade" },
    { line: "Dear Editor, our town should build a library because children need a quiet place to read.", q: "What is the writer's opinion?", a: "The town should build a library", w: ["Children need a quiet place", "The editor is kind", "Libraries are noisy"], m: "w4-persuade" },
  ],
  p5: [
    { q: "\"An opinion is stronger when it gives reasons and examples.\"", a: "Yes: reasons help persuade the reader", w: ["No: just saying how you feel is enough", "No: opinions never need reasons", "Yes, but only in stories"], m: "w4-persuade" },
    { q: "\"'Squirrels bury nuts' is an opinion.\"", a: "No: it can be checked, so it is a fact", w: ["Yes: it is what someone thinks", "Yes: all animal sentences are opinions", "No: it is a slogan"], m: "w4-fact-opinion" },
    { q: "\"A business letter should end with 'Love,'.\"", a: "No: it ends with a formal closing such as 'Sincerely,'", w: ["Yes: all letters end with 'Love,'", "Yes: business letters are casual", "No: business letters have no closing"], m: "w4-letter" },
  ],
  a1: [
    { q: "An opinion is ___", a: "what someone thinks or feels", w: ["something that can be proved", "a list of steps", "the setting of a story"], m: "w4-fact-opinion" },
    { q: "A fact is ___", a: "something that can be checked or proved", w: ["what someone believes", "always about feelings", "a kind of slogan"], m: "w4-fact-opinion" },
    { q: "Bias in writing means ___", a: "showing only one side", w: ["using time-order words", "giving many facts fairly", "writing a greeting"], m: "w4-persuade" },
  ],
  a2: [
    { q: "Which word often signals an opinion?", a: "best", w: ["is", "has", "seven"], m: "w4-fact-opinion" },
    { q: "Which is a good reason for 'We should plant more trees'?", a: "Trees give us shade and clean air.", w: ["I like the colour green.", "Trees are trees.", "My neighbour has a dog."], m: "w4-persuade" },
    { q: "A letter to the editor is written to ___", a: "share an opinion with readers of a newspaper", w: ["tell a friend about your holiday", "give directions to your house", "describe a character"], m: "w4-letter" },
  ],
  a4: [
    { q: "Which sentence is an emotional appeal?", a: "Imagine how sad the puppies feel, alone in the cold.", w: ["The shelter has 20 puppies.", "The shelter opens at 9 a.m.", "Puppies need food and water."], m: "w4-persuade" },
    { q: "Organising by order of importance means ___", a: "putting reasons from least to most important (or the other way)", w: ["putting events in time order", "describing from left to right", "listing things alphabetically"], m: "w4-sequence" },
    { q: "Which is a fact?", a: "There are seven days in a week.", w: ["Sunday is the best day.", "Mondays are boring.", "Weekends should be longer."], m: "w4-fact-opinion" },
  ],
};
