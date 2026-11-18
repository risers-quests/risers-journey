import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 9, Monitoring the Tiger (adapted from Daulat Singh Shaktawat), English Rose Reader 8. In copyright: short extracts only. */
const PAIR = ["a. is correct, but b. is false.", "b. is correct, but a. is false.", "Both a. and b. are correct.", "Both a. and b. are false."] as const;
const pair = (a: string, b: string, right: 0 | 1 | 2 | 3) => ({ q: `a. ${a} b. ${b} Which is true?`, a: PAIR[right], w: PAIR.filter((_, k) => k !== right) as unknown as [string, string, string] });

export const TIGER: Chapter = {
  topic: "e8-lit-tiger",
  prefix: "tig8",
  kind: "piece",
  taps: [
    { s: "In 1966, Simlipal National Park in Odisha introduced this method to assess the tiger population.", prompt: "Tap the park that first introduced pugmark counting.", target: "Simlipal National Park" },
    { s: "After coming across a distinct set of pugmarks, they would pour plaster of Paris (POP) in the impression on the ground.", prompt: "Tap what the guards poured into the pugmark.", target: "plaster of Paris" },
    { s: "The Ranthambore Park authorities started preparing pugmark impression pads (PIPs) with 2 mm thick soil layers.", prompt: "Tap how thick the soil layers of the PIPs were.", target: "2 mm thick" },
    { s: "A camera trap is a remotely activated camera that is equipped with a motion sensor or an infrared sensor.", prompt: "Tap the two kinds of sensor a camera trap can have.", target: ["motion", "infrared"] },
    { s: "This technique was first used for tigers by American scientists in Royal Chitwan National Park, Nepal, during the 1980s.", prompt: "Tap where radio telemetry was first used for tigers.", target: "Royal Chitwan National Park, Nepal," },
  ],
  evidence: [
    { s: "Bhadya was one such honest, brave tiger tracker and hardworking game watcher.", prompt: "Tap the three words that praise Bhadya.", target: ["honest,", "brave", "hardworking"] },
    { s: "Nonetheless, the accuracy of pugmark monitoring relied heavily on the skills, judgement and honesty of the beat guards.", prompt: "Tap what pugmark monitoring depended on.", target: ["skills,", "judgement", "honesty"] },
    { s: "The fluctuating and declining tiger numbers in India, along with uncertain records, prompted conservationists to criticise the pugmark method.", prompt: "Tap the words that show why the pugmark method was criticised.", target: ["declining", "uncertain records,"] },
    { s: "It is an efficient method for preparing inventories and for population studies of the species as individual tigers can be recognised by their stripe markings.", prompt: "Tap what makes each tiger recognisable in a photograph.", target: "stripe markings." },
    { s: "This is a highly skilled operation and can be undertaken only after determining the exact amount of the dose of sedatives to be given.", prompt: "Tap the words that show radio telemetry is difficult.", target: "highly skilled operation" },
  ],
  orders: [
    ["Pugmark counting began at Simlipal in 1966.", "Ranthambore made pugmark impression pads.", "Camera traps were tried in the late eighties.", "Camera traps were used for the Ranthambore census in 2006."],
    ["A beat guard finds a fresh pugmark.", "He pours plaster of Paris into it.", "He writes the site on the back of the cast.", "The cast is sent to headquarters for analysis."],
    ["The tiger is darted with a sedative.", "It is covered with a wet cloth.", "It is weighed and a radio collar is fitted.", "It is given an antidote and set free."],
  ],
  wrongWord: [
    { s: "Pugmark monitoring began at Ranthambore National Park in 1966.", bad: "Ranthambore", good: "Simlipal" },
    { s: "Camera traps recognise tigers by their pugmarks.", bad: "pugmarks.", good: "stripes" },
    { s: "The beat guards poured cement into the pugmark impressions.", bad: "cement", good: "plaster" },
    { s: "Radio telemetry was first used for tigers in India.", bad: "India.", good: "Nepal" },
    { s: "Bhadya was a lazy tiger tracker.", bad: "lazy", good: "hardworking" },
  ],
  rtc: [
    { line: "The tracking of animals during the monsoons becomes difficult and erratic, but you could always see Bhadya, armed with his long-handled axe and tracking kit, diligently going about his duty.", q: "What did the author admire in Bhadya here?", a: "He worked carefully even when tracking was hardest", w: ["He was the strongest guard", "He only worked in summer", "He carried the most equipment"] },
    { line: "They decided to adopt the new camera trap method which relied on technology rather than human psychology.", q: "What prompted this decision?", a: "Fluctuating and declining tiger numbers with uncertain records", w: ["Too many tigers in the forest", "The beat guards refused to work", "Cameras became cheaper"] },
    { line: "Chemical immobilisation is also used to treat sick or injured animals.", q: "How is chemical immobilisation done?", a: "By shooting a dart containing sedatives", w: ["By trapping the animal in a cage", "By giving it food", "By photographing it"] },
    { line: "In the peripheral and adjoining rural areas of Ranthambore, village wildlife volunteers of the NGO Tiger Watch are actively working with camera traps.", q: "How are tigers monitored in human-dominated areas near the forest?", a: "Village volunteers of Tiger Watch use camera traps", w: ["Beat guards use pugmarks", "Scientists fit radio collars", "Tourists take photographs"] },
  ],
  vocab: [
    { s: "Pugmark monitoring was a major tool in the past to count tigers in the wild during census operations.", w: "census", meaning: "an official count of a population", wrong: ["a hunt", "a photograph", "a map"] },
    { s: "The tracking of animals during the monsoons becomes difficult and erratic,", w: "erratic", meaning: "irregular", wrong: ["easy", "dangerous", "quick"] },
    { s: "you could always see Bhadya diligently going about his duty.", w: "diligently", meaning: "carefully and thoroughly", wrong: ["lazily", "angrily", "quietly"] },
    { s: "there had to be something very special about this unassuming tiger tracker.", w: "unassuming", meaning: "not arrogant", wrong: ["boastful", "frightened", "famous"] },
    { s: "From his vast repertoire of knowledge and first-hand experience,", w: "repertoire", meaning: "the entire collection of skills", wrong: ["a book", "a weapon", "a report"] },
    { s: "eminent wildlife scientist Dr K Ullas Karanth of the Wildlife Conservation Society", w: "eminent", meaning: "famous and well respected", wrong: ["unknown", "young", "infamous"] },
    { s: "The camera traps not only capture tigers but also other elusive mammals such as leopards.", w: "elusive", meaning: "difficult to find or catch", wrong: ["common", "dangerous", "tame"] },
    { s: "It involves chemically immobilising the tiger by shooting a dart containing sedatives.", w: "sedatives", meaning: "substances with calming or sleep-inducing effects", wrong: ["poisons", "vitamins", "food"] },
  ],
  infer: [
    { line: "Nonetheless, the accuracy of pugmark monitoring relied heavily on the skills, judgement and honesty of the beat guards.", q: "What might happen if a beat guard was not honest?", a: "The tiger count would be wrong, and conservation planned on false numbers", w: ["Tigers would stop leaving pugmarks", "The cameras would break", "Nothing would change"] },
    { line: "This is a highly skilled operation and can be undertaken only after determining the exact amount of the dose of sedatives to be given.", q: "What is the biggest risk of radio telemetry?", a: "A wrong dose of sedative could harm or kill the tiger", w: ["The radio collar might be lost", "The tiger might be photographed", "The pugmarks might change"] },
    { line: "Tigers do not have similar pugmarks and a single pugmark can also vary in size and shape in different types of soils.", q: "Why was the pugmark method unreliable?", a: "The same tiger's pugmark looks different in different soils", w: ["Tigers have no pugmarks", "Pugmarks wash away instantly", "All tigers have identical pugmarks"] },
    { line: "camera traps are important non-invasive tools for assessing numbers, patterns of activity and habitat use", q: "Why is it good that camera traps are 'non-invasive'?", a: "The animals are not touched, darted or harmed", w: ["They are very cheap", "They need beat guards", "They catch the tigers"] },
  ],
  claims: [
    { q: "Camera traps rely on human judgement more than pugmarks do.", a: "No: camera traps rely on technology, not human psychology", w: ["Yes: guards must judge every photo", "Yes: they need honest guards", "No: they rely on luck"] },
    { q: "Only tigers are photographed by camera traps.", a: "No: they also capture leopards, hyenas, caracals and more", w: ["Yes: they are tiger-only cameras", "Yes: other animals avoid them", "No: they photograph only people"] },
    { q: "The passage describes three methods of monitoring tigers.", a: "Yes: pugmarks, camera traps and radio telemetry", w: ["No: only one method", "No: only pugmarks and dogs", "Yes: pugmarks, drones and satellites"] },
    { q: "Pugmark and radio telemetry methods need special training.", a: "Yes: beat guards were trained in pugmarks, and darting is highly skilled", w: ["No: anyone can do them", "No: only camera traps need training", "Yes, but only for tourists"] },
  ],
  facts: [
    pair("The same tiger's pugmarks can change their size and shape based on the type of soil they are made on.", "Therefore, the PIPs were created from one type of soil and placed all over the forest.", 0),
    pair("Dr Ullas Karanth of the Wildlife Conservation Society worked with camera traps in the late eighties.", "Then the technique was taken up by various state departments and lastly by Project Tiger.", 0),
    { q: "Camera traps were adopted in Ranthambore for the tiger census in ___", a: "2006", w: ["1966", "1987", "2022"] },
    { q: "Each tiger photographed by camera traps is given ___", a: "a unique ID number", w: ["a radio collar", "a name by tourists", "a plaster cast"] },
    { q: "The estimated wild tiger population of India (Tiger Census 2022) was ___", a: "3,167", w: ["1,966", "316", "31,670"] },
    { q: "The author trained at the Wildlife Institute of India, Dehradun, in ___", a: "1987", w: ["1966", "2006", "1980"] },
  ],
  character: [
    { q: "Why did the author admire Bhadya?", a: "He was honest, brave, simple and dedicated, and taught him tracking tips", w: ["He was rich and famous", "He owned many cameras", "He was the park director"] },
    { q: "What kind of person is the author?", a: "An experienced forest officer who learns from others", w: ["A tourist on holiday", "A hunter", "A photographer only"] },
  ],
  theme: [
    { q: "What is the main idea of the passage?", a: "Tigers are monitored in different ways to protect them, and methods have improved with technology", w: ["Tigers are dangerous and should be avoided", "Pugmarks are the best method", "Forests should be cleared"] },
    { q: "Why does India's tiger population need to be monitored?", a: "Tigers are endangered; accurate numbers help protect them", w: ["To sell their photographs", "To count tourists", "To find hunting grounds"] },
  ],
};
export const TIGER_TEMPLATES = chapterTemplates(TIGER);
export const verify = () => verifyChapter(TIGER);
