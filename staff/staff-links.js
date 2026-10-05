/* Links out to the private staff reference site (the
   risers-term2-digital-quests-staff-data repo). Answer keys, the Feedback
   report (kids' actual answer text), the Facilitator Guide, and the
   Incomplete toggle in Teacher's View stay there on purpose — this repo is
   public, so none of that content is copied in, only linked to.

   Set STAFF_DATA_URL to that site's deployed address, with a trailing
   slash. While it's empty, every link below renders as a disabled
   "not set up yet" pill instead of a broken link. */
(function () {
  var STAFF_DATA_URL = '';

  function url(path) {
    return STAFF_DATA_URL ? STAFF_DATA_URL.replace(/\/?$/, '/') + path : null;
  }

  function link(path, label, cls) {
    var href = url(path);
    if (!href) {
      return '<span class="' + cls + ' staff-ref-off" title="Staff reference site link not set up yet">' + label + '</span>';
    }
    return '<a class="' + cls + '" href="' + href + '" target="_blank" rel="noopener">' + label + '</a>';
  }

  window.STAFF_REF = {
    isSet: function () { return !!STAFF_DATA_URL; },
    teachersView: function (label, cls) { return link('index.html', label, cls); },
    guide: function (label, cls) { return link('guide/index.html', label, cls); },
    answerKey: function (group, label, cls) { return link('answer-keys/' + group + '/index.html', label, cls); },
    feedback: function (group, kid, week, label, cls) {
      return link('feedback/index.html?group=' + encodeURIComponent(group) +
        '&kid=' + encodeURIComponent(kid) + '&week=' + encodeURIComponent(week), label, cls);
    }
  };
})();
