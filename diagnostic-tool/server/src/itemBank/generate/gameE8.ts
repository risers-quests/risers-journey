import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 11, The Game (Munshi Premchand, tr. Payal Agarwal), English Rose Reader 8. Translation in copyright: short extracts only. */
export const GAME: Chapter = {
  topic: "e8-lit-game",
  prefix: "gam8",
  kind: "story",
  taps: [
    { s: "Sitting in the shadow of the neem tree in front of the hut, an old lady, despite her less than perfect eyesight, was weaving a basket.", prompt: "Tap what the old lady was doing.", target: "weaving a basket." },
    { s: "Miffed, Fundan replied, 'Mother has already left to plough the field. I am scared alone in the house.'", prompt: "Tap where Fundan's mother had gone.", target: "to plough the field." },
    { s: "Jatin had promised to get raw gari and imarti.", prompt: "Tap the two things Jatin had promised to bring.", target: ["raw gari", "imarti."] },
    { s: "By chance, at that moment Genda joined him. He was the village dog.", prompt: "Tap the name of the village dog.", target: "Genda" },
    { s: "Suddenly his eyes fell on a broken jhabba—a cane basket—on the ground.", prompt: "Tap what Fundan found on the ground.", target: "a broken jhabba" },
  ],
  evidence: [
    { s: "Instead of money for his goods, he would be paid in grain, somewhat higher than the cost of his fare.", prompt: "Tap the words that show how Jatin was paid.", target: "paid in grain," },
    { s: "No amount of crying, begging, entreating or flattering could grant his wish.", prompt: "Tap the four things Fundan tried to get sweets.", target: ["crying,", "begging,", "entreating", "flattering"] },
    { s: "Disheartened, he squatted on the road. Tears fell unfettered at the dashed hopes.", prompt: "Tap the word that shows Fundan had lost hope.", target: "Disheartened," },
    { s: "He danced rather than walked, his head held high in pride.", prompt: "Tap the words that show Fundan's joy as 'Jatin'.", target: ["danced", "head held high"] },
    { s: "Jatin placed a few stones on a leaf and gave it to him. Sweets never tasted as good or as delicious.", prompt: "Tap the words that show how much the children enjoyed the game.", target: "never tasted as good" },
  ],
  orders: [
    ["Fundan slips out while the other boys sleep.", "He waits for Jatin at the edge of the village.", "Genda the dog joins him on the kaccha road.", "He cries when Jatin doesn't come.", "He fills a basket with stones and becomes 'Jatin'."],
    ["Fundan finds a broken cane basket.", "He fills it with gravel, stones and leaves.", "He walks into the village calling out like Jatin.", "The boys 'buy' stone sweets with pebbles."],
  ],
  wrongWord: [
    { s: "Jatin was a farmer from a nearby village.", bad: "farmer", good: "hawker" },
    { s: "Fundan was accompanied by Gunda, the village bully.", bad: "Gunda,", good: "Genda" },
    { s: "The village boys thought Fundan's idea was dull.", bad: "dull.", good: "brilliant" },
    { s: "Jatin was paid in money for his sweets.", bad: "money", good: "grain" },
    { s: "Fundan filled the basket with sweets.", bad: "sweets.", good: "stones" },
  ],
  rtc: [
    { line: "'Where are you off to, Fundan? Go inside and sleep, it's very hot outside.'", q: "Who says this?", a: "The old lady, the village grandmother", w: ["Fundan's mother", "Jatin", "Munnu"] },
    { line: "In truth, his arrival was more an occasion for despair than happiness, but the children were always excited to welcome the event anew.", q: "Whose arrival is meant?", a: "Jatin's", w: ["Genda's", "Fundan's mother's", "The old lady's"] },
    { line: "In truth, his arrival was more an occasion for despair than happiness,", q: "Why was it 'more an occasion for despair'?", a: "Most children, like Fundan, could only look at the sweets, not buy them", w: ["Jatin was rude to them", "His sweets were stale", "He came too late at night"] },
    { line: "Would he have felt as happy leading Jatin to the village as he felt in this moment when he himself was Jatin?", q: "How did Fundan 'become Jatin'?", a: "He carried a basket of stones on his head and called out like him", w: ["He bought Jatin's basket", "He put on Jatin's clothes", "He took Jatin's place in the village"] },
    { line: "'Jatin, I'll give you an anna for the sweets.'", q: "What did Munnu really give?", a: "A pebble", w: ["A real anna", "A handful of grain", "A sweet"] },
  ],
  vocab: [
    { s: "Miffed, Fundan replied, 'Mother has already left to plough the field.'", w: "Miffed", meaning: "a little angry", wrong: ["very happy", "sleepy", "frightened"] },
    { s: "The old lady was the designated grandmother of the village children,", w: "designated", meaning: "assigned", wrong: ["real", "eldest", "youngest"] },
    { s: "whose job was to curtail their freedom", w: "curtail", meaning: "limit", wrong: ["increase", "celebrate", "ignore"] },
    { s: "To the children it seemed like manna from heaven", w: "manna", meaning: "a gift or blessing", wrong: ["a punishment", "a game", "a cloud"] },
    { s: "peer at the delicacies sitting like a coy princess.", w: "coy", meaning: "shy", wrong: ["proud", "angry", "loud"] },
    { s: "Jatin's arrival created a great commotion", w: "commotion", meaning: "noise", wrong: ["silence", "fear", "sadness"] },
    { s: "Despite the gloom of dejection and failure,", w: "dejection", meaning: "disappointment and sadness", wrong: ["joy", "anger", "hunger"] },
    { s: "He was flying—believing the mirage real, the false true.", w: "mirage", meaning: "illusion", wrong: ["truth", "desert", "dream come true"] },
  ],
  infer: [
    { line: "But with the experience of her eighty long years, the old woman could see through all their tricks and schemes, and nip them in the bud.", q: "Why was the old lady called the village grandmother?", a: "She was given the job of watching all the village children", w: ["She was everyone's real grandmother", "She sold sweets", "She owned the pond"] },
    { line: "The villagers' measure inclined towards generosity. So, he would walk four to five miles from the neighbouring village to ply his fare.", q: "Why was it profitable for Jatin to come?", a: "The villagers paid him generously in grain", w: ["The road was short", "He lived next door", "He was paid in gold"] },
    { line: "This game was much more fun. Rationality lacks romance, pleasure and the feeling of weightlessness.", q: "What does the author mean?", a: "Pretending and imagining gave a joy that sensible thinking can't", w: ["Games should always be sensible", "Stones taste like sweets", "The children were foolish"] },
    { line: "But one heart understood another.", q: "What does this mean?", a: "The other boys understood Fundan's longing and joined his game", w: ["They laughed at Fundan", "Fundan understood Jatin", "Genda understood Fundan"] },
  ],
  claims: [
    { q: "Fundan's friends refused to accept his new role.", a: "No: they ran to him and joined the game", w: ["Yes: they laughed at him", "Yes: they told the old lady", "No: they were all asleep"] },
    { q: "Fundan turned a disappointing situation into a happy one.", a: "Yes: when Jatin didn't come, he invented a game", w: ["No: he stayed sad all day", "No: Jatin came after all", "Yes, by buying sweets"] },
    { q: "The story's title fits.", a: "Yes: Fundan's pretend game is at its heart", w: ["No: there is no game", "No: it should be called 'The Dog'", "Yes, because it is about cricket"] },
  ],
  facts: [
    { q: "Since it was almost ___, the shadows of the trees had shortened.", a: "midday (noon)", w: ["dusk", "morning", "midnight"] },
    { q: "Jatin was a ___ from a nearby village.", a: "hawker", w: ["farmer", "potter", "teacher"] },
    { q: "Fundan wanted to ___", a: "surprise his friends by leading Jatin into the village", w: ["make his friends jealous", "stop Jatin entering the village", "buy all the sweets"] },
    { q: "Fundan was accompanied by ___", a: "Genda, the village dog", w: ["Gunda, the village bully", "Ganga, the village chief", "his mother"] },
    { q: "The village boys thought Fundan's idea was ___", a: "brilliant", w: ["dull", "mad", "dangerous"] },
    { q: "'The Game' was written by ___", a: "Munshi Premchand", w: ["Sudha Murty", "Saki", "Rabindranath Tagore"] },
  ],
  character: [
    { q: "Which words best describe Fundan?", a: "Imaginative and hopeful", w: ["Greedy and selfish", "Lazy and dull", "Cruel and rude"] },
    { q: "Which emotions does Fundan feel at dusk?", a: "Disappointment and anger at Jatin", w: ["Jealousy and pride", "Boredom", "Fear of the dog"] },
  ],
  theme: [
    { q: "What is the main message of 'The Game'?", a: "Imagination can turn disappointment into joy", w: ["Hawkers are cruel", "Children should sleep in the afternoon", "Sweets are bad for you"] },
    { q: "What kind of literary genre is 'The Game'?", a: "A short story", w: ["A fable", "An epic", "A biography"] },
  ],
};
export const GAME_TEMPLATES = chapterTemplates(GAME);
export const verify = () => verifyChapter(GAME);
