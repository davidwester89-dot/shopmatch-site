// L7 externe feedback nov (pushdatum 2026-11-03): partner-FAQ op / en 'Niet vermeld'-uitleg op /vergelijken/, /over/ en de
// platformpagina's (+ hub /platformen/). Apart bestand en één regel in build.mjs, zodat het niet botst met de lopende
// Mijndomein/maandprijs-keten in pages.mjs; staat die keten live, dan blijft deze datum (later) de juiste.
export const EF_UPD = '2026-11-03';
export const EF_PADEN = new Set(['/', '/over/', '/vergelijken/', '/platformen/', '/platformen/shopify/', '/platformen/wix/', '/platformen/jouwweb/', '/platformen/lightspeed/', '/platformen/hostinger/', '/platformen/mijndomein/', '/platformen/woocommerce/']);
const NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${NL[m - 1]} ${y}`; };
/** Zet lastmod, zichtbare bijgewerkt-datum (stamp of trustbar op /) en dateModified op EF_UPD voor de pagina's in EF_PADEN. */
export function efDatum(p) {
  if (!EF_PADEN.has(p.path)) return p;
  const q = { ...p, lastmod: EF_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: EF_UPD };
  if (q.article) q.article = { ...q.article, updated: EF_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: EF_UPD } : x));
  if (q.path === '/') q.body = q.body.replace(/bijgewerkt op <time datetime="\d{4}-\d{2}-\d{2}">[^<]*<\/time>/, `bijgewerkt op <time datetime="${EF_UPD}">${fmt(EF_UPD)}</time>`);
  return q;
}
