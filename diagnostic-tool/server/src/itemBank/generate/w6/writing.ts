import { Misconceptions, SkillTopic } from "../skillTopic.js";

/**
 * Grade 6 Writing (Spectrum Writing Grade 6), as six topics: Chapter 1;
 * Chapter 2 split into description (2.1–2.7) and story (2.8–2.17);
 * Chapter 3 split into informing (3.1–3.10) and research (3.11–3.18);
 * Chapter 4. Reuses mistake names from Grades 3, 4 and 7 Writing
 * (w3-, w4-, wr-) where the skill is the same.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "w6-voice": { label: "Mixes up active and passive voice", detail: "Calls 'The article was written by a journalist' active, or can't turn it round.", childTip: "Active: the subject does the action (A journalist wrote the article). Passive: the subject receives it (The article was written by …)." },
  "w6-claim": { label: "Can't find or make a strong claim", detail: "Picks a fact or a reason as the claim, or a claim nobody could argue with.", childTip: "A claim is the writer's debatable position (Parents should limit screen time to two hours). Reasons and evidence support it." },
  "w6-cite": { label: "Cites or paraphrases sources wrongly", detail: "Copies words without quotation marks, or leaves out the source.", childTip: "Quote: the exact words in quotation marks, with the source. Paraphrase: your own words, still with the source. Both go in Works Cited." },
};

// ---------------- Chapter 1: Foundations of Writing ----------------
export const FOUNDATIONS: SkillTopic = {
  topic: "w6-foundations",
  prefix: "wfd6",
  c1: [
    { s: "Shirley Temple is known as one of the greatest child actors. She began acting at three. She won an award in 1935.", prompt: "Tap every word of the topic sentence.", target: "Shirley Temple is known as one of the greatest child actors.", wrong: [{ phrase: "She began acting at three.", mistake: "w4-main-idea" }] },
    { s: "Volcanoes form where plates meet. Lava cools into rock. My uncle likes cricket. Ash can travel far.", prompt: "One sentence is off topic. Tap every word of it.", target: "My uncle likes cricket.", wrong: [{ phrase: "Lava cools into rock.", mistake: "wr-off-topic" }] },
    { s: "Shiloh and me went to the water park on saturday.", prompt: "Tap the two mistakes: a wrong pronoun and a missing capital.", target: ["me", "saturday."], wrong: [{ phrase: "park", mistake: "w4-caps" }] },
    { s: "I dont think I have ever had sew much fun.", prompt: "Tap the two word mistakes.", target: ["dont", "sew"], wrong: [{ phrase: "fun.", mistake: "w4-spelling" }] },
  ],
  c3: [
    { prompt: "Rewrite in the active voice.", answer: "A famous journalist | wrote | the article.", spares: ["was written by"], wrong: [["A famous journalist was written by the article.", "w6-voice"]] },
    { prompt: "Rewrite in the active voice.", answer: "A mosquito | bit | Layla.", spares: ["was bitten by"], wrong: [["A mosquito was bitten by Layla.", "w6-voice"]] },
    { prompt: "Build the paragraph in order: topic sentence, details, conclusion.", answer: "Recycling helps our town. | It keeps streets clean. | It saves money. | Everyone should recycle.", spares: [], wrong: [["It keeps streets clean. Recycling helps our town. It saves money. Everyone should recycle.", "w4-main-idea"]] },
  ],
  c5: [
    { s: "Yesterday we go to the museum and saw dinosaur bones.", bad: "go", mistake: "w4-agreement", prompt: "One verb is in the wrong tense. Tap it." },
    { s: "Its known for being one of the best waterslides.", bad: "Its", mistake: "w4-spelling", prompt: "One word needs an apostrophe. Tap it." },
    { s: "My mom was worried about Shiloh and I at first.", bad: "I", mistake: "w4-agreement", prompt: "One pronoun should be 'me'. Tap it." },
  ],
  p1: [
    { line: "Mei biked to school with Hudson.", q: "Which voice is this sentence in?", a: "Active", w: ["Passive", "Both", "Neither"], m: "w6-voice" },
    { line: "The cake was eaten by the guests.", q: "Which voice is this sentence in?", a: "Passive", w: ["Active", "Both", "Neither"], m: "w6-voice" },
    { line: "Buy one, get one free! Don't miss the sale of the year!", q: "What is the main purpose of this writing?", a: "To persuade", w: ["To inform", "To entertain", "To describe a setting"], m: "w3-purpose" },
    { line: "A goalie can use their hands and feet to stop the ball.", q: "Who is this sentence written for?", a: "A beginner who doesn't know the rules", w: ["A professional goalkeeper", "A referee", "A sports scientist"], m: "w3-audience" },
  ],
  p5: [
    { q: "\"Good writers usually prefer the passive voice because it sounds formal.\"", a: "No: the active voice is usually clearer and stronger", w: ["Yes: passive is always better", "Yes: active voice is incorrect", "No: there is no difference"], m: "w6-voice" },
    { q: "\"Every detail in a paragraph should support the main idea.\"", a: "Yes: that keeps the paragraph on topic", w: ["No: any interesting fact can go in", "No: only the last sentence matters", "Yes, but only in stories"], m: "wr-off-topic" },
  ],
  a1: [
    { q: "The three main purposes for writing are ___", a: "to inform, to persuade and to entertain", w: ["to spell, to punctuate and to capitalise", "to read, to draw and to sing", "to copy, to paste and to print"], m: "w3-purpose" },
    { q: "A topic sentence ___", a: "states the main idea of a paragraph", w: ["gives one small detail", "always asks a question", "lists the sources"], m: "w4-main-idea" },
  ],
  a2: [
    { q: "The active form of 'The window was broken by Ravi' is ___", a: "Ravi broke the window.", w: ["The window broke Ravi.", "Ravi was broken by the window.", "The window was Ravi's."], m: "w6-voice" },
    { q: "Proofreading means checking for ___", a: "errors in spelling, grammar, punctuation and capitals", w: ["new ideas to add", "a better title only", "the number of words"], m: "w4-spelling" },
  ],
  a4: [
    { q: "Which sentence suits a letter to a school principal?", a: "I would like to request a longer lunch break.", w: ["Yo, we need more lunch time!", "Lunch is soooo short lol.", "Gimme more lunch."], m: "w3-audience" },
    { q: "Which is the strongest topic sentence for a paragraph about saving water?", a: "Families can save water with a few simple habits.", w: ["Water is wet.", "I like water.", "Turn off the tap."], m: "w4-main-idea" },
  ],
};

// ---------------- Chapter 2 (2.1–2.7): Describing ----------------
export const DESCRIPTION: SkillTopic = {
  topic: "w6-description",
  prefix: "wds6",
  c1: [
    { s: "The ball was skittering crazily across the chewed-up grass.", prompt: "Tap the vivid verb.", target: "skittering", wrong: [{ phrase: "grass.", mistake: "w4-word-choice" }] },
    { s: "The bakery smelled of warm cinnamon and fresh bread.", prompt: "Tap the word that names the sense.", target: "smelled", wrong: [{ phrase: "bread.", mistake: "w4-senses" }] },
    { s: "To the left of the door stands a tall bookshelf, and beside it is a desk.", prompt: "Tap the words that show spatial order.", target: ["To the left of", "beside"], wrong: [{ phrase: "tall", mistake: "w4-structure" }] },
    { s: "A golden retriever napped beneath the jacaranda tree.", prompt: "Tap the two precise nouns.", target: ["retriever", "jacaranda"], wrong: [{ phrase: "napped", mistake: "w4-word-choice" }] },
  ],
  c3: [
    { prompt: "Build a more vivid sentence.", answer: "The puppy | scampered | across the muddy yard.", spares: ["went"], wrong: [["The puppy went across the muddy yard.", "w4-word-choice"]] },
    { prompt: "Describe the room from left to right.", answer: "On the left is a window. | In the middle is a bed. | On the right is a wardrobe.", spares: [], wrong: [["In the middle is a bed. On the left is a window. On the right is a wardrobe.", "w4-structure"]] },
  ],
  c5: [
    { s: "The thunder tasted loud as it rolled over the hills.", bad: "tasted", mistake: "w4-senses", prompt: "One word uses the wrong sense. Tap it." },
    { s: "The thing on the table was nice.", bad: "thing", mistake: "w4-word-choice", prompt: "Tap the vague noun that should be more precise." },
  ],
  p1: [
    { line: "Neil gritted his teeth and [[sprinted]] for the end zone.", q: "Why did the writer choose the highlighted word?", a: "It is a vivid verb that shows speed", w: ["It is a precise noun", "It shows the setting", "It is a time-order word"], m: "w4-word-choice" },
    { line: "The crisp, [[crunchy]] leaves covered the path.", q: "Which sense does the highlighted word appeal to?", a: "Hearing (and touch)", w: ["Smell", "Taste", "Sight only"], m: "w4-senses" },
    { line: "Above the fireplace hangs a clock. Below it, a cat sleeps on the rug.", q: "How is this description organised?", a: "Spatial order (top to bottom)", w: ["Time order", "Order of importance", "Cause and effect"], m: "w4-structure" },
  ],
  p5: [
    { q: "\"'Ate' is a more vivid verb than 'devoured'.\"", a: "No: 'devoured' paints a clearer picture", w: ["Yes: shorter verbs are always more vivid", "They mean exactly the same", "Yes: 'devoured' is a noun"], m: "w4-word-choice" },
    { q: "\"Adverbs like 'frantically' can make a description stronger.\"", a: "Yes: they show how an action happens", w: ["No: adverbs are never used in stories", "No: they describe nouns", "Yes, but only at the end of a sentence"], m: "w4-part-of-speech" },
  ],
  a1: [
    { q: "Sensory details appeal to ___", a: "sight, hearing, smell, taste and touch", w: ["only sight", "the order of events", "the reader's opinion"], m: "w4-senses" },
    { q: "Spatial organisation describes things ___", a: "by where they are", w: ["by when they happened", "from most to least important", "by cause and effect"], m: "w4-structure" },
  ],
  a2: [
    { q: "Which is the most precise noun?", a: "sparrow", w: ["bird", "animal", "thing"], m: "w4-word-choice" },
    { q: "Which is the most vivid verb for walking slowly and tiredly?", a: "trudged", w: ["went", "moved", "walked"], m: "w4-word-choice" },
  ],
  a4: [
    { q: "Which sentence uses adjectives, adverbs and sensory details best?", a: "The icy rain drummed steadily on the tin roof.", w: ["It rained.", "The rain was on the roof.", "There was some rain today."], m: "w4-word-choice" },
  ],
};

// ---------------- Chapter 2 (2.8–2.17): Stories and personal narratives ----------------
export const STORY: SkillTopic = {
  topic: "w6-story",
  prefix: "wst6",
  c1: [
    { s: "Neil picked up the ball and looked frantically around him.", prompt: "Tap the word that shows third-person point of view.", target: "him.", wrong: [{ phrase: "ball", mistake: "wr-pov" }], also: ["Neil"] },
    { s: "First, Cameron arrived late. Then, the light broke. Finally, the dentist found seven cavities.", prompt: "Tap the three time-order words.", target: ["First,", "Then,", "Finally,"] },
    { s: "I grabbed my bag and raced to the bus stop.", prompt: "Tap the word that shows first-person point of view.", target: "I", wrong: [{ phrase: "bag", mistake: "wr-pov" }], also: ["my", ["I", "my"]] },
  ],
  c3: [
    { prompt: "Build the line of dialogue.", answer: "“What did you do this weekend?” | Mei asked.", spares: ["“What did you do this weekend”?"], wrong: [["“What did you do this weekend”? Mei asked.", "w4-dialogue"]] },
    { prompt: "Build the set-off dialogue.", answer: "“Not much,” | Luca replied. | “I had so much homework.”", spares: ["“Not much”,"], wrong: [["“Not much”, Luca replied. “I had so much homework.”", "w4-dialogue"]] },
    { prompt: "Put the story events in order.", answer: "Cameron arrived at the dentist. | The light in the chair broke. | His teeth were cleaned in another room. | He learned he had seven cavities.", spares: [], wrong: [["The light in the chair broke. Cameron arrived at the dentist. His teeth were cleaned in another room. He learned he had seven cavities.", "w4-sequence"]] },
  ],
  c5: [
    { s: "I opened the door, and she saw a parcel on the step.", bad: "she", mistake: "wr-pov", prompt: "The point of view shifts. Tap the word that breaks it." },
    { s: "In the end, the story begins when Neil goes onto the field.", bad: "end,", mistake: "w4-story", prompt: "Going onto the field is the beginning. Tap the wrong word." },
  ],
  p1: [
    { line: "Coach had put Neil out on the field. He hadn't played all season.", q: "What point of view is this?", a: "Third person", w: ["First person", "Second person", "No point of view"], m: "wr-pov" },
    { line: "It was a stormy night in an old lighthouse on the coast.", q: "Which story element does this establish?", a: "The setting", w: ["The conflict", "The resolution", "The dialogue"], m: "w4-story" },
    { line: "Neil looked at his ankle, which was bent at a nauseating angle.", q: "What does this detail show?", a: "Neil's victory came at a painful cost", w: ["Neil lost the game", "The match was cancelled", "Neil was not playing"], m: "w4-traits" },
  ],
  p2: [
    { line: "Riya's hands trembled as she stepped onto the stage.", q: "What does this show about Riya?", a: "She is nervous", w: ["She is bored", "She is angry", "She is sleepy"], m: "w4-traits" },
    { line: "A personal narrative about the day I learned to swim.", q: "Which point of view should it use?", a: "First person", w: ["Third person", "Second person", "No narrator"], m: "wr-pov" },
  ],
  p5: [
    { q: "\"A story only needs a beginning; the middle and end are optional.\"", a: "No: a story needs a beginning, a middle and an end", w: ["Yes: beginnings are enough", "Yes: endings are optional", "No: it needs only an end"], m: "w4-story" },
    { q: "\"Dialogue can show what a character is like.\"", a: "Yes: what characters say reveals their personality", w: ["No: dialogue only fills space", "No: characters never speak", "Yes, but only in poems"], m: "w4-traits" },
  ],
  a1: [
    { q: "The parts of a story include ___", a: "characters, setting, plot, conflict and resolution", w: ["greeting, body and closing", "claim, reasons and evidence", "title, author and publisher"], m: "w4-story" },
    { q: "Third-person point of view uses ___", a: "he, she and they", w: ["I and me", "you and your", "we and us only"], m: "wr-pov" },
  ],
  a2: [
    { q: "Which is the best opening line for a story?", a: "The ground began to shake just as I bit into my sandwich.", w: ["This story is about an earthquake.", "I am going to tell you a story.", "Once there was a thing."], m: "w4-story" },
    { q: "Which transition shows the last event?", a: "Finally", w: ["First", "Meanwhile", "Before that"], m: "w4-transition" },
  ],
  a4: [
    { q: "Which sentence shows rather than tells that Arjun was scared?", a: "Arjun's knees trembled and his voice cracked.", w: ["Arjun was scared.", "Arjun felt very scared.", "Arjun was a scared boy."], m: "w4-traits" },
    { q: "The five steps of the writing process, in order, are ___", a: "prewrite, draft, revise, proofread, publish", w: ["draft, publish, prewrite, revise, proofread", "publish, draft, revise, prewrite, proofread", "proofread, prewrite, publish, draft, revise"], m: "w4-sequence" },
  ],
};

// ---------------- Chapter 3 (3.1–3.10): Writing to inform ----------------
export const INFORM: SkillTopic = {
  topic: "w6-inform",
  prefix: "wif6",
  c1: [
    { s: "Due to heavy rain, the playground flooded.", prompt: "Tap every word of the cause.", target: "Due to heavy rain,", wrong: [{ phrase: "the playground flooded.", mistake: "w4-structure" }] },
    { s: "Mount Everest is the tallest mountain, and K2 is taller than Kangchenjunga.", prompt: "Tap the superlative and the comparative.", target: ["tallest", "taller"], wrong: [{ phrase: "mountain,", mistake: "w4-structure" }] },
    { s: "Turn right at the bank, then walk two blocks north.", prompt: "Tap the two direction words.", target: ["right", "north."], wrong: [{ phrase: "bank,", mistake: "w4-structure" }] },
  ],
  c3: [
    { prompt: "Put the how-to steps in order.", answer: "Gather the supplies. | Mix the flour and water. | Knead the dough. | Bake for twenty minutes.", spares: [], wrong: [["Mix the flour and water. Gather the supplies. Knead the dough. Bake for twenty minutes.", "w4-sequence"]] },
    { prompt: "Build the comparison.", answer: "Cheetahs run | faster than | lions.", spares: ["more faster than"], wrong: [["Cheetahs run more faster than lions.", "w4-structure"]] },
    { prompt: "Put the essay in order.", answer: "Introduction | Body paragraphs | Conclusion", spares: [], wrong: [["Body paragraphs Introduction Conclusion", "w4-structure"]] },
  ],
  c5: [
    { s: "This is the most hottest summer on record.", bad: "most", mistake: "w4-structure", prompt: "One word is extra. Tap it." },
    { s: "In conclusion, this essay will tell you about volcanoes.", bad: "conclusion,", mistake: "w4-structure", prompt: "This sentence belongs in the introduction. Tap the word that makes it wrong." },
  ],
  p1: [
    { line: "Two early English colonies were Jamestown and Plymouth. Their relationships with local tribes were similar.", q: "What does this introductory paragraph do?", a: "It introduces the main idea of the essay", w: ["It sums up the evidence", "It lists the sources", "It tells a joke"], m: "w4-structure" },
    { line: "Both colonies grew over the years, and both tribes still exist today.", q: "Which part of the essay is this?", a: "The conclusion", w: ["The introduction", "A how-to step", "A citation"], m: "w4-structure" },
    { line: "Because it rained all week, recess will be indoors.", q: "What structure does this sentence use?", a: "Cause and effect", w: ["Compare and contrast", "Sequence", "Spatial order"], m: "w4-structure" },
    { line: "Hockey and cricket both use a stick or bat, but only hockey is played on ice.", q: "What structure does this sentence use?", a: "Compare and contrast", w: ["Cause and effect", "Problem and solution", "Sequence"], m: "w4-structure" },
  ],
  p5: [
    { q: "\"A conclusion paragraph should introduce brand-new facts.\"", a: "No: it summarises the main points", w: ["Yes: save the best facts for last", "Yes: it starts the essay", "No: it lists the sources"], m: "w4-structure" },
    { q: "\"Informative writing should use a formal style.\"", a: "Yes: it should be clear and formal", w: ["No: slang is best", "No: it should be a story", "Yes, but only for letters"], m: "w3-audience" },
  ],
  a1: [
    { q: "The purpose of informative writing is to ___", a: "inform or explain", w: ["entertain with a story", "persuade the reader", "express feelings in verse"], m: "w3-purpose" },
    { q: "A report of an event should answer ___", a: "who, what, when, where, why and how", w: ["only who", "only the writer's feelings", "only what happens next"], m: "w4-structure" },
  ],
  a2: [
    { q: "Fill the gap: This was the ___ test of the year.", a: "hardest", w: ["harder", "most hardest", "more hard"], m: "w4-structure" },
    { q: "Fill the gap: She sang ___ than her brother.", a: "more beautifully", w: ["beautifuller", "most beautifully", "more beautiful"], m: "w4-structure" },
  ],
  a4: [
    { q: "Which signal words show cause and effect?", a: "because, as a result, due to", w: ["first, next, finally", "similarly, both, unlike", "in conclusion, to sum up"], m: "w4-transition" },
  ],
};

// ---------------- Chapter 3 (3.11–3.18): Research ----------------
export const RESEARCH: SkillTopic = {
  topic: "w6-research",
  prefix: "wrs6",
  c1: [
    { s: "According to Newell, the colonists “were able to trade for local seeds” (68).", prompt: "Tap the words that name the source.", target: "According to Newell,", wrong: [{ phrase: "local", mistake: "w6-cite" }] },
    { s: "The colonists traded with the Wampanoag (Newell 78).", prompt: "Tap the in-text citation.", target: "(Newell 78).", wrong: [{ phrase: "Wampanoag", mistake: "w6-cite" }] },
  ],
  c3: [
    { prompt: "Build the Works Cited entry.", answer: "Brown, Peter. | The Wild Robot. | Little, Brown and Company, | 2016.", spares: [], wrong: [["The Wild Robot. Brown, Peter. Little, Brown and Company, 2016.", "w6-cite"]] },
    { prompt: "Put the research steps in order.", answer: "Find credible sources | Take notes | Make an outline | Write the draft | Create Works Cited", spares: [], wrong: [["Write the draft Find credible sources Take notes Make an outline Create Works Cited", "w4-sequence"]] },
  ],
  c5: [
    { s: "A blog by a gym owner is the most credible source about weightlifting.", bad: "most", mistake: "wr-source", prompt: "One word makes this judgement wrong. Tap it." },
    { s: "Copying a sentence word for word without quotation marks is a paraphrase.", bad: "paraphrase.", mistake: "w6-cite", prompt: "One word is wrong: this is plagiarism. Tap it." },
  ],
  p1: [
    { line: "An article by the Centers for Disease Control about the history of smallpox.", q: "Is this source credible?", a: "Yes: an expert government health agency", w: ["No: governments never publish facts", "No: it is too old", "Yes, because it is about history"], m: "wr-source" },
    { line: "An article on a gym's website about why everyone should lift weights.", q: "Is this source credible?", a: "Not fully: the gym may be biased because it sells memberships", w: ["Yes: gyms are experts on everything", "Yes: all websites are credible", "No: weightlifting doesn't exist"], m: "wr-source" },
    { line: "A textbook about the solar system printed 17 years ago.", q: "What is the problem with this source?", a: "It may be out of date", w: ["Textbooks are never credible", "It is too short", "Nothing at all"], m: "wr-source" },
  ],
  p2: [
    { line: "Original: “Jellyfish have no brain, bones or heart.” Student: Jellyfish lack a brain, a skeleton and a heart (Lee 12).", q: "What did the student do?", a: "Paraphrased and cited the source", w: ["Quoted it exactly", "Plagiarised it", "Made up a new fact"], m: "w6-cite" },
    { line: "A bar graph comparing rainfall in four cities.", q: "Why add this to a report?", a: "It is a visual aid that makes data easy to compare", w: ["It replaces the conclusion", "It is a citation", "It shows the writer's opinion"], m: "w4-structure" },
  ],
  p5: [
    { q: "\"If you paraphrase, you don't need to name the source.\"", a: "No: paraphrases still need a citation", w: ["Yes: your own words need no credit", "Yes: only quotes need sources", "No: you must quote every word"], m: "w6-cite" },
    { q: "\"An outline helps organise ideas before drafting.\"", a: "Yes: it plans the main points and details", w: ["No: outlines come after publishing", "No: outlines are only for stories", "Yes, but only for poems"], m: "w4-sequence" },
  ],
  a1: [
    { q: "A credible source is ___", a: "expert, current and checkable", w: ["the first website you find", "anything with pictures", "a friend's opinion"], m: "wr-source" },
    { q: "A Works Cited page lists ___", a: "the sources used in the writing", w: ["the writer's opinions", "the chapter titles", "the spelling mistakes"], m: "w6-cite" },
  ],
  a2: [
    { q: "A direct quote must be ___", a: "the exact words, in quotation marks", w: ["in your own words", "longer than a paragraph", "without a source"], m: "w6-cite" },
    { q: "Which is the most credible source on volcanoes?", a: "A geological survey's website", w: ["A comment on social media", "An advert for hiking boots", "A friend's blog about holidays"], m: "wr-source" },
  ],
  a4: [
    { q: "Good research notes ___", a: "record key facts in your own words, with the source", w: ["copy whole pages word for word", "leave out where facts came from", "include only your opinions"], m: "w6-cite" },
  ],
};

// ---------------- Chapter 4: Writing an Argument ----------------
export const ARGUMENT: SkillTopic = {
  topic: "w6-argument",
  prefix: "wag6",
  c1: [
    { s: "Parents should limit screen time to two hours a day because children need exercise.", prompt: "Tap every word of the claim.", target: "Parents should limit screen time to two hours a day", wrong: [{ phrase: "because children need exercise.", mistake: "w6-claim" }] },
    { s: "Imagine a lonely puppy shivering in the cold, waiting for you.", prompt: "Tap the two words that make an emotional appeal.", target: ["lonely", "shivering"], wrong: [{ phrase: "puppy", mistake: "wr-evidence" }] },
    { s: "First, screens reduce exercise. Furthermore, they limit creativity. Finally, they lower test scores.", prompt: "Tap the three transition words.", target: ["First,", "Furthermore,", "Finally,"] },
  ],
  c3: [
    { prompt: "Build an argumentative essay in order.", answer: "Introduction with the claim | Reasons with evidence | Conclusion summing up", spares: [], wrong: [["Reasons with evidence Introduction with the claim Conclusion summing up", "w4-structure"]] },
    { prompt: "Order the reasons from least to most important.", answer: "Bikes are fun. | Bikes save money. | Bikes keep the air clean.", spares: [], wrong: [["Bikes keep the air clean. Bikes save money. Bikes are fun.", "w4-sequence"]] },
  ],
  c5: [
    { s: "Ultra Shoes are the only shoes anyone smart would ever buy.", bad: "smart", mistake: "wr-evidence", prompt: "One word shows bias. Tap it." },
    { s: "Water boils at 100 °C at sea level, which is just an opinion.", bad: "opinion.", mistake: "w4-fact-opinion", prompt: "One word in this judgement is wrong. Tap it." },
  ],
  p1: [
    { line: "Our school should start an hour later.", q: "Is this a strong claim?", a: "Yes: it is a clear position people could debate", w: ["No: it is a fact", "No: it is a question", "Yes, because it is short"], m: "w6-claim" },
    { line: "Schools have teachers.", q: "Is this a strong claim?", a: "No: it is a fact nobody would argue with", w: ["Yes: it is debatable", "Yes: it is an emotional appeal", "No: it is an advert"], m: "w6-claim" },
    { line: "Studies show students who sleep more score higher on tests.", q: "What is this?", a: "Evidence supporting a claim", w: ["An emotional appeal", "A biased insult", "A greeting"], m: "wr-evidence" },
  ],
  p2: [
    { line: "Nine out of ten dentists recommend SmileBright!", q: "What persuasive technique is this advert using?", a: "Expert approval with a number", w: ["An emotional story", "Spatial order", "A simile"], m: "wr-evidence" },
    { line: "Only a fool would vote against the new park.", q: "What does this sentence show?", a: "Bias: it insults the other side instead of giving reasons", w: ["A fact", "A strong piece of evidence", "A neutral report"], m: "wr-evidence" },
  ],
  p5: [
    { q: "\"An argumentative essay should use a formal style.\"", a: "Yes: a formal style makes it more convincing", w: ["No: slang is more persuasive", "No: it should rhyme", "Yes, but only in the title"], m: "w3-audience" },
    { q: "\"Facts have no place in an argument; only opinions do.\"", a: "No: facts and evidence back up the claim", w: ["Yes: arguments are just feelings", "Yes: facts weaken a claim", "No: only adverts use facts"], m: "w4-fact-opinion" },
  ],
  a1: [
    { q: "A claim is ___", a: "the writer's debatable position", w: ["a fact everyone agrees with", "the list of sources", "the title of the essay"], m: "w6-claim" },
    { q: "An emotional appeal tries to ___", a: "make the reader feel something", w: ["list the sources", "describe a room", "correct spelling"], m: "wr-evidence" },
  ],
  a2: [
    { q: "Which is an opinion?", a: "Summer holidays should be longer.", w: ["Summer holidays start in May.", "Schools close for summer.", "Summer is a season."], m: "w4-fact-opinion" },
    { q: "A business letter ends with a closing such as ___", a: "Sincerely,", w: ["Love,", "See ya,", "XOXO,"], m: "w4-letter" },
  ],
  a4: [
    { q: "Which conclusion best ends an argument for a school garden?", a: "A garden would teach science, improve meals and bring students together, so our school should build one.", w: ["Gardens have dirt.", "I like flowers.", "Some schools have gardens."], m: "w6-claim" },
  ],
};
