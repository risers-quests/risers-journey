/* Form 1: Self-Assessment — from "Risers' Social/Emotional & Self-Directed
   Development Rubric". Staff see the rubric's own wording, unchanged
   (third person, "the child") — that's what they're used to and it
   stays exact. Kids see `kidText` instead: the same statement with
   ONLY the pronouns and verb conjugation changed to first person
   ("Uses..." -> "I use...", "their" -> "my") — same words, same
   structure, nothing paraphrased or reworded. Same 43 items, same ids. */
window.EOT2_RUBRIC_SCALE = [
  { code: 'NE', label: 'Not Yet Evident', desc: "Hasn't shown this yet, or hasn't had the chance to try." },
  { code: 'E', label: 'Emerging', desc: 'Starting to do this, but usually needs help or a reminder.' },
  { code: 'D', label: 'Developing', desc: 'Can do this alone sometimes, but not every time yet.' },
  { code: 'CD', label: 'Consistently Demonstrates', desc: 'Does this alone, every time, without needing reminders.' }
];

window.EOT2_RUBRIC = [
  {
    title: 'Self-Directed Learning',
    subsections: [
      {
        title: 'Planning',
        items: [
          { id: 'planning-1', text: 'Uses progress board/planner to plan their daily work and keeps it up to date', kidText: 'I use my progress board/planner to plan my daily work and keep it up to date.' },
          { id: 'planning-2', text: 'Accurately estimates how long a task will take', kidText: 'I accurately estimate how long a task will take.' },
          { id: 'planning-3', text: 'Keeps to their weekly goals that have been planned in conference with guide', kidText: 'I keep to my weekly goals that have been planned in conference with my guide.' },
          { id: 'planning-4', text: 'Ability to change plans when necessary', kidText: 'I am able to change plans when necessary.' }
        ]
      },
      {
        title: 'Ownership of Learning',
        items: [
          { id: 'ownership-1', text: 'Works on their plan with concentration and focus', kidText: 'I work on my plan with concentration and focus.' },
          { id: 'ownership-2', text: 'Starts work with minimal prompting once a plan is made', kidText: 'I start work with minimal prompting once a plan is made.' },
          { id: 'ownership-3', text: 'Stays focused on their own tasks without distracting others', kidText: 'I stay focused on my own tasks without distracting others.' },
          { id: 'ownership-4', text: 'Understands concepts from textbook/videos and is able to try on their own', kidText: 'I understand concepts from textbook/videos and am able to try on my own.' },
          { id: 'ownership-5', text: 'Checks answers with the workbook and makes corrections', kidText: 'I check answers with the workbook and make corrections.' },
          { id: 'ownership-6', text: 'Asks for help after trying on their own', kidText: 'I ask for help after trying on my own.' },
          { id: 'ownership-7', text: 'Requests assessments when ready and follows through to prepare for the scheduled assessment', kidText: 'I request assessments when ready and follow through to prepare for the scheduled assessment.' },
          { id: 'ownership-8', text: 'Shows willingness to revise and re-learn any missed concepts', kidText: 'I show willingness to revise and re-learn any missed concepts.' }
        ]
      }
    ]
  },
  {
    title: 'Time Awareness/Management',
    subsections: [
      {
        title: null,
        items: [
          { id: 'time-1', text: 'Aware of how much time is left in a work block and adjusts pace accordingly', kidText: 'I am aware of how much time is left in a work block and adjust my pace accordingly.' },
          { id: 'time-2', text: 'Moves between work, activities and Quests without extended downtime', kidText: 'I move between work, activities and Quests without extended downtime.' },
          { id: 'time-3', text: 'Returns to unfinished work after an interruption or transition', kidText: 'I return to unfinished work after an interruption or transition.' },
          { id: 'time-4', text: "Paces multi-day or multi-session work/Quests so they don't stall or rush at the end", kidText: "I pace multi-day or multi-session work/Quests so I don't stall or rush at the end." },
          { id: 'time-5', text: 'Takes appropriate time to recharge when feeling distracted/drained', kidText: 'I take appropriate time to recharge when feeling distracted/drained.' },
          { id: 'time-6', text: 'Chooses to do select work at home when necessary', kidText: 'I choose to do select work at home when necessary.' }
        ]
      }
    ]
  },
  {
    title: 'Problem Solving',
    subsections: [
      {
        title: null,
        items: [
          { id: 'problem-1', text: 'Asks a clarifying or investigative question rather than giving up', kidText: 'I ask a clarifying or investigative question rather than giving up.' },
          { id: 'problem-2', text: 'Shows willingness to test an idea that might not work', kidText: 'I show willingness to test an idea that might not work.' },
          { id: 'problem-3', text: "Adjusts approach after a first attempt doesn't succeed", kidText: "I adjust my approach after a first attempt doesn't succeed." },
          { id: 'problem-4', text: 'Shows curiosity about why something works, not just getting the answer', kidText: 'I show curiosity about why something works, not just getting the answer.' },
          { id: 'problem-5', text: "Open to a peer's or facilitator's suggestion even if it differs from their own idea", kidText: "I am open to a peer's or facilitator's suggestion even if it differs from my own idea." }
        ]
      }
    ]
  },
  {
    title: 'Discussion',
    subsections: [
      {
        title: null,
        items: [
          { id: 'discussion-1', text: 'Willingly participates without prompting', kidText: 'I willingly participate without prompting.' },
          { id: 'discussion-2', text: 'Listens without interrupting during group discussion', kidText: 'I listen without interrupting during group discussion.' },
          { id: 'discussion-3', text: "Asks a question to understand another's viewpoint", kidText: "I ask a question to understand another's viewpoint." },
          { id: 'discussion-4', text: 'Disagrees respectfully, using reasons rather than dismissal', kidText: 'I disagree respectfully, using reasons rather than dismissal.' },
          { id: 'discussion-5', text: 'Shares own thinking even when uncertain or incomplete', kidText: 'I share my own thinking even when uncertain or incomplete.' }
        ]
      }
    ]
  },
  {
    title: 'SEL',
    subsections: [
      {
        title: 'Self-Awareness',
        items: [
          { id: 'selfaware-1', text: 'Notices when their feelings are starting to affect how they act', kidText: 'I notice when my feelings are starting to affect how I act.' },
          { id: 'selfaware-2', text: 'Tells the truth even when it is uncomfortable', kidText: 'I tell the truth even when it is uncomfortable.' },
          { id: 'selfaware-3', text: 'Notices when they make a mistake and owns it honestly', kidText: 'I notice when I make a mistake and own it honestly.' },
          { id: 'selfaware-4', text: 'Understands their feelings are real, and that they can choose what to do with them', kidText: 'I understand my feelings are real, and that I can choose what to do with them.' }
        ]
      },
      {
        title: 'Self-Management',
        items: [
          { id: 'selfmanage-1', text: 'Uses strategies to calm down when upset or frustrated', kidText: 'I use strategies to calm down when upset or frustrated.' },
          { id: 'selfmanage-2', text: 'Speaks up and tries something even when nervous', kidText: 'I speak up and try something even when nervous.' },
          { id: 'selfmanage-3', text: 'Keeps going on hard tasks even when they feel like giving up', kidText: 'I keep going on hard tasks even when I feel like giving up.' },
          { id: 'selfmanage-4', text: 'Recognizes when they are feeling stressed or overwhelmed and knows how to help themselves', kidText: 'I recognize when I am feeling stressed or overwhelmed and know how to help myself.' }
        ]
      },
      {
        title: 'Social Awareness',
        items: [
          { id: 'socialaware-1', text: "Checks in when they see someone's expression change", kidText: "I check in when I see someone's expression change." },
          { id: 'socialaware-2', text: 'Tries to understand how someone else might be feeling, even if they feel differently', kidText: 'I try to understand how someone else might be feeling, even if I feel differently.' },
          { id: 'socialaware-3', text: 'Notices when someone around them needs help or support and offers appropriate help', kidText: 'I notice when someone around me needs help or support and offer appropriate help.' },
          { id: 'socialaware-4', text: 'Can manage their face and body even when upset, so others feel safe and included', kidText: 'I can manage my face and body even when upset, so others feel safe and included.' }
        ]
      },
      {
        title: 'Relationship Skills',
        items: [
          { id: 'relationship-1', text: 'Shares what they feel, identifies their need, and voices their request', kidText: 'I share what I feel, identify my need, and voice my request.' },
          { id: 'relationship-2', text: 'Shares work equally when working with others', kidText: 'I share work equally when working with others.' },
          { id: 'relationship-3', text: 'Works through disagreements by listening, sharing their view, and compromising', kidText: 'I work through disagreements by listening, sharing my view, and compromising.' }
        ]
      }
    ]
  }
];

window.EOT2_RUBRIC_ITEM_COUNT = window.EOT2_RUBRIC.reduce(function (n, section) {
  return n + section.subsections.reduce(function (m, sub) { return m + sub.items.length; }, 0);
}, 0);
