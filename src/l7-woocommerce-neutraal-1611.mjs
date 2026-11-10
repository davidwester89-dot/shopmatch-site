// L7 WooCommerce-neutralisatie (pushdatum 2026-11-16, zelfde dag als Hostinger-v2).
// Alleen pagina's met een eigen bodywijziging (CTA → gewone bronlink). Hubs niet tillen
// tenzij ze zelf een gewijzigde WooCommerce-knop tonen. datePublished van bestaande stukken blijft.
export const WN_UPD = '2026-11-16';
export const WN_PADEN = new Set([
  '/platformen/woocommerce/',
  '/vergelijken/shopify-vs-woocommerce/',
  '/blog/b2b-webshop-beginnen/',
  // Al 16-11 door Hostinger-v2; wél een extra eigen bodywijziging (Woo-knop).
  '/beste-webshop-platform/',
  '/platformen/',
]);
const NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${NL[m - 1]} ${y}`; };
export function wnDatum(p) {
  if (!WN_PADEN.has(p.path)) return p;
  const q = { ...p, lastmod: WN_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: WN_UPD };
  if (q.article) q.article = { ...q.article, updated: WN_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: WN_UPD } : x));
  q.body = q.body.replace(/bijgewerkt op <time datetime="\d{4}-\d{2}-\d{2}">[^<]*<\/time>/, `bijgewerkt op <time datetime="${WN_UPD}">${fmt(WN_UPD)}</time>`);
  return q;
}
