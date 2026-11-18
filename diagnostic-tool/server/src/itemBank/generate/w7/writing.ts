import { Misconceptions, SkillTopic } from "../skillTopic.js";

/**
 * Grade 7 Writing (Spectrum Writing Grade 7). Writing itself needs a
 * reader, so these topics test the parts of writing that have a right
 * answer: paragraph structure, sequence and transitions, details and
 * point of view, organisation, fact and opinion, evidence and bias,
 * sources and plagiarism.
 */
export const MISCONCEPTIONS: Misconceptions = {
  "wr-topic-sentence": { label: "Can't find or write the topic sentence", detail: "Picks a detail as the main idea of a paragraph.", childTip: "The topic sentence says what the whole paragraph is about; every other sentence supports it." },
  "wr-off-topic": { label: "Misses the sentence that doesn't belong", detail: "Keeps a detail that doesn't support the paragraph's main idea.", childTip: "Check each sentence against the topic sentence: does it help explain it?" },
  "wr-transition": { label: "Uses the wrong transition word", detail: "Uses 'however' to add, or 'therefore' to contrast.", childTip: "Order: first, next, finally. Add: also, in addition. Contrast: however, on the other hand. Result: so, therefore." },
  "wr-sequence": { label: "Puts events or steps out of order", detail: "Can't follow the order of a narrative or a process.", childTip: "Look for time words (first, then, after that) and ask what must happen before what." },
  "wr-pov": { label: "Mixes up point of view", detail: "Confuses first person (I, we) with third person (he, she, they).", childTip: "First person: the narrator is in the story (I). Third person: the narrator tells about others (she, they)." },
  "wr-sensory": { label: "Misses sensory or precise details", detail: "Can't tell which sense a detail appeals to, or picks a vague word over a precise one.", childTip: "Sensory details appeal to sight, sound, smell, taste, touch. Precise words (sprinted, scarlet) paint a clearer picture than vague ones (went, red)." },
  "wr-structure": { label: "Mixes up text structures", detail: "Confuses compare-and-contrast, cause-and-effect, problem-solution and sequence.", childTip: "Compare/contrast: alike and different. Cause/effect: why something happened. Problem/solution: a problem and how it was solved." },
  "wr-fact-opinion": { label: "Mixes up fact and opinion", detail: "Calls a belief a fact, or a checkable statement an opinion.", childTip: "A fact can be checked (Delhi is India's capital). An opinion is a belief or feeling (Delhi is the best city). Watch for words like best, should, beautiful." },
  "wr-evidence": { label: "Picks weak evidence or misses bias", detail: "Chooses a feeling over a fact to support a claim, or doesn't notice one-sided writing.", childTip: "Strong evidence is facts, numbers, examples and expert words. Biased writing shows only one side or uses loaded words." },
  "wr-source": { label: "Misjudges sources", detail: "Trusts an unreliable source, or confuses paraphrasing with copying.", childTip: "Reliable sources are expert, current and checkable (.gov, .edu, encyclopaedias). Paraphrasing puts ideas in your own words and still credits the source; copying without credit is plagiarism." },
  "wr-audience": { label: "Ignores audience and purpose", detail: "Picks a formal tone for a friend, or casual words for a principal.", childTip: "Ask who will read it and why: a letter to the principal is formal; a note to a friend can be casual." },
};

export const PARAGRAPHS: SkillTopic = {
  topic: "w7-paragraphs",
  prefix: "wpg7",
  c1: [
    { s: "Dogs make loyal pets. They protect their families. They greet you happily every day. Cats sleep a lot.", prompt: "One sentence doesn't belong in this paragraph. Tap every word of it.", target: "Cats sleep a lot.", wrong: [{ phrase: "Dogs make loyal pets.", mistake: "wr-topic-sentence" }] },
    { s: "Exercise keeps us healthy. It strengthens the heart. My cousin has a red bicycle. It also helps us sleep well.", prompt: "One sentence doesn't belong. Tap every word of it.", target: "My cousin has a red bicycle.", wrong: [{ phrase: "Exercise keeps us healthy.", mistake: "wr-topic-sentence" }] },
    { s: "Recycling helps the planet. It saves energy. It reduces rubbish in landfills. It also protects forests.", prompt: "Tap every word of the topic sentence.", target: "Recycling helps the planet.", wrong: [{ phrase: "It saves energy.", mistake: "wr-topic-sentence" }] },
    { s: "First, boil the water. Next, add the noodles. Finally, drain and serve.", prompt: "Tap the three transition words that show order.", target: ["First,", "Next,", "Finally,"] },
  ],
  c3: [
    { prompt: "Put the steps of the paragraph in order.", answer: "First, gather your materials. | Then, sketch your design lightly. | After that, paint the main shapes. | Finally, add the small details.", spares: [], wrong: [["Then, sketch your design lightly. First, gather your materials. After that, paint the main shapes. Finally, add the small details.", "wr-sequence"]] },
    { prompt: "Build a sentence that adds a contrasting idea.", answer: "The beach was crowded | ; | however, | we found a quiet spot | .", spares: ["therefore,", "in addition,"], wrong: [["The beach was crowded; therefore, we found a quiet spot.", "wr-transition"]] },
    { prompt: "Build a sentence that shows a result.", answer: "It rained all night | ; | as a result, | the match was cancelled | .", spares: ["however,", "for example,"], wrong: [["It rained all night; however, the match was cancelled.", "wr-transition"]] },
  ],
  c5: [
    { s: "Smartphones are useful. However, they help us call family and find directions.", bad: "However,", mistake: "wr-transition", prompt: "One transition word is wrong for the meaning. Tap it." },
    { s: "I love winter. For example, the days are short and dark, so I prefer summer.", bad: "love", mistake: "wr-topic-sentence", prompt: "One word makes the topic sentence disagree with the rest. Tap it." },
    { s: "Finally, preheat the oven. Then mix the flour and sugar.", bad: "Finally,", mistake: "wr-sequence", prompt: "One time word is in the wrong place. Tap it." },
  ],
  p1: [
    { line: "Trees are vital to life on Earth. They give us oxygen. They provide homes for animals. They cool our cities.", q: "Which sentence is the topic sentence?", a: "The first sentence", w: ["The second sentence", "The third sentence", "The last sentence"], m: "wr-topic-sentence" },
    { line: "Our school should have a longer lunch break. Students would have time to eat properly. They could relax before class. [[So, a longer break would help everyone learn better.]]", q: "What is the highlighted sentence?", a: "The concluding sentence", w: ["The topic sentence", "A supporting detail", "A transition word"], m: "wr-topic-sentence" },
    { line: "Maya practised every morning. [[Meanwhile]], her brother slept.", q: "What does the highlighted transition show?", a: "Two things happening at the same time", w: ["A result", "A contrast in opinion", "The last step"], m: "wr-transition" },
  ],
  p5: [
    { q: "\"Every sentence in a paragraph should support the topic sentence.\"", a: "Yes: that keeps the paragraph focused", w: ["No: paragraphs can wander", "No: only the first sentence matters", "Yes, but only in stories"], m: "wr-off-topic" },
    { q: "\"'In conclusion' is a good transition to start a paragraph's first sentence.\"", a: "No: it signals the end, so it belongs at the end", w: ["Yes: it introduces the topic", "Yes: it adds an example", "No: it shows contrast"], m: "wr-transition" },
  ],
  a1: [
    { q: "A topic sentence ___", a: "states the main idea of a paragraph", w: ["gives one small detail", "always ends the paragraph", "is a question"], m: "wr-topic-sentence" },
    { q: "Which transition shows contrast?", a: "On the other hand", w: ["In addition", "As a result", "First of all"], m: "wr-transition" },
    { q: "The steps of the writing process, in order, are ___", a: "prewrite, draft, revise, edit, publish", w: ["draft, publish, prewrite, edit, revise", "edit, draft, revise, prewrite, publish", "publish, revise, draft, edit, prewrite"], m: "wr-sequence" },
  ],
  a2: [
    { q: "Fill the gap: I wanted to go out. ___, it was raining.", a: "However", w: ["Therefore", "In addition", "For example"], m: "wr-transition" },
    { q: "Fill the gap: Mangoes are rich in vitamins. ___, they taste delicious.", a: "In addition", w: ["However", "On the other hand", "As a result"], m: "wr-transition" },
    { q: "Fill the gap: The bridge was closed. ___, we took a longer route.", a: "As a result", w: ["However", "For example", "In contrast"], m: "wr-transition" },
  ],
  a4: [
    { q: "Which is the best topic sentence for a paragraph about saving water?", a: "There are many easy ways to save water at home.", w: ["Turn off the tap while brushing.", "My bathroom is blue.", "Water is wet."], m: "wr-topic-sentence" },
    { q: "In which part of the writing process do you fix spelling and punctuation?", a: "Editing", w: ["Prewriting", "Drafting", "Publishing"], m: "wr-sequence" },
    { q: "Which sentence uses the active voice, as good writing usually should?", a: "The committee approved the plan.", w: ["The plan was approved by the committee.", "The plan has been approved.", "Approval was given to the plan by the committee."], m: "wr-audience" },
    { q: "You are writing to a younger child about brushing teeth. Which sentence suits your audience?", a: "Brush your teeth for two minutes, morning and night!", w: ["Dental hygiene necessitates biannual professional prophylaxis.", "Pursuant to guidelines, oral care is advised.", "Teeth are calcified structures of the jaw."], m: "wr-audience" },
  ],
};

export const NARRATIVE: SkillTopic = {
  topic: "w7-narrative",
  prefix: "wnr7",
  c1: [
    { s: "The bread smelled warm and yeasty, and the crust crackled under my fingers.", prompt: "Tap the word that appeals to smell.", target: "smelled", wrong: [{ phrase: "crackled", mistake: "wr-sensory" }] },
    { s: "The crickets chirped as the cold wind stung my cheeks.", prompt: "Tap the word that appeals to hearing.", target: "chirped", wrong: [{ phrase: "stung", mistake: "wr-sensory" }] },
    { s: "I grabbed my bag and raced to the bus stop.", prompt: "Tap the word that shows this is first-person point of view.", target: "I", wrong: [{ phrase: "my", mistake: "wr-pov" }], also: [["I", "my"]] },
    { s: "The scarlet kite soared above the glittering lake.", prompt: "Tap the two precise words that describe colour or light.", target: ["scarlet", "glittering"] },
  ],
  c3: [
    { prompt: "Put the events of the story in order.", answer: "The alarm didn't ring. | I woke up late. | I ran to catch the bus. | I reached school just as the bell rang.", spares: [], wrong: [["I woke up late. The alarm didn't ring. I ran to catch the bus. I reached school just as the bell rang.", "wr-sequence"]] },
    { prompt: "Build a line of dialogue correctly.", answer: "\"Watch out!\" | shouted Ravi | .", spares: ["\"Watch out\"!"], wrong: [["\"Watch out\"! shouted Ravi.", "wr-sensory"]] },
    { prompt: "Build a more precise sentence.", answer: "The puppy | scampered | across the muddy yard | .", spares: ["went", "moved"], wrong: [["The puppy went across the muddy yard.", "wr-sensory"]] },
  ],
  c5: [
    { s: "I opened the door, and she saw a huge box on the step.", bad: "she", mistake: "wr-pov", prompt: "The point of view shifts. Tap the word that breaks it." },
    { s: "The thing was nice and the place was good.", bad: "nice", mistake: "wr-sensory", prompt: "Tap the first vague word that should be replaced with a precise one." },
  ],
  p1: [
    { line: "Leena tiptoed to the window. She wondered if anyone had seen her.", q: "What point of view is this?", a: "Third person", w: ["First person", "Second person", "No point of view"], m: "wr-pov" },
    { line: "The thunder [[boomed]] over the hills.", q: "Which sense does the highlighted word appeal to?", a: "Hearing", w: ["Sight", "Taste", "Smell"], m: "wr-sensory" },
    { line: "The lemonade was [[sour]] and icy cold.", q: "Which sense does the highlighted word appeal to?", a: "Taste", w: ["Sound", "Sight", "Smell"], m: "wr-sensory" },
    { line: "My hands shook as I stepped onto the stage.", q: "What does this detail show?", a: "The narrator is nervous", w: ["The narrator is bored", "The stage is cold", "The narrator is angry"], m: "wr-sensory" },
  ],
  p5: [
    { q: "\"A personal narrative is usually written in the first person.\"", a: "Yes: it tells the writer's own experience with I", w: ["No: always third person", "No: always second person", "Yes, but only in poems"], m: "wr-pov" },
    { q: "\"'She walked' paints a clearer picture than 'She trudged'.\"", a: "No: 'trudged' is more precise and shows how she felt", w: ["Yes: shorter is clearer", "Yes: 'walked' is a better verb", "They mean exactly the same"], m: "wr-sensory" },
  ],
  a1: [
    { q: "A narrative ___", a: "tells a story with characters, a setting and events", w: ["persuades the reader to agree", "explains how to do something", "compares two things"], m: "wr-structure" },
    { q: "Sensory details appeal to ___", a: "sight, sound, smell, taste and touch", w: ["only sight", "the reader's opinion", "the order of events"], m: "wr-sensory" },
  ],
  a2: [
    { q: "Which word is the most precise replacement for 'said' in an angry moment?", a: "snapped", w: ["told", "went", "talked"], m: "wr-sensory" },
    { q: "Which pronoun signals third-person point of view?", a: "they", w: ["I", "we", "me"], m: "wr-pov" },
  ],
  a4: [
    { q: "Which sentence shows rather than tells that Arjun was scared?", a: "Arjun's knees trembled and his voice cracked.", w: ["Arjun was scared.", "Arjun felt very scared.", "Arjun was a scared boy."], m: "wr-sensory" },
    { q: "Which is the best opening for a story?", a: "The ground began to shake just as I bit into my sandwich.", w: ["This story is about an earthquake.", "I am going to tell you a story.", "Once there was a day."], m: "wr-structure" },
  ],
};

export const INFORMATIONAL: SkillTopic = {
  topic: "w7-informational",
  prefix: "wif7",
  c1: [
    { s: "Because the river flooded, many farms were destroyed.", prompt: "Tap every word of the cause.", target: "Because the river flooded,", wrong: [{ phrase: "many farms were destroyed.", mistake: "wr-structure" }] },
    { s: "Both frogs and toads are amphibians, but toads have drier skin.", prompt: "Tap the two words that signal compare and contrast.", target: ["Both", "but"] },
    { s: "The town had no clean water, so volunteers built a new well.", prompt: "Tap every word of the solution.", target: "volunteers built a new well.", wrong: [{ phrase: "The town had no clean water,", mistake: "wr-structure" }] },
  ],
  c3: [
    { prompt: "Build a cause-and-effect sentence.", answer: "Since | the bridge was closed | , | traffic | was heavy | .", spares: ["Although"], wrong: [["Although the bridge was closed, traffic was heavy.", "wr-transition"]] },
    { prompt: "Build a compare-and-contrast sentence.", answer: "Unlike | bees, | butterflies | do not sting | .", spares: ["Like"], wrong: [["Like bees, butterflies do not sting.", "wr-structure"]] },
  ],
  c5: [
    { s: "Similarly, cats are independent, dogs need constant attention.", bad: "Similarly,", mistake: "wr-transition", prompt: "This compares two things that differ. Tap the wrong signal word." },
    { s: "The plants died because we watered them, as a result.", bad: "because", mistake: "wr-transition", prompt: "One signal word confuses cause and effect. Tap it." },
  ],
  p1: [
    { line: "Laptops are portable, while desktops are not. Both can run the same programs.", q: "What text structure is this?", a: "Compare and contrast", w: ["Cause and effect", "Sequence", "Problem and solution"], m: "wr-structure" },
    { line: "The ice melted, so the sea level rose and coastal towns flooded.", q: "What text structure is this?", a: "Cause and effect", w: ["Compare and contrast", "Description", "Problem and solution"], m: "wr-structure" },
    { line: "Our school had too much plastic waste. The students set up recycling bins in every class.", q: "What text structure is this?", a: "Problem and solution", w: ["Sequence", "Compare and contrast", "Narrative"], m: "wr-structure" },
    { line: "First, the caterpillar hatches. Next, it forms a chrysalis. Finally, a butterfly emerges.", q: "What text structure is this?", a: "Sequence", w: ["Cause and effect", "Compare and contrast", "Opinion"], m: "wr-structure" },
  ],
  p5: [
    { q: "\"Informational writing should include the writer's feelings and opinions.\"", a: "No: it explains facts clearly and objectively", w: ["Yes: feelings make it informative", "Yes: opinions are facts", "No: it should tell a story"], m: "wr-fact-opinion" },
    { q: "\"Headings and subheadings help organise informational writing.\"", a: "Yes: they help the reader find information", w: ["No: they are only for stories", "No: they confuse readers", "Yes, but only in poems"], m: "wr-structure" },
  ],
  a1: [
    { q: "The purpose of informational writing is to ___", a: "explain or inform", w: ["entertain with a story", "persuade the reader", "express feelings in verse"], m: "wr-structure" },
    { q: "Which signal words show cause and effect?", a: "because, so, as a result", w: ["first, next, finally", "both, similarly, unlike", "for example, such as"], m: "wr-transition" },
  ],
  a2: [
    { q: "Fill the gap: Whales and dolphins are ___ mammals.", a: "both", w: ["unlike", "because", "finally"], m: "wr-transition" },
    { q: "Which graphic organiser best fits a compare-and-contrast essay?", a: "A Venn diagram", w: ["A timeline", "A flow chart of steps", "A story map"], m: "wr-structure" },
  ],
  a4: [
    { q: "Which sentence is best for an informational report?", a: "The Ganges is about 2,525 kilometres long.", w: ["The Ganges is the prettiest river ever.", "I think the Ganges is long.", "Everyone should love the Ganges."], m: "wr-fact-opinion" },
  ],
};

export const OPINION: SkillTopic = {
  topic: "w7-opinion",
  prefix: "wop7",
  c1: [
    { s: "Mount Everest is 8,849 metres tall, and it is the most beautiful mountain.", prompt: "Tap every word of the opinion.", target: "it is the most beautiful mountain.", wrong: [{ phrase: "Mount Everest is 8,849 metres tall,", mistake: "wr-fact-opinion" }] },
    { s: "Schools should start later because studies show teenagers need more sleep.", prompt: "Tap every word of the evidence (the reason).", target: "studies show teenagers need more sleep.", wrong: [{ phrase: "Schools should start later", mistake: "wr-evidence" }] },
    { s: "This disgusting, useless law must be scrapped at once.", prompt: "Tap the two loaded words that show bias.", target: ["disgusting,", "useless"] },
  ],
  c3: [
    { prompt: "Build a claim with a reason.", answer: "Our town needs | more parks | because | children need safe places to play | .", spares: ["although"], wrong: [["Our town needs more parks although children need safe places to play.", "wr-evidence"]] },
    { prompt: "Build a counterargument and response.", answer: "Some say | homework is stressful | ; | however, | it helps us practise | .", spares: ["therefore,"], wrong: [["Some say homework is stressful; therefore, it helps us practise.", "wr-transition"]] },
  ],
  c5: [
    { s: "Everybody knows that pizza is the healthiest food.", bad: "Everybody", mistake: "wr-evidence", prompt: "One word makes a 'bandwagon' claim with no evidence. Tap it." },
    { s: "Dear Principal, hey, we totally need a new playground!", bad: "hey,", mistake: "wr-audience", prompt: "One word is too casual for this audience. Tap it." },
  ],
  p1: [
    { line: "India has 28 states.", q: "Fact or opinion?", a: "Fact: it can be checked", w: ["Opinion: it is a belief", "Neither", "Both"], m: "wr-fact-opinion" },
    { line: "Cricket is the most exciting sport in the world.", q: "Fact or opinion?", a: "Opinion: 'most exciting' is a judgement", w: ["Fact: it can be checked", "Neither", "Both"], m: "wr-fact-opinion" },
    { line: "Studies show that reading daily improves vocabulary.", q: "What kind of support is this?", a: "Evidence from research", w: ["A personal feeling", "A bandwagon appeal", "An insult"], m: "wr-evidence" },
    { line: "Only a fool would vote against the new library.", q: "What is wrong with this argument?", a: "It attacks people instead of giving reasons", w: ["Nothing: it is strong evidence", "It uses too many facts", "It is a fact, not an opinion"], m: "wr-evidence" },
  ],
  p5: [
    { q: "\"A strong argument also answers the other side's view.\"", a: "Yes: addressing a counterargument makes it more convincing", w: ["No: ignore the other side", "No: that weakens your claim", "Yes, but only with insults"], m: "wr-evidence" },
    { q: "\"'I think' turns a fact into an opinion.\"", a: "No: a checkable fact stays a fact; 'I think' only signals a belief", w: ["Yes: always", "Yes: facts can't use 'I'", "No: it turns an opinion into a fact"], m: "wr-fact-opinion" },
  ],
  a1: [
    { q: "The purpose of persuasive writing is to ___", a: "convince the reader to agree or act", w: ["tell a story", "describe a place", "list steps in order"], m: "wr-structure" },
    { q: "Biased writing ___", a: "shows only one side and uses loaded words", w: ["gives both sides fairly", "uses only facts", "has no opinion at all"], m: "wr-evidence" },
  ],
  a2: [
    { q: "Which is the strongest evidence that a school garden helps students?", a: "Students in the garden club scored 15% higher in science.", w: ["Gardens are really nice.", "Everyone likes gardens.", "My friend said gardens are good."], m: "wr-evidence" },
    { q: "Which is a fact?", a: "Water boils at 100 °C at sea level.", w: ["Water is the best drink.", "Everyone should drink water.", "Cold water tastes better."], m: "wr-fact-opinion" },
  ],
  a4: [
    { q: "'Join the thousands of happy kids who already drink Zippy Juice!' This advert uses ___", a: "a bandwagon appeal", w: ["a fact with evidence", "an expert opinion", "a counterargument"], m: "wr-evidence" },
    { q: "'Without your donation, these puppies will go hungry tonight.' This is ___", a: "an emotional appeal", w: ["a statistic", "a counterargument", "a citation"], m: "wr-evidence" },
    { q: "In an argument organised by order of importance, the strongest reason usually comes ___", a: "last (or first), where readers remember it", w: ["hidden in the middle", "in the title only", "nowhere: leave it out"], m: "wr-structure" },
    { q: "Which opening suits a letter to a newspaper editor?", a: "Dear Editor, I am writing about the closure of the city library.", w: ["Hey Editor! Guess what?", "Yo, listen up about the library.", "Hi there, library stuff is bad lol."], m: "wr-audience" },
  ],
};

export const RESEARCH: SkillTopic = {
  topic: "w7-research",
  prefix: "wrs7",
  c1: [
    { s: "According to the World Health Organization, regular exercise lowers the risk of disease.", prompt: "Tap the words that credit the source.", target: "According to the World Health Organization,", wrong: [{ phrase: "regular exercise lowers the risk of disease.", mistake: "wr-source" }] },
    { s: "I found facts on a government website, an encyclopaedia and an anonymous blog.", prompt: "Tap every word of the least reliable source.", target: "an anonymous blog.", wrong: [{ phrase: "a government website,", mistake: "wr-source" }] },
  ],
  c3: [
    { prompt: "Put the research steps in order.", answer: "Choose a focused question. | Find reliable sources. | Take notes in your own words. | Write and cite your sources.", spares: [], wrong: [["Find reliable sources. Choose a focused question. Take notes in your own words. Write and cite your sources.", "wr-sequence"]] },
  ],
  c5: [
    { s: "I copied the paragraph word for word and did not credit the author.", bad: "not", mistake: "wr-source", prompt: "One word shows this is plagiarism. Tap it." },
  ],
  p1: [
    { line: "Original: 'Honeybees pollinate about one-third of the crops we eat.'", q: "Which is a good paraphrase?", a: "Around a third of our food crops depend on bees to pollinate them.", w: ["Honeybees pollinate about one-third of the crops we eat.", "Bees are insects.", "Honeybees pollinate crops we eat about one-third."], m: "wr-source" },
    { line: "www.nasa.gov", q: "How reliable is this source for facts about Mars?", a: "Very reliable: an expert government space agency", w: ["Unreliable: anyone can edit it", "Unreliable: it is a personal blog", "It can't be judged"], m: "wr-source" },
    { line: "A website selling vitamins says its vitamins cure every illness.", q: "Why should you doubt this source?", a: "It is biased: it wants to sell its product", w: ["It is a government site", "It gives too many sources", "It is too old"], m: "wr-source" },
  ],
  p5: [
    { q: "\"If I change a few words from a source, I don't need to credit it.\"", a: "No: you must still credit ideas you borrow", w: ["Yes: changing words makes it yours", "Yes: only quotes need credit", "No: you can't use sources at all"], m: "wr-source" },
    { q: "\"A narrow research question is easier to answer well.\"", a: "Yes: 'How do bees make honey?' beats 'Everything about insects'", w: ["No: broad questions are better", "No: questions don't matter", "Yes, but only for stories"], m: "wr-sequence" },
  ],
  a1: [
    { q: "Plagiarism is ___", a: "using someone else's words or ideas without giving credit", w: ["quoting with quotation marks and a citation", "writing your own opinion", "summarising your own notes"], m: "wr-source" },
    { q: "A primary source is ___", a: "a first-hand account, like a diary or an interview", w: ["an encyclopaedia article", "a textbook summary", "a review of a book"], m: "wr-source" },
  ],
  a2: [
    { q: "Which source is most reliable for a report on volcanoes?", a: "A geology professor's article on a university website", w: ["A comment on a video", "A friend's guess", "An advert for a holiday"], m: "wr-source" },
    { q: "What does a bibliography list?", a: "The sources used in a piece of writing", w: ["The writer's opinions", "The chapters of the report", "Difficult words"], m: "wr-source" },
  ],
  a4: [
    { q: "In an informational piece about a room, describing it from left to right is ___", a: "spatial organisation", w: ["cause-and-effect organisation", "order of importance", "chronological order"], m: "wr-structure" },
    { q: "A works cited page ___", a: "lists the sources quoted or used, in a standard format", w: ["lists the writer's opinions", "summarises each paragraph", "lists the hardest words"], m: "wr-source" },
    { q: "Which is the best focused research question?", a: "How did the 2004 tsunami affect fishing in Tamil Nadu?", w: ["What is the ocean?", "Tell me about water.", "Are tsunamis interesting?"], m: "wr-sequence" },
  ],
};
