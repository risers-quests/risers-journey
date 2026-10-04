/* Form 1: Self-Assessment — from "Risers' Social/Emotional & Self-Directed
   Development Rubric". Wording kept exactly as the source PDF, for both
   the kid's own copy and every staff copy (per direction: no rewrite). */
window.EOT2_RUBRIC_SCALE = [
  { code: 'NE', label: 'Not Yet Evident' },
  { code: 'E', label: 'Emerging' },
  { code: 'D', label: 'Developing' },
  { code: 'CD', label: 'Consistently Demonstrates' }
];

window.EOT2_RUBRIC = [
  {
    title: 'Self-Directed Learning',
    subsections: [
      {
        title: 'Planning',
        items: [
          { id: 'planning-1', text: 'Uses progress board/planner to plan their daily work and keeps it up to date' },
          { id: 'planning-2', text: 'Accurately estimates how long a task will take' },
          { id: 'planning-3', text: 'Keeps to their weekly goals that have been planned in conference with guide' },
          { id: 'planning-4', text: 'Ability to change plans when necessary' }
        ]
      },
      {
        title: 'Ownership of Learning',
        items: [
          { id: 'ownership-1', text: 'Works on their plan with concentration and focus' },
          { id: 'ownership-2', text: 'Starts work with minimal prompting once a plan is made' },
          { id: 'ownership-3', text: 'Stays focused on their own tasks without distracting others' },
          { id: 'ownership-4', text: 'Understands concepts from textbook/videos and is able to try on their own' },
          { id: 'ownership-5', text: 'Checks answers with the workbook and makes corrections' },
          { id: 'ownership-6', text: 'Asks for help after trying on their own' },
          { id: 'ownership-7', text: 'Requests assessments when ready and follows through to prepare for the scheduled assessment' },
          { id: 'ownership-8', text: 'Shows willingness to revise and re-learn any missed concepts' }
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
          { id: 'time-1', text: 'Aware of how much time is left in a work block and adjusts pace accordingly' },
          { id: 'time-2', text: 'Moves between work, activities and Quests without extended downtime' },
          { id: 'time-3', text: 'Returns to unfinished work after an interruption or transition' },
          { id: 'time-4', text: "Paces multi-day or multi-session work/Quests so they don't stall or rush at the end" },
          { id: 'time-5', text: 'Takes appropriate time to recharge when feeling distracted/drained' },
          { id: 'time-6', text: 'Chooses to do select work at home when necessary' }
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
          { id: 'problem-1', text: 'Asks a clarifying or investigative question rather than giving up' },
          { id: 'problem-2', text: 'Shows willingness to test an idea that might not work' },
          { id: 'problem-3', text: "Adjusts approach after a first attempt doesn't succeed" },
          { id: 'problem-4', text: 'Shows curiosity about why something works, not just getting the answer' },
          { id: 'problem-5', text: "Open to a peer's or facilitator's suggestion even if it differs from their own idea" }
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
          { id: 'discussion-1', text: 'Willingly participates without prompting' },
          { id: 'discussion-2', text: 'Listens without interrupting during group discussion' },
          { id: 'discussion-3', text: "Asks a question to understand another's viewpoint" },
          { id: 'discussion-4', text: 'Disagrees respectfully, using reasons rather than dismissal' },
          { id: 'discussion-5', text: 'Shares own thinking even when uncertain or incomplete' }
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
          { id: 'selfaware-1', text: 'Notices when their feelings are starting to affect how they act' },
          { id: 'selfaware-2', text: 'Tells the truth even when it is uncomfortable' },
          { id: 'selfaware-3', text: 'Notices when they make a mistake and owns it honestly' },
          { id: 'selfaware-4', text: 'Understands their feelings are real, and that they can choose what to do with them' }
        ]
      },
      {
        title: 'Self-Management',
        items: [
          { id: 'selfmanage-1', text: 'Uses strategies to calm down when upset or frustrated' },
          { id: 'selfmanage-2', text: 'Speaks up and tries something even when nervous' },
          { id: 'selfmanage-3', text: 'Keeps going on hard tasks even when they feel like giving up' },
          { id: 'selfmanage-4', text: 'Recognizes when they are feeling stressed or overwhelmed and knows how to help themselves' }
        ]
      },
      {
        title: 'Social Awareness',
        items: [
          { id: 'socialaware-1', text: "Checks in when they see someone's expression change" },
          { id: 'socialaware-2', text: 'Tries to understand how someone else might be feeling, even if they feel differently' },
          { id: 'socialaware-3', text: 'Notices when someone around them needs help or support and offers appropriate help' },
          { id: 'socialaware-4', text: 'Can manage their face and body even when upset, so others feel safe and included' }
        ]
      },
      {
        title: 'Relationship Skills',
        items: [
          { id: 'relationship-1', text: 'Shares what they feel, identifies their need, and voices their request' },
          { id: 'relationship-2', text: 'Shares work equally when working with others' },
          { id: 'relationship-3', text: 'Works through disagreements by listening, sharing their view, and compromising' }
        ]
      }
    ]
  }
];

window.EOT2_RUBRIC_ITEM_COUNT = window.EOT2_RUBRIC.reduce(function (n, section) {
  return n + section.subsections.reduce(function (m, sub) { return m + sub.items.length; }, 0);
}, 0);
