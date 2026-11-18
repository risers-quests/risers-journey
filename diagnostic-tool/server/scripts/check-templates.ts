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
import { LA7_BANKS, W7_BANKS, W4_BANKS, L4_BANKS, W3_BANKS, L6_BANKS, W6_BANKS, languageTopics, mathsTopics, ENGLISH8_TOPICS, GENERATED_TOPICS, GRADE4_TOPICS, GRADE8_TOPICS, MISCONCEPTIONS, generateItem, GeneratedItem } from "../src/itemBank/generate/index.js";
import { checkActivity } from "../src/itemBank/generate/activities.js";
import { verify as verifyLargeNumbers, dropZeros } from "../src/itemBank/generate/moreOnLargeNumbers.js";
import { verify as verifyOperations } from "../src/itemBank/generate/operationsOnLargeNumbers.js";
import { verify as verifyFactorsG4 } from "../src/itemBank/generate/factorsMultiplesG4.js";
import { verify as verifyFractionsG4 } from "../src/itemBank/generate/fractionsG4.js";
import { verify as verifyDecimalsG4 } from "../src/itemBank/generate/decimalsG4.js";
import { BLOOM_ORDER, CPA_ORDER } from "../src/types.js";
import { tidySentence } from "../src/itemBank/generate/activities.js";
import { verifySkill } from "../src/itemBank/generate/skillTopic.js";
import { verify as verifyVoiceE8 } from "../src/itemBank/generate/voiceE8.js";
import { verify as verifySpeechE8 } from "../src/itemBank/generate/speechE8.js";
import { verify as verifySentencesE8 } from "../src/itemBank/generate/sentencesE8.js";
import { verify as verifyConditionalsE8 } from "../src/itemBank/generate/conditionalsE8.js";
import { verify as verifyParticiplesE8 } from "../src/itemBank/generate/participlesE8.js";
import { verify as verifyInfinitivesE8 } from "../src/itemBank/generate/infinitivesE8.js";
import { verify as verifyPurposeE8 } from "../src/itemBank/generate/purposeE8.js";
import { verify as verifyClausesE8 } from "../src/itemBank/generate/clausesE8.js";
import { verify as verifyWordsE8 } from "../src/itemBank/generate/wordsE8.js";
import { verify as verifyFiguresE8 } from "../src/itemBank/generate/figuresE8.js";
import { verify as verifyPunctuationE8 } from "../src/itemBank/generate/punctuationE8.js";
import { verify as verifySpellingE8 } from "../src/itemBank/generate/spellingE8.js";
import { verify as verifyIdiomsE8 } from "../src/itemBank/generate/idiomsE8.js";
import { verify as verifyWinterOak } from "../src/itemBank/generate/winterOakE8.js";
import { verify as verifyDontQuit } from "../src/itemBank/generate/dontQuitE8.js";
import { verify as verifyCornerShop } from "../src/itemBank/generate/cornerShopE8.js";
import { verify as verifyInchcape } from "../src/itemBank/generate/inchcapeE8.js";
import { verify as verifyDusk } from "../src/itemBank/generate/duskE8.js";
import { verify as verifyDrumDream } from "../src/itemBank/generate/drumDreamE8.js";
import { verify as verifySalaam } from "../src/itemBank/generate/salaamE8.js";
import { verify as verifyGiftIndia } from "../src/itemBank/generate/giftIndiaE8.js";
import { verify as verifyTiger } from "../src/itemBank/generate/tigerE8.js";
import { verify as verifyOzymandias } from "../src/itemBank/generate/ozymandiasE8.js";
import { verify as verifyGame } from "../src/itemBank/generate/gameE8.js";
import { verify as verifyMagi } from "../src/itemBank/generate/magiE8.js";
import { verify as verifyMacavity } from "../src/itemBank/generate/macavityE8.js";
import { verify as verifyCaesar } from "../src/itemBank/generate/caesarE8.js";
import { verify as verifyExpectations } from "../src/itemBank/generate/expectationsE8.js";
import { verify as verifyTree } from "../src/itemBank/generate/treeE8.js";
import { verify as verifyName } from "../src/itemBank/generate/nameE8.js";
import { verify as verifyLouse } from "../src/itemBank/generate/louseE8.js";

const N = Number(process.env.N || 20000);
let failures = 0;
const fail = (msg: string) => {
  if (failures++ < Number(process.env.MAXFAIL || 25)) console.log("FAIL", msg);
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
  "more-large-numbers": (it) => (it.id.startsWith("ln5x") ? null : verifyLargeNumbers(it)),
  "operations-large-numbers": (it) => (it.id.startsWith("op5x") ? null : verifyOperations(it)),
  // Grade 4's own generators (Grade 5's are in generate/m5, checked by the general rules).
  "factors-multiples": (it) => (it.params.g === 4 ? verifyFactorsG4(it) : null),
  "four-operations-fractions": (it) => (it.params.g === 4 ? verifyFractionsG4(it) : null),
  decimals: (it) => (it.params.g === 4 ? verifyDecimalsG4(it) : null),
};

// ---- Grade 8: the right answer recomputed from the numbers, independently ----
const num = (t: string) => Number((t.replace(/₹/g, "").replace(/−/g, "-").replace(/,/g, "").match(/^-?\d+(\.\d+)?/) ?? ["NaN"])[0]);
const fracVal = (t: string) => {
  const m = t.replace(/−/g, "-").match(/^(-?\d+)\/(\d+)$/);
  return m ? Number(m[1]) / Number(m[2]) : num(t);
};
function verifyG8(it: GeneratedItem): string | null {
  const p = it.params;
  const right = it.choices.find((c) => c.id === it.correctChoiceId)!.text;
  const cell = `${it.topicId}|${it.cpa}|${it.bloom}`;
  const want: Record<string, () => number> = {
    "g8-rational-numbers|abstract|understand": () => p.a / p.b + (p.s * p.c) / p.d,
    "g8-rational-numbers|abstract|apply": () => (-p.a / p.b) / (p.c / p.d),
    "g8-rational-numbers|pictorial|evaluate": () => (p.a - p.b) / p.d,
    "g8-rational-numbers|pictorial|apply": () => (p.a + 1) / p.d,
    "g8-exponents|abstract|apply": () => (-p.a) ** p.n,
    "g8-squares|abstract|remember": () => p.n,
    "g8-squares|abstract|apply": () => 2 ** p.i * 3 ** p.j * 5 ** p.k,
    "g8-squares|pictorial|analyze": () => 2 * p.n + 1,
    "g8-squares|pictorial|remember": () => p.n * p.n,
    "g8-cubes|abstract|remember": () => p.n ** 3,
    "g8-cubes|abstract|understand": () => p.n,
    "g8-cubes|abstract|evaluate": () => p.a * p.b,
    "g8-cubes|pictorial|apply": () => 8 * p.n ** 3,
    "g8-playing-numbers|abstract|apply": () => 9 * (p.a - p.b),
    "g8-playing-numbers|abstract|analyze": () => p.t,
    "g8-playing-numbers|pictorial|analyze": () => (p.a + p.b + p.c) % 9,
    "g8-percent|abstract|understand": () => (p.p * p.N) / 100,
    "g8-percent|abstract|apply": () => p.whole,
    "g8-percent|abstract|analyze": () => p.p,
    "g8-percent|abstract|evaluate": () => ((1 + p.p / 100) * (1 + p.q / 100) - 1) * 100,
    "g8-percent|pictorial|understand": () => 2 * p.s,
    "g8-percent|pictorial|apply": () => 5 * p.s,
    "g8-profit-loss|abstract|understand": () => (p.C * (100 - p.L)) / 100,
    "g8-profit-loss|abstract|apply": () => (p.M * (100 - p.d) * (100 + p.t)) / 10000,
    "g8-profit-loss|abstract|analyze": () => p.C,
    "g8-profit-loss|abstract|evaluate": () => p.M,
    "g8-profit-loss|pictorial|understand": () => p.M - (p.M * p.d) / 100,
    "g8-profit-loss|pictorial|apply": () => p.C * (1 + p.p / 100),
    "g8-interest|abstract|remember": () => (p.P * p.R * p.T) / 100,
    "g8-interest|abstract|apply": () => p.P * ((1 + p.R / 100) ** 2 - 1),
    "g8-interest|abstract|analyze": () => p.P * (1 + p.R / 100) ** 3,
    "g8-interest|abstract|evaluate": () => p.P * (1 + p.R / 200) ** 3,
    "g8-interest|pictorial|understand": () => (3 * p.P * p.R) / 100,
    "g8-variation|abstract|understand": () => (p.W * p.D) / p.W2,
    "g8-variation|abstract|evaluate": () => (p.a * p.b) / p.c,
    "g8-variation|pictorial|understand": () => (p.W * p.D) / p.W2,
    "g8-variation|pictorial|remember": () => p.m * p.u,
    "g8-variation|abstract|remember": () => p.m * p.u,
    "g8-expressions|abstract|remember": () => p.a * p.k + p.b,
    "g8-expressions|concrete|apply": () => p.a * p.k + p.r,
    "g8-identities|abstract|apply": () => 10000 - p.c * p.c,
    "g8-identities|abstract|evaluate": () => p.s * p.s - 2 * p.p,
    "g8-identities|pictorial|evaluate": () => (p.big + p.c) ** 2,
    "g8-linear-equations|pictorial|remember": () => p.x,
    "g8-linear-equations|pictorial|analyze": () => p.k,
    "g8-linear-equations|pictorial|evaluate": () => p.x,
    "g8-linear-equations|abstract|evaluate": () => p.small,
    "g8-inequations|abstract|evaluate": () => p.k,
    "g8-shapes|abstract|remember": () => (p.n - 2) * 180,
    "g8-shapes|abstract|apply": () => 180 - 360 / p.n,
    "g8-shapes|abstract|analyze": () => p.n,
    "g8-shapes|abstract|evaluate": () => (p.n * (p.n - 3)) / 2,
    "g8-shapes|pictorial|apply": () => 180 - 360 / p.n,
    "g8-shapes|pictorial|evaluate": () => (p.n - 2) * 180,
    "g8-quadrilaterals|pictorial|remember": () => 180 - p.a,
    "g8-quadrilaterals|abstract|remember": () => p.a,
    "g8-quadrilaterals|pictorial|understand": () => 2 * p.k,
    "g8-solids|abstract|understand": () => p.F + p.V - 2,
    "g8-solids|abstract|apply": () => p.n + 2,
    "g8-solids|abstract|analyze": () => 2 * p.n,
    "g8-solids|pictorial|analyze": () => 3 * p.m,
    "g8-symmetry|pictorial|remember": () => p.n,
    "g8-symmetry|pictorial|apply": () => p.n,
    "g8-symmetry|pictorial|evaluate": () => 360 / p.n,
    "g8-symmetry|abstract|apply": () => 360 / p.k,
    "g8-circles|abstract|understand": () => p.d / 2,
    "g8-circles|abstract|remember": () => p.r,
    "g8-circles|pictorial|apply": () => p.r,
    "g8-area|abstract|remember": () => ((p.a + p.b) / 2) * p.h,
    "g8-area|pictorial|remember": () => ((p.a + p.b) / 2) * p.h,
    "g8-area|pictorial|understand": () => p.h,
    "g8-area|pictorial|apply": () => p.w * p.h + (p.w * p.t) / 2,
    "g8-area|abstract|apply": () => (p.d * (p.h1 + p.h2)) / 2,
    "g8-area|abstract|analyze": () => p.b,
    "g8-area|abstract|understand": () => ((22 / 7) * (p.r / 2) ** 2) / 2,
    "g8-area|abstract|evaluate": () => 14 * p.k,
    "g8-volume|pictorial|remember": () => p.l * p.b * p.h,
    "g8-volume|pictorial|understand": () => 6 * p.a * p.a,
    "g8-volume|abstract|remember": () => p.a ** 3,
    "g8-volume|abstract|understand": () => 2 * (p.l * p.b + p.b * p.h + p.h * p.l),
    "g8-volume|abstract|apply": () => (22 / 7) * (p.d / 2) ** 2 * p.h,
    "g8-volume|abstract|analyze": () => p.h,
    "g8-volume|pictorial|evaluate": () => (p.l * p.b * p.h) / 1000,
    "g8-data|abstract|remember": () => p.w,
    "g8-data|abstract|apply": () => (p.p / p.T) * 360,
    "g8-data|abstract|analyze": () => (p.T * p.a) / 360,
    "g8-probability|abstract|understand": () => p.r / (p.r + p.b),
    "g8-probability|abstract|apply": () => (p.d - p.a) / p.d,
    "g8-probability|abstract|analyze": () => (6 - Math.abs(7 - p.s)) / 36,
    "g8-probability|pictorial|apply": () => p.h / p.N,
    "g8-sets|abstract|analyze": () => p.nA + p.nB - p.both,
    "g8-sets|pictorial|evaluate": () => p.onlyA + p.both + p.onlyB,
    "g8-volume|abstract|evaluate": () => ((p.l / 10) * (p.b / 10) * (p.h / 10)) * 1000,
  };
  if (want[cell]) {
    const w = want[cell](), got = fracVal(right);
    if (Math.abs(w - got) > 0.051) return `right answer "${right}" is ${got}, should be ${w}`;
  }
  if (cell === "g8-playing-numbers|pictorial|evaluate" && (p.a + num(right) + p.c) % 9 !== 0) return `${p.a}${right}${p.c} isn't divisible by 9`;
  if (cell === "g8-cubes|abstract|analyze") {
    const n = p.s ** 3 * (p.t ? p.p * p.p : p.p);
    const k = Math.round(Math.cbrt(n * num(right)));
    if (k ** 3 !== n * num(right)) return `${n} × ${right} isn't a cube`;
  }
  if (cell === "g8-squares|abstract|analyze") {
    const n = p.s * p.s * p.p;
    const k = Math.round(Math.sqrt(n * num(right)));
    if (k * k !== n * num(right)) return `${n} × ${right} isn't a square`;
  }
  // Algebra: the right answer must equal the question's expression at several values of x.
  const evalAt = (s: string, x: number, y = 2) => {
    const js = s.replace(/−/g, "-").replace(/x³/g, "(x*x*x)").replace(/x²/g, "(x*x)").replace(/y²/g, "(y*y)")
      .replace(/(\d)\s*([xy(])/g, "$1*$2").replace(/\)\s*\(/g, ")*(").replace(/\)\s*([xy\d])/g, ")*$1").replace(/([xy])\s*\(/g, "$1*(").replace(/xy/g, "x*y");
    return Function("x", "y", `return ${js};`)(x, y) as number;
  };
  const ALG: Record<string, () => string> = {
    "g8-expressions|abstract|understand": () => `(${p.a}x + ${p.b}) - (${p.c}x - ${p.d})`,
    "g8-expressions|abstract|apply": () => `${p.a}x(${p.b}x + ${p.s * p.c})`,
    "g8-expressions|abstract|analyze": () => `(${p.a}x + ${p.b})(${p.c}x + ${p.d})`,
    "g8-expressions|pictorial|analyze": () => `(x + ${p.a})(x + ${p.b})`,
    "g8-identities|abstract|analyze": () => `(${p.a}x + ${p.b}y)(${p.a}x + ${p.b}y)`,
  };
  if (ALG[cell]) {
    const q = ALG[cell]();
    for (const xv of [2, 3, -1]) if (Math.abs(evalAt(q, xv) - evalAt(right, xv)) > 1e-9) return `right answer "${right}" doesn't equal ${q} at x = ${xv}`;
  }
  if (cell === "g8-factorisation|abstract|apply" || cell === "g8-factorisation|abstract|analyze") {
    const q = cell.endsWith("apply") ? `x² + ${p.m + p.nn}x + ${p.m * p.nn}` : `x² - ${p.m - p.nn}x - ${p.m * p.nn}`;
    for (const xv of [2, 3, -1]) if (Math.abs(evalAt(q, xv) - evalAt(right, xv)) > 1e-9) return `"${right}" doesn't multiply out to ${q}`;
  }
  // No wrong option may have the same value as the right one (for plain numbers and fractions).
  if (/^−?\d+(\/\d+)?$/.test(right))
    for (const c of it.choices) if (c.id !== it.correctChoiceId && /^−?\d+(\/\d+)?$/.test(c.text) && Math.abs(fracVal(c.text) - fracVal(right)) < 1e-9) return `wrong option "${c.text}" equals the right one`;
  return null;
}
for (const t of GRADE8_TOPICS) VERIFY[t] = verifyG8;
// ---- Grade 8 English: the right answer is the bank's, independently rebuilt ----
const ENGLISH_VERIFY: Record<string, (it: GeneratedItem) => string | null> = {
  "e8-voice": verifyVoiceE8,
  "e8-speech": verifySpeechE8,
  "e8-sentences": verifySentencesE8,
  "e8-conditionals": verifyConditionalsE8,
  "e8-participles": verifyParticiplesE8,
  "e8-infinitives": verifyInfinitivesE8,
  "e8-purpose": verifyPurposeE8,
  "e8-clauses": verifyClausesE8,
  "e8-words": verifyWordsE8,
  "e8-figures": verifyFiguresE8,
  "e8-punctuation": verifyPunctuationE8,
  "e8-spelling": verifySpellingE8,
  "e8-idioms": verifyIdiomsE8,
  "e8-lit-winter-oak": () => verifyWinterOak(),
  "e8-lit-dont-quit": () => verifyDontQuit(),
  "e8-lit-corner-shop": () => verifyCornerShop(),
  "e8-lit-inchcape": () => verifyInchcape(),
  "e8-lit-dusk": () => verifyDusk(),
  "e8-lit-drum-dream": () => verifyDrumDream(),
  "e8-lit-salaam": () => verifySalaam(),
  "e8-lit-gift-india": () => verifyGiftIndia(),
  "e8-lit-tiger": () => verifyTiger(),
  "e8-lit-ozymandias": () => verifyOzymandias(),
  "e8-lit-game": () => verifyGame(),
  "e8-lit-magi": () => verifyMagi(),
  "e8-lit-macavity": () => verifyMacavity(),
  "e8-lit-caesar": () => verifyCaesar(),
  "e8-lit-expectations": () => verifyExpectations(),
  "e8-lit-tree": () => verifyTree(),
  "e8-lit-name": () => verifyName(),
  "e8-lit-louse": () => verifyLouse(),
};
for (const t of ENGLISH8_TOPICS) VERIFY[t] = ENGLISH_VERIFY[t] ?? (() => null);
for (const b of [...LA7_BANKS, ...W7_BANKS, ...W4_BANKS, ...L4_BANKS, ...W3_BANKS, ...L6_BANKS, ...W6_BANKS]) VERIFY[b.topic] = () => verifySkill(b);

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
  } else if (act.kind === "group") {
    const n = act.items;
    const mark = (baskets: number[]) => checkActivity(act, { baskets });
    if (act.mode === "equal") {
      const k = act.baskets!;
      const per = Math.floor(n / k);
      if (!mark(Array(k).fill(per)).correct) fail(`${where}: a fair share was marked wrong`);
      if (per >= 1) {
        const uneven = Array(k).fill(per);
        uneven[0] += 1;
        uneven[1] -= 1;
        if (mark(uneven).misconception !== "fm-unequal-groups") fail(`${where}: unequal baskets not caught`);
      }
      if (per >= 2 && mark(Array(k).fill(per - 1)).misconception !== "fm-stops-early") fail(`${where}: stopping early not caught`);
    } else if (act.mode === "size") {
      const size = act.size!;
      const m = Math.floor(n / size);
      if (m > (act.maxBaskets ?? m)) fail(`${where}: not enough baskets to pack them`);
      if (!mark([...Array(m).fill(size), 0, 0]).correct) fail(`${where}: right packing marked wrong`);
      const off = Array(m).fill(size);
      off[0] += 1;
      off[m - 1] -= 1;
      if (mark(off).misconception !== "fm-unequal-groups") fail(`${where}: a wrong-size basket not caught`);
    } else {
      const d = [...Array(n).keys()].map((i) => i + 1).find((k) => n % k === 0 && k > 2 && n / k > 1 && !(act.avoid ?? []).includes(k));
      if (d) {
        if (d > (act.maxBaskets ?? 12)) fail(`${where}: answer needs more baskets than shown`);
        if (!mark(Array(d).fill(n / d)).correct) fail(`${where}: a right sharing (${d} baskets) was marked wrong`);
      } else if (act.avoid) fail(`${where}: no possible answer for ${n}`);
      if (mark([n]).misconception !== "fm-trivial-grouping") fail(`${where}: one basket of everything not caught`);
    }
  } else if (act.kind === "pizza") {
    const slices = act.slices ?? act.target.d;
    const total = (act.target.n * slices) / act.target.d;
    if (!Number.isInteger(total) || total > act.pies * slices) fail(`${where}: target can't be coloured on these pizzas`);
    const fill = (t: number) => Array.from({ length: act.pies }, (_, i) => Math.max(0, Math.min(slices, t - i * slices)));
    if (!checkActivity(act, { slices, coloured: fill(total) }).correct) fail(`${where}: the right colouring was marked wrong`);
    if (act.slices === null) {
      const twice = Array.from({ length: act.pies }, (_, i) => Math.max(0, Math.min(slices * 2, total * 2 - i * slices * 2)));
      if (!checkActivity(act, { slices: slices * 2, coloured: twice }).correct) fail(`${where}: an equivalent colouring (twice the slices) was marked wrong`);
    }
    for (const w of act.wrong ?? []) {
      if (w.n * act.target.d === act.target.n * w.d) fail(`${where}: a 'mistake' ${w.n}/${w.d} equals the right answer`);
      const t = (w.n * slices) / w.d;
      if (!Number.isInteger(t) || t > act.pies * slices) continue;
      const r = checkActivity(act, { slices, coloured: fill(t) });
      if (r.correct || r.misconception !== w.mistake) fail(`${where}: ${w.n}/${w.d} not caught as ${w.mistake}`);
    }
  } else if (act.kind === "tiles") {
    const size = act.rows * act.cols;
    const given = new Set(act.given ?? []);
    const free = [...Array(size).keys()].filter((i) => !given.has(i));
    if (act.mode === "count") {
      if (act.target > free.length) fail(`${where}: can't colour ${act.target} squares`);
      if (!checkActivity(act, { cells: free.slice(0, act.target) }).correct) fail(`${where}: the right colouring was marked wrong`);
      for (const w of act.wrong ?? []) {
        if (w.value === act.target) fail(`${where}: a 'mistake' equals the right answer`);
        if (w.value <= free.length && checkActivity(act, { cells: free.slice(0, w.value) }).misconception !== w.mistake) fail(`${where}: ${w.value} squares not caught as ${w.mistake}`);
      }
    } else {
      // find a rectangle that fits
      let ok = false;
      for (let h = 1; h <= act.rows && !ok; h++) {
        const w = act.target / h;
        if (!Number.isInteger(w) || w > act.cols) continue;
        if (act.perimeter !== undefined && 2 * (h + w) !== act.perimeter) continue;
        const cells = [...Array(h * w).keys()].map((i) => Math.floor(i / w) * act.cols + (i % w));
        if (cells.some((c) => given.has(c))) continue;
        ok = checkActivity(act, { cells }).correct;
        if (!ok) fail(`${where}: a right ${h} by ${w} rectangle was marked wrong`);
        ok = true;
      }
      if (!ok) fail(`${where}: no rectangle fits the grid`);
    }
  } else if (act.kind === "measure") {
    // greedy from the biggest piece always reaches the target if the smallest piece divides it
    let left = act.target;
    const counts = act.pieces.map((p) => {
      const c = Math.floor(left / p.value);
      left -= c * p.value;
      return c;
    });
    if (left !== 0) fail(`${where}: the pieces can't make ${act.target}`);
    else if (!checkActivity(act, { counts }).correct) fail(`${where}: the right amount was marked wrong`);
    for (const w of act.wrong ?? []) if (w.value === act.target) fail(`${where}: a 'mistake' equals the right answer`);
  } else if (act.kind === "pick") {
    if (!act.correct.length) fail(`${where}: nothing to pick`);
    if (!checkActivity(act, { picked: act.correct }).correct) fail(`${where}: the right cards were marked wrong`);
    if (act.correct.length === act.items.length) fail(`${where}: every card is right`);
    const extra = act.items.find((i) => !act.correct.includes(i.id))!;
    if (checkActivity(act, { picked: [...act.correct, extra.id] }).correct) fail(`${where}: an extra card was marked right`);
  } else if (act.kind === "shade" && act.mode === "free") {
    const t = act.targetCells ?? [];
    if (!t.length || t.some((c) => c < 0 || c >= act.rows * act.cols)) fail(`${where}: target squares off the grid`);
    if ((act.given ?? []).some((g) => !t.includes(g))) fail(`${where}: a given square isn't in the answer`);
    if (!checkActivity(act, { shaded: t.length, cells: t }).correct) fail(`${where}: the right pattern was marked wrong`);
    if (checkActivity(act, { shaded: 0, cells: act.given ?? [] }).correct) fail(`${where}: doing nothing is marked right`);
    for (const w of act.wrongSets ?? []) if (checkActivity(act, { shaded: w.cells.length, cells: w.cells }).misconception !== w.mistake) fail(`${where}: a wrong pattern not caught as ${w.mistake}`);
  } else if (act.kind === "shade") {
    if (!Number.isInteger(act.target) || act.target < 0 || act.target > act.rows * act.cols) fail(`${where}: can't shade ${act.target} of ${act.rows * act.cols}`);
    if (!checkActivity(act, { shaded: act.target }).correct) fail(`${where}: the right shading was marked wrong`);
    for (const w of act.wrong ?? []) if (checkActivity(act, { shaded: w.value }).misconception !== w.mistake) fail(`${where}: shading ${w.value} not caught as ${w.mistake}`);
  } else if (act.kind === "words") {
    if (!act.target.length) fail(`${where}: nothing to tap`);
    if (act.target.length === act.tokens.length) fail(`${where}: every word is the answer`);
    if (!checkActivity(act, { picked: act.target }).correct) fail(`${where}: the right words were marked wrong`);
    for (const x of act.alsoRight ?? []) if (!checkActivity(act, { picked: x }).correct) fail(`${where}: an also-right marking was marked wrong`);
    for (const w of act.wrongSets ?? []) if ((act.alsoRight ?? []).some((x) => x.join() === w.cells.join())) fail(`${where}: a mistake pattern is also right`);
    if (checkActivity(act, { picked: [] }).correct) fail(`${where}: tapping nothing is marked right`);
    for (const w of act.wrongSets ?? []) if (checkActivity(act, { picked: w.cells }).misconception !== w.mistake) fail(`${where}: a wrong tap not caught as ${w.mistake}`);
  } else if (act.kind === "order") {
    // the right sentence must be buildable from the tiles, each tile once (search, with backtracking)
    const want = act.answers[0];
    const build = (rest: string, left: number[]): number[] | null => {
      if (!rest.length) return [];
      for (const i of left) {
        const t = act.tiles[i];
        if (!rest.startsWith(t) || !(rest.length === t.length || rest[t.length] === " " || /^[.,?!’']/.test(rest.slice(t.length)))) continue;
        const more = build(rest.slice(t.length).trimStart(), left.filter((x) => x !== i));
        if (more) return [i, ...more];
      }
      return null;
    };
    const used = build(want, act.tiles.map((_, i) => i));
    if (!used) fail(`${where}: "${want}" can't be built from the tiles ${JSON.stringify(act.tiles)}`);
    else if (!checkActivity(act, { order: used }).correct) fail(`${where}: the right sentence was marked wrong`);
    if (tidySentence(act.tiles.join(" ")) === tidySentence(want)) fail(`${where}: tiles start in the right order`);
    if (act.glue && used && !checkActivity(act, { order: used }).correct) fail(`${where}: the glued word was marked wrong`);
    for (const w of act.wrong ?? []) if (act.answers.some((a) => tidySentence(a) === tidySentence(w.text))) fail(`${where}: a 'mistake' equals the right answer`);
  } else fail(`${where}: unknown activity`);
}

const RUNS: [string, number][] = [...GENERATED_TOPICS.map((t) => [t, 5] as [string, number]), ...GRADE4_TOPICS.map((t) => [t, 4] as [string, number]), ...GRADE8_TOPICS.map((t) => [t, 8] as [string, number]), ...ENGLISH8_TOPICS.map((t) => [t, 8] as [string, number]), ...[...languageTopics("Language Arts"), ...languageTopics("Writing"), ...(mathsTopics(7) ?? [])].map((t) => [t, 7] as [string, number]), ...[...languageTopics("Writing", 4), ...languageTopics("Language Arts", 4)].map((t) => [t, 4] as [string, number]), ...[...(mathsTopics(3) ?? []), ...languageTopics("Writing", 3)].map((t) => [t, 3] as [string, number]), ...[...languageTopics("Language Arts", 6), ...languageTopics("Writing", 6)].map((t) => [t, 6] as [string, number])];
for (let k = RUNS.length - 1; k >= 0; k--) if (process.env.ONLY && !process.env.ONLY.split(",").some((o) => RUNS[k][0].startsWith(o))) RUNS.splice(k, 1);
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
            // included). Both topics use the lakhs column (the book goes to 9,99,999).
            const nums: number[] = [];
            const walk = (v: unknown): void => {
              if (typeof v === "number") nums.push(v);
              else if (typeof v === "string") (v.match(/\d+(?:,\d+)*/g) ?? []).forEach((x) => nums.push(Number(x.replace(/,/g, ""))));
              else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => k !== "id" && walk(x));
            };
            walk([it.prompt, it.choices, it.representation, it.activity]);
            if (nums.some((x) => x >= 1000000)) fail(`${topic} G4 ${cpa}/${bloom}: a number of ten lakh or more`);
            const maxCol = 100000; // both Grade 4 topics use the lakhs chart (book: up to 9,99,999)
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
        // What the child sees: the prompt and the picture's labels. A figure's kind fields only choose how it's drawn;
        // positions ("value": where a dot sits) and step sizes aren't printed on screen.
        const { figure: _f, part: _p, solid: _s, quad: _q, ...visible } = (it.representation ?? {}) as Record<string, unknown>;
        const shown = [it.prompt, JSON.stringify(visible, (k, v) => (k === "value" || k === "step" ? undefined : v))].join(" ");
        const appears = (t: string) => t.length > 2 && new RegExp(`(?<!\\d|\\d[,.])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\d|[,.]\\d)`).test(shown);
        const showsAnother = it.choices.some((c) => c.id !== it.correctChoiceId && appears(c.text));
        // English gap-fills give the verb, as the book does: "(verb: stay)". Answering with it unchanged is the skill.
        const hinted = /\(verb: ([^)]+)\)/.exec(shown)?.[1];
        if (appears(right.text) && !showsAnother && hinted !== right.text) fail(`${where}: shows its own answer "${right.text}"`);
        const problem = VERIFY[topic]?.(it);
        if (problem) fail(`${where}: ${problem}`);
      }
      console.log(`G${grade} ${topic.padEnd(20)} ${cpa.padEnd(9)} ${bloom.padEnd(10)} ${String(seen.size).padStart(6)} different`);
    }
}
console.log(failures ? `\n${failures} FAILURES` : `\nAll ${RUNS.length * 15 * N} generated questions passed (Grades 4, 5 and 8, Maths and English).`);
process.exit(failures ? 1 : 0);
