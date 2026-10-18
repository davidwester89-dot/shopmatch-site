// Goedgekeurde partnerlinks per platform-id. LEEG zolang er geen goedgekeurd programma is.
// Pas invullen na goedkeuring, bv. jouwweb: 'https://tc.tradetracker.net/?c=...'.
// De match leest dit bestand NOOIT: partnerlinks hebben geen invloed op het advies of de volgorde.
import { PLATFORMS } from './platforms.js';
export const PARTNERLINKS = {
  shopify: 'https://shopify.pxf.io/c/7989613/1061744/13624',
  // TODO: Hostinger (Daisycon campagne 16780, media ShopMatch 438840) staat nog op 'in afwachting'. Zolang dat zo is, stuurt
  // jf79.net door naar een andere adverteerder; daarom tijdelijk geen partnerlink en gaat de knop gewoon naar hostinger.com/nl
  // (url in platforms.js). Na goedkeuring de Daisycon-deeplink terugzetten:
  // hostinger: 'https://jf79.net/c/?si=16780&li=1754330&wi=438840&ws=shopmatch',
};

/** Uitgaande link: partnerlink (rel sponsored nofollow, met label) als die er is, anders de officiële site. */
export function uitgaand(id, partnerlinks = PARTNERLINKS) {
  const p = PLATFORMS[id];
  if (!p) throw new Error('Onbekend platform ' + id);
  const pl = partnerlinks[id];
  return pl ? { href: pl, rel: 'sponsored nofollow noopener', partner: true, naam: p.naam } : { href: p.url, rel: 'noopener', partner: false, naam: p.naam };
}

/** Knop naar de aanbieder. Partnerlink krijgt altijd het zichtbare label "partnerlink". */
export function knop(id, pos, cls = 'btn', partnerlinks = PARTNERLINKS) {
  const o = uitgaand(id, partnerlinks);
  return `<a class="${cls}" href="${o.href}" rel="${o.rel}" target="_blank" data-vendor="${id}" data-pos="${pos}" data-cta="outbound" data-partner-slot="${id}">Naar ${o.naam}</a>${o.partner ? '<span class="partner">partnerlink</span>' : ''}`;
}
