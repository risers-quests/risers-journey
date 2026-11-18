import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 13, Macavity, the Mystery Cat (T. S. Eliot), English Rose Reader 8. In copyright: short extracts only. */
export const MACAVITY: Chapter = {
  topic: "e8-lit-macavity",
  prefix: "mac8",
  kind: "poem",
  taps: [
    { s: "Macavity's a Mystery Cat: he's called the Hidden Paw—", prompt: "Tap Macavity's other name in this line.", target: "the Hidden Paw—" },
    { s: "Macavity's a ginger cat, he's very tall and thin;", prompt: "Tap the words that describe how Macavity looks.", target: ["ginger", "very tall and thin;"] },
    { s: "He sways his head from side to side, with movements like a snake;", prompt: "Tap what Macavity's movements are compared to.", target: "a snake;" },
    { s: "He always has an alibi, and one or two to spare:", prompt: "Tap what Macavity always has.", target: "an alibi," },
    { s: "Just controls their operations: the Napoleon of Crime!", prompt: "Tap the title Macavity is given here.", target: "the Napoleon of Crime!" },
  ],
  evidence: [
    { s: "And when you think he's half asleep, he's always wide awake.", prompt: "Tap the words that show Macavity is always alert.", target: "always wide awake." },
    { s: "He's outwardly respectable. (They say he cheats at cards.)", prompt: "Tap the words that show he only looks respectable.", target: "cheats at cards.)" },
    { s: "His powers of levitation would make a fakir stare,", prompt: "Tap the special power Macavity has.", target: "levitation" },
    { s: "And his footprints are not found in any file of Scotland Yard's.", prompt: "Tap the words that show the police have no evidence against him.", target: "footprints are not found" },
  ],
  orders: [
    ["A crime is discovered.", "The police reach the scene of crime.", "They find that Macavity's not there.", "The Secret Service say it must have been Macavity."],
  ],
  wrongWord: [
    { s: "Macavity is a black cat, very tall and thin.", bad: "black", good: "ginger" },
    { s: "Macavity's movements are like those of a mouse.", bad: "mouse.", good: "snake" },
    { s: "Macavity never has an alibi.", bad: "never", good: "always" },
    { s: "Macavity is called the Napoleon of Music.", bad: "Music.", good: "Crime" },
  ],
  rtc: [
    { line: "He's the bafflement of Scotland Yard, the Flying Squad's despair:", q: "Why are the police baffled?", a: "Whenever they reach a crime scene, Macavity's not there", w: ["Macavity helps them solve crimes", "Macavity is too big to catch", "They don't know any crimes have happened"] },
    { line: "And when the loss has been disclosed, the Secret Service say:", q: "What 'loss' is this?", a: "A Treaty or the Admiralty's plans gone missing", w: ["A lost cat", "The milk from the larder", "A lost game of cards"] },
    { line: "'It must have been Macavity!'—but he's a mile away.", q: "What is the suspect likely doing at the time?", a: "Resting, licking his thumbs or doing long division sums", w: ["Running from the police", "Hiding in the basement", "Sleeping in Scotland Yard"] },
    { line: "(I might mention Mungojerrie, I might mention Griddlebone)", q: "Who are Mungojerrie and Griddlebone?", a: "Other cats who are agents of Macavity", w: ["Police officers", "Macavity's owners", "Detectives from Scotland Yard"] },
  ],
  vocab: [
    { s: "He's the bafflement of Scotland Yard, the Flying Squad's despair:", w: "bafflement", meaning: "cause of confusion", wrong: ["great helper", "best officer", "prize"] },
    { s: "His powers of levitation would make a fakir stare,", w: "levitation", meaning: "rising and floating in the air without support", wrong: ["running fast", "hiding well", "climbing walls"] },
    { s: "He's a fiend in feline shape, a monster of depravity.", w: "feline", meaning: "like a cat", wrong: ["like a dog", "very large", "invisible"] },
    { s: "Or when the larder's looted, or the jewel-case is rifled,", w: "rifled", meaning: "(here) in a mess", wrong: ["shining", "locked", "sold"] },
    { s: "There never was a Cat of such deceitfulness and suavity.", w: "suavity", meaning: "elegance and sophistication", wrong: ["clumsiness", "laziness", "anger"] },
    { s: "He always has an alibi, and one or two to spare:", w: "alibi", meaning: "evidence that a person was not at the crime scene", wrong: ["a weapon", "a hiding place", "a confession"] },
  ],
  infer: [
    { line: "Macavity, Macavity, there's no one like Macavity,", q: "What effect does this repeated line have?", a: "It stresses how unique Macavity is and makes the poem easy to remember", w: ["It shows the poet forgot his words", "It tells us Macavity has a twin", "It slows the story down for no reason"] },
    { line: "Just controls their operations: the Napoleon of Crime!", q: "Why is Macavity called 'the Napoleon of Crime'?", a: "Like a great general, he plans and commands other criminals", w: ["He is French", "He is very short", "He fought in wars"] },
    { line: "You would know him if you saw him, for his eyes are sunken in.", q: "What might his 'sunken eyes' suggest?", a: "He stays up late, thinking and plotting", w: ["He is very happy", "He sleeps a lot", "He is a young kitten"] },
  ],
  claims: [
    { q: "The poem is meant to be taken seriously, like a police report.", a: "No: it is humorous, praising a cat as if he were a master criminal", w: ["Yes: it is a true crime report", "Yes: Macavity was a real criminal", "No: it is a sad poem"] },
    { q: "The poet uses repetition: 'Macavity's not there!'", a: "Yes: it emphasises that he is never caught", w: ["No: the line appears only once", "No: it is a simile", "Yes, but it means Macavity is lost"] },
    { q: "The police have plenty of evidence against Macavity.", a: "No: his footprints are not in any file of Scotland Yard's", w: ["Yes: they have his fingerprints", "Yes: they caught him once", "No: they never looked"] },
  ],
  facts: [
    { q: "The names given to Macavity include ___", a: "the Hidden Paw and the Napoleon of Crime", w: ["the Golden Cat", "the Flying Squad", "Mungojerrie"] },
    { q: "Macavity's movements are comparable to ___", a: "a snake's", w: ["a tiger's", "a bird's", "a fish's"] },
    { q: "The authorities hunting Macavity are ___", a: "Scotland Yard, the Flying Squad and the Secret Service", w: ["the Admiralty", "the Foreign Office only", "the fire brigade"] },
    { q: "The poem comes from ___", a: "Old Possum's Book of Practical Cats", w: ["The Waste Land", "Great Expectations", "Julius Caesar"] },
    { q: "The poet of 'Macavity' is ___", a: "T. S. Eliot", w: ["Shelley", "Southey", "Edgar Albert Guest"] },
  ],
  character: [
    { q: "Which words best describe Macavity?", a: "Cunning and mysterious", w: ["Lazy and clumsy", "Honest and kind", "Shy and frightened"] },
    { q: "How does the poet make us feel about Macavity?", a: "Amused, as if admiring a clever rogue", w: ["Terrified", "Bored", "Sorry for him"] },
  ],
  theme: [
    { q: "What is the tone of 'Macavity, the Mystery Cat'?", a: "Humorous", w: ["Tragic", "Angry", "Religious"] },
    { q: "How does the poet make the poem funny?", a: "By describing a cat's mischief as grand crimes that baffle the police", w: ["By telling jokes about dogs", "By rhyming badly on purpose", "By making the cat sad"] },
  ],
};
export const MACAVITY_TEMPLATES = chapterTemplates(MACAVITY);
export const verify = () => verifyChapter(MACAVITY);
