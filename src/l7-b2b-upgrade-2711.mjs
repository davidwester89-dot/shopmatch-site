// L7 B2B-upgrade (pushdatum 2026-11-27, SEO wk48: 'b2b webshop starten' / 'beste b2b webshop'). /blog/b2b-webshop-beginnen/
// kreeg een eigen bodywijziging: tabel B2B-functies per platform (vendorpagina's Shopify, JouwWeb, Lightspeed, WooCommerce),
// H2 'B2B-webshop bouwen in 5 stappen', FAQ over B2B-software voor een kleine zaak en extra bronnen. Title en meta ongewijzigd.
// Frontmatter `updated` blijft 2026-11-24: de hub /blog/ heeft geen eigen bodywijziging (kaarten tonen datePublished) en tilt niet.
export const B2B_UPD = '2026-11-27';
export const B2B_PADEN = new Set(['/blog/b2b-webshop-beginnen/']);
const NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${NL[m - 1]} ${y}`; };
/** Zet lastmod, zichtbare bijgewerkt-datum en dateModified op B2B_UPD voor /blog/b2b-webshop-beginnen/. */
export function b2bDatum(p) {
  if (!B2B_PADEN.has(p.path)) return p;
  const q = { ...p, lastmod: B2B_UPD, updated: B2B_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: B2B_UPD };
  if (q.article) q.article = { ...q.article, updated: B2B_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: B2B_UPD } : x));
  q.body = q.body.replace(/bijgewerkt op <time datetime="\d{4}-\d{2}-\d{2}">[^<]*<\/time>/, `bijgewerkt op <time datetime="${B2B_UPD}">${fmt(B2B_UPD)}</time>`);
  return q;
}
