/* Term 3 Assessments — reading a Word (.docx) paper in the browser.

   Word equations (fractions above all) are first written out as text,
   {2/9} for a stacked fraction, ^{2} and _{2} for raised and lowered
   text, because the converter (mammoth) leaves equations out. The
   document then becomes HTML, and is cut into one piece per question:
   T3_readDocx(file) resolves to { lines, blocks: { <n>: html }, notes }.
   lines is the whole text, for T3_parse; blocks holds what Risers see
   for each question. Nothing from the answer key on is kept in blocks. */
(function () {
  var LIBS = {
    jszip: ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'],
    mammoth: ['https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js', 'https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js']
  };
  var M = 'http://schemas.openxmlformats.org/officeDocument/2006/math';
  var W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

  // Loads a script, trying each address in turn.
  function load(urls, ready) {
    if (ready()) return Promise.resolve();
    return urls.reduce(function (p, url) {
      return p.catch(function () {
        return new Promise(function (resolve, reject) {
          var s = document.createElement('script');
          s.src = url;
          s.onload = function () { if (ready()) resolve(); else reject(); };
          s.onerror = reject;
          document.head.appendChild(s);
        });
      });
    }, Promise.reject());
  }

  /* ---------- equations as text ---------- */

  function kids(node, name) { return Array.prototype.filter.call(node.childNodes, function (c) { return c.localName === name; }); }
  function val(node, name) {
    var pr = node.getElementsByTagNameNS(M, name)[0];
    return pr ? pr.getAttributeNS(M, 'val') || pr.getAttribute('m:val') : null;
  }
  function lin(node) {
    if (!node || node.nodeType !== 1) return '';
    var all = function (n) { return Array.prototype.map.call(n.childNodes, lin).join(''); };
    var part = function (name) { var k = kids(node, name)[0]; return k ? all(k) : ''; };
    switch (node.localName) {
      case 't': return node.textContent;
      case 'f': return '{' + part('num') + '/' + part('den') + '}';
      case 'sSup': return part('e') + '^{' + part('sup') + '}';
      case 'sSub': return part('e') + '_{' + part('sub') + '}';
      case 'sSubSup': return part('e') + '_{' + part('sub') + '}^{' + part('sup') + '}';
      case 'rad': return '√(' + part('e') + ')';
      case 'd': {
        var dpr = kids(node, 'dPr')[0];
        var beg = dpr && val(dpr, 'begChr'), end = dpr && val(dpr, 'endChr');
        return (beg == null ? '(' : beg) + kids(node, 'e').map(all).join(', ') + (end == null ? ')' : end);
      }
      case 'rPr': case 'ctrlPr': case 'fPr': case 'dPr': case 'radPr': case 'deg': case 'sSupPr': case 'sSubPr': case 'naryPr': return '';
      default: return all(node);
    }
  }
  function textRun(doc, text) {
    var r = doc.createElementNS(W, 'w:r'), t = doc.createElementNS(W, 'w:t');
    t.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
    t.textContent = text;
    r.appendChild(t);
    return r;
  }
  function flattenMath(xml) {
    var doc = new DOMParser().parseFromString(xml, 'application/xml');
    ['oMathPara', 'oMath'].forEach(function (name) {
      Array.prototype.slice.call(doc.getElementsByTagNameNS(M, name)).forEach(function (m) {
        if (m.parentNode) m.parentNode.replaceChild(textRun(doc, ' ' + lin(m).trim() + ' '), m);
      });
    });
    return new XMLSerializer().serializeToString(doc);
  }

  /* ---------- pictures ---------- */

  // Big pictures are made smaller, so each fits in a record.
  function shrink(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        if (img.width <= 800 && src.length < 120000) return resolve(src);
        var w = Math.min(800, img.width), h = Math.round(img.height * w / img.width);
        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = function () { resolve(''); };
      img.src = src;
    });
  }

  /* ---------- safe HTML ---------- */

  var KEEP = { P: 1, STRONG: 1, B: 1, EM: 1, I: 1, U: 1, SUB: 1, SUP: 1, BR: 1, TABLE: 1, TBODY: 1, THEAD: 1, TR: 1, TD: 1, TH: 1, UL: 1, OL: 1, LI: 1, IMG: 1 };
  // Only plain formatting, tables, lists and pictures are kept.
  function safe(node, into) {
    Array.prototype.forEach.call(node.childNodes, function (c) {
      if (c.nodeType === 3) { into.appendChild(document.createTextNode(c.textContent)); return; }
      if (c.nodeType !== 1) return;
      var tag = c.tagName;
      if (/^H[1-6]$/.test(tag)) { var p = document.createElement('p'), b = document.createElement('strong'); p.appendChild(b); safe(c, b); into.appendChild(p); return; }
      if (!KEEP[tag]) { safe(c, into); return; }
      var e = document.createElement(tag.toLowerCase());
      if (tag === 'IMG') {
        var src = c.getAttribute('src') || '';
        if (!/^data:image\/(png|jpe?g|gif|webp);/i.test(src)) return;
        e.src = src;
        e.alt = '';
      }
      if ((tag === 'TD' || tag === 'TH')) ['colspan', 'rowspan'].forEach(function (a) { if (c.getAttribute(a)) e.setAttribute(a, String(+c.getAttribute(a) || 1)); });
      safe(c, e);
      into.appendChild(e);
    });
    return into;
  }
  // {2/9} as a stacked fraction, ^{2} raised, _{2} lowered.
  function mathHtml(html) {
    return html
      .replace(/\{([^{}\/<>]+)\/([^{}<>]+)\}/g, '<span class="as-fr"><span>$1</span><span>$2</span></span>')
      .replace(/\^\{([^{}<>]*)\}/g, '<sup>$1</sup>')
      .replace(/_\{([^{}<>]*)\}/g, '<sub>$1</sub>');
  }
  // The text the reader sees: 2{1/3} is 2 1/3.
  function plain(t) {
    return t.replace(/(\d)\s*\{/g, '$1 {').replace(/\{([^{}\/]+)\/([^{}]+)\}/g, '$1/$2').replace(/\^\{([^{}]*)\}/g, '^$1').replace(/_\{([^{}]*)\}/g, '$1').replace(/\s+/g, ' ').trim();
  }
  function elLines(e) {
    var ps = e.querySelectorAll ? e.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6') : [];
    var src = ps.length ? Array.prototype.map.call(ps, function (p) { return p.textContent; }) : [e.textContent];
    return src.map(plain).filter(Boolean);
  }
  // Drops the question's own number ("4.  ") from the start of its piece.
  function dropNumber(e) {
    var w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), t;
    while ((t = w.nextNode())) {
      if (!t.textContent.trim()) continue;
      t.textContent = t.textContent.replace(/^\s*\d{1,3}\s*[.)]\s*/, '');
      return;
    }
  }

  window.T3_readDocx = function (file, progress) {
    progress('Opening the Word file…');
    return Promise.all([
      load(LIBS.jszip, function () { return !!window.JSZip; }),
      load(LIBS.mammoth, function () { return !!window.mammoth; }),
      file.arrayBuffer()
    ]).then(function (r) {
      return window.JSZip.loadAsync(r[2]);
    }).then(function (zip) {
      var f = zip.file('word/document.xml');
      if (!f) throw new Error('not a docx');
      return f.async('string').then(function (xml) {
        zip.file('word/document.xml', flattenMath(xml));
        return zip.generateAsync({ type: 'arraybuffer' });
      });
    }).then(function (buf) {
      progress('Reading the questions…');
      return window.mammoth.convertToHtml({ arrayBuffer: buf }, {
        convertImage: window.mammoth.images.imgElement(function (image) {
          return image.read('base64').then(function (b64) { return shrink('data:' + image.contentType + ';base64,' + b64); }).then(function (src) { return { src: src }; });
        })
      });
    }).then(function (res) {
      var R = window.T3_parseRules;
      var doc = new DOMParser().parseFromString('<div>' + res.value + '</div>', 'text/html');
      var top = doc.body.firstChild.children;
      // A question ends at a repeat of the paper's heading line, or at a
      // results or feedback form (the site has its own).
      var STOP = /^(my\s+results|scores\s+by\s+objective|what\s+i['’]?ve\s+learn|feedback\s+form|self[-\s]?assessment)/i;
      var lines = [], blocks = {}, cur = null, next = 1, inKey = false, band = null;
      Array.prototype.forEach.call(top, function (e) {
        var ls = elLines(e);
        lines = lines.concat(ls);
        if (inKey) return;
        if (ls.some(function (l) { return R.KEYHEAD.test(l); })) { inKey = true; return; }
        if (ls.some(function (l) { return R.SECTION.test(l); })) return;
        if (next === 1 && !band) band = ls.filter(function (l) { return /•/.test(l); })[0] || null;
        if (next > 1 && ls.some(function (l) { return l === band || STOP.test(l); })) { cur = null; return; }
        var m = ls[0] && R.QNUM.exec(ls[0]);
        if (m && +m[1] === next) { cur = blocks[next] = document.createElement('div'); next++; }
        else if (!cur) return;
        // Answer lines are left out: the answer boxes take their place.
        if (ls.length && ls.every(function (l) { return /^(answer\s*:?)?[\s_.…]*$/i.test(l); })) return;
        var piece = safe({ childNodes: [e] }, document.createElement('div'));
        if (m && blocks[+m[1]] === cur && !cur.childNodes.length) dropNumber(piece);
        while (piece.firstChild) cur.appendChild(piece.firstChild);
      });
      var out = {};
      Object.keys(blocks).forEach(function (n) { out[n] = mathHtml(blocks[n].innerHTML); });
      var notes = [];
      if (!Object.keys(out).length) notes.push('No numbered questions were found. Type the numbers (1. 2. 3.) rather than using Word’s automatic numbering, or save it as a PDF and upload that.');
      return { lines: lines, blocks: out, notes: notes };
    });
  };
})();
