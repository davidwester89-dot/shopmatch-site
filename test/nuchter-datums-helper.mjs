// Onafhankelijke verwachting voor de stijlrelease van 19 november 2026.
export const STIJL_PADEN = new Set([
  "/blog/hostinger-website-webshop-kosten/",
  "/blog/b2b-webshop-beginnen/",
  "/blog/herroepingsknop-webshop/",
  "/blog/shopify-wix-jouwweb-kleine-webshop/",
  "/blog/webshop-maken-met-ideal/",
  "/platformen/shopify/"
]);
// 20-11 (wk47 dropshipping-blog): nieuwe post + bloglijst op / en /blog/ (eigen bodywijziging); latere datum wint.
export const DS_PADEN = new Set(['/', '/blog/', '/blog/dropshipping-webshop-maken/']);
// 23-11 (wk47 JouwWeb-tarieven): eigen bodywijziging op /platformen/jouwweb/ (src/l7-jouwweb-tarieven-2311.mjs).
export const JW_PADEN_TEST = new Set(['/platformen/jouwweb/']);
export const revisieDatum = (pad, vorige) => JW_PADEN_TEST.has(pad) ? '2026-11-23' : DS_PADEN.has(pad) ? '2026-11-20' : STIJL_PADEN.has(pad) ? '2026-11-19' : vorige;
