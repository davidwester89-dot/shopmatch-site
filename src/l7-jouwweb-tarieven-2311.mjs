// L7 JouwWeb-tarieven (pushdatum 2026-11-25, wk47). /platformen/jouwweb/ kreeg een eigen bodywijziging: tarieventabel
// jaar- vs maandbetaling en H2 'Bijkomende kosten'. Title en meta ongewijzigd. Geen andere pagina wijzigt: de hub /platformen/
// en de vergelijkingspagina's tonen dezelfde pcard/prijzen als bij de parent, dus niet tillen.
export const JW_UPD = '2026-11-25';
export const JW_PADEN = new Set(['/platformen/jouwweb/']);
const NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const fmt = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${dd} ${NL[m - 1]} ${y}`; };
/** Zet lastmod, zichtbare bijgewerkt-datum en dateModified op JW_UPD voor /platformen/jouwweb/. */
export function jwDatum(p) {
  if (!JW_PADEN.has(p.path)) return p;
  const q = { ...p, lastmod: JW_UPD };
  if (q.stamp) q.stamp = { ...q.stamp, updated: JW_UPD };
  if (q.article) q.article = { ...q.article, updated: JW_UPD };
  if (q.schema) q.schema = q.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: JW_UPD } : x));
  q.body = q.body.replace(/bijgewerkt op <time datetime="\d{4}-\d{2}-\d{2}">[^<]*<\/time>/, `bijgewerkt op <time datetime="${JW_UPD}">${fmt(JW_UPD)}</time>`);
  return q;
}
