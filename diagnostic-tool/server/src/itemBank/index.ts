import { Item, CPAStage, BloomLevel } from "../types.js";
import { MORE_ON_LARGE_NUMBERS_ITEMS } from "./moreOnLargeNumbers.js";
import { OPERATIONS_ON_LARGE_NUMBERS_ITEMS } from "./operationsOnLargeNumbers.js";
import { FACTORS_AND_MULTIPLES_ITEMS } from "./factorsAndMultiples.js";
import { FRACTIONS_DIVISION_ITEMS } from "./fractionsDivision.js";
import { FOUR_OPERATIONS_FRACTIONS_ITEMS } from "./fourOperationsFractions.js";
import { DECIMALS_ITEMS } from "./decimals.js";
import { GEOMETRY_ITEMS } from "./geometry.js";
import { MEASUREMENT_ITEMS } from "./measurement.js";
import { PERIMETER_AND_AREA_ITEMS } from "./perimeterAndArea.js";
import { VOLUME_AND_NETS_ITEMS } from "./volumeAndNets.js";
import { TIME_AND_TEMPERATURE_ITEMS } from "./timeAndTemperature.js";
import { LIFE_MATHEMATICS_ITEMS } from "./lifeMathematics.js";
import { SCALES_AND_DIRECTIONS_ITEMS } from "./scalesAndDirections.js";
import { DATA_HANDLING_ITEMS } from "./dataHandling.js";
import { PATTERNS_AND_SYMMETRY_ITEMS } from "./patternsAndSymmetry.js";
import { TOPICS } from "./topics.js";

export const ALL_ITEMS: Item[] = [
  ...MORE_ON_LARGE_NUMBERS_ITEMS,
  ...OPERATIONS_ON_LARGE_NUMBERS_ITEMS,
  ...FACTORS_AND_MULTIPLES_ITEMS,
  ...FRACTIONS_DIVISION_ITEMS,
  ...FOUR_OPERATIONS_FRACTIONS_ITEMS,
  ...DECIMALS_ITEMS,
  ...GEOMETRY_ITEMS,
  ...MEASUREMENT_ITEMS,
  ...PERIMETER_AND_AREA_ITEMS,
  ...VOLUME_AND_NETS_ITEMS,
  ...TIME_AND_TEMPERATURE_ITEMS,
  ...LIFE_MATHEMATICS_ITEMS,
  ...SCALES_AND_DIRECTIONS_ITEMS,
  ...DATA_HANDLING_ITEMS,
  ...PATTERNS_AND_SYMMETRY_ITEMS,
];

export { TOPICS };

export function getTopic(topicId: string) {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) throw new Error(`Unknown topic ${topicId}`);
  return topic;
}

export function findItem(topicId: string, cpa: CPAStage, bloom: BloomLevel): Item | undefined {
  return ALL_ITEMS.find((it) => it.topicId === topicId && it.cpa === cpa && it.bloom === bloom);
}

export function getItemById(itemId: string): Item {
  const item = ALL_ITEMS.find((it) => it.id === itemId);
  if (!item) throw new Error(`Unknown item ${itemId}`);
  return item;
}

/** Client never receives correctChoiceId up front. */
export type ClientItem = ReturnType<typeof sanitizeItemForClient>;

export function sanitizeItemForClient(item: Item) {
  const shuffled = [...item.choices].sort(() => Math.random() - 0.5);
  return {
    id: item.id,
    topicId: item.topicId,
    cpa: item.cpa,
    bloom: item.bloom,
    subskill: item.subskill,
    prompt: item.prompt,
    representation: item.representation,
    choices: shuffled.map((c) => ({ id: c.id, text: c.text })),
    activity: item.activity,
    answerBy: item.answerBy ?? "choice",
  };
}
