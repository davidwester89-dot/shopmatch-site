// L7 dropshipping-blog (pushdatum 2026-11-24, wk47). Nieuwe post /blog/dropshipping-webshop-maken/ (datum uit content/blog,
// date/updated 2026-11-24) verschijnt in de bloglijst op de homepage (bodywijziging /) en op de blogindex (bodywijziging /blog/,
// datum = nieuwste post). Alleen '/' moet hier expliciet naar 24-11; geen andere pagina heeft een eigen bodywijziging.
export const DS_UPD = '2026-11-24';
export const DS_PADEN = new Set(['/']);
const NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${NL[m - 1]} ${y}`; };
/** Zet lastmod, zichtbare bijgewerkt-datum en dateModified op DS_UPD voor de pagina's in DS_PADEN. */
const amsterdamToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date());
export function dsDatum(p, today = process.env.BUILD_DATE || amsterdamToday()) {
  // Alleen als de post in deze build zit (posts met een datum in de toekomst worden overgeslagen).
  if (!DS_PADEN.has(p.path) || today < DS_UPD) return p;
  const q = { ...p, lastmod: DS_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: DS_UPD };
  if (q.article) q.article = { ...q.article, updated: DS_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: DS_UPD } : x));
  q.body = q.body.replace(/bijgewerkt op <time datetime="\d{4}-\d{2}-\d{2}">[^<]*<\/time>/, `bijgewerkt op <time datetime="${DS_UPD}">${fmt(DS_UPD)}</time>`);
  return q;
}
