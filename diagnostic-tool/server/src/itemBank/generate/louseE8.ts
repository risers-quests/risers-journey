import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 18, The Louse and the Mosquito (Vikram Seth), English Rose Reader 8. In copyright: short extracts only. */
export const LOUSE: Chapter = {
  topic: "e8-lit-louse",
  prefix: "lou8",
  kind: "poem",
  taps: [
    { s: "In the King's bed, Creep the louse Lived in her ancestral house.", prompt: "Tap the louse's name.", target: "Creep" },
    { s: "For three decades, and each night", prompt: "Tap how long the lice had lived in the bed.", target: "three decades," },
    { s: "Rose — no, jasmine. And the quilt", prompt: "Tap the scent the mosquito decides on.", target: "jasmine." },
    { s: "That royal blood contains Remedies for aches and pains—", prompt: "Tap what the mosquito says royal blood contains.", target: "Remedies" },
    { s: "Hidden in the canopy,", prompt: "Tap where the mosquito hid.", target: "the canopy," },
  ],
  evidence: [
    { s: "For the tender-hearted Creep Could not bear to watch him weep.", prompt: "Tap the word that shows Creep was kind.", target: "tender-hearted" },
    { s: "But the glib mosquito cried,", prompt: "Tap the word that shows the mosquito was a smooth talker.", target: "glib" },
    { s: "But too late! The self-willed bumbler", prompt: "Tap the word that shows the mosquito did as he pleased.", target: "self-willed" },
    { s: "Quietly, discreetly, they Nipped and sipped and drank away.", prompt: "Tap the two words that show how carefully the lice fed.", target: ["Quietly,", "discreetly,"] },
  ],
  orders: [
    ["A mosquito flies in through the window.", "He pleads with Creep to stay one night.", "He persuades her to let him bite once.", "He bites the King too early.", "Creep and her family are killed."],
  ],
  wrongWord: [
    { s: "Creep the louse lived in the Queen's bed.", bad: "Queen's", good: "King's" },
    { s: "The mosquito bit the King at midnight.", bad: "midnight.", good: "afternoon" },
    { s: "The King thought he had been bitten by a bee.", bad: "bee.", good: "scorpion" },
    { s: "In the end, the mosquito was killed.", bad: "mosquito", good: "louse" },
  ],
  rtc: [
    { line: "You, I fear, would cause all three. I can't risk my family.", q: "Who is the speaker?", a: "Creep the louse", w: ["The mosquito", "The King", "A servant"] },
    { line: "You, I fear, would cause all three. I can't risk my family.", q: "What are the 'three' things she fears?", a: "Pain, loss of royal sleep, or a stain", w: ["Fire, flood and wind", "Hunger, thirst and cold", "Noise, light and smell"] },
    { line: "Save me, I'm in broken health. Let me bite him — once — by stealth.", q: "Who is 'him'?", a: "The King", w: ["Creep", "A servant", "A scorpion"] },
    { line: "'Yes, yes, yes. That's all old hat,'", q: "What does 'old hat' show about the mosquito?", a: "He thinks he knows it all and won't listen", w: ["He likes hats", "He is very old", "He is grateful"] },
  ],
  vocab: [
    { s: "Lived in her ancestral house.", w: "ancestral", meaning: "relating to members of your family from the past", wrong: ["new", "rented", "royal"] },
    { s: "She and her enormous brood", w: "brood", meaning: "a large family", wrong: ["a meal", "a bed", "a king"] },
    { s: "In a parabolic leap,", w: "parabolic", meaning: "shaped like the path of something thrown into the air", wrong: ["straight", "silent", "tiny"] },
    { s: "And at last his prayers were heeded", w: "heeded", meaning: "paid attention to", wrong: ["ignored", "written", "sung"] },
    { s: "Cold in hospitality?", w: "hospitality?", meaning: "being friendly and welcoming to guests", wrong: ["sickness", "anger", "cleanliness"] },
    { s: "The mosquito foiled detection,", w: "foiled", meaning: "prevented", wrong: ["helped", "wrapped", "noticed"] },
  ],
  infer: [
    { line: "Save me, I'm in broken health.", q: "What does this line show about the mosquito?", a: "He is lying to get what he wants", w: ["He is truly very ill", "He is kind", "He is a doctor"] },
    { line: "But the louse clan could not flee, All were killed without ado.", q: "What is the irony here?", a: "The careful lice die while the reckless mosquito escapes", w: ["The King dies", "The mosquito is punished", "Nobody is harmed"] },
    { line: "Quietly, discreetly, they Nipped and sipped and drank away.", q: "Which device continues the sentence onto the next line?", a: "Enjambment", w: ["Simile", "Onomatopoeia", "Hyperbole"] },
  ],
  claims: [
    { q: "Creep made the right decision to let the mosquito stay.", a: "No: trusting the glib stranger destroyed her family", w: ["Yes: it saved her family", "Yes: the mosquito kept his word", "No: the King invited him"] },
    { q: "The mosquito kept his promise to Creep.", a: "No: he bit early, ignoring her warning", w: ["Yes: he waited for deep sleep", "Yes: he never bit the King", "No: he bit Creep"] },
  ],
  facts: [
    { q: "The mosquito thought royal blood contains ___", a: "remedies for aches and pains", w: ["medicine for fatigue", "cures for aching joints", "gold"] },
    { q: "Creep advised the mosquito to bite the King's ___", a: "little toe", w: ["nose", "back", "hand"] },
    { q: "The King came for a snooze ___", a: "in the afternoon", w: ["at midnight", "at dawn", "after dinner"] },
    { q: "When bitten, the King shouted that it was ___", a: "a scorpion or a snake", w: ["a bee", "a mosquito", "a louse"] },
    { q: "'The Louse and the Mosquito' is by ___", a: "Vikram Seth", w: ["Thomas Hardy", "T. S. Eliot", "Sarojini Naidu"] },
  ],
  character: [
    { q: "Which words best describe the mosquito?", a: "Glib, selfish and reckless", w: ["Honest and patient", "Shy and kind", "Wise and humble"] },
    { q: "Which words best describe Creep?", a: "Kind-hearted but too trusting", w: ["Cruel and greedy", "Lazy", "Dishonest"] },
  ],
  theme: [
    { q: "What is the main message of the poem?", a: "Be careful whom you trust: kindness to a selfish stranger can bring ruin", w: ["Kings sleep too much", "Insects are clever", "Always welcome guests"] },
    { q: "Which theme label fits this poem?", a: "Trust and betrayal", w: ["Nature", "War and peace", "Gender"] },
  ],
};
export const LOUSE_TEMPLATES = chapterTemplates(LOUSE);
export const verify = () => verifyChapter(LOUSE);
