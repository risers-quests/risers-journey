import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 10, Ozymandias (Percy Bysshe Shelley), English Rose Reader 8: the poem and its glossary (public domain). */
export const OZYMANDIAS: Chapter = {
  topic: "e8-lit-ozymandias",
  prefix: "ozy8",
  kind: "poem",
  taps: [
    { s: "I met a traveller from an antique land", prompt: "Tap whom the speaker met.", target: "a traveller" },
    { s: "Who said:—Two vast and trunkless legs of stone Stand in the desert...", prompt: "Tap what stands in the desert.", target: "Two vast and trunkless legs of stone" },
    { s: "My name is Ozymandias, king of kings:", prompt: "Tap what Ozymandias called himself.", target: "king of kings:" },
    { s: "And on the pedestal these words appear:", prompt: "Tap where the words were written.", target: "the pedestal" },
    { s: "The lone and level sands stretch far away.", prompt: "Tap what stretches far away.", target: "The lone and level sands" },
  ],
  evidence: [
    { s: "Half sunk, a shattered visage lies, whose frown, And wrinkled lip and sneer of cold command,", prompt: "Tap the words that show the king was proud and cruel.", target: "sneer of cold command," },
    { s: "Look on my works, ye mighty, and despair!", prompt: "Tap the word that shows the king boasted.", target: "despair!" },
    { s: "Nothing beside remains: round the decay Of that colossal wreck, boundless and bare,", prompt: "Tap the words that show the king's works have gone.", target: "Nothing beside remains:" },
    { s: "Half sunk, a shattered visage lies,", prompt: "Tap the word that shows the statue's face is broken.", target: "shattered" },
  ],
  orders: [
    ["The speaker meets a traveller.", "The traveller describes two legs of stone in the desert.", "He describes the broken face with its sneer.", "He reads the words on the pedestal.", "He says nothing else remains but sand."],
  ],
  wrongWord: [
    { s: "Two vast and trunkless arms of stone stand in the desert.", bad: "arms", good: "legs" },
    { s: "The statue's face wears a gentle smile.", bad: "smile.", good: "sneer" },
    { s: "Around the statue stand the ruins of a great city.", bad: "city.", good: "sand" },
    { s: "The poem 'Ozymandias' was written by Robert Southey.", bad: "Southey.", good: "Shelley" },
  ],
  rtc: [
    { line: "Tell that its sculptor well those passions read Which yet survive, stamp'd on these lifeless things,", q: "What does this tell us about the sculptor?", a: "He understood the king's proud feelings and carved them well", w: ["He disliked stone", "He was the king himself", "He never saw the king"] },
    { line: "The hand that mock'd them and the heart that fed.", q: "In this line, 'the hand' means ___", a: "the sculptor", w: ["the king", "the traveller", "the speaker"] },
    { line: "Look on my works, ye mighty, and despair!", q: "Who is supposed to 'despair'?", a: "Other mighty rulers, who could never match his works", w: ["The sculptor", "The traveller", "The desert animals"] },
    { line: "Nothing beside remains: round the decay Of that colossal wreck, boundless and bare, The lone and level sands stretch far away.", q: "What is left of Ozymandias's 'works'?", a: "Nothing but a broken statue and empty sand", w: ["A great city", "Palaces and gardens", "His army"] },
  ],
  vocab: [
    { s: "I met a traveller from an antique land", w: "antique", meaning: "ancient", wrong: ["expensive", "foreign", "beautiful"] },
    { s: "Two vast and trunkless legs of stone", w: "trunkless", meaning: "lacking a torso", wrong: ["without roots", "very tall", "without feet"] },
    { s: "Half sunk, a shattered visage lies,", w: "visage", meaning: "face", wrong: ["crown", "sword", "statue's base"] },
    { s: "And wrinkled lip and sneer of cold command,", w: "sneer", meaning: "a look of pride and disrespect", wrong: ["a kind smile", "a sad tear", "a loud shout"] },
    { s: "And on the pedestal these words appear:", w: "pedestal", meaning: "the base of a statue", wrong: ["the head of a statue", "a desert", "a book"] },
    { s: "Of that colossal wreck, boundless and bare,", w: "colossal", meaning: "huge", wrong: ["tiny", "golden", "ancient"] },
  ],
  infer: [
    { line: "My name is Ozymandias, king of kings: Look on my works, ye mighty, and despair!", q: "What is ironic about these words now?", a: "He boasted his works would last, but nothing of them remains", w: ["His works are still standing", "He was not really a king", "The words are in a foreign language"] },
    { line: "The lone and level sands stretch far away.", q: "What does this last line suggest?", a: "Time and nature outlast even the greatest rulers", w: ["The desert is a good place to live", "The traveller is lost", "The king will return"] },
    { line: "whose frown, And wrinkled lip and sneer of cold command,", q: "What kind of ruler was Ozymandias?", a: "Proud and harsh", w: ["Kind and gentle", "Shy and humble", "Poor and weak"] },
  ],
  claims: [
    { q: "Ozymandias's empire still stands in the desert.", a: "No: only a broken statue remains", w: ["Yes: his palaces remain", "Yes: his people still live there", "No: the statue was never built"] },
    { q: "The poem shows that power and pride don't last.", a: "Yes: even the 'king of kings' is reduced to ruins", w: ["No: it praises the king", "No: it is about travelling", "Yes, but only for poor people"] },
    { q: "The speaker of the poem saw the statue himself.", a: "No: a traveller from an antique land told him about it", w: ["Yes: he describes his own journey", "Yes: he is the sculptor", "No: he read about it in a book"] },
  ],
  facts: [
    { q: "Ozymandias was the Greek name of ___", a: "Ramesses II, an Egyptian king", w: ["a Greek god", "a Persian soldier", "the sculptor"] },
    { q: "The statue is found in ___", a: "the desert", w: ["a city square", "a temple", "a museum"] },
    { q: "The poem 'Ozymandias' is by ___", a: "Percy Bysshe Shelley", w: ["Robert Southey", "Sarojini Naidu", "Edgar Albert Guest"] },
    { q: "The theme label of this chapter is ___", a: "Impermanence of life", w: ["War and peace", "Gender", "Wildlife"] },
  ],
  character: [
    { q: "Which words best describe Ozymandias?", a: "Proud and boastful", w: ["Humble and kind", "Shy and gentle", "Wise and modest"] },
    { q: "How did the sculptor show his skill?", a: "He captured the king's pride and coldness in stone", w: ["He made the statue very tall", "He used gold", "He made the king look kind"] },
  ],
  theme: [
    { q: "What is the main message of 'Ozymandias'?", a: "Even the mightiest must perish with time", w: ["Kings live forever", "Deserts are dangerous", "Statues are valuable"] },
    { q: "What is the irony in the poem?", a: "The boast 'Look on my works…' stands over nothing but sand", w: ["The traveller is a king", "The statue is made of sand", "The poem has no irony"] },
  ],
};
export const OZYMANDIAS_TEMPLATES = chapterTemplates(OZYMANDIAS);
export const verify = () => verifyChapter(OZYMANDIAS);
