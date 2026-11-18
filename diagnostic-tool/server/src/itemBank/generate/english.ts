import { BloomLevel, CPAStage, OrderActivity, TextSpec, WordsActivity } from "../../types.js";
import { GeneratedItem, Rng, build, buildActivity } from "./core.js";

/**
 * Shared pieces for English (Grade 8, English Rose Reader 8).
 *
 * English questions can't be worked out from random numbers the way maths
 * questions are, so each topic keeps a bank of hand-checked sentences with
 * their parts marked (the clause, the verb, the passive form …). A template
 * picks a sentence and builds the question from those parts; every wrong
 * option is built from a named mistake. `params` records which sentence
 * (bank k, entry i), so a child doesn't meet the same sentence twice in a
 * topic.
 *
 * The three stages, for English:
 *   concrete  hands-on: tap words in a sentence (WordsActivity), or build a
 *             sentence from word tiles (OrderActivity)
 *   pictorial a text card (TextSpec) with the part that matters highlighted;
 *             the prompt only says what to do with it
 *   abstract  bare rule or term questions, no card (e.g. "Passive of: …")
 */

export type Cpa = CPAStage;
export type Bloom = BloomLevel;
export type Misconceptions = Record<string, { label: string; detail: string; childTip: string }>;

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Choose an entry of a bank (or re-use `given.i`). Returns its index and the entry. */
export function entry<T>(rng: Rng, bank: readonly T[], given?: Record<string, number>): [number, T] {
  const i = given && Number.isInteger(given.i) && given.i >= 0 && given.i < bank.length ? given.i : Math.floor(rng() * bank.length);
  return [i, bank[i]];
}

/**
 * Choose an entry that passes `ok`, by its index in the whole bank (so a
 * sentence is the same question in every level of a topic and isn't met
 * twice). Re-uses `given.i` when that entry passes.
 */
export function entryIn<T>(rng: Rng, bank: readonly T[], ok: (x: T) => boolean, given?: Record<string, number>): [number, T] {
  if (given && Number.isInteger(given.i) && bank[given.i] && ok(bank[given.i])) return [given.i, bank[given.i]];
  const idx = bank.map((x, i) => (ok(x) ? i : -1)).filter((i) => i >= 0);
  const i = idx[Math.floor(rng() * idx.length)];
  return [i, bank[i]];
}

/** Item base for one cell. */
export function baseFor(prefix: string, topicId: string) {
  return (cell: string, cpa: Cpa, bloom: Bloom, subskill: string, rng: Rng) => ({
    id: `${prefix}-${cell}-${Math.floor(rng() * 1e9).toString(36)}`,
    topicId,
    cpa,
    bloom,
    subskill,
  });
}

// A dash joining two words (shop—cracked) splits them, so each can be tapped.
export const words = (s: string) => s.replace(/—(?=\S)/g, "— ").split(/\s+/).filter(Boolean);

/** Strip punctuation for matching a word ("tonight." matches "tonight"). */
const bare = (w: string) => w.replace(/^[‘'"(“]+|[’'",.?!;:)”—]+$/g, "").toLowerCase();

/** Token indices of `phrase` (contiguous) in `tokens`; throws if missing so the stress test catches a bad bank entry. */
export function span(tokens: string[], phrase: string, from = 0): number[] {
  const p = words(phrase).map(bare);
  for (let s = from; s + p.length <= tokens.length; s++) {
    if (p.every((w, k) => bare(tokens[s + k]) === w)) return p.map((_, k) => s + k);
  }
  throw new Error(`"${phrase}" not found in "${tokens.join(" ")}"`);
}

/** Tap the words of `target` (one phrase or several) in `sentence`. */
export function tapWords(sentence: string, target: string | string[], wrong: { phrase: string | string[]; mistake: string }[] = [], also: (string | string[])[] = []): WordsActivity {
  const tokens = words(sentence);
  const cells = (ph: string | string[]) => [...new Set((Array.isArray(ph) ? ph : [ph]).flatMap((x) => span(tokens, x)))].sort((a, b) => a - b);
  const t = cells(target);
  const k = (c: number[]) => c.join(",");
  const wrongSets = wrong
    .map((w) => ({ cells: cells(w.phrase), mistake: w.mistake }))
    .filter((w, i, arr) => w.cells.length && k(w.cells) !== k(t) && arr.findIndex((x) => k(x.cells) === k(w.cells)) === i);
  const alsoRight = also.map(cells).filter((c) => k(c) !== k(t));
  return { kind: "words", tokens, target: t, wrongSets, ...(alsoRight.length ? { alsoRight } : {}) };
}

/**
 * Build a sentence from tiles. `answer` is split into tiles at "|"
 * ("The park | was cleaned | by the volunteers | ."); `spares` are extra
 * tiles that tempt a mistake. `also` are other right orders (as plain text).
 */
export function tiles(rng: Rng, answer: string, spares: string[] = [], wrong: { text: string; mistake: string }[] = [], also: string[] = []): OrderActivity {
  const parts = answer.split("|").map((x) => x.trim()).filter(Boolean);
  const plain = parts.join(" ");
  let t = shuffle(rng, [...parts, ...spares]);
  // never start already in the right order
  for (let n = 0; n < 30 && t.slice(0, parts.length).join(" ") === plain; n++) t = shuffle(rng, t);
  return { kind: "order", tiles: t, answers: [plain, ...also], wrong: wrong.filter((w) => w.text !== plain && !also.includes(w.text)) };
}

export const card = (lines: string[], caption?: string): TextSpec => ({ kind: "text", lines, ...(caption ? { caption } : {}) });

/** `sentence` with `phrase` highlighted as [[phrase]]. */
export function mark(sentence: string, phrase: string): string {
  const at = sentence.indexOf(phrase);
  if (at < 0) throw new Error(`"${phrase}" not in "${sentence}"`);
  return sentence.slice(0, at) + "[[" + phrase + "]]" + sentence.slice(at + phrase.length);
}

/** Like mark(), but only whole words ("was" doesn't match inside "wasp"). */
export function markWord(sentence: string, phrase: string): string {
  const m = new RegExp(`(^|[^\\p{L}’'])(${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?![\\p{L}])`, "u").exec(sentence);
  if (!m) throw new Error(`"${phrase}" not a whole word in "${sentence}"`);
  const at = m.index + m[1].length;
  return sentence.slice(0, at) + "[[" + phrase + "]]" + sentence.slice(at + phrase.length);
}

/** Multiple choice: right answer, then wrong ones (each a named mistake) in order of preference. */
export function choose(
  b: ReturnType<ReturnType<typeof baseFor>>,
  prompt: string,
  representation: TextSpec | null,
  params: Record<string, number>,
  correct: string,
  wrong: { text: string; mistake: string | null }[]
): GeneratedItem {
  return build({ ...b, prompt, representation }, params, correct, wrong);
}

export function doIt(b: ReturnType<ReturnType<typeof baseFor>>, prompt: string, params: Record<string, number>, activity: WordsActivity | OrderActivity): GeneratedItem {
  return buildActivity({ ...b, prompt, representation: null }, params, activity);
}

/** Capitalise the first letter. */
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** Lower-case the first letter (unless it's "I" or a name, marked by keepCap). */
export const low = (s: string, keepCap = false) => (keepCap ? s : s.charAt(0).toLowerCase() + s.slice(1));
