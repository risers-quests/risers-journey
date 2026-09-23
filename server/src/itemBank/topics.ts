import { Topic } from "../types.js";

/**
 * The full Grade 5 syllabus, in the same order as the textbook's own table
 * of contents — each topic depends on the one directly before it, so the
 * engine only ever unlocks a topic once its immediate predecessor is
 * mastered. This is a deliberate simplification of the "real" prerequisite
 * graph (e.g. Perimeter and Area doesn't strictly require Time and
 * Temperature) in favour of a single linear building-blocks chain that
 * matches how the textbook itself sequences the year — see README.
 *
 * "Fractions" is split into the two topics the pilot already had fully
 * built out (Fractions and Division, then Four Operations of Fractions),
 * so the chapter count here is 15 topics covering the book's 14 chapters.
 */
export const TOPICS: Topic[] = [
  {
    id: "more-large-numbers",
    strand: "Number & Algebra",
    name: "More on Large Numbers",
    shortLabel: "Large Numbers",
    dependsOn: [],
  },
  {
    id: "operations-large-numbers",
    strand: "Number & Algebra",
    name: "Operations on Large Numbers",
    shortLabel: "Ops on Large Numbers",
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
    dependsOn: ["fractions-division"],
  },
  {
    id: "decimals",
    strand: "Number & Algebra",
    name: "Decimals",
    shortLabel: "Decimals",
    dependsOn: ["four-operations-fractions"],
  },
  {
    id: "geometry",
    strand: "Measurement & Geometry",
    name: "Geometry",
    shortLabel: "Geometry",
    dependsOn: ["decimals"],
  },
  {
    id: "measurement",
    strand: "Measurement & Geometry",
    name: "Measurement",
    shortLabel: "Measurement",
    dependsOn: ["geometry"],
  },
  {
    id: "perimeter-area",
    strand: "Measurement & Geometry",
    name: "Perimeter and Area",
    shortLabel: "Perimeter & Area",
    dependsOn: ["measurement"],
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
    dependsOn: ["volume-nets"],
  },
  {
    id: "life-mathematics",
    strand: "Ratio & Proportion",
    name: "Life Mathematics",
    shortLabel: "Life Mathematics",
    dependsOn: ["time-temperature"],
  },
  {
    id: "scales-directions",
    strand: "Ratio & Proportion",
    name: "Scales and Directions",
    shortLabel: "Scales & Directions",
    dependsOn: ["life-mathematics"],
  },
  {
    id: "data-handling",
    strand: "Data Handling",
    name: "Data Handling",
    shortLabel: "Data Handling",
    dependsOn: ["scales-directions"],
  },
  {
    id: "patterns-symmetry",
    strand: "Measurement & Geometry",
    name: "Patterns and Symmetry",
    shortLabel: "Patterns & Symmetry",
    dependsOn: ["data-handling"],
  },
];
