import { BloomLevel, CPAStage, Item } from "../../types.js";
import { GeneratedItem, Rng, Template, setGrade } from "./core.js";
import { FRACTIONS_DIVISION_TEMPLATES, MISCONCEPTIONS as FD_MISCONCEPTIONS } from "./fractionsDivision.js";
import { MORE_ON_LARGE_NUMBERS_TEMPLATES, MISCONCEPTIONS as LN_MISCONCEPTIONS } from "./moreOnLargeNumbers.js";
import { OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES, MISCONCEPTIONS as OP_MISCONCEPTIONS } from "./operationsOnLargeNumbers.js";
import { FACTORS_MULTIPLES_G4_TEMPLATES, MISCONCEPTIONS as FM4_MISCONCEPTIONS } from "./factorsMultiplesG4.js";
import { FRACTIONS_G4_TEMPLATES, MISCONCEPTIONS as FR4_MISCONCEPTIONS } from "./fractionsG4.js";
import { DECIMALS_G4_TEMPLATES, MISCONCEPTIONS as DEC4_MISCONCEPTIONS } from "./decimalsG4.js";
import { RATIONAL_G8_TEMPLATES, MISCONCEPTIONS as RAT8_MISCONCEPTIONS } from "./rationalG8.js";
import { EXPONENTS_G8_TEMPLATES, MISCONCEPTIONS as EXP8_MISCONCEPTIONS } from "./exponentsG8.js";
import { SQUARES_G8_TEMPLATES, MISCONCEPTIONS as SQ8_MISCONCEPTIONS } from "./squaresG8.js";
import { CUBES_G8_TEMPLATES, MISCONCEPTIONS as CUBE8_MISCONCEPTIONS } from "./cubesG8.js";
import { PLAYING_G8_TEMPLATES, MISCONCEPTIONS as PLAY8_MISCONCEPTIONS } from "./playingNumbersG8.js";
import { SETS_G8_TEMPLATES, MISCONCEPTIONS as SET8_MISCONCEPTIONS } from "./setsG8.js";
import { PERCENT_G8_TEMPLATES, MISCONCEPTIONS as PCT8_MISCONCEPTIONS } from "./percentG8.js";
import { PROFIT_LOSS_G8_TEMPLATES, MISCONCEPTIONS as PL8_MISCONCEPTIONS } from "./profitLossG8.js";
import { INTEREST_G8_TEMPLATES, MISCONCEPTIONS as INT8_MISCONCEPTIONS } from "./interestG8.js";
import { VARIATION_G8_TEMPLATES, MISCONCEPTIONS as VAR8_MISCONCEPTIONS } from "./variationG8.js";
import { EXPRESSIONS_G8_TEMPLATES, MISCONCEPTIONS as EX8_MISCONCEPTIONS } from "./expressionsG8.js";
import { IDENTITIES_G8_TEMPLATES, MISCONCEPTIONS as ID8_MISCONCEPTIONS } from "./identitiesG8.js";
import { FACTORISATION_G8_TEMPLATES, MISCONCEPTIONS as FAC8_MISCONCEPTIONS } from "./factorisationG8.js";
import { EQUATIONS_G8_TEMPLATES, MISCONCEPTIONS as EQ8_MISCONCEPTIONS } from "./equationsG8.js";
import { INEQUATIONS_G8_TEMPLATES, MISCONCEPTIONS as INEQ8_MISCONCEPTIONS } from "./inequationsG8.js";
import { SHAPES_G8_TEMPLATES, MISCONCEPTIONS as SHP8_MISCONCEPTIONS } from "./shapesG8.js";
import { QUADRILATERALS_G8_TEMPLATES, MISCONCEPTIONS as QD8_MISCONCEPTIONS } from "./quadrilateralsG8.js";
import { CONSTRUCTIONS_G8_TEMPLATES, MISCONCEPTIONS as CON8_MISCONCEPTIONS } from "./constructionsG8.js";
import { SOLIDS_G8_TEMPLATES, MISCONCEPTIONS as D38_MISCONCEPTIONS } from "./solidsG8.js";
import { SYMMETRY_G8_TEMPLATES, MISCONCEPTIONS as SYM8_MISCONCEPTIONS } from "./symmetryG8.js";
import { CIRCLES_G8_TEMPLATES, MISCONCEPTIONS as CIR8_MISCONCEPTIONS } from "./circlesG8.js";
import { AREA_G8_TEMPLATES, MISCONCEPTIONS as AR8_MISCONCEPTIONS } from "./areaG8.js";
import { VOLUME_G8_TEMPLATES, MISCONCEPTIONS as VOL8_MISCONCEPTIONS } from "./volumeG8.js";
import { DATA_G8_TEMPLATES, MISCONCEPTIONS as DH8_MISCONCEPTIONS } from "./dataG8.js";
import { PROBABILITY_G8_TEMPLATES, MISCONCEPTIONS as PR8_MISCONCEPTIONS } from "./probabilityG8.js";
import { VOICE_E8_TEMPLATES, MISCONCEPTIONS as VOI_E8_MISCONCEPTIONS } from "./voiceE8.js";
import { SPEECH_E8_TEMPLATES, MISCONCEPTIONS as SP_E8_MISCONCEPTIONS } from "./speechE8.js";
import { SENTENCES_E8_TEMPLATES, MISCONCEPTIONS as SEN_E8_MISCONCEPTIONS } from "./sentencesE8.js";
import { CONDITIONALS_E8_TEMPLATES, MISCONCEPTIONS as CND_E8_MISCONCEPTIONS } from "./conditionalsE8.js";
import { PARTICIPLES_E8_TEMPLATES, MISCONCEPTIONS as PAR_E8_MISCONCEPTIONS } from "./participlesE8.js";
import { INFINITIVES_E8_TEMPLATES, MISCONCEPTIONS as INF_E8_MISCONCEPTIONS } from "./infinitivesE8.js";
import { PURPOSE_E8_TEMPLATES, MISCONCEPTIONS as PUR_E8_MISCONCEPTIONS } from "./purposeE8.js";
import { CLAUSES_E8_TEMPLATES, MISCONCEPTIONS as CLA_E8_MISCONCEPTIONS } from "./clausesE8.js";
import { WORDS_E8_TEMPLATES, MISCONCEPTIONS as WRD_E8_MISCONCEPTIONS } from "./wordsE8.js";
import { FIGURES_E8_TEMPLATES, MISCONCEPTIONS as FIG_E8_MISCONCEPTIONS } from "./figuresE8.js";
import { PUNCTUATION_E8_TEMPLATES, MISCONCEPTIONS as PUN_E8_MISCONCEPTIONS } from "./punctuationE8.js";
import { SPELLING_E8_TEMPLATES, MISCONCEPTIONS as SPL_E8_MISCONCEPTIONS } from "./spellingE8.js";
import { IDIOMS_E8_TEMPLATES, MISCONCEPTIONS as IDM_E8_MISCONCEPTIONS } from "./idiomsE8.js";
import { LIT_MISCONCEPTIONS } from "./litE8.js";
import { WINTER_OAK_TEMPLATES } from "./winterOakE8.js";
import { DONT_QUIT_TEMPLATES } from "./dontQuitE8.js";
import { CORNER_SHOP_TEMPLATES } from "./cornerShopE8.js";
import { INCHCAPE_TEMPLATES } from "./inchcapeE8.js";
import { DUSK_TEMPLATES } from "./duskE8.js";

export type { GeneratedItem } from "./core.js";

/** Topics whose questions are generated, keyed "cpa|bloom". Others still use the hand-written bank. */
const TEMPLATES: Record<string, Record<string, Template>> = {
  "fractions-division": FRACTIONS_DIVISION_TEMPLATES,
  "more-large-numbers": MORE_ON_LARGE_NUMBERS_TEMPLATES,
  "operations-large-numbers": OPERATIONS_ON_LARGE_NUMBERS_TEMPLATES,
};

/**
 * Grade 4 only: topics whose Grade 4 questions are generated from their own
 * templates (the book's Grade 4 chapter), while Grade 5 keeps its own bank.
 */
const GRADE4_TEMPLATES: Record<string, Record<string, Template>> = {
  "factors-multiples": FACTORS_MULTIPLES_G4_TEMPLATES,
  "four-operations-fractions": FRACTIONS_G4_TEMPLATES,
  decimals: DECIMALS_G4_TEMPLATES,
};

/** Grade 8 (its own book and topics): every topic's questions are generated. */
const GRADE8_TEMPLATES: Record<string, Record<string, Template>> = {
  "g8-rational-numbers": RATIONAL_G8_TEMPLATES,
  "g8-exponents": EXPONENTS_G8_TEMPLATES,
  "g8-squares": SQUARES_G8_TEMPLATES,
  "g8-cubes": CUBES_G8_TEMPLATES,
  "g8-playing-numbers": PLAYING_G8_TEMPLATES,
  "g8-sets": SETS_G8_TEMPLATES,
  "g8-percent": PERCENT_G8_TEMPLATES,
  "g8-profit-loss": PROFIT_LOSS_G8_TEMPLATES,
  "g8-interest": INTEREST_G8_TEMPLATES,
  "g8-variation": VARIATION_G8_TEMPLATES,
  "g8-expressions": EXPRESSIONS_G8_TEMPLATES,
  "g8-identities": IDENTITIES_G8_TEMPLATES,
  "g8-factorisation": FACTORISATION_G8_TEMPLATES,
  "g8-linear-equations": EQUATIONS_G8_TEMPLATES,
  "g8-inequations": INEQUATIONS_G8_TEMPLATES,
  "g8-shapes": SHAPES_G8_TEMPLATES,
  "g8-quadrilaterals": QUADRILATERALS_G8_TEMPLATES,
  "g8-constructions": CONSTRUCTIONS_G8_TEMPLATES,
  "g8-solids": SOLIDS_G8_TEMPLATES,
  "g8-symmetry": SYMMETRY_G8_TEMPLATES,
  "g8-circles": CIRCLES_G8_TEMPLATES,
  "g8-area": AREA_G8_TEMPLATES,
  "g8-volume": VOLUME_G8_TEMPLATES,
  "g8-data": DATA_G8_TEMPLATES,
  "g8-probability": PROBABILITY_G8_TEMPLATES,
};

/** Grade 8 English (English Rose Reader 8): topic ids start "e8-". */
const ENGLISH8_TEMPLATES: Record<string, Record<string, Template>> = {
  "e8-voice": VOICE_E8_TEMPLATES,
  "e8-speech": SPEECH_E8_TEMPLATES,
  "e8-sentences": SENTENCES_E8_TEMPLATES,
  "e8-conditionals": CONDITIONALS_E8_TEMPLATES,
  "e8-participles": PARTICIPLES_E8_TEMPLATES,
  "e8-infinitives": INFINITIVES_E8_TEMPLATES,
  "e8-purpose": PURPOSE_E8_TEMPLATES,
  "e8-clauses": CLAUSES_E8_TEMPLATES,
  "e8-words": WORDS_E8_TEMPLATES,
  "e8-figures": FIGURES_E8_TEMPLATES,
  "e8-punctuation": PUNCTUATION_E8_TEMPLATES,
  "e8-spelling": SPELLING_E8_TEMPLATES,
  "e8-idioms": IDIOMS_E8_TEMPLATES,
  "e8-lit-winter-oak": WINTER_OAK_TEMPLATES,
  "e8-lit-dont-quit": DONT_QUIT_TEMPLATES,
  "e8-lit-corner-shop": CORNER_SHOP_TEMPLATES,
  "e8-lit-inchcape": INCHCAPE_TEMPLATES,
  "e8-lit-dusk": DUSK_TEMPLATES,
};

/** Topics with generated questions (Grade 5; Grade 4 also uses GRADE4_TEMPLATES). */
export const GENERATED_TOPICS = Object.keys(TEMPLATES);

function templatesFor(topicId: string, grade: number): Record<string, Template> | undefined {
  if (topicId.startsWith("e8-")) return ENGLISH8_TEMPLATES[topicId];
  if (grade === 8) return GRADE8_TEMPLATES[topicId];
  return (grade === 4 ? GRADE4_TEMPLATES[topicId] : undefined) ?? TEMPLATES[topicId];
}

export const MISCONCEPTIONS: Record<string, { label: string; detail: string; childTip: string }> = {
  ...FD_MISCONCEPTIONS,
  ...LN_MISCONCEPTIONS,
  ...OP_MISCONCEPTIONS,
  ...FM4_MISCONCEPTIONS,
  ...FR4_MISCONCEPTIONS,
  ...DEC4_MISCONCEPTIONS,
  ...RAT8_MISCONCEPTIONS,
  ...EXP8_MISCONCEPTIONS,
  ...SQ8_MISCONCEPTIONS,
  ...CUBE8_MISCONCEPTIONS,
  ...PLAY8_MISCONCEPTIONS,
  ...SET8_MISCONCEPTIONS,
  ...PCT8_MISCONCEPTIONS,
  ...PL8_MISCONCEPTIONS,
  ...INT8_MISCONCEPTIONS,
  ...VAR8_MISCONCEPTIONS,
  ...EX8_MISCONCEPTIONS,
  ...ID8_MISCONCEPTIONS,
  ...FAC8_MISCONCEPTIONS,
  ...EQ8_MISCONCEPTIONS,
  ...INEQ8_MISCONCEPTIONS,
  ...SHP8_MISCONCEPTIONS,
  ...QD8_MISCONCEPTIONS,
  ...CON8_MISCONCEPTIONS,
  ...D38_MISCONCEPTIONS,
  ...SYM8_MISCONCEPTIONS,
  ...CIR8_MISCONCEPTIONS,
  ...AR8_MISCONCEPTIONS,
  ...VOL8_MISCONCEPTIONS,
  ...DH8_MISCONCEPTIONS,
  ...PR8_MISCONCEPTIONS,
  ...VOI_E8_MISCONCEPTIONS,
  ...SP_E8_MISCONCEPTIONS,
  ...SEN_E8_MISCONCEPTIONS,
  ...CND_E8_MISCONCEPTIONS,
  ...PAR_E8_MISCONCEPTIONS,
  ...INF_E8_MISCONCEPTIONS,
  ...PUR_E8_MISCONCEPTIONS,
  ...CLA_E8_MISCONCEPTIONS,
  ...WRD_E8_MISCONCEPTIONS,
  ...FIG_E8_MISCONCEPTIONS,
  ...PUN_E8_MISCONCEPTIONS,
  ...SPL_E8_MISCONCEPTIONS,
  ...IDM_E8_MISCONCEPTIONS,
  ...LIT_MISCONCEPTIONS,
};

export function hasTemplate(topicId: string, cpa: CPAStage, bloom: BloomLevel, grade = 5): boolean {
  return !!templatesFor(topicId, grade)?.[`${cpa}|${bloom}`];
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
  opts: { avoid?: string[]; given?: Record<string, number>; rng?: Rng; grade?: number } = {}
): GeneratedItem {
  setGrade(opts.grade ?? 5);
  const make = templatesFor(topicId, opts.grade ?? 5)![`${cpa}|${bloom}`];
  // Each question records its grade (so the same numbers at another grade count as different).
  const template: Template = (r, g) => {
    const it = make(r, g);
    it.params.g = opts.grade ?? 5;
    return it;
  };
  const rng = opts.rng ?? Math.random;
  if (opts.given) return template(rng, opts.given);
  const avoid = opts.avoid ?? [];
  // Try for numbers this child has never had. If a level has truly run out
  // (only after many tests), use the numbers they saw longest ago.
  let best: GeneratedItem | null = null;
  let bestAge = Infinity;
  for (let i = 0; i < 300; i++) {
    const item = template(rng);
    const at = avoid.lastIndexOf(signature(item));
    if (at === -1) return item;
    if (at < bestAge) {
      bestAge = at;
      best = item;
    }
  }
  return best!;
}

/**
 * What counts as "the same question": the topic and its numbers, at any
 * level. Once a child has had 7 and 3 in a topic, in any form, they don't
 * get 7 and 3 in that topic again (in this test or a later one).
 */
export function signature(item: GeneratedItem): string {
  return `${item.topicId}|${Object.entries(item.params).map(([k, v]) => `${k}=${v}`).join(",")}`;
}

export function isGenerated(item: Item): item is GeneratedItem {
  return (item as GeneratedItem).generated === true;
}

/** Topics ready at Grade 4, in book order (offered one by one on the start page). */
export const GRADE4_TOPICS = ["more-large-numbers", "operations-large-numbers", "factors-multiples", "four-operations-fractions", "decimals"];

/** Grade 8 chapters ready, in book order (offered one by one on the start page). */
export const GRADE8_TOPICS = Object.keys(GRADE8_TEMPLATES);

/** Grade 8 English topics ready, in the order offered (one by one on the start page). */
export const ENGLISH8_TOPICS = Object.keys(ENGLISH8_TEMPLATES);
