/* Staff — review one Riser's quest report before it's shared.
   ?kid=<slug>&week=<week key>

   Shows the exact report card the Riser and their family will see
   (dashboard/report-card.js), with the three notes — Strength, Growth,
   Next step — editable above it. Notes start as an auto-draft from the
   quest data; edits save automatically. Nothing reaches the Riser until
   "Share" is switched on (saved in the "<week>-report" record). */
(function () {
  var QD = window.QUEST_DATA;
  var QR = window.QUEST_REPORT;
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function staffName() {
    try { return localStorage.getItem('rj-staff-name') || ''; } catch (e) { return ''; }
  }

  function render(kid, w) {
    var parts = String(w.label).split(' · ');
    var title = parts.length > 1 ? parts.slice(1).join(' · ') : w.label;
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="index.html?kid=' + kid.slug + '">&larr; ' + kid.name + '</a>'));
    app.appendChild(el('header', 'hd-page-head',
      '<p class="hd-eyebrow">' + (parts.length > 1 ? parts[0] + ' &middot; ' : '') + 'Quest report &middot; ' + kid.name + '</p>' +
      '<h1>' + title + '</h1>'));
    var body = el('div', 'rv-body', '<p class="rc-muted">Loading…</p>');
    app.appendChild(body);

    Promise.all([
      QD.fetchWeekState(w.group, kid.slug, w.key),
      QD.fetchRating(w.group, kid.slug, w.key),
      QR.fetchReport(w.group, kid.slug, w.key),
      QR.fetchBuildPhotos(w.group, kid.slug, w.key),
      QR.fetchBuildVideo(w.group, kid.slug, w.key)
    ]).then(function (r) {
      body.innerHTML = '';
      if (!r[0].ok || !r[2].ok) {
        body.appendChild(el('p', 'rep-load-warning', 'Couldn’t load this quest just now. Refresh to try again.'));
        return;
      }
      var summary = QD.summarizeWeek(w, r[0].state);
      var started = summary.status !== 'not-started';
      var report = Object.assign({ shared: false, buildNotes: [] }, r[2].report || {});
      var slots = r[3].slots.slice(); // one entry per picture slot, '' when empty
      var video = r[4];               // { supported, url }
      var model = QR.build(w, r[0].state, r[1], report);
      var rated = !!(r[1] && r[1].scores && Object.keys(r[1].scores).length);
      var draft = QR.draftNotes(model, report.buildNotes);
      ['strength', 'growth', 'next'].forEach(function (k) { if (typeof report[k] !== 'string') report[k] = draft[k]; });

      if (summary.status === 'in-progress') {
        body.appendChild(el('p', 'hd-card rv-note', kid.name + ' didn’t finish this quest (' + summary.pct + '% done). The report covers the parts done, and tells ' + kid.name + ' it isn’t finished.'));
      } else if (!started) {
        body.appendChild(el('p', 'hd-card rv-note', kid.name + ' hasn’t started this quest, so there’s nothing to report yet.'));
      }

      var panel = el('div', 'hd-card rv-panel');
      panel.innerHTML =
        '<div class="rv-fields">' +
          field('strength', 'Strength') + field('growth', 'Growth') + field('next', 'Next step') +
        '</div>' +
        (model.cats.build && model.cats.build.band < 3
          ? '<fieldset class="rv-reasons"><legend>Why the build isn’t finished <small>Shown on the Build card, and updates the Growth and Next step drafts</small></legend>' +
              QR.BUILD_NOTES.map(function (n) {
                return '<label><input type="checkbox" value="' + n.key + '"' + (report.buildNotes.indexOf(n.key) !== -1 ? ' checked' : '') + '> ' + n.label + '</label>';
              }).join('') + '</fieldset>'
          : '') +
        (!rated || report.presentationUndone
          ? '<label class="rv-check"><input type="checkbox" class="rv-no-present"' + (report.presentationUndone ? ' checked' : '') + '> ' + kid.name + ' didn’t present <small>Shows Presentation as Undone</small></label>'
          : '') +
        '<div class="rv-lost">' +
          '<label class="rv-check"><input type="checkbox" class="rv-lost-input"' + (report.dataLost ? ' checked' : '') + '> Some of ' + kid.name + '’s saved progress was lost <small>Tells the family; missing work shows as Not recorded, not Undone, and time on task is hidden</small></label>' +
        '</div>' +
        (w.buildTotal
          ? '<label class="rv-lost-build">Build steps finished <select class="rv-build-done"><option value="">Automatic</option>' +
                Array.apply(null, Array(w.buildTotal + 1)).map(function (_, i) {
                  return '<option value="' + i + '"' + (report.buildDone === i ? ' selected' : '') + '>' + i + ' of ' + w.buildTotal + '</option>';
                }).join('') + '</select><small>Automatic: all of them when there’s a build picture or video, otherwise the steps ticked on the quest.</small></label>' +
            '<label class="rv-build-name"><span class="rv-photo-label">Build name</span>' +
              '<input type="text" maxlength="80" placeholder="What did ' + kid.name + ' build?"></label>' +
            '<div class="rv-photo"><span class="rv-photo-label">Build pictures <small>Optional, up to ' + QR.PHOTO_SLOTS + '. Shown on the Build card; leave empty if there are none.</small></span>' +
              '<div class="rv-photo-row"><span class="rv-photo-thumbs"></span><span class="rv-photo-empty">No pictures yet</span>' +
              '<label class="eot2-btn eot2-btn-secondary rv-photo-pick"><span>Add pictures</span><input type="file" accept="image/*" multiple hidden></label>' +
              '<span class="rv-photo-msg"></span></div></div>' +
            '<div class="rv-video"><span class="rv-photo-label">Build video <small>Optional, one per quest, up to 25 MB (MP4 or MOV).</small></span>' +
              '<div class="rv-photo-row"><span class="rv-video-state"></span>' +
              '<label class="eot2-btn eot2-btn-secondary rv-video-pick"><span>Upload video</span><input type="file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.m4v,.webm" hidden></label>' +
              '<button type="button" class="rv-video-remove">Remove video</button>' +
              '<span class="rv-video-msg"></span></div></div>'
          : '') +
        '<div class="rv-bar">' +
          '<button type="button" class="eot2-btn eot2-btn-secondary rv-redraft">Redraft from quest data</button>' +
          '<span class="rv-status"></span>' +
          '<label class="cs-switch rv-share"><input type="checkbox" class="rv-share-input"><span class="cs-switch-ui" aria-hidden="true"></span>' +
            '<span class="cs-share-text"><strong>Share with ' + kid.name + ' and family</strong><span></span></span></label>' +
        '</div>';
      body.appendChild(panel);
      body.appendChild(el('h2', 'rv-preview-title', 'What ' + kid.name + ' and their family will see'));
      var preview = el('div', 'rv-preview');
      body.appendChild(preview);

      function field(key, label) {
        return '<label class="rv-field"><span>' + label + '</span><textarea rows="4" data-k="' + key + '"></textarea></label>';
      }
      var boxes = panel.querySelectorAll('textarea');
      Array.prototype.forEach.call(boxes, function (t) { t.value = report[t.getAttribute('data-k')]; });
      var shareInput = panel.querySelector('.rv-share-input');
      shareInput.checked = !!report.shared;

      function paint() {
        preview.innerHTML = QR.render(model, report, { questHref: '../../' + w.path.replace(/^\.\.\//, '') + '?fac=1', photos: slots.filter(Boolean), video: video.url });
        paintPhoto();
        paintVideo();
        shareInput.disabled = !started && !report.shared;
        panel.querySelector('.cs-share-text span').textContent = report.shared
          ? 'Visible on ' + kid.name + '’s Quests page.'
          : started ? 'Not visible to ' + kid.name + ' yet.' : 'Available once the quest is started.';
      }

      var timer = null;
      var status = panel.querySelector('.rv-status');
      function save(now) {
        status.textContent = 'Saving…';
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          report.by = staffName();
          report.at = new Date().toISOString();
          QR.saveReport(w.group, kid.slug, w.key, report).then(function (res) {
            status.textContent = res.ok ? 'Saved' : 'Not saved — check connection';
          });
        }, now ? 0 : 800);
      }

      Array.prototype.forEach.call(boxes, function (t) {
        t.addEventListener('input', function () { report[t.getAttribute('data-k')] = t.value.trim(); paint(); save(); });
      });
      panel.querySelector('.rv-redraft').addEventListener('click', function () {
        Array.prototype.forEach.call(boxes, function (t) { t.value = draft[t.getAttribute('data-k')]; report[t.getAttribute('data-k')] = t.value; });
        paint(); save();
      });
      Array.prototype.forEach.call(panel.querySelectorAll('.rv-reasons input'), function (cb) {
        cb.addEventListener('change', function () {
          report.buildNotes = Array.prototype.filter.call(panel.querySelectorAll('.rv-reasons input'), function (x) { return x.checked; })
            .map(function (x) { return x.value; });
          draft = QR.draftNotes(model, report.buildNotes);
          Array.prototype.forEach.call(boxes, function (t) {
            var k = t.getAttribute('data-k');
            if (k === 'growth' || k === 'next') { t.value = draft[k]; report[k] = draft[k]; }
          });
          paint(); save();
        });
      });
      var noPresent = panel.querySelector('.rv-no-present');
      if (noPresent) noPresent.addEventListener('change', function () {
        report.presentationUndone = noPresent.checked;
        model = QR.build(w, r[0].state, r[1], report);
        draft = QR.draftNotes(model, report.buildNotes);
        Array.prototype.forEach.call(boxes, function (t) {
          var k = t.getAttribute('data-k');
          if (k === 'growth' || k === 'next') { t.value = draft[k]; report[k] = draft[k]; }
        });
        paint(); save();
      });
      // ---- build picture ----
      var photoBox = panel.querySelector('.rv-photo');
      function paintPhoto() {
        if (!photoBox) return;
        var thumbs = photoBox.querySelector('.rv-photo-thumbs');
        thumbs.innerHTML = '';
        slots.forEach(function (img, i) {
          if (!img) return;
          var t = el('span', 'rv-photo-tile', '<img alt="Build picture ' + (i + 1) + '"><button type="button">Remove</button>');
          t.querySelector('img').src = img;
          t.querySelector('button').addEventListener('click', function () {
            if (window.confirm('Remove this build picture?')) storeAt(i, '');
          });
          thumbs.appendChild(t);
        });
        var count = slots.filter(Boolean).length;
        photoBox.querySelector('.rv-photo-empty').hidden = count > 0;
        photoBox.querySelector('.rv-photo-pick').hidden = count >= slots.length;
      }
      function photoMsg(t) { photoBox.querySelector('.rv-photo-msg').textContent = t; }
      function storeAt(i, img) {
        photoMsg(img ? 'Saving…' : 'Removing…');
        return QR.saveBuildPhoto(w.group, kid.slug, w.key, i, img, staffName()).then(function (res) {
          if (!res.ok) { photoMsg('Not saved — check connection and try again.'); return false; }
          slots[i] = img; photoMsg(img ? 'Saved' : 'Removed');
          if (syncMediaFlag()) save(); else paint();
          return true;
        });
      }
      if (photoBox) {
        photoBox.querySelector('input[type=file]').addEventListener('change', function () {
          var files = Array.prototype.slice.call(this.files || []);
          this.value = '';
          var free = slots.map(function (img, i) { return img ? -1 : i; }).filter(function (i) { return i >= 0; });
          if (files.length > free.length) photoMsg('Only ' + free.length + ' more picture' + (free.length === 1 ? '' : 's') + ' fit; adding the first ' + free.length + '.');
          files = files.slice(0, free.length);
          // One at a time, each into the next empty slot.
          files.reduce(function (chain, file, n) {
            return chain.then(function () {
              photoMsg('Preparing ' + (n + 1) + ' of ' + files.length + '…');
              return shrinkImage(file).then(function (img) { return storeAt(free[n], img); },
                function () { photoMsg('Couldn’t read “' + file.name + '”. Try a JPG or PNG.'); });
            });
          }, Promise.resolve());
        });
      }

      // ---- build video ----
      var videoBox = panel.querySelector('.rv-video');
      var VIDEO_MAX = 25 * 1024 * 1024;
      function videoMsg(t) { videoBox.querySelector('.rv-video-msg').textContent = t; }
      function paintVideo() {
        if (!videoBox) return;
        var pick = videoBox.querySelector('.rv-video-pick');
        var remove = videoBox.querySelector('.rv-video-remove');
        var state = videoBox.querySelector('.rv-video-state');
        if (!video.supported) {
          state.textContent = 'Video upload needs the progress service update first.';
          pick.hidden = true; remove.hidden = true;
          return;
        }
        state.textContent = video.url ? 'Video added' : 'No video yet';
        pick.hidden = !!video.url;
        remove.hidden = !video.url;
      }
      function refreshVideo() {
        return QR.fetchBuildVideo(w.group, kid.slug, w.key).then(function (v) {
          video = v;
          if (syncMediaFlag()) save(); else paint();
        });
      }
      if (videoBox) {
        videoBox.querySelector('input[type=file]').addEventListener('change', function () {
          var file = this.files && this.files[0];
          this.value = '';
          if (!file) return;
          if (file.size > VIDEO_MAX) { videoMsg('That video is ' + Math.round(file.size / 1048576) + ' MB; the limit is 25 MB. Trim it or send it at a lower quality.'); return; }
          videoMsg('Uploading… 0%');
          QR.uploadBuildVideo(w.group, kid.slug, w.key, file, function (f) { videoMsg('Uploading… ' + Math.round(f * 100) + '%'); })
            .then(function (res) {
              if (!res.ok) {
                videoMsg(res.error === 'unsupported file type' ? 'Use an MP4 or MOV video.' : res.error === 'file too large' ? 'That video is over 25 MB.' : 'Not uploaded — check connection and try again.');
                return;
              }
              videoMsg('Saved');
              refreshVideo();
            });
        });
        videoBox.querySelector('.rv-video-remove').addEventListener('click', function () {
          if (!window.confirm('Remove this build video?')) return;
          videoMsg('Removing…');
          QR.deleteBuildVideo(w.group, kid.slug, w.key).then(function (res) {
            if (!res.ok) { videoMsg('Not removed — check connection and try again.'); return; }
            videoMsg('Removed');
            refreshVideo();
          });
        });
      }

      // ---- build name ----
      var nameInput = panel.querySelector('.rv-build-name input');
      if (nameInput) {
        nameInput.value = report.buildName || w.buildName || '';
        nameInput.addEventListener('input', function () {
          var v = nameInput.value.trim();
          if (v && v !== w.buildName) report.buildName = v; else delete report.buildName;
          model = QR.build(w, r[0].state, r[1], report);
          paint(); save();
        });
      }

      // Rebuild the card after a fact changes; Growth / Next step follow the
      // new draft only if they still read as the old draft (never overwrite
      // what staff wrote).
      function rescore() {
        var old = draft;
        model = QR.build(w, r[0].state, r[1], report);
        draft = QR.draftNotes(model, report.buildNotes);
        Array.prototype.forEach.call(boxes, function (t) {
          var k = t.getAttribute('data-k');
          if ((k === 'growth' || k === 'next') && report[k] === old[k]) { t.value = draft[k]; report[k] = draft[k]; }
        });
        paint();
      }

      var lostInput = panel.querySelector('.rv-lost-input');
      lostInput.addEventListener('change', function () {
        report.dataLost = lostInput.checked;
        rescore(); save();
      });
      var buildDoneSel = panel.querySelector('.rv-build-done');
      if (buildDoneSel) buildDoneSel.addEventListener('change', function () {
        if (buildDoneSel.value === '') delete report.buildDone; else report.buildDone = parseInt(buildDoneSel.value, 10);
        rescore(); save();
      });

      // A build picture or video means the build was made: record that on
      // the report (hasBuildMedia), so every page scores it the same way.
      function syncMediaFlag() {
        var has = slots.some(Boolean) || !!video.url;
        if (!!report.hasBuildMedia === has) return false;
        if (has) report.hasBuildMedia = true; else delete report.hasBuildMedia;
        rescore();
        return true;
      }
      if (syncMediaFlag()) save();
      shareInput.addEventListener('change', function () {
        report.shared = shareInput.checked;
        paint(); save(true);
      });
      paint();
    });
  }

  // A saved record holds about 200 KB, so a phone photo is scaled down and
  // re-encoded as JPEG until it fits (and still looks good on a report).
  var PHOTO_MAX_CHARS = 180000;
  function shrinkImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var edge = 1400, quality = 0.85, out = '';
        for (var i = 0; i < 12; i++) {
          var scale = Math.min(1, edge / Math.max(img.naturalWidth, img.naturalHeight));
          canvas.width = Math.round(img.naturalWidth * scale);
          canvas.height = Math.round(img.naturalHeight * scale);
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          out = canvas.toDataURL('image/jpeg', quality);
          if (out.length <= PHOTO_MAX_CHARS) return resolve(out);
          if (quality > 0.6) quality -= 0.1; else edge = Math.round(edge * 0.8);
        }
        reject(new Error('too large'));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('unreadable')); };
      img.src = url;
    });
  }

  function init() {
    var kid = window.EOT2_findKid(params.get('kid'));
    var weeks = kid && window.DASHBOARD_ROSTER[kid.slug] ? window.DASHBOARD_ROSTER[kid.slug].weeks : [];
    var w = weeks.filter(function (x) { return x.key === params.get('week'); })[0];
    if (!kid || !w) { location.replace('index.html' + (kid ? '?kid=' + kid.slug : '')); return; }
    render(kid, w);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
