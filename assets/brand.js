/* LifeHub site chrome — the header (logo + "Risers Journey") and footer
   shared by every page. Paths are worked out from this script's own URL,
   so the same tag works at any folder depth. Add data-area="staff" on the
   script tag for staff pages: the logo then links to Staff home and a
   "Staff" tag shows on the right. */
(function () {
  var script = document.currentScript;
  var assets = script.src.replace(/[^/]*$/, '');
  var root = assets.replace(/assets\/$/, '');
  var isStaff = script.getAttribute('data-area') === 'staff';

  var icon = document.createElement('link');
  icon.rel = 'icon';
  icon.href = assets + 'lifehub-mark.png';
  document.head.appendChild(icon);

  function build() {
    var header = document.createElement('header');
    header.className = 'lh-header';
    header.innerHTML =
      '<div class="lh-header-inner">' +
        '<a class="lh-brand" href="' + root + (isStaff ? 'staff/index.html' : 'index.html') + '">' +
          '<img src="' + assets + 'lifehub-logo.png" alt="LifeHub — A Homeschooling Cooperative">' +
          '<span class="lh-brand-divider"></span>' +
          '<span class="lh-brand-title"><small>Term 2</small>Risers Journey</span>' +
        '</a>' +
        (isStaff ? '<span class="lh-header-tag">Staff</span>' : '') +
      '</div>';
    document.body.insertBefore(header, document.body.firstChild);

    var footer = document.createElement('footer');
    footer.className = 'lh-footer';
    footer.innerHTML =
      '<div class="lh-footer-inner">' +
        '<span><strong>LifeHub</strong> &middot; A Homeschooling Cooperative</span>' +
        '<span>Connect<span class="lh-dot">&bull;</span>Create<span class="lh-dot">&bull;</span>Cultivate</span>' +
      '</div>';
    document.body.appendChild(footer);
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
