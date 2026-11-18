import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 16, Throwing a Tree (Thomas Hardy; public domain), English Rose Reader 8. */
export const TREE: Chapter = {
  topic: "e8-lit-tree",
  prefix: "thr8",
  kind: "poem",
  taps: [
    { s: "Bearing two axes with heavy heads shining and wide,", prompt: "Tap what the woodcutters carry.", target: "two axes" },
    { s: "And a long limp two-handled saw toothed for cutting great boles,", prompt: "Tap the words that describe the saw.", target: "long limp two-handled" },
    { s: "Jackets doffed they swing axes and chop away just above ground,", prompt: "Tap where they chop the tree.", target: "just above ground," },
    { s: "And one of them tries to hook upward a rope, which at last he achieves.", prompt: "Tap what one of them hooks upward.", target: "a rope," },
    { s: "And two hundred years' steady growth has been ended in less than two hours.", prompt: "Tap how long the tree had been growing.", target: "two hundred years'" },
  ],
  evidence: [
    { s: "The two executioners stalk along over the knolls,", prompt: "Tap the word that makes the woodcutters seem like killers.", target: "executioners" },
    { s: "And so they approach the proud tree that bears the death-mark on its side.", prompt: "Tap the word that shows the tree is marked to be cut down.", target: "death-mark" },
    { s: "The saw then begins, till the top of the tall giant shivers:", prompt: "Tap the word that makes the tree seem alive and afraid.", target: "shivers:" },
    { s: "The tree crashes downward: it shakes all its neighbours throughout,", prompt: "Tap the words that show the fall affects other trees.", target: "shakes all its neighbours" },
  ],
  orders: [
    ["The two woodcutters approach the marked tree.", "They take off their jackets and chop just above the ground.", "One of them hooks a rope high up the tree.", "They saw and pull until the tree sways.", "The tree crashes down in less than two hours."],
  ],
  wrongWord: [
    { s: "The executioners carried knives with them.", bad: "knives", good: "axes" },
    { s: "They carried a rigid two-handled saw.", bad: "rigid", good: "limp" },
    { s: "The woodcutters chopped the top of the tree with their axes.", bad: "top", good: "bottom" },
    { s: "They hooked a rope at the roots of the tree.", bad: "roots", good: "top" },
    { s: "The tree had grown for one hundred years.", bad: "one", good: "two" },
  ],
  rtc: [
    { line: "And so they approach the proud tree that bears the death-mark on its side.", q: "Who are 'they'?", a: "The two woodcutters, Job and Ike", w: ["Two soldiers", "Two hunters", "The tree's neighbours"] },
    { line: "And so they approach the proud tree that bears the death-mark on its side.", q: "What is the 'death-mark'?", a: "A mark showing the tree is chosen to be cut down", w: ["A scar from lightning", "A carved name", "A sign of disease"] },
    { line: "Then, lastly, the living mast sways, further sways:", q: "Why is the tree called 'the living mast'?", a: "It is tall and straight like a ship's mast, and alive", w: ["It will become a ship", "It stands near the sea", "It has sails on it"] },
    { line: "The saw then begins, till the top of the tall giant shivers:", q: "Why is the tree called 'the tall giant'?", a: "It is huge and old", w: ["It is a giant from a story", "It frightens people", "It is the woodcutters' name for it"] },
    { line: "with a shout Job and Ike rush aside.", q: "Why do Job and Ike rush aside?", a: "The tree is about to fall on them", w: ["They are running away from work", "They see an animal", "They are playing a game"] },
  ],
  vocab: [
    { s: "The two executioners stalk along over the knolls,", w: "stalk", meaning: "walk quietly", wrong: ["run loudly", "dance", "crawl"] },
    { s: "The two executioners stalk along over the knolls,", w: "knolls,", meaning: "small hills or mounds", wrong: ["rivers", "villages", "roots"] },
    { s: "And a long limp two-handled saw toothed for cutting great boles,", w: "boles,", meaning: "trunks of trees", wrong: ["branches", "leaves", "axes"] },
    { s: "Jackets doffed they swing axes and chop away just above ground,", w: "doffed", meaning: "removed", wrong: ["buttoned", "torn", "washed"] },
    { s: "Till a broad deep gash in the bark is hewn all the way round,", w: "hewn", meaning: "chopped", wrong: ["painted", "sewn", "measured"] },
    { s: "Then, lastly, the living mast sways, further sways:", w: "mast", meaning: "a tall upright post on a ship", wrong: ["a flag", "a sail", "a rope"] },
  ],
  infer: [
    { line: "The two executioners stalk along over the knolls,", q: "Why are the woodcutters called 'executioners'?", a: "They carry out a death sentence on a living tree", w: ["They are criminals", "They work for the King", "They are angry men"] },
    { line: "And two hundred years' steady growth has been ended in less than two hours.", q: "What contrast does the poet draw?", a: "Two hundred years of growth destroyed in under two hours", w: ["Old trees grow faster", "Woodcutters work slowly", "The tree grew in two hours"] },
    { line: "They edge out the saw, tug the rope; but the tree only quivers,", q: "Is it easy to cut the tree down?", a: "No: it holds on, and takes chopping, sawing and pulling", w: ["Yes: it falls at the first blow", "Yes: it is already dead", "No: they give up"] },
  ],
  claims: [
    { q: "The poet celebrates the woodcutters' skill.", a: "No: he shows the cutting as cruel and sad", w: ["Yes: he praises them", "Yes: he wants more trees cut", "No: he doesn't mention them"] },
    { q: "The title 'Throwing a Tree' suggests something careless and violent.", a: "Yes: a great living tree is simply thrown down", w: ["No: it means planting a tree", "No: it is about a game", "Yes, but only as a joke"] },
    { q: "The tree is described as a living being.", a: "Yes: it is proud, shivers, quivers and is 'the living mast'", w: ["No: it is only wood", "No: it is a ship", "Yes, because it can speak"] },
  ],
  facts: [
    { q: "The woodcutters are named ___", a: "Job and Ike", w: ["Jim and Della", "Pip and Joe", "Ralph and Abbot"] },
    { q: "The chips fall and lie white on ___", a: "the moss and fallen leaves", w: ["the snow", "the river", "the road"] },
    { q: "The tree was cut down in ___", a: "less than two hours", w: ["two days", "two hundred years", "an hour"] },
    { q: "'Throwing a Tree' was written by ___", a: "Thomas Hardy", w: ["Vikram Seth", "T. S. Eliot", "Robert Southey"] },
    { q: "In the poem, the woodcutters are a symbol of ___", a: "death", w: ["hope", "birth", "authority"] },
  ],
  character: [
    { q: "How does the poet show the woodcutters?", a: "As matter-of-fact, even cold, about their work", w: ["As sad and sorry", "As brave heroes", "As lazy men"] },
    { q: "How does the poet feel about the tree's death?", a: "Sad, and troubled by its brutality", w: ["Happy", "Bored", "Proud"] },
  ],
  theme: [
    { q: "What is the main message of 'Throwing a Tree'?", a: "Destroying nature is quick and brutal, though growth takes centuries", w: ["Trees are useless", "Woodcutting is a fine job", "Ships need masts"] },
    { q: "Which literary device is 'executioners' for the woodcutters?", a: "Symbolism", w: ["Alliteration", "Onomatopoeia", "Hyperbole"] },
  ],
};
export const TREE_TEMPLATES = chapterTemplates(TREE);
export const verify = () => verifyChapter(TREE);
