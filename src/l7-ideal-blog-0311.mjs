// L7 iDEAL-blog (pushdatum 2026-11-03): nieuwe post /blog/webshop-maken-met-ideal/ en de lijst op /blog/ (hub, nieuwste kind).
// Het blok 'Meer op de blog' onder de andere posts telt niet als bodywijziging (stripBlocks in scripts/l7.config.mjs): die posts houden hun datum.
// Alleen voor de tests (de datums zelf komen uit content/blog/*.md); de 2-11-tests slaan deze pagina's over.
export const IDEAL_UPD = '2026-11-03';
export const IDEAL_PADEN = new Set(['/blog/', '/blog/webshop-maken-met-ideal/']);
