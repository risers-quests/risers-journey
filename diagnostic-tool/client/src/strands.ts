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

// The book's strands, as offered on the start page.
export const STRAND_CHOICES = [
  { name: "Number & Algebra", topics: ["Large numbers", "Operations on large numbers", "Factors and multiples", "Fractions and division", "Four operations of fractions", "Decimals"] },
  { name: "Measurement & Geometry", topics: ["Geometry", "Measurement", "Perimeter and area", "Volume and nets", "Time and temperature", "Patterns and symmetry"] },
  { name: "Ratio & Proportion", topics: ["Life mathematics", "Scales and directions"] },
  { name: "Data Handling", topics: ["Data handling"] },
];
