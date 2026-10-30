// Logo's van de aanbieders (officiële logo's van hun eigen site; zie src/assets/logos/BRONNEN.md).
// Neutraal: elk merk krijgt exact hetzelfde vak (zelfde breedte en hoogte, object-fit: contain), geen merk groter of eerder.
// Ook in de browser gebruikt (quiz.js), daarom zonder Node-imports.
import { PLATFORMS } from './platforms.js';

/** Vaste vakmaten per formaat; width/height staan altijd in de HTML (geen layoutverschuiving). */
export const LOGO_MATEN = { sm: [100, 30], md: [120, 36], lg: [160, 48] };

/** <img> met het logo van een platform. alt = merknaam. Standaard lazy; eager alleen boven de vouw. */
export function logoImg(id, { maat = 'md', eager = false, base = '', cls = '' } = {}) {
  const p = PLATFORMS[id];
  if (!p) throw new Error('Onbekend platform ' + id);
  const [w, h] = LOGO_MATEN[maat];
  const merk = p.naam.split(' ')[0];
  return `<img class="plogo plogo-${maat}${cls ? ' ' + cls : ''}" src="${base}/logos/${id}.svg" alt="${merk} logo" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
