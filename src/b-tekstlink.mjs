// E-CTA-1 B: tekstlink in bestaande zinnen. Geen nieuwe copy. Label staat in de
// ankerttekst, zodat stripCta «Merk (partnerlink)» naar «Merk» kan unwrappen.
// Meting: data-vendor (partnerkaart), data-pos=mid, data-cta=outbound.
import { uitgaand, wixTrafcat } from './lib/partnerlinks.js';
import { ECTA } from './e-cta-1.config.mjs';

const POS_B = 'mid';

function slugVan(path) {
  const parts = String(path || '').replace(/\/$/, '').split('/').filter(Boolean);
  return parts.at(-1) || 'home';
}

function hrefMetSubid(href, partner, path, pos = POS_B) {
  const s = partner.subid;
  if (!s || !s.param) return href;
  const u = new URL(href);
  const waarde = String(s.waarde || '')
    .replaceAll('{site}', ECTA.site)
    .replaceAll('{slug}', slugVan(path))
    .replaceAll('{pos}', pos);
  u.searchParams.set(s.param, waarde);
  return u.toString();
}

/** Tekstlink naar een betaalde partner. Anker = bestaande merknaam + ' (partnerlink)'. */
export function bTekstlink(partnerId, path, tekst) {
  const cfg = ECTA.partners[partnerId];
  if (!cfg || !cfg.reflink) throw new Error(`bTekstlink: geen betaalde partner ${partnerId}`);
  const vendor = cfg.vendor || partnerId;
  const trafcat = partnerId === 'wixWsb' ? 'wsb' : partnerId === 'wix' ? 'ecom' : undefined;
  const o = uitgaand(vendor, wixTrafcat(vendor, trafcat));
  if (!o.partner) throw new Error(`bTekstlink: ${partnerId} heeft geen partnerlink`);
  const href = hrefMetSubid(o.href, cfg, path, POS_B);
  const label = tekst || cfg.naam;
  const zicht = /partnerlink/i.test(label) ? label : `${label} (partnerlink)`;
  return `<a href="${href}" rel="${o.rel}" target="_blank" data-ecta="B" data-vendor="${vendor}" data-cta="outbound" data-pos="${POS_B}">${zicht}</a>`;
}

export function vervangTekstlinks(html, path) {
  return html.replace(/\{\{tekstlink:([A-Za-z]+)(?:\|([^}]+))?\}\}/g, (_, id, tekst) => bTekstlink(id, path, tekst || undefined));
}
