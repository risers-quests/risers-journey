import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/**
 * Chapter 2, Don't Quit (Edgar Albert Guest), English Rose Reader 8.
 * Built from the poem as the reader prints it and its glossary.
 */
export const DONT_QUIT: Chapter = {
  topic: "e8-lit-dont-quit",
  prefix: "dq8",
  kind: "poem",
  taps: [
    { s: "when the funds are low and the debts are high,", prompt: "Tap the two money troubles the poet mentions.", target: ["funds are low", "debts are high"] },
    { s: "rest if you must, but don't you quit.", prompt: "Tap what the poet says you may do when things go wrong.", target: "rest", wrong: [{ phrase: "quit", mistake: "lit-detail" }] },
    { s: "Success is failure turned inside out—", prompt: "Tap what success is, according to the poet.", target: "failure turned inside out" },
    { s: "and he learned too late when the night came down, how close he was to the golden crown.", prompt: "Tap the words that name the prize he nearly won.", target: "the golden crown" },
    { s: "when the road you're trudging seems all uphill,", prompt: "Tap the words that show the road is hard.", target: "all uphill" },
  ],
  evidence: [
    { s: "Often the goal is nearer than it seems to a faint and faltering man;", prompt: "Tap the words that show the goal may be closer than we think.", target: "nearer than it seems" },
    { s: "And many a fellow turns about when he might have won had he stuck it out.", prompt: "Tap the words that show people give up too soon.", target: "turns about" },
    { s: "So stick to the fight when you're hardest hit—", prompt: "Tap the words that tell you what to do when life hits hardest.", target: "stick to the fight" },
    { s: "and you want to smile but you have to sigh,", prompt: "Tap the word that shows sadness.", target: "sigh" },
    { s: "the silver tint of the clouds of doubt,", prompt: "Tap the words that show hope hidden inside doubt.", target: "the silver tint" },
  ],
  orders: [
    ["Things go wrong and the road seems all uphill.", "Life is strange, and many people turn back too soon.", "The struggler gives up just before winning the cup.", "Success is failure turned inside out, so you must not quit."],
    ["When care presses you down, rest if you must.", "Don't give up though the pace seems slow.", "Stick to the fight when you're hardest hit."],
    ["The struggler gives up.", "The night comes down.", "He learns how close he was to the golden crown."],
  ],
  wrongWord: [
    { s: "The poet says that when care is pressing you down, you should quit.", bad: "quit", good: "rest" },
    { s: "The poet says success is failure turned upside out.", bad: "upside", good: "inside" },
    { s: "The struggler learns too early how close he was to the golden crown.", bad: "early", good: "late" },
    { s: "The poet says the goal is often farther than it seems.", bad: "farther", good: "nearer" },
    { s: "You must not quit especially when things seem best.", bad: "best", good: "worst" },
  ],
  rtc: [
    { line: "Life is queer with its twists and turns.", q: "What does the poet say about life here?", a: "It is strange and full of changes", w: ["It is always smooth and easy", "It is a straight road uphill", "It is very short"] },
    { line: "Don't give up though the pace seems slow— you may succeed with another blow.", q: "What does 'another blow' mean here?", a: "One more try", w: ["Another hit from bad luck", "A gust of wind", "A fight with someone"] },
    { line: "Often the struggler has given up when he might have captured the victor's cup;", q: "What is the 'victor's cup'?", a: "Success, the prize for winning", w: ["A cup of tea for tired people", "A real cup made of gold", "The pain of failing"] },
    { line: "rest if you must, but don't you quit.", q: "What difference does the poet make here?", a: "Resting is fine; giving up is not", w: ["Resting and quitting are the same", "You should never rest", "Quitting is fine if you are tired"] },
    { line: "it may be near when it seems afar;", q: "What may be near?", a: "Success", w: ["The night", "Failure", "The clouds of doubt"] },
    { line: "when care is pressing you down a bit—", q: "What does 'care' mean here?", a: "Worry", w: ["Kindness", "Looking after someone", "Being careful"] },
  ],
  vocab: [
    { s: "when the road you're trudging seems all uphill,", w: "trudging", meaning: "walking slowly because of tiredness or harsh conditions", wrong: ["running happily", "driving fast", "dancing along"] },
    { s: "Life is queer with its twists and turns.", w: "queer", meaning: "strange", wrong: ["happy", "short", "simple"] },
    { s: "when he might have won had he stuck it out.", w: "stuck it out", meaning: "kept going without giving up", wrong: ["gave up quickly", "got stuck in mud", "went outside"] },
    { s: "Often the goal is nearer than it seems to a faint and faltering man;", w: "faltering", meaning: "hesitating", wrong: ["confident", "quick", "cheerful"] },
    { s: "when the funds are low and the debts are high,", w: "debts", meaning: "money you owe", wrong: ["money you have saved", "bills you have paid", "presents"] },
    { s: "when the funds are low and the debts are high,", w: "funds", meaning: "money you have to spend", wrong: ["friends", "jokes", "holidays"] },
  ],
  infer: [
    { line: "Success is failure turned inside out—", q: "What does the poet mean?", a: "Every failure holds the chance of success if you keep trying", w: ["Failure and success are the same thing", "Success comes only by luck", "If you fail once, you should stop"] },
    { line: "the silver tint of the clouds of doubt,", q: "What is the 'silver tint'?", a: "A hint of hope, even when we doubt", w: ["Rain about to fall", "Real silver in the sky", "The end of the day"] },
    { line: "and he learned too late when the night came down,", q: "What does 'the night came down' suggest?", a: "It was too late: the chance had gone", w: ["It was time to sleep", "The weather changed", "He finally won"] },
    { line: "it's when things seem worst, you must not quit.", q: "Why does the poet say this?", a: "The hardest moment may come just before success", w: ["Things never get better", "Quitting is easiest at the worst time", "Only strong people can win"] },
    { line: "And many a fellow turns about when he might have won had he stuck it out.", q: "What is the poet warning against?", a: "Giving up too soon", w: ["Walking the wrong way", "Being too proud", "Working too hard"] },
  ],
  claims: [
    { q: "The poet says you should never rest.", a: "No: he says rest if you must, but don't quit", w: ["Yes: resting is the same as quitting", "Yes: he says keep going without stopping", "No: he says you should quit and rest"] },
    { q: "The poem is about not giving up when life is hard.", a: "Yes: every stanza urges us to keep going", w: ["No: it is about saving money", "No: it is about climbing mountains", "Yes, but only in sport"] },
    { q: "The poet thinks failure is the end.", a: "No: he says success is failure turned inside out", w: ["Yes: he says the night came down", "Yes: he says life is queer", "No: he says failure never happens"] },
    { q: "The struggler in the poem won the victor's cup.", a: "No: he gave up just before he would have won", w: ["Yes: he stuck it out to the end", "Yes: he won the golden crown", "No: there was no cup to win"] },
  ],
  facts: [
    { q: "When care is pressing you down, the poet says you should ___", a: "rest if you must, but not quit", w: ["quit and start again", "run away", "ask someone else to finish"] },
    { q: "Each of us sometimes learns that life is ___", a: "queer, with its twists and turns", w: ["easy and smooth", "always unfair", "short and sweet"] },
    { q: "When the night comes down, the struggler learns ___", a: "how close he was to the golden crown", w: ["that he had won", "that he should have rested", "the way home"] },
    { q: "Success, says the poet, is ___", a: "failure turned inside out", w: ["a golden crown", "luck", "a straight road"] },
    { q: "You must not quit especially when ___", a: "things seem worst", w: ["things seem best", "the pace is fast", "you are winning"] },
    { q: "The poet of 'Don't Quit' is ___", a: "Edgar Albert Guest", w: ["Robert Southey", "Percy Bysshe Shelley", "Thomas Hardy"] },
  ],
  character: [
    { q: "What kind of person is the speaker of the poem?", a: "An encourager who believes in perseverance", w: ["Someone who has given up", "A person who loves money", "A strict, angry teacher"] },
    { q: "What mistake does 'the struggler' make?", a: "He gives up just before success", w: ["He works too slowly", "He rests too often", "He never tries at all"] },
    { q: "How does the poet want the reader to feel?", a: "Hopeful and determined", w: ["Afraid of failure", "Sad about life", "Bored with trying"] },
  ],
  theme: [
    { q: "What is the main message of 'Don't Quit'?", a: "Keep going when things are hard: success may be closer than it seems", w: ["Rest is a waste of time", "Life is always fair", "Money brings happiness"] },
    { q: "Which saying is closest to the poem's message?", a: "Never give up", w: ["Look before you leap", "Too many cooks spoil the broth", "Silence is golden"] },
    { q: "Why is the poem called 'Don't Quit'?", a: "Its stanzas keep urging us not to give up", w: ["The poet quit his job", "It is about a race", "Quitting is its main advice"] },
  ],
};

export const DONT_QUIT_TEMPLATES = chapterTemplates(DONT_QUIT);
export const verify = () => verifyChapter(DONT_QUIT);
