import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/** Chapter 8, The Gift of India (Sarojini Naidu, 1917), English Rose Reader 8: the poem, glossary and questions. */
export const GIFT_INDIA: Chapter = {
  topic: "e8-lit-gift-india",
  prefix: "gfi8",
  kind: "poem",
  taps: [
    { s: "Is there aught you need that my hands withhold, Rich gifts of raiment or grain or gold?", prompt: "Tap the three rich gifts the speaker offers.", target: ["raiment", "grain", "gold?"] },
    { s: "Silent they sleep by the Persian waves, Scattered like shells on Egyptian sands,", prompt: "Tap the two places where the soldiers lie.", target: ["Persian", "Egyptian"] },
    { s: "On the blood-brown meadows of Flanders and France.", prompt: "Tap the two regions in Europe named here.", target: ["Flanders", "France."] },
    { s: "Of the torn red banners of Victory?", prompt: "Tap the words describing the banners.", target: "torn red" },
    { s: "Remember the blood of thy martyred sons!", prompt: "Tap who the speaker asks the world to remember.", target: "martyred sons!" },
  ],
  evidence: [
    { s: "Can ye measure the grief of the tears I weep", prompt: "Tap the word that shows the speaker's sorrow.", target: "grief" },
    { s: "Or the pride that thrills thro' my heart's despair", prompt: "Tap the word that shows she is also proud of them.", target: "pride" },
    { s: "They lie with pale brows and brave, broken hands,", prompt: "Tap the word that shows the soldiers' courage.", target: "brave," },
    { s: "To the drum-beats of duty, the sabres of doom.", prompt: "Tap the word that shows the soldiers went for duty.", target: "duty," },
    { s: "And the hope that comforts the anguish of prayer?", prompt: "Tap the word that shows she still has hope.", target: "hope" },
  ],
  orders: [
    ["Mother India offers her riches and her sons.", "Her sons lie dead in foreign lands.", "She speaks of her grief, pride and hope.", "She asks the world to remember them in peace."],
    ["The soldiers go to the drum-beats of duty.", "They fall in Persia, Egypt, Flanders and France.", "Peace comes after the war.", "The world is asked to honour their sacrifice."],
  ],
  wrongWord: [
    { s: "The speaker of the poem is Mother England.", bad: "England", good: "India" },
    { s: "The soldiers are scattered like shells on Persian sands.", bad: "Persian", good: "Egyptian" },
    { s: "The speaker says her grief is easy to measure.", bad: "easy", good: "impossible" },
    { s: "The poem was written during World War II.", bad: "II.", good: "I." },
    { s: "The speaker asks everyone to forget the soldiers in times of peace.", bad: "forget", good: "remember" },
  ],
  rtc: [
    { line: "Lo! I have flung to the East and West Priceless treasures torn from my breast,", q: "What are the 'priceless treasures'?", a: "Her sons: the Indian soldiers", w: ["Gold and jewels", "Grain and clothing", "Books and paintings"] },
    { line: "Lo! I have flung to the East and West Priceless treasures torn from my breast,", q: "What does 'flung' suggest about the speaker?", a: "She gave them up with great pain, almost by force", w: ["She was careless with them", "She was playing a game", "She was happy to see them go"] },
    { line: "Gathered like pearls in their alien graves", q: "Why are the graves called 'alien'?", a: "They are in foreign lands, far from India", w: ["They are on another planet", "They are very old", "They are unmarked"] },
    { line: "When the terror and tumult of hate shall cease And life be refashioned on anvils of peace,", q: "What does 'hate' refer to here?", a: "The war", w: ["A quarrel between friends", "The British Empire", "The soldiers' feelings"] },
    { line: "And your love shall offer memorial thanks To the comrades who fought in your dauntless ranks,", q: "What does the speaker hope will happen in peace time?", a: "The soldiers will be remembered and honoured", w: ["The soldiers will be forgotten", "India will go to war again", "Gold will be returned to India"] },
  ],
  vocab: [
    { s: "Is there aught you need that my hands withhold,", w: "aught", meaning: "anything at all", wrong: ["nothing", "gold", "food"] },
    { s: "Rich gifts of raiment or grain or gold?", w: "raiment", meaning: "clothing", wrong: ["rice", "jewels", "weapons"] },
    { s: "To the drum-beats of duty, the sabres of doom.", w: "sabres", meaning: "swords", wrong: ["drums", "flags", "horses"] },
    { s: "Gathered like pearls in their alien graves", w: "alien", meaning: "foreign", wrong: ["from space", "unknown", "silent"] },
    { s: "When the terror and tumult of hate shall cease", w: "tumult", meaning: "a state of confusion or disorder", wrong: ["peace", "a song", "a grave"] },
    { s: "To the comrades who fought in your dauntless ranks,", w: "dauntless", meaning: "fearless", wrong: ["tired", "frightened", "careless"] },
    { s: "And you honour the deeds of the deathless ones", w: "deathless", meaning: "immortal", wrong: ["dead", "forgotten", "wounded"] },
    { s: "And the hope that comforts the anguish of prayer?", w: "anguish", meaning: "pain and suffering", wrong: ["joy", "silence", "anger"] },
  ],
  infer: [
    { line: "Can ye measure the grief of the tears I weep Or compass the woe of the watch I keep?", q: "What does the speaker mean?", a: "Her sorrow is too great to be measured", w: ["Her grief is small", "She is watching a clock", "She wants someone to count her tears"] },
    { line: "They are strewn like blossoms mown down by chance", q: "What does this simile suggest about the soldiers?", a: "Young lives cut short, like flowers cut down", w: ["They are planting gardens", "They are resting in a meadow", "They are celebrating"] },
    { line: "And the far sad glorious vision I see Of the torn red banners of Victory?", q: "Why is victory 'sad' and the banners 'torn'?", a: "Victory came at the cost of many lives", w: ["The banners are old", "The war was lost", "Victory is always joyful"] },
    { line: "Is there aught you need that my hands withhold,", q: "Who is the speaker?", a: "Mother India", w: ["A British soldier", "The poet's son", "The King of England"] },
  ],
  claims: [
    { q: "The poem glorifies war.", a: "No: it honours the soldiers but mourns their deaths", w: ["Yes: it celebrates every battle", "Yes: it asks for more war", "No: it doesn't mention war"] },
    { q: "The gift of soldiers cannot be valued through price.", a: "Yes: they are called 'priceless treasures'", w: ["No: they were paid in gold", "No: the poem gives their price", "Yes, because they were not brave"] },
    { q: "The speaker's grief is easy to measure.", a: "No: she asks 'Can ye measure the grief…?' because it can't be", w: ["Yes: she counts her tears", "Yes: she is only a little sad", "No: she feels no grief"] },
    { q: "The speaker asks everyone to remember the soldiers in peace too.", a: "Yes: 'Remember the blood of thy martyred sons!'", w: ["No: she wants them forgotten", "No: she speaks only of war", "Yes, but only the British soldiers"] },
  ],
  facts: [
    { q: "The poem refers to Indian soldiers martyred in ___", a: "Persia, Egypt, Flanders and France", w: ["India and Burma", "England and Scotland", "China and Japan"] },
    { q: "The poem is set during ___", a: "World War I", w: ["World War II", "the Indian Mutiny", "the Cold War"] },
    { q: "Indian soldiers in this war fought for ___", a: "the British Empire", w: ["Persia", "Egypt", "France alone"] },
    { q: "The poet of 'The Gift of India' is ___", a: "Sarojini Naidu", w: ["Sudha Murty", "Rabindranath Tagore", "Margarita Engle"] },
    { q: "Sarojini Naidu was the first woman to become ___", a: "Governor of a state of the Republic of India", w: ["Prime Minister", "President", "a soldier"] },
  ],
  character: [
    { q: "Which feelings does the speaker have for the soldiers?", a: "Grief, pride and hope", w: ["Anger and shame", "Fear and hatred", "Boredom"] },
    { q: "How is the speaker like a mother?", a: "She has given up her sons and grieves for them", w: ["She cooks for the soldiers", "She scolds her children", "She sends them gold"] },
  ],
  theme: [
    { q: "What is the main message of 'The Gift of India'?", a: "Honour and remember the soldiers who gave their lives", w: ["War is a great adventure", "India is rich in gold", "Foreign lands are beautiful"] },
    { q: "Is the speaker truly 'gifting' her sons?", a: "Not willingly: they were 'torn from my breast'", w: ["Yes, she is happy to give them", "Yes, she sells them", "No, she keeps them at home"] },
    { q: "Which theme label fits this poem?", a: "War and peace", w: ["Gender equality", "Mystery and suspense", "Nature"] },
  ],
};
export const GIFT_INDIA_TEMPLATES = chapterTemplates(GIFT_INDIA);
export const verify = () => verifyChapter(GIFT_INDIA);
