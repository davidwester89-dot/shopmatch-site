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
export const DS_PADEN = new Set(['/', '/blog/', '/blog/dropshipping-webshop-maken/']);
export const revisieDatum = (pad, vorige) => DS_PADEN.has(pad) ? '2026-11-20' : STIJL_PADEN.has(pad) ? '2026-11-20' : vorige;
