import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 5, Dusk (adapted from Saki), English Rose Reader 8: the story, its glossary and questions. */
const PAIR = ["a. is correct, but b. is false.", "b. is correct, but a. is false.", "Both a. and b. are correct.", "Both a. and b. are false."] as const;
const pair = (a: string, b: string, right: 0 | 1 | 2 | 3) => ({ q: `a. ${a} b. ${b} Which is true?`, a: PAIR[right], w: PAIR.filter((_, k) => k !== right) as unknown as [string, string, string] });

export const DUSK: Chapter = {
  topic: "e8-lit-dusk",
  prefix: "dsk8",
  kind: "story",
  taps: [
    { s: "Norman Gortsby sat on a bench in Hyde Park. It was some thirty minutes past six on an early March evening.", prompt: "Tap where Gortsby was sitting.", target: "Hyde Park" },
    { s: "'Came up this afternoon, meaning to stay at the Patagonian Hotel in Berkshire Square,' continued the young man.", prompt: "Tap the name of the hotel the young man meant to stay at.", target: "the Patagonian Hotel" },
    { s: "I just sent a letter to my people, giving them the address, and then I went out to buy some soap.", prompt: "Tap what the young man said he went out to buy.", target: "some soap" },
    { s: "Lying on the ground by the side of the bench was a small oval packet, wrapped and sealed.", prompt: "Tap the words that describe what Gortsby found.", target: "a small oval packet, wrapped and sealed" },
    { s: "'If the loan of a sovereign is any good to you—'", prompt: "Tap the coin Gortsby offered to lend.", target: "a sovereign" },
    { s: "'Have you lost anything, sir?' he asked. 'Yes, sir, a cake of soap.'", prompt: "Tap what the elderly gentleman had lost.", target: "a cake of soap" },
  ],
  evidence: [
    { s: "Gortsby was in the mood to count himself among the defeated.", prompt: "Tap the words that show Gortsby was in a low mood.", target: "count himself among the defeated" },
    { s: "The young man turned to him with a look of disarming frankness which put him instantly on his guard.", prompt: "Tap the words that show Gortsby became suspicious.", target: "on his guard" },
    { s: "'Of course,' said Gortsby slowly, 'the weak point of your story is that you can't produce the soap.'", prompt: "Tap the words that show why Gortsby doubted the story.", target: "you can't produce the soap" },
    { s: "The young man hastily removed all doubt on the subject by pocketing the coin.", prompt: "Tap the word that shows the young man took the money quickly.", target: "hastily" },
    { s: "'It's a lesson to me not to be too clever in judging by circumstances.'", prompt: "Tap the words that show the lesson Gortsby thought he had learnt.", target: "not to be too clever in judging by circumstances" },
  ],
  orders: [
    ["An elderly gentleman leaves the bench.", "A young man sits down and tells his story.", "Gortsby says the story has no soap.", "The young man leaves angrily."],
    ["Gortsby finds a cake of soap by the bench.", "He hurries after the young man.", "He lends the young man a sovereign.", "He sees the elderly gentleman searching under the bench."],
    ["The young man forgets the name of his hotel.", "He spends his shilling on soap.", "He sits by Gortsby with two-pence in his pocket.", "He asks for a loan through his story."],
  ],
  wrongWord: [
    { s: "Norman Gortsby sat on a bench in Hyde Park at dawn.", bad: "dawn", good: "dusk" },
    { s: "The young man said he had gone out to buy some bread.", bad: "bread", good: "soap" },
    { s: "Gortsby lent the young man a shilling.", bad: "shilling", good: "sovereign" },
    { s: "The cake of soap really belonged to the young man.", bad: "young", good: "elderly" },
    { s: "The young man fled in the direction of Piccadilly.", bad: "Piccadilly", good: "Knightsbridge" },
  ],
  rtc: [
    { line: "'You wouldn't be in a good temper if you were in the fix I'm in,' he said; 'I've done the silliest thing I've ever done in my life.'", q: "What does 'fix' mean here?", a: "A difficult situation", w: ["A repair", "A meal", "A promise"] },
    { line: "'You wouldn't be in a good temper if you were in the fix I'm in,' he said; 'I've done the silliest thing I've ever done in my life.'", q: "What was the 'silliest thing' he said he had done?", a: "Forgotten the name and street of his hotel", w: ["Lost his overcoat", "Missed his train", "Spent all his money on a sovereign"] },
    { line: "'Not at all impossible,' said Gortsby judicially; 'I remember doing exactly the same thing once in a foreign capital.'", q: "What did Gortsby say had happened to him once?", a: "He had also lost his way to his hotel", w: ["He had lost a cake of soap", "He had been robbed in a park", "He had lent money to a stranger"] },
    { line: "'The important witness to the genuineness of your story has turned up,' said Gortsby, holding out the cake of soap.", q: "Who or what is the 'important witness'?", a: "The cake of soap", w: ["The elderly gentleman", "The hotel manager", "A policeman"] },
    { line: "'Here is my card with my address,' continued Gortsby; 'any day this week will do for returning the money.'", q: "Why did Gortsby give his card?", a: "So the young man could return the money", w: ["To invite him to dinner", "To report him to the police", "To show he was rich"] },
    { line: "The scene pleased Gortsby and harmonised with his present mood. Dusk, to his mind, was the hour of the defeated.", q: "Why did Gortsby feel dusk was 'the hour of the defeated'?", a: "At dusk, people who had failed could come out without being recognised", w: ["Everyone was tired after work", "The park closed at dusk", "It was too dark to read"] },
  ],
  vocab: [
    { s: "Dusk had fallen heavily over the scene, mitigated by some faint moonlight and many streetlamps.", w: "mitigated", meaning: "reduced in severity", wrong: ["made worse", "hidden", "decorated"] },
    { s: "Men and women came forth in this hour of gloaming,", w: "gloaming", meaning: "dusk", wrong: ["dawn", "midnight", "midday"] },
    { s: "On the bench by his side sat a shabby, elderly gentleman with a drooping air of defiance that was probably the remaining vestige of self-respect.", w: "vestige", meaning: "a small remaining part of something that is disappearing", wrong: ["a large amount", "a new beginning", "a loud voice"] },
    { s: "Gortsby imagined him returning to some bleak lodging.", w: "bleak", meaning: "cold and miserable", wrong: ["bright and cosy", "large and grand", "noisy and busy"] },
    { s: "'I suppose you think I've spun you rather an impossible yarn,' said the young man.", w: "yarn", meaning: "a story, especially one which might not be true", wrong: ["a ball of wool", "a promise", "a joke"] },
    { s: "The youth brightened at the reminiscence.", w: "reminiscence", meaning: "a story about a past event", wrong: ["a gift", "a warning", "a dream"] },
    { s: "Here in one's own land, one is far more derelict if one gets into a fix.", w: "derelict", meaning: "abandoned", wrong: ["lucky", "comfortable", "famous"] },
    { s: "If he had had the brilliant forethought to provide himself with a cake of soap, he would have been a genius in his particular line.", w: "forethought", meaning: "careful thought about what could happen in the future", wrong: ["a sudden fear", "a bad memory", "a lucky chance"] },
    { s: "He caught sight of the object of his pursuit standing irresolutely on the border of the carriage drive.", w: "irresolutely", meaning: "uncertainly", wrong: ["proudly", "angrily", "happily"] },
    { s: "Poor boy, his quandary must have been acute.", w: "quandary", meaning: "a dilemma about a difficult situation", wrong: ["a celebration", "a long walk", "a rich uncle"] },
  ],
  infer: [
    { line: "'I suppose you think I've spun you rather an impossible yarn,' said the young man presently, with a suggestion of resentment in his voice.", q: "Why was there 'a suggestion of resentment' in his voice?", a: "He was pretending to be hurt so Gortsby would feel bad for doubting him", w: ["He was angry with the hotel", "He was tired of the cold", "He had really lost his soap"] },
    { line: "'Lucky thing, your finding it,' said the youth, and then, with a catch in his voice, he blurted out a word or two of thanks and fled headlong.", q: "Why did the young man flee so quickly?", a: "He knew the soap wasn't his and wanted to get away with the money", w: ["He was late for his hotel", "He was ashamed of crying", "He wanted to return the money at once"] },
    { line: "As Gortsby retraced his steps past the seat, he saw an elderly gentleman poking and peering beneath it.", q: "What does Gortsby realise when he sees this?", a: "The soap belonged to the old man; the young man had tricked him", w: ["The old man had stolen the soap", "The young man was honest after all", "The old man wanted a loan too"] },
    { line: "'It was a pity,' mused Gortsby; 'the going out to get one's own soap was the one convincing touch in the whole story.'", q: "What did Gortsby think at this point?", a: "The young man was a clever liar who forgot one detail", w: ["The young man's story was completely true", "Soap is very expensive in London", "He should give the young man more money"] },
    { line: "'It's a lesson to me not to be too clever in judging by circumstances.'", q: "What is the irony of this line?", a: "Gortsby had been right at first, and was fooled only when he thought he'd learnt this lesson", w: ["Gortsby was never fooled", "The young man was a policeman", "The lesson was about soap prices"] },
  ],
  claims: [
    { q: "Gortsby believed the young man's story from the start.", a: "No: he doubted it because there was no soap", w: ["Yes: he trusted everyone", "Yes: he had done the same thing", "No: he never believed it, even at the end"] },
    { q: "The young man was a con man who tricked Gortsby.", a: "Yes: his story was false, and the soap belonged to the old man", w: ["No: he really had lost his hotel", "No: he returned the money the next day", "Yes, but the old man helped him"] },
    { q: "Dusk plays an important part in the story.", a: "Yes: in the dim light people's real natures are hidden", w: ["No: the story could happen at any time", "No: it only tells us the weather", "Yes: it makes the park close"] },
    { q: "Gortsby lost a sovereign because he was too kind.", a: "Yes, partly: he trusted the 'evidence' of the soap too quickly", w: ["No: he got his money back", "No: he never gave any money", "Yes: he gave the old man a sovereign"] },
  ],
  facts: [
    pair("Dusk is a time when people can go unrecognised by others.", "The time of the day was the reason why the young man succeeded in fooling Gortsby.", 0),
    pair("Gortsby was in a generous mood as he sat on the bench in Hyde Park.", "Gortsby decided to search for the young man to help him.", 1),
    pair("The young man said he had dropped the soap from the pocket of his overcoat.", "Gortsby found a cake of soap lying on the ground near the spot where the young man had been sitting.", 1),
    pair("The old man was looking for his lost pocket watch on the ground.", "Gortsby found what the old man was looking for and returned it to him.", 3),
    { q: "The story 'Dusk' was written by ___", a: "Saki (Hector Hugh Munro)", w: ["Cynthia Asquith", "Charles Dickens", "O. Henry"] },
    { q: "The young man said he had only ___ left in his pocket", a: "two-pence", w: ["a sovereign", "a shilling", "half a crown"] },
    { q: "Gortsby thought the old man went home to ___", a: "a bleak lodging where his weekly bill was all anyone cared about", w: ["a grand house in Berkshire Square", "the Patagonian Hotel", "his daughter's home"] },
  ],
  character: [
    { q: "Which words best describe Gortsby?", a: "Thoughtful and kind, but too sure of his own judgement", w: ["Cruel and mean", "Foolish and careless all the time", "Rich and boastful"] },
    { q: "Which words best describe the young man?", a: "A clever, smooth-talking cheat", w: ["An honest man in trouble", "A shy, nervous boy", "A rich tourist"] },
    { q: "What mood was Gortsby in at the start?", a: "Sad and disillusioned", w: ["Excited and hopeful", "Angry and enraged", "Carefree and cheerful"] },
  ],
  theme: [
    { q: "What is the main message of 'Dusk'?", a: "Appearances can deceive, so don't judge too quickly", w: ["Always carry soap", "Never sit in parks at night", "Hotels in London are hard to find"] },
    { q: "What is special about the ending of 'Dusk'?", a: "A surprise twist: the soap belonged to the old man", w: ["Gortsby gets his money back", "The young man becomes Gortsby's friend", "The story ends at dawn"] },
    { q: "Why is the story called 'Dusk'?", a: "At dusk, people's true natures are hidden, just like the young man's", w: ["It is a story about the weather", "Gortsby's name means dusk", "The park is called Dusk"] },
  ],
};
export const DUSK_TEMPLATES = chapterTemplates(DUSK);
export const verify = () => verifyChapter(DUSK);
