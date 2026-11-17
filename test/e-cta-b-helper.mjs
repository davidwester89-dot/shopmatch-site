// E-CTA-1 B (17-11): tekstlinks naar betaalde partners in de lopende tekst (src/b-tekstlink.mjs).
// Eén bron voor de unwrap: dezelfde regel als scripts/l7.config.mjs (stripCta). Alleen <a> met data-ecta="B" + data-pos="mid".
import { CFG } from '../scripts/l7.config.mjs';

const regel = CFG.stripCta.find((r) => Array.isArray(r));
if (!regel) throw new Error('l7.config: geen B-unwrapregel in stripCta');
export const B_RE = regel[0];
export const B_LABEL = ' (partnerlink)';
export const REL_B = 'sponsored nofollow noopener';
/** html met elke B-link vervangen door alleen de merknaam (label en linkmarkup weg). Alle andere tekst blijft. */
export const zonderB = (html) => html.replace(new RegExp(B_RE.source, B_RE.flags), regel[1]);
/** Alle B-links met hun attributen. */
export const bLinks = (html) => [...html.matchAll(/<a\b[^>]*\sdata-ecta="B"[^>]*>[\s\S]*?<\/a>/g)].map((m) => {
  const at = (n) => (m[0].match(new RegExp(`\\s${n}="([^"]*)"`)) || [])[1];
  return { index: m.index, html: m[0], href: at('href'), rel: at('rel'), vendor: at('data-vendor'), pos: at('data-pos'), cta: at('data-cta'), tekst: m[0].replace(/<[^>]+>/g, '') };
});
