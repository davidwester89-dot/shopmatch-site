// ShopMatch: leest de antwoorden, rekent met ./lib/match.js en toont de top 3. Niets verlaat de browser.
import { score, compleet, VRAGEN } from './lib/match.js';
import { PLATFORMS } from './lib/platforms.js';
import { knop } from './lib/partnerlinks.js';

const BASE = document.body.dataset.base || '';
const form = document.getElementById('form');
const out = document.getElementById('result');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n) => (n === 0 ? '€ 0' : '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }));

function antwoorden() {
  const fd = new FormData(form); const a = {};
  for (const v of VRAGEN) if (fd.get(v.id)) a[v.id] = fd.get(v.id);
  return a;
}

function toon(a) {
  const top = score(a).slice(0, 3);
  out.innerHTML = '<h2>Jouw match</h2>' + top.map((r, i) => {
    const p = PLATFORMS[r.id];
    return `<div class="card${i === 0 ? ' first' : ''}">${i === 0 ? '<span class="badge">Beste match</span>' : ''}<h3>${esc(p.naam)}</h3><p>${esc(p.kort)}</p>`
      + `<p><strong>${a.doel === 'site' ? 'Vanaf' : 'Verkopen vanaf'} ${fmt(r.prijs)} per maand.</strong></p>`
      + (r.waarom.length ? `<ul>${r.waarom.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : '')
      + `<div class="out">${knop(r.id, 'match_' + (i + 1))}<a class="btn ghost small" href="${BASE}/platformen/${p.slug}/">Meer over ${esc(p.naam)}</a></div></div>`;
  }).join('') + `<p><a href="${BASE}/vergelijken/">Alle platforms naast elkaar</a></p>`;
  out.hidden = false;
  out.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const a = antwoorden();
  if (!compleet(a)) {
    const open = VRAGEN.find((v) => !a[v.id]);
    const el = form.querySelector(`input[name="${open.id}"]`);
    if (el) el.focus();
    out.hidden = false; out.innerHTML = `<p class="note">Beantwoord nog: ${esc(open.vraag)}</p>`;
    return;
  }
  toon(a);
});
