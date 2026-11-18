import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 15, Great Expectations (graphic-novel edition of Dickens), English Rose Reader 8. Adaptation's wording: short extracts only. */
const TF = ["True", "False", "The story doesn't say", "Both true and false"] as const;
const tf = (s: string, t: boolean) => ({ q: `Is this statement right? ${s}`, a: t ? TF[0] : TF[1], w: [t ? TF[1] : TF[0], TF[2], TF[3]] as [string, string, string] });

export const EXPECTATIONS: Chapter = {
  topic: "e8-lit-expectations",
  prefix: "gex8",
  kind: "graphic novel",
  taps: [
    { s: "One chilly Christmas Eve, a small boy stood among the tombstones in a lonely churchyard.", prompt: "Tap when the story begins.", target: "One chilly Christmas Eve," },
    { s: "My sister, sir—Mrs Joe Gargery—wife of Joe Gargery, the blacksmith.", prompt: "Tap Joe Gargery's work.", target: "the blacksmith." },
    { s: "You get me a file, and you get me wittles.", prompt: "Tap the two things the convict demands.", target: ["a file,", "wittles."] },
    { s: "At dawn I crept downstairs to the pantry.", prompt: "Tap where Pip went at dawn.", target: "the pantry." },
    { s: "They were hunting two escaped convicts, and needed Joe to mend their handcuffs.", prompt: "Tap why the soldiers needed Joe.", target: "to mend their handcuffs." },
  ],
  evidence: [
    { s: "The loneliness of the place grew suddenly so frightening that I began to cry.", prompt: "Tap the word that shows how Pip felt in the churchyard.", target: "frightening" },
    { s: "My convict fell on the food like a hungry dog.", prompt: "Tap the words that show how hungry the convict was.", target: "like a hungry dog." },
    { s: "I did not sleep for terror of the young man who might harm me.", prompt: "Tap the word that shows why Pip couldn't sleep.", target: "terror" },
    { s: "I took some broken wittles and a pie — from the blacksmith's in the village.", prompt: "Tap what the convict says he took.", target: ["broken wittles", "a pie"] },
    { s: "He began filing his leg-iron like a madman, not minding how he cut into his leg.", prompt: "Tap the words that show how desperate the convict was.", target: "like a madman," },
  ],
  orders: [
    ["Pip meets the convict in the churchyard.", "Pip takes food and a file from the pantry.", "Pip tells the convict about the young man.", "Soldiers come to the forge.", "Both convicts are captured on the marshes."],
    ["The soldiers ask for the blacksmith.", "Joe mends their handcuffs.", "Joe and Pip go with the soldiers.", "The convict says he took the pie."],
  ],
  wrongWord: [
    { s: "Pip lived with his grandparents.", bad: "grandparents.", good: "sister" },
    { s: "The convict asked Pip for a knife and wittles.", bad: "knife", good: "file" },
    { s: "The soldiers needed Joe to mend their muskets.", bad: "muskets.", good: "handcuffs" },
    { s: "The second convict was called Pumblechook.", bad: "Pumblechook.", good: "Compeyson" },
    { s: "The convicts were rowed back to the Black Gate.", bad: "Black", good: "Hulk" },
  ],
  rtc: [
    { line: "There's a young man hid with me in comparison with which I am an Angel.", q: "Who said this, and to whom?", a: "The convict, to Pip", w: ["Joe, to Pip", "Pip, to Joe", "A soldier, to the convict"] },
    { line: "There's a young man hid with me in comparison with which I am an Angel.", q: "Why did the speaker say this?", a: "To frighten Pip into bringing the file and food", w: ["To make Pip laugh", "To warn the soldiers", "Because he loved the young man"] },
    { line: "I wish to say something. It may prevent some persons laying under suspicion.", q: "Who is 'some persons'?", a: "Pip, who had taken the food", w: ["Joe's uncle", "The soldiers", "Compeyson"] },
    { line: "You're welcome to it. We wouldn't have you starved to death, would us, Pip?", q: "Who said this?", a: "Joe", w: ["Mrs Joe", "Pip", "Uncle Pumblechook"] },
    { line: "Suppose my convict thinks it's me that's led the soldiers here?", q: "Why was Pip worried?", a: "He feared the convict would think he had betrayed him", w: ["He was afraid of the guns", "He was late for supper", "He had lost the file"] },
  ],
  vocab: [
    { s: "It was a bleak, windswept place overlooking the Kentish marshes.", w: "bleak", meaning: "hopeless", wrong: ["cheerful", "crowded", "sunny"] },
    { s: "I want the blacksmith.", w: "blacksmith.", meaning: "someone who makes and repairs things made of iron", wrong: ["a baker", "a soldier", "a priest"] },
    { s: "He began filing his leg-iron like a madman,", w: "leg-iron", meaning: "a metal band put around a prisoner's ankle", wrong: ["a walking stick", "a boot", "a sword"] },
    { s: "You must taste a delicious present of Uncle Pumblechook's—a savoury meat pie.", w: "savoury", meaning: "tasting salty, not sweet", wrong: ["sweet", "rotten", "frozen"] },
    { s: "It may prevent some persons laying under suspicion.", w: "suspicion.", meaning: "a feeling that someone has done something wrong", wrong: ["joy", "a hiding place", "sleep"] },
    { s: "He had a badly bruised face.", w: "bruised", meaning: "having blue, black or purple marks after an injury", wrong: ["clean", "smiling", "hairy"] },
  ],
  infer: [
    { line: "I wish to say something. It may prevent some persons laying under suspicion.", q: "Why did the convict say he took the food?", a: "To protect Pip from being blamed", w: ["He wanted more food", "He was boasting", "Joe asked him to"] },
    { line: "As the convicts were rowed back to the Hulk, mine turned his head and looked at me still.", q: "What might this last look suggest?", a: "The convict was grateful to Pip and won't forget him", w: ["He was angry with Pip", "He wanted to escape again", "He didn't recognise Pip"] },
    { line: "I'd never do it again! It's bad enough to be a blacksmith's wife without being your mother.", q: "What does this show about Mrs Joe?", a: "She is harsh and resents raising Pip", w: ["She loves Pip dearly", "She is proud of Joe", "She is very gentle"] },
  ],
  claims: [
    { q: "Pip was closer to Joe than to his own sister.", a: "Yes: Joe was kind and protected him; his sister scolded him", w: ["No: his sister was kinder", "No: Pip disliked Joe", "Yes, because Joe was his father"] },
    { q: "Pip's convict had a humane side.", a: "Yes: he took the blame for the stolen food to protect Pip", w: ["No: he was cruel all through", "No: he blamed Pip", "Yes: he gave Pip money"] },
    { q: "The convict let Compeyson escape.", a: "No: he held him so he couldn't get away, even though he was caught too", w: ["Yes: he helped him run", "Yes: they escaped together", "No: Compeyson was never there"] },
  ],
  facts: [
    tf("Pip had no photographs of his parents.", true),
    tf("Pip lived with his grandparents.", false),
    tf("The second convict was called Compeyson.", true),
    tf("The soldiers needed Joe to mend their handcuffs.", true),
    tf("The prison where the convicts escaped from was called the Black Gate.", false),
    { q: "'Great Expectations' was written by ___", a: "Charles Dickens", w: ["O. Henry", "Shakespeare", "T. S. Eliot"] },
  ],
  character: [
    { q: "Which words best describe Joe?", a: "Kind and gentle", w: ["Cruel and harsh", "Greedy and sly", "Proud and lazy"] },
    { q: "Which words best describe Pip?", a: "Frightened but kind-hearted", w: ["Brave and boastful", "Cruel and selfish", "Rich and spoilt"] },
  ],
  theme: [
    { q: "What does this extract suggest?", a: "Even a hardened convict can show kindness and gratitude", w: ["All criminals are evil", "Children should never help strangers", "Soldiers are always cruel"] },
    { q: "What literary form is this chapter?", a: "A graphic novel: a story told in pictures, speech bubbles and captions", w: ["A play", "A poem", "A biography"] },
  ],
};
export const EXPECTATIONS_TEMPLATES = chapterTemplates(EXPECTATIONS);
export const verify = () => verifyChapter(EXPECTATIONS);
