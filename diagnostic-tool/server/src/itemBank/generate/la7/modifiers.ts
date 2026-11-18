import { Misconceptions, SkillTopic } from "../skillTopic.js";

/** Spectrum Language Arts Grade 7, Lessons 1.18–1.25: adjectives, adverbs, prepositions, conjunctions, interjections. */
export const MISCONCEPTIONS: Misconceptions = {
  "la-adj-adv": { label: "Mixes up adjectives and adverbs", detail: "Writes She sings good / He did bad, or uses an adverb after a linking verb.", childTip: "Adjectives describe nouns (a good song). Adverbs describe verbs, adjectives or adverbs (She sings well). After linking verbs use an adjective: I feel bad." },
  "la-compare": { label: "Gets comparatives and superlatives wrong", detail: "Writes more taller, the most fastest, or uses -est for two things.", childTip: "Two things: -er or more (taller, more careful). Three or more: -est or most (tallest). Never both. Irregular: good–better–best, bad–worse–worst." },
  "la-preposition": { label: "Can't find the preposition or its phrase", detail: "Misses the preposition, or where its phrase ends.", childTip: "A prepositional phrase runs from the preposition to its object: under the old bridge." },
  "la-conjunction": { label: "Mixes up kinds of conjunctions", detail: "Confuses coordinating (and, but, or), subordinating (because, although) and correlative (either…or) conjunctions.", childTip: "FANBOYS (for, and, nor, but, or, yet, so) join equals. Because, although, when, if start a dependent clause. Pairs like either…or, neither…nor, both…and are correlative." },
  "la-word-class": { label: "Mixes up parts of speech", detail: "Names an interjection, intensifier or predicate adjective as another part of speech.", childTip: "Interjections show sudden feeling (Wow!). Intensifiers make a word stronger (very, extremely). A predicate adjective comes after a linking verb (The sky is blue)." },
};

export const MODIFIERS: SkillTopic = {
  topic: "l7-modifiers",
  prefix: "lmd7",
  c1: [
    { s: "The tiny kitten drank warm milk.", prompt: "Tap the two adjectives.", target: ["tiny", "warm"] },
    { s: "The runners moved quickly and quietly.", prompt: "Tap the two adverbs.", target: ["quickly", "quietly."] },
    { s: "The weather was extremely cold today.", prompt: "Tap the intensifier.", target: "extremely", wrong: [{ phrase: "cold", mistake: "la-word-class" }] },
    { s: "The sky looked grey and gloomy.", prompt: "Tap the two predicate adjectives.", target: ["grey", "gloomy."], wrong: [{ phrase: "looked", mistake: "la-word-class" }] },
    { s: "Wow, that fireworks show was amazing!", prompt: "Tap the interjection.", target: "Wow,", wrong: [{ phrase: "amazing!", mistake: "la-word-class" }] },
  ],
  c2: [
    { s: "The cat hid under the old wooden bridge.", prompt: "Tap every word of the prepositional phrase.", target: "under the old wooden bridge.", wrong: [{ phrase: "hid", mistake: "la-preposition" }] },
    { s: "After the match, we walked to the station.", prompt: "Tap the two prepositions.", target: ["After", "to"], wrong: [{ phrase: "walked", mistake: "la-preposition" }] },
    { s: "I wanted to go out, but it was raining.", prompt: "Tap the coordinating conjunction.", target: "but", wrong: [{ phrase: "to", mistake: "la-conjunction" }] },
    { s: "We stayed inside because the storm was strong.", prompt: "Tap the subordinating conjunction.", target: "because", wrong: [{ phrase: "inside", mistake: "la-conjunction" }] },
    { s: "Either Meena or Ravi will bring the snacks.", prompt: "Tap the correlative conjunction (both words).", target: ["Either", "or"], wrong: [{ phrase: "will", mistake: "la-conjunction" }] },
  ],
  c3: [
    { prompt: "Build the sentence comparing two runners.", answer: "Asha | is | faster | than Rohan | .", spares: ["more faster", "fastest"], wrong: [["Asha is more faster than Rohan.", "la-compare"], ["Asha is fastest than Rohan.", "la-compare"]] },
    { prompt: "Build the sentence about the best of all.", answer: "This | is | the best | mango in the basket | .", spares: ["the goodest", "the most best"], wrong: [["This is the goodest mango in the basket.", "la-compare"], ["This is the most best mango in the basket.", "la-compare"]] },
    { prompt: "Build the sentence comparing two stories.", answer: "Her story | was | more interesting | than mine | .", spares: ["interestinger", "most interesting"], wrong: [["Her story was most interesting than mine.", "la-compare"]] },
    { prompt: "Build the sentence comparing three days.", answer: "Sunday | was | the worst | day of the three | .", spares: ["the baddest", "worse"], wrong: [["Sunday was the baddest day of the three.", "la-compare"]] },
  ],
  c4: [
    { prompt: "Build the sentence with the right word.", answer: "She | sings | well | .", spares: ["good"], wrong: [["She sings good.", "la-adj-adv"]] },
    { prompt: "Build the sentence with the right word.", answer: "I | feel | bad | about the mistake | .", spares: ["badly"], wrong: [["I feel badly about the mistake.", "la-adj-adv"]] },
    { prompt: "Build the sentence with the right word.", answer: "The team | played | really well | today | .", spares: ["real good"], wrong: [["The team played real good today.", "la-adj-adv"]] },
    { prompt: "Build the sentence with the right word.", answer: "Drive | carefully | on wet roads | .", spares: ["careful"], wrong: [["Drive careful on wet roads.", "la-adj-adv"]] },
  ],
  c5: [
    { s: "He finished the test quick and left.", bad: "quick", mistake: "la-adj-adv" },
    { s: "This is the most tallest building in town.", bad: "most", mistake: "la-compare" },
    { s: "Of the two sisters, Riya is the oldest.", bad: "oldest.", mistake: "la-compare" },
    { s: "The choir sang beautiful at the concert.", bad: "beautiful", mistake: "la-adj-adv" },
    { s: "My cold is worser today.", bad: "worser", mistake: "la-compare" },
  ],
  p1: [
    { line: "The puppy is [[playful]].", q: "What is the highlighted word?", a: "A predicate adjective", w: ["An adverb", "A preposition", "A verb"], m: "la-word-class" },
    { line: "She answered [[politely]].", q: "What is the highlighted word?", a: "An adverb", w: ["An adjective", "A noun", "A conjunction"], m: "la-adj-adv" },
    { line: "[[Ouch]]! I stubbed my toe.", q: "What is the highlighted word?", a: "An interjection", w: ["An adverb", "A noun", "A verb"], m: "la-word-class" },
    { line: "The film was [[quite]] long.", q: "What is the highlighted word?", a: "An intensifier (an adverb)", w: ["An adjective", "A preposition", "A conjunction"], m: "la-word-class" },
  ],
  p2: [
    { line: "We sat [[beside]] the fire.", q: "What is the highlighted word?", a: "A preposition", w: ["An adverb", "A conjunction", "An adjective"], m: "la-preposition" },
    { line: "I will come [[if]] I finish early.", q: "What kind of conjunction is highlighted?", a: "Subordinating", w: ["Coordinating", "Correlative", "It is a preposition"], m: "la-conjunction" },
    { line: "[[Neither]] the bus [[nor]] the train was on time.", q: "What kind of conjunction is highlighted?", a: "Correlative", w: ["Coordinating", "Subordinating", "Preposition"], m: "la-conjunction" },
    { line: "She was tired, [[yet]] she kept going.", q: "What kind of conjunction is highlighted?", a: "Coordinating", w: ["Subordinating", "Correlative", "Interjection"], m: "la-conjunction" },
  ],
  p3: [
    { line: "Of all the puppies, this one is [[more cuter]].", q: "What should the highlighted words be?", a: "the cutest", w: ["more cute", "cuter", "most cuter"], m: "la-compare" },
    { line: "He speaks French [[good]].", q: "What should the highlighted word be?", a: "well", w: ["gooder", "best", "goodly"], m: "la-adj-adv" },
    { line: "This is the [[baddest]] storm in years.", q: "What should the highlighted word be?", a: "worst", w: ["most bad", "worse", "badder"], m: "la-compare" },
  ],
  p5: [
    { q: "\"In 'I feel bad', 'bad' should be 'badly'.\"", a: "No: 'feel' is a linking verb, so the adjective 'bad' is right", w: ["Yes: always use an adverb after a verb", "Yes: 'bad' is an adverb", "No: it should be 'worse'"], m: "la-adj-adv" },
    { q: "\"'Because' is a coordinating conjunction.\"", a: "No: it is a subordinating conjunction", w: ["Yes: it joins two clauses", "Yes: it is one of FANBOYS", "No: it is a preposition"], m: "la-conjunction" },
    { q: "\"We use 'taller' to compare two people and 'tallest' for three or more.\"", a: "Yes: that is right", w: ["No: 'taller' is for three or more", "No: we always use 'more tall'", "No: they mean the same"], m: "la-compare" },
  ],
  a1: [
    { q: "An adverb can describe ___", a: "a verb, an adjective or another adverb", w: ["only a noun", "only a pronoun", "only a verb"], m: "la-adj-adv" },
    { q: "Coordinating conjunctions are ___", a: "for, and, nor, but, or, yet, so", w: ["because, although, when", "either…or, neither…nor", "in, on, under"], m: "la-conjunction" },
    { q: "A prepositional phrase begins with a preposition and ends with ___", a: "its object, a noun or pronoun", w: ["a verb", "a conjunction", "an exclamation mark"], m: "la-preposition" },
    { q: "To compare three or more things, use ___", a: "-est or 'most'", w: ["-er or 'more'", "both -er and 'more'", "'very'"], m: "la-compare" },
  ],
  a2: [
    { q: "Fill the gap: Of the two answers, Meena's is ___.", a: "better", w: ["best", "more better", "gooder"], m: "la-compare" },
    { q: "Fill the gap: The baby slept ___ through the night.", a: "peacefully", w: ["peaceful", "peace", "more peaceful"], m: "la-adj-adv" },
    { q: "Fill the gap: Everest is the ___ mountain in the world.", a: "highest", w: ["higher", "most high", "most highest"], m: "la-compare" },
    { q: "Fill the gap: I like tea, ___ my brother prefers coffee.", a: "but", w: ["because", "either", "although or"], m: "la-conjunction" },
  ],
  a4: [
    { q: "Which sentence is correct?", a: "She did really well in the exam.", w: ["She did real good in the exam.", "She did real well in the exam.", "She did really good in the exam."], m: "la-adj-adv" },
    { q: "Which sentence is correct?", a: "This puzzle is harder than that one.", w: ["This puzzle is more harder than that one.", "This puzzle is hardest than that one.", "This puzzle is more hardest than that one."], m: "la-compare" },
    { q: "Which sentence uses a correlative conjunction?", a: "Both Anu and Ravi won prizes.", w: ["Anu won a prize, and Ravi did too.", "Anu won because she practised.", "Anu won, so she smiled."], m: "la-conjunction" },
  ],
};
