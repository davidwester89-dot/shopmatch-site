// Shopify-verdieping 12-11-2026 (SEO wk46: Shopify Plus, rekenvoorbeeld eerste jaar, tarieven per transactie, POS-link):
// bodywijziging alleen op /platformen/shopify/ (content/platformen/shopify.md).
// Hub /platformen/ niet: de body daar wijzigt niet, dus lastmod blijft 2026-11-04 (spDatum). Een kinddatum tilt de hub niet.
// Komt ná spDatum (4-11), zodat de Shopify-pagina de pushdatum 12-11 draagt.
export const SD_UPD = '2026-11-12';
export const SD_PADEN = new Set(['/platformen/shopify/']);
/** Zet lastmod, zichtbare bijgewerkt-datum en dateModified op SD_UPD voor de pagina's in SD_PADEN. */
export function sdDatum(p) {
  if (!SD_PADEN.has(p.path)) return p;
  const q = { ...p, lastmod: SD_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: SD_UPD };
  if (q.article) q.article = { ...q.article, updated: SD_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: SD_UPD } : x));
  return q;
}
