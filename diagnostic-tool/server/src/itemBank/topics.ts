import { Topic } from "../types.js";

/**
 * The full Grade 5 syllabus, in the textbook's own order (the order topics
 * are tested in). Each topic lists only what it really builds on, judged
 * from its questions: e.g. Decimals needs Fractions and Division (tenths as
 * fractions), Volume needs Perimeter and Area (volume = layers of area),
 * Measurement needs Large Numbers (km -> m is thousands). Topics with no
 * prerequisite (Geometry, Perimeter and Area, Time and Temperature, Scales
 * and Directions, Data Handling) are always tested.
 *
 * So a gap holds back only the topics that depend on it; every other topic
 * is still assessed in the same sitting. (This replaced a single linear
 * chain, where one early gap ended the whole test.)
 *
 * "Fractions" is split into two topics (Fractions and Division, then Four
 * Operations of Fractions), so 15 topics cover the book's 14 chapters.
 */
export const TOPICS: Topic[] = [
  {
    id: "more-large-numbers",
    strand: "Number & Algebra",
    name: "More on Large Numbers",
    shortLabel: "Large Numbers",
    grade4Name: "Large Numbers",
    dependsOn: [],
  },
  {
    id: "operations-large-numbers",
    strand: "Number & Algebra",
    name: "Operations on Large Numbers",
    shortLabel: "Ops on Large Numbers",
    grade4Name: "Addition, Subtraction, Multiplication and Division",
    dependsOn: ["more-large-numbers"],
  },
  {
    id: "factors-multiples",
    strand: "Number & Algebra",
    name: "Factors and Multiples",
    shortLabel: "Factors & Multiples",
    dependsOn: ["operations-large-numbers"],
  },
  {
    id: "fractions-division",
    strand: "Number & Algebra",
    name: "Fractions and Division",
    shortLabel: "Fractions & Division",
    dependsOn: ["factors-multiples"],
  },
  {
    id: "four-operations-fractions",
    strand: "Number & Algebra",
    name: "Four Operations of Fractions",
    shortLabel: "4 Ops of Fractions",
    grade4Name: "Fractions",
    dependsOn: ["fractions-division"],
  },
  {
    id: "decimals",
    strand: "Number & Algebra",
    name: "Decimals",
    shortLabel: "Decimals",
    dependsOn: ["fractions-division"],
  },
  {
    id: "geometry",
    strand: "Measurement & Geometry",
    name: "Geometry",
    shortLabel: "Geometry",
    dependsOn: [],
  },
  {
    id: "measurement",
    strand: "Measurement & Geometry",
    name: "Measurement",
    shortLabel: "Measurement",
    dependsOn: ["more-large-numbers"],
  },
  {
    id: "perimeter-area",
    strand: "Measurement & Geometry",
    name: "Perimeter and Area",
    shortLabel: "Perimeter & Area",
    dependsOn: [],
  },
  {
    id: "volume-nets",
    strand: "Measurement & Geometry",
    name: "Volume and Nets of Solids",
    shortLabel: "Volume & Nets",
    dependsOn: ["perimeter-area"],
  },
  {
    id: "time-temperature",
    strand: "Measurement & Geometry",
    name: "Time and Temperature",
    shortLabel: "Time & Temperature",
    dependsOn: [],
  },
  {
    id: "life-mathematics",
    strand: "Ratio & Proportion",
    name: "Life Mathematics",
    shortLabel: "Life Mathematics",
    dependsOn: ["fractions-division"],
  },
  {
    id: "scales-directions",
    strand: "Ratio & Proportion",
    name: "Scales and Directions",
    shortLabel: "Scales & Directions",
    dependsOn: [],
  },
  {
    id: "data-handling",
    strand: "Data Handling",
    name: "Data Handling",
    shortLabel: "Data Handling",
    dependsOn: [],
  },
  {
    id: "patterns-symmetry",
    strand: "Measurement & Geometry",
    name: "Patterns and Symmetry",
    shortLabel: "Patterns & Symmetry",
    dependsOn: ["geometry"],
  },
];

/**
 * Grade 8 (Selina Concise Mathematics 8), Themes 1–6 (Number System;
 * Ratio and Proportion; Algebra; Geometry; Mensuration; Data Handling), in the
 * book's order. Grade 8 tests are chosen chapter by chapter (GRADE8_TOPICS).
 */
TOPICS.push(
  { id: "g8-rational-numbers", strand: "Number & Algebra", name: "Rational Numbers", shortLabel: "Rational Numbers", dependsOn: [], grade: 8 },
  { id: "g8-exponents", strand: "Number & Algebra", name: "Exponents (Powers)", shortLabel: "Exponents", dependsOn: [], grade: 8 },
  { id: "g8-squares", strand: "Number & Algebra", name: "Squares and Square Roots", shortLabel: "Squares & Roots", dependsOn: [], grade: 8 },
  { id: "g8-cubes", strand: "Number & Algebra", name: "Cubes and Cube Roots", shortLabel: "Cubes & Roots", dependsOn: ["g8-squares"], grade: 8 },
  { id: "g8-playing-numbers", strand: "Number & Algebra", name: "Playing with Numbers", shortLabel: "Playing with Numbers", dependsOn: [], grade: 8 },
  { id: "g8-sets", strand: "Number & Algebra", name: "Sets", shortLabel: "Sets", dependsOn: [], grade: 8 },
  // Theme 2: Ratio and Proportion.
  { id: "g8-percent", strand: "Ratio & Proportion", name: "Percent and Percentage", shortLabel: "Percent", dependsOn: [], grade: 8 },
  { id: "g8-profit-loss", strand: "Ratio & Proportion", name: "Profit, Loss and Discount", shortLabel: "Profit & Loss", dependsOn: ["g8-percent"], grade: 8 },
  { id: "g8-interest", strand: "Ratio & Proportion", name: "Interest (Simple and Compound)", shortLabel: "Interest", dependsOn: ["g8-percent"], grade: 8 },
  { id: "g8-variation", strand: "Ratio & Proportion", name: "Direct and Inverse Variations", shortLabel: "Variation", dependsOn: [], grade: 8 },
  // Theme 3: Algebra.
  { id: "g8-expressions", strand: "Number & Algebra", name: "Algebraic Expressions", shortLabel: "Expressions", dependsOn: [], grade: 8 },
  { id: "g8-identities", strand: "Number & Algebra", name: "Identities", shortLabel: "Identities", dependsOn: ["g8-expressions"], grade: 8 },
  { id: "g8-factorisation", strand: "Number & Algebra", name: "Factorisation", shortLabel: "Factorisation", dependsOn: ["g8-expressions"], grade: 8 },
  { id: "g8-linear-equations", strand: "Number & Algebra", name: "Linear Equations in One Variable", shortLabel: "Linear Equations", dependsOn: [], grade: 8 },
  { id: "g8-inequations", strand: "Number & Algebra", name: "Linear Inequations", shortLabel: "Inequations", dependsOn: [], grade: 8 },
  // Theme 4: Geometry.
  { id: "g8-shapes", strand: "Measurement & Geometry", name: "Understanding Shapes", shortLabel: "Shapes & Polygons", dependsOn: [], grade: 8 },
  { id: "g8-quadrilaterals", strand: "Measurement & Geometry", name: "Special Types of Quadrilaterals", shortLabel: "Quadrilaterals", dependsOn: [], grade: 8 },
  { id: "g8-constructions", strand: "Measurement & Geometry", name: "Constructions", shortLabel: "Constructions", dependsOn: [], grade: 8 },
  { id: "g8-solids", strand: "Measurement & Geometry", name: "Representing 3-D in 2-D", shortLabel: "3-D in 2-D", dependsOn: [], grade: 8 },
  { id: "g8-symmetry", strand: "Measurement & Geometry", name: "Symmetry", shortLabel: "Symmetry", dependsOn: [], grade: 8 },
  { id: "g8-circles", strand: "Measurement & Geometry", name: "Circles", shortLabel: "Circles", dependsOn: [], grade: 8 },
  // Theme 5: Mensuration.
  { id: "g8-area", strand: "Measurement & Geometry", name: "Area of a Trapezium and a Polygon", shortLabel: "Area", dependsOn: [], grade: 8 },
  { id: "g8-volume", strand: "Measurement & Geometry", name: "Surface Area, Volume and Capacity", shortLabel: "Volume & Surface", dependsOn: [], grade: 8 },
  // Theme 6: Data Handling.
  { id: "g8-data", strand: "Data Handling", name: "Data Handling", shortLabel: "Data Handling", dependsOn: [], grade: 8 },
  { id: "g8-probability", strand: "Data Handling", name: "Probability", shortLabel: "Probability", dependsOn: [], grade: 8 }
);

/**
 * Grade 8 English (English Rose Reader 8, Macmillan / Frank Bros.), chosen
 * topic by topic (ENGLISH8_TOPICS). Grammar topics are named as in the
 * book's Scope and Sequence; the chapter each one comes with is in the
 * client's ENGLISH8_TOPIC_CHOICES.
 */
TOPICS.push(
  { id: "e8-lit-winter-oak", strand: "Literature", name: "The Winter Oak (Ch 1)", shortLabel: "The Winter Oak", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-dont-quit", strand: "Literature", name: "Don't Quit (Ch 2)", shortLabel: "Don't Quit", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-corner-shop", strand: "Literature", name: "The Corner Shop (Ch 3)", shortLabel: "The Corner Shop", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-inchcape", strand: "Literature", name: "The Inchcape Rock (Ch 4)", shortLabel: "The Inchcape Rock", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-dusk", strand: "Literature", name: "Dusk (Ch 5)", shortLabel: "Dusk", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-drum-dream", strand: "Literature", name: "Drum Dream Girl (Ch 6)", shortLabel: "Drum Dream Girl", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-salaam", strand: "Literature", name: "Salaam Namaste (Ch 7)", shortLabel: "Salaam Namaste", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-gift-india", strand: "Literature", name: "The Gift of India (Ch 8)", shortLabel: "The Gift of India", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-tiger", strand: "Literature", name: "Monitoring the Tiger (Ch 9)", shortLabel: "Monitoring the Tiger", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-ozymandias", strand: "Literature", name: "Ozymandias (Ch 10)", shortLabel: "Ozymandias", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-game", strand: "Literature", name: "The Game (Ch 11)", shortLabel: "The Game", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-magi", strand: "Literature", name: "The Gift of the Magi (Ch 12)", shortLabel: "The Gift of the Magi", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-macavity", strand: "Literature", name: "Macavity, the Mystery Cat (Ch 13)", shortLabel: "Macavity", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-caesar", strand: "Literature", name: "Julius Caesar (Ch 14)", shortLabel: "Julius Caesar", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-expectations", strand: "Literature", name: "Great Expectations (Ch 15)", shortLabel: "Great Expectations", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-tree", strand: "Literature", name: "Throwing a Tree (Ch 16)", shortLabel: "Throwing a Tree", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-name", strand: "Literature", name: "Choosing a Name (Ch 17)", shortLabel: "Choosing a Name", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-lit-louse", strand: "Literature", name: "The Louse and the Mosquito (Ch 18)", shortLabel: "Louse & Mosquito", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-clauses", strand: "Grammar", name: "Dependent and Independent Clauses", shortLabel: "Clauses", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-purpose", strand: "Grammar", name: "Words as Nouns and Verbs; Clauses of Purpose", shortLabel: "Nouns/Verbs & Purpose", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-participles", strand: "Grammar", name: "Participles and Gerunds", shortLabel: "Participles & Gerunds", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-infinitives", strand: "Grammar", name: "Forms of Have; Infinitives", shortLabel: "Have & Infinitives", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-sentences", strand: "Grammar", name: "Simple, Compound and Complex Sentences", shortLabel: "Kinds of Sentences", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-voice", strand: "Grammar", name: "Active and Passive Voice", shortLabel: "Active & Passive", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-speech", strand: "Grammar", name: "Direct and Indirect Speech", shortLabel: "Reported Speech", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-conditionals", strand: "Grammar", name: "Conditionals (First, Second and Third)", shortLabel: "Conditionals", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-words", strand: "Vocabulary", name: "Word Study", shortLabel: "Word Study", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-idioms", strand: "Vocabulary", name: "Idioms, Proverbs and Compound Words", shortLabel: "Idioms & Proverbs", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-figures", strand: "Literature", name: "Figures of Speech", shortLabel: "Figures of Speech", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-punctuation", strand: "Punctuation & Spelling", name: "Punctuation", shortLabel: "Punctuation", dependsOn: [], grade: 8, subject: "English" },
  { id: "e8-spelling", strand: "Punctuation & Spelling", name: "Spelling and Pronunciation", shortLabel: "Spelling & Sounds", dependsOn: [], grade: 8, subject: "English" }
);

/** Grade 7 Maths (the school's Grade 7 book), chapter by chapter. Some chapters use the Grade 8 questions for the same skill. */
TOPICS.push(
  ...([
    ["g7-integers", "Number & Algebra", "Integers"],
    ["g7-fractions", "Number & Algebra", "Fractions"],
    ["g7-decimals", "Number & Algebra", "Decimals"],
    ["g7-rational", "Number & Algebra", "Rational Numbers"],
    ["g7-exponents", "Number & Algebra", "Powers and Exponents"],
    ["g7-expressions", "Number & Algebra", "Algebraic Expressions"],
    ["g7-equations", "Number & Algebra", "Linear Equations"],
    ["g7-ratio", "Ratio & Proportion", "Ratio and Proportion"],
    ["g7-percent", "Ratio & Proportion", "Percentage and Its Applications"],
    ["g7-symmetry", "Measurement & Geometry", "Symmetry"],
    ["g7-solids", "Measurement & Geometry", "Visualising Solid Shapes"],
    ["g7-data", "Data Handling", "Data Handling"],
    ["g7-probability", "Data Handling", "Probability"],
  ] as const).map(([id, strand, name]) => ({ id, strand, name, shortLabel: name, dependsOn: [], grade: 7 }))
);

/** Grade 7 Language Arts (Spectrum Language Arts Grade 7), chosen topic by topic. */
TOPICS.push(
  { id: "l7-nouns-pronouns", strand: "Parts of Speech", name: "Nouns and Pronouns", shortLabel: "Nouns & Pronouns", dependsOn: [], grade: 7, subject: "Language Arts" },
  { id: "l7-verbs", strand: "Parts of Speech", name: "Verbs and Verb Tenses", shortLabel: "Verbs & Tenses", dependsOn: [], grade: 7, subject: "Language Arts" },
  { id: "l7-modifiers", strand: "Parts of Speech", name: "Adjectives, Adverbs, Prepositions and Conjunctions", shortLabel: "Modifiers & Joiners", dependsOn: [], grade: 7, subject: "Language Arts" },
  { id: "l7-sentences", strand: "Sentences", name: "Sentences", shortLabel: "Sentences", dependsOn: [], grade: 7, subject: "Language Arts" },
  { id: "l7-capitals", strand: "Mechanics", name: "Capitalization", shortLabel: "Capitals", dependsOn: [], grade: 7, subject: "Language Arts" },
  { id: "l7-punctuation", strand: "Mechanics", name: "Punctuation", shortLabel: "Punctuation", dependsOn: [], grade: 7, subject: "Language Arts" },
  { id: "l7-usage", strand: "Usage", name: "Usage", shortLabel: "Usage", dependsOn: [], grade: 7, subject: "Language Arts" },
  { id: "l7-words", strand: "Word Study", name: "Word Study", shortLabel: "Word Study", dependsOn: [], grade: 7, subject: "Language Arts" },
  { id: "w7-paragraphs", strand: "Writing", name: "Foundations of Writing", shortLabel: "Paragraphs", dependsOn: [], grade: 7, subject: "Writing" },
  { id: "w7-narrative", strand: "Writing", name: "Writing a Narrative", shortLabel: "Narrative", dependsOn: [], grade: 7, subject: "Writing" },
  { id: "w7-informational", strand: "Writing", name: "Writing to Inform", shortLabel: "Informational", dependsOn: [], grade: 7, subject: "Writing" },
  { id: "w7-opinion", strand: "Writing", name: "Writing an Argument", shortLabel: "Opinion", dependsOn: [], grade: 7, subject: "Writing" },
  { id: "w7-research", strand: "Writing", name: "Research and Sources", shortLabel: "Research", dependsOn: [], grade: 7, subject: "Writing" }
);

/** English strands (Grade 8). */
export const ENGLISH_STRANDS = ["Grammar", "Vocabulary", "Punctuation & Spelling", "Literature"];

/** Subjects: Maths, and the language subjects (Grade 8 English; Grade 7 Language Arts and Writing). */
export type Subject = "Maths" | "English" | "Language Arts" | "Writing";
export const LANGUAGE_SUBJECTS = ["English", "Language Arts", "Writing"];
export const isLanguage = (s?: string) => !!s && LANGUAGE_SUBJECTS.includes(s);
export const subjectOfTopic = (id: string): Subject => (id.startsWith("e8-") ? "English" : id.startsWith("l7-") ? "Language Arts" : id.startsWith("w7-") ? "Writing" : "Maths");

/** The book's strands, in order. A test covers one or more of them. */
export const STRANDS = ["Number & Algebra", "Measurement & Geometry", "Ratio & Proportion", "Data Handling"];
