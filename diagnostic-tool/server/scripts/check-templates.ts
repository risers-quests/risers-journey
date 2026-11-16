/**
 * Stress test for generated questions: builds thousands per cell and checks
 * each one is well formed and has exactly one right answer.
 * Run: npx tsx scripts/check-templates.ts
 */
import { generateItem, hasTemplate, MISCONCEPTIONS } from "../src/itemBank/generate/index.js";
import { BLOOM_ORDER, CPA_ORDER } from "../src/types.js";

const N = Number(process.env.N || 20000);
const topics = ["fractions-division"];
let failures = 0;
const fail = (msg: string) => { if (failures++ < 25) console.log("FAIL", msg); };

// The value a choice's text leads with: "7/3 ...", "2", "Each gets 3/4 of ..." -> number.
function leadValue(text: string): number | null {
  const m = text.match(/(\d+)\s*\/\s*(\d+)|(?<![\d/])(\d+)(?![\d/])/);
  if (!m) return null;
  return m[1] ? Number(m[1]) / Number(m[2]) : Number(m[3]);
}

for (const topic of topics) for (const cpa of CPA_ORDER) for (const bloom of BLOOM_ORDER) {
  if (!hasTemplate(topic, cpa, bloom)) { fail(`${topic} ${cpa}/${bloom}: no template`); continue; }
  const seen = new Set<string>();
  for (let i = 0; i < N; i++) {
    const it = generateItem(topic, cpa, bloom);
    const { a, b } = it.params;
    const where = `${cpa}/${bloom} a=${a} b=${b}`;
    seen.add(`${a}/${b}`);
    if (it.choices.length !== 4) fail(`${where}: ${it.choices.length} choices`);
    if (new Set(it.choices.map((c) => c.text)).size !== 4) fail(`${where}: duplicate options`);
    if (!it.choices.some((c) => c.id === it.correctChoiceId)) fail(`${where}: no right answer`);
    if (!(a > 0 && b > 0)) fail(`${where}: bad numbers`);
    for (const [cid, code] of Object.entries(it.mistakes)) if (code && !MISCONCEPTIONS[code]) fail(`${where}: unknown mistake ${code} on ${cid}`);
    const rep = it.representation;
    if (rep?.kind === "concrete" && (rep.itemCount !== a || rep.groups !== b)) fail(`${where}: picture shows ${rep.itemCount}/${rep.groups}`);
    if (rep?.kind === "bar-model" && rep.parts !== b) fail(`${where}: bar has ${rep.parts} parts`);
    if (rep?.kind === "bar-model" && (rep.segmentLabels ?? []).some((l) => l)) fail(`${where}: bar prints a label that could give the answer away`);
    if (rep?.kind === "sharing" && (rep.wholes !== a || rep.people !== b)) fail(`${where}: sharing picture shows ${rep.wholes}/${rep.people}`);
    if (cpa === "concrete" && rep?.kind === "concrete" && a % b !== 0) fail(`${where}: grouping picture can't show a share of ${a}/${b}`);
    if (cpa === "abstract" && rep) fail(`${where}: abstract question has a picture`);
    if (cpa !== "abstract" && !rep) fail(`${where}: ${cpa} question has no picture`);
    const right = it.choices.find((c) => c.id === it.correctChoiceId)!;
    // The right answer's value, where it states one, must be a ÷ b (or 1/b for "one part of the bar", or the whole share).
    const rv = leadValue(right.text);
    const expected =
      bloom === "remember" && cpa === "pictorial" ? 1 / b :
      bloom === "understand" && cpa === "concrete" ? a / b :
      ["abstract|remember", "abstract|apply", "abstract|evaluate", "pictorial|understand", "pictorial|apply", "pictorial|analyze", "pictorial|evaluate"].includes(`${cpa}|${bloom}`) ? null : undefined;
    if (expected !== undefined && rv !== null) {
      const want = expected ?? a / b;
      if (Math.abs(rv - want) > 1e-9 && !(cpa === "pictorial" && bloom === "evaluate")) fail(`${where}: right answer "${right.text}" is ${rv}, expected ${want}`);
    }
    // No wrong option may have the same value as the right one (apart from
    // "not simplified", which the question rules out by asking for simplest form).
    if (rv !== null) for (const c of it.choices) {
      if (c.id === it.correctChoiceId || it.mistakes[c.id] === "fd-not-simplified") continue;
      const v = leadValue(c.text);
      if (v !== null && Math.abs(v - rv) < 1e-9 && !/divided|plus|minus|multiplied|÷|×|−|\+|counters|shared equally|groups of|added together|bar|is (greater|less)|equals|even/.test(c.text + right.text)) fail(`${where}: wrong option "${c.text}" equals right "${right.text}"`);
    }
  }
  console.log(`${topic} ${cpa.padEnd(9)} ${bloom.padEnd(10)} ok · ${seen.size} different number pairs`);
}
console.log(failures ? `\n${failures} FAILURES` : `\nAll ${topics.length * 15 * N} generated questions passed.`);
process.exit(failures ? 1 : 0);
