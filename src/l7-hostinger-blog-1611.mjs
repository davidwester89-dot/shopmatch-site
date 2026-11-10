// L7 Hostinger-blog + F2-prijsherstel (pushdatum 2026-11-16, wk47: na SM A 12-11 en B 13-11).
// Nieuwe post /blog/hostinger-website-webshop-kosten/ verschijnt in de bloglijst op de homepage (bodywijziging /)
// en op de blogindex (bodywijziging /blog/). Post en /blog/ krijgen hun datum uit content/blog/*.md (updated 2026-11-16).
// Pagina's waarvan de Hostinger-prijstekst wijzigt (eigen bodywijziging) krijgen ook 16-11, inclusief hub /platformen/
// (niet getild door een kind, wel omdat de Hostinger-kaart zelf wijzigt). /platformen/shopify/ gaat naar 16-11
// door de zichtbare ALT_ZIN-bodywijziging (geen “laagste instapprijs” meer); datePublished blijft 17-10.
export const HB_UPD = '2026-11-16';
export const HB_PADEN = new Set([
  '/',
  '/platformen/',
  '/platformen/hostinger/',
  '/platformen/shopify/',
  '/vergelijken/',
  '/beste-webshop-platform/',
  '/gratis-website-maken/',
  '/website-maken-zzp/',
  '/webshop-beginnen-kosten/',
  '/shop-match/',
]);
const NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${NL[m - 1]} ${y}`; };
/** Zet lastmod, zichtbare bijgewerkt-datum en dateModified op HB_UPD voor de pagina's in HB_PADEN. */
export function hbDatum(p) {
  if (!HB_PADEN.has(p.path)) return p;
  const q = { ...p, lastmod: HB_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: HB_UPD };
  if (q.article) q.article = { ...q.article, updated: HB_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: HB_UPD } : x));
  q.body = q.body.replace(/bijgewerkt op <time datetime="\d{4}-\d{2}-\d{2}">[^<]*<\/time>/, `bijgewerkt op <time datetime="${HB_UPD}">${fmt(HB_UPD)}</time>`);
  return q;
}
