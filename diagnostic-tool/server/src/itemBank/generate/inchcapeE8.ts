import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 4, The Inchcape Rock (Robert Southey), English Rose Reader 8: the poem, its glossary and questions. */
export const INCHCAPE: Chapter = {
  topic: "e8-lit-inchcape",
  prefix: "inc8",
  kind: "poem",
  taps: [
    { s: "The Abbot of Aberbrothok Had placed that bell on the Inchcape Rock;", prompt: "Tap who placed the bell on the rock.", target: "The Abbot of Aberbrothok" },
    { s: "On a buoy in the storm it floated and swung, And over the waves its warning rung.", prompt: "Tap what the bell was fixed on.", target: "a buoy" },
    { s: "And now, grown rich with plundered store, He steers his course for Scotland's shore.", prompt: "Tap where Sir Ralph was sailing to.", target: "Scotland's shore" },
    { s: "So thick a haze o'erspreads the sky, They cannot see the sun on high:", prompt: "Tap what covered the sky.", target: "So thick a haze" },
    { s: "Down sunk the bell with a gurgling sound; The bubbles rose and burst around:", prompt: "Tap the sound the bell made as it sank.", target: "a gurgling sound" },
  ],
  evidence: [
    { s: "No stir in the air, no stir in the sea, The ship was still as she could be;", prompt: "Tap the words that show the sea was calm.", target: "no stir in the sea" },
    { s: "His heart was mirthful to excess, But the Rover's mirth was wickedness.", prompt: "Tap the word that shows Sir Ralph's joy was evil.", target: "wickedness" },
    { s: "And then they knew the perilous rock, And blest the Abbot of Aberbrothok.", prompt: "Tap the words that show the sailors were grateful to the Abbot.", target: "blest the Abbot" },
    { s: "Sir Ralph the Rover tore his hair, He curst himself in his despair:", prompt: "Tap the words that show Sir Ralph blamed himself.", target: "He curst himself" },
    { s: "Quoth he, 'My men, put out the boat, And row me to the Inchcape Rock, And I'll plague the Abbot of Aberbrothok.'", prompt: "Tap the words that show why Sir Ralph went to the rock.", target: "I'll plague the Abbot" },
  ],
  orders: [
    ["The Abbot of Aberbrothok had placed a bell on the Inchcape Rock.", "The bell warned mariners against the fatal rock.", "The wicked Sir Ralph the Rover cut off the bell to spite the Abbot.", "After plundering many lands, Sir Ralph turned his course towards Scotland.", "Sir Ralph's ship was caught in a storm.", "Sir Ralph's vessel struck the Inchcape Rock and drowned."],
    ["Sir Ralph sees the buoy of the Inchcape Bell.", "His men row him to the rock.", "He cuts the bell from the float.", "The bell sinks with a gurgling sound."],
    ["A haze hides the sun and a gale blows all day.", "One sailor says he thinks they are near the shore.", "The ship strikes the Inchcape Rock.", "Sir Ralph hears a dreadful sound as he drowns."],
  ],
  wrongWord: [
    { s: "The Abbot of Aberbrothok placed a light on the Inchcape Rock.", bad: "light", good: "bell" },
    { s: "Sir Ralph cut the bell to please the Abbot.", bad: "please", good: "plague" },
    { s: "Grown rich with plundered store, Sir Ralph steered for Ireland's shore.", bad: "Ireland's", good: "Scotland's" },
    { s: "When the poem begins, the sea is rough and stormy.", bad: "rough", good: "calm" },
    { s: "In the end, Sir Ralph's ship struck the Inchcape Rock and floated away.", bad: "floated", good: "sank" },
  ],
  rtc: [
    { line: "Sir Ralph the Rover walked his deck, And fixed his eye on the darker speck.", q: "What was the 'darker speck'?", a: "The buoy of the Inchcape Bell", w: ["A distant ship", "A sea-bird", "The Inchcape Rock itself"] },
    { line: "Sir Ralph the Rover walked his deck, And fixed his eye on the darker speck.", q: "Why did Sir Ralph fix his eyes on it?", a: "He was planning to cut the bell off to annoy the Abbot", w: ["He wanted to ring the bell", "He thought it was treasure", "He was afraid of hitting it"] },
    { line: "'Canst hear,' said one, 'the breakers roar? For methinks we should be near the shore.'", q: "Who is 'one'?", a: "One of Sir Ralph's sailors", w: ["The Abbot", "Sir Ralph himself", "A fisherman on the shore"] },
    { line: "'Now where we are I cannot tell, But I wish we could hear the Inchcape Bell.'", q: "What did the speaker wish for?", a: "To hear the Inchcape Bell", w: ["To see the sun", "To reach Scotland quickly", "To meet the Abbot"] },
    { line: "Quoth Sir Ralph, 'The next who comes to the rock, Won't bless the Abbot of Aberbrothok.'", q: "What does Sir Ralph mean?", a: "Without the bell, the next ship will be wrecked and won't thank the Abbot", w: ["The next sailors will bless him instead", "The Abbot will come to the rock", "The bell will ring again soon"] },
    { line: "A sound as if, with the Inchcape Bell, The Devil below was ringing his knell.", q: "What does 'knell' mean here?", a: "A bell rung at a funeral", w: ["A church service", "A warning shout", "A ship's horn"] },
  ],
  vocab: [
    { s: "Her keel was steady in the ocean.", w: "keel", meaning: "the piece at the bottom of a ship that keeps it balanced", wrong: ["the tallest sail", "the ship's flag", "the anchor rope"] },
    { s: "On a buoy in the storm it floated and swung,", w: "buoy", meaning: "a floating object that marks safe and danger zones in water", wrong: ["a small boy", "a fishing net", "a lighthouse"] },
    { s: "The mariners heard the warning Bell;", w: "mariners", meaning: "sailors", wrong: ["monks", "fishes", "soldiers"] },
    { s: "And then they knew the perilous rock,", w: "perilous", meaning: "dangerous", wrong: ["beautiful", "hidden", "tall"] },
    { s: "His heart was mirthful to excess,", w: "mirthful", meaning: "merry", wrong: ["heavy", "angry", "frightened"] },
    { s: "He scoured the seas for many a day;", w: "scoured", meaning: "searched", wrong: ["cleaned", "crossed once", "feared"] },
    { s: "And now, grown rich with plundered store,", w: "plundered", meaning: "looted", wrong: ["bought", "borrowed", "found"] },
    { s: "The wind hath blown a gale all day;", w: "gale", meaning: "a strong wind", wrong: ["a gentle breeze", "a heavy rain", "a song"] },
    { s: "'Canst hear,' said one, 'the breakers roar?'", w: "breakers", meaning: "large waves moving towards land", wrong: ["broken boats", "thieves", "rocks"] },
    { s: "And there was joyance in their sound.", w: "joyance", meaning: "gladness", wrong: ["sadness", "silence", "danger"] },
  ],
  infer: [
    { line: "When the Rock was hid by the surge's swell, The mariners heard the warning Bell; And then they knew the perilous rock, And blest the Abbot of Aberbrothok.", q: "Why was the Abbot loved by all?", a: "His bell saved sailors from being wrecked on the rock", w: ["He gave sailors money", "He was a great sailor himself", "He rang church bells every morning"] },
    { line: "His heart was mirthful to excess, But the Rover's mirth was wickedness.", q: "Why was Sir Ralph so cheerful?", a: "He was thinking of the mischief he would do", w: ["Spring had come and he was in love", "He had found treasure", "His ship was going home"] },
    { line: "They hear no sound; the swell is strong; Though the wind hath fallen, they drift along, Till the vessel strikes with a shivering shock:", q: "Why did they hear no sound?", a: "Sir Ralph had cut off the bell that would have warned them", w: ["The storm was too loud", "The sailors were asleep", "The Abbot had taken the bell away"] },
    { line: "But even is his dying fear One dreadful sound could the Rover hear,— A sound as if, with the Inchcape Bell, The Devil below was ringing his knell.", q: "What does the last stanza suggest?", a: "Sir Ralph is punished for his wicked deed, as if the bell rings for his own death", w: ["The Abbot rescues Sir Ralph", "The bell was never really cut", "Sir Ralph swims safely to the shore"] },
    { line: "Quoth Sir Ralph, 'It will be lighter soon, For there is the dawn of the rising moon.'", q: "What does this show about Sir Ralph at this moment?", a: "He was not worried and did not see the danger coming", w: ["He was terrified of the dark", "He knew exactly where the rock was", "He was sorry for cutting the bell"] },
  ],
  claims: [
    { q: "Sir Ralph died because of a storm at sea.", a: "No: his own act of cutting the bell caused his death", w: ["Yes: the gale sank his ship", "Yes: the Abbot caused it", "No: he died of old age"] },
    { q: "The poem shows the irony of Sir Ralph's plan.", a: "Yes: the trick meant to hurt others destroyed him", w: ["No: his plan worked perfectly", "No: there is no irony in the poem", "Yes: the Abbot was punished instead"] },
    { q: "The Abbot and Sir Ralph are alike.", a: "No: they are opposites: one helps others, one harms them", w: ["Yes: both were sailors", "Yes: both loved the bell", "No: the Abbot was wicked and Sir Ralph good"] },
    { q: "'As you sow, so shall you reap' fits this poem.", a: "Yes: Sir Ralph's wicked act came back on him", w: ["No: Sir Ralph was rewarded", "No: the poem is about farming", "Yes: the Abbot became rich"] },
  ],
  facts: [
    { q: "When the poem begins, the sea is ___", a: "completely calm and still", w: ["rough and stormy", "frozen", "full of ships"] },
    { q: "The bell on the Inchcape Rock was placed by ___", a: "the Abbot of Aberbrothok", w: ["Sir Ralph the Rover", "the mariners", "the King of Scotland"] },
    { q: "Sir Ralph cut the bell because he wanted to ___", a: "plague (annoy) the Abbot", w: ["sell it", "save the sailors", "take it home as a gift"] },
    { q: "Sir Ralph grew rich by ___", a: "plundering (looting) at sea", w: ["trading fish", "selling bells", "working for the Abbot"] },
    { q: "Who was responsible for Sir Ralph's death?", a: "Sir Ralph himself", w: ["The Abbot", "His sailors", "The sea-birds"] },
    { q: "The poem 'The Inchcape Rock' is a ___", a: "ballad: a long poem that tells a story", w: ["sonnet", "limerick", "haiku"] },
  ],
  character: [
    { q: "Which words best describe Sir Ralph the Rover?", a: "Wicked and spiteful", w: ["Kind and helpful", "Shy and careful", "Wise and humble"] },
    { q: "Which words best describe the Abbot of Aberbrothok?", a: "Caring and thoughtful", w: ["Proud and greedy", "Lazy and careless", "Wicked and cruel"] },
    { q: "How did Sir Ralph feel at the end?", a: "Full of despair, cursing himself", w: ["Proud of his plan", "Calm and happy", "Angry with the Abbot only"] },
  ],
  theme: [
    { q: "What message does 'The Inchcape Rock' give us?", a: "Evil deeds come back on the person who does them", w: ["The sea is always dangerous", "Bells are useful on ships", "It is good to be rich"] },
    { q: "The poem's theme label is 'Divine Retribution'. What does that mean?", a: "Punishment that seems to come from above for wrongdoing", w: ["A reward for good sailors", "A prayer before a voyage", "A gift from the Abbot"] },
    { q: "What is the irony in the poem?", a: "Sir Ralph cut the bell to hurt others, and his own ship was wrecked without it", w: ["The Abbot drowned on the rock", "The bell was made of gold", "The sea was calm all the time"] },
  ],
};
export const INCHCAPE_TEMPLATES = chapterTemplates(INCHCAPE);
export const verify = () => verifyChapter(INCHCAPE);
