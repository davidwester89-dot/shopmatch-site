// ShopMatch: leest de antwoorden, rekent met ./lib/match.js en toont de top 3. Niets verlaat de browser.
import { score, compleet, VRAGEN } from './lib/match.js';
import { PLATFORMS, BEST_FOR } from './lib/platforms.js';
import { score as checklist, fmtScore } from './lib/checklist.js';
import { knop } from './lib/partnerlinks.js';
import { logoImg } from './lib/logos.js';

const BASE = document.body.dataset.base || '';
const form = document.getElementById('form');
const out = document.getElementById('result');
const prog = document.getElementById('q-prog');
const bar = document.getElementById('q-bar');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n) => (n === 0 ? '€ 0' : '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }));
const WACHT = out.innerHTML;

// Eerste 'let op' van het platform, tenzij die over een pakket gaat dat niet bij je aantal producten hoort.
const letOp = (id, a) => (id === 'jouwweb' && !['0', '10'].includes(a.producten) ? PLATFORMS[id].min[1] : PLATFORMS[id].min[0]);

function antwoorden() {
  const fd = new FormData(form); const a = {};
  for (const v of VRAGEN) if (fd.get(v.id)) a[v.id] = fd.get(v.id);
  return a;
}
const prijsTekst = (r, a) => (r.id === 'woocommerce' ? '€ 0 + hosting' : `${fmt(r.prijs)} p/m`) + (a.doel === 'site' ? '' : '');

function toon(a, scroll) {
  const top = score(a).slice(0, 3);
  const [b] = top; const pb = PLATFORMS[b.id];
  const logo = (id, maat) => logoImg(id, { maat, base: BASE });
  out.innerHTML = `<h2>Jouw beste match</h2><div class="mbest">${logo(b.id, 'md')}<p class="big">${esc(pb.naam)}</p></div><p class="pc-price"><strong>${prijsTekst(b, a)}</strong> ${a.doel === 'site' ? 'Instappakket' : 'Goedkoopste pakket dat bij je aantal producten past'}, zoals ${esc(pb.naam.split(' ')[0])} het toont</p>`
    + `<div class="match-cta">${knop(b.id, 'match_1')}<a class="vlink" href="${BASE}/platformen/${pb.slug}/">Lees alles over ${esc(pb.naam)} →</a></div>`
    + `<h3>Top 3</h3><ol class="mtop">${top.map((r, i) => {
      const p = PLATFORMS[r.id]; const c = checklist(r.id);
      return `<li${i === 0 ? ' class="first"' : ''}>${i === 0 ? '<span class="badge">Beste match</span> ' : ''}<span class="tag best">${esc(BEST_FOR[r.id])}</span><div class="mhead">${logo(r.id, 'sm')}<h3>${i + 1}. ${esc(p.naam)}</h3></div><p class="pc-price">${prijsTekst(r, a)} · checklist-score ${fmtScore(c.totaal)}/${c.max}</p>`
        + (r.waarom.length ? `<p class="lbl ok" style="margin:8px 0 0">Waarom het past</p><ul class="why">${r.waarom.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : '')
        + `<p class="lbl warn" style="margin:8px 0 0">Let op</p><ul class="why"><li>${esc(letOp(r.id, a))}</li></ul>`
        + (i > 0 ? `<div class="mini-cta">${knop(r.id, 'match_' + (i + 1), 'btn ghost sm')}<a href="${BASE}/platformen/${p.slug}/">Alles over ${esc(p.naam.split(' ')[0])}</a></div>` : '') + '</li>';
    }).join('')}</ol>`
    + `<div class="match-next"><a class="btn ghost" href="${BASE}/vergelijken/?ids=${top.map((r) => r.id).join(',')}">Vergelijk deze 3 naast elkaar</a></div>`
    + `<p class="mlinks"><button type="button" class="linkbtn" id="m-reset">Opnieuw beginnen</button><button type="button" class="linkbtn" id="m-share">Deel of bewaar: kopieer de link</button></p>`
    + `<p class="sub">Volgorde: wat past, dan je budget, dan de prijs. Partnerlinks tellen niet mee.</p>`;
  const q = new URLSearchParams(a).toString();
  history.replaceState(null, '', `${location.pathname}?${q}`);
  document.getElementById('m-reset').addEventListener('click', () => { form.reset(); history.replaceState(null, '', location.pathname); update(); out.innerHTML = WACHT; form.querySelector('input').focus(); });
  document.getElementById('m-share').addEventListener('click', async (e) => { try { await navigator.clipboard.writeText(location.href); e.target.textContent = 'Link gekopieerd'; } catch { e.target.textContent = location.href; } });
  if (scroll && matchMedia('(max-width: 899px)').matches) out.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

function update() {
  const a = antwoorden(); const n = Object.keys(a).length;
  prog.textContent = `${n} van ${VRAGEN.length} vragen beantwoord`;
  bar.style.width = `${(n / VRAGEN.length) * 100}%`;
  return a;
}

// Antwoorden uit de link (homepage of gedeelde link) terugzetten.
const params = new URLSearchParams(location.search);
for (const v of VRAGEN) { const val = params.get(v.id); const el = val && form.querySelector(`input[name="${v.id}"][value="${CSS.escape(val)}"]`); if (el) el.checked = true; }
const start = update();
if (compleet(start)) toon(start, false);

form.addEventListener('change', () => { const a = update(); if (compleet(a)) toon(a, false); });
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const a = update();
  if (!compleet(a)) {
    const open = VRAGEN.find((v) => !a[v.id]);
    const el = form.querySelector(`input[name="${open.id}"]`);
    if (el) el.focus();
    out.innerHTML = `<h2>Jouw beste match</h2><p class="alert">Beantwoord nog: ${esc(open.vraag)}</p>`;
    return;
  }
  toon(a, true);
});
