(function () {
'use strict';
var header = document.querySelector('.site-header');
var toggle = document.querySelector('.nav-toggle');
if (toggle && header) {
toggle.addEventListener('click', function () {
var open = header.classList.toggle('nav-open');
toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.site-nav a').forEach(function (a) {
a.addEventListener('click', function () { header.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); });
});
}
var widget = document.getElementById('app-widget');
if (!widget) return;
var PAIRS = [
{ a: 'btc', b: 'usdt', name: 'BTC / USDT' },
{ a: 'eth', b: 'usdt', name: 'ETH / USDT' },
{ a: 'bnb', b: 'usdt', name: 'BNB / USDT' }
];
var STRATS = (widget.getAttribute('data-strats') || 'Grid,DCA,Signal').split(',');
var TAGSUFFIX = widget.getAttribute('data-tagsuffix') || ' bot';
var nameEl = widget.querySelector('.pair-name');
var coinA = widget.querySelector('.pair-coins .ca');
var coinB = widget.querySelector('.pair-coins .cb');
var stratTag = widget.querySelector('.pair-tag');
var spark = widget.querySelector('.spark');
var trades = widget.querySelector('[data-trades]');
var pi = 0, si = 0;
function drawSpark() {
if (!spark) return;
spark.innerHTML = '';
var n = 22, h = 28;
for (var k = 0; k < n; k++) {
var bar = document.createElement('i');
h += (Math.random() - 0.46) * 16; h = Math.max(14, Math.min(100, h));
bar.style.height = h.toFixed(0) + '%'; spark.appendChild(bar);
}
}
function render() {
var p = PAIRS[pi];
if (nameEl) nameEl.textContent = p.name;
if (coinA) coinA.src = 'static/' + p.a + '.png';
if (coinB) coinB.src = 'static/' + p.b + '.png';
if (stratTag) stratTag.textContent = STRATS[si] + TAGSUFFIX;
if (trades) trades.textContent = (24 + Math.floor(Math.random() * 60));
drawSpark();
}
var pairBox = widget.querySelector('.bot-pair');
if (pairBox) pairBox.addEventListener('click', function (e) { if (e.target.closest('.pair-tag')) return; pi = (pi + 1) % PAIRS.length; render(); });
if (stratTag) {
stratTag.setAttribute('role', 'button'); stratTag.setAttribute('tabindex', '0');
stratTag.addEventListener('click', function (e) { e.stopPropagation(); si = (si + 1) % STRATS.length; render(); });
stratTag.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); si = (si + 1) % STRATS.length; render(); } });
}
render();
setInterval(drawSpark, 2600);
})();
