// Grade 4: topics offered one by one, in the Grade 4 book's order and words
// (ids match the server's GRADE4_TOPICS). Add a line here as each chapter is ready.
export const GRADE4_TOPIC_CHOICES = [
  { id: "more-large-numbers", chapter: "Chapter 1", name: "Large Numbers", about: "Number names, place and face value, comparing, rounding, Roman numerals" },
  { id: "operations-large-numbers", chapter: "Chapters 2–4", name: "Addition, Subtraction, Multiplication and Division", about: "Up to 6 digits, tables of 11–15, dividing with remainders, estimating" },
  { id: "factors-multiples", chapter: "Chapter 5", name: "Factors and Multiples", about: "Factors, multiples, common factors and multiples, prime numbers" },
  { id: "four-operations-fractions", chapter: "Chapter 6", name: "Fractions", about: "Equivalent fractions, simplest form, comparing, adding and subtracting, mixed fractions" },
  { id: "decimals", chapter: "Chapter 7", name: "Decimals", about: "Tenths, hundredths and thousandths, number discs, place value, decimals as fractions" },
];

// The book's strands, as offered on the start page.
export const STRAND_CHOICES = [
  { name: "Number & Algebra", topics: ["Large numbers", "Operations on large numbers", "Factors and multiples", "Fractions and division", "Four operations of fractions", "Decimals"] },
  { name: "Measurement & Geometry", topics: ["Geometry", "Measurement", "Perimeter and area", "Volume and nets", "Time and temperature", "Patterns and symmetry"] },
  { name: "Ratio & Proportion", topics: ["Life mathematics", "Scales and directions"] },
  { name: "Data Handling", topics: ["Data handling"] },
];
