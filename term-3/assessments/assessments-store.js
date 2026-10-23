/* Term 3 Assessments — papers uploaded from the staff portal.

   Kept in the worker under group term-3, kid staff:
     asmt-papers           { items: { <id>: { title, subject, grade, covering,
                             kids: [slug…], pages, by, at, u, off } } }
     asmt-paper-<id>       the paper: details, sections and question numbers,
                           the page each question is on, which pages Risers
                           see, each item's kind and answer fingerprints
                           (as in assessments-mark.js), and the readable
                           key locked with the facilitator PIN (enc).
     asmt-page-<id>-<n>    { img } page n of a PDF as a picture.
     asmt-html-<id>-<k>    { blocks: { <n>: html } } a Word paper's
                           questions, a few to a record (htmlChunks says
                           how many records).
   A Riser's answers and marks use the same records as the other papers. */
(function () {
  var G = 'term-3', K = 'staff';
  var pageCache = {};

  function fetchIndex() {
    return window.eot2Fetch(G, K, 'asmt-papers').then(function (r) { return (r && r.state && r.state.items) || {}; });
  }
  // Merges one paper's entry into the newest copy of the list.
  function saveIndexItem(id, fields) {
    return fetchIndex().then(function (items) {
      items[id] = Object.assign({}, items[id] || {}, fields, { u: Date.now() });
      return window.eot2Save(G, K, 'asmt-papers', { items: items }).then(function (r) { return r.ok; });
    });
  }
  // A Word paper comes back with its questions' HTML in paper.html.
  function fetchPaper(id) {
    return window.eot2Fetch(G, K, 'asmt-paper-' + id).then(function (r) {
      var p = r && r.state && r.state.id ? r.state : null;
      if (!p || !p.htmlChunks) return p;
      var jobs = [];
      for (var i = 0; i < p.htmlChunks; i++) jobs.push(window.eot2Fetch(G, K, 'asmt-html-' + id + '-' + i));
      return Promise.all(jobs).then(function (rs) {
        p.html = {};
        rs.forEach(function (x) { Object.assign(p.html, (x && x.state && x.state.blocks) || {}); });
        return p;
      });
    });
  }
  function saveHtml(id, k, blocks) {
    return window.eot2Save(G, K, 'asmt-html-' + id + '-' + k, { blocks: blocks }).then(function (r) { return r.ok; });
  }
  function savePaper(paper) {
    return window.eot2Save(G, K, 'asmt-paper-' + paper.id, paper).then(function (r) { return r.ok; });
  }
  function fetchPage(id, n) {
    var k = id + '-' + n;
    if (!pageCache[k]) pageCache[k] = window.eot2Fetch(G, K, 'asmt-page-' + k).then(function (r) { return (r && r.state && r.state.img) || ''; });
    return pageCache[k];
  }
  function savePage(id, n, img) {
    return window.eot2Save(G, K, 'asmt-page-' + id + '-' + n, { img: img }).then(function (r) { return r.ok; });
  }

  /* The readable key, locked with the facilitator PIN (AES-GCM, key from
     PBKDF2), so it isn't in plain sight in the paper record. */
  function b64(buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))); }
  function unb64(s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); }
  function aesKey(pin, salt) {
    return crypto.subtle.importKey('raw', new TextEncoder().encode('lifehub-t3-key|' + pin), 'PBKDF2', false, ['deriveKey']).then(function (base) {
      return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: 150000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    });
  }
  function lock(obj, pin) {
    var salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    return aesKey(pin, salt).then(function (k) {
      return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, k, new TextEncoder().encode(JSON.stringify(obj)));
    }).then(function (data) { return { salt: b64(salt), iv: b64(iv), data: b64(data) }; });
  }
  // Resolves to the key, or null if the PIN is wrong.
  function unlock(enc, pin) {
    return aesKey(pin, unb64(enc.salt)).then(function (k) {
      return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(enc.iv) }, k, unb64(enc.data));
    }).then(function (buf) { return JSON.parse(new TextDecoder().decode(buf)); }, function () { return null; });
  }

  window.T3_store = {
    fetchIndex: fetchIndex, saveIndexItem: saveIndexItem,
    fetchPaper: fetchPaper, savePaper: savePaper,
    fetchPage: fetchPage, savePage: savePage, saveHtml: saveHtml,
    lock: lock, unlock: unlock
  };
})();
