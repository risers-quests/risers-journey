import { BloomLevel, CPAStage, Item } from "../../types.js";
import { GeneratedItem, Rng, Template } from "./core.js";
import { FRACTIONS_DIVISION_TEMPLATES, MISCONCEPTIONS as FD_MISCONCEPTIONS } from "./fractionsDivision.js";

export type { GeneratedItem } from "./core.js";

/** Topics whose questions are generated, keyed "cpa|bloom". Others still use the hand-written bank. */
const TEMPLATES: Record<string, Record<string, Template>> = {
  "fractions-division": FRACTIONS_DIVISION_TEMPLATES,
};

export const MISCONCEPTIONS: Record<string, { label: string; detail: string }> = {
  ...FD_MISCONCEPTIONS,
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
  let item = template(rng);
  for (let i = 0; i < 20 && opts.avoid?.includes(signature(item)); i++) item = template(rng);
  return item;
}

/** What counts as "the same question": the cell and its numbers, not the story around them. */
export function signature(item: GeneratedItem): string {
  return `${item.cpa}|${item.bloom}|${Object.entries(item.params).map(([k, v]) => `${k}=${v}`).join(",")}`;
}

export function isGenerated(item: Item): item is GeneratedItem {
  return (item as GeneratedItem).generated === true;
}
