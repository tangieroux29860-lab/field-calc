/* @playground-icons v1 lucide:trending-up,lucide:circle,lucide:arrow-right,lucide:repeat-2,lucide:target,lucide:arrow-left */
(function () {
var ICONS = {"lucide:trending-up":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M16 7h6v6\"/><path d=\"m22 7l-8.5 8.5l-5-5L2 17\"/></g></svg>","lucide:circle":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"/></svg>","lucide:arrow-right":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 12h14m-7-7l7 7l-7 7\"/></svg>","lucide:repeat-2":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"m2 9l3-3l3 3\"/><path d=\"M13 18H7a2 2 0 0 1-2-2V6m17 9l-3 3l-3-3\"/><path d=\"M11 6h6a2 2 0 0 1 2 2v10\"/></g></svg>","lucide:target":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/></g></svg>","lucide:arrow-left":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m12 19l-7-7l7-7m7 7H5\"/></svg>"};
function esc(v) { return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function svg(name, opts) {
  opts = opts || {};
  var s = ICONS[name];
  if (!s) return '';
  var style = '';
  if (opts.size) style += 'width:' + esc(opts.size) + ';height:' + esc(opts.size) + ';';
  if (opts.color) style += 'color:' + esc(opts.color) + ';';
  var attrs = '';
  if (style) attrs += ' style="' + style + '"';
  if (opts.className) attrs += ' class="' + esc(opts.className) + '"';
  attrs += ' aria-hidden="true"';
  return s.replace('<svg', '<svg' + attrs);
}
function replace(root) {
  var nodes = (root || document).querySelectorAll('[data-icon]:not([data-icon-rendered])');
  for (var i = 0; i < nodes.length; i++) {
    var el = nodes[i];
    var name = el.getAttribute('data-icon');
    var markup = svg(name, { size: el.getAttribute('data-size'), color: el.getAttribute('data-color') });
    if (!markup) { console.warn('[icons] unknown icon "' + name + '" — pass it in the icons parameter'); continue; }
    el.innerHTML = markup;
    el.setAttribute('data-icon-rendered', '');
    if (!el.style.display) el.style.display = 'inline-flex';
  }
}
window.icons = { data: ICONS, names: Object.keys(ICONS), svg: svg, replace: replace };
function boot() {
  replace(document);
  if (window.MutationObserver) {
    new MutationObserver(function () { replace(document); }).observe(document.documentElement, { childList: true, subtree: true });
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();