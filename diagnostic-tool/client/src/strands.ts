// The book's strands, as offered on the start page. Times are rough: a
// topic took 6-11 questions in simulations, at roughly half a minute each.
export const STRAND_CHOICES = [
  { name: "Number & Algebra", topics: ["Large numbers", "Operations on large numbers", "Factors and multiples", "Fractions and division", "Four operations of fractions", "Decimals"] },
  { name: "Measurement & Geometry", topics: ["Geometry", "Measurement", "Perimeter and area", "Volume and nets", "Time and temperature", "Patterns and symmetry"] },
  { name: "Ratio & Proportion", topics: ["Life mathematics", "Scales and directions"] },
  { name: "Data Handling", topics: ["Data handling"] },
];

export function minutesFor(topicCount: number): string {
  const lo = Math.max(5, Math.round((topicCount * 3) / 5) * 5);
  const hi = Math.max(10, Math.round((topicCount * 6) / 5) * 5);
  return `about ${lo}–${hi} min`;
}
