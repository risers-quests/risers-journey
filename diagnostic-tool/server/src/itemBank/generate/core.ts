import { BloomLevel, CPAStage, Choice, Item } from "../../types.js";

/**
 * Generated questions.
 *
 * A template fills a question's numbers and context in at random, and the
 * code works out the right answer, so a generated question is always
 * correct. Each wrong option is built from a specific, named mistake (a
 * misconception), so a wrong answer says *which* mistake a child made, not
 * just that they got it wrong. See README "Generated questions".
 */

/** A generated question: an Item plus what was chosen and which mistake each wrong option stands for. */
export interface GeneratedItem extends Item {
  generated: true;
  /** The numbers the question was built from (e.g. { a: 7, b: 3 }), so the same relationship can be asked again in another form. */
  params: Record<string, number>;
  /** For each choice id, the misconception code it represents (null for the right answer or a generic wrong option). */
  mistakes: Record<string, string | null>;
}

export type Rng = () => number;

/** A template for one CPA x Bloom cell of one topic. `given` re-uses earlier numbers when asked for. */
export type Template = (rng: Rng, given?: Record<string, number>) => GeneratedItem;

export function int(rng: Rng, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

export function pick<T>(rng: Rng, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)];
}

export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function frac(n: number, d: number): string {
  return `${n}/${d}`;
}

/** "7/3" -> "7/3 (2 1/3)" for improper fractions; whole numbers stay whole. */
export function fracWithMixed(n: number, d: number): string {
  if (n % d === 0) return String(n / d);
  if (n < d) return frac(n, d);
  const r = n % d;
  const g = gcd(r, d);
  return `${frac(n, d)} (${Math.floor(n / d)} ${frac(r / g, d / g)})`;
}

/**
 * Builds the item from one right answer and candidate wrong answers in
 * order of preference. Wrong answers that repeat the right answer or each
 * other are skipped, so a question never shows two identical options or a
 * second "right" one; at least three are needed (templates always offer
 * spares).
 */
export function build(
  base: Omit<Item, "choices" | "correctChoiceId">,
  params: Record<string, number>,
  correct: string,
  wrong: { text: string; mistake: string | null }[]
): GeneratedItem {
  const seen = new Set([correct]);
  const picked: { text: string; mistake: string | null }[] = [];
  for (const w of wrong) {
    if (picked.length === 3) break;
    if (seen.has(w.text)) continue;
    seen.add(w.text);
    picked.push(w);
  }
  if (picked.length < 3) throw new Error(`template ${base.id}: not enough distinct wrong answers`);
  const ids = ["a", "b", "c", "d"];
  const choices: Choice[] = [{ id: "a", text: correct }, ...picked.map((w, i) => ({ id: ids[i + 1], text: w.text }))];
  const mistakes: Record<string, string | null> = { a: null };
  picked.forEach((w, i) => (mistakes[ids[i + 1]] = w.mistake));
  return { ...base, choices, correctChoiceId: "a", generated: true, params, mistakes };
}

export function cellKey(topicId: string, cpa: CPAStage, bloom: BloomLevel): string {
  return `${topicId}|${cpa}|${bloom}`;
}
