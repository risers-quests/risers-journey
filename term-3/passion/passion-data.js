/* Passion Finder: finds what each Riser really loves, so we can give them
   time to do more of it. Runs on the 10th Boards form's page
   (../grade10/grade10.js): question kinds 'text' | 'one' | 'many', hint,
   why, optional (not labelled). {name} is the Riser, {pick} the ONE thing
   they chose.

   How it gets past quick, surface answers:
   1. They type what they make, practise or do when nobody tells them,
      before seeing any list ("Stuck? See ideas" opens one; staff see which
      answers were typed and which were picked from ideas). Then quick
      either/or choices.
   2. They pick the ONE thing they'd keep (only from what they added).
   3. For that one thing they're asked for proof, not preferences: when
      they last did it and what exactly, the best thing they've made, names
      they know in it, whether they'd still do it if nobody saw, what
      they've skipped for it.
   There's no "not sure" answer: everyone picks one.
   Staff OK it and choose which Risers see it before anyone does. */
(function () {
  var SCREEN = 'Watching shows or videos, gaming or scrolling';
  var DOING = ['Drawing or painting', 'Building or making things', 'Making games', 'Coding or tinkering with tech', 'Reading', 'Writing stories or poems', 'Music: playing, singing or making it', 'Sport or moving about', 'Cooking or baking', 'Being out in nature', 'Taking photos or making videos', 'Taking things apart to see how they work', 'Looking after animals or plants', 'Helping or teaching other people', 'Selling things or running a small business', SCREEN];
  var chosen = function (a) { return !!a.top; };

  // Watching, gaming, scrolling, eating or sleeping: consuming, not doing.
  // An answer that mentions one of these and no "doing" word (make, draw,
  // cook, edit…) gets a message and must be changed before sending.
  // "Making YouTube videos" or "cooking food" pass; "watching YouTube",
  // "Netflix" or "eating" don't. Free text can always be worded round it;
  // this catches the honest, everyday answers.
  var CONSUME = /\b(watch\w*|youtube|yt|netflix|prime|hotstar|series|movies?|films?|tv|telly|television|shows?|anime|cartoons?|reels?|shorts|insta\w*|tiktok|snapchat|scroll\w*|phone|mobile|tablet|ipad|screen|eat|eats|eating|ate|food|snacks?|chocolates?|sleep\w*|nap\w*|gam(e|es|ing)|gamer|video ?games?|play ?station|ps[45]|xbox|nintendo|switch|fortnite|minecraft|roblox|free ?fire|pubg|bgmi|valorant|gta|fifa|among us|chilling|relaxing|nothing)\b/i;
  var DO = /\b(make|makes|making|made|creat\w*|edit\w*|record\w*|film(ing|ed)|shoot\w*|draw\w*|paint\w*|sketch\w*|build\w*|code|codes|coding|coded|program\w*|writ\w*|wrote|cook\w*|bak\w*|design\w*|animat\w*|compos\w*|practi[cs]\w*|train\w*|fix\w*|grow\w*|sell\w*|teach\w*|learn\w*|review\w*|mod(s|ding|ded)?|stream(ing)? my)\b/i;
  function consuming(v) { return CONSUME.test(v || '') && !DO.test(v || ''); }
  function check(msg) { return function (v) { return consuming(v) ? msg : ''; }; }
  // A typed item for question 1: "nothing"/"idk" isn't an answer; watching,
  // gaming or scrolling is filed as SCREEN (never their ONE).
  function redirect(v) {
    if (/^(nothing|none|idk|dunno|no idea|not sure|nil|na|n\/a)$/i.test(v.trim())) return { reject: 'Write one real thing you do, or tap “Stuck? See ideas”.' };
    if (consuming(v)) return { to: SCREEN, note: '“' + v + '” sounds like watching, gaming or scrolling, so it’s added as “' + SCREEN + '”. What do you make, practise or do?' };
    return null;
  }

  window.G10 = {
    title: 'Passion Finder',
    previewName: 'you',
    intro: 'This is all about you: what you really love doing. There are no right or wrong answers and nothing here is marked. Be honest, not impressive: the more real your answers, the better we can make time for you to do more of what you love. It saves as you type.',
    pick: { from: 'top', none: 'your one thing' },
    text: {
      key: 'term3-passion', approval: 'passion-approval', defaultKids: [],
      sub: 'All about what {name} loves',
      hideOptional: true,
      flagNote: 'Flagged: this sounds like watching, gaming, scrolling or eating rather than doing.',
      thanks: 'Thank you! You submitted this on {date}. Your facilitator will read it and talk with you about what you love and how to make time for it.',
      staffIntro: 'Each Riser types what they make, practise or do when nobody tells them, before seeing any list; “Stuck? See ideas” opens one. Answers are marked typed or from ideas: typed is the stronger signal. Watching, gaming or scrolling is filed separately and never becomes their ONE; instead they say what they love about it (story, strategy, building worlds…). Typed answers about watching, gaming, scrolling or eating are caught and must be changed before sending. They make quick either/or choices, then pick the ONE thing they’d keep. For that one thing they are asked for proof rather than preferences (when they last did it, the best thing they made, names they know, whether they’d do it if nobody saw). Answers that are vague or don’t hold together are your starting point for the chat. Risers only see it once it’s OK’d here; they find it on their Term 3 page.',
      previewNote: 'This is what Risers see. The questions in “Your one” follow whatever they pick.',
      who: 'which Risers it’s for', one: 'Riser', many: 'Risers'
    },
    sections: [
      { title: 'What you choose to do', qs: [
        { id: 'free', text: 'When nobody tells you what to do, what do you make, practise or do?', kind: 'chips', rerender: true,
          hint: 'Type one thing and tap Add. Add as many as are true, only things you really do now.', placeholder: 'Type one thing…', options: DOING, redirect: redirect },
        { id: 'screen_love', text: 'What do you love most about watching, gaming or scrolling? Choose all that are true.', kind: 'many',
          when: function (a) { return (a.free || []).indexOf(SCREEN) !== -1; }, whenLabel: 'Shown only if they add watching, gaming or scrolling',
          options: ['The stories', 'The characters', 'Working out the strategy', 'Competing and winning', 'Building worlds', 'The art, music or effects', 'How it’s made', 'Learning how to do things', 'Being with friends', 'Relaxing'] },
        { id: 'screen_what', text: 'Which shows, channels or games, mostly?', kind: 'text',
          when: function (a) { return (a.free || []).indexOf(SCREEN) !== -1; }, whenLabel: 'Shown only if they add watching, gaming or scrolling' },
        { id: 'flow', text: 'What is something you do or make where you lose track of time?', kind: 'text', hint: 'The thing where you look up and an hour has gone by. Not watching, gaming or scrolling.',
          ideas: ['building with Lego', 'drawing comics', 'practising football', 'baking', 'writing stories', 'playing an instrument', 'fixing a cycle', 'gardening', 'coding a game'],
          check: check('That sounds like watching, gaming, scrolling or eating. What’s something you do or make where you lose track of time?') },
        { id: 'askme', text: 'What do friends or family ask you to help with, or say you’re good at?', kind: 'text', optional: true }
      ] },
      { title: 'Quick choices', qs: [
        { id: 'c_make', text: 'On a free afternoon, would you rather…', kind: 'one', options: ['Make something with my hands', 'Make something on a screen'] },
        { id: 'c_people', text: 'Would you rather…', kind: 'one', options: ['Do it with other people', 'Do it on my own'] },
        { id: 'c_new', text: 'Would you rather…', kind: 'one', options: ['Learn something completely new', 'Get really good at something I already do'] },
        { id: 'c_place', text: 'Would you rather be…', kind: 'one', options: ['Indoors', 'Outdoors'] },
        { id: 'c_think', text: 'Would you rather…', kind: 'one', options: ['Create something', 'Figure something out'] }
      ] },
      { title: 'Your ONE', qs: [
        { id: 'top', text: 'Of everything you added, if you could keep only ONE, which would it be?', kind: 'one', rerender: true,
          optionsFrom: 'free', optionsFilter: function (o) { return o !== SCREEN; },
          hint: 'These are the things you added in question 1 (not watching, gaming or scrolling). Tap the one you’d keep.',
          emptyHint: 'Nothing here yet: add the things you make, practise or do in question 1 (not watching, gaming or scrolling), and they will show up here.' }
      ] },
      { title: 'Your one: {pick}', when: chosen, whenLabel: 'Shown once they pick their ONE (the questions are about that one thing)', qs: [
        { id: 'last', text: 'When did you last do it, and what exactly did you do?', kind: 'text', hint: 'As exactly as you can: which day, what you did, for how long.',
          check: check('That sounds like watching, gaming or scrolling. Tell us about the last time you did it yourself.') },
        { id: 'since', text: 'How long have you been doing it?', kind: 'one', options: ['I’ve just started', 'A few months', 'About a year', 'More than a year', 'Since I was little'] },
        { id: 'best', text: 'What is the best thing you have done or made in it so far?', kind: 'text', hint: 'Bring it, or a photo of it, to your chat with your facilitator.',
          check: check('That sounds like watching, gaming or scrolling. What have you done or made yourself?') },
        { id: 'names', text: 'Name a person, channel, book, game, tool or team you love in it.', kind: 'text', hint: 'As many as you like.' },
        { id: 'unseen', text: 'Would you still do it if nobody ever saw it or said “well done”?', kind: 'one', options: ['Yes, I’d still do it', 'No, I like people seeing it'] },
        { id: 'skipped', text: 'Have you ever chosen it over something else you could have done?', kind: 'one', options: ['Yes', 'No'], why: 'What did you choose it over?' },
        { id: 'next', text: 'What do you wish you could do in it that you can’t do yet?', kind: 'text' },
        { id: 'help', text: 'What would help you do more of it?', kind: 'many',
          options: ['Time in my week for it', 'Materials or tools', 'Someone who knows how', 'Videos, books or courses', 'A friend who loves it too', 'A quiet space'] }
      ] }
    ]
  };
})();
