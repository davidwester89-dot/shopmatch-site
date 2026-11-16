// Onafhankelijke verwachting voor de stijlrelease van 20 november 2026.
export const STIJL_PADEN = new Set([
  "/blog/hostinger-website-webshop-kosten/",
  "/blog/b2b-webshop-beginnen/",
  "/blog/herroepingsknop-webshop/",
  "/blog/shopify-wix-jouwweb-kleine-webshop/",
  "/blog/webshop-maken-met-ideal/",
  "/platformen/shopify/"
]);
// 20-11 (wk47 dropshipping-blog): nieuwe post + bloglijst op / en /blog/ (eigen bodywijziging); latere datum wint.
// Alleen verwachten als de post in de build zit (BUILD_DATE/PUSH_DATE of Amsterdam-vandaag ≥ 20-11).
export const DS_PADEN = new Set(['/', '/blog/', '/blog/dropshipping-webshop-maken/']);
const amsterdamToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date());
export const buildDag = () => process.env.BUILD_DATE || process.env.PUSH_DATE || amsterdamToday();
export const revisieDatum = (pad, vorige) => (DS_PADEN.has(pad) && buildDag() >= '2026-11-20') ? '2026-11-20' : STIJL_PADEN.has(pad) ? '2026-11-20' : vorige;
