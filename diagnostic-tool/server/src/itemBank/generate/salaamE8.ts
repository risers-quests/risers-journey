import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 7, Salaam Namaste (Sudha Murty), English Rose Reader 8. In copyright: short extracts only. */
export const SALAAM: Chapter = {
  topic: "e8-lit-salaam",
  prefix: "sln8",
  kind: "story",
  taps: [
    { s: "I used to buy books for the Bangalore slum schools we supported from Sheikh Mohammed's tiny shop.", prompt: "Tap whose shop the narrator bought books from.", target: "Sheikh Mohammed's" },
    { s: "'Yes, she is a very good tailor. She and my wife do tailoring at home.'", prompt: "Tap Zubeida's work.", target: "tailor." },
    { s: "He came the next morning and showed me all the documents. I took a look and handed him a cheque for fifty thousand rupees.", prompt: "Tap how much the narrator gave Sheikh.", target: "fifty thousand rupees." },
    { s: "I opened it. There were three thousand rupees in it.", prompt: "Tap how much money was in the envelope.", target: "three thousand rupees" },
    { s: "'I have sold all of Zubeida's and my wife's jewellery. I have also taken a loan from the bank.'", prompt: "Tap where Sheikh took a loan from.", target: "the bank." },
  ],
  evidence: [
    { s: "He took a couple and put them away carefully in his pocket.", prompt: "Tap the word that shows Sheikh cared about the sweets for the children.", target: "carefully" },
    { s: "With their income and the money I earn from the shop we get by quite well. We are contented.", prompt: "Tap the word that shows Sheikh was satisfied with what he had.", target: "contented." },
    { s: "'Madam, at least I can afford this much. You should be helping those who are poorer than I do.'", prompt: "Tap the words that show Sheikh thought of others.", target: "those who are poorer" },
    { s: "Sheikh's face was lined with grief.", prompt: "Tap the word that shows how Sheikh felt about Zubeida's death.", target: "grief." },
    { s: "She was scared and ill-at-ease in this strange office where people bustled about busily.", prompt: "Tap the words that show how Tabassum felt in the office.", target: ["scared", "ill-at-ease"] },
  ],
  orders: [
    ["Sheikh takes sweets home for the children.", "He asks for his cheque early because Zubeida has cancer.", "The narrator gives him fifty thousand rupees.", "Zubeida dies a fortnight later."],
    ["Sheikh brings Tabassum to the office.", "Tabassum asks for a biscuit for Ameena.", "Sheikh hands the narrator an envelope.", "The narrator learns it was Zubeida's last wish."],
    ["The operation costs only forty-seven thousand rupees.", "Zubeida makes Sheikh promise to return the rest.", "The narrator gives the money back for Tabassum."],
  ],
  wrongWord: [
    { s: "Sheikh Mohammed had a shop selling vegetables.", bad: "vegetables", good: "stationery" },
    { s: "Zubeida worked as a teacher at home.", bad: "teacher", good: "tailor" },
    { s: "Zubeida was suffering from malaria.", bad: "malaria", good: "cancer" },
    { s: "Tabassum asked for another sweet for Ameena.", bad: "sweet", good: "biscuit" },
    { s: "The envelope Sheikh returned held five thousand rupees.", bad: "five", good: "three" },
  ],
  rtc: [
    { line: "'What's the matter, Sheikh? Why aren't you eating the sweets? Are you diabetic?'", q: "Why wasn't Sheikh eating the sweets?", a: "He was taking them home for the children", w: ["He was diabetic", "He didn't like sweets", "He was fasting"] },
    { line: "'She is my sister Zubeida's daughter. She is a widow and both stay with us.'", q: "Why did Sheikh's niece stay with him?", a: "Her mother Zubeida was a widow, and they lived with Sheikh", w: ["Her school was near his shop", "She was an orphan from birth", "She worked in his shop"] },
    { line: "I asked for the cheque to be sent to him immediately.", q: "Why was the cheque sent immediately?", a: "Zubeida's cancer operation was the next day", w: ["Sheikh was leaving the city", "The bank was closing", "The books were late"] },
    { line: "'Our earth is enriched by people like Zubeida.'", q: "Who said this, and to whom?", a: "The narrator, to Tabassum", w: ["Sheikh, to the narrator", "Tabassum, to Ameena", "Zubeida, to Sheikh"] },
    { line: "'Ammi ne bola than na? Inko salaam karo.'", q: "Who says this to Tabassum?", a: "Her uncle, Sheikh", w: ["The narrator", "Ameena", "Her mother"] },
  ],
  vocab: [
    { s: "Sheikh was a shy, taciturn man and I knew little about him and his family.", w: "taciturn", meaning: "someone who does not speak much", wrong: ["very talkative", "very rich", "very angry"] },
    { s: "I have seen women hiding their diamond studs in their purses.", w: "studs", meaning: "small pieces of jewellery", wrong: ["horses", "coins", "buttons"] },
    { s: "declaring their children orphans and their parents as destitutes", w: "destitutes", meaning: "poor people", wrong: ["rich people", "teachers", "doctors"] },
    { s: "the largeness of her heart even on her deathbed left me speechless.", w: "speechless", meaning: "unable to speak", wrong: ["very loud", "angry", "tired"] },
    { s: "Our earth is enriched by people like Zubeida.", w: "enriched", meaning: "made more valuable", wrong: ["made poorer", "made dirty", "made smaller"] },
    { s: "One day she would understand and perhaps emulate her mother's courage.", w: "emulate", meaning: "imitate", wrong: ["forget", "fear", "laugh at"] },
  ],
  infer: [
    { line: "Surprised and hesitant, he said, 'This is a lot of money. I never expected such help to come from the blue.'", q: "Why did Sheikh hesitate to take the cheque?", a: "He was honest and humble, and didn't want more than he needed", w: ["He thought the cheque was fake", "He wanted even more money", "He was angry with the narrator"] },
    { line: "'Contented' is a word rarely heard these days.", q: "Why did the narrator say this?", a: "Most people always want more; Sheikh was happy with what he had", w: ["Nobody knows the word any more", "Sheikh spoke very little", "The narrator didn't like the word"] },
    { line: "She was scared and ill-at-ease in this strange office where people bustled about busily. Just to make her feel comfortable, I offered her some biscuits. She took one and then asked me in a shy voice, 'Can I take another one? For Ameena?'", q: "Why did Tabassum take a biscuit for Ameena?", a: "Like her uncle with the sweets, she thought of others first", w: ["She was very hungry", "Ameena had asked her to", "She wanted to eat it later herself"] },
    { line: "In spite of her own pain and poverty, she had thought about someone who might be in greater need of help.", q: "Why did Zubeida's last wish stun the narrator?", a: "Even while dying and poor, she returned money so it could help someone else", w: ["She asked for more money", "She wanted to meet the narrator", "She left everything to Tabassum"] },
    { line: "I was sure Tabassum would grow up to be a fine human being.", q: "Why was the narrator sure of this?", a: "Her mother's kindness was passed on through her", w: ["She was very clever at school", "She was polite to everyone", "She liked biscuits"] },
  ],
  claims: [
    { q: "Sheikh asked for more money than he needed.", a: "No: he asked only for what was due to him", w: ["Yes: he asked for fifty thousand", "Yes: he wanted a loan", "No: he asked for nothing at all"] },
    { q: "Sheikh and Tabassum have something in common.", a: "Yes: both think of others before themselves", w: ["No: they are not related", "Yes: both are tailors", "No: Tabassum was greedy"] },
    { q: "Zubeida's family kept the money that was left over.", a: "No: Zubeida asked for it to be returned for some other sick person", w: ["Yes: they spent it on Tabassum", "Yes: Sheikh paid his loan with it", "No: the narrator took it back"] },
    { q: "The story shows the value of compassion.", a: "Yes: poor people help others in greater need", w: ["No: it is about running a shop", "No: it shows people are selfish", "Yes, but only the narrator is kind"] },
  ],
  facts: [
    { q: "The narrator knew Sheikh Mohammed because ___", a: "she bought books from his shop for slum schools", w: ["he was her neighbour", "he worked in her office", "he was a relative"] },
    { q: "Sheikh Mohammed's niece stayed with him because ___", a: "her mother Zubeida was a widow", w: ["her school was nearby", "she worked in his shop", "her parents were abroad"] },
    { q: "To pay for the operation, Sheikh had ___", a: "sold jewellery and taken a bank loan", w: ["sold his shop", "asked his customers", "borrowed from his brother"] },
    { q: "The operation used only ___ of the money", a: "forty-seven thousand rupees", w: ["fifty thousand rupees", "three thousand rupees", "twenty thousand rupees"] },
    { q: "The story 'Salaam Namaste' is by ___", a: "Sudha Murty", w: ["Sarojini Naidu", "Saki", "Cynthia Asquith"] },
  ],
  character: [
    { q: "Which words best describe Sheikh Mohammed?", a: "Honest, generous and contented", w: ["Greedy and dishonest", "Proud and rude", "Lazy and careless"] },
    { q: "Which words best describe Zubeida?", a: "Brave and compassionate", w: ["Selfish and bitter", "Rich and careless", "Shy and fearful"] },
    { q: "Tabassum's greeting for the narrator shows that ___", a: "she was well brought up and respectful", w: ["she was rude", "she knew the narrator well", "she wanted money"] },
  ],
  theme: [
    { q: "What is the main message of 'Salaam Namaste'?", a: "Simple acts of kindness, even by the poor, enrich the world", w: ["Money can buy happiness", "Always ask for more than you need", "Shops should sell more books"] },
    { q: "What kind of 'courage' did the narrator hope Tabassum would emulate?", a: "The courage to help others even in pain and poverty", w: ["The courage to fight", "The courage to travel alone", "The courage to speak loudly"] },
    { q: "Why is the story called 'Salaam Namaste'?", a: "It brings together greetings of two communities, and respect between people", w: ["It is the name of the shop", "It is Tabassum's school", "It is a kind of sweet"] },
  ],
};
export const SALAAM_TEMPLATES = chapterTemplates(SALAAM);
export const verify = () => verifyChapter(SALAAM);
