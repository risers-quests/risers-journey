import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 12, The Gift of the Magi (adapted from O. Henry; public domain), English Rose Reader 8: text, glossary and questions. */
const PAIR = ["a. is correct, but b. is false.", "b. is correct, but a. is false.", "Both a. and b. are correct.", "Both a. and b. are false."] as const;
const pair = (a: string, b: string, right: 0 | 1 | 2 | 3) => ({ q: `a. ${a} b. ${b} Which is true?`, a: PAIR[right], w: PAIR.filter((_, k) => k !== right) as unknown as [string, string, string] });

export const MAGI: Chapter = {
  topic: "e8-lit-magi",
  prefix: "mag8",
  kind: "story",
  taps: [
    { s: "One dollar and eighty-seven cents. That was all. Three times Della counted it.", prompt: "Tap how much money Della had.", target: "One dollar and eighty-seven cents." },
    { s: "One was Jim's gold watch that had been his father's and his grandfather's. The other was Della's hair.", prompt: "Tap the two things the Dillingham Youngs were proud of.", target: ["Jim's gold watch", "Della's hair."] },
    { s: "Where she stopped, the sign read: 'Madame Sofronie: Hair Goods of All Kinds.'", prompt: "Tap the name of the shop where Della sold her hair.", target: "Madame Sofronie:" },
    { s: "'Twenty dollars,' said Madame, lifting it expertly.", prompt: "Tap how much Madame paid for the hair.", target: "Twenty dollars," },
    { s: "It was a platinum fob chain simple and chaste in design.", prompt: "Tap what Della bought for Jim.", target: "a platinum fob chain" },
    { s: "For there lay The Combs—the set of combs, side and back, that Della had worshipped long in a Broadway window.", prompt: "Tap where Della had seen the combs.", target: "a Broadway window." },
  ],
  evidence: [
    { s: "There was clearly nothing to do but flop down on the shabby little couch and howl.", prompt: "Tap the word that shows how upset Della was.", target: "howl." },
    { s: "Once she faltered for a minute and stood still while a tear or two splashed on the worn red carpet.", prompt: "Tap the words that show selling her hair was hard for Della.", target: "a tear or two splashed" },
    { s: "Grand as the watch was, he sometimes looked at it on the sly because of the old leather strap it hung on.", prompt: "Tap the words that show why Jim was shy about his watch.", target: "the old leather strap" },
    { s: "He looked thin and serious. Poor fellow—only twenty-two and already carrying the weight of responsibility.", prompt: "Tap the words that show Jim's life was hard.", target: "the weight of responsibility." },
    { s: "'Maybe the hairs of my head were numbered,' she went on with sudden serious sweetness, 'but nobody could ever count my love for you.'", prompt: "Tap the words that show how much Della loves Jim.", target: "nobody could ever count my love for you." },
  ],
  orders: [
    ["Della counts her $1.87 and cries.", "She sells her hair to Madame Sofronie.", "She buys a platinum fob chain for Jim.", "She curls her short hair before Jim comes home.", "Jim gives her the combs."],
    ["Jim stares at Della's short hair.", "Della opens the package and finds the combs.", "Della gives Jim the chain.", "Jim says he sold the watch to buy the combs."],
  ],
  wrongWord: [
    { s: "Della had one dollar and fifty-seven cents.", bad: "fifty-seven", good: "eighty-seven" },
    { s: "Della sold her hair for thirty dollars.", bad: "thirty", good: "twenty" },
    { s: "Della bought Jim a gold fob chain.", bad: "gold", good: "platinum" },
    { s: "Jim sold his coat to buy the combs.", bad: "coat", good: "watch" },
    { s: "The story is set at Diwali.", bad: "Diwali.", good: "Christmas" },
  ],
  rtc: [
    { line: "'You've cut off your hair?' asked Jim, laboriously, as if he had not arrived at that patent fact yet.", q: "Why did Jim speak 'laboriously'?", a: "He was shocked: he had sold his watch to buy combs for that hair", w: ["He was very tired from work", "He was angry with Della", "He had a sore throat"] },
    { line: "'Don't make any mistake, Dell,' he said, 'about me. No haircut or shampoo could make me love you any less.'", q: "What does Jim mean?", a: "He loves her whatever her hair looks like", w: ["He dislikes her new haircut", "He wants her to grow it back", "He is going to buy shampoo"] },
    { line: "'Dell,' said he, 'let's put our Christmas presents away and keep 'em a while. They're too nice to use.'", q: "What did Jim really mean by 'too nice to use'?", a: "They couldn't be used now: the hair and the watch were gone", w: ["They were too expensive to touch", "He didn't like the gifts", "They were meant for next year"] },
    { line: "Of all who give and receive gifts, such as they are wisest. Everywhere they are wisest. They are the magi.", q: "Who are 'they'?", a: "Della and Jim", w: ["The three wise men", "Madame Sofronie and Jim", "The Queen of Sheba and King Solomon"] },
    { line: "'Will you buy my hair?' asked Della.", q: "Why did Della want the money quickly?", a: "She wanted to buy Jim's present before Christmas", w: ["She had to pay the rent", "She needed new clothes", "She wanted to buy food"] },
  ],
  vocab: [
    { s: "Which instigates the moral reflection that life is made up of sobs, sniffles, and smiles, with sniffles predominating.", w: "predominating", meaning: "being the main or the strongest", wrong: ["disappearing", "rare", "funny"] },
    { s: "planning for something fine and rare and sterling", w: "sterling", meaning: "valuable or high quality", wrong: ["cheap", "silver-coloured", "old"] },
    { s: "She was ransacking the stores for Jim's present.", w: "ransacking", meaning: "searching thoroughly", wrong: ["robbing", "leaving", "cleaning"] },
    { s: "simple and chaste in design, properly proclaiming its value by substance alone", w: "chaste", meaning: "without unnecessary decoration", wrong: ["very fancy", "broken", "heavy"] },
    { s: "and not by meretricious ornamentation", w: "meretricious", meaning: "apparently attractive but having no real value", wrong: ["very valuable", "plain", "ancient"] },
    { s: "her intoxication gave way a little to prudence and reason.", w: "prudence", meaning: "acting thoughtfully and carefully", wrong: ["excitement", "anger", "foolishness"] },
    { s: "Out of his trance Jim seemed quickly to wake.", w: "trance", meaning: "a half-conscious state", wrong: ["deep sleep", "anger", "dance"] },
    { s: "they were hers, but the tresses that should have adorned them were gone.", w: "tresses", meaning: "long pieces of women's hair", wrong: ["jewels", "ribbons", "combs"] },
  ],
  infer: [
    { line: "Suddenly, she whirled from the window and stood before the mirror. Her eyes shone, but her face had lost its color within twenty seconds.", q: "Why did her eyes shine but her face lose its colour?", a: "She had thought of a plan, but was afraid of giving up her hair", w: ["She was ill", "She saw Jim coming", "The mirror was cracked"] },
    { line: "He needed a new overcoat and gloves.", q: "Why does the author mention this?", a: "To show how poor Jim was, and how much he gave up for Della", w: ["Because it was very cold that night", "Because Della bought him a coat", "Because Jim was careless"] },
    { line: "And here I have lamely related to you the uneventful chronicle of two foolish children who most unwisely sacrificed for each other their greatest treasures.", q: "Does the narrator really think they were foolish?", a: "No: he goes on to call them the wisest, because they gave out of love", w: ["Yes: they wasted their money", "Yes: they should have bought nothing", "No: he thinks they were rich"] },
    { line: "The magi brought valuable gifts, but that was not among them.", q: "What is 'that' which the magi did not bring?", a: "The love that makes a gift truly valuable", w: ["Gold", "A watch chain", "Combs"] },
  ],
  claims: [
    { q: "Della curled her hair so that Jim wouldn't notice it was short.", a: "No: she curled it to repair the damage, and knew he would notice", w: ["Yes: she wanted to hide it", "Yes: Jim never noticed", "No: she didn't curl it at all"] },
    { q: "The story has a surprise (ironic) ending.", a: "Yes: each sold their treasure to buy a gift for the other's treasure", w: ["No: everything goes as planned", "No: the ending is sad only", "Yes: Jim finds a lot of money"] },
    { q: "Della and Jim were wise.", a: "Yes, says the narrator: they gave out of love, so they are the magi", w: ["No: they were simply foolish", "No: only the magi are wise", "Yes, because they became rich"] },
  ],
  facts: [
    pair("Della used her curling irons to hide the damage done to her hair.", "Della wanted to hide her curls so that Jim would not notice any change in her hair.", 0),
    pair("The fob chain had simple but stylish ornamentation throughout its length.", "The fob chain was very high quality, worthy of The Watch.", 1),
    { q: "Jim's gold watch had belonged to ___", a: "his father and grandfather", w: ["Della's father", "King Solomon", "Madame Sofronie"] },
    { q: "The magi were ___", a: "wise men who brought gifts to the new-born Jesus", w: ["shopkeepers", "kings of Sheba", "Jim's friends"] },
    { q: "'The Gift of the Magi' was written by ___", a: "O. Henry", w: ["Saki", "Charles Dickens", "Premchand"] },
    { q: "O. Henry's stories are famous for ___", a: "their unexpected endings", w: ["their long poems", "being about animals", "being set in India"] },
  ],
  character: [
    { q: "Which words best describe Della?", a: "Loving and self-sacrificing", w: ["Selfish and vain", "Lazy and careless", "Greedy and proud"] },
    { q: "Which words best describe Jim?", a: "Loving, generous and hard-working", w: ["Angry and jealous", "Rich and careless", "Mean and cold"] },
  ],
  theme: [
    { q: "What is the main message of 'The Gift of the Magi'?", a: "True love means giving up what you treasure for someone else", w: ["Money is the best gift", "Never sell your possessions", "Christmas is too expensive"] },
    { q: "Which theme label fits this story?", a: "Love and sacrifice", w: ["War and peace", "Wildlife", "Impermanence of life"] },
  ],
};
export const MAGI_TEMPLATES = chapterTemplates(MAGI);
export const verify = () => verifyChapter(MAGI);
