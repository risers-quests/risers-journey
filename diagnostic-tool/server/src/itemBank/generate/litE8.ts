import { Template } from "./core.js";
import { Misconceptions, baseFor, card, choose, doIt, entry, markWord, shuffle, tapWords, tiles } from "./english.js";

/**
 * Literature (Grade 8 English, English Rose Reader 8): one topic per
 * chapter, built from that chapter's own text as the reader prints it.
 * A chapter file gives only data (the banks below); this file turns it into
 * the 15 levels:
 *   concrete  tap a detail in a line; tap the word that means …; put events
 *             in order (tiles); tap the words that show …; tap the one word
 *             in a summary that doesn't match the text
 *   pictorial read-the-line questions (who / what); a glossary word in its
 *             line; read-the-line again; why (inference) from a line; is
 *             Riya's claim about the text right?
 *   abstract  facts (the book's tick-the-option style); more facts; word
 *             meanings; character; theme
 * Quoted lines are short extracts, as the reader's own questions quote them.
 */

export const LIT_MISCONCEPTIONS: Misconceptions = {
  "lit-detail": {
    label: "Misses a detail in the text",
    detail: "Picks an answer the text doesn't say, or mixes up who did what.",
    childTip: "Go back to the text and find the exact line before answering.",
  },
  "lit-speaker": {
    label: "Mixes up who says or thinks a line",
    detail: "Gives the wrong speaker for a quoted line, or the wrong thing it refers to.",
    childTip: "Look at the lines around the quotation: who is talking, and to whom?",
  },
  "lit-vocab": {
    label: "Misreads a word from the text",
    detail: "Chooses a wrong meaning for a word the chapter's glossary explains.",
    childTip: "Read the whole sentence around the word, and check the glossary at the bottom of the page.",
  },
  "lit-inference": {
    label: "Can't read between the lines",
    detail: "Takes only what is stated, and misses why a character acts or feels as they do.",
    childTip: "Ask why: what does this action or thought show about the person?",
  },
  "lit-sequence": {
    label: "Mixes up the order of events",
    detail: "Puts events in the wrong order.",
    childTip: "Retell the story in your own words: first, then, after that, finally.",
  },
  "lit-character": {
    label: "Misjudges a character",
    detail: "Describes a character in a way the text doesn't support.",
    childTip: "Judge characters by what they do and say, not just by one moment.",
  },
  "lit-theme": {
    label: "Misses the main message",
    detail: "Picks a small detail or an unrelated idea as the message of the text.",
    childTip: "Ask: what does the main character learn, or what does the writer want us to feel or do?",
  },
};

export interface Mcq {
  q: string;
  a: string;
  w: [string, string, string];
  /** a line from the text, shown on a card where the level has one */
  line?: string;
}
export interface Vocab {
  s: string;
  w: string;
  meaning: string;
  wrong: [string, string, string];
}
export interface Tap {
  s: string;
  prompt: string;
  target: string | string[];
  wrong?: { phrase: string | string[]; mistake: string }[];
}
export interface Chapter {
  topic: string;
  prefix: string;
  /** what the text is called in prompts ("the story", "the poem") */
  kind: "story" | "poem" | "play" | "graphic novel" | "piece";
  /** tap a stated detail */
  taps: Tap[];
  /** tap the words that show something (evidence for an inference) */
  evidence: Tap[];
  /** events in order (3–5 each) */
  orders: string[][];
  /** a summary with one wrong word, and the word it should be */
  wrongWord: { s: string; bad: string; good: string }[];
  /** read-the-line questions (who / what / which), with `line` */
  rtc: Mcq[];
  vocab: Vocab[];
  /** why, from a line (with `line`) */
  infer: Mcq[];
  /** claims to judge: q = the claim, a = the right verdict */
  claims: Mcq[];
  facts: Mcq[];
  character: Mcq[];
  theme: Mcq[];
}

const mcq = (x: Mcq, mistake: string) => x.w.map((text) => ({ text, mistake }));

export function chapterTemplates(c: Chapter): Record<string, Template> {
  const base = baseFor(c.prefix, c.topic);
  const p = (k: number, i: number, extra: Record<string, number> = {}) => ({ k, i, ...extra });
  return {
    // ---------------- CONCRETE ----------------
    "concrete|remember": (rng, g) => {
      const [i, t] = entry(rng, c.taps, g);
      return doIt(base("c-remember", "concrete", "remember", "find a detail", rng), t.prompt, p(1, i), tapWords(t.s, t.target, t.wrong ?? []));
    },
    "concrete|understand": (rng, g) => {
      const [i, v] = entry(rng, c.vocab, g);
      return doIt(base("c-understand", "concrete", "understand", "words from the text", rng), `Tap the word that means '${v.meaning}'.`, p(2, i), tapWords(v.s, v.w));
    },
    "concrete|apply": (rng, g) => {
      const [i, ev] = entry(rng, c.orders, g);
      const swapped = [...ev];
      [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
      const t = tiles(rng, ev.join(" | "), [], [{ text: swapped.join(" "), mistake: "lit-sequence" }]);
      return doIt(base("c-apply", "concrete", "apply", "order of events", rng), `Put these events from the ${c.kind} in the order they happen.`, p(3, i), t);
    },
    "concrete|analyze": (rng, g) => {
      const [i, t] = entry(rng, c.evidence, g);
      return doIt(base("c-analyze", "concrete", "analyze", "evidence in the text", rng), t.prompt, p(4, i), tapWords(t.s, t.target, t.wrong ?? []));
    },
    "concrete|evaluate": (rng, g) => {
      const [i, x] = entry(rng, c.wrongWord, g);
      return doIt(
        base("c-evaluate", "concrete", "evaluate", "check a summary", rng),
        `One word in this summary doesn't match the ${c.kind}. Tap it.`,
        p(5, i),
        tapWords(x.s, x.bad)
      );
    },

    // ---------------- PICTORIAL ----------------
    "pictorial|remember": (rng, g) => {
      const [i, x] = entry(rng, c.rtc, g);
      return choose(base("p-remember", "pictorial", "remember", "read the line", rng), x.q, card([x.line!], `From the ${c.kind}`), p(6, i), x.a, mcq(x, "lit-speaker"));
    },
    "pictorial|understand": (rng, g) => {
      const [i, v] = entry(rng, c.vocab, g);
      return choose(
        base("p-understand", "pictorial", "understand", "a word in its line", rng),
        `What does the highlighted word mean here?`,
        card([markWord(v.s, v.w)], `From the ${c.kind}`),
        p(2, i),
        v.meaning,
        v.wrong.map((text) => ({ text, mistake: "lit-vocab" }))
      );
    },
    "pictorial|apply": (rng, g) => {
      const [i, x] = entry(rng, c.rtc, g);
      return choose(base("p-apply", "pictorial", "apply", "read the line", rng), x.q, card([x.line!], `From the ${c.kind}`), p(6, i), x.a, mcq(x, "lit-detail"));
    },
    "pictorial|analyze": (rng, g) => {
      const [i, x] = entry(rng, c.infer, g);
      return choose(base("p-analyze", "pictorial", "analyze", "why (between the lines)", rng), x.q, card([x.line!], `From the ${c.kind}`), p(7, i), x.a, mcq(x, "lit-inference"));
    },
    "pictorial|evaluate": (rng, g) => {
      const [i, x] = entry(rng, c.claims, g);
      return choose(base("p-evaluate", "pictorial", "evaluate", "judge a claim", rng), "Is Riya right about this?", card([`Riya: ${x.q}`]), p(8, i), x.a, mcq(x, "lit-inference"));
    },

    // ---------------- ABSTRACT ----------------
    "abstract|remember": (rng, g) => {
      const [i, x] = entry(rng, c.facts, g);
      return choose(base("a-remember", "abstract", "remember", "facts from the text", rng), x.q, null, p(9, i), x.a, mcq(x, "lit-detail"));
    },
    "abstract|understand": (rng, g) => {
      const [i, x] = entry(rng, c.facts, g);
      return choose(base("a-understand", "abstract", "understand", "facts from the text", rng), x.q, null, p(9, i), x.a, shuffle(rng, mcq(x, "lit-detail")));
    },
    "abstract|apply": (rng, g) => {
      const [i, v] = entry(rng, c.vocab, g);
      return choose(base("a-apply", "abstract", "apply", "word meanings", rng), `In the ${c.kind}, '${v.w}' means ___`, null, p(2, i), v.meaning, v.wrong.map((text) => ({ text, mistake: "lit-vocab" })));
    },
    "abstract|analyze": (rng, g) => {
      const [i, x] = entry(rng, c.character, g);
      return choose(base("a-analyze", "abstract", "analyze", "character", rng), x.q, null, p(10, i), x.a, mcq(x, "lit-character"));
    },
    "abstract|evaluate": (rng, g) => {
      const [i, x] = entry(rng, c.theme, g);
      return choose(base("a-evaluate", "abstract", "evaluate", "the message", rng), x.q, null, p(11, i), x.a, mcq(x, "lit-theme"));
    },
  };
}

/** For the stress test: lines on cards and vocab words really appear where they should. */
export function verifyChapter(c: Chapter): string | null {
  for (const v of c.vocab) if (!new RegExp(`\\b${v.w}\\b`).test(v.s)) return `${c.topic}: "${v.w}" not in "${v.s}"`;
  for (const x of c.wrongWord) if (!x.s.includes(x.bad) || x.bad === x.good) return `${c.topic}: bad word "${x.bad}"`;
  for (const x of [...c.rtc, ...c.infer]) if (!x.line) return `${c.topic}: missing line for "${x.q}"`;
  for (const o of c.orders) if (o.length < 3 || new Set(o).size !== o.length) return `${c.topic}: order needs 3+ different events`;
  return null;
}
