// Grade 4: topics offered one by one, in the Grade 4 book's order and words
// (ids match the server's GRADE4_TOPICS). Add a line here as each chapter is ready.
export const GRADE4_TOPIC_CHOICES = [
  { id: "more-large-numbers", chapter: "Chapter 1", name: "Large Numbers", about: "Number names, place and face value, comparing, rounding, Roman numerals" },
  { id: "g4-addsub", chapter: "Chapter 2", name: "Addition and Subtraction", about: "Up to 6 digits with regrouping, word problems, estimating sums and differences" },
  { id: "g4-mult", chapter: "Chapter 3", name: "Multiplication", about: "× 10 to 10,000, properties, tables of 11–15, the grid method, 3- and 4-digit products, estimating" },
  { id: "g4-div", chapter: "Chapter 4", name: "Division", about: "÷ 10, 100, 1000; 3-digit ÷ 2-digit; 4-digit ÷ 1- and 2-digit; properties; estimating" },
  { id: "factors-multiples", chapter: "Chapter 5", name: "Factors and Multiples", about: "Factors, multiples, common factors and multiples, prime numbers" },
  { id: "four-operations-fractions", chapter: "Chapter 6", name: "Fractions", about: "Equivalent fractions, simplest form, comparing, adding and subtracting, mixed fractions" },
  { id: "decimals", chapter: "Chapter 7", name: "Decimals", about: "Tenths, hundredths and thousandths, number discs, place value, decimals as fractions" },
  { id: "g4-shapes", chapter: "Chapter 8", name: "Shapes", about: "Open and closed figures, polygons, line segments, parts of a circle, tangrams, nets, views" },
  { id: "g4-measure", chapter: "Chapter 9", name: "Measurement", about: "m, cm, mm, km; kg and g; L and mL; converting, adding, subtracting, estimating" },
  { id: "g4-area", chapter: "Chapter 10", name: "Perimeter and Area", about: "Perimeter of rectangles, squares, triangles and closed figures; area of regular and irregular shapes" },
  { id: "g4-time", chapter: "Chapter 11", name: "Time", about: "Time to the minute, 12- and 24-hour clock, durations, leap years, days between dates" },
  { id: "g4-money", chapter: "Chapter 12", name: "Money", about: "Rupees and paise, the four operations with money, bills" },
  { id: "g4-data", chapter: "Chapter 13", name: "Data Handling", about: "Bar graphs, pie charts, drawing conclusions" },
  { id: "g4-patterns", chapter: "Chapter 14", name: "Patterns and Symmetry", about: "Number patterns, tiling, lines of symmetry, symmetric figures, mirror images" },
];

// Grade 8 (Selina Concise Mathematics 8): chapters offered one by one, in
// the book's order (ids match the server's GRADE8_TOPICS). Add a line as each is ready.
export const GRADE8_TOPIC_CHOICES = [
  { id: "g8-rational-numbers", chapter: "Chapter 1", name: "Rational Numbers", about: "On the number line, comparing, between two numbers, the four operations, reciprocals" },
  { id: "g8-exponents", chapter: "Chapter 2", name: "Exponents (Powers)", about: "Laws of exponents, zero and negative powers, powers of 10" },
  { id: "g8-squares", chapter: "Chapter 3", name: "Squares and Square Roots", about: "Square numbers, roots by prime factors, decimals, smallest multiplier" },
  { id: "g8-cubes", chapter: "Chapter 4", name: "Cubes and Cube Roots", about: "Cube numbers, cube roots, negative cubes, smallest multiplier" },
  { id: "g8-playing-numbers", chapter: "Chapter 5", name: "Playing with Numbers", about: "Numbers in general form, swapped digits, tests for 3 and 9, puzzles" },
  { id: "g8-sets", chapter: "Chapter 6", name: "Sets", about: "Union, intersection, complement, disjoint sets, Venn diagrams" },
  { id: "g8-percent", chapter: "Chapter 7", name: "Percent and Percentage", about: "Percent of any whole, finding the whole, percentage change, one change after another" },
  { id: "g8-profit-loss", chapter: "Chapter 8", name: "Profit, Loss and Discount", about: "Profit and loss %, overheads, discount, GST after discount" },
  { id: "g8-interest", chapter: "Chapter 9", name: "Interest", about: "Simple and compound interest, yearly and half-yearly" },
  { id: "g8-variation", chapter: "Chapter 10", name: "Direct and Inverse Variations", about: "Unit method, workers and days, speed and time, time and work" },
  { id: "g8-expressions", chapter: "Chapter 11", name: "Algebraic Expressions", about: "Like terms, value, adding and subtracting, multiplying, dividing" },
  { id: "g8-identities", chapter: "Chapter 12", name: "Identities", about: "(a ± b)², a² − b², using them to work things out" },
  { id: "g8-factorisation", chapter: "Chapter 13", name: "Factorisation", about: "Common factor, perfect squares, a² − b², x² + px + q" },
  { id: "g8-linear-equations", chapter: "Chapter 14", name: "Linear Equations", about: "Solving, brackets, x on both sides, word problems" },
  { id: "g8-inequations", chapter: "Chapter 15", name: "Linear Inequations", about: "On the number line, solving, when the sign flips, solution sets" },
  { id: "g8-shapes", chapter: "Chapter 16", name: "Understanding Shapes", about: "Angle sums of quadrilaterals and polygons, exterior angles, regular polygons" },
  { id: "g8-quadrilaterals", chapter: "Chapter 17", name: "Special Types of Quadrilaterals", about: "Parallelogram, rectangle, rhombus, square: angles and diagonals" },
  { id: "g8-constructions", chapter: "Chapter 18", name: "Constructions", about: "What's needed to construct a quadrilateral, and when it's impossible" },
  { id: "g8-solids", chapter: "Chapter 19", name: "Representing 3-D in 2-D", about: "Faces, vertices, edges, prisms and pyramids, Euler's relation" },
  { id: "g8-symmetry", chapter: "Chapter 20", name: "Symmetry", about: "Lines of symmetry, reflection, rotational symmetry and its order" },
  { id: "g8-circles", chapter: "Chapter 21", name: "Circles", about: "Radius, diameter, chord, arc, sector, segment" },
  { id: "g8-area", chapter: "Chapter 22", name: "Area of a Trapezium and a Polygon", about: "Trapeziums, shapes split into parts, semicircles" },
  { id: "g8-volume", chapter: "Chapter 23", name: "Surface Area, Volume and Capacity", about: "Cube, cuboid and cylinder; litres" },
  { id: "g8-data", chapter: "Chapter 24", name: "Data Handling", about: "Grouping data into classes, bar graphs, pie charts" },
  { id: "g8-probability", chapter: "Chapter 25", name: "Probability", about: "Coins, dice, cards and spinners; experiments; 'not'" },
];

// Grade 8 English (English Rose Reader 8): topics offered one by one (ids
// match the server's ENGLISH8_TOPICS). "chapter" is the reader chapter the
// grammar comes with (Scope and Sequence). Add a line as each is ready.
export const ENGLISH8_TOPIC_CHOICES = [
  { id: "e8-lit-winter-oak", chapter: "Literature · Ch 1", name: "The Winter Oak", about: "Yuri Nagibin's story: Anna Vasilyevna, Savushkin and the forest" },
  { id: "e8-lit-dont-quit", chapter: "Literature · Ch 2", name: "Don't Quit", about: "Edgar Albert Guest's poem about perseverance" },
  { id: "e8-lit-corner-shop", chapter: "Literature · Ch 3", name: "The Corner Shop", about: "Cynthia Asquith's ghost story: the jade frog and the old man" },
  { id: "e8-lit-inchcape", chapter: "Literature · Ch 4", name: "The Inchcape Rock", about: "Robert Southey's ballad: the Abbot's bell and Sir Ralph the Rover" },
  { id: "e8-lit-dusk", chapter: "Literature · Ch 5", name: "Dusk", about: "Saki's story: Gortsby, the young man and the cake of soap" },
  { id: "e8-lit-drum-dream", chapter: "Literature · Ch 6", name: "Drum Dream Girl", about: "Margarita Engle's poem about a girl who dared to drum" },
  { id: "e8-lit-salaam", chapter: "Literature · Ch 7", name: "Salaam Namaste", about: "Sudha Murty's story: Sheikh Mohammed, Zubeida and Tabassum" },
  { id: "e8-lit-gift-india", chapter: "Literature · Ch 8", name: "The Gift of India", about: "Sarojini Naidu's poem honouring Indian soldiers of World War I" },
  { id: "e8-lit-tiger", chapter: "Literature · Ch 9", name: "Monitoring the Tiger", about: "Pugmarks, camera traps and radio telemetry in Ranthambore" },
  { id: "e8-lit-ozymandias", chapter: "Literature · Ch 10", name: "Ozymandias", about: "Shelley's poem about a ruined statue and the end of pride" },
  { id: "e8-lit-game", chapter: "Literature · Ch 11", name: "The Game", about: "Premchand's story: Fundan, Jatin the hawker and a basket of stones" },
  { id: "e8-lit-magi", chapter: "Literature · Ch 12", name: "The Gift of the Magi", about: "O. Henry's story: Della's hair, Jim's watch, and two gifts" },
  { id: "e8-lit-macavity", chapter: "Literature · Ch 13", name: "Macavity, the Mystery Cat", about: "T. S. Eliot's humorous poem about the Napoleon of Crime" },
  { id: "e8-lit-caesar", chapter: "Literature · Ch 14", name: "Julius Caesar", about: "Shakespeare: Calpurnia's dream and Caesar's choice (Act II Scene II)" },
  { id: "e8-lit-expectations", chapter: "Literature · Ch 15", name: "Great Expectations", about: "Dickens, graphic novel: Pip, the convict and the marshes" },
  { id: "e8-lit-tree", chapter: "Literature · Ch 16", name: "Throwing a Tree", about: "Thomas Hardy's poem about two woodcutters felling a 200-year-old tree" },
  { id: "e8-lit-name", chapter: "Literature · Ch 17", name: "Choosing a Name", about: "From Jhumpa Lahiri's The Namesake: Gogol's first day of school" },
  { id: "e8-lit-louse", chapter: "Literature · Ch 18", name: "The Louse and the Mosquito", about: "Vikram Seth's fable of trust and betrayal in the King's bed" },
  { id: "e8-clauses", chapter: "Grammar · Ch 1", name: "Dependent and Independent Clauses", about: "Which clause stands alone; noun, adjective and adverb clauses; who, which, whose, where" },
  { id: "e8-purpose", chapter: "Grammar · Ch 3", name: "Words as Nouns and Verbs; Adverb Clauses of Purpose", about: "a watch / we watch; so that, in order that, lest; purpose or result" },
  { id: "e8-participles", chapter: "Grammar · Ch 5", name: "Participles and Gerunds", about: "-ing words as nouns and adjectives, -ing after prepositions, joining with a participle, -ing / -ed feelings" },
  { id: "e8-infinitives", chapter: "Grammar · Ch 7", name: "Forms of Have; Infinitive and Bare Infinitive", about: "What have means (own, has done, have to, had it done), to + verb or the verb alone" },
  { id: "e8-sentences", chapter: "Grammar · Ch 11–12", name: "Simple, Compound and Complex Sentences", about: "Clauses, joining words, and changing one kind of sentence into another" },
  { id: "e8-voice", chapter: "Grammar · Ch 14", name: "Active and Passive Voice", about: "Doer and receiver, be + past participle in every tense, active ↔ passive" },
  { id: "e8-speech", chapter: "Grammar · Ch 15", name: "Direct and Indirect Speech", about: "Statements, questions and commands; tense, pronoun and time-word changes, both ways" },
  { id: "e8-conditionals", chapter: "Grammar · Ch 17", name: "Conditionals", about: "First, second and third conditionals: making them from prompts, what they mean" },
  { id: "e8-words", chapter: "Vocabulary", name: "Word Study", about: "Homophones, homonyms, synonyms and antonyms, prefixes and suffixes, confused words, loanwords" },
  { id: "e8-idioms", chapter: "Vocabulary", name: "Idioms, Proverbs and Compound Words", about: "Ship and sailing idioms, Shakespearean idioms and proverbs, compound words" },
  { id: "e8-figures", chapter: "Appreciating the poem", name: "Figures of Speech", about: "Simile, metaphor, personification, alliteration, onomatopoeia, hyperbole, irony, synecdoche" },
  { id: "e8-punctuation", chapter: "Punctuation", name: "Punctuation", about: "Capitals, end marks, commas, apostrophes, inverted commas, colon, hyphen" },
  { id: "e8-spelling", chapter: "Spelling · Pronunciation", name: "Spelling and Pronunciation", about: "ie / ei, doubling, -tion / -sion, -ance / -ence, dis-, British spelling, syllables and stress, -ed sounds" },
];

// The book's strands, as offered on the start page.
export const STRAND_CHOICES = [
  { name: "Number & Algebra", topics: ["Large numbers", "Operations on large numbers", "Factors and multiples", "Fractions and division", "Four operations of fractions", "Decimals"] },
  { name: "Measurement & Geometry", topics: ["Geometry", "Measurement", "Perimeter and area", "Volume and nets", "Time and temperature", "Patterns and symmetry"] },
  { name: "Ratio & Proportion", topics: ["Life mathematics", "Scales and directions"] },
  { name: "Data Handling", topics: ["Data handling"] },
];

// Grade 7 Language Arts (Spectrum Language Arts Grade 7) and Writing
// (Spectrum Writing Grade 7): topics offered one by one, in book order
// (ids match the server's LA7 and W7 banks).
export const LA7_TOPIC_CHOICES = [
  { id: "l7-nouns-pronouns", chapter: "Lessons 1.1–1.9", name: "Nouns and Pronouns", about: "Common, proper, collective and abstract nouns; possessives; appositives; kinds of pronouns; pronoun shifts" },
  { id: "l7-verbs", chapter: "Lessons 1.10–1.17", name: "Verbs and Verb Tenses", about: "Action, linking and helping verbs; agreement; gerunds, participles, infinitives; progressive and perfect tenses" },
  { id: "l7-modifiers", chapter: "Lessons 1.18–1.25", name: "Adjectives, Adverbs, Prepositions and Conjunctions", about: "Comparing, adjective or adverb, intensifiers, prepositional phrases, conjunctions, interjections" },
  { id: "l7-sentences", chapter: "Chapter 2", name: "Sentences", about: "Sentence types; simple, compound and complex; adjective and adverb clauses; run-ons and fragments" },
  { id: "l7-capitals", chapter: "Chapter 3", name: "Capitalization", about: "Sentences and quotations, letter parts, names, titles, places, other proper nouns" },
  { id: "l7-punctuation", chapter: "Chapter 4", name: "Punctuation", about: "End marks, commas, semicolons and colons, quotation marks, apostrophes, hyphens, dashes, parentheses, italics" },
  { id: "l7-usage", chapter: "Chapter 5", name: "Usage", about: "Dangling and misplaced modifiers, double negatives, wordiness, redundancies" },
  { id: "l7-words", chapter: "Chapter 6", name: "Word Study", about: "Roots, prefixes, suffixes, synonyms, homophones, multiple meanings, connotations, figurative language, analogies, allusions" },
];
export const W7_TOPIC_CHOICES: typeof LA7_TOPIC_CHOICES = [
  { id: "w7-paragraphs", chapter: "Chapter 1", name: "Foundations of Writing", about: "Audience, main ideas and details, staying on topic, proofreading, paragraphs, active voice" },
  { id: "w7-narrative", chapter: "Chapter 2", name: "Writing a Narrative", about: "Order of events, point of view, sensory and precise details, dialogue, showing not telling" },
  { id: "w7-informational", chapter: "Chapter 3", name: "Writing to Inform", about: "Spatial, compare-and-contrast and cause-and-effect organisation, directions, explanatory writing" },
  { id: "w7-opinion", chapter: "Chapter 4", name: "Writing an Argument", about: "Facts, opinions and bias, emotional appeals, advertising, claims, order of importance, audience" },
  { id: "w7-research", chapter: "Chapter 3 (research)", name: "Research and Sources", about: "Reliable sources, quoting and paraphrasing, citing, notes, works cited" },
];
// Grade 7 Maths: chapters offered one by one (ids match the server's GRADE7 templates).
export const GRADE7_TOPIC_CHOICES: typeof LA7_TOPIC_CHOICES = [
  { id: "g7-integers", chapter: "Chapter 1", name: "Integers", about: "Properties, adding, subtracting, multiplying and dividing integers" },
  { id: "g7-fractions", chapter: "Chapter 2", name: "Fractions", about: "Kinds of fractions, the four operations, 'of', reciprocals, word problems" },
  { id: "g7-decimals", chapter: "Chapter 3", name: "Decimals", about: "Multiplying and dividing decimals; by 10, 100 and 1000" },
  { id: "g7-rational", chapter: "Chapter 4", name: "Rational Numbers", about: "On the number line, between two numbers, the four operations" },
  { id: "g7-exponents", chapter: "Chapter 5", name: "Powers and Exponents", about: "Base and exponent, laws of exponents, standard form" },
  { id: "g7-expressions", chapter: "Chapter 6", name: "Algebraic Expressions", about: "Terms, coefficients, like terms, adding and subtracting, substituting" },
  { id: "g7-equations", chapter: "Chapter 7", name: "Linear Equations", about: "Solving equations in one variable and word problems" },
  { id: "g7-ratio", chapter: "Chapter 8", name: "Ratio and Proportion", about: "Ratios, proportion, the unitary method" },
  { id: "g7-percent", chapter: "Chapter 9", name: "Percentage and Its Applications", about: "Percent of a quantity, the whole from a part, increase and decrease" },
  { id: "g7-angles", chapter: "Chapter 10", name: "Lines and Angles", about: "Complementary, supplementary, vertically opposite, angles at parallel lines" },
  { id: "g7-triangles", chapter: "Chapter 11 & 15", name: "Properties of Triangles", about: "Angle sum, exterior angle, sides rule, Pythagoras, kinds, constructing" },
  { id: "g7-symmetry", chapter: "Chapter 12", name: "Symmetry", about: "Lines of symmetry, reflection, rotational symmetry and its order" },
  { id: "g7-solids", chapter: "Chapter 13", name: "Visualising Solid Shapes", about: "Faces, edges and vertices, nets, views of solids" },
  { id: "g7-congruence", chapter: "Chapter 14", name: "Congruence of Triangles", about: "SSS, SAS, ASA, RHS and corresponding parts" },
  { id: "g7-area", chapter: "Chapter 16", name: "Perimeter and Area", about: "Rectangles, squares, triangles, parallelograms, circles, paths" },
  { id: "g7-data", chapter: "Chapter 17", name: "Data Handling", about: "Organising data, bar graphs, pie charts" },
  { id: "g7-probability", chapter: "Chapter 18", name: "Probability", about: "Coins, dice, cards and spinners" },
];

// Grade 4 Writing (Spectrum Writing Grade 4); Chapter 1 split in two.
export const W4_TOPIC_CHOICES: typeof LA7_TOPIC_CHOICES = [
  { id: "w4-words", chapter: "Chapter 1", name: "Words and Sentences", about: "Precise nouns, strong verbs, adjectives, adverbs, time order, shades of meaning, conjunctions" },
  { id: "w4-proofreading", chapter: "Chapter 1", name: "Proofreading", about: "Capitals, commas, dialogue punctuation, spelling, subject-verb agreement" },
  { id: "w4-narrative", chapter: "Chapter 2", name: "Writing a Narrative", about: "Senses, imagery, story elements, dialogue, characters, point of view" },
  { id: "w4-inform", chapter: "Chapter 3", name: "Writing to Inform", about: "Letters, comparing, cause and effect, instructions, main idea, topic sentences" },
  { id: "w4-opinion", chapter: "Chapter 4", name: "Writing an Opinion", about: "Fact and opinion, reasons, emotional appeal, bias, slogans, business letters" },
];

// Grade 3 Maths (CPA Maths 3, Macmillan): chapters offered one by one, in the book's order.
export const GRADE3_TOPIC_CHOICES: typeof LA7_TOPIC_CHOICES = [
  { id: "g3-numbers", chapter: "Chapter 1", name: "Large Numbers", about: "4-digit numbers: names, place and face value, comparing, largest and smallest, rounding" },
  { id: "g3-addsub", chapter: "Chapter 2", name: "Addition and Subtraction", about: "3- and 4-digit numbers with regrouping, properties, estimating" },
  { id: "g3-mult", chapter: "Chapter 3", name: "Multiplication", about: "Tables of 6 to 9, number line, properties, 3-digit by 1- and 2-digit, word problems" },
  { id: "g3-div", chapter: "Chapter 4", name: "Division", about: "Repeated subtraction, number line, properties, dividing by 1 digit, checking, word problems" },
  { id: "g3-fractions", chapter: "Chapter 5", name: "Fractions", about: "Numerator and denominator, one-half, one-third, one-quarter, fractions of a figure" },
  { id: "g3-shapes", chapter: "Chapter 6", name: "Shapes", about: "Point, line, segment, ray; plane and solid shapes; dot grids, tangrams, simple maps" },
  { id: "g3-measure", chapter: "Chapter 7", name: "Measurement", about: "Units of length, weight and capacity, converting, adding and subtracting, conservation" },
  { id: "g3-time", chapter: "Chapter 8", name: "Time", about: "Time to 5 minutes, days, weeks, months and years, calendars, time order" },
  { id: "g3-money", chapter: "Chapter 9", name: "Money", about: "Rupees and paise, adding, subtracting, multiplying, dividing, bills" },
  { id: "g3-data", chapter: "Chapter 10", name: "Data Handling", about: "Tally marks, pictographs with a scale, bar graphs, conclusions" },
  { id: "g3-patterns", chapter: "Chapter 11", name: "Patterns and Symmetry", about: "Number, letter and shape patterns, lines of symmetry, tiling" },
];

// Grade 4 Language Arts (Spectrum Language Arts Grade 4).
export const LA4_TOPIC_CHOICES: typeof LA7_TOPIC_CHOICES = [
  { id: "l4-nouns-verbs", chapter: "Chapter 1", name: "Nouns, Pronouns and Verbs", about: "Common and proper nouns, pronouns, action, helping and linking verbs" },
  { id: "l4-modifiers", chapter: "Chapter 1", name: "Adjectives, Adverbs and More", about: "Adjectives, adverbs, articles, prepositions, conjunctions" },
  { id: "l4-sentences", chapter: "Chapter 1", name: "Sentences", about: "Sentence types, subject, predicate, direct object, fragments, compound, run-ons, combining" },
  { id: "l4-capitals", chapter: "Chapter 2", name: "Capitalization", about: "Names, titles, places, dates, holidays, book, movie and song titles" },
  { id: "l4-punctuation", chapter: "Chapter 2", name: "Punctuation", about: "End marks, abbreviations, commas, dialogue, titles, colons" },
  { id: "l4-verbs", chapter: "Chapter 3", name: "Verb Usage", about: "Subject-verb agreement, past and future tense, tricky verbs, contractions, double negatives" },
  { id: "l4-nouns-usage", chapter: "Chapter 3", name: "Plurals, Possessives and Comparisons", about: "Plurals, possessives, subject and object pronouns, comparative adjectives and adverbs" },
  { id: "l4-words", chapter: "Chapter 3", name: "Word Study and Figurative Language", about: "Synonyms, antonyms, homophones, multiple meanings, similes, metaphors, personification, idioms" },
];

// Grade 3 Writing (Spectrum Writing Grade 3); Chapter 1 split in two.
export const W3_TOPIC_CHOICES: typeof LA7_TOPIC_CHOICES = [
  { id: "w3-foundations", chapter: "Chapter 1", name: "Main Idea, Purpose and Organising", about: "Main idea and details, author's purpose, text structures, organising by topic, time-order words" },
  { id: "w3-proofreading", chapter: "Chapter 1", name: "Complete Sentences and Proofreading", about: "Fragments and run-ons, capitals, end and inside punctuation, word mistakes, subject-verb agreement" },
  { id: "w3-narrative", chapter: "Chapter 2", name: "Writing a Narrative", about: "Senses, varied sentences, similes, time order, titles, setting, dialogue" },
  { id: "w3-inform", chapter: "Chapter 3", name: "Writing to Inform", about: "Friendly letters, instructions, audience, comparing, spatial order, linking words, main idea, news reports" },
  { id: "w3-opinion", chapter: "Chapter 4", name: "Writing an Opinion", about: "Fact and opinion, reasons, linking words, examples, opinion paragraphs" },
];

// Grade 6 Language Arts (Spectrum Language Arts Grade 6).
export const LA6_TOPIC_CHOICES: typeof LA7_TOPIC_CHOICES = [
  { id: "l6-nouns-pronouns", chapter: "Chapter 1", name: "Nouns and Pronouns", about: "Common, proper and plural nouns; personal, intensive, demonstrative, relative and indefinite pronouns; pronoun shifts" },
  { id: "l6-verbs", chapter: "Chapter 1", name: "Verbs and Verbals", about: "Present and past tense, agreement, action, helping, linking and transitive verbs, gerunds, participles, infinitives" },
  { id: "l6-modifiers", chapter: "Chapter 1", name: "Modifiers and Joiners", about: "Adjectives, adverbs, conjunctions, interjections, prepositional phrases, articles" },
  { id: "l6-sentences", chapter: "Chapter 2", name: "Sentences", about: "Four sentence types, simple, compound and complex sentences, fragments, combining" },
  { id: "l6-capitals", chapter: "Chapter 3", name: "Capitalization", about: "Days, months, events, languages, teams, organisations, government, regions, titles, places" },
  { id: "l6-punctuation", chapter: "Chapter 4", name: "End Marks and Commas", about: "Periods, abbreviations, initials, question and exclamation marks, commas, set-off dialogue" },
  { id: "l6-marks", chapter: "Chapter 4", name: "Other Punctuation", about: "Quotation marks, apostrophes, colons, semicolons, hyphens, dashes, parentheses" },
  { id: "l6-usage", chapter: "Chapter 5", name: "Usage", about: "Subjective and objective pronouns, tricky verbs, adjectives and adverbs, double negatives" },
  { id: "l6-words", chapter: "Chapter 6", name: "Word Study", about: "Synonyms, antonyms, analogies, homophones, homographs, connotation, figures of speech, roots and affixes" },
];

// Grade 6 Writing (Spectrum Writing Grade 6); Chapters 2 and 3 split in two.
export const W6_TOPIC_CHOICES: typeof LA7_TOPIC_CHOICES = [
  { id: "w6-foundations", chapter: "Chapter 1", name: "Foundations of Writing", about: "Purpose, audience, main idea, staying on topic, proofreading, paragraphs, active and passive voice" },
  { id: "w6-description", chapter: "Chapter 2", name: "Descriptive Writing", about: "Adjectives and adverbs, sensory details, vivid verbs, precise nouns, spatial organisation" },
  { id: "w6-story", chapter: "Chapter 2", name: "Stories and Personal Narratives", about: "Sequence of events, parts of a story, setting, characters, dialogue, point of view" },
  { id: "w6-inform", chapter: "Chapter 3", name: "Writing to Inform", about: "Directions, how-to, cause and effect, reporting an event, comparisons, introductions and conclusions" },
  { id: "w6-research", chapter: "Chapter 3", name: "Research and Sources", about: "Credible sources, quotes and paraphrases, notes, outlines, Works Cited, visual aids" },
  { id: "w6-argument", chapter: "Chapter 4", name: "Writing an Argument", about: "Facts and opinions, emotional appeals, advertising, bias, order of importance, claims, essays" },
];
