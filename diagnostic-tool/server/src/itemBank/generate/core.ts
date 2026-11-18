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

/**
 * The grade questions are being made for (set by generateItem). Grade 4
 * uses the same ladders one place value smaller: G() is 10 for Grade 4, so
 * 100,000 / G() is 10,000; D() drops one digit from number lengths.
 */
let currentGrade = 5;
export function setGrade(g: number) {
  currentGrade = g === 4 ? 4 : g === 8 ? 8 : g === 7 ? 7 : 5;
}
export const G = () => (currentGrade === 4 ? 10 : 1);
export const D = () => (currentGrade === 4 ? 1 : 0);
export const gradeNow = () => currentGrade;

/**
 * Numbers are written the way the school's books write them: Indian
 * grouping, 3 digits then 2 at a time (37,82,410 — not 3,782,410).
 */
export function fmt(n: number): string {
  const neg = n < 0;
  const s = String(Math.abs(Math.trunc(n)));
  const frac = String(Math.abs(n)).includes(".") ? "." + String(Math.abs(n)).split(".")[1] : "";
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3;
  return (neg ? "-" : "") + grouped + frac;
}

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
    // Grade 4 numbers stay below 10,00,000 (the book's range), wrong options included.
    if (currentGrade === 4 && (w.text.match(/\d+(?:,\d+)*/g) ?? []).some((x) => Number(x.replace(/,/g, "")) >= 1000000)) continue;
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

/** An item answered by doing the activity (no options); the server marks what the child did. */
export function buildActivity(base: Omit<Item, "choices" | "correctChoiceId">, params: Record<string, number>, activity: NonNullable<Item["activity"]>): GeneratedItem {
  return { ...base, choices: [], correctChoiceId: "activity", activity, answerBy: "activity", generated: true, params, mistakes: {} };
}

/** Powers written the way the book prints them: 10⁴, 2⁻³. */
export function sup(n: number): string {
  const s = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  return (n < 0 ? "⁻" : "") + String(Math.abs(n)).split("").map((d) => s[Number(d)]).join("");
}

/** A fraction in lowest terms with its sign in front (−3/4); whole numbers stay whole. */
export function rat(n: number, d: number): string {
  if (d < 0) (n = -n), (d = -d);
  if (n === 0) return "0";
  const g = gcd(Math.abs(n), d);
  const a = Math.abs(n) / g, b = d / g;
  return (n < 0 ? "−" : "") + (b === 1 ? String(a) : `${a}/${b}`);
}

export function cellKey(topicId: string, cpa: CPAStage, bloom: BloomLevel): string {
  return `${topicId}|${cpa}|${bloom}`;
}
