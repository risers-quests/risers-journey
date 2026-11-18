import { Template } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, tapWords, tiles } from "./english.js";

/**
 * A language-skill topic (Grade 7 Language Arts and Writing) built from
 * hand-checked banks, like the Grade 8 literature builder. Each item names
 * the mistake its wrong answers stand for.
 *   concrete  c1 tap (find it), c2 tap (find it, harder), c3 build from
 *             tiles, c4 build (harder), c5 tap the one wrong word
 *   pictorial p1–p4 a highlighted card and a question, p5 is Riya right?
 *   abstract  a1 the rule, a2–a3 fill the gap, a4–a5 which is correct
 */
export interface STap { s: string; prompt: string; target: string | string[]; wrong?: { phrase: string | string[]; mistake: string }[]; also?: (string | string[])[] }
export interface SBuild { prompt: string; answer: string; spares: string[]; wrong: [string, string][]; also?: string[]; glue?: boolean }
export interface SFix { s: string; bad: string; mistake: string; prompt?: string }
export interface SMcq { q: string; a: string; w: [string, string, string]; m: string; line?: string; caption?: string }

export interface SkillTopic {
  topic: string;
  prefix: string;
  c1: STap[];
  c2?: STap[];
  c3: SBuild[];
  c4?: SBuild[];
  c5: SFix[];
  /** pictorial: every item has a `line` (shown on a card, [[highlights]] allowed) */
  p1: SMcq[];
  p2?: SMcq[];
  p3?: SMcq[];
  p4?: SMcq[];
  /** claims for 'Is Riya right?' (q = her claim, shown on a card) */
  p5: SMcq[];
  a1: SMcq[];
  a2: SMcq[];
  a3?: SMcq[];
  a4: SMcq[];
  a5?: SMcq[];
}

export function skillTemplates(t: SkillTopic): Record<string, Template> {
  const base = baseFor(t.prefix, t.topic);
  const p = (k: number, i: number) => ({ k, i });
  const mc = (x: SMcq) => x.w.map((text) => ({ text, mistake: x.m }));
  const tap = (bank: STap[], k: number, cell: string, bloom: "remember" | "understand") => (rng: () => number, g?: Record<string, number>) => {
    const [i, x] = entry(rng, bank, g);
    return doIt(base(cell, "concrete", bloom, "find it in a sentence", rng), x.prompt, p(k, i), tapWords(x.s, x.target, x.wrong ?? [], x.also ?? []));
  };
  const make = (bank: SBuild[], k: number, cell: string, bloom: "apply" | "analyze") => (rng: () => number, g?: Record<string, number>) => {
    const [i, x] = entry(rng, bank, g);
    const a = tiles(rng, x.answer, x.spares, x.wrong.map(([text, mistake]) => ({ text, mistake })), x.also ?? []);
    return doIt(base(cell, "concrete", bloom, "build it", rng), `${x.prompt} (Not every tile is needed.)`, p(k, i), x.glue ? { ...a, glue: true } : a);
  };
  const pic = (bank: SMcq[], k: number, cell: string, bloom: "remember" | "understand" | "apply" | "analyze") => (rng: () => number, g?: Record<string, number>) => {
    const [i, x] = entry(rng, bank, g);
    return choose(base(cell, "pictorial", bloom, "read it closely", rng), x.q, card([x.line!], x.caption), p(k, i), x.a, mc(x));
  };
  const abs = (bank: SMcq[], k: number, cell: string, bloom: "remember" | "understand" | "apply" | "analyze" | "evaluate") => (rng: () => number, g?: Record<string, number>) => {
    const [i, x] = entry(rng, bank, g);
    return choose(base(cell, "abstract", bloom, "the rule", rng), x.q, null, p(k, i), x.a, mc(x));
  };
  return {
    "concrete|remember": tap(t.c1, 1, "c-remember", "remember"),
    "concrete|understand": tap(t.c2 ?? t.c1, t.c2 ? 2 : 1, "c-understand", "understand"),
    "concrete|apply": make(t.c3, 3, "c-apply", "apply"),
    "concrete|analyze": make(t.c4 ?? t.c3, t.c4 ? 4 : 3, "c-analyze", "analyze"),
    "concrete|evaluate": (rng, g) => {
      const [i, x] = entry(rng, t.c5, g);
      const a = tapWords(x.s, x.bad);
      return doIt(base("c-evaluate", "concrete", "evaluate", "find the mistake", rng), x.prompt ?? "One word (or group of words) here is wrong. Tap it.", p(5, i), a);
    },
    "pictorial|remember": pic(t.p1, 6, "p-remember", "remember"),
    "pictorial|understand": pic(t.p2 ?? t.p1, t.p2 ? 7 : 6, "p-understand", "understand"),
    "pictorial|apply": pic(t.p3 ?? t.p1, t.p3 ? 8 : 6, "p-apply", "apply"),
    "pictorial|analyze": pic(t.p4 ?? t.p2 ?? t.p1, t.p4 ? 9 : t.p2 ? 7 : 6, "p-analyze", "analyze"),
    "pictorial|evaluate": (rng, g) => {
      const [i, x] = entry(rng, t.p5, g);
      return choose(base("p-evaluate", "pictorial", "evaluate", "judge a claim", rng), "Is Riya right?", card([`Riya: ${x.q}`]), p(10, i), x.a, mc(x));
    },
    "abstract|remember": abs(t.a1, 11, "a-remember", "remember"),
    "abstract|understand": abs(t.a2, 12, "a-understand", "understand"),
    "abstract|apply": abs(t.a3 ?? t.a2, t.a3 ? 13 : 12, "a-apply", "apply"),
    "abstract|analyze": abs(t.a4, 14, "a-analyze", "analyze"),
    "abstract|evaluate": abs(t.a5 ?? t.a4, t.a5 ? 15 : 14, "a-evaluate", "evaluate"),
  };
}

/** For the stress test: every pictorial item has a line; each fix's bad word is in its sentence. */
export function verifySkill(t: SkillTopic): string | null {
  for (const b of [t.p1, t.p2, t.p3, t.p4]) for (const x of b ?? []) if (!x.line) return `${t.topic}: missing line for "${x.q}"`;
  for (const f of t.c5) if (!f.s.includes(f.bad)) return `${t.topic}: "${f.bad}" not in "${f.s}"`;
  return null;
}

/** Register a topic's templates and misconceptions. */
export function register(into: Record<string, Record<string, Template>>, t: SkillTopic) {
  into[t.topic] = skillTemplates(t);
}
export type { Misconceptions };
