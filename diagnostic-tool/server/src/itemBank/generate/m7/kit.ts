import { BloomLevel, CPAStage, Representation, ShadeActivity, TextSpec } from "../../../types.js";
import { GeneratedItem, Rng, Template, build, buildActivity } from "../core.js";
import { tapWords, tiles } from "../english.js";

/** Grade 7 Maths: small helpers so each chapter file is mostly its questions. */
export const neg = (n: number) => (n < 0 ? `−${-n}` : String(n));
/** An integer in brackets when negative: (−3). */
export const br = (n: number) => (n < 0 ? `(${neg(n)})` : String(n));
export const card = (lines: string[], caption?: string): TextSpec => ({ kind: "text", lines, ...(caption ? { caption } : {}) });

export function kit(prefix: string, topic: string) {
  const base = (cell: string, cpa: CPAStage, bloom: BloomLevel, subskill: string, rng: Rng) => ({
    id: `${prefix}-${cell}-${Math.floor(rng() * 1e9).toString(36)}`,
    topicId: topic,
    cpa,
    bloom,
    subskill,
  });
  const cellOf = (cpa: CPAStage, bloom: BloomLevel) => `${cpa[0]}-${bloom}`;
  return {
    /** multiple choice; wrong = [text, mistake] in order of preference */
    mc(cpa: CPAStage, bloom: BloomLevel, sub: string, rng: Rng, params: Record<string, number>, prompt: string, representation: Representation, right: string, wrong: [string, string][]): GeneratedItem {
      return build({ ...base(cellOf(cpa, bloom), cpa, bloom, sub, rng), prompt, representation }, params, right, wrong.map(([text, mistake]) => ({ text, mistake })));
    },
    /** shade `target` squares (fill mode) */
    shade(bloom: BloomLevel, sub: string, rng: Rng, params: Record<string, number>, prompt: string, rows: number, cols: number, target: number, unit: string, wrong: [number, string][]): GeneratedItem {
      const seen = new Set([target]);
      const w = wrong.filter(([v]) => Number.isInteger(v) && v >= 0 && v <= rows * cols && !seen.has(v) && (seen.add(v), true)).map(([value, mistake]) => ({ value, mistake }));
      const a: ShadeActivity = { kind: "shade", rows, cols, target, unit, wrong: w };
      return buildActivity({ ...base(cellOf("concrete", bloom), "concrete", bloom, sub, rng), prompt, representation: null }, params, a);
    },
    /** tap numbers / words in a line */
    tap(bloom: BloomLevel, sub: string, rng: Rng, params: Record<string, number>, prompt: string, line: string, target: string | string[], wrong: { phrase: string | string[]; mistake: string }[] = []): GeneratedItem {
      return buildActivity({ ...base(cellOf("concrete", bloom), "concrete", bloom, sub, rng), prompt, representation: null }, params, tapWords(line, target, wrong));
    },
    /** build from tiles ("a | b | c") */
    order(bloom: BloomLevel, sub: string, rng: Rng, params: Record<string, number>, prompt: string, answer: string, spares: string[], wrong: [string, string][], also: string[] = []): GeneratedItem {
      return buildActivity({ ...base(cellOf("concrete", bloom), "concrete", bloom, sub, rng), prompt, representation: null }, params, tiles(rng, answer, spares, wrong.map(([text, mistake]) => ({ text, mistake })), also));
    },
  };
}
/** Retry a template with fresh numbers when its numbers can't make four different options. */
export function safe(ts: Record<string, Template>): Record<string, Template> {
  return Object.fromEntries(
    Object.entries(ts).map(([cell, t]) => [
      cell,
      ((rng, g) => {
        for (let n = 0; ; n++) {
          try {
            return t(rng, g);
          } catch (e) {
            if (n > 40) throw e;
          }
        }
      }) as Template,
    ])
  );
}

/** Retry when the right answer happens to appear in the question (it would give itself away). */
export function noEcho(ts: Record<string, Template>): Record<string, Template> {
  return Object.fromEntries(Object.entries(ts).map(([cell, t]) => [cell, ((rng, g) => {
    for (let n = 0; ; n++) {
      const it = t(rng, g);
      const right = it.choices.find((c) => c.id === it.correctChoiceId)?.text ?? "";
      const shown = it.prompt + " " + JSON.stringify(it.representation ?? "");
      if (right.length <= 2 || !shown.includes(right) || n > 40) return it;
    }
  }) as Template]));
}
export type Misconceptions = Record<string, { label: string; detail: string; childTip: string }>;
