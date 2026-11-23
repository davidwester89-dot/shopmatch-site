// L7 AI-webshopblog (pushdatum 2026-12-01, wk48). Nieuwe post /blog/webshop-maken-met-ai/ (datum uit content/blog,
// date/updated 2026-12-01) verschijnt in de bloglijst op de homepage (bodywijziging /) en op de blogindex (bodywijziging /blog/,
// datum = nieuwste post). Alleen '/' moet hier expliciet naar 01-12; geen andere pagina heeft een eigen bodywijziging.
export const AI_UPD = '2026-12-01';
export const AI_PADEN = new Set(['/']);
const NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${NL[m - 1]} ${y}`; };
/** Zet lastmod, zichtbare bijgewerkt-datum en dateModified op AI_UPD voor de pagina's in AI_PADEN. */
const amsterdamToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date());
export function aiDatum(p, today = process.env.BUILD_DATE || amsterdamToday()) {
  // Alleen als de post in deze build zit (posts met een datum in de toekomst worden overgeslagen).
  if (!AI_PADEN.has(p.path) || today < AI_UPD) return p;
  const q = { ...p, lastmod: AI_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: AI_UPD };
  if (q.article) q.article = { ...q.article, updated: AI_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: AI_UPD } : x));
  q.body = q.body.replace(/bijgewerkt op <time datetime="\d{4}-\d{2}-\d{2}">[^<]*<\/time>/, `bijgewerkt op <time datetime="${AI_UPD}">${fmt(AI_UPD)}</time>`);
  return q;
}
