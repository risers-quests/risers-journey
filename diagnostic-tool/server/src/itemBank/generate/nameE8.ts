import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 17, Choosing a Name (from The Namesake, Jhumpa Lahiri), English Rose Reader 8. In copyright: short extracts only. */
export const NAME: Chapter = {
  topic: "e8-lit-name",
  prefix: "nam8",
  kind: "story",
  taps: [
    { s: "The name, Nikhil, is artfully connected to the old.", prompt: "Tap Gogol's new good name.", target: "Nikhil," },
    { s: "At school, Ashoke and Gogol are greeted by the secretary, Mrs McNab,", prompt: "Tap the secretary's name.", target: "Mrs McNab," },
    { s: "CANDACE LAPIDUS, the name on the door says.", prompt: "Tap the principal's name.", target: "CANDACE LAPIDUS," },
    { s: "Ashoke hands over the lunch box, a windbreaker in case it gets cold.", prompt: "Tap the two things Ashoke hands over.", target: ["lunch box,", "windbreaker"] },
    { s: "'Gogol G,' he signs his work in the lower right-hand corner.", prompt: "Tap how Gogol signs his work.", target: "'Gogol G,'" },
  ],
  evidence: [
    { s: "'Why do I have to have a new name?' he asks his parents, tears springing to his eyes.", prompt: "Tap the words that show Gogol is upset.", target: "tears springing to his eyes." },
    { s: "He is afraid to be Nikhil, someone he doesn't know.", prompt: "Tap the word that shows Gogol's fear.", target: "afraid" },
    { s: "Gogol picks up a pencil, grips it tightly, and forms the letters of the only word he has learned thus far to write from memory,", prompt: "Tap the words that show Gogol is nervous.", target: "grips it tightly," },
    { s: "'My son is perfectly bilingual.'", prompt: "Tap the word that shows Gogol knows two languages.", target: "bilingual.'" },
  ],
  orders: [
    ["Gogol's parents choose the good name Nikhil.", "Ashoke takes Gogol to school.", "Gogol doesn't answer to 'Nikhil'.", "Mrs Lapidus asks Gogol what he wants to be called.", "Gogol writes 'Gogol' on the paper."],
  ],
  wrongWord: [
    { s: "Gogol's good name was Nicholas.", bad: "Nicholas.", good: "Nikhil" },
    { s: "Mrs McNab was the school principal.", bad: "principal.", good: "secretary" },
    { s: "Ashoke thought of the name while staring at a blue sky.", bad: "sky.", good: "spines" },
    { s: "The other Indian children were Jayadev Modi and Rekha Sharma.", bad: "Sharma.", good: "Saxena" },
    { s: "In the end, Gogol was called Nikhil at school.", bad: "Nikhil", good: "Gogol" },
  ],
  rtc: [
    { line: "'Ashima still dreams of the letter at times, discovering it after all these years in the mailbox on Pemberton Road, opening it up only to find it blank.'", q: "Which letter is this?", a: "Her grandmother's letter with the good name she had chosen, which never arrived", w: ["A letter from the school", "A letter from Ashoke", "A letter from Mrs Lapidus"] },
    { line: "'Oh that, that is what we call him at home only. But his good name should be—is'—he nods his head firmly—'Nikhil.'", q: "Who says this?", a: "Ashoke", w: ["Mrs Lapidus", "Gogol", "Ashima"] },
    { line: "'Be good, Nikhil,' he says in English. And then, after a moment's hesitation, he is gone.", q: "Who is 'he'?", a: "Ashoke, Gogol's father", w: ["Gogol", "Mrs Lapidus", "Jayadev Modi"] },
    { line: "'Then it's settled. Can you write your name on this piece of paper?'", q: "What has been 'settled'?", a: "Gogol will be called Gogol at school", w: ["Gogol will be called Nikhil", "Gogol will go home", "Gogol will change schools"] },
  ],
  vocab: [
    { s: "Not only is it a perfectly respectable Bengali good name, meaning 'he who is entire, encompassing all',", w: "encompassing", meaning: "covering or containing completely", wrong: ["leaving out", "breaking", "forgetting"] },
    { s: "there was the danger that Americans, obsessed with abbreviation, would truncate it to Nick.", w: "truncate", meaning: "to make shorter", wrong: ["to lengthen", "to forget", "to spell"] },
    { s: "'I assure you he will grow accustomed.'", w: "accustomed.'", meaning: "familiar with", wrong: ["angry", "tired", "taller"] },
    { s: "'What beautiful penmanship you have,' Mrs Lapidus says.", w: "penmanship", meaning: "the art of writing by hand", wrong: ["drawing", "reading aloud", "spelling"] },
    { s: "In the front covers of the textbooks from which he is taught to read he leaves his legacy,", w: "legacy,", meaning: "(here) mark", wrong: ["money", "a book", "a tear"] },
  ],
  infer: [
    { line: "Gogol looks down at his sneakers.", q: "Why does Gogol look down when called Nikhil?", a: "He doesn't feel the name is his, and is shy and unsure", w: ["His shoes are untied", "He is bored", "He wants to go out to play"] },
    { line: "'Perhaps the Gangulis know them?'", q: "What does Mrs Lapidus's question reveal about her thinking?", a: "She assumes all Indian families must know each other", w: ["She knows the Gangulis well", "She wants new pupils", "She is angry with them"] },
    { line: "'Gogol G,' he signs his work in the lower right-hand corner, as if there were a need to distinguish him from any other Gogol in the school.", q: "What does this show?", a: "Gogol is proud of his name and his work", w: ["There are many Gogols at school", "He has forgotten his name", "He wants to be called Nikhil"] },
  ],
  claims: [
    { q: "Gogol happily accepted the name Nikhil.", a: "No: he was afraid to be someone he didn't know", w: ["Yes: he liked it", "Yes: he chose it himself", "No: he wanted to be called Nick"] },
    { q: "Mrs Lapidus respected Gogol's wishes.", a: "Yes: she asked him and let him be called Gogol", w: ["No: she called him Nikhil", "No: she ignored him", "Yes, but only after Ashoke agreed"] },
    { q: "The story is about how names connect to identity.", a: "Yes: Gogol feels his name is part of who he is", w: ["No: it is about school lunches", "No: it is about Russia", "Yes, but only for adults"] },
  ],
  facts: [
    { q: "The name 'Nikhil' means ___", a: "the one who encompasses all", w: ["the one above all", "the one who cannot be defeated", "the bright one"] },
    { q: "Ashoke came up with the name while staring at ___", a: "the spines of novels by the Russian author Gogol", w: ["a blue sky after the rains", "the wild flowers in a meadow", "a school sign"] },
    { q: "Mrs McNab was ___", a: "the secretary to the principal", w: ["Ashoke's colleague", "Gogol's first teacher", "a neighbour"] },
    { q: "Jayadev Modi and Rekha Saxena were ___", a: "fellow Indian students at the school", w: ["Gogol's first friends", "the people who filled out his form", "teachers"] },
    { q: "Ashoke spoke to his son in careful English to show that ___", a: "Gogol understood English perfectly well", w: ["Mrs Lapidus was right", "he was annoyed with his son", "he didn't speak Bengali"] },
    { q: "'The Namesake' was written by ___", a: "Jhumpa Lahiri", w: ["Sudha Murty", "Vikram Seth", "Premchand"] },
  ],
  character: [
    { q: "Which words best describe Gogol here?", a: "Shy but attached to his own name", w: ["Bold and rude", "Happy to change", "Uninterested"] },
    { q: "Which words best describe Mrs Lapidus?", a: "Kind and understanding", w: ["Strict and cruel", "Careless", "Unfriendly"] },
  ],
  theme: [
    { q: "What is the main message of 'Choosing a Name'?", a: "A name is part of who we are, and others should respect it", w: ["Short names are better", "School is frightening", "Parents always know best"] },
    { q: "What is Gogol's 'good name' meant for?", a: "Use in the outside world, like school", w: ["Use only at home", "Use only in Russia", "Use by his grandmother"] },
  ],
};
export const NAME_TEMPLATES = chapterTemplates(NAME);
export const verify = () => verifyChapter(NAME);
