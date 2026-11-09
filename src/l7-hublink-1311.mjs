// Contextuele hub-link 13-11-2026: één tekstlink in de homepage-<main> naar /platformen/.
// Alleen de home-body wijzigt, dus alleen `/` krijgt de pushdatum. /platformen/ blijft 2026-11-04 (spDatum):
// de body daar wijzigt niet, en een hub lift niet mee op een kind of op een link vanaf de home.
// Komt ná sdDatum, zodat de trustbar op / (efDatum zette die op 3-11) de pushdatum 13-11 draagt.
export const HL_UPD = '2026-11-13';
export const HL_PADEN = new Set(['/']);
const NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${NL[m - 1]} ${y}`; };
/** Zet lastmod, zichtbare bijgewerkt-datum (stamp of trustbar op /) en dateModified op HL_UPD voor de pagina's in HL_PADEN. */
export function hlDatum(p) {
  if (!HL_PADEN.has(p.path)) return p;
  const q = { ...p, lastmod: HL_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: HL_UPD };
  if (q.article) q.article = { ...q.article, updated: HL_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: HL_UPD } : x));
  if (q.path === '/') q.body = q.body.replace(/bijgewerkt op <time datetime="\d{4}-\d{2}-\d{2}">[^<]*<\/time>/, `bijgewerkt op <time datetime="${HL_UPD}">${fmt(HL_UPD)}</time>`);
  return q;
}
