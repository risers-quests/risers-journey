import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/**
 * Chapter 6, Drum Dream Girl (Margarita Engle), English Rose Reader 8.
 * The poem is in copyright: only short extracts are used, as the reader's
 * own questions use them.
 */
export const DRUM_DREAM: Chapter = {
  topic: "e8-lit-drum-dream",
  prefix: "ddg8",
  kind: "poem",
  taps: [
    { s: "believed that only boys should play drums", prompt: "Tap who everyone believed should play drums.", target: "only boys" },
    { s: "and big, round, silvery moon-bright timbales.", prompt: "Tap the words that describe the timbales.", target: "big, round, silvery moon-bright" },
    { s: "Her big sisters were so excited that they invited her to join their new all-girl dance band", prompt: "Tap the kind of band her sisters formed.", target: "all-girl dance band" },
    { s: "until finally her father offered to find a music teacher", prompt: "Tap what her father finally offered to find.", target: "a music teacher" },
    { s: "to play her small bongó drums outdoors at a starlit café that looked like a garden", prompt: "Tap where she finally played her drums.", target: "a starlit café" },
  ],
  evidence: [
    { s: "the brave drum dream girl dared to play", prompt: "Tap the words that show she had courage.", target: ["brave", "dared"] },
    { s: "and she practised and she practised and she practised", prompt: "Tap the word that shows how hard she worked.", target: "practised" },
    { s: "but when she closed her eyes she could also hear her own imaginary music.", prompt: "Tap the words that show she dreamt of making music.", target: "her own imaginary music" },
    { s: "At home, her fingertips rolled out their own dreamy drum rhythm on tables and chairs", prompt: "Tap where she drummed at home.", target: "on tables and chairs" },
    { s: "The drum dream girl's teacher was amazed.", prompt: "Tap the word that shows how the teacher felt.", target: "amazed." },
  ],
  orders: [
    ["Everyone believed only boys should play drums.", "She drummed secretly on tables and chairs at home.", "Her father offered to find a music teacher.", "She played her bongó drums at a starlit café."],
    ["Her sisters invited her to join their dance band.", "Her father said only boys should play drums.", "She kept dreaming and drumming alone."],
    ["The teacher was amazed at what she knew.", "She practised and practised.", "The teacher agreed she was ready.", "Everyone decided girls should always be allowed to play drums."],
  ],
  wrongWord: [
    { s: "Her sisters formed an all-girl drum band.", bad: "drum", good: "dance" },
    { s: "Her father offered to find a dance teacher for her.", bad: "dance", good: "music" },
    { s: "The poet compares the brightness of the timbales to the sun.", bad: "sun", good: "moon" },
    { s: "At carnivals, she heard the dragon clang of costumed dancers wearing huge masks.", bad: "dancers", good: "drummers" },
    { s: "In the end she played her tall conga drums at the café.", bad: "conga", good: "bongó" },
  ],
  rtc: [
    { line: "At carnivals, she listened to the rattling beat of towering dancers on stilts", q: "What did she listen to the beat of?", a: "Towering dancers on stilts", w: ["Parrot wings", "Her teacher's drums", "Rain on the roof"] },
    { line: "and the dragon clang of costumed drummers wearing huge masks.", q: "Who else performed at the carnival?", a: "Costumed drummers in huge masks", w: ["Her big sisters", "Her music teacher", "Girls with bongó drums"] },
    { line: "Her big sisters were so excited that they invited her to join their new all-girl dance band", q: "Why were her sisters so excited?", a: "They heard how well she drummed", w: ["They had won a prize", "Their father bought them drums", "It was carnival time"] },
    { line: "but their father said only boys should play drums.", q: "Was she allowed to join the band at first?", a: "No: her father said only boys should play drums", w: ["Yes: her father agreed at once", "Yes: her teacher let her", "No: the band was full"] },
    { line: "where everyone who heard her dream-bright music sang and danced and decided", q: "What did the listeners decide?", a: "That girls should always be allowed to play drums", w: ["That she should stop playing", "That only boys should drum", "That the café should close"] },
    { line: "who could decide if her drums deserved to be heard.", q: "Who would decide this?", a: "A music teacher", w: ["Her sisters", "The carnival dancers", "Her mother"] },
  ],
  vocab: [
    { s: "of pounding tall conga drums", w: "conga", meaning: "a tall, narrow, single-headed drum", wrong: ["a dance", "a pair of small drums", "a drumstick"] },
    { s: "tapping small bongó drums", w: "bongó", meaning: "a pair of small drums played with the hands", wrong: ["a tall drum", "a bell", "a flute"] },
    { s: "of towering dancers on stilts", w: "stilts", meaning: "a pair of upright poles with supports for the feet", wrong: ["masks", "drums", "costumes"] },
    { s: "At carnivals, she listened to the rattling beat", w: "rattling", meaning: "making quick, sharp knocking sounds", wrong: ["slow and soft", "silent", "sweet and singing"] },
    { s: "Her hands seemed to fly as they rippled rapped and pounded", w: "pounded", meaning: "hit hard again and again", wrong: ["stroked gently", "stopped", "waved"] },
  ],
  infer: [
    { line: "but when she closed her eyes she could also hear her own imaginary music.", q: "What was her 'imaginary music'?", a: "The drum music she dreamt of playing herself", w: ["Music she heard on the radio", "Her sisters' singing", "The sound of the sea"] },
    { line: "and even though everyone kept reminding her that girls on the island of music have never played drums the brave drum dream girl dared to play", q: "What does this show about her?", a: "She was brave enough to follow her dream against everyone's opinion", w: ["She didn't hear what people said", "She wanted to annoy her father", "She was told to play by her teacher"] },
    { line: "The girl knew so much but he taught her more and more", q: "Why was her teacher amazed?", a: "She already knew so much without any lessons", w: ["She could not play at all", "She was too young", "She played the wrong drums"] },
    { line: "and both girls and boys should feel free to dream.", q: "What is the poet saying here?", a: "Dreams should not depend on whether you are a girl or a boy", w: ["Only boys should dream", "Girls should not play music", "Dreaming is a waste of time"] },
    { line: "When she walked under wind-wavy palm trees in a flower-bright park", q: "Which poetic device does the poet use here?", a: "Imagery: words that help us see and hear the scene", w: ["Rhyme", "Irony", "A question"] },
  ],
  claims: [
    { q: "The drum dream girl gave up when her father said no.", a: "No: she kept dreaming and drumming alone until he changed his mind", w: ["Yes: she stopped drumming", "Yes: she joined a dance band instead", "No: she ran away from home"] },
    { q: "The poem challenges a stereotype.", a: "Yes: it shows a girl can be a great drummer", w: ["No: it agrees only boys should drum", "No: it is only about carnivals", "Yes: it says boys can't drum"] },
    { q: "The poem tells us women make better drummers.", a: "No: it says one's gender is not an obstacle to one's dreams", w: ["Yes: that is its message", "Yes: boys are not allowed to drum", "No: it says men make better drummers"] },
    { q: "The poem is based on a real girl.", a: "Yes: Millo Castro Zaldarriaga, who drummed in Cuba", w: ["No: it is completely imaginary", "Yes: it is about Margarita Engle", "No: it is about a boy"] },
  ],
  facts: [
    { q: "The poet compares the brightness of the timbales to the ___", a: "silvery moon", w: ["glowing sun", "deep, blue sea", "stars"] },
    { q: "In the island of music, men played drums in ___", a: "outdoor cafés that looked like gardens", w: ["dark dens", "parks with palm trees", "schools"] },
    { q: "The drum dream girl's sisters had formed ___", a: "an all-girl dance band", w: ["an all-girl drum band", "an all-girl music band", "a choir"] },
    { q: "Her drumming finally made her father ___", a: "find a music teacher for her", w: ["confine her at home", "send her to dance school", "sell the drums"] },
    { q: "The poem tells us that ___", a: "one's gender is not an obstacle to one's dreams", w: ["women make better drummers", "the island of music is a beautiful place", "carnivals are noisy"] },
    { q: "The poet of 'Drum Dream Girl' is ___", a: "Margarita Engle", w: ["Edgar Albert Guest", "Robert Southey", "William Wordsworth"] },
  ],
  character: [
    { q: "Which words best describe the drum dream girl?", a: "Determined and brave", w: ["Lazy and shy", "Rude and disobedient for fun", "Proud and boastful"] },
    { q: "How did her father change?", a: "From saying only boys should drum to finding her a teacher", w: ["He never changed his mind", "From helping her to stopping her", "He became a drummer himself"] },
    { q: "Describe her passion for her dream.", a: "She drummed everywhere, even in secret, and practised again and again", w: ["She lost interest quickly", "She only drummed when told to", "She preferred dancing to drumming"] },
  ],
  theme: [
    { q: "What is the main message of 'Drum Dream Girl'?", a: "Follow your dreams; gender should not hold anyone back", w: ["Always obey your parents", "Drums are too loud", "Cuba is an island"] },
    { q: "Which theme label fits this poem?", a: "Gender equality", w: ["Divine retribution", "Mystery and suspense", "Nature"] },
    { q: "'This poem inspires us to challenge stereotypes.' Why?", a: "A girl does what people said girls could never do, and changes their minds", w: ["Everyone in the poem agrees from the start", "The poem is about boys only", "It tells us not to dream"] },
  ],
};
export const DRUM_DREAM_TEMPLATES = chapterTemplates(DRUM_DREAM);
export const verify = () => verifyChapter(DRUM_DREAM);
