// Onafhankelijke verwachting voor de stijlrelease van 24 november 2026.
// /blog/b2b-webshop-beginnen/ uit de stijllijst: eigen bodywijziging 27-11 (wk48-upgrade, B2B_PADEN_TEST hieronder).
export const STIJL_PADEN = new Set([
  "/blog/hostinger-website-webshop-kosten/",
  "/blog/herroepingsknop-webshop/",
  "/blog/shopify-wix-jouwweb-kleine-webshop/",
  "/blog/webshop-maken-met-ideal/",
  "/platformen/shopify/"
]);
// 24-11 (wk47 dropshipping-blog): nieuwe post + bloglijst op / en /blog/ (eigen bodywijziging); latere datum wint.
// Alleen verwachten als de post in de build zit (BUILD_DATE/PUSH_DATE of Amsterdam-vandaag ≥ 24-11).
export const DS_PADEN = new Set(['/', '/blog/', '/blog/dropshipping-webshop-maken/']);
const amsterdamToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date());
export const buildDag = () => process.env.BUILD_DATE || process.env.PUSH_DATE || amsterdamToday();
// 25-11 (wk47 JouwWeb-tarieven): eigen bodywijziging op /platformen/jouwweb/ (src/l7-jouwweb-tarieven-2311.mjs).
// Onvoorwaardelijk, net als jwDatum in de build: de body van die pagina wijzigt ongeacht de bouwdatum.
export const JW_PADEN_TEST = new Set(['/platformen/jouwweb/']);
// 27-11 (wk48 B2B-upgrade): eigen bodywijziging op /blog/b2b-webshop-beginnen/ (src/l7-b2b-upgrade-2711.mjs), onvoorwaardelijk.
export const B2B_PADEN_TEST = new Set(['/blog/b2b-webshop-beginnen/']);
// 01-12 (wk48 webshop-maken-met-ai): nieuwe post + bloglijst op / en /blog/; alleen als de post in de build zit.
export const AI_PADEN = new Set(['/', '/blog/', '/blog/webshop-maken-met-ai/']);
export const revisieDatum = (pad, vorige) => (AI_PADEN.has(pad) && buildDag() >= '2026-12-01') ? '2026-12-01' : B2B_PADEN_TEST.has(pad) ? '2026-11-27' : JW_PADEN_TEST.has(pad) ? '2026-11-25' : (DS_PADEN.has(pad) && buildDag() >= '2026-11-24') ? '2026-11-24' : STIJL_PADEN.has(pad) ? '2026-11-24' : vorige;
