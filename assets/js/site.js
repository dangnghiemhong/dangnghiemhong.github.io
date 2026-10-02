/* Site behaviour. Everything here is progressive enhancement: the site is fully readable without it.
   Sections: theme · header · prose (anchors, TOC, tables, code, tasks, math) · copy buttons · filter */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ── Theme toggle ─────────────────────────────────────────────────────── */
  (function theme() {
    var btn = $('[data-theme-toggle]');
    if (!btn) return;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var isDark = function () { return root.dataset.theme ? root.dataset.theme === 'dark' : mq.matches; };
    var sync = function () { btn.setAttribute('aria-pressed', String(isDark())); };
    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next; store.set('theme', next); sync();
    });
    if (mq.addEventListener) mq.addEventListener('change', sync);
    sync();
  })();

  /* ── Header: hairline appears once the page scrolls ───────────────────── */
  (function header() {
    var h = $('.site-header');
    if (!h) return;
    var on = function () { h.classList.toggle('is-scrolled', window.scrollY > 4); };
    window.addEventListener('scroll', on, { passive: true }); on();
  })();

  /* ── Copy to clipboard ────────────────────────────────────────────────── */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.copy-btn');
    if (!btn) return;
    var pre = $('pre', btn.closest('.copyable'));
    if (!pre) return;
    copyText(pre.innerText.replace(/\n$/, '')).then(function () {
      var label = btn.textContent; btn.textContent = 'Copied'; btn.classList.add('is-done');
      setTimeout(function () { btn.textContent = label; btn.classList.remove('is-done'); }, 1600);
    }, function () { btn.textContent = 'Press Ctrl+C'; });
  });

  /* ── Prose enhancements (posts, projects) ─────────────────────────────── */
  $$('[data-prose]').forEach(function (prose) {
    /* Table of contents (built first, so heading anchors are not part of its labels) */
    var aside = $('[data-toc]');
    var heads = $$('h2[id], h3[id]', prose);
    if (aside && !aside.hasAttribute('data-toc-off') && heads.length >= 3) {
      var items = heads.map(function (h) {
        return '<li class="toc-' + h.tagName.toLowerCase() + '"><a href="#' + h.id + '">' +
          h.textContent.replace(/</g, '&lt;') + '</a></li>';
      }).join('');
      aside.innerHTML = '<details class="toc-details"><summary>On this page</summary><ol>' + items + '</ol></details>';
      aside.hidden = false;
      var details = $('details', aside);
      var wide = window.matchMedia('(min-width: 1100px)');
      var fit = function () { details.open = wide.matches; };
      fit(); if (wide.addEventListener) wide.addEventListener('change', fit);
      /* Scroll-spy */
      if ('IntersectionObserver' in window) {
        var links = {}; $$('a', aside).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
        var current = null;
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              if (current) current.removeAttribute('aria-current');
              current = links[en.target.id]; if (current) current.setAttribute('aria-current', 'location');
            }
          });
        }, { rootMargin: '-72px 0px -70% 0px' });
        heads.forEach(function (h) { io.observe(h); });
      }
    }

    /* Heading anchors */
    $$('h2[id], h3[id], h4[id]', prose).forEach(function (h) {
      var a = document.createElement('a');
      a.className = 'anchor'; a.href = '#' + h.id; a.textContent = '#';
      a.setAttribute('aria-label', 'Link to this section');
      h.appendChild(a);
    });

    /* Wide tables scroll inside a focusable region instead of breaking the layout */
    $$('table', prose).forEach(function (t) {
      var w = document.createElement('div');
      w.className = 'table-wrap';
      t.parentNode.insertBefore(w, t); w.appendChild(t);
      if (w.scrollWidth > w.clientWidth) { w.tabIndex = 0; w.setAttribute('role', 'region'); w.setAttribute('aria-label', 'Scrollable table'); }
    });

    /* Code blocks: header bar with language label + copy button */
    $$('div.highlighter-rouge', prose).forEach(function (block) {
      var cls = Array.prototype.find.call(block.classList, function (c) { return c.indexOf('language-') === 0; });
      var lang = cls ? cls.slice(9) : '';
      block.classList.add('copyable');
      var bar = document.createElement('div'); bar.className = 'code-bar';
      var l = document.createElement('span'); l.className = 'code-lang'; l.textContent = (lang && lang !== 'plaintext') ? lang : 'text';
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'copy-btn'; b.textContent = 'Copy'; b.setAttribute('aria-label', 'Copy code to clipboard');
      bar.appendChild(l); bar.appendChild(b); block.insertBefore(bar, block.firstChild);
      var pre = $('pre', block); if (pre && pre.scrollWidth > pre.clientWidth) pre.tabIndex = 0;
    });

    /* Markdown task lists become real, clickable checkboxes (state is remembered per page) */
    var boxes = $$('input.task-list-item-checkbox', prose);
    if (boxes.length) {
      var key = 'tasks:' + location.pathname, saved = [];
      try { saved = JSON.parse(store.get(key) || '[]'); } catch (e) {}
      boxes.forEach(function (box, i) {
        box.disabled = false; box.checked = box.checked || saved.indexOf(i) > -1;
        var li = box.parentNode;
        if (li.tagName === 'LI') {
          var label = document.createElement('label'), n = box.nextSibling;
          label.appendChild(box);
          while (n && !(n.nodeType === 1 && /^(UL|OL)$/.test(n.nodeName))) { var nx = n.nextSibling; label.appendChild(n); n = nx; }
          li.insertBefore(label, n);
        }
        box.addEventListener('change', function () {
          store.set(key, JSON.stringify(boxes.reduce(function (acc, b, j) { if (b.checked) acc.push(j); return acc; }, [])));
        });
      });
    }

    /* Math: kramdown (mathjax mode) emits \( … \) and \[ … \] */
    if (window.renderMathInElement) {
      window.renderMathInElement(prose, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    }
  });

  /* ── Filter: search box + tag buttons (blog, projects) ────────────────── */
  (function filter() {
    var bar = $('[data-filter]');
    if (!bar) return;
    var input = $('[data-filter-input]', bar);
    var buttons = $$('[data-filter-tag]', bar);
    var items = $$('[data-filter-item]');
    var groups = $$('[data-filter-group]');
    var status = $('[data-filter-status]', bar);
    var empty = $('[data-filter-empty]');
    var params = new URLSearchParams(location.search);
    var state = { q: params.get('q') || '', tag: params.get('tag') || '' };
    if (input) input.value = state.q;

    function apply() {
      var q = state.q.trim().toLowerCase(), shown = 0;
      items.forEach(function (it) {
        var tags = (it.getAttribute('data-tags') || '').split(' ');
        var ok = (!state.tag || tags.indexOf(state.tag) > -1) &&
                 (!q || (it.getAttribute('data-text') || '').indexOf(q) > -1);
        it.hidden = !ok; if (ok) shown++;
      });
      groups.forEach(function (g) { g.hidden = !$('[data-filter-item]:not([hidden])', g); });
      buttons.forEach(function (b) {
        var on = b.getAttribute('data-filter-tag') === state.tag;
        b.setAttribute('aria-pressed', String(on)); b.classList.toggle('is-on', on);
      });
      if (empty) empty.hidden = shown !== 0;
      if (status) status.textContent = (state.tag || q) ? shown + ' of ' + items.length + ' shown' : '';
      var p = new URLSearchParams();
      if (state.tag) p.set('tag', state.tag); if (q) p.set('q', state.q.trim());
      var qs = p.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }
    if (input) input.addEventListener('input', function () { state.q = input.value; apply(); });
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-filter-tag');
        state.tag = (state.tag === t) ? '' : t; apply();
      });
    });
    apply();
  })();
})();
