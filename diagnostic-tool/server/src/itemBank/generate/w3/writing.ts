import { Misconceptions, SkillTopic } from "../skillTopic.js";

/**
 * Grade 3 Writing (Spectrum Writing Grade 3). Chapter 1 is split in two:
 * reading and organising (1.1–1.6) and complete sentences and
 * proofreading (1.7–1.12). Reuses the Grade 4 Writing mistake names
 * (w4-…) where the skill is the same, plus two of its own.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "w3-purpose": { label: "Mixes up the author's purpose", detail: "Confuses writing to inform, to persuade and to entertain.", childTip: "Inform: tells facts. Persuade: tries to make you agree or do something. Entertain: tells a story or makes you laugh." },
  "w3-fragment": { label: "Misses fragments and run-ons", detail: "Thinks words with no subject or verb make a sentence, or runs two sentences together.", childTip: "A sentence has a subject and a verb and is a complete thought. Two sentences need a full stop between them." },
  "w3-audience": { label: "Doesn't match writing to its reader", detail: "Uses hard words for a young reader, or baby words for an expert.", childTip: "Ask who will read it: a young child needs simple words; an expert already knows the basics." },
};

// ---------------- Chapter 1 (1.1–1.6): main idea, purpose, structure, organising ----------------
export const FOUNDATIONS: SkillTopic = {
  topic: "w3-foundations",
  prefix: "wfd3",
  c1: [
    { s: "Cats make good pets. They are clean. They are quiet. My shoes are red.", prompt: "One sentence doesn't belong. Tap every word of it.", target: "My shoes are red.", wrong: [{ phrase: "Cats make good pets.", mistake: "w4-main-idea" }] },
    { s: "Bees help us in many ways. They make honey. They help flowers grow.", prompt: "Tap every word of the main idea.", target: "Bees help us in many ways.", wrong: [{ phrase: "They make honey.", mistake: "w4-main-idea" }] },
    { s: "First, I woke up. Next, I ate breakfast. Last, I walked to school.", prompt: "Tap the three time-order words.", target: ["First,", "Next,", "Last,"] },
    { s: "It rained all day, so the game was cancelled.", prompt: "Tap the word that shows cause and effect.", target: "so", wrong: [{ phrase: "rained", mistake: "w4-structure" }] },
  ],
  c3: [
    { prompt: "Put the steps in time order.", answer: "First, get a cup. | Then, pour the milk. | Next, add a straw. | Last, drink it.", spares: [], wrong: [["Then, pour the milk. First, get a cup. Next, add a straw. Last, drink it.", "w4-sequence"]] },
    { prompt: "Put the sentences in order: main idea first, then details.", answer: "Dogs are helpful. | Some dogs guide people. | Some dogs guard homes.", spares: ["My shoes are red."], wrong: [["Some dogs guide people. Dogs are helpful. Some dogs guard homes.", "w4-main-idea"]] },
  ],
  c5: [
    { s: "Last, I opened my eyes. Then I got out of bed.", bad: "Last,", mistake: "w4-sequence", prompt: "One time-order word is in the wrong place. Tap it." },
    { s: "Apples are fruit. Carrots are fruit. Bananas are fruit.", bad: "Carrots", mistake: "w4-main-idea", prompt: "One word doesn't belong in this group. Tap it." },
  ],
  p1: [
    { line: "Jellyfish are not fish. They have no brain, no bones and no heart.", q: "What is this paragraph mostly about?", a: "Jellyfish are unusual animals", w: ["Fish have bones", "Every animal has a heart", "Brains are important"], m: "w4-main-idea" },
    { line: "Tennis and badminton are alike. Both use a net and a racket, but one uses a ball.", q: "What text structure is this?", a: "Compare and contrast", w: ["Cause and effect", "Problem and solution", "Sequence"], m: "w4-structure" },
    { line: "Our playground flooded. So recess will be indoors until it dries.", q: "What text structure is this?", a: "Cause and effect", w: ["Compare and contrast", "Sequence", "A story"], m: "w4-structure" },
    { line: "Buses must take a new road. We will send a new map to answer your questions.", q: "What text structure is this?", a: "Problem and solution", w: ["Compare and contrast", "Sequence", "Cause and effect"], m: "w4-structure" },
  ],
  p2: [
    { line: "Come to the school fair! It will be the best day of the year!", q: "Why did the author write this?", a: "To persuade", w: ["To inform", "To entertain", "To say sorry"], m: "w3-purpose" },
    { line: "The moon goes around the Earth about once a month.", q: "Why did the author write this?", a: "To inform", w: ["To persuade", "To entertain", "To ask a question"], m: "w3-purpose" },
    { line: "Once upon a time, a silly goat tried to wear a hat.", q: "Why did the author write this?", a: "To entertain", w: ["To inform", "To persuade", "To give directions"], m: "w3-purpose" },
  ],
  p5: [
    { q: "\"The main idea is the first small detail in a paragraph.\"", a: "No: the main idea is what the whole paragraph is mostly about", w: ["Yes: it is always the smallest detail", "Yes: it is the last word", "No: it is the title only"], m: "w4-main-idea" },
    { q: "\"A story about a talking dog is written to inform.\"", a: "No: it is written to entertain", w: ["Yes: it gives facts about dogs", "Yes: all writing informs", "No: it is written to persuade"], m: "w3-purpose" },
  ],
  a1: [
    { q: "The main idea is ___", a: "what a text is mostly about", w: ["one small detail", "the author's name", "the last sentence"], m: "w4-main-idea" },
    { q: "To persuade means ___", a: "to try to make the reader agree", w: ["to tell facts only", "to tell a funny story", "to list steps"], m: "w3-purpose" },
    { q: "Time-order words tell ___", a: "when things happen", w: ["where things are", "how things feel", "who is speaking"], m: "w4-transition" },
  ],
  a2: [
    { q: "Fill the gap: ___, mix the flour and water. Then, bake it.", a: "First", w: ["Last", "Finally", "Because"], m: "w4-sequence" },
    { q: "Which detail supports 'Exercise is good for you'?", a: "It makes your heart strong.", w: ["My friend has a bike.", "Some shoes are blue.", "I like pizza."], m: "w4-main-idea" },
  ],
  a4: [
    { q: "Which group is organised by topic?", a: "Animals: lion, tiger, deer", w: ["Animals: lion, table, red", "Fruits: apple, chair, run", "Colours: blue, cat, jump"], m: "w4-structure" },
    { q: "A news report about a flood is written mainly to ___", a: "inform", w: ["entertain", "persuade", "rhyme"], m: "w3-purpose" },
  ],
};

// ---------------- Chapter 1 (1.7–1.12): complete sentences and proofreading ----------------
export const PROOFREADING: SkillTopic = {
  topic: "w3-proofreading",
  prefix: "wpr3",
  c1: [
    { s: "my sister and i live in chennai.", prompt: "Tap the three words that need a capital letter.", target: ["my", "i", "chennai."], wrong: [{ phrase: "sister", mistake: "w4-caps" }] },
    { s: "The cat run up the tree.", prompt: "Tap the verb that doesn't agree with its subject.", target: "run", wrong: [{ phrase: "cat", mistake: "w4-agreement" }] },
    { s: "We went to the park to play. After we returned home.", prompt: "Tap every word of the sentence fragment.", target: "After we returned home.", wrong: [{ phrase: "We went to the park to play.", mistake: "w3-fragment" }] },
    { s: "I have too pencils in my bag.", prompt: "Tap the wrong word.", target: "too", wrong: [{ phrase: "pencils", mistake: "w4-spelling" }] },
  ],
  c2: [
    { s: "Jacob called his mom it was an emergency.", prompt: "This is a run-on. Tap the word where a new sentence should start.", target: "it", wrong: [{ phrase: "mom", mistake: "w3-fragment" }] },
    { s: "Where is my red hat.", prompt: "The end mark is wrong. Tap the last word.", target: "hat.", wrong: [{ phrase: "Where", mistake: "w4-caps" }] },
  ],
  c3: [
    { prompt: "Fix the run-on.", answer: "Jacob called his mom. | It was an emergency.", spares: ["it was an emergency."], wrong: [["Jacob called his mom. it was an emergency.", "w4-caps"]] },
    { prompt: "Build the question with the right end mark.", answer: "Can you | help me?", spares: ["help me."], wrong: [["Can you help me.", "w4-dialogue"]] },
    { prompt: "Build the sentence so the verb agrees.", answer: "The birds | sing | every morning.", spares: ["sings"], wrong: [["The birds sings every morning.", "w4-agreement"]] },
  ],
  c5: [
    { s: "She play with her dog every day.", bad: "play", mistake: "w4-agreement", prompt: "One verb doesn't agree with its subject. Tap it." },
    { s: "Wow, we won the cup.", bad: "cup.", mistake: "w4-dialogue", prompt: "This shows strong feeling. Tap the word whose end mark is wrong." },
    { s: "We bought apples, bananas and, grapes.", bad: "and,", mistake: "w4-comma", prompt: "One comma is in the wrong place. Tap the word it is stuck to." },
  ],
  p1: [
    { line: "Running in the rain.", q: "What is this?", a: "A fragment: it has no subject", w: ["A complete sentence", "A question", "A run-on sentence"], m: "w3-fragment" },
    { line: "The dog barked the cat ran away.", q: "What is this?", a: "A run-on: two sentences joined with no full stop", w: ["A complete sentence", "A fragment", "A question"], m: "w3-fragment" },
    { line: "We visited [[mumbai]] in may.", q: "What is wrong with the highlighted word?", a: "It needs a capital letter", w: ["It is misspelt", "It needs a comma", "Nothing is wrong"], m: "w4-caps" },
  ],
  p5: [
    { q: "\"A complete sentence needs a subject and a verb.\"", a: "Yes: and it must be a complete thought", w: ["No: it only needs a verb", "No: it only needs a capital letter", "Yes, but only in stories"], m: "w3-fragment" },
    { q: "\"'The boys plays football' is correct.\"", a: "No: more than one boy needs 'play'", w: ["Yes: verbs always end in -s", "Yes: boys is one person", "No: it should be 'The boys playing'"], m: "w4-agreement" },
  ],
  a1: [
    { q: "A question ends with ___", a: "a question mark", w: ["a full stop", "a comma", "an exclamation point"], m: "w4-dialogue" },
    { q: "Which word always needs a capital letter?", a: "Monday", w: ["morning", "week", "school"], m: "w4-caps" },
  ],
  a2: [
    { q: "Fill the gap: My brother ___ to school.", a: "walks", w: ["walk", "walking", "walkes"], m: "w4-agreement" },
    { q: "Fill the gap: The children ___ in the garden.", a: "play", w: ["plays", "playes", "playing is"], m: "w4-agreement" },
    { q: "Fill the gap: I can ___ the bell.", a: "hear", w: ["here", "hair", "heer"], m: "w4-spelling" },
  ],
  a4: [
    { q: "Which is a complete sentence?", a: "The bus came late.", w: ["Came late.", "The late bus.", "After the bus."], m: "w3-fragment" },
    { q: "Which sentence is correct?", a: "Riya and I went to Goa.", w: ["riya and i went to goa.", "Riya and i went to Goa.", "Riya and I went to goa."], m: "w4-caps" },
  ],
};

// ---------------- Chapter 2: Writing a Narrative ----------------
export const NARRATIVE: SkillTopic = {
  topic: "w3-narrative",
  prefix: "wnr3",
  c1: [
    { s: "The popcorn popped and smelled buttery.", prompt: "Tap the word that appeals to smell.", target: "smelled", wrong: [{ phrase: "popped", mistake: "w4-senses" }] },
    { s: "The puppy dashed around the yard like a rocket.", prompt: "Tap the words that make the simile.", target: "like a rocket.", wrong: [{ phrase: "The puppy", mistake: "w4-word-choice" }] },
    { s: "The ice cream was cold and sweet.", prompt: "Tap the word that appeals to taste.", target: "sweet.", wrong: [{ phrase: "ice", mistake: "w4-senses" }] },
    { s: "Long ago, in a deep dark forest, lived a little fox.", prompt: "Tap every word that tells the setting.", target: "Long ago, in a deep dark forest,", wrong: [{ phrase: "a little fox.", mistake: "w4-story" }] },
  ],
  c3: [
    { prompt: "Put the story in order: beginning, middle, end.", answer: "Mia lost her ball. | She looked under the bed. | She found it and smiled.", spares: [], wrong: [["She looked under the bed. Mia lost her ball. She found it and smiled.", "w4-sequence"]] },
    { prompt: "Build the line of dialogue.", answer: "“I can't catch her!” | yelled Daphne.", spares: ["“I can't catch her”!"], wrong: [["“I can't catch her”! yelled Daphne.", "w4-dialogue"]] },
    { prompt: "Build a simile.", answer: "The snow | was as white | as milk.", spares: ["was white."], wrong: [["The snow was white.", "w4-word-choice"]] },
  ],
  c5: [
    { s: "The thunder tasted loud in the night.", bad: "tasted", mistake: "w4-senses", prompt: "One word uses the wrong sense. Tap it." },
    { s: "I'm exhausted, she said.", bad: "said.", mistake: "w4-dialogue", prompt: "Quotation marks are missing around the spoken words. Tap the word right after them." },
  ],
  p1: [
    { line: "The bells [[jingled]] on the door.", q: "Which sense does the highlighted word appeal to?", a: "Hearing", w: ["Taste", "Smell", "Touch"], m: "w4-senses" },
    { line: "The cat's fur was as soft as a cloud.", q: "What is this?", a: "A simile", w: ["A fact", "A question", "A time-order word"], m: "w4-word-choice" },
    { line: "Last summer, I learned to swim at my grandpa's lake.", q: "What kind of writing is this?", a: "A personal narrative", w: ["A news report", "A set of instructions", "A letter to the editor"], m: "w4-story" },
  ],
  p2: [
    { line: "A girl finds a magic pencil. Whatever she draws comes to life!", q: "Which is the best title?", a: "The Magic Pencil", w: ["My Pencil Case", "How to Sharpen a Pencil", "Drawing Paper"], m: "w4-story" },
    { line: "Tommy started school today. He started third grade. His teacher is nice.", q: "How could this be improved?", a: "Use sentences of different lengths", w: ["Make every sentence shorter", "Remove the subject", "Add more full stops"], m: "w4-word-choice" },
  ],
  p5: [
    { q: "\"A story needs characters, a setting and a plot.\"", a: "Yes: every story has these", w: ["No: a story only needs a title", "No: only characters", "Yes, but no plot"], m: "w4-story" },
    { q: "\"An idea web is used after a story is published.\"", a: "No: an idea web helps plan before writing", w: ["Yes: it is the last step", "Yes: it is for spelling", "No: it is for drawing pictures"], m: "w4-sequence" },
  ],
  a1: [
    { q: "A simile compares two things using ___", a: "'like' or 'as'", w: ["'and' or 'but'", "a question mark", "time-order words"], m: "w4-word-choice" },
    { q: "The setting of a story tells ___", a: "where and when it happens", w: ["who the characters are", "how it ends", "who wrote it"], m: "w4-story" },
  ],
  a2: [
    { q: "Which is a sensory word for touch?", a: "fuzzy", w: ["loud", "sweet", "bright"], m: "w4-senses" },
    { q: "A personal narrative tells about ___", a: "something that happened to the writer", w: ["how to make something", "facts about animals", "why you should agree"], m: "w4-story" },
  ],
  a4: [
    { q: "Which sentence uses dialogue correctly?", a: "“Let's go,” said Mom.", w: ["“Let's go” said Mom.", "Let's go, said Mom.", "“Let's go”, said Mom."], m: "w4-dialogue" },
    { q: "The five steps of the writing process, in order, are ___", a: "prewrite, draft, revise, proofread, publish", w: ["draft, publish, prewrite, revise, proofread", "publish, draft, revise, prewrite, proofread", "proofread, prewrite, publish, draft, revise"], m: "w4-sequence" },
  ],
};

// ---------------- Chapter 3: Writing to Inform ----------------
export const INFORM: SkillTopic = {
  topic: "w3-inform",
  prefix: "wif3",
  c1: [
    { s: "Dear Grandma, Thank you for my gift! Love, Jamal", prompt: "Tap the greeting.", target: "Dear Grandma,", wrong: [{ phrase: "Love, Jamal", mistake: "w4-letter" }] },
    { s: "Walk to the corner, then turn left at the shop.", prompt: "Tap the word that tells which way to turn.", target: "left", wrong: [{ phrase: "corner,", mistake: "w4-structure" }] },
    { s: "The lamp is next to the bed, and the rug is under it.", prompt: "Tap the words that tell where things are.", target: ["next to", "under"], wrong: [{ phrase: "lamp", mistake: "w4-structure" }] },
    { s: "A cheetah is faster than a horse.", prompt: "Tap the comparing word.", target: "faster", wrong: [{ phrase: "cheetah", mistake: "w4-structure" }] },
  ],
  c3: [
    { prompt: "Put the parts of a friendly letter in order.", answer: "date | greeting | body | closing | signature", spares: [], wrong: [["greeting date body closing signature", "w4-letter"]] },
    { prompt: "Put the instructions in order.", answer: "First, wet your toothbrush. | Next, add toothpaste. | Then, brush your teeth. | Last, rinse your mouth.", spares: [], wrong: [["Next, add toothpaste. First, wet your toothbrush. Then, brush your teeth. Last, rinse your mouth.", "w4-sequence"]] },
    { prompt: "Join the two sentences with a linking word.", answer: "I like dogs, | and | I like cats too.", spares: ["but"], wrong: [["I like dogs, but I like cats too.", "w4-transition"]] },
  ],
  c5: [
    { s: "Jaxson's joke was more funnier than Riley's joke.", bad: "more", mistake: "w4-structure", prompt: "One word is extra. Tap it." },
    { s: "Fudge ice cream is the deliciousest flavour of them all.", bad: "deliciousest", mistake: "w4-structure", prompt: "One comparing word is wrong. Tap it." },
  ],
  p1: [
    { line: "[[Love,]]", q: "Which part of a friendly letter is this?", a: "The closing", w: ["The greeting", "The date", "The body"], m: "w4-letter" },
    { line: "[[May 1, 2025]]", q: "Which part of a friendly letter is this?", a: "The date", w: ["The closing", "The signature", "The greeting"], m: "w4-letter" },
    { line: "A goalie can use their hands and feet to stop the ball from going into the goal.", q: "Who is this sentence best for?", a: "A young player who is just learning", w: ["A college player who knows the game", "A coach with many years of practice", "Nobody: it is too hard"], m: "w3-audience" },
  ],
  p2: [
    { line: "Who? What? When? Where? Why? How?", q: "What are these questions used for?", a: "Getting facts for a news report", w: ["Writing a poem", "Ending a letter", "Making a simile"], m: "w4-structure" },
    { line: "Both a pen and a pencil are used for writing, but only a pencil can be erased.", q: "What does this sentence do?", a: "It compares and contrasts", w: ["It gives directions", "It tells a story", "It gives an opinion"], m: "w4-structure" },
  ],
  p5: [
    { q: "\"A Venn diagram shows how two things are alike and different.\"", a: "Yes: the middle shows what they share", w: ["No: it shows time order", "No: it is for letters", "Yes, but only for numbers"], m: "w4-structure" },
    { q: "\"In a news report, the most important facts go last.\"", a: "No: the most important facts go first", w: ["Yes: save the best for last", "Yes: facts don't matter", "No: there are no facts in news"], m: "w4-structure" },
  ],
  a1: [
    { q: "The body of a friendly letter is ___", a: "the main message", w: ["the name at the end", "the date", "the 'Dear …' line"], m: "w4-letter" },
    { q: "Instructions should be written ___", a: "in the order you do the steps", w: ["in any order", "backwards", "all in one long sentence"], m: "w4-sequence" },
  ],
  a2: [
    { q: "Fill the gap: Yesterday was ___ than today.", a: "windier", w: ["windiest", "more windy than windier", "wind"], m: "w4-structure" },
    { q: "Fill the gap: I was ___ than my mom to go to the movie.", a: "more excited", w: ["most excited", "excitedest", "exciteder"], m: "w4-structure" },
  ],
  a4: [
    { q: "Which detail does NOT belong in a report about whales?", a: "My cousin has a red bike.", w: ["Whales breathe air.", "Blue whales are very big.", "Whales live in the ocean."], m: "w4-main-idea" },
    { q: "Which sentence is best for an expert player?", a: "You're the backbone of this team.", w: ["A ball is round.", "Kick the ball with your foot.", "This is a goal."], m: "w3-audience" },
  ],
};

// ---------------- Chapter 4: Writing an Opinion ----------------
export const OPINION: SkillTopic = {
  topic: "w3-opinion",
  prefix: "wop3",
  c1: [
    { s: "Bees are scary.", prompt: "Tap the word that shows this is an opinion.", target: "scary.", wrong: [{ phrase: "Bees", mistake: "w4-fact-opinion" }] },
    { s: "I think a dog is the best pet because it can learn tricks.", prompt: "Tap every word of the reason.", target: "because it can learn tricks.", wrong: [{ phrase: "I think a dog is the best pet", mistake: "w4-persuade" }] },
    { s: "Recycling is important because it keeps rubbish out of landfills.", prompt: "Tap the linking word that joins the opinion and the reason.", target: "because", wrong: [{ phrase: "important", mistake: "w4-persuade" }] },
  ],
  c3: [
    { prompt: "Build an opinion with a reason.", answer: "Summer is the best season | because | we can swim.", spares: ["but"], wrong: [["Summer is the best season but we can swim.", "w4-persuade"]] },
    { prompt: "Build an opinion paragraph in order: opinion, reason, example.", answer: "Reading is fun. | It takes you to new places. | For example, I visited space in a book.", spares: [], wrong: [["It takes you to new places. Reading is fun. For example, I visited space in a book.", "w4-persuade"]] },
  ],
  c5: [
    { s: "Honeybees beat their wings 200 times a second, which is an opinion.", bad: "opinion.", mistake: "w4-fact-opinion", prompt: "One word in this judgement is wrong. Tap it." },
    { s: "Teaching is a great career because my uncle is tall.", bad: "tall.", mistake: "w4-persuade", prompt: "The reason doesn't support the opinion. Tap the word that makes it silly." },
  ],
  p1: [
    { line: "I have never been stung by a bee.", q: "Is this a fact or an opinion?", a: "Fact", w: ["Opinion", "Neither", "Both"], m: "w4-fact-opinion" },
    { line: "It is important to save the bees.", q: "Is this a fact or an opinion?", a: "Opinion", w: ["Fact", "Neither", "Both"], m: "w4-fact-opinion" },
    { line: "There are three types of honeybees: the queen, workers and drones.", q: "Is this a fact or an opinion?", a: "Fact", w: ["Opinion", "Neither", "Both"], m: "w4-fact-opinion" },
  ],
  p2: [
    { line: "I think a dog is the best pet to have.", q: "Which reason supports this opinion best?", a: "Dogs are loyal and can be trained to help.", w: ["Dogs come in many colours.", "My street has a shop.", "Cats sleep a lot."], m: "w4-persuade" },
    { line: "Teaching is a great career.", q: "Which reason supports this opinion best?", a: "Helping students learn is very rewarding.", w: ["My uncle is a teacher.", "Schools have doors.", "Teachers use chalk."], m: "w4-persuade" },
  ],
  p5: [
    { q: "\"Just saying how you feel is enough for a good opinion paragraph.\"", a: "No: you need reasons and examples too", w: ["Yes: feelings are enough", "Yes: reasons are not allowed", "No: you need a simile"], m: "w4-persuade" },
    { q: "\"'Sharks have many rows of teeth' is an opinion.\"", a: "No: it can be checked, so it is a fact", w: ["Yes: it is what someone thinks", "Yes: sharks are scary", "No: it is a question"], m: "w4-fact-opinion" },
  ],
  a1: [
    { q: "An opinion is ___", a: "what someone thinks or feels", w: ["something that can be proved", "a list of steps", "the date on a letter"], m: "w4-fact-opinion" },
    { q: "Which linking word joins an opinion to its reason?", a: "because", w: ["first", "dear", "last"], m: "w4-persuade" },
  ],
  a2: [
    { q: "Which is an opinion?", a: "Pizza is the tastiest food.", w: ["Pizza is made with dough.", "Pizza can be baked in an oven.", "Some pizzas have cheese."], m: "w4-fact-opinion" },
    { q: "Which phrase gives an example?", a: "For example", w: ["Dear Sir", "The end", "Once upon a time"], m: "w4-persuade" },
  ],
  a4: [
    { q: "The parts of an opinion paragraph are ___", a: "opinion, reasons and examples", w: ["greeting, body and closing", "beginning, middle and end only", "who, what and where"], m: "w4-persuade" },
    { q: "A letter to the editor is written to ___", a: "share an opinion in a newspaper", w: ["thank a friend for a gift", "give directions", "tell a fairy tale"], m: "w4-letter" },
  ],
};
