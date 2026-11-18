import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/**
 * Chapter 3, The Corner Shop (adapted from Cynthia Asquith), English Rose
 * Reader 8. Built from the reader's text, glossary and questions
 * (Reading comprehension A–C).
 */
const PAIR = ["a. is correct, but b. is false.", "b. is correct, but a. is false.", "Both a. and b. are correct.", "Both a. and b. are false."] as const;
const pair = (a: string, b: string, right: 0 | 1 | 2 | 3) => ({
  q: `a. ${a} b. ${b} Which is true?`,
  a: PAIR[right],
  w: PAIR.filter((_, k) => k !== right) as unknown as [string, string, string],
});

export const CORNER_SHOP: Chapter = {
  topic: "e8-lit-corner-shop",
  prefix: "csh8",
  kind: "story",
  taps: [
    { s: "A cheerful jingle-jangle from the bell welcomed me into a large, cluttered space filled with the traditional treasure and trash of a curiosity shop—cracked mirrors, brass kettles, large clocks and mismatched furniture.", prompt: "Tap the four kinds of things the narrator saw in the shop.", target: ["cracked mirrors", "brass kettles", "large clocks", "mismatched furniture"] },
    { s: "I decided to revisit it but was disappointed to see the notice: CLOSED.", prompt: "Tap the word on the notice the narrator saw.", target: "CLOSED" },
    { s: "'Half a crown, sir,' whispered the old man, glancing up at my face.", prompt: "Tap the price the old man asked for the frog.", target: "Half a crown" },
    { s: "He offered to auction the frog for me and two days later, returned triumphantly with a cheque for £1,800.", prompt: "Tap how much the frog was sold for.", target: "£1,800" },
    { s: "The darkness of the large room was thinned only by two guttering candles.", prompt: "Tap what lit the shop on the second visit.", target: "two guttering candles" },
    { s: "'Poor old Holmes is dead. When he got home yesterday, he complained of pain, and died in the middle of the night—heart failure.'", prompt: "Tap what Holmes complained of when he got home.", target: "pain" },
  ],
  evidence: [
    { s: "I now saw him comparatively distinctly. Never before had I seen such ineffable, patient weariness!", prompt: "Tap the words that show how tired the old man looked.", target: "ineffable, patient weariness" },
    { s: "His voice had little more body than the tearing of a cobweb; but there was a curious, almost pleading insistence in it.", prompt: "Tap the words that show the old man badly wanted the narrator to buy something.", target: "pleading insistence" },
    { s: "As I gave the old man the coin, I inadvertently touched his hand. I could scarcely suppress a start.", prompt: "Tap the words that show the touch gave the narrator a shock.", target: "suppress a start" },
    { s: "I decided that the first thing I must do is share my fortune with the corner shop girls. Otherwise, I should feel I had almost robbed them.", prompt: "Tap the words that show the narrator was honest.", target: "share my fortune" },
    { s: "The darkness of the large room was thinned only by two guttering candles, and dark shapes of furniture now loomed towering and mysterious, casting menacing shadows.", prompt: "Tap the words that make the shop feel frightening.", target: "menacing shadows" },
    { s: "'After all, most dealers wouldn't, would they?' she asked defensively.", prompt: "Tap the word that shows Miss Wilson felt she had to protect her father's name.", target: "defensively" },
  ],
  orders: [
    ["The narrator visits the brightly lit corner shop and meets two sisters.", "A week later he finds the shop CLOSED, but an old man lets him in.", "He buys a strange, cold jade frog for half a crown.", "His friend sells the frog at auction for £1,800."],
    ["The narrator goes back to the shop to pay a proper price.", "The old man smiles wonderfully and leaves.", "Miss Wilson hears on the telephone that Holmes is dead.", "The sisters accept the money for charity."],
    ["The narrator sees the old man's photograph in an album.", "Miss Wilson says it is her father.", "She explains how her father wanted to make up for his three 'crimes'.", "She reveals that her father died years ago."],
  ],
  wrongWord: [
    { s: "The narrator bought a strange little jade elephant from the old man.", bad: "elephant", good: "frog" },
    { s: "The jade figurine came from the Ming Dynasty.", bad: "Ming", good: "Hsia" },
    { s: "On his second visit, the shop was brightly lit and warm.", bad: "brightly", good: "dimly" },
    { s: "The sisters spent the narrator's money on a new shop.", bad: "shop", good: "charities" },
    { s: "Miss Wilson's father had made his fortune on five marvellous purchases.", bad: "five", good: "three" },
    { s: "Bessie and Miss Wilson were twin sisters.", bad: "twin", good: "step-" },
  ],
  rtc: [
    { line: "His voice had little more body than the tearing of a cobweb; but there was a curious, almost pleading insistence in it.", q: "Who is 'he' in this line?", a: "The old man in the shop", w: ["The narrator's school friend", "Holmes's son", "The fine arts dealer"] },
    { line: "His voice had little more body than the tearing of a cobweb; but there was a curious, almost pleading insistence in it.", q: "What had he been saying in this pleading voice?", a: "'Anything I can show you, sir?'", w: ["'Half a crown, sir.'", "'Please come back tomorrow.'", "'The shop is closed, sir.'"] },
    { line: "'After all, most dealers wouldn't, would they?' she asked defensively.", q: "Who is 'she' in this line?", a: "Miss Wilson, the elder sister", w: ["Bessie, the younger sister", "Mrs Holmes", "The narrator's mother"] },
    { line: "'After all, most dealers wouldn't, would they?' she asked defensively.", q: "What wouldn't most dealers do, according to her?", a: "Tell sellers that their cheap objects were really valuable", w: ["Sell things at night", "Buy old furniture", "Give money to charity"] },
    { line: "'Oh, Bessie,' she said to her sister. 'Poor old Holmes is dead.'", q: "Who was Holmes?", a: "The old caretaker of the shop", w: ["The sisters' father", "The narrator's friend", "A fine arts dealer"] },
    { line: "'Oh!' she exclaimed. 'You mean Bessie's father! But Bessie and I are step-sisters. My poor father died years ago.'", q: "Who was the old man who sold the frog?", a: "Miss Wilson's father, who had died years ago", w: ["Holmes, the caretaker", "Bessie's father", "The narrator's school friend"] },
    { line: "'Quaint piece, this,' said my guide, picking up a grotesque little frog that lay on a shelf.", q: "Who is 'my guide'?", a: "The old man", w: ["Miss Wilson", "The narrator's friend", "Bessie"] },
  ],
  vocab: [
    { s: "'Please come in, sir,' said a gentle, rather tremulous voice, and feeble footsteps shuffled away ahead of me.", w: "tremulous", meaning: "gently shaking", wrong: ["loud and clear", "angry", "cheerful"] },
    { s: "'Please come in, sir,' said a gentle, rather tremulous voice, and feeble footsteps shuffled away ahead of me.", w: "feeble", meaning: "weak", wrong: ["heavy", "quick", "noisy"] },
    { s: "The mere proximity of the poor old man distressed me.", w: "proximity", meaning: "closeness", wrong: ["voice", "smell", "anger"] },
    { s: "'Quaint piece, this,' said my guide, picking up a grotesque little frog that lay on a shelf.", w: "grotesque", meaning: "very ugly", wrong: ["very valuable", "very small", "very shiny"] },
    { s: "As I gave the old man the coin, I inadvertently touched his hand.", w: "inadvertently", meaning: "accidentally", wrong: ["on purpose", "gently", "angrily"] },
    { s: "Spotting my purchase, he proclaimed it to be a rare jade figurine of great value.", w: "figurine", meaning: "small statue", wrong: ["painting", "coin", "necklace"] },
    { s: "He reproached himself bitterly for having taken advantage of those three men's ignorance.", w: "reproached", meaning: "expressed disapproval", wrong: ["praised", "forgave", "forgot"] },
    { s: "In each case he discovered that all three of his victims had died destitute.", w: "destitute", meaning: "extremely poor", wrong: ["very rich", "very old", "very happy"] },
    { s: "My father had a flair for this business and made quite a large fortune.", w: "flair", meaning: "talent", wrong: ["dislike", "debt", "fear"] },
    { s: "For what motive had he concealed his sale of the jade frog?", w: "concealed", meaning: "hid", wrong: ["shouted about", "repeated", "regretted"] },
  ],
  infer: [
    { line: "'Half a crown, sir,' whispered the old man, glancing up at my face. There was a strange gleam in his eyes.", q: "Why was there a 'strange gleam' in the old man's eyes?", a: "He hoped the narrator would be the honest buyer he was waiting for", w: ["He was planning to cheat the narrator", "The candlelight was shining in them", "He was about to cry with tiredness"] },
    { line: "As I spoke, there spread over the old man's face the most wonderful smile.", q: "Why did the old man smile so wonderfully?", a: "The narrator's honesty helped cancel out one of his 'crimes'", w: ["He was glad to get more money", "He was happy the shop was closing", "He liked the narrator's coat"] },
    { line: "I felt a thrill of excitement at the prospect of meeting the remarkable old man again.", q: "Why was this meeting never going to happen?", a: "The old man was a ghost: he had died years before", w: ["The old man had moved away", "The narrator forgot to go", "The sisters sent him away"] },
    { line: "'The next best thing to doing a good deed yourself,' he would say, 'is to provide someone else with the opportunity.'", q: "What was the father's plan?", a: "To sell valuable things cheaply and see if the buyers would be honest", w: ["To buy cheap things and sell them for a lot", "To give all his money to his daughters", "To close the shop for ever"] },
    { line: "Here she began to weep and murmured, 'If only you had come sooner!'", q: "Why did Miss Wilson wish he had come sooner?", a: "Her father died before finding his third honest buyer", w: ["The shop was about to close", "She wanted to sell him more antiques", "The cheque had come too late"] },
    { line: "I decided that the first thing I must do is share my fortune with the corner shop girls. Otherwise, I should feel I had almost robbed them.", q: "What does this show about the narrator?", a: "He was honest and fair, even when he didn't have to be", w: ["He was greedy for more antiques", "He was afraid of the police", "He felt sorry for himself"] },
  ],
  claims: [
    { q: "The old man who sold the frog was Holmes, the caretaker.", a: "No: he was Miss Wilson's father, who had died years before", w: ["Yes: the sisters said so", "Yes: Holmes died that night", "No: he was Bessie's father"] },
    { q: "The sisters were eager to take the narrator's money.", a: "No: they were unwilling, and took it only for charity", w: ["Yes: they needed the money", "Yes: they asked for more", "No: they took it for a new shop"] },
    { q: "The author builds suspense with darkness, a cold touch and a strange old man.", a: "Yes: these make us feel something mysterious is happening", w: ["No: the story is funny all through", "No: there is no mystery until the last word", "Yes, but only in the first paragraph"] },
    { q: "The narrator went back to the shop to buy more cheap antiques.", a: "No: he went back to pay a proper price for the frog", w: ["Yes: he hoped for another bargain", "Yes: he wanted to meet the sisters", "No: he went back to return the frog"] },
  ],
  facts: [
    pair("The narrator felt that the atmosphere had turned gloomy and threatening on his second visit.", "The atmosphere was creepy because it was very dark in the shop, with only one or two lit candles.", 2),
    pair("After the incident with the jade frog, the narrator was unsurprised to see the shop closed.", "He went after opening hours hoping to meet the old man instead of the sisters.", 0),
    pair("The sisters were eager to take money from the narrator.", "The sisters had a flair for the business, so they were already quite wealthy.", 3),
    pair("The narrator visited the shop often after the incident with the jade frog.", "This was because he did good business with the sisters.", 0),
    { q: "The narrator bought the jade frog for ___", a: "half a crown", w: ["£1,800", "£600", "five shillings"] },
    { q: "The narrator's friend worked for ___", a: "a well-known fine arts dealer", w: ["the corner shop", "a bank", "a newspaper"] },
    { q: "The first time, the corner shop was ___", a: "brightly lit and pleasantly warm", w: ["dark and cold", "closed", "empty"] },
    { q: "Miss Wilson's father had made his fortune by ___", a: "buying cheap things of great value without telling the sellers", w: ["selling jade frogs", "working as a caretaker", "winning at auctions"] },
  ],
  character: [
    { q: "Which words best describe the narrator?", a: "Honest and fair", w: ["Greedy and sly", "Rude and impatient", "Lazy and careless"] },
    { q: "How did Miss Wilson's father change?", a: "From a dealer who took advantage of people to a man desperate to make amends", w: ["From a poor man to a rich one", "From a kind man to a cruel one", "He never changed"] },
    { q: "How did the old man make the narrator feel at first?", a: "Uneasy and sorry for him, but drawn to follow him", w: ["Happy and relaxed", "Angry and impatient", "Bored"] },
  ],
  theme: [
    { q: "What is the main message of 'The Corner Shop'?", a: "Honesty matters, and wrongs we do can weigh on us until we put them right", w: ["Antiques are always valuable", "Never go into shops at night", "Old people are frightening"] },
    { q: "What kind of story is 'The Corner Shop'?", a: "A ghost story with a mystery and a twist at the end", w: ["A funny story about shopping", "A true history of the Hsia Dynasty", "An adventure at sea"] },
    { q: "Why does the story end with 'My poor father died years ago'?", a: "It reveals the twist: the old man was a ghost", w: ["To show the sisters were sad", "To explain why the shop was closed", "To show the narrator was lying"] },
  ],
};

export const CORNER_SHOP_TEMPLATES = chapterTemplates(CORNER_SHOP);
export const verify = () => verifyChapter(CORNER_SHOP);
