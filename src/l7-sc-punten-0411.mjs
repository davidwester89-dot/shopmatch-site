// L7 SC-punten 01-11 (pushdatum 2026-11-04): JouwWeb-kolomkop blog, stempels jouwweb/shopify, Lightspeed-titel (alleen head: datum blijft 3-11, regel D), filterregel /vergelijken/ (+ hub /platformen/).
export const SP_UPD = '2026-11-04';
export const SP_PADEN = new Set(['/vergelijken/', '/platformen/', '/platformen/shopify/', '/platformen/jouwweb/']);
const NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${NL[m - 1]} ${y}`; };
/** Zet lastmod, zichtbare bijgewerkt-datum (stamp of trustbar op /) en dateModified op SP_UPD voor de pagina's in SP_PADEN. */
export function spDatum(p) {
  if (!SP_PADEN.has(p.path)) return p;
  const q = { ...p, lastmod: SP_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: SP_UPD };
  if (q.article) q.article = { ...q.article, updated: SP_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: SP_UPD } : x));
  if (q.path === '/') q.body = q.body.replace(/bijgewerkt op <time datetime="\d{4}-\d{2}-\d{2}">[^<]*<\/time>/, `bijgewerkt op <time datetime="${SP_UPD}">${fmt(SP_UPD)}</time>`);
  return q;
}
