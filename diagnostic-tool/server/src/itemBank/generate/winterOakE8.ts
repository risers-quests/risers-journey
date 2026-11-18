import { Chapter, chapterTemplates, verifyChapter } from "./litE8.js";

/**
 * Chapter 1, The Winter Oak (adapted from Yuri Nagibin), English Rose
 * Reader 8. Built from the reader's own text, glossary and questions
 * (Reading comprehension A–C).
 */
export const WINTER_OAK: Chapter = {
  topic: "e8-lit-winter-oak",
  prefix: "wok8",
  kind: "story",
  taps: [
    { s: "Two years out of college, she was already known as the best Russian teacher in the district.", prompt: "Tap the word that tells which subject Anna Vasilyevna taught.", target: "Russian" },
    { s: "'But I don't go by the highway, I take a shortcut through the forest,' Savushkin said earnestly.", prompt: "Tap the words that tell which way Savushkin comes to school.", target: "a shortcut through the forest", wrong: [{ phrase: "the highway", mistake: "lit-detail" }] },
    { s: "Occasionally, the trees opened to a sunlit clearing crisscrossed with large, clover-shaped tracks.", prompt: "Tap the words that describe the tracks in the clearing.", target: "large, clover-shaped" },
    { s: "Anna looked at her watch. A quarter past three.", prompt: "Tap the time Anna saw on her watch.", target: "A quarter past three" },
    { s: "He pushed aside a large clump of snow. A spikey little ball covered with leaves lay in the hollow below.", prompt: "Tap the words that describe the hidden hedgehog.", target: "A spikey little ball covered with leaves" },
    { s: "Widowed by war, she now raised four children alone and led a difficult life.", prompt: "Tap the word that tells how many children Savushkin's mother raised.", target: "four" },
  ],
  evidence: [
    { s: "'Why lie?' Anna thought unhappily.", prompt: "Tap the words that show Anna thought Savushkin was lying.", target: "'Why lie?'" },
    { s: "Ashamed, and inwardly begging forgiveness of the oak, she said, 'This proves a shortcut isn't always best.'", prompt: "Tap the word that shows how Anna felt as she spoke.", target: "Ashamed," },
    { s: "Savushkin busied himself at the foot of the trunk, treating the magnificent tree with the familiarity of a long-standing friendship.", prompt: "Tap the words that show Savushkin knew the oak well.", target: "the familiarity of a long-standing friendship" },
    { s: "Savushkin hadn't left. He stayed, guarding her way, even from afar.", prompt: "Tap the words that show Savushkin cared about his teacher.", target: "guarding her way" },
    { s: "'Winter oak!' repeated Savushkin, heedless of the laughter around him.", prompt: "Tap the word that shows Savushkin didn't mind the class laughing.", target: "heedless" },
    { s: "Anna blushed. She had better hold her tongue here, in the woods.", prompt: "Tap the words that show Anna felt she should stop correcting Savushkin.", target: "hold her tongue" },
  ],
  orders: [
    ["A stud farm worker steps aside for Anna on the snowy path.", "Savushkin comes late to the lesson on nouns.", "Savushkin shouts 'Winter oak!' and the class laughs.", "Anna asks Savushkin why he is always late."],
    ["Savushkin leads Anna into the forest.", "They see elk tracks in a clearing.", "Anna throws snow into the warm spring.", "They reach the winter oak."],
    ["Savushkin shows Anna a hedgehog under the snow.", "Savushkin says his mother will be at work by now.", "Anna says he may take the forest path to school.", "Anna turns for one last look at the winter oak."],
  ],
  wrongWord: [
    { s: "Anna Vasilyevna was known as the best English teacher in the district.", bad: "English", good: "Russian" },
    { s: "Savushkin was late because he came by the highway.", bad: "highway", good: "forest" },
    { s: "At the foot of the oak, Savushkin showed Anna a sleeping squirrel.", bad: "squirrel", good: "hedgehog" },
    { s: "Savushkin's mother worked at the sanatorium as a cook.", bad: "cook", good: "shower-nurse" },
    { s: "When Anna looked at her watch, it was a quarter past four.", bad: "four", good: "three" },
    { s: "At the end, Anna refused to let Savushkin take the forest path to school.", bad: "refused", good: "agreed" },
  ],
  rtc: [
    { line: "'An oak is nothing. A winter oak, there's a noun for you!'", q: "Who says this?", a: "Savushkin", w: ["Anna Vasilyevna", "The pupil who said 'Cat'", "Savushkin's mother"] },
    { line: "'Why \"winter oak\"? \"Oak\" is enough.'", q: "Who says this, and how does she feel?", a: "Anna, annoyed", w: ["Anna, delighted", "Savushkin's mother, worried", "A classmate, amused"] },
    { line: "'There's only my mother,' Savushkin said softly.", q: "What had Anna just said?", a: "That she would talk to his parents", w: ["That he should take the highway", "That his example was wrong", "That he should sit down"] },
    { line: "'Don't be afraid,' he added, reading an unspoken question in her eyes.", q: "What was Anna afraid of here?", a: "The elk whose tracks they had just seen", w: ["Falling through the ice", "Getting lost in the forest", "Being late for her next lesson"] },
    { line: "'Oh, oh, Mother'll be at work by now!'", q: "Why was this a problem?", a: "They had planned to meet his mother before she went to work", w: ["His mother would be angry he was in the forest", "He had left his school bag behind", "It was getting dark in the forest"] },
    { line: "The words seemed to have burst out like a confession, like some glorious secret which could not remain unshared.", q: "What were 'the words'?", a: "'Winter oak!'", w: ["'May I come in?'", "'Cat'", "'Elk tracks'"] },
    { line: "She'd taken no more than a few faltering steps along the path that might well require a whole lifetime to cover.", q: "Which 'path' is meant here?", a: "Learning to be a truly good teacher", w: ["The narrow path from Uvarovka", "The forest path to the oak", "The highway to the sanatorium"] },
  ],
  vocab: [
    { s: "The young schoolteacher stepped cautiously, ready to draw back her foot if the shadows proved treacherous.", w: "treacherous", meaning: "unsafe", wrong: ["beautiful", "deep", "cold"] },
    { s: "Like most young teachers, Anna enjoyed being strict, but now an almost plaintive note sounded in her voice.", w: "plaintive", meaning: "sad and weakly complaining", wrong: ["loud and angry", "cheerful", "strict"] },
    { s: "Then someone said hesitantly, 'Town.'", w: "hesitantly", meaning: "with pauses, unsure", wrong: ["loudly", "rudely", "quickly"] },
    { s: "'Winter oak!' repeated Savushkin, heedless of the laughter around him.", w: "heedless", meaning: "without paying attention", wrong: ["frightened", "ashamed", "proud"] },
    { s: "It seemed that even in trifling matters like this, truth was not so easy to establish.", w: "trifling", meaning: "small and unimportant", wrong: ["serious", "strange", "secret"] },
    { s: "'But I don't go by the highway, I take a shortcut through the forest,' Savushkin said earnestly.", w: "earnestly", meaning: "seriously", wrong: ["jokingly", "angrily", "sleepily"] },
    { s: "A thin layer of ice covered the surface of the brook there, and fleeting shadows kept moving over it.", w: "fleeting", meaning: "disappearing quickly", wrong: ["dark and heavy", "still", "frozen"] },
    { s: "She reverently approached the tree and halted under its glittering branches.", w: "reverently", meaning: "with deep respect", wrong: ["carelessly", "fearfully", "quickly"] },
    { s: "She'd taken no more than a few faltering steps along the path that might well require a whole lifetime to cover.", w: "faltering", meaning: "unsteady", wrong: ["confident", "long", "silent"] },
    { s: "In the middle of the clearing, in sparkling white raiment, stood an old oak, tall and majestic like a cathedral.", w: "raiment", meaning: "clothing", wrong: ["light", "silence", "branches"] },
  ],
  infer: [
    { line: "He greeted her cheerfully and stepped aside, immediately sinking in the snow. Anna nodded graciously and hurried on.", q: "What does this show about Anna at the start?", a: "She took the man's kindness for granted and thought only of herself", w: ["She was very grateful and stopped to thank him", "She was afraid of the man", "She was lost in the snow"] },
    { line: "Anna blushed. She remembered the boy's mother, a tired-looking shower-nurse who worked at the sanatorium.", q: "Why did Anna blush?", a: "She was embarrassed to have spoken of 'parents' to a boy whose father had died", w: ["She was angry with Savushkin", "She was cold from the snow", "She was proud of her lesson"] },
    { line: "Anna blushed. She had better hold her tongue here, in the woods.", q: "Why did Anna feel she should hold her tongue?", a: "Savushkin understood the forest better than she did", w: ["Savushkin had been rude to her", "Talking might frighten the elk", "She had lost her voice in the cold"] },
    { line: "Ashamed, and inwardly begging forgiveness of the oak, she said, 'This proves a shortcut isn't always best.'", q: "Why did Anna inwardly beg forgiveness of the oak?", a: "She knew the forest walk was worth it, but scolded Savushkin anyway", w: ["She had broken one of its branches", "She had thrown snow at it", "She had called it an ordinary tree"] },
    { line: "Savushkin looked down and did not reply.", q: "Why did Savushkin not reply?", a: "He was hurt that his teacher still wanted him to use the highway", w: ["He had not heard her", "He agreed the highway was faster", "He was looking for the hedgehog"] },
    { line: "And suddenly Anna knew that the most wonderful being in that forest was not the winter oak but this small boy in battered boots.", q: "What has Anna come to understand?", a: "Savushkin's wonder, kindness and knowledge were more precious than the tree", w: ["The boy was stronger than the tree", "The tree was not really very old", "Savushkin needed new boots"] },
  ],
  claims: [
    { q: "Savushkin was late because he played in the snow with other kids.", a: "No: Anna only guessed that; he walked the long way through the forest", w: ["Yes: the story says so", "Yes: he admitted it to Anna", "No: he overslept every day"] },
    { q: "Anna's view of Savushkin changed during the walk.", a: "Yes: she began annoyed with him and ended admiring him", w: ["No: she was annoyed with him all the time", "No: she always admired him", "Yes: she began admiring him and ended annoyed"] },
    { q: "Anna learnt something from her pupil.", a: "Yes: Savushkin showed her that words like 'winter oak' are full of life", w: ["No: teachers don't learn from pupils", "No: she only learnt the way to his home", "Yes: he taught her what a noun is"] },
    { q: "Anna and Savushkin met his mother at three o'clock.", a: "No: they stayed too long in the forest, and she had left for work", w: ["Yes: they reached her home at three", "Yes: she came to school to meet them", "No: Savushkin didn't want Anna to meet her"] },
  ],
  facts: [
    { q: "Anna Vasilyevna was a teacher of ___", a: "Russian", w: ["English", "Mathematics", "Economics"] },
    { q: "The fine opening of the day was spoiled by ___", a: "Savushkin's unpunctuality", w: ["the heavy snowfall", "the pupils' lack of discipline", "Savushkin's wrong example"] },
    { q: "Anna thought Savushkin was lying because she thought ___", a: "he got late because he played with other children in the snow", w: ["he took too long to come to school even though he took a shortcut", "he got lost in the snowy forest", "everyone always came via the highway, especially on snowy days"] },
    { q: "There was movement on the ice over the brook because ___", a: "the moving branch of a tree created shadows over the ice", w: ["the flowing water could be seen under the thin ice", "Savushkin disturbed the water with his feet", "Anna threw clumps of snow on the ice"] },
    { q: "Anna felt sorry for Savushkin's mother because ___", a: "she had a hard time bringing up four children single-handedly", w: ["her job as a shower-nurse was very difficult", "she did not have time to give to her children", "her children often got into trouble"] },
    { q: "Savushkin lived ___", a: "on the sanatorium premises", w: ["in Uvarovka village", "next to the school", "on the stud farm"] },
    { q: "The snow Anna threw into the warm spring ___", a: "ballooned and sank like green jelly", w: ["melted at once", "floated away on the stream", "froze into ice"] },
    { q: "The animal hidden under the snow by the oak was a ___", a: "hedgehog", w: ["elk", "squirrel", "rabbit"] },
  ],
  character: [
    { q: "Which words best describe Savushkin?", a: "Curious and caring", w: ["Lazy and rude", "Shy and fearful", "Proud and boastful"] },
    { q: "At the start of the story, Anna thinks of herself as ___", a: "an experienced, successful teacher", w: ["a poor teacher who needs help", "a strict teacher nobody likes", "a nervous new teacher"] },
    { q: "How does Anna's view of Savushkin change?", a: "From a late, annoying pupil to the most wonderful being in the forest", w: ["From a good pupil to a liar", "It doesn't change at all", "From a friend to a stranger"] },
    { q: "What does Savushkin's 'Winter oak!' show about him?", a: "He sees wonder in things others think ordinary", w: ["He didn't understand what a noun is", "He wanted to make the class laugh", "He was trying to annoy his teacher"] },
  ],
  theme: [
    { q: "What is 'The Winter Oak' mainly saying?", a: "Nature, and even a pupil, can teach us what lessons can't", w: ["Pupils should never be late", "Shortcuts are always best", "Forests are dangerous in winter"] },
    { q: "What does the story say about learning?", a: "We learn by looking closely at the world, not only from lessons", w: ["Only teachers can teach", "Learning means remembering rules", "Children learn best when teachers are strict"] },
    { q: "Why is the story called 'The Winter Oak'?", a: "Savushkin's winter oak changes how Anna sees words, nature and him", w: ["The story happens in an oak forest in spring", "The oak is the name of the school", "Anna wants the oak cut down"] },
  ],
};

export const WINTER_OAK_TEMPLATES = chapterTemplates(WINTER_OAK);
export const verify = () => verifyChapter(WINTER_OAK);
