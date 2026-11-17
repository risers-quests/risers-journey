import { BloomLevel, CPAStage, Item } from "../../types.js";
import { GeneratedItem, Rng, Template, setGrade } from "./core.js";
import { FRACTIONS_DIVISION_TEMPLATES, MISCONCEPTIONS as FD_MISCONCEPTIONS } from "./fractionsDivision.js";
import { MORE_ON_LARGE_NUMBERS_TEMPLATES, MISCONCEPTIONS as LN_MISCONCEPTIONS } from "./moreOnLargeNumbers.js";
import { OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES, MISCONCEPTIONS as OP_MISCONCEPTIONS } from "./operationsOnLargeNumbers.js";
import { FACTORS_MULTIPLES_G4_TEMPLATES, MISCONCEPTIONS as FM4_MISCONCEPTIONS } from "./factorsMultiplesG4.js";
import { FRACTIONS_G4_TEMPLATES, MISCONCEPTIONS as FR4_MISCONCEPTIONS } from "./fractionsG4.js";
import { DECIMALS_G4_TEMPLATES, MISCONCEPTIONS as DEC4_MISCONCEPTIONS } from "./decimalsG4.js";

export type { GeneratedItem } from "./core.js";

/** Topics whose questions are generated, keyed "cpa|bloom". Others still use the hand-written bank. */
const TEMPLATES: Record<string, Record<string, Template>> = {
  "fractions-division": FRACTIONS_DIVISION_TEMPLATES,
  "more-large-numbers": MORE_ON_LARGE_NUMBERS_TEMPLATES,
  "operations-large-numbers": OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES,
};

/**
 * Grade 4 only: topics whose Grade 4 questions are generated from their own
 * templates (the book's Grade 4 chapter), while Grade 5 keeps its own bank.
 */
const GRADE4_TEMPLATES: Record<string, Record<string, Template>> = {
  "factors-multiples": FACTORS_MULTIPLES_G4_TEMPLATES,
  "four-operations-fractions": FRACTIONS_G4_TEMPLATES,
  decimals: DECIMALS_G4_TEMPLATES,
};

/** Topics with generated questions (Grade 5; Grade 4 also uses GRADE4_TEMPLATES). */
export const GENERATED_TOPICS = Object.keys(TEMPLATES);

function templatesFor(topicId: string, grade: number): Record<string, Template> | undefined {
  return (grade === 4 ? GRADE4_TEMPLATES[topicId] : undefined) ?? TEMPLATES[topicId];
}

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  ...FD_MISCONCEPTIONS,
  ...LN_MISCONCEPTIONS,
  ...OP_MISCONCEPTIONS,
  ...FM4_MISCONCEPTIONS,
  ...FR4_MISCONCEPTIONS,
  ...DEC4_MISCONCEPTIONS,
};

export function hasTemplate(topicId: string, cpa: CPAStage, bloom: BloomLevel, grade = 5): boolean {
  return !!templatesFor(topicId, grade)?.[`${cpa}|${bloom}`];
}

/**
 * A fresh question for this cell. `avoid` lists question signatures (cell
 * and numbers) the child has already seen, so numbers aren't repeated while
 * there are others to use. `given` re-asks the same numbers in this cell's
 * form (used by the "knows the steps, not the idea" check).
 */
export function generateItem(
  topicId: string,
  cpa: CPAStage,
  bloom: BloomLevel,
  opts: { avoid?: string[]; given?: Record<string, number>; rng?: Rng; grade?: number } = {}
): GeneratedItem {
  setGrade(opts.grade ?? 5);
  const make = templatesFor(topicId, opts.grade ?? 5)![`${cpa}|${bloom}`];
  // Each question records its grade (so the same numbers at another grade count as different).
  const template: Template = (r, g) => {
    const it = make(r, g);
    it.params.g = opts.grade ?? 5;
    return it;
  };
  const rng = opts.rng ?? Math.random;
  if (opts.given) return template(rng, opts.given);
  const avoid = opts.avoid ?? [];
  // Try for numbers this child has never had. If a level has truly run out
  // (only after many tests), use the numbers they saw longest ago.
  let best: GeneratedItem | null = null;
  let bestAge = Infinity;
  for (let i = 0; i < 300; i++) {
    const item = template(rng);
    const at = avoid.lastIndexOf(signature(item));
    if (at === -1) return item;
    if (at < bestAge) {
      bestAge = at;
      best = item;
    }
  }
  return best!;
}

/**
 * What counts as "the same question": the topic and its numbers, at any
 * level. Once a child has had 7 and 3 in a topic, in any form, they don't
 * get 7 and 3 in that topic again (in this test or a later one).
 */
export function signature(item: GeneratedItem): string {
  return `${item.topicId}|${Object.entries(item.params).map(([k, v]) => `${k}=${v}`).join(",")}`;
}

export function isGenerated(item: Item): item is GeneratedItem {
  return (item as GeneratedItem).generated === true;
}

/** Topics ready at Grade 4, in book order (offered one by one on the start page). */
export const GRADE4_TOPICS = ["more-large-numbers", "operations-large-numbers", "factors-multiples", "four-operations-fractions", "decimals"];
