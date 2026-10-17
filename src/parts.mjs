import { SITE, esc, ORG, fmtDate } from './layout.mjs';
import { PLATFORMS, CHECKED, FEATURES, BEST_FOR, VERKOOP_VANAF, VERKOOP_PAKKET, MAX_PRODUCTEN } from './lib/platforms.js';
import { GROEPEN, PUNTEN, IDS_PUNTEN, score, fmtScore, waardeTekst } from './lib/checklist.js';
import { knop } from './lib/partnerlinks.js';
import { logoImg } from './lib/logos.js';
export { logoImg };
export const P = PLATFORMS;
export const DATE = '2026-10-17';
export const by = (d = DATE) => `<p class="src">Door de ${SITE.owner} · ${fmtDate(d)}</p>`;
export const bron = (...lists) => {
  const all = lists.flat();
  const seen = new Set();
  const uniq = all.filter(([, u]) => (seen.has(u) ? false : seen.add(u)));
  return `<p class="src">Bronnen: ${uniq.map(([t, u]) => `<a href="${u}" rel="noopener">${esc(t)}</a>`).join(' · ')}</p>`;
};
/** Bronnen van de checklist van één of meer platforms (unieke URL's, met naam van het platform). */
export const featureBronnen = (...ids) => ids.flatMap((id) => [...new Set(Object.values(FEATURES[id]).map((f) => f.s).filter(Boolean))].map((u) => [`${P[id].naam.split(' ')[0]}: ${new URL(u).hostname.replace(/^www\./, '')}${new URL(u).pathname.replace(/\/$/, '')}`, u]));
export const matchCta = (t = 'Twijfel je nog?') => `<div class="cta"><h2>${t}</h2><p>Vijf vragen over je plannen, aantal producten, budget en ervaring. Je krijgt de drie platforms die het best passen, met prijs.</p><a class="btn" href="/shop-match/" data-cta="match">Start de match</a></div>`;
export const article = ({ path, title, h1, description, og, parents, date = DATE, faq, schemaType = 'Article' }) => ({
  path, title, h1, crumb: h1, description, og, parents, ogType: 'article', lastmod: date,
  article: { date, updated: date }, stamp: { checked: CHECKED },
  schema: [
    { '@context': 'https://schema.org', '@type': schemaType, headline: h1, description, mainEntityOfPage: SITE.domain + path, image: `${SITE.domain}/og/${og}.png`, datePublished: date, dateModified: date, author: ORG, publisher: ORG, inLanguage: 'nl' },
    ...(faq ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) }] : []),
  ],
});
export const faqHtml = (faq) => `<h2>Veelgestelde vragen</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join('')}`;

// ---- Prijzen ----
export const eur = (n) => (n === 0 ? '€ 0' : '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }));
export const verkoopTekst = (id) => (id === 'woocommerce' ? '€ 0 + hosting' : `${eur(VERKOOP_VANAF[id])} p/m`);
export const maxProdTekst = (id) => { const m = MAX_PRODUCTEN[id]; return m === Infinity ? 'Onbeperkt' : m == null ? 'Niet vermeld' : `Tot ${m.toLocaleString('nl-NL')}`; };
export const plansTable = (p) => `<ul class="pkg-grid">${p.plannen.map(([n, pr, w]) => {
  const main = pr.split(/ \(| · /)[0];
  const extra = pr.slice(main.length).replace(/^\s*[·(]\s*/, '').replace(/[()]/g, '');
  return `<li><div class="pkg-card"><h3>${esc(n)}</h3><p class="pkg-price"><strong>${esc(main)}</strong>${/^€ [\d.,]+$/.test(main) ? ' <span>per maand</span>' : ''}</p>${extra ? `<p class="pkg-year">${esc(extra)}</p>` : ''}<p class="pkg-facts">${esc(w)}</p></div></li>`;
}).join('')}</ul>`;

// ---- Checklist-weergave ----
const VCLS = { ja: 'ja', deels: 'deels', nee: 'nee' };
export const fv = (f, note = true) => `<span class="fv ${VCLS[f?.v] || 'nv'}">${waardeTekst(f?.v)}</span>${note && f?.t ? `<span class="fnote">${esc(f.t)}</span>` : ''}`;
export const scoreBadge = (id) => { const s = score(id); return `<span class="sc" aria-label="Checklist-score ${fmtScore(s.totaal)} van ${s.max}">${fmtScore(s.totaal)}<small>/${s.max}</small></span>`; };
export const bars = (id) => `<ul class="bars">${score(id).groepen.map((g) => `<li><span>${esc(g.naam)}</span><i><b style="width:${Math.round((g.score / g.max) * 100)}%"></b></i><span>${fmtScore(g.score)}/${g.max}</span></li>`).join('')}</ul>`;
export const scoreBlock = (id) => `<div class="pc-score"><span class="sc-lbl">Checklist-score</span>${scoreBadge(id)}${bars(id)}<p class="src" style="margin:8px 0 0"><a href="/over/#methode">Zo tellen we</a></p></div>`;
/** Tabel met alle 10 punten voor één platform. */
export const checklistTable = (id) => `<div class="table-wrap"><table class="data side"><thead><tr><th scope="col">Checklistpunt</th><th scope="col"><span class="thlogo">${logoImg(id, { maat: 'sm' })}</span></th></tr></thead><tbody>${GROEPEN.map((g) => `<tr><th colspan="2" scope="colgroup" style="background:var(--sand)">${esc(g.naam)}</th></tr>${g.punten.map((k) => `<tr><th scope="row">${esc(PUNTEN[k].lang)}</th><td>${fv(FEATURES[id][k])}${FEATURES[id][k].s ? ` <a class="src" href="${FEATURES[id][k].s}" rel="noopener">bron</a>` : ''}</td></tr>`).join('')}`).join('')}</tbody></table></div>`;

// ---- Platformkaart (overzicht, home) ----
export function pcard(id, { rank, level = 'h2', pos = 'lijst' } = {}) {
  const p = P[id]; const f = FEATURES[id];
  const facts = [['Verkopen vanaf', `<strong>${verkoopTekst(id)}</strong><span class="fnote">${esc(VERKOOP_PAKKET[id])}</span>`], ['Producten', maxProdTekst(id)], ['iDEAL', fv(f.ideal, false)], ['Kassa', fv(f.pos, false)], ['B2B', fv(f.b2b, false)]];
  return `<li class="pcard" data-id="${id}"><div class="pc-head">${rank ? `<span class="pc-rank">${rank}.</span>` : ''}<span class="pc-logo">${logoImg(id, { maat: 'md' })}</span><span><span class="tag best">${esc(BEST_FOR[id])}</span></span><${level}><a href="/platformen/${p.slug}/">${esc(p.naam)}</a></${level}><p class="pc-kort">${esc(p.kort)}</p></div>
<ul class="pc-facts">${facts.map(([k, v]) => `<li><span>${k}</span><span>${v}</span></li>`).join('')}</ul>
${scoreBlock(id)}
<div class="pc-pm"><div><p class="lbl ok">Sterk</p><ul>${p.plus.slice(0, 2).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div><div><p class="lbl warn">Let op</p><ul>${p.min.slice(0, 2).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
<div class="pc-cta">${knop(id, pos, 'btn sm')}<a href="/platformen/${p.slug}/">Alles over ${esc(p.naam.split(' ')[0])} →</a></div></li>`;
}

/** Vergelijkingstabel: rij per platform, kolom per checklistpunt. Data-attributen voor de filters. */
export function matrix(ids) {
  const head = `<tr><th scope="col">Platform</th><th scope="col">Score</th><th scope="col">Verkopen vanaf</th><th scope="col">Producten</th>${IDS_PUNTEN.map((k) => `<th scope="col">${esc(PUNTEN[k].kort)}</th>`).join('')}</tr>`;
  const rows = ids.map((id) => {
    const f = FEATURES[id];
    const data = IDS_PUNTEN.map((k) => `data-${k}="${f[k].v || 'nv'}"`).join(' ');
    const max = MAX_PRODUCTEN[id];
    return `<tr data-id="${id}" data-prijs="${VERKOOP_VANAF[id]}" data-max="${max === Infinity ? 'inf' : max ?? 'nv'}" data-score="${score(id).totaal}" ${data}><th scope="row"><span class="rowlogo">${logoImg(id, { maat: 'sm' })}</span><a href="/platformen/${P[id].slug}/">${esc(P[id].naam)}</a><span class="fnote">${esc(BEST_FOR[id])}</span></th><td data-l="Checklist-score">${scoreBadge(id)}</td><td class="n" data-l="Verkopen vanaf"><strong>${verkoopTekst(id)}</strong><span class="fnote">${esc(VERKOOP_PAKKET[id])}</span></td><td data-l="Producten">${maxProdTekst(id)}</td>${IDS_PUNTEN.map((k) => `<td data-l="${esc(PUNTEN[k].lang)}">${fv(f[k])}</td>`).join('')}</tr>`;
  }).join('');
  return `<p class="scrollhint mx">Veeg opzij voor alle kolommen →</p><div class="table-wrap"><table class="data matrix stack" id="matrix"><caption class="sr-only">Alle platforms naast elkaar: score, prijs en checklist</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
}

export const methodBox = (h = 'h2') => `<section class="method" id="methode"><${h}>Zo vergelijken we</${h}><ol><li><strong>Prijs van de aanbieder zelf.</strong> Elk bedrag komt van de prijspagina van de aanbieder, zoals die het toont, met link naar de bron. Of btw inbegrepen is, staat per platform voor zover de aanbieder het vermeldt.</li><li><strong>Vaste checklist van 10 punten.</strong> Per punt: ja = 1, deels = 0,5, nee of niet vermeld = 0. De score is een telling van wat de aanbieder zelf noemt, geen oordeel of review. Prijs telt apart.</li><li><strong>Partnerlinks veranderen niets.</strong> De volgorde is score, dan prijs. De match kijkt naar wat past, dan je budget, dan de prijs. Commissie telt nooit mee.</li></ol><p class="src">Door de ${SITE.owner} · Prijzen gecontroleerd op ${fmtDate(CHECKED)}</p></section>`;
