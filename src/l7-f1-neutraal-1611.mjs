// L7 F1-neutralisatie (pushdatum 2026-11-16, zelfde dag als Hostinger-v2 en WooCommerce-neutraal).
// Alleen pagina's met een eigen bodywijziging (onbetaalde CTA → gewone bronlink). Hubs niet tillen
// tenzij ze zelf een gewijzigde knop tonen. datePublished van bestaande stukken blijft.
export const F1_UPD = '2026-11-16';
export const F1_PADEN = new Set([
  '/platformen/jouwweb/',
  '/platformen/lightspeed/',
  '/platformen/mijndomein/',
  '/blog/shopify-wix-jouwweb-kleine-webshop/',
  '/vergelijken/shopify-vs-lightspeed/',
  '/vergelijken/wix-vs-jouwweb/',
  // Al 16-11 door Hostinger-v2 en/of WooCommerce-neutraal; wél een extra eigen bodywijziging (F1-knop).
  '/beste-webshop-platform/',
  '/platformen/',
  '/gratis-website-maken/',
  '/website-maken-zzp/',
  '/blog/b2b-webshop-beginnen/',
]);
const NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${NL[m - 1]} ${y}`; };
export function f1Datum(p) {
  if (!F1_PADEN.has(p.path)) return p;
  const q = { ...p, lastmod: F1_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: F1_UPD };
  if (q.article) q.article = { ...q.article, updated: F1_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: F1_UPD } : x));
  q.body = q.body.replace(/bijgewerkt op <time datetime="\d{4}-\d{2}-\d{2}">[^<]*<\/time>/, `bijgewerkt op <time datetime="${F1_UPD}">${fmt(F1_UPD)}</time>`);
  return q;
}
