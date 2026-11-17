/**
 * Stress test for generated questions: builds thousands per cell of every
 * generated topic and checks each one.
 *   - well formed: 4 different options (or an activity answer), every
 *     mistake code known
 *   - one right answer, recomputed independently per topic (verify)
 *   - right stage: concrete has a hands-on activity, pictorial a picture,
 *     abstract neither
 *   - never answers itself: the right answer isn't shown in the question
 *     or picture unless a wrong option is shown too
 *   - activities: a perfect attempt is marked right; typical mistakes are
 *     caught as the right misconception
 * Run: npx tsx scripts/check-templates.ts   (N=2000 for a quicker run)
 */
import { GENERATED_TOPICS, GRADE4_TOPICS, MISCONCEPTIONS, generateItem, GeneratedItem } from "../src/itemBank/generate/index.js";
import { checkActivity } from "../src/itemBank/generate/activities.js";
import { verify as verifyLargeNumbers, dropZeros } from "../src/itemBank/generate/moreOnLargeNumbers.js";
import { verify as verifyOperations } from "../src/itemBank/generate/operationsOnLargeNumbers.js";
import { BLOOM_ORDER, CPA_ORDER } from "../src/types.js";

const N = Number(process.env.N || 20000);
let failures = 0;
const fail = (msg: string) => {
  if (failures++ < 25) console.log("FAIL", msg);
};

// ---- per-topic independent answer checks ----
function leadValue(text: string): number | null {
  const m = text.match(/(\d+)\s*\/\s*(\d+)|(?<![\d/])(\d+)(?![\d/])/);
  if (!m) return null;
  return m[1] ? Number(m[1]) / Number(m[2]) : Number(m[3]);
}
function verifyFractions(it: GeneratedItem): string | null {
  const { a, b } = it.params;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!;
  const cell = `${it.cpa}|${it.bloom}`;
  const rv = leadValue(right.text);
  if (cell === "pictorial|remember") return rv === 1 / b ? null : `one part should be 1/${b}, got ${right.text}`;
  if (["abstract|remember", "abstract|apply", "abstract|evaluate", "pictorial|understand", "pictorial|apply", "pictorial|analyze"].includes(cell) && rv !== null && Math.abs(rv - a / b) > 1e-9)
    return `right answer "${right.text}" is ${rv}, not ${a}/${b}`;
  for (const c of it.choices) {
    if (c.id === it.correctChoiceId || it.mistakes[c.id] === "fd-not-simplified" || rv === null) continue;
    const v = leadValue(c.text);
    if (v !== null && Math.abs(v - rv) < 1e-9 && !/divided|plus|minus|multiplied|÷|×|−|\+|shared equally|groups of|added together|bar|is (greater|less)|equals|even|Yes|No/.test(c.text + right.text))
      return `wrong option "${c.text}" equals right "${right.text}"`;
  }
  return null;
}
const VERIFY: Record<string, (it: GeneratedItem) => string | null> = {
  "fractions-division": verifyFractions,
  "more-large-numbers": (it) => verifyLargeNumbers(it),
  "operations-large-numbers": (it) => verifyOperations(it),
};

// ---- activities: a perfect attempt, and typical mistakes ----
function checkActivityItem(it: GeneratedItem, where: string) {
  const act = it.activity!;
  if (act.kind === "share") {
    const slices = act.wholes % act.people === 0 ? 1 : act.people;
    const per = (act.wholes * slices) / act.people;
    const good = { wholes: act.wholes, people: act.people, slices, plates: Array(act.people).fill(per), leftover: 0 };
    if (!checkActivity(act, good).correct) fail(`${where}: a perfect sharing was marked wrong`);
    if (act.mode === "share") {
      const n = Math.floor(act.wholes / act.people);
      if (act.wholes % act.people) {
        const r = checkActivity(act, { ...good, slices: 1, plates: Array(act.people).fill(n), leftover: act.wholes - n * act.people });
        if (r.correct || r.misconception !== "fd-whole-part-only") fail(`${where}: leftover pieces not caught`);
      }
      const uneven = [...good.plates];
      uneven[0] += 1;
      uneven[1] -= 1;
      if (checkActivity(act, { ...good, plates: uneven }).misconception !== "fd-unequal-shares") fail(`${where}: unequal sharing not caught`);
    } else {
      const r = checkActivity(act, { wholes: act.people, people: act.wholes, slices: act.wholes, plates: Array(act.wholes).fill(act.people), leftover: 0 });
      if (r.correct || r.misconception !== "fd-flips") fail(`${where}: upside-down build not caught as flipping`);
      const twice = { wholes: act.wholes * 2, people: act.people * 2, slices: act.people * 2, plates: Array(act.people * 2).fill(act.wholes * 2), leftover: 0 };
      if (!checkActivity(act, twice).correct) fail(`${where}: an equivalent build (${twice.wholes}/${twice.people}) was marked wrong`);
    }
  } else if (act.kind === "place-value") {
    const digits = act.columns.map((p) => Math.floor(act.target / p) % 10);
    if (act.columns.reduce((s, p, i) => s + p * digits[i], 0) !== act.target) fail(`${where}: target ${act.target} doesn't fit the chart`);
    if (!checkActivity(act, { counts: digits }).correct) fail(`${where}: the right discs were marked wrong`);
    const asCounts = (v: number) => act.columns.map((p) => Math.floor(v / p) % 10);
    if (act.wrong) {
      // Each listed mistake result must be marked as that mistake.
      for (const w of act.wrong) if (checkActivity(act, { counts: asCounts(w.value) }).misconception !== w.mistake) fail(`${where}: ${w.value} not caught as ${w.mistake}`);
      if (act.wrong.some((w) => w.value === act.target)) fail(`${where}: a 'mistake' result equals the right answer`);
    } else if (act.mode === "build") {
      const dz = dropZeros(act.target);
      if (dz !== act.target && checkActivity(act, { counts: asCounts(dz) }).misconception !== "lnum-drops-zero") fail(`${where}: dropped zeros not caught`);
    } else if (act.mode === "regroup") {
      if (checkActivity(act, { counts: act.start }).misconception !== "lnum-no-regroup") fail(`${where}: not regrouping not caught`);
    } else {
      const from = act.start.reduce((s, c, i) => s + c * act.columns[i], 0);
      const p = act.target - from;
      if (from + p * 10 < 1000000 && checkActivity(act, { counts: asCounts(from + p * 10) }).misconception !== "lnum-wrong-column") fail(`${where}: adding in the wrong column not caught`);
      if (checkActivity(act, { counts: asCounts(act.target - 10 * p) }).misconception !== "lnum-forgets-carry") fail(`${where}: a dropped carry not caught`);
    }
  } else fail(`${where}: unknown activity`);
}

const RUNS: [string, number][] = [...GENERATED_TOPICS.map((t) => [t, 5] as [string, number]), ...GRADE4_TOPICS.map((t) => [t, 4] as [string, number])];
for (const [topic, grade] of RUNS) {
  for (const cpa of CPA_ORDER)
    for (const bloom of BLOOM_ORDER) {
      const seen = new Set<string>();
      for (let i = 0; i < N; i++) {
        let it: GeneratedItem;
        try {
          it = generateItem(topic, cpa, bloom, { grade });
          if (grade === 4) {
            // Grade 4: numbers stay below 10,00,000 (pictures and activities
            // included). Large Numbers uses the lakhs column (the book goes
            // to 9,99,999); Operations stays within ten thousands for now.
            const nums: number[] = [];
            const walk = (v: unknown): void => {
              if (typeof v === "number") nums.push(v);
              else if (typeof v === "string") (v.match(/\d+(?:,\d+)*/g) ?? []).forEach((x) => nums.push(Number(x.replace(/,/g, ""))));
              else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => k !== "id" && walk(x));
            };
            walk([it.prompt, it.choices, it.representation, it.activity]);
            if (nums.some((x) => x >= 1000000)) fail(`${topic} G4 ${cpa}/${bloom}: a number of ten lakh or more`);
            const maxCol = topic === "more-large-numbers" ? 100000 : 10000;
            if (it.activity && "columns" in it.activity && it.activity.columns[0] > maxCol) fail(`${topic} G4 ${cpa}/${bloom}: chart has too many columns`);
          }
        } catch (e) {
          fail(`${topic} ${cpa}/${bloom}: ${e}`);
          break;
        }
        const where = `${topic} ${cpa}/${bloom} ${JSON.stringify(it.params)}`;
        seen.add(JSON.stringify(it.params));
        for (const code of Object.values(it.mistakes)) if (code && !MISCONCEPTIONS[code]) fail(`${where}: unknown mistake ${code}`);
        if (cpa === "concrete" && !it.activity) fail(`${where}: concrete without a hands-on activity`);
        if (cpa === "abstract" && (it.representation || it.activity)) fail(`${where}: abstract with a picture or activity`);
        if (cpa === "pictorial" && !it.representation) fail(`${where}: pictorial without a picture`);
        if (it.activity) checkActivityItem(it, where);
        if (it.answerBy === "activity") continue;

        if (it.choices.length !== 4) fail(`${where}: ${it.choices.length} options`);
        if (new Set(it.choices.map((c) => c.text)).size !== it.choices.length) fail(`${where}: duplicate options`);
        const right = it.choices.find((c) => c.id === it.correctChoiceId);
        if (!right) {
          fail(`${where}: no right answer`);
          continue;
        }
        // Whole-token match: "500" inside "2,293,500" is the skill, not a giveaway.
        const shown = [it.prompt, JSON.stringify(it.representation ?? {})].join(" ");
        const appears = (t: string) => t.length > 2 && new RegExp(`(?<!\\d|\\d[,.])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\d|[,.]\\d)`).test(shown);
        const showsAnother = it.choices.some((c) => c.id !== it.correctChoiceId && appears(c.text));
        if (appears(right.text) && !showsAnother) fail(`${where}: shows its own answer "${right.text}"`);
        const problem = VERIFY[topic]?.(it);
        if (problem) fail(`${where}: ${problem}`);
      }
      console.log(`G${grade} ${topic.padEnd(20)} ${cpa.padEnd(9)} ${bloom.padEnd(10)} ${String(seen.size).padStart(6)} different`);
    }
}
console.log(failures ? `\n${failures} FAILURES` : `\nAll ${RUNS.length * 15 * N} generated questions passed (Grade 5 and Grade 4).`);
process.exit(failures ? 1 : 0);
