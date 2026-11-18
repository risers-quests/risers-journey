import { Misconceptions, SkillTopic } from "../skillTopic.js";

/** Spectrum Language Arts Grade 7, Lessons 1.1–1.9: nouns, possessives, appositives, pronouns. */
export const MISCONCEPTIONS: Misconceptions = {
  "la-noun-kind": { label: "Mixes up kinds of nouns", detail: "Confuses common/proper or collective/abstract nouns.", childTip: "Proper nouns name a particular one (Chicago). Collective nouns name a group (herd). Abstract nouns name an idea or feeling (honesty)." },
  "la-possessive": { label: "Gets possessives wrong", detail: "Writes the girls's / the childrens' / the dog's for many dogs.", childTip: "One owner: dog's. Plural ending in s: dogs'. Plural not ending in s: children's." },
  "la-appositive": { label: "Misses or mispunctuates the appositive", detail: "Can't find the noun phrase that renames another noun, or leaves out its commas.", childTip: "An appositive renames the noun next to it: My teacher, Ms Pho, is nice. Commas go around it when it adds extra information." },
  "la-pronoun-case": { label: "Uses the wrong pronoun case", detail: "Writes Me and him went, or between you and I.", childTip: "Subject pronouns do the action (I, he, she, we, they). Object pronouns receive it (me, him, her, us, them). Test each one alone: 'Me went' sounds wrong." },
  "la-pronoun-kind": { label: "Mixes up kinds of pronouns", detail: "Confuses relative, reflexive, intensive and indefinite pronouns.", childTip: "Relative: who, which, that. Reflexive/intensive: myself, themselves. Indefinite: someone, everyone, each." },
  "la-pronoun-shift": { label: "Shifts pronouns in a sentence", detail: "Starts with one person and switches (If one studies, you will pass).", childTip: "Keep the same pronoun all the way through: If you study, you will pass." },
  "la-indefinite-agree": { label: "Uses a plural with a singular indefinite pronoun", detail: "Writes Everyone have their book / Each of the boys are.", childTip: "Everyone, each, someone, nobody are singular: Everyone has a book. Each of the boys is here." },
};

export const NOUNS_PRONOUNS: SkillTopic = {
  topic: "l7-nouns-pronouns",
  prefix: "lnp7",
  c1: [
    { s: "Maya visited Chicago with her family in July.", prompt: "Tap every proper noun.", target: ["Maya", "Chicago", "July."], wrong: [{ phrase: "family", mistake: "la-noun-kind" }] },
    { s: "A herd of cattle crossed the river near Jaipur.", prompt: "Tap the collective noun.", target: "herd", wrong: [{ phrase: "cattle", mistake: "la-noun-kind" }] },
    { s: "Her honesty and courage impressed the whole team.", prompt: "Tap the two abstract nouns.", target: ["honesty", "courage"], wrong: [{ phrase: "team.", mistake: "la-noun-kind" }] },
    { s: "The flock of geese flew over Lake Michigan.", prompt: "Tap every proper noun.", target: ["Lake", "Michigan."], wrong: [{ phrase: "geese", mistake: "la-noun-kind" }] },
    { s: "My cousin, a talented pianist, played at the concert.", prompt: "Tap every word of the appositive.", target: "a talented pianist,", wrong: [{ phrase: "My cousin,", mistake: "la-appositive" }] },
    { s: "Mr Rao, our coach, gave the players a short speech.", prompt: "Tap every word of the appositive.", target: "our coach,", wrong: [{ phrase: "Mr Rao,", mistake: "la-appositive" }] },
  ],
  c2: [
    { s: "Sam and I made the sandwiches ourselves.", prompt: "Tap the reflexive or intensive pronoun.", target: "ourselves.", wrong: [{ phrase: "I", mistake: "la-pronoun-kind" }] },
    { s: "The girl who won the race is my sister.", prompt: "Tap the relative pronoun.", target: "who", wrong: [{ phrase: "my", mistake: "la-pronoun-kind" }] },
    { s: "Everyone in the class brought something for the party.", prompt: "Tap the two indefinite pronouns.", target: ["Everyone", "something"], wrong: [{ phrase: "the", mistake: "la-pronoun-kind" }] },
    { s: "The book that you lent me was exciting.", prompt: "Tap the relative pronoun.", target: "that", wrong: [{ phrase: "you", mistake: "la-pronoun-kind" }] },
    { s: "The coach told us that she herself had played for India.", prompt: "Tap the intensive pronoun.", target: "herself", wrong: [{ phrase: "she", mistake: "la-pronoun-kind" }] },
    { s: "Nobody knew whose umbrella was left behind.", prompt: "Tap the indefinite pronoun.", target: "Nobody", wrong: [{ phrase: "whose", mistake: "la-pronoun-kind" }] },
  ],
  c3: [
    { prompt: "Build the sentence: the toys belong to more than one child.", answer: "The | children's | toys | were everywhere | .", spares: ["childrens'", "child's"], wrong: [["The childrens' toys were everywhere.", "la-possessive"], ["The child's toys were everywhere.", "la-possessive"]] },
    { prompt: "Build the sentence: the bowls belong to two dogs.", answer: "The | dogs' | bowls | were empty | .", spares: ["dog's", "dogs's"], wrong: [["The dog's bowls were empty.", "la-possessive"], ["The dogs's bowls were empty.", "la-possessive"]] },
    { prompt: "Build the sentence: the bicycle belongs to James.", answer: "James's | bicycle | is red | .", spares: ["Jameses'", "James"], wrong: [["Jameses' bicycle is red.", "la-possessive"]], also: ["James' bicycle is red."] },
    { prompt: "Build the sentence: the hats belong to the women.", answer: "The | women's | hats | blew away | .", spares: ["womens'", "woman's"], wrong: [["The womens' hats blew away.", "la-possessive"], ["The woman's hats blew away.", "la-possessive"]] },
  ],
  c4: [
    { prompt: "Build the sentence with the right pronouns.", answer: "Ravi and I | went to | the market | .", spares: ["Ravi and me", "Me and Ravi"], wrong: [["Ravi and me went to the market.", "la-pronoun-case"], ["Me and Ravi went to the market.", "la-pronoun-case"]] },
    { prompt: "Build the sentence with the right pronoun.", answer: "The teacher | gave | Anu and me | a prize | .", spares: ["Anu and I", "I and Anu"], wrong: [["The teacher gave Anu and I a prize.", "la-pronoun-case"], ["The teacher gave I and Anu a prize.", "la-pronoun-case"]] },
    { prompt: "Build the sentence so it agrees.", answer: "Everyone | has | a book | .", spares: ["have"], wrong: [["Everyone have a book.", "la-indefinite-agree"]] },
    { prompt: "Build the sentence without a pronoun shift.", answer: "If you | practise daily, | you | will improve | .", spares: ["one", "they"], wrong: [["If you practise daily, one will improve.", "la-pronoun-shift"], ["If you practise daily, they will improve.", "la-pronoun-shift"]] },
  ],
  c5: [
    { s: "Me and my brother built a treehouse.", bad: "Me", mistake: "la-pronoun-case" },
    { s: "The boy's are playing football in the park.", bad: "boy's", mistake: "la-possessive" },
    { s: "Each of the students have a locker.", bad: "have", mistake: "la-indefinite-agree" },
    { s: "This is a secret between you and I.", bad: "I.", mistake: "la-pronoun-case" },
    { s: "The childrens' books are on the shelf.", bad: "childrens'", mistake: "la-possessive" },
    { s: "When a person is tired, you should rest.", bad: "you", mistake: "la-pronoun-shift" },
  ],
  p1: [
    { line: "The [[jury]] reached its decision after two hours.", q: "What kind of noun is highlighted?", a: "Collective noun", w: ["Proper noun", "Abstract noun", "Possessive noun"], m: "la-noun-kind" },
    { line: "Her [[kindness]] made everyone feel welcome.", q: "What kind of noun is highlighted?", a: "Abstract noun", w: ["Collective noun", "Proper noun", "Concrete noun"], m: "la-noun-kind" },
    { line: "We flew to [[Mumbai]] for the holidays.", q: "What kind of noun is highlighted?", a: "Proper noun", w: ["Common noun", "Abstract noun", "Collective noun"], m: "la-noun-kind" },
    { line: "A [[swarm]] of bees buzzed around the hive.", q: "What kind of noun is highlighted?", a: "Collective noun", w: ["Abstract noun", "Proper noun", "Pronoun"], m: "la-noun-kind" },
    { line: "[[Freedom]] is worth fighting for.", q: "What kind of noun is highlighted?", a: "Abstract noun", w: ["Proper noun", "Collective noun", "Verb"], m: "la-noun-kind" },
  ],
  p2: [
    { line: "I baked the cake [[myself]].", q: "What kind of pronoun is highlighted?", a: "Intensive (it stresses who did it)", w: ["Relative", "Indefinite", "Interrogative"], m: "la-pronoun-kind" },
    { line: "The dog hurt [[itself]] on the fence.", q: "What kind of pronoun is highlighted?", a: "Reflexive (the action comes back to the subject)", w: ["Relative", "Indefinite", "Possessive"], m: "la-pronoun-kind" },
    { line: "The painting [[which]] hangs in the hall is old.", q: "What kind of pronoun is highlighted?", a: "Relative", w: ["Reflexive", "Indefinite", "Personal"], m: "la-pronoun-kind" },
    { line: "[[Somebody]] left the gate open.", q: "What kind of pronoun is highlighted?", a: "Indefinite", w: ["Relative", "Reflexive", "Possessive"], m: "la-pronoun-kind" },
    { line: "The player [[whose]] shoe came off kept running.", q: "What kind of pronoun is highlighted?", a: "Relative", w: ["Indefinite", "Intensive", "Personal"], m: "la-pronoun-kind" },
  ],
  p3: [
    { line: "Our neighbour, [[a retired pilot]], tells great stories.", q: "What does the highlighted part do?", a: "It renames 'our neighbour' (an appositive)", w: ["It is the subject of the sentence", "It shows who owns something", "It is a verb phrase"], m: "la-appositive" },
    { line: "The game's [[final]] score surprised us.", q: "What does the apostrophe in \"game's\" show?", a: "The score belongs to one game", w: ["There are many games", "A letter is missing", "It is a plural"], m: "la-possessive" },
    { line: "The [[players']] uniforms were muddy.", q: "What does the highlighted word tell us?", a: "The uniforms belong to more than one player", w: ["The uniforms belong to one player", "A letter is missing", "It is wrongly spelt"], m: "la-possessive" },
    { line: "My favourite author, [[Ruskin Bond]], lives in Mussoorie.", q: "Why are there commas around the highlighted words?", a: "They are an appositive adding extra information", w: ["They are a list", "They are a quotation", "They are the main verb"], m: "la-appositive" },
  ],
  p4: [
    { line: "If [[one]] works hard, [[you]] will succeed.", q: "What is wrong with the highlighted pronouns?", a: "They shift from 'one' to 'you'", w: ["Nothing: they are right", "They should both be 'I'", "They are both object pronouns"], m: "la-pronoun-shift" },
    { line: "[[Him and me]] cleaned the classroom.", q: "What is wrong with the highlighted words?", a: "They should be subject pronouns: He and I", w: ["Nothing: they are right", "They should be 'His and mine'", "They should be 'Himself and myself'"], m: "la-pronoun-case" },
    { line: "[[Everybody]] [[were]] invited to the wedding.", q: "What is wrong here?", a: "Everybody is singular, so it should be 'was'", w: ["Nothing: it is right", "It should be 'Everybody are'", "Everybody is plural, so 'were' is right"], m: "la-indefinite-agree" },
    { line: "The coach praised [[Leena and I]].", q: "What is wrong with the highlighted words?", a: "'I' should be 'me', the object pronoun", w: ["Nothing: it is right", "Leena should be 'Leena's'", "'I' should be 'myself'"], m: "la-pronoun-case" },
  ],
  p5: [
    { q: "\"Childrens' is the plural possessive of child.\"", a: "No: it is children's, because 'children' doesn't end in s", w: ["Yes: always add s'", "Yes: it is a common noun", "No: it is childs'"], m: "la-possessive" },
    { q: "\"'Herd' is a collective noun.\"", a: "Yes: it names a group of animals", w: ["No: it is an abstract noun", "No: it is a verb", "No: it is a proper noun"], m: "la-noun-kind" },
    { q: "\"'Each of the girls are ready' is correct.\"", a: "No: 'each' is singular, so it should be 'is'", w: ["Yes: 'girls' is plural", "Yes: it sounds right", "No: it should be 'Each of the girl'"], m: "la-indefinite-agree" },
    { q: "\"'Between you and me' is correct.\"", a: "Yes: after 'between', use the object pronoun 'me'", w: ["No: it should be 'you and I'", "No: it should be 'you and myself'", "No: it should be 'yourself and I'"], m: "la-pronoun-case" },
  ],
  a1: [
    { q: "An abstract noun names ___", a: "an idea, quality or feeling (honesty, joy)", w: ["a group (herd, team)", "a particular person or place (Delhi)", "something you can touch (table)"], m: "la-noun-kind" },
    { q: "An appositive is ___", a: "a noun or noun phrase that renames the noun next to it", w: ["a word that joins two clauses", "a verb that shows action", "a noun that shows ownership"], m: "la-appositive" },
    { q: "Reflexive pronouns end in ___", a: "-self or -selves", w: ["-ever", "-one or -body", "-ly"], m: "la-pronoun-kind" },
    { q: "A relative pronoun (who, whom, whose, which, that) ___", a: "begins a clause that describes a noun", w: ["always asks a question", "replaces a whole sentence", "shows the action is done to oneself"], m: "la-pronoun-kind" },
    { q: "'Everyone', 'each' and 'nobody' take ___", a: "a singular verb (Everyone is here)", w: ["a plural verb (Everyone are here)", "no verb", "an -ing verb only"], m: "la-indefinite-agree" },
  ],
  a2: [
    { q: "Fill the gap: The ___ (plural of 'baby') toys were noisy.", a: "babies'", w: ["baby's", "babys'", "babies's"], m: "la-possessive" },
    { q: "Fill the gap: My sister and ___ went shopping.", a: "I", w: ["me", "myself", "mine"], m: "la-pronoun-case" },
    { q: "Fill the gap: Please give the tickets to Raj and ___.", a: "me", w: ["I", "myself", "mine"], m: "la-pronoun-case" },
    { q: "Fill the gap: Neither of the boys ___ his homework.", a: "has finished", w: ["have finished", "are finished", "were finishing"], m: "la-indefinite-agree" },
    { q: "Fill the gap: The athletes trained ___ for the race.", a: "themselves", w: ["theirselves", "themself", "itself"], m: "la-pronoun-kind" },
  ],
  a4: [
    { q: "Which sentence is correct?", a: "The men's coats were hung in the hall.", w: ["The mens' coats were hung in the hall.", "The mens coats were hung in the hall.", "The man's coats were hung in the halls'."], m: "la-possessive" },
    { q: "Which sentence is correct?", a: "She and I are best friends.", w: ["Her and me are best friends.", "Me and her are best friends.", "Her and I are best friends."], m: "la-pronoun-case" },
    { q: "Which sentence has no pronoun shift?", a: "When we arrived, we saw the parade.", w: ["When we arrived, you could see the parade.", "When one arrives, we see the parade.", "When they arrived, you saw the parade."], m: "la-pronoun-shift" },
    { q: "Which sentence punctuates the appositive correctly?", a: "Our principal, Mrs Das, spoke first.", w: ["Our principal Mrs Das, spoke first.", "Our principal, Mrs Das spoke first.", "Our, principal Mrs Das spoke first."], m: "la-appositive" },
    { q: "Which sentence is correct?", a: "Somebody has left his or her bag here.", w: ["Somebody have left their bag here.", "Somebody are leaving bags here.", "Somebody have leaving his bag here."], m: "la-indefinite-agree" },
  ],
};
