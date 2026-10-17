import { SITE, esc, ORG, fmtDate } from './layout.mjs';
import { PLATFORMS, CHECKED } from './lib/platforms.js';
export const P = PLATFORMS;
export const DATE = '2026-10-17';
export const by = (d = DATE) => `<p class="src">Door ${SITE.owner} · ${fmtDate(d)}</p>`;
export const bron = (...lists) => {
  const all = lists.flat();
  const seen = new Set();
  const uniq = all.filter(([, u]) => (seen.has(u) ? false : seen.add(u)));
  return `<p class="src">Bronnen: ${uniq.map(([t, u]) => `<a href="${u}" rel="noopener">${esc(t)}</a>`).join(' · ')}</p>`;
};
export const matchCta = (t = 'Twijfel je nog?') => `<div class="cta"><h2 class="h3">${t}</h2><p>Vijf vragen over je plannen, budget en ervaring. Je krijgt de drie platforms die het best passen, met prijs.</p><a class="btn" href="/shop-match/" data-cta="match">Doe de ShopMatch</a></div>`;
export const article = ({ path, title, h1, description, og, parents, date = DATE, faq, schemaType = 'Article' }) => ({
  path, title, h1, crumb: h1, description, og, parents, ogType: 'article', lastmod: date,
  article: { date, updated: date }, stamp: { checked: CHECKED },
  schema: [
    { '@context': 'https://schema.org', '@type': schemaType, headline: h1, description, mainEntityOfPage: SITE.domain + path, image: `${SITE.domain}/og/${og}.png`, datePublished: date, dateModified: date, author: ORG, publisher: ORG, inLanguage: 'nl' },
    ...(faq ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) }] : []),
  ],
});
export const faqHtml = (faq) => `<h2>Veelgestelde vragen</h2>${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${a}</p>`).join('')}`;
export const plansTable = (p) => `<div class="tbl"><table><thead><tr><th>Pakket</th><th>Prijs per maand</th><th>Wat je krijgt</th></tr></thead><tbody>${p.plannen.map(([n, pr, w]) => `<tr><th scope="row">${esc(n)}</th><td>${esc(pr)}</td><td>${esc(w)}</td></tr>`).join('')}</tbody></table></div>`;
export const card = (id) => { const p = P[id]; return `<a class="card link" href="/platformen/${p.slug}/"><span class="pill">${esc(p.soort)}</span><h3 class="h3">${esc(p.naam)}</h3><p class="meta">${esc(p.kort)}</p><p class="price">${p.vanaf === 0 ? 'Gratis plugin + hosting' : `Vanaf ${esc(p.vanafTekst.replace(/ per maand.*/, ''))} per maand`}</p></a>`; };
