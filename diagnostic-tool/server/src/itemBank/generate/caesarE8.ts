import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 14, Julius Caesar, Act II Scene II (Shakespeare; public domain), English Rose Reader 8. */
export const CAESAR: Chapter = {
  topic: "e8-lit-caesar",
  prefix: "jc8",
  kind: "play",
  taps: [
    { s: "Thrice hath Calpurnia in her sleep cried out, 'Help, ho! they murder Caesar!'", prompt: "Tap what Calpurnia cried out in her sleep.", target: "'Help, ho! they murder Caesar!'" },
    { s: "Go bid the priests do present sacrifice And bring me their opinions of success.", prompt: "Tap whom the servant is sent to.", target: "the priests" },
    { s: "When beggars die, there are no comets seen;", prompt: "Tap what is not seen when beggars die.", target: "comets" },
    { s: "Plucking the entrails of an offering forth, They could not find a heart within the beast.", prompt: "Tap what the augurers could not find.", target: "a heart" },
    { s: "She dreamt to-night she saw my statue, Which, like a fountain with an hundred spouts, Did run pure blood:", prompt: "Tap what Caesar's statue was like in the dream.", target: "a fountain with an hundred spouts," },
  ],
  evidence: [
    { s: "Cowards die many times before their deaths; The valiant never taste of death but once.", prompt: "Tap the word that shows Caesar sees himself as brave.", target: "valiant" },
    { s: "Shall Caesar send a lie?", prompt: "Tap the word that shows Caesar refuses to be dishonest.", target: "lie?" },
    { s: "Alas, my lord, Your wisdom is consumed in confidence.", prompt: "Tap the word that shows what Calpurnia thinks is Caesar's weakness.", target: "confidence." },
    { s: "If Caesar hide himself, shall they not whisper 'Lo, Caesar is afraid'?", prompt: "Tap the word Decius uses to work on Caesar's pride.", target: "afraid'?" },
    { s: "How foolish do your fears seem now, Calpurnia! I am ashamed I did yield to them.", prompt: "Tap the word that shows how Caesar feels about having listened to her.", target: "ashamed" },
  ],
  orders: [
    ["Calpurnia cries out in her sleep.", "Caesar sends a servant to the priests.", "Calpurnia begs him to stay home.", "Caesar agrees to stay, for her sake.", "Decius Brutus reinterprets the dream.", "Caesar decides to go to the senate."],
  ],
  wrongWord: [
    { s: "Calpurnia suggested Caesar say he was travelling.", bad: "travelling.", good: "sick" },
    { s: "Caesar asked Cinna to be close to him that day.", bad: "Cinna", good: "Trebonius" },
    { s: "When beggars die, there are no planets seen.", bad: "planets", good: "comets" },
    { s: "Mark Antony was one of the conspirators.", bad: "conspirators.", good: "friends" },
  ],
  rtc: [
    { line: "Caesar, I never stood on ceremonies, Yet now they fright me.", q: "Who said these words, and why?", a: "Calpurnia: the strange omens frightened her, though she never believed in superstitions", w: ["Caesar: he was afraid of the senate", "Decius Brutus: he wanted to stop Caesar", "The servant: he saw a ghost"] },
    { line: "And this way have you well expounded it.", q: "Who said this, and to whom?", a: "Caesar, to Decius Brutus", w: ["Calpurnia, to Caesar", "Decius Brutus, to Caesar", "Caesar, to the servant"] },
    { line: "And this way have you well expounded it.", q: "What had the listener 'well expounded'?", a: "Calpurnia's dream", w: ["The senate's laws", "The priests' sacrifice", "Caesar's speech"] },
    { line: "The gods do this in shame of cowardice: Caesar should be a beast without a heart, If he should stay at home to-day for fear.", q: "How did Caesar interpret the augurers' prediction?", a: "As a warning against cowardice, not against going out", w: ["As a sign he would die", "As a reason to stay at home", "As a joke by the priests"] },
    { line: "(Aside) That every like is not the same, O Caesar, The heart of Brutus yearns to think upon!", q: "What is an 'aside'?", a: "A line spoken to the audience that the other characters don't hear", w: ["A song", "An order to leave the stage", "A line spoken very loudly"] },
  ],
  vocab: [
    { s: "Caesar, I never stood on ceremonies, Yet now they fright me.", w: "stood on ceremonies", meaning: "believed in superstitions", wrong: ["attended parties", "made speeches", "stood still"] },
    { s: "A lioness hath whelped in the streets;", w: "whelped", meaning: "given birth", wrong: ["roared", "hunted", "slept"] },
    { s: "The valiant never taste of death but once.", w: "valiant", meaning: "brave", wrong: ["cowardly", "rich", "old"] },
    { s: "This dream is all amiss interpreted;", w: "amiss", meaning: "incorrectly", wrong: ["perfectly", "quickly", "loudly"] },
    { s: "And these does she apply for warnings, and portents,", w: "portents", meaning: "predictions", wrong: ["presents", "prayers", "promises"] },
    { s: "Caesar was ne'er so much your enemy As that same ague which hath made you lean.", w: "ague", meaning: "an illness with fever, cold and shivering", wrong: ["an enemy soldier", "a sword", "a quarrel"] },
  ],
  infer: [
    { line: "Caesar shall forth: the things that threaten'd me Ne'er look'd but on my back; when they shall see The face of Caesar, they are vanished.", q: "What does this show about Caesar?", a: "He is proud and believes he is too great to be harmed", w: ["He is afraid of his enemies", "He is very humble", "He is planning to run away"] },
    { line: "Mark Antony shall say I am not well, And, for thy humour, I will stay at home.", q: "Why does Caesar agree to stay at first?", a: "To please Calpurnia, not because he is afraid", w: ["Because he is really sick", "Because the senate is closed", "Because Decius told him to"] },
    { line: "the senate have concluded To give this day a crown to mighty Caesar.", q: "Why does this convince Caesar to go?", a: "It appeals to his ambition; he may lose the crown if he stays", w: ["He wants to see his friends", "He is bored at home", "Calpurnia asks him to go"] },
    { line: "Signifies that from you great Rome shall suck Reviving blood,", q: "How does Decius Brutus change the meaning of the dream?", a: "He makes the blood a sign of Caesar's life-giving greatness, not his death", w: ["He says the dream means nothing", "He agrees Caesar will die", "He says Calpurnia is lying"] },
  ],
  claims: [
    { q: "Decius Brutus truly wanted to help Caesar.", a: "No: he was a conspirator flattering Caesar into going to his death", w: ["Yes: he was Caesar's loyal friend", "Yes: he wanted Caesar crowned", "No: he wanted Caesar to stay home"] },
    { q: "Caesar's pride leads him into danger.", a: "Yes: he ignores warnings so as not to look afraid", w: ["No: he is humble all through", "No: he stays at home", "Yes, but only because he is ill"] },
    { q: "Calpurnia and Decius read the dream the same way.", a: "No: she sees it as a warning of death; he as a sign of glory", w: ["Yes: both see glory", "Yes: both see death", "No: neither explains it"] },
  ],
  facts: [
    { q: "The stage directions tell us that ___", a: "it is a stormy night", w: ["Caesar is a Roman citizen", "Calpurnia is in the garden", "it is a sunny morning"] },
    { q: "Calpurnia cried out in her sleep because she was ___", a: "frightened", w: ["sad", "disturbed by some visitors", "happy"] },
    { q: "Calpurnia suggests that Caesar's reason for not going be that ___", a: "he is sick", w: ["he has other work", "he is travelling", "he is too old"] },
    { q: "Caesar asked ___ to be close to him that day.", a: "Trebonius", w: ["Cinna", "Metellus", "Casca"] },
    { q: "The Ides of March is ___", a: "15 March", w: ["1 March", "31 March", "15 April"] },
    { q: "'Julius Caesar' was written by ___", a: "William Shakespeare", w: ["Charles Dickens", "O. Henry", "T. S. Eliot"] },
  ],
  character: [
    { q: "How would you assess Caesar in this scene?", a: "Brave but proud, and easily flattered", w: ["Cowardly and nervous", "Humble and careful", "Lazy and careless"] },
    { q: "Which words best describe Calpurnia?", a: "Loving and fearful for her husband", w: ["Cruel and ambitious", "Careless and cheerful", "Jealous of Caesar"] },
  ],
  theme: [
    { q: "What does this scene show?", a: "Pride and flattery can blind a powerful person to danger", w: ["Dreams never mean anything", "Wives should obey husbands", "Senators are always loyal"] },
    { q: "'Cowards die many times before their deaths' means ___", a: "fearful people suffer all their lives, while the brave face death once", w: ["cowards live longer", "brave people die often", "everyone dies twice"] },
  ],
};
export const CAESAR_TEMPLATES = chapterTemplates(CAESAR);
export const verify = () => verifyChapter(CAESAR);
