import { Misconceptions, SkillTopic } from "../skillTopic.js";

/** Spectrum Language Arts Grade 7, Chapters 4–6: punctuation; usage; word study. */
export const MISCONCEPTIONS: Misconceptions = {
  "la-comma": { label: "Misplaces commas", detail: "Leaves out commas in a series, between adjectives, in direct address or before the conjunction in a compound sentence.", childTip: "Commas go between items in a series, between equal adjectives (a long, dull film), after the name of the person spoken to, and before and/but/so joining two sentences." },
  "la-semicolon-colon": { label: "Mixes up semicolons and colons", detail: "Uses a colon to join two sentences or a semicolon before a list.", childTip: "Semicolon (;) joins two related sentences. Colon (:) introduces a list or explanation, and is used in times (7:30)." },
  "la-quote-mark": { label: "Puts quotation marks or their punctuation in the wrong place", detail: "Leaves the comma or question mark outside the quotation marks, or quotes reported speech.", childTip: "\"Where are you going?\" asked Mom. The comma or question mark goes inside the closing quotation marks." },
  "la-apostrophe": { label: "Misuses apostrophes", detail: "Writes it's for its, or an apostrophe in a plain plural.", childTip: "Apostrophes show possession (Tom's) or missing letters (can't). No apostrophe in plurals or in its (belonging to it)." },
  "la-dash-paren": { label: "Mixes up hyphens, dashes, parentheses and italics", detail: "Uses a hyphen where a dash belongs, or doesn't italicise titles of books and films.", childTip: "Hyphen joins words (well-known). Dash marks a sudden break — like this. Parentheses add extra information (quietly). Book and film titles are in italics or underlined." },
  "la-modifier": { label: "Leaves a modifier dangling or misplaced", detail: "Writes Walking home, the rain started (the rain wasn't walking).", childTip: "Put the describing words right next to what they describe: Walking home, I got caught in the rain." },
  "la-double-negative": { label: "Uses a double negative", detail: "Writes I don't have no money.", childTip: "One negative is enough: I don't have any money / I have no money." },
  "la-wordy": { label: "Writes wordy or repetitive sentences", detail: "Uses extra words or says the same thing twice (free gift, at this point in time).", childTip: "Cut words that add nothing: 'at this point in time' → now; 'free gift' → gift." },
  "la-word-part": { label: "Misreads roots, prefixes or suffixes", detail: "Doesn't know what a root or affix adds to a word.", childTip: "Roots carry the meaning (port = carry), prefixes change it (re- = again), suffixes change the job (-less = without)." },
  "la-word-meaning": { label: "Picks the wrong meaning or relationship", detail: "Mixes up synonyms, antonyms, homophones, multiple meanings or connotations.", childTip: "Read the words around it. Connotation is the feeling a word carries: 'thrifty' is positive, 'stingy' negative." },
  "la-figurative": { label: "Mixes up figures of speech", detail: "Confuses similes, metaphors, personification, allusions and analogies.", childTip: "Simile: like/as. Metaphor: says one thing is another. Personification: human actions for things. Allusion: a reference to a known story or person. Analogy: A is to B as C is to D." },
};

export const PUNCTUATION: SkillTopic = {
  topic: "l7-punctuation",
  prefix: "lpn7",
  c1: [
    { s: "We packed sandwiches apples crackers and juice.", prompt: "Commas are missing. Tap each word that should have a comma after it.", target: ["sandwiches", "apples"], also: [["sandwiches", "apples", "crackers"]] },
    { s: "Anil please pass the salt.", prompt: "A comma is missing. Tap the word it should come after.", target: "Anil" },
    { s: "It was a long tiring journey.", prompt: "A comma is missing between two adjectives. Tap the word it should come after.", target: "long" },
    { s: "I wanted to go but I had homework.", prompt: "A comma is missing before the conjunction. Tap the word it should come after.", target: "go" },
  ],
  c3: [
    { prompt: "Build the sentence with the right punctuation.", answer: "We need three things | : | flour, sugar and eggs | .", spares: [";"], wrong: [["We need three things; flour, sugar and eggs.", "la-semicolon-colon"]] },
    { prompt: "Build the sentence with the right punctuation.", answer: "The sun was hot | ; | we sat in the shade | .", spares: [":"], wrong: [["The sun was hot: we sat in the shade.", "la-semicolon-colon"]] },
    { prompt: "Build the line of dialogue correctly.", answer: "\"Are you coming?\" | asked Mom | .", spares: ["\"Are you coming\"?"], wrong: [["\"Are you coming\"? asked Mom.", "la-quote-mark"]] },
    { prompt: "Build the sentence with the right punctuation.", answer: "The dog wagged | its | tail | .", spares: ["it's"], wrong: [["The dog wagged it's tail.", "la-apostrophe"]] },
  ],
  c5: [
    { s: "The cat licked it's paws.", bad: "it's", mistake: "la-apostrophe" },
    { s: "Fresh tomato's are on sale today.", bad: "tomato's", mistake: "la-apostrophe" },
    { s: "\"I'm hungry\", said Leela.", bad: "hungry\",", mistake: "la-quote-mark" },
    { s: "My sister in law is visiting.", bad: "sister", mistake: "la-dash-paren", prompt: "Hyphens are missing in one word group. Tap its first word." },
  ],
  p1: [
    { line: "The meeting starts at 4[[:]]30.", q: "Why is the highlighted mark used?", a: "A colon separates hours and minutes", w: ["A semicolon joins two sentences", "It shows possession", "It introduces a quotation"], m: "la-semicolon-colon" },
    { line: "My grandfather[[—]]the bravest man I know[[—]]fought in the war.", q: "What are the highlighted marks?", a: "Dashes setting off extra information with emphasis", w: ["Hyphens joining words", "Colons introducing a list", "Apostrophes"], m: "la-dash-paren" },
    { line: "We read [[Treasure Island]] in class.", q: "How should the highlighted book title be written?", a: "In italics (or underlined)", w: ["In quotation marks", "In capital letters only", "With a hyphen"], m: "la-dash-paren" },
    { line: "The well[[-]]known singer waved.", q: "What is the highlighted mark?", a: "A hyphen joining a compound adjective", w: ["A dash showing a break", "A minus sign", "A colon"], m: "la-dash-paren" },
  ],
  p5: [
    { q: "\"A semicolon can join two complete sentences that are closely related.\"", a: "Yes: I was late; the bus had broken down.", w: ["No: only a comma can", "No: semicolons introduce lists", "No: semicolons end questions"], m: "la-semicolon-colon" },
    { q: "\"'It's' means 'belonging to it'.\"", a: "No: it's means 'it is'; its means 'belonging to it'", w: ["Yes: like 'Tom's'", "Yes: they mean the same", "No: it's means 'it was'"], m: "la-apostrophe" },
  ],
  a1: [
    { q: "A colon is used ___", a: "before a list or an explanation, and in times", w: ["to join two sentences that are equal", "to show possession", "to end a question"], m: "la-semicolon-colon" },
    { q: "Parentheses are used to ___", a: "add extra information that isn't essential", w: ["show a quotation", "join two words", "end a sentence"], m: "la-dash-paren" },
    { q: "In a letter, a comma follows ___", a: "the greeting and the closing (Dear Ravi, … Yours truly,)", w: ["every line", "the date only", "the signature"], m: "la-comma" },
  ],
  a2: [
    { q: "Which is correct?", a: "\"Let's go,\" said Maya.", w: ["\"Let's go\", said Maya.", "\"Let's go.\" said Maya.", "Let's go, \"said Maya.\""], m: "la-quote-mark" },
    { q: "Which is correct?", a: "Yes, I will help you, Rohan.", w: ["Yes I will help you Rohan.", "Yes, I will help you Rohan.", "Yes I, will help you, Rohan."], m: "la-comma" },
    { q: "Which is correct?", a: "The players' shoes were muddy.", w: ["The player's' shoes were muddy.", "The players shoe's were muddy.", "The players's shoes were muddy."], m: "la-apostrophe" },
  ],
  a4: [
    { q: "Which sentence is punctuated correctly?", a: "Bring these items: a torch, a map and a whistle.", w: ["Bring these items; a torch, a map and a whistle.", "Bring these: items a torch, a map and a whistle.", "Bring these items, a torch: a map and a whistle."], m: "la-semicolon-colon" },
    { q: "Which sentence is punctuated correctly?", a: "The film was long, but we enjoyed it.", w: ["The film was long but, we enjoyed it.", "The film was long, but, we enjoyed it.", "The film, was long but we enjoyed it."], m: "la-comma" },
  ],
};

export const USAGE: SkillTopic = {
  topic: "l7-usage",
  prefix: "lus7",
  c1: [
    { s: "We don't need no help with the project.", prompt: "This has a double negative. Tap the word to take out (or change).", target: "no", also: ["don't"] },
    { s: "At this point in time, we are ready to begin.", prompt: "Tap the wordy phrase that could just be 'now'.", target: "At this point in time," },
    { s: "She gave each guest a free gift.", prompt: "Tap the word that repeats the meaning of another (a redundancy).", target: "free" },
    { s: "Please repeat that again for the class.", prompt: "Tap the word that is redundant.", target: "again" },
  ],
  c3: [
    { prompt: "Fix the dangling modifier: build the sentence.", answer: "Walking to school, | I | saw | a rainbow | .", spares: ["a rainbow appeared"], wrong: [["Walking to school, a rainbow appeared.", "la-modifier"]] },
    { prompt: "Build the sentence without a double negative.", answer: "I | don't have | any | homework | .", spares: ["no"], wrong: [["I don't have no homework.", "la-double-negative"]] },
    { prompt: "Fix the misplaced modifier: build the sentence.", answer: "I | almost | finished | the whole pizza | .", spares: [], wrong: [] },
  ],
  c5: [
    { s: "She hardly never watches television.", bad: "never", mistake: "la-double-negative" },
    { s: "The reason is because I was sick.", bad: "because", mistake: "la-wordy" },
    { s: "They returned back home after dark.", bad: "back", mistake: "la-wordy" },
    { s: "Nobody didn't see the thief.", bad: "didn't", mistake: "la-double-negative" },
  ],
  p1: [
    { line: "Covered in mud, Mom washed the dog.", q: "What is wrong with this sentence?", a: "The modifier dangles: it sounds as if Mom was covered in mud", w: ["Nothing: it is correct", "It has a double negative", "It is a fragment"], m: "la-modifier" },
    { line: "I saw a deer driving down the highway.", q: "What is wrong with this sentence?", a: "The modifier is misplaced: the deer seems to be driving", w: ["Nothing: it is correct", "It has a double negative", "It has the wrong tense"], m: "la-modifier" },
    { line: "He can't hardly wait for the holidays.", q: "What is wrong with this sentence?", a: "It has a double negative: can't + hardly", w: ["Nothing: it is correct", "It is wordy", "It has a dangling modifier"], m: "la-double-negative" },
    { line: "The end result was a total success.", q: "What is wrong with this sentence?", a: "'End result' is redundant: a result is the end", w: ["Nothing: it is correct", "It has a double negative", "It has a dangling modifier"], m: "la-wordy" },
  ],
  p5: [
    { q: "\"'I ain't got nothing' is correct standard English.\"", a: "No: it has a double negative; say 'I have nothing'", w: ["Yes: it is fine in writing", "Yes: two negatives make it stronger", "No: it should be 'I ain't got anything'"], m: "la-double-negative" },
    { q: "\"'Due to the fact that' can usually be replaced by 'because'.\"", a: "Yes: it is a wordy phrase", w: ["No: it means something else", "No: 'because' is informal", "No: it should be 'due to'"], m: "la-wordy" },
  ],
  a1: [
    { q: "A dangling modifier ___", a: "describes something that isn't named in the sentence", w: ["has two negatives", "is a word repeated twice", "is a complete sentence"], m: "la-modifier" },
    { q: "A redundancy is ___", a: "words that repeat the same meaning (free gift)", w: ["a missing verb", "a double negative", "a run-on sentence"], m: "la-wordy" },
  ],
  a2: [
    { q: "Which is correct?", a: "I don't know anything about it.", w: ["I don't know nothing about it.", "I don't know nothing about nothing.", "I not know nothing about it."], m: "la-double-negative" },
    { q: "Which is the least wordy?", a: "We will meet tomorrow.", w: ["We will meet together tomorrow in the future.", "We will meet up together on the day of tomorrow.", "At this point in time we will meet tomorrow."], m: "la-wordy" },
  ],
  a4: [
    { q: "Which sentence has no dangling modifier?", a: "After eating lunch, we cleaned the table.", w: ["After eating lunch, the table was cleaned.", "After eating lunch, the dishes piled up.", "After eating lunch, the bell rang."], m: "la-modifier" },
    { q: "Which sentence places 'only' correctly to mean just one apple was eaten?", a: "She ate only one apple.", w: ["Only she ate one apple.", "She only ate one apple, only.", "She ate one only apple."], m: "la-modifier" },
  ],
};

export const WORD_STUDY: SkillTopic = {
  topic: "l7-words",
  prefix: "lwd7",
  c1: [
    { s: "The tired runner was speechless after the race.", prompt: "Tap the word with a suffix meaning 'without'.", target: "speechless" },
    { s: "We had to rewrite the whole essay.", prompt: "Tap the word with a prefix meaning 'again'.", target: "rewrite" },
    { s: "The portable radio was easy to carry.", prompt: "Tap the word with the root 'port' (to carry).", target: "portable" },
    { s: "The telescope helped us see distant stars.", prompt: "Tap the word with the root 'tele' (far).", target: "telescope" },
  ],
  c2: [
    { s: "The classroom was a zoo after the bell.", prompt: "Tap the words that make a metaphor.", target: "was a zoo", wrong: [{ phrase: "after the bell.", mistake: "la-figurative" }] },
    { s: "The wind howled through the empty streets.", prompt: "Tap the word that personifies the wind.", target: "howled" },
    { s: "Her smile was as bright as the sun.", prompt: "Tap the words that make the simile.", target: "as bright as the sun." },
  ],
  c3: [
    { prompt: "Build a word meaning 'not able to be seen'.", answer: "in | vis | ible", spares: ["un", "able"], wrong: [["un vis ible", "la-word-part"]], glue: true },
    { prompt: "Build a word meaning 'full of hope'.", answer: "hope | ful", spares: ["less"], wrong: [["hope less", "la-word-part"]], glue: true },
    { prompt: "Build a word meaning 'to read wrongly'.", answer: "mis | read", spares: ["re", "un"], wrong: [["re read", "la-word-part"]], glue: true },
  ],
  c5: [
    { s: "The knight road his horse into battle.", bad: "road", mistake: "la-word-meaning", prompt: "One word is the wrong homophone. Tap it." },
    { s: "Their going to the fair tomorrow.", bad: "Their", mistake: "la-word-meaning", prompt: "One word is the wrong homophone. Tap it." },
    { s: "The whether was perfect for a picnic.", bad: "whether", mistake: "la-word-meaning", prompt: "One word is the wrong homophone. Tap it." },
  ],
  p1: [
    { line: "Please [[bat]] the ball gently.", q: "Which meaning of 'bat' is used here?", a: "To hit", w: ["A flying animal", "A wooden stick", "To blink"], m: "la-word-meaning" },
    { line: "My grandfather is [[thrifty]] with money.", q: "What connotation does 'thrifty' have?", a: "Positive: careful and sensible", w: ["Negative: mean and stingy", "Neutral: no feeling at all", "Negative: careless"], m: "la-word-meaning" },
    { line: "He is a real [[Romeo]].", q: "What is this an example of?", a: "An allusion to Shakespeare's Romeo and Juliet", w: ["A simile", "Personification", "A homophone"], m: "la-figurative" },
    { line: "Bird is to nest as bee is to [[___]].", q: "Which word completes the analogy?", a: "hive", w: ["honey", "flower", "sting"], m: "la-figurative" },
  ],
  p5: [
    { q: "\"'Brave' and 'cowardly' are synonyms.\"", a: "No: they are antonyms", w: ["Yes: both describe people", "Yes: they mean the same", "No: they are homophones"], m: "la-word-meaning" },
    { q: "\"'The stars danced in the sky' uses personification.\"", a: "Yes: stars are given a human action", w: ["No: it is a simile", "No: it is an analogy", "No: it is literal"], m: "la-figurative" },
  ],
  a1: [
    { q: "Denotation is ___", a: "a word's dictionary meaning", w: ["the feeling a word carries", "a word that sounds like another", "a word part at the end"], m: "la-word-meaning" },
    { q: "An allusion is ___", a: "a reference to a well-known person, place, story or event", w: ["a comparison using like or as", "a word with two meanings", "an exaggeration"], m: "la-figurative" },
    { q: "The root 'graph' means ___", a: "write", w: ["far", "carry", "light"], m: "la-word-part" },
  ],
  a2: [
    { q: "Fill the gap: Hot is to cold as up is to ___", a: "down", w: ["high", "warm", "over"], m: "la-figurative" },
    { q: "Which word has a negative connotation?", a: "nosy", w: ["curious", "interested", "inquisitive"], m: "la-word-meaning" },
    { q: "A synonym for 'enormous' is ___", a: "huge", w: ["tiny", "narrow", "quiet"], m: "la-word-meaning" },
  ],
  a4: [
    { q: "Which sentence uses a simile?", a: "He ran like the wind.", w: ["He was a cheetah on the track.", "The wind whispered secrets.", "He ran all the way home."], m: "la-figurative" },
    { q: "Which sentence uses the homophones correctly?", a: "They're bringing their bags over there.", w: ["Their bringing they're bags over their.", "There bringing their bags over they're.", "They're bringing there bags over their."], m: "la-word-meaning" },
  ],
};
