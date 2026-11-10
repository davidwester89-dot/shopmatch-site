// Onafhankelijke verwachting voor de stijlrelease van 13 november 2026.
export const STIJL_PADEN = new Set([
  "/blog/",
  "/blog/b2b-webshop-beginnen/",
  "/blog/herroepingsknop-webshop/",
  "/blog/shopify-wix-jouwweb-kleine-webshop/",
  "/blog/webshop-maken-met-ideal/",
  "/platformen/",
  "/platformen/shopify/"
]);
export const revisieDatum = (pad, vorige) => STIJL_PADEN.has(pad) ? '2026-11-13' : vorige;
