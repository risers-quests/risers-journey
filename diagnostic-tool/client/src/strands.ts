// Grade 4: topics offered one by one, in the Grade 4 book's order and words
// (ids match the server's GRADE4_TOPICS). Add a line here as each chapter is ready.
export const GRADE4_TOPIC_CHOICES = [
  { id: "more-large-numbers", chapter: "Chapter 1", name: "Large Numbers", about: "Number names, place and face value, comparing, rounding, Roman numerals" },
  { id: "operations-large-numbers", chapter: "Chapters 2–4", name: "Addition, Subtraction, Multiplication and Division", about: "Up to 6 digits, tables of 11–15, dividing with remainders, estimating" },
  { id: "factors-multiples", chapter: "Chapter 5", name: "Factors and Multiples", about: "Factors, multiples, common factors and multiples, prime numbers" },
];

// Grade 8 (Selina Concise Mathematics 8): chapters offered one by one, in
// the book's order (ids match the server's GRADE8_TOPICS). Add a line as each is ready.
export const GRADE8_TOPIC_CHOICES = [
  { id: "g8-rational-numbers", chapter: "Chapter 1", name: "Rational Numbers", about: "On the number line, comparing, between two numbers, the four operations, reciprocals" },
  { id: "g8-exponents", chapter: "Chapter 2", name: "Exponents (Powers)", about: "Laws of exponents, zero and negative powers, powers of 10" },
  { id: "g8-squares", chapter: "Chapter 3", name: "Squares and Square Roots", about: "Square numbers, roots by prime factors, decimals, smallest multiplier" },
  { id: "g8-cubes", chapter: "Chapter 4", name: "Cubes and Cube Roots", about: "Cube numbers, cube roots, negative cubes, smallest multiplier" },
  { id: "g8-playing-numbers", chapter: "Chapter 5", name: "Playing with Numbers", about: "Numbers in general form, swapped digits, tests for 3 and 9, puzzles" },
  { id: "g8-percent", chapter: "Chapter 7", name: "Percent and Percentage", about: "Percent of any whole, finding the whole, percentage change, one change after another" },
  { id: "g8-profit-loss", chapter: "Chapter 8", name: "Profit, Loss and Discount", about: "Profit and loss %, overheads, discount, GST after discount" },
  { id: "g8-interest", chapter: "Chapter 9", name: "Interest", about: "Simple and compound interest, yearly and half-yearly" },
  { id: "g8-variation", chapter: "Chapter 10", name: "Direct and Inverse Variations", about: "Unit method, workers and days, speed and time, time and work" },
];

// The book's strands, as offered on the start page.
export const STRAND_CHOICES = [
  { name: "Number & Algebra", topics: ["Large numbers", "Operations on large numbers", "Factors and multiples", "Fractions and division", "Four operations of fractions", "Decimals"] },
  { name: "Measurement & Geometry", topics: ["Geometry", "Measurement", "Perimeter and area", "Volume and nets", "Time and temperature", "Patterns and symmetry"] },
  { name: "Ratio & Proportion", topics: ["Life mathematics", "Scales and directions"] },
  { name: "Data Handling", topics: ["Data handling"] },
];
