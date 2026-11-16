import { BloomLevel, CPAStage, Item } from "../../types.js";
import { GeneratedItem, Rng, Template } from "./core.js";
import { FRACTIONS_DIVISION_TEMPLATES, MISCONCEPTIONS as FD_MISCONCEPTIONS } from "./fractionsDivision.js";
import { MORE_ON_LARGE_NUMBERS_TEMPLATES, MISCONCEPTIONS as LN_MISCONCEPTIONS } from "./moreOnLargeNumbers.js";
import { OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES, MISCONCEPTIONS as OP_MISCONCEPTIONS } from "./operationsOnLargeNumbers.js";

export type { GeneratedItem } from "./core.js";

/** Topics whose questions are generated, keyed "cpa|bloom". Others still use the hand-written bank. */
const TEMPLATES: Record<string, Record<string, Template>> = {
  "fractions-division": FRACTIONS_DIVISION_TEMPLATES,
  "more-large-numbers": MORE_ON_LARGE_NUMBERS_TEMPLATES,
  "operations-large-numbers": OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES,
};

/** Topics with generated questions. */
export const GENERATED_TOPICS = Object.keys(TEMPLATES);

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  ...FD_MISCONCEPTIONS,
  ...LN_MISCONCEPTIONS,
  ...OP_MISCONCEPTIONS,
};

export function hasTemplate(topicId: string, cpa: CPAStage, bloom: BloomLevel): boolean {
  return !!TEMPLATES[topicId]?.[`${cpa}|${bloom}`];
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
  opts: { avoid?: string[]; given?: Record<string, number>; rng?: Rng } = {}
): GeneratedItem {
  const template = TEMPLATES[topicId][`${cpa}|${bloom}`];
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
